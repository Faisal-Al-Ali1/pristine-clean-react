const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { getDashboardStats, getRevenueData, getRecentBookings } = require('../controllers/dashboardController');


// Dashboard stats
router.get('/stats', isAuthenticated, isAdmin, getDashboardStats);

// Revenue data for charts
router.get('/revenue', isAuthenticated, isAdmin, getRevenueData);

// Recent bookings
router.get('/recent-bookings', isAuthenticated, isAdmin, getRecentBookings);

module.exports = router;