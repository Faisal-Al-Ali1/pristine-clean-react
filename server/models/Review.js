// models/Review.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
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
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      default: '',
      maxlength: [500, 'Comment cannot exceed 500 characters']
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
reviewSchema.index({ user: 1, service: 1 }, { unique: true });
reviewSchema.index({ booking: 1 }, { unique: true });

// Virtual populate to include user details when needed
reviewSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name profilePicture' }
});

// Pre-save hook to validate booking
reviewSchema.pre('save', async function(next) {
  const booking = await mongoose.model('Booking').findOne({
    _id: this.booking,
    user: this.user,
    status: 'completed'
  });

  if (!booking) {
    throw new Error('Cannot review - booking not found or not completed');
  }

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;