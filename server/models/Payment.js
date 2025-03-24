const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'JOD' 
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash'], // Updated: Replaced 'stripe' with 'paypal'
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String, // PayPal transaction ID
  paymentDetails: mongoose.Schema.Types.Mixed // PayPal API response
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);