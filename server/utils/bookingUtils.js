// Validate booking time (8AM to 8PM)
exports.validateBookingTime = (date) => {
    const hours = date.getHours();
    return hours >= 8 && hours <= 20;
  };
  
  // Check if a time slot is available (optional)
  exports.isTimeSlotAvailable = async (startTime, durationHours) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationHours);
  
    const overlappingBookings = await Booking.find({
      $or: [
        { date: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
  
    return overlappingBookings.length === 0;
  };