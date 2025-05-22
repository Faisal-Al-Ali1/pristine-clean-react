const mongoose = require('mongoose');
const Booking = require('../models/Booking');

/**
 * Simple business hours check (8AM-8PM)
 * Now uses the raw Date object without timezone conversion
 */
const isWithinBusinessHours = (date) => {
  const hours = date.getHours();
  return hours >= 8 && hours < 20; // 8AM-7:59PM
};


const isSlotAvailable = async (startTime, durationHours, excludeBookingId = null, session = null) => {
  const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

  const query = {
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      // Check for overlapping time slots
      { date: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const options = session ? { session } : {};
  const count = await Booking.countDocuments(query, options);
  
  return count === 0;
};

module.exports = {
  isWithinBusinessHours,
  isSlotAvailable
};