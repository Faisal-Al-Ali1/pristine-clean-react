const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, getBooking, updateBooking, cancelBooking } = require('../controllers/bookingController');

// Create a new booking
router.post('/', isAuthenticated, createBooking);

// Get all bookings for current user
router.get('/', isAuthenticated, getUserBookings);

// Get details of a specific booking
router.get('/:id', isAuthenticated, getBooking);

// Update a booking
router.put('/:id', isAuthenticated, updateBooking);

// Cancel a booking
router.delete('/:id', isAuthenticated, cancelBooking);

module.exports = router;