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
    description: {
      type: String,
      default: ''
    },
    basePrice: {
      type: Number,
      required: true
    },
    estimatedDuration: {
      type: Number, // e.g., in hours
      default: 2
    },
    imageUrl: {
      type: String, // This will store the relative path
      required: true
    },
    detailedDescription: {
      type: String,
      default: ''
    },
    includedServices: [
      {
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        _id: false // Disable _id for subdocuments
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true } // Include virtuals in the response
  }
);

// Virtual property for currency (always JOD)
serviceSchema.virtual('currency').get(function () {
  return 'JOD';
});

module.exports = mongoose.model('Service', serviceSchema);