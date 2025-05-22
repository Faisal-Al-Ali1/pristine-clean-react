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
    subject: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'read'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
