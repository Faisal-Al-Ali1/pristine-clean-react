const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const {isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { contactRateLimiter } = require('../utils/rateLimiter');

// Public routes
router.post('/', contactRateLimiter, contactController.submitContactForm);

// Admin protected routes
router.get('/', isAuthenticated, isAdmin, contactController.getContactSubmissions);
router.put('/:id/status', isAuthenticated, isAdmin, contactController.updateContactStatus);

module.exports = router;