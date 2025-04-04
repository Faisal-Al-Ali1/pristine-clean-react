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
        payment.transactionId = `mock_cc_${Date.now()}`;
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
        // No immediate action needed
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