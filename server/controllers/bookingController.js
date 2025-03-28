const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const mongoose = require('mongoose');
const { isWithinBusinessHours, isSlotAvailable } = require('../utils/bookingUtils');


/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
  exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { 
          serviceId, 
          date, 
          frequency = 'once',
          specialInstructions,
          additionalDetails,
          useUserAddress = false,
          customLocation,
          phone 
        } = req.body;
  
        const userId = req.user.userId;
  
        // 1. Basic Validation
        if (!serviceId || !date) {
          throw { status: 400, message: 'Service ID and date are required' };
        }
  
        // 2. Validate Date
        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
          throw { status: 400, message: 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)' };
        }
  
        // 3. Check Business Hours (8AM-8PM Jordan Time)
        if (!isWithinBusinessHours(bookingDate)) {
          throw { status: 400, message: 'Bookings only available between 8AM and 8PM' };
        }
  
        // 4. Get Service
        const service = await Service.findById(serviceId).session(session);
        if (!service) {
          throw { status: 404, message: 'Service not found' };
        }
  
        // 5. Check Availability
        const isAvailable = await isSlotAvailable(bookingDate, service.estimatedDuration);
        if (!isAvailable) {
          throw { status: 409, message: 'This time slot is already booked' };
        }
  
        // 6. Get User
        const user = await User.findById(userId).session(session);
        if (!user) {
          throw { status: 404, message: 'User not found' };
        }
        

        // 7. Validate Phone Number
      const userPhone = user.phoneNumber || phone;
      if (!userPhone) {
        throw { 
          status: 400, 
          message: 'Phone number is required. Add it to your profile or include it in the request' 
        };
      }

        // 8. Prepare Location (Jordan is always the country)
        let location;
        if (useUserAddress) {
          if (!user.address?.street || !user.address?.city) {
            throw { 
              status: 400, 
              message: 'Your profile address is incomplete. Please update your address or provide a custom location.' 
            };
          }
          location = {
            street: user.address.street,
            city: user.address.city,
            country: 'Jordan'
          };
        } else {
          if (!customLocation?.street || !customLocation?.city) {
            throw { status: 400, message: 'Street and city are required for custom location' };
          }
          location = {
            street: customLocation.street,
            city: customLocation.city,
            country: 'Jordan'
          };
        }
  
        // 9. Prepare Booking Data
        const bookingData = {
          user: userId,
          service: serviceId,
          date: bookingDate,
          endTime: new Date(bookingDate.getTime() + service.estimatedDuration * 60 * 60 * 1000),
          frequency,
          contactInfo: {
            phone: userPhone,
            email: user.email
          },
          location,
          status: 'pending',
          specialInstructions,
          additionalDetails
        };
  
        // 10. Create Booking
        const booking = await Booking.create([bookingData], { session });
        
        // 11. Response
        res.status(201).json({ 
          success: true, 
          data: booking[0],
          message: 'Booking created successfully'
        });
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to create booking';
      
      res.status(status).json({ 
        success: false, 
        message,
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    } finally {
        session.endSession();
    }
};

/**
 * @desc    Update a booking
 * @route   PUT /api/bookings/:id
 * @access  Private
 */
  exports.updateBooking = async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { 
          date, 
          frequency, 
          specialInstructions, 
          additionalDetails,
          useUserAddress,
          customLocation,
          phone
        } = req.body;
  
        // 1. Find the booking
        const booking = await Booking.findOne({
          _id: req.params.id,
          user: req.user.userId
        }).session(session);
  
        if (!booking) {
          throw { status: 404, message: 'Booking not found' };
        }
  
        // 2. Check if booking can be modified
        if (!['pending', 'confirmed'].includes(booking.status)) {
          throw { 
            status: 400, 
            message: 'Only pending or confirmed bookings can be updated' 
          };
        }
  
        // 3. Get the service
        const service = await Service.findById(booking.service).session(session);
        if (!service) {
          throw { status: 404, message: 'Service not found' };
        }
  
        // 4. Handle date update
        if (date) {
          const newDate = new Date(date);
          if (isNaN(newDate.getTime())) {
            throw { status: 400, message: 'Invalid date format' };
          }
  
          // Check business hours 
          if (!isWithinBusinessHours(newDate)) {
            throw { 
              status: 400, 
              message: 'Bookings only available between 8AM and 8PM' 
            };
          }
  
          // Check availability for new date (excluding current booking)
          const isAvailable = await isSlotAvailable(
            newDate, 
            service.estimatedDuration, 
            booking._id,
            session
          );
          
          if (!isAvailable) {
            throw { status: 409, message: 'New time slot not available' };
          }

          // Convert to UTC for storage
          booking.date = newDate;
          booking.endTime = new Date(newDate.getTime() + service.estimatedDuration * 60 * 60 * 1000);
         }
         
         // 5. Handle phone number update
        if (phone) {
            booking.contactInfo.phone = phone;
        }

        // 6. Handle location update
        if (useUserAddress !== undefined) {
          const user = await User.findById(req.user.userId).session(session);
          if (!user) {
            throw { status: 404, message: 'User not found' };
          }
  
          if (useUserAddress) {
            if (!user.address?.street || !user.address?.city) {
              throw { 
                status: 400, 
                message: 'Your profile address is incomplete' 
              };
            }
            booking.location = {
              street: user.address.street,
              city: user.address.city,
              country: 'Jordan'
            };
          } else {
            if (!customLocation?.street || !customLocation?.city) {
              throw { 
                status: 400, 
                message: 'Street and city are required for custom location' 
              };
            }
            booking.location = {
              street: customLocation.street,
              city: customLocation.city,
              country: 'Jordan'
            };
          }
        }
  
        // 7. Update other fields
        if (frequency) booking.frequency = frequency;
        if (specialInstructions) booking.specialInstructions = specialInstructions;
        if (additionalDetails) booking.additionalDetails = additionalDetails;
  
        await booking.save({ session });
  
        res.json({ 
          success: true, 
          data: booking,
          message: 'Booking updated successfully'
        });
      });
    } catch (error) {
      console.error('Booking update error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Failed to update booking';
      
      res.status(status).json({ 
        success: false, 
        message,
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    } finally {
      session.endSession();
    }
  };

/**
 * @desc    Get all bookings for current user
 * @route   GET /api/bookings
 * @access  Private
   */
  exports.getUserBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.userId })
        .populate('service', 'name basePrice imageUrl estimatedDuration')
        .populate('payment', 'amount status paymentMethod')
        .sort({ date: -1 });
  
      res.json({ 
        success: true, 
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve bookings'
      });
    }
  };
  
  /**
   * @desc    Get booking details
   * @route   GET /api/bookings/:id
   * @access  Private
   */
  exports.getBooking = async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user.userId
      })
      .populate('service')
      .populate('payment');
  
      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found' 
        });
      }
  
      res.json({ 
        success: true, 
        data: booking 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to retrieve booking'
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
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
          status: { $in: ['pending', 'confirmed'] }
        },
        { status: 'canceled' },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found or cannot be canceled' 
        });
      }
  
      res.json({ 
        success: true, 
        data: booking,
        message: 'Booking canceled successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to cancel booking'
      });
    }
  };
  
