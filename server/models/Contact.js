// models/Contact.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    // Example: subject or topic of the inquiry
    subject: {
      type: String,
      default: ''
    },
    // The user's message
    message: {
      type: String,
      required: true
    },
    // Optional: status (e.g. 'new', 'read', 'resolved')
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
