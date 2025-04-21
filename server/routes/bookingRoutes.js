const express = require('express');
const router = express.Router();
const { isAuthenticated,isAdmin, isCleaner } = require('../middlewares/authMiddleware');
const { createBooking, getUserBookings, getBooking, updateBooking, cancelBooking, submitReview, getBookingReview } = require('../controllers/bookingController');

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

// Submit a review
router.post('/:id/reviews', isAuthenticated, submitReview);

// Get a review
router.get('/:id/reviews', isAuthenticated, getBookingReview);


module.exports = router;