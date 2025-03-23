// models/Payment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
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
      enum: [
        'credit_card',
        'paypal',
        'stripe',
        'cash',
      ],
      default: 'credit_card'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
