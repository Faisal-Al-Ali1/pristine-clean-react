const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const axios = require('axios');
const mongoose = require('mongoose');

/**
 * @desc    Process payment for a booking
 * @route   POST /api/payments
 * @access  Private
 */
exports.createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { bookingId, paymentMethod, cardDetails } = req.body;
    const userId = req.user.userId;

    // Validate payment method
    const validMethods = ['credit_card', 'paypal', 'cash'];
    if (!validMethods.includes(paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment method' 
      });
    }

    // Get booking with service populated
    const booking = await Booking.findById(bookingId)
      .populate('service')
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Verify booking ownership
    if (booking.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // Check for existing payment - ALLOW RETRY IF FAILED
    if (booking.payment) {
      const existingPayment = await Payment.findById(booking.payment).session(session);
      
      // Only block if payment was successful
      if (existingPayment && existingPayment.status === 'completed') {
        await session.abortTransaction();
        return res.status(400).json({ 
          success: false, 
          message: 'Booking already has a completed payment' 
        });
      }
      
      // For failed payments, remove the old payment reference
      if (existingPayment && existingPayment.status === 'failed') {
        booking.payment = undefined;
        await booking.save({ session });
        await Payment.deleteOne({ _id: existingPayment._id }).session(session);
      }
    }

    // Create payment record
    const payment = new Payment({
      user: userId,
      booking: bookingId,
      amount: booking.service.basePrice,
      paymentMethod,
      status: paymentMethod === 'cash' ? 'pending' : 'pending'
    });

    // Handle each payment method
    switch (paymentMethod) {
      case 'credit_card':
        if (!cardDetails) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: 'Card details are required for credit card payments'
          });
        }

        // Instant mock success response
        payment.status = 'completed';
        payment.transactionId = `cc_${Date.now()}`;
        payment.paymentDetails = {
          last4: cardDetails.number.slice(-4),
          brand: cardDetails.number.startsWith('4') ? 'visa' : 
                cardDetails.number.startsWith('5') ? 'mastercard' : 'unknown'
        };
        booking.status = 'confirmed';
        break;

      case 'paypal':
        try {
          const paypalResponse = await axios.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            {
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: (booking.service.basePrice / 0.71).toFixed(2) // Convert JOD to USD
                }
              }],
              application_context: {
                return_url: 'http://localhost:8000/api/payments/paypal/success',
                cancel_url: 'http://localhost:8000/api/payments/paypal/cancel',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'Pristine-Clean'
              }
            },
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(
                  `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
                ).toString('base64')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          payment.transactionId = paypalResponse.data.id;
          payment.paymentDetails = paypalResponse.data;
        } catch (error) {
          console.error('PayPal error:', error.response?.data || error.message);
          await session.abortTransaction();
          return res.status(500).json({ 
            success: false, 
            message: 'PayPal payment initiation failed' 
          });
        }
        break;

      case 'cash':

        payment.transactionId = `cash_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        payment.status = 'pending';
        break;
    }

    // Save payment and update booking
    await payment.save({ session });
    booking.payment = payment._id;
    if (paymentMethod === 'credit_card' || paymentMethod === 'paypal') {
      booking.status = 'confirmed';
    }
    await booking.save({ session });

    await session.commitTransaction();

    // Prepare response
    const response = { 
      success: true,
      data: payment 
    };

    if (paymentMethod === 'paypal') {
      response.approvalUrl = payment.paymentDetails.links.find(
        link => link.rel === 'approve'
      ).href;
    }

    res.status(201).json(response);

  } catch (error) {
    await session.abortTransaction();
    console.error('Payment error:', error);

    const status = error.status || 500;
    const message = error.message || 'Payment processing failed';
    
    res.status(status).json({ 
      success: false, 
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Handle PayPal success callback
 * @route   GET /api/payments/paypal/success
 * @access  Public (PayPal redirects here)
 */
exports.paypalSuccess = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token } = req.query;
    
    // Verify and capture payment
    const captureResponse = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { transactionId: token },
      { 
        status: 'completed',
        paymentDetails: captureResponse.data 
      },
      { new: true, session }
    ).populate('booking');

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).send('Payment not found');
    }

    // Update booking status
    payment.booking.status = 'confirmed';
    await payment.booking.save({ session });
    await session.commitTransaction();

    // Redirect to frontend success page with booking ID
    res.redirect(`http://localhost:5173/payment-success?bookingId=${payment.booking._id}`);

  } catch (error) {
    await session.abortTransaction();
    console.error('PayPal capture error:', error.response?.data || error.message);
    res.redirect(`http://localhost:5173/payment-error?message=Payment verification failed`);  } finally {
    session.endSession();
  }
};

/**
 * @desc    Handle PayPal cancellation
 * @route   GET /api/payments/paypal/cancel
 * @access  Public
 */
exports.paypalCancel = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token } = req.query;
    
    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { transactionId: token },
      { status: 'failed' },
      { new: true, session }
    ).populate('booking');

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).redirect(`http://localhost:5173/payment-cancelled?message=Payment not found`);
    }

    // Remove failed payment reference from booking
    payment.booking.payment = undefined;
    await payment.booking.save({ session });
    await session.commitTransaction();

    res.redirect(`http://localhost:5173/payment-cancelled?bookingId=${payment.booking._id}`);

  } catch (error) {
    await session.abortTransaction();
    console.error('PayPal cancel error:', error);
    res.redirect(`http://localhost:5173/payment-error?message=Error processing cancellation`);
    } finally {
    session.endSession();
  }
};

/**
 * @desc    Verify cash payment (Admin only)
 * @route   PUT /api/payments/:id/verify-cash
 * @access  Private/Admin
 */
exports.verifyCashPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .session(session);

    if (!payment || payment.paymentMethod !== 'cash') {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid cash payment' 
      });
    }

    // Update payment and booking status
    payment.status = 'completed';
    payment.booking.status = 'confirmed';
    
    await payment.save({ session });
    await payment.booking.save({ session });
    await session.commitTransaction();

    res.json({ 
      success: true,
      data: payment 
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ 
      success: false, 
      message: 'Cash payment verification failed' 
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Process refund
 * @route   POST /api/payments/:id/refund
 * @access  Private/Admin
 */
exports.processRefund = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .session(session);

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    // Verify payment can be refunded
    if (payment.status !== 'completed') {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Only completed payments can be refunded' 
      });
    }

    // Handle different refund methods
    switch (payment.paymentMethod) {
      case 'paypal':
        try {
          // Get the capture ID from PayPal payment details
          const captureId = payment.paymentDetails.purchase_units[0].payments.captures[0].id;
          
          await axios.post(
            `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
            { 
              amount: { 
                value: (payment.amount / 0.71).toFixed(2), // Convert JOD to USD
                currency_code: 'USD' 
              } 
            },
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(
                  `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
                ).toString('base64')}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (error) {
          console.error('PayPal refund error:', error.response?.data || error.message);
          await session.abortTransaction();
          return res.status(502).json({ 
            success: false, 
            message: 'PayPal refund failed',
            paypalError: error.response?.data || error.message
          });
        }
        break;

      case 'credit_card':
        // In production, you would call your payment processor's API here
        // For mock purposes, we'll just log it
        console.log(`Mock credit card refund processed for payment ${payment._id}`);
        break;

      case 'cash':
        // For cash payments, just mark as refunded in system
        break;

      default:
        await session.abortTransaction();
        return res.status(400).json({ 
          success: false, 
          message: 'Unsupported payment method for refund' 
        });
    }

    // Update payment and booking status
    payment.status = 'refunded';
    payment.booking.status = 'canceled';
    
    await payment.save({ session });
    await payment.booking.save({ session });
    await session.commitTransaction();

    res.json({ 
      success: true,
      message: 'Refund processed successfully',
      data: {
        paymentId: payment._id,
        bookingId: payment.booking._id,
        refundStatus: 'processed'
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Refund processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Refund processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get payment statistics for admin dashboard
 * @route   GET /api/payments/stats
 * @access  Private/Admin
 */
exports.getPaymentStats = async (req, res) => {
  try {
    // Calculate date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get all completed payments
    const allPayments = await Payment.find({ status: 'completed' });

    // Total revenue calculations
    const totalRevenue = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const monthlyRevenue = allPayments
      .filter(p => p.createdAt >= startOfMonth)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const lastMonthRevenue = allPayments
      .filter(p => p.createdAt >= startOfLastMonth && p.createdAt < startOfMonth)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const yearlyRevenue = allPayments
      .filter(p => p.createdAt >= startOfYear)
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Transaction counts
    const totalTransactions = allPayments.length;
    const monthlyTransactions = allPayments.filter(p => p.createdAt >= startOfMonth).length;
    const lastMonthTransactions = allPayments.filter(
      p => p.createdAt >= startOfLastMonth && p.createdAt < startOfMonth
    ).length;

    // Average order value
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const monthlyAvgOrderValue = monthlyTransactions > 0 
      ? monthlyRevenue / monthlyTransactions 
      : 0;

    // Refund stats
    const refunds = await Payment.countDocuments({ status: 'refunded' });
    const refundAmount = await Payment.aggregate([
      { $match: { status: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Payment method distribution
    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);

    // Monthly revenue data for chart (last 12 months)
    const monthlyRevenueData = await Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) } } },
      { $group: { 
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' } 
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { 
          month: '$_id.month',
          year: '$_id.year',
          total: 1,
          count: 1,
          _id: 0 
        } 
      }
    ]);

    // Format monthly data for frontend
    const formattedMonthlyData = monthlyRevenueData.map(item => ({
      month: `${item.year}-${item.month.toString().padStart(2, '0')}`,
      revenue: item.total,
      transactions: item.count
    }));

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '100';
    const transactionChange = lastMonthTransactions > 0
      ? ((monthlyTransactions - lastMonthTransactions) / lastMonthTransactions * 100).toFixed(1)
      : '100';

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          monthlyRevenue,
          yearlyRevenue,
          totalTransactions,
          monthlyTransactions,
          avgOrderValue,
          monthlyAvgOrderValue,
          refunds,
          refundAmount: refundAmount.length > 0 ? refundAmount[0].total : 0,
          revenueChange,
          transactionChange
        },
        paymentMethods,
        monthlyTrends: formattedMonthlyData
      }
    });

  } catch (error) {
    console.error('Error getting payment stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get payment statistics' 
    });
  }
};

/**
 * @desc    Get all transactions with filters and pagination
 * @route   GET /api/payments/transactions
 * @access  Private/Admin
 */
exports.getTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 5, 
      status, 
      paymentMethod, 
      dateFrom, 
      dateTo,
      search 
    } = req.query;

    // Build base query
    const baseQuery = {};
    if (status) baseQuery.status = status;
    if (paymentMethod) baseQuery.paymentMethod = paymentMethod;
    
    // Date range filter
    if (dateFrom || dateTo) {
      baseQuery.createdAt = {};
      if (dateFrom) baseQuery.createdAt.$gte = new Date(dateFrom);
      if (dateTo) baseQuery.createdAt.$lte = new Date(dateTo);
    }

    // For search, we'll use aggregation pipeline
    let aggregationPipeline = [];
    
    // Match stage for base query
    aggregationPipeline.push({ $match: baseQuery });

    // Lookup user details
    aggregationPipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    });
    aggregationPipeline.push({ $unwind: { path: '$user', preserveNullAndEmptyArrays: true } });

    // Lookup booking and service details
    aggregationPipeline.push({
      $lookup: {
        from: 'bookings',
        localField: 'booking',
        foreignField: '_id',
        as: 'booking'
      }
    });
    aggregationPipeline.push({ $unwind: { path: '$booking', preserveNullAndEmptyArrays: true } });
    
    aggregationPipeline.push({
      $lookup: {
        from: 'services',
        localField: 'booking.service',
        foreignField: '_id',
        as: 'booking.service'
      }
    });
    aggregationPipeline.push({ $unwind: { path: '$booking.service', preserveNullAndEmptyArrays: true } });

    // Add search if provided
    if (search) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { transactionId: { $regex: search, $options: 'i' } },
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { 'booking.service.name': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Clone pipeline for count
    const countPipeline = [...aggregationPipeline];
    countPipeline.push({ $count: 'total' });

    // Add pagination and sorting
    aggregationPipeline.push({ $sort: { createdAt: -1 } });
    aggregationPipeline.push({ $skip: (page - 1) * limit });
    aggregationPipeline.push({ $limit: parseInt(limit) });

    // Project to clean up the output
    aggregationPipeline.push({
      $project: {
        transactionId: 1,
        amount: 1,
        status: 1,
        paymentMethod: 1,
        createdAt: 1,
        'user._id': 1,
        'user.name': 1,
        'user.email': 1,
        'booking.service.name': 1
      }
    });

    // Execute both pipelines
    const [transactions, countResult] = await Promise.all([
      Payment.aggregate(aggregationPipeline),
      Payment.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get transaction by ID
 * @route   GET /api/payments/transactions/:id
 * @access  Private/Admin
 */
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Payment.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .populate({
        path: 'booking',
        populate: [
          {
            path: 'service',
            select: 'name basePrice estimatedDuration'
          },
          {
            path: 'cleaner',
            select: 'name phone'
          }
        ]
      });

    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transaction' 
    });
  }
};

/**
 * @desc    Get recent transactions (for dashboard widget)
 * @route   GET /api/payments/transactions/recent
 * @access  Private/Admin
 */
exports.getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'booking',
        select: 'service',
        populate: {
          path: 'service',
          select: 'name'
        }
      });

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Error getting recent transactions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get recent transactions' 
    });
  }
};

/**
 * @desc    Get payment methods distribution
 * @route   GET /api/payments/methods-distribution
 * @access  Private/Admin
 */
exports.getPaymentMethodsDistribution = async (req, res) => {
  try {
    const distribution = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        } 
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          method: '$_id',
          count: 1,
          totalAmount: 1,
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$count', { $sum: '$count' }] },
                  100
                ]
              },
              1
            ]
          },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: distribution
    });

  } catch (error) {
    console.error('Error getting payment methods distribution:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get payment methods distribution' 
    });
  }
};

/**
 * @desc    Get revenue by period (day/week/month/year)
 * @route   GET /api/payments/revenue-by-period
 * @access  Private/Admin
 */
exports.getRevenueByPeriod = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let groupBy, dateFormat;

    switch (period) {
      case 'day':
        groupBy = { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupBy = { 
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateFormat = '%Y-%U';
        break;
      case 'year':
        groupBy = { year: { $year: '$createdAt' } };
        dateFormat = '%Y';
        break;
      default: // month
        groupBy = { 
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' } 
        };
        dateFormat = '%Y-%m';
    }

    const revenueData = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        } 
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: dateFormat,
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day'
                }
              }
            }
          },
          total: 1,
          count: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: revenueData
    });

  } catch (error) {
    console.error('Error getting revenue by period:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get revenue data' 
    });
  }
};