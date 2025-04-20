const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { isAuthenticated,isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Get all services
router.get('/', serviceController.getAllServices);

// Get all services (Admin)
router.get('/admin', isAuthenticated, isAdmin, serviceController.getAllServicesAdmin);

// Get a single service by ID
router.get('/:id', serviceController.getServiceById);

// Create a new service
router.post('/', isAuthenticated, isAdmin, upload.single('image'), serviceController.createService);

// Update a service
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'), serviceController.updateService);

// Soft delete a service
router.delete('/:id', isAuthenticated, isAdmin, serviceController.deleteService);

// Restore a soft-deleted service
router.patch('/:id/restore', isAuthenticated, isAdmin, serviceController.restoreService);


module.exports = router;