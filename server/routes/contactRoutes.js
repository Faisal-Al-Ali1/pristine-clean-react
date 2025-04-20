const express = require('express');
const router = express.Router();
const {submitContactForm, getContactSubmissions, updateContactStatus } = require('../controllers/contactController');
const {isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { contactRateLimiter } = require('../utils/rateLimiter');

// Public routes
router.post('/', contactRateLimiter, submitContactForm);

// Admin protected routes
router.get('/', isAuthenticated, isAdmin, getContactSubmissions);
router.put('/:id/status', isAuthenticated, isAdmin, updateContactStatus);

module.exports = router;