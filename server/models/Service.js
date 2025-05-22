const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
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
      type: Number, 
      default: 2
    },
    imageUrl: {
      type: String, 
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
        _id: false 
      }
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true } 
  }
);

serviceSchema.statics.updateRatingStats = async function(serviceId, session) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { service: serviceId } },
    { 
      $group: {
        _id: '$service',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]).session(session);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(
      serviceId,
      {
        averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
        reviewCount: stats[0].reviewCount
      },
      { session }
    );
  }
};

// Virtual property for currency (always JOD)
serviceSchema.virtual('currency').get(function () {
  return 'JOD';
});

module.exports = mongoose.model('Service', serviceSchema);