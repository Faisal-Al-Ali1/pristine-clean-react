// models/Service.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    // If you need multiple languages:
    // description: {
    //   en: { type: String, default: '' },
    //   ar: { type: String, default: '' }
    // },
    description: {
      type: String,
      default: ''
    },
    basePrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'JOD'
    },
    estimatedDuration: {
      type: Number, // e.g., in hours
      default: 2
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
