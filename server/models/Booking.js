const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  endTime: Date, // Auto-calculated
  frequency: {
    type: String,
    enum: ['once', 'weekly', 'biweekly', 'monthly'],
    default: 'once'
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  location: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'Jordan' }
  },
  assignedCleaner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  cleanerNotes: String, 
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending'
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  hasReview: {
    type: Boolean,
    default: false
  },
  specialInstructions: String,
  payment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  },
  additionalDetails: mongoose.Schema.Types.Mixed // For room count, pets, etc.
}, { timestamps: true });

// Auto-calculate endTime before saving
bookingSchema.pre('save', async function(next) {
  if (this.isModified('date') || this.isNew) {
    const service = await mongoose.model('Service').findById(this.service);
    if (service) {
      this.endTime = new Date(this.date);
      this.endTime.setHours(this.endTime.getHours() + service.estimatedDuration);
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);