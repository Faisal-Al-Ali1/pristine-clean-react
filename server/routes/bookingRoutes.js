const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', isAuthenticated, createBooking);          // Create booking
router.get('/', isAuthenticated, getUserBookings);        // Get user's bookings
router.delete('/:id', isAuthenticated, cancelBooking);    // Cancel booking

module.exports = router;