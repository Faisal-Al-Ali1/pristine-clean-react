const User = require('../models/User');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
dotenv.config();


// 2) Define Joi Schemas
// A) Registration schema
const registerSchema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Name is required.',
      'string.empty': 'Name cannot be empty.'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
      'string.empty': 'Email cannot be empty.'
    }),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 8 characters long, include one uppercase letter, and one special character from @$!%*?&.',
        'any.required': 'Password is required.',
        'string.empty': 'Password cannot be empty.'
      })
  });
  
  // B) Login schema
  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
      'string.empty': 'Email cannot be empty.'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required.',
      'string.empty': 'Password cannot be empty.'
    })
  });

exports.register = async (req, res) => {

  try {
    // 3) Validate input with Joi
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      // Return all validation errors
      return res.status(400).json({
        success: false,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // 4) (Optional) Generate JWT upon registration
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // 5) Send token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {

  try {
    // 1) Validate input with Joi
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const { email, password } = req.body;

    // 1) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 2) Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3) Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // 4) Store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
    try {
      // Since `isAuthenticated` middleware attaches the user to `req.user`
      const userId = req.user.userId; // Extract the user ID from the token
  
      // Find user by their ID
      const user = await User.findById(userId).select('-password'); // Exclude password field
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,  // Or any other fields you want to send
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

exports.getProfile = async (req, res) => {
    try {
      // Fetch user data using the userId from the JWT token (attached to req.user)
      const user = await User.findById(req.user.userId).select('-password'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Generate the absolute URL for the profile picture if available
      const absoluteProfilePictureUrl = user.profilePicture
        ? `${req.protocol}://${req.get('host')}${user.profilePicture}` 
        : null;
  
      // Return the user profile with profile picture, phone number, and address
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber || '',  // Ensure phone number is included
          profilePicture: absoluteProfilePictureUrl, // Attach the absolute URL dynamically
          address: user.address || {}, // Include address object
          role: user.role, // Include role (customer, cleaner, admin)
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId; // Get the userId from the authenticated user
      console.log("User ID:", userId); // Debugging step
  
      // Extract fields from the request body
      const { name, email, phoneNumber, street, city, country } = req.body;
      console.log("Request Body:", req.body); // Check if the body contains the data
  
      // Get the current user data to retain missing fields
      const currentUser = await User.findById(userId);
  
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Prepare the data to be updated
      const updateData = {
        name: name || currentUser.name, // Only update if a new value is provided
        email: email || currentUser.email, // Only update if a new value is provided
        phoneNumber: phoneNumber || currentUser.phoneNumber, // Only update if a new value is provided
        address: {
          street: street || currentUser.address.street, // Use the current value if no new value is provided
          city: city || currentUser.address.city, // Use the current value if no new value is provided
          country: country || currentUser.address.country, // Use the current value if no new value is provided
        },
      };
  
      // If a new profile picture was uploaded, add it to the updateData
      if (req.file) {
        const relativePath = '/uploads/' + req.file.filename;
        updateData.profilePicture = relativePath; // Save only the relative path in the database
        console.log("Profile picture uploaded:", relativePath); // Debugging step
      }
  
      // Update the user's profile in the database
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: user, // Send back the updated user details
      });
  
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
