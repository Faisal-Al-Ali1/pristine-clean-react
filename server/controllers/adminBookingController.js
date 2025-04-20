const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
exports.getAllBookings = async (req, res) => {
  try {
    const { 
        status, 
        startDate, 
        endDate, 
        serviceId, 
        cleanerId, 
        userId,
        page = 1,
        limit = 20
      } = req.query;    const query = {};

    // Build query based on filters
    if (status) query.status = status;
    if (serviceId) query.service = serviceId;
    if (cleanerId) query.assignedCleaner = cleanerId;
    if (userId) query.user = userId;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phoneNumber')
      .populate('service', 'name basePrice')
      .populate('assignedCleaner', 'name')
      .populate('payment', 'status ')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

      const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    console.error('Admin get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

 /**
 * @desc    Assign cleaner to a booking (Admin only)
 * @route   PUT /api/admin/bookings/:id/assign-cleaner
 * @access  Private/Admin
 */
exports.assignCleaner = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { cleanerId, cleanerNotes } = req.body;
      const bookingId = req.params.id;

      // 1. Validate booking exists
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) {
        throw { status: 404, message: 'Booking not found' };
      }

      // Check booking status
      if (booking.status === 'canceled') {
        throw { 
          status: 400, 
          message: 'Cannot assign cleaner to a canceled booking' 
        };
      }

      if (booking.status === 'completed') {
        throw { 
          status: 400, 
          message: 'Cannot assign cleaner to a completed booking' 
        };
      }

      // 2. Validate cleaner exists and has correct role
      const cleaner = await User.findOne({
        _id: cleanerId,
        role: 'cleaner'
      }).session(session);

      if (!cleaner) {
        throw { status: 400, message: 'Invalid cleaner ID or user is not a cleaner' };
      }

      // 3. Check if cleaner is already assigned to another booking at this time
      const conflictingBooking = await Booking.findOne({
        assignedCleaner: cleanerId,
        date: { $lt: booking.endTime },
        endTime: { $gt: booking.date },
        _id: { $ne: bookingId }
      }).session(session);

      if (conflictingBooking) {
        throw { 
          status: 409, 
          message: 'Cleaner already has a booking during this time slot' 
        };
      }

      // 4. Update booking
      booking.assignedCleaner = cleanerId;
      booking.cleanerNotes = cleanerNotes;      
      await booking.save({ session });

      // 5. Return populated response
      const populatedBooking = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('service', 'name')
        .populate('assignedCleaner', 'name phoneNumber')
        .session(session);

      res.json({
        success: true,
        data: populatedBooking,
        message: 'Cleaner assigned successfully'
      });
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Failed to assign cleaner';
    
    res.status(status).json({ 
      success: false, 
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Cancel a booking (Admin override)
 * @route   DELETE /api/admin/bookings/:id
 * @access  Private/Admin
 */
exports.cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          status: { $in: ['pending', 'confirmed'] } 
        },
        { 
          status: 'canceled',
          cancelledBy: req.user.userId, 
          cancellationReason: req.body.reason || 'Admin override' 
        },
        { new: true }
      )
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('assignedCleaner', 'name')
  
      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found or cannot be canceled (already completed/canceled)' 
        });
      }
  
      res.json({
        success: true,
        data: booking,
        message: 'Booking canceled by admin'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cancel booking'
      });
    }
  };

/**
 * @desc    Get all cleaners with their information
 * @route   GET /api/admin/bookings/cleaners
 * @access  Private/Admin
 */
exports.getAllCleaners = async (req, res) => {
  try {
    const { isActive, search, page = 1, limit = 5 } = req.query;

    // Build the base query
    const query = { role: 'cleaner' };

    // Add isActive filter if provided
    if (isActive !== undefined && isActive !== 'null') {
      query['cleanerProfile.isActive'] = isActive === 'true';
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Get paginated results
    const cleaners = await User.find(query)
      .select('name email phoneNumber profilePicture address cleanerProfile createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Count total documents for pagination
    const total = await User.countDocuments(query);

    // Add booking statistics for each cleaner
    const cleanersWithStats = await Promise.all(cleaners.map(async (cleaner) => {
      const assignedBookings = await Booking.countDocuments({ 
        assignedCleaner: cleaner._id,
        status: { $in: ['confirmed', 'completed', 'canceled'] }
      });

      const completedBookings = await Booking.countDocuments({ 
        assignedCleaner: cleaner._id,
        status: 'completed'
      });

      return {
        ...cleaner,
        stats: {
          assignedBookings,
          completedBookings,
        }
      };
    }));

    res.json({
      success: true,
      count: cleanersWithStats.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: cleanersWithStats
    });
  } catch (error) {
    console.error('Get cleaners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cleaners',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


  /**
   * @desc    Get bookings assigned to a cleaner
   * @route   GET /api/admin/bookings/cleaner/:cleanerId
   * @access  Private/Admin
   */
  exports.getCleanerBookingsAdmin = async (req, res) => {
    try {
      const { cleanerId } = req.params;
      const { status } = req.query;
  
      // Validate cleaner exists
      const cleaner = await User.findOne({
        _id: cleanerId,
        role: 'cleaner'
      });
  
      if (!cleaner) {
        return res.status(404).json({
          success: false,
          message: 'Cleaner not found'
        });
      }
  
      // Build query
      const query = { assignedCleaner: cleanerId };
      if (status) {
        query.status = status;
      }
  
      const bookings = await Booking.find(query)
        .populate('service', 'name basePrice estimatedDuration')
        .populate('user', 'name phoneNumber address')
        .sort({ date: 1 });
  
      res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cleaner bookings'
      });
    }
  };

  /**
 * @desc    Activate a cleaner (mark as active)
 * @route   PUT /api/admin/bookings/cleaner/:id/activate
 * @access  Private/Admin
 */
exports.activateCleaner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find cleaner and verify they exist
    const cleaner = await User.findOneAndUpdate(
      { 
        _id: id,
        role: 'cleaner'
      },
      { 
        $set: { 'cleanerProfile.isActive': true } 
      },
      { new: true }
    ).select('name email cleanerProfile');

    if (!cleaner) {
      return res.status(404).json({
        success: false,
        message: 'Cleaner not found'
      });
    }

    res.json({
      success: true,
      message: 'Cleaner activated successfully',
      data: cleaner
    });

  } catch (error) {
    console.error('Activate cleaner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate cleaner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

  /**
 * @desc    Deactivate a cleaner (mark as inactive)
 * @route   PUT /api/admin/bookings/cleaner/:id/deactivate
 * @access  Private/Admin
 */
exports.deactivateCleaner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find cleaner and verify they exist
    const cleaner = await User.findOneAndUpdate(
      { 
        _id: id,
        role: 'cleaner'
      },
      { 
        $set: { 'cleanerProfile.isActive': false } 
      },
      { new: true }
    ).select('name email cleanerProfile');

    if (!cleaner) {
      return res.status(404).json({
        success: false,
        message: 'Cleaner not found'
      });
    }

    // Cancel any upcoming bookings for this cleaner
    await Booking.updateMany(
      {
        assignedCleaner: id,
        status: { $in: ['pending', 'confirmed'] },
        date: { $gt: new Date() }
      },
      {
        $set: { 
          status: 'canceled',
          cancellationReason: 'Cleaner deactivated',
          cancelledBy: req.user.userId
        }
      }
    );

    res.json({
      success: true,
      message: 'Cleaner deactivated successfully',
      data: cleaner
    });

  } catch (error) {
    console.error('Deactivate cleaner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate cleaner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create new cleaner (Admin only)
 * @route   POST /api/admin/bookings/cleaner
 * @access  Private/Admin
 */
exports.createCleaner = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, skills, isActive = true } = req.body;

    // Basic validation
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password and phone number are required'
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create cleaner
    const cleaner = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: 'cleaner',
      address,
      cleanerProfile: {
        skills: skills || [],
        isActive
      }
    });

    // Remove sensitive data from response
    const cleanerData = cleaner.toObject();
    delete cleanerData.password;
    delete cleanerData.__v;

    res.status(201).json({
      success: true,
      message: 'Cleaner created successfully',
      data: cleanerData
    });

  } catch (error) {
    console.error('Create cleaner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create cleaner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update cleaner (Admin only)
 * @route   PUT /api/admin/bookings/cleaner/:id
 * @access  Private/Admin
 */
exports.updateCleaner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, address, skills, isActive } = req.body;

    // Find and update cleaner
    const cleaner = await User.findOneAndUpdate(
      { 
        _id: id,
        role: 'cleaner' 
      },
      {
        name,
        email,
        phoneNumber,
        address,
        $set: { 
          'cleanerProfile.skills': skills,
          'cleanerProfile.isActive': isActive
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password -__v');

    if (!cleaner) {
      return res.status(404).json({
        success: false,
        message: 'Cleaner not found'
      });
    }

    res.json({
      success: true,
      message: 'Cleaner updated successfully',
      data: cleaner
    });

  } catch (error) {
    console.error('Update cleaner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cleaner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};