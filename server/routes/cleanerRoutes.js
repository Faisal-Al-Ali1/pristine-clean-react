const express = require('express');
const router = express.Router();
const {getCleanerBookingsSelf, completeBooking, getProfile, updateProfile } = require('../controllers/cleanerController');
const {isAuthenticated, isCleaner } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');  

// Cleaner routes
router.get('/profile', isAuthenticated, isCleaner, getProfile);
router.get('/my-bookings', isAuthenticated, isCleaner, getCleanerBookingsSelf);
router.put('/:id/complete', isAuthenticated, isCleaner, completeBooking);
router.put('/update-profile', isAuthenticated, isCleaner, upload.single('profilePicture'), updateProfile);


module.exports = router;