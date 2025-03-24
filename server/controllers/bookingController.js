const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { validateBookingTime } = require('../utils/bookingUtils');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, location, specialInstructions, additionalDetails } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!serviceId || !date || !location?.street || !location?.city) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service ID, date, street, and city are required' 
      });
    }

    // Validate date format and future date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date format' 
      });
    }
    if (bookingDate < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking date must be in the future' 
      });
    }

    // Check business hours (8AM-8PM)
    if (!validateBookingTime(bookingDate)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bookings only available between 8AM and 8PM' 
      });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service || service.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Create and save booking
    const booking = await Booking.create({
      user: userId,
      service: serviceId,
      date: bookingDate,
      location,
      specialInstructions: specialInstructions || '',
      additionalDetails: additionalDetails || {},
      status: 'pending'
    });

    res.status(201).json({ 
      success: true, 
      data: booking 
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

/**
 * @desc    Get all bookings for current user
 * @route   GET /api/bookings
 * @access  Private
 */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'name basePrice imageUrl')
      .populate('payment', 'amount status paymentMethod')
      .sort({ date: -1 });

    res.json({ 
      success: true, 
      count: bookings.length,
      data: bookings 
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Cancel a booking
 * @route   DELETE /api/bookings/:id
 * @access  Private
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Only allow cancellation for pending/confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel completed or already canceled bookings' 
      });
    }

    booking.status = 'canceled';
    await booking.save();

    res.json({ 
      success: true, 
      message: 'Booking canceled',
      data: booking 
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};