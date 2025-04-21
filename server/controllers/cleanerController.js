const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");

/**
 * @desc    Get bookings for current cleaner (Cleaner only) with pagination
 * @route   GET /api/cleaner/bookings/my-bookings
 * @access  Private/Cleaner
 */
exports.getCleanerBookingsSelf = async (req, res) => {
    try {
      const { status, page = 1, limit = 5 } = req.query;
      const cleanerId = req.user.userId;
  
      // Build the query - must be assigned to this cleaner
      const query = { assignedCleaner: cleanerId };
      if (status) query.status = status;
  
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
  
      // Get total count of documents (for pagination info)
      const total = await Booking.countDocuments(query);
  
      const bookings = await Booking.find(query)
        .populate({
          path: "service",
          select: "name basePrice estimatedDuration",
          transform: (doc) => ({
            name: doc.name,
            basePrice: doc.basePrice,
            estimatedDuration: doc.estimatedDuration,
          }),
        })
        .populate({
          path: "user",
          select: "name phoneNumber address",
          transform: (doc) => ({
            name: doc.name,
            phoneNumber: doc.phoneNumber,
            address: doc.address,
          }),
        })
        .lean()
        .sort({ date: 1 })
        .skip(skip)
        .limit(parseInt(limit));
  
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const currentPage = parseInt(page);
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;
  
      res.json({
        success: true,
        count: bookings.length,
        total,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        data: bookings,
      });
    } catch (error) {
      console.error("Error fetching cleaner bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch your bookings",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

/**
 * @desc    Complete a booking (Cleaner only)
 * @route   PUT /api/cleaner/bookings/:id/complete
 * @access  Private/Cleaner
 */
exports.completeBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const bookingId = req.params.id;
      const cleanerId = req.user.userId;

      // 1. Validate booking exists and is assigned to this cleaner
      const booking = await Booking.findOne({
        _id: bookingId,
        assignedCleaner: cleanerId,
        status: "confirmed",
      }).session(session);

      if (!booking) {
        throw {
          status: 404,
          message: "Booking not found or not assigned to you",
        };
      }

      // 2. Update status
      booking.status = "completed";
      await booking.save({ session });

      res.json({
        success: true,
        data: booking,
        message: "Booking marked as completed",
      });
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to complete booking";

    res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  } finally {
    session.endSession();
  }
};


/**
 * @desc    Get Cleaner Profile
 * @route   GET /api/cleaner/bookings/profile
 * @access  Private/Cleaner
 */
exports.getProfile = async (req, res) => {
    try {
      // Fetch user data using the userId from the JWT token (attached to req.user)
      const user = await User.findById(req.user.userId)
        .select('-password')
        .lean(); 
  
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found.' 
        });
      }
  
      // Generate the absolute URL for the profile picture if available
      const absoluteProfilePictureUrl = user.profilePicture
        ? `${req.protocol}://${req.get('host')}${user.profilePicture}` 
        : null;
  
      // Prepare the response object
      const response = {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber || '',  
          profilePicture: absoluteProfilePictureUrl, 
          address: user.address || {}, 
          role: user.role,
          createdAt: user.createdAt,
          cleanerProfile: user.cleanerProfile || {}
        }
      };
  
      // If user is a cleaner, include cleanerProfile details
      if (user.role === 'cleaner') {
        response.user.cleanerProfile = {
          skills: user.cleanerProfile?.skills || [],
          bio: user.cleanerProfile?.bio || '',
          isActive: user.cleanerProfile?.isActive ?? true
        };
      }
  
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error' 
      });
    }
};


/**
 * @desc    Update Cleaner Profile
 * @route   PUT /api/cleaner/bookings/update-profile
 * @access  Private/Cleaner
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get the current user data
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Extract fields from request body
        const { 
            name,
            phoneNumber,
            address = {},
            cleanerProfile = {}
        } = req.body;

        // Prepare update data
        const updateData = {
            name: name || currentUser.name,
            phoneNumber: phoneNumber || currentUser.phoneNumber,
            address: {
                street: address.street || currentUser.address.street,
                city: address.city || currentUser.address.city,
                country: 'Jordan'
            },
            cleanerProfile: {
                bio: cleanerProfile.bio || currentUser.cleanerProfile?.bio || '',
                skills: cleanerProfile.skills || currentUser.cleanerProfile?.skills || []
            }
        };

        // Handle profile picture upload
        if (req.file) {
            if (currentUser.profilePicture) {
                const oldImagePath = path.join(__dirname, '..', 'public', currentUser.profilePicture);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            
            const relativePath = '/uploads/' + req.file.filename;
            updateData.profilePicture = relativePath;
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        // Create response with absolute URL
        const responseUser = updatedUser.toObject();
        if (responseUser.profilePicture) {
            responseUser.profilePicture = `${req.protocol}://${req.get('host')}${responseUser.profilePicture}`;
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: responseUser
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: error.errors 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: 'Server error during profile update' 
        });
    }
};