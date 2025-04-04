const express = require('express');
const router = express.Router();
const { createPayment, paypalSuccess, paypalCancel, verifyCashPayment, processRefund } = require('../controllers/paymentController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');


// Payment routes
router.post('/', isAuthenticated, createPayment); // Handle all payment methods
router.get('/paypal/success', paypalSuccess); 
router.get('/paypal/cancel', paypalCancel); 
router.put('/:id/verify-cash', isAuthenticated, isAdmin, verifyCashPayment); // Admin-only 
router.post('/:id/refund', isAuthenticated, isAdmin, processRefund); // Admin-only 

module.exports = router;