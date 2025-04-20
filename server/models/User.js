const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: false,
      default: ''
    },
    profilePicture: {
      type: String, 
      default: ''
    },
    address: {
      street: { type: String },
      city: { type: String },      
      country: { type: String, default: 'Jordan' }
    },
    role: {
      type: String,
      enum: ['customer', 'cleaner', 'admin'],
      default: 'customer'
    },
    // Cleaner-specific fields (only populated when role='cleaner')
    cleanerProfile: {
      skills: [{
        type: String,
        enum: ['deep_cleaning', 'car_cleaning', 'residential_cleaning', 'move_in_out', 'office_cleaning','after_renovation_cleaning'],
        default: []
      }],
      bio: {
        type: String,
        maxlength: 200,
        default: ''
      },
      isActive: {
        type: Boolean,
        default: true
      }
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
