const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { getAllBookings, assignCleaner, cancelBooking, getAllCleaners, getCleanerBookingsAdmin, deactivateCleaner, activateCleaner, createCleaner, updateCleaner } = require('../controllers/adminBookingController');

// Get all bookings with filters
router.get('/', isAuthenticated, isAdmin, getAllBookings);

// Assign cleaner for any booking
router.put('/:id/assign-cleaner', isAuthenticated, isAdmin, assignCleaner);

// Cancel any booking (admin override)
router.put('/:id', isAuthenticated, isAdmin, cancelBooking);

// GET All Cleaners
router.get('/cleaners', isAuthenticated, isAdmin, getAllCleaners);

// GET Cleaner Bookings
router.get('/cleaner/:cleanerId', isAuthenticated, isAdmin, getCleanerBookingsAdmin);

// Deactive Cleaner 
router.put('/cleaner/:id/deactivate', isAuthenticated, isAdmin, deactivateCleaner);

// Active Cleaner
router.put('/cleaner/:id/activate', isAuthenticated, isAdmin, activateCleaner);

// Create Cleaner
router.post('/cleaner', isAuthenticated, isAdmin, createCleaner);

// Update Cleaner
router.put('/cleaner/:id', isAuthenticated, isAdmin, updateCleaner);

module.exports = router;