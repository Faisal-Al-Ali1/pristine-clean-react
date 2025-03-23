// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: false
    },
    profilePicture: {
      type: String, 
      default: ''
    },
    address: {
      street: { type: String },
      city: { type: String },      // e.g., Amman, Zarqa, Irbid...
      country: { type: String, default: 'Jordan' }
    },
    role: {
      type: String,
      enum: ['customer', 'cleaner', 'admin'],
      default: 'customer'
    },
    // Optional: Link to Subscription if needed
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
