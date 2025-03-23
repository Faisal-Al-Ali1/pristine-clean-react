// models/Subscription.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      enum: ['monthly', 'yearly'], // or add more subscription tiers
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'JOD'
    },
    description: {
      type: String,
      default: ''
    },
    includedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    billingCycleInDays: {
      type: Number,
      default: 30 // for monthly
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
