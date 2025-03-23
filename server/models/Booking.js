// models/Booking.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      street: { type: String },

      city: { type: String },

      governorate: { type: String },

      postalCode: { type: String },
      
      country: { type: String, default: 'Jordan'}
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending'
    },
    specialInstructions: {
      type: String,
      default: ''
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    additionalDetails: {
      type: Schema.Types.Mixed, // allows any form data specific to the chosen service
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
