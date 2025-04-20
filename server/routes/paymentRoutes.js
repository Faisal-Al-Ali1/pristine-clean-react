const express = require('express');
const router = express.Router();
const { createPayment, paypalSuccess, paypalCancel, verifyCashPayment, processRefund, getPaymentStats, getTransaction, getTransactions, getRecentTransactions, getPaymentMethodsDistribution, getRevenueByPeriod } = require('../controllers/paymentController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');


// Payment routes
router.post('/', isAuthenticated, createPayment); // Handle all payment methods

router.get('/paypal/success', paypalSuccess); 
router.get('/paypal/cancel', paypalCancel); 

// Admin Routes
router.put('/:id/verify-cash', isAuthenticated, isAdmin, verifyCashPayment); // Admin-only 
router.post('/:id/refund', isAuthenticated, isAdmin, processRefund); // Admin-only 
router.get('/stats', isAuthenticated, isAdmin, getPaymentStats);
router.get('/transactions', isAuthenticated, isAdmin, getTransactions);
router.get('/transactions/recent', isAuthenticated, isAdmin, getRecentTransactions);
router.get('/transactions/:id', isAuthenticated, isAdmin, getTransaction);
router.get('/methods-distribution', isAuthenticated, isAdmin, getPaymentMethodsDistribution);
router.get('/revenue-by-period', isAuthenticated, isAdmin, getRevenueByPeriod);

module.exports = router;