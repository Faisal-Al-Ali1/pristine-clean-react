const express = require('express');
const router = express.Router();
const { createPayment, verifyPayPalPayment, verifyCashPayment } = require('../controllers/paymentController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// JWT cookie authentication required for all routes
router.use(isAuthenticated);

// Payment routes
router.post('/', createPayment); // Handle all payment methods
router.post('/paypal/verify', verifyPayPalPayment); // PayPal callback
router.post('/:id/verify-cash', isAdmin, verifyCashPayment); // Admin-only

module.exports = router;