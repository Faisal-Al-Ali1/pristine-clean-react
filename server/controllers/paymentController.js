const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const axios = require('axios');

/**
 * @desc    Handle all payment methods (credit/cash/PayPal)
 * @route   POST /api/payments
 * @access  Private (JWT cookie)
 */
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardDetails } = req.body; // cardDetails for credit card
    const userId = req.user.id;

    // Validate payment method
    const validMethods = ['credit_card', 'paypal', 'cash'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment method' 
      });
    }

    // Get booking
    const booking = await Booking.findById(bookingId).populate('service');
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Verify booking ownership
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    // Check for existing payment
    if (booking.payment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment already exists' 
      });
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
        // Mock credit card processing (for local dev)
        payment.status = 'completed';
        payment.transactionId = `mock_cc_${Date.now()}`;
        break;

      case 'paypal':
        // PayPal Sandbox
        const paypalResponse = await axios.post(
          'https://api-m.sandbox.paypal.com/v2/checkout/orders',
          {
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: (booking.service.basePrice / 0.71).toFixed(2) // JOD→USD
              }
            }],
            application_context: {
              return_url: 'http://localhost:3000/payment-success',
              cancel_url: 'http://localhost:3000/payment-canceled'
            }
          },
          {
            headers: {
              'Authorization': `Basic ${Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
              ).toString('base64')}`
            }
          }
        );
        payment.transactionId = paypalResponse.data.id;
        payment.paymentDetails = paypalResponse.data;
        break;

      case 'cash':
        // Cash payments require admin verification
        payment.status = 'pending';
        break;
    }

    await payment.save();
    booking.payment = payment._id;
    await booking.save();

    // Return different responses per method
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
    console.error('Payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Payment failed' 
    });
  }
};

/**
 * @desc    Verify PayPal payment (for frontend callback)
 * @route   POST /api/payments/paypal/verify
 * @access  Private (JWT cookie)
 */
exports.verifyPayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = await Payment.findOne({ transactionId: orderId });

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    // Mock verification for local dev
    payment.status = 'completed';
    await payment.save();

    await Booking.findByIdAndUpdate(
      payment.booking,
      { status: 'confirmed' }
    );

    res.json({ 
      success: true,
      data: payment 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed' 
    });
  }
};

/**
 * @desc    Verify cash payment (Admin-only)
 * @route   POST /api/payments/:id/verify-cash
 * @access  Private (JWT cookie) + Admin
 */
exports.verifyCashPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment || payment.paymentMethod !== 'cash') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid cash payment' 
      });
    }

    payment.status = 'completed';
    await payment.save();

    await Booking.findByIdAndUpdate(
      payment.booking,
      { status: 'confirmed' }
    );

    res.json({ 
      success: true,
      data: payment 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};