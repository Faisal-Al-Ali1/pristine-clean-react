// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/upload');  

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Check Authinticated User
router.get('/me', isAuthenticated, authController.getMe);

// Profile routes
router.get('/profile', isAuthenticated, authController.getProfile);
router.put('/update-profile', isAuthenticated, upload.single('profilePicture'), authController.updateProfile);

module.exports = router;
