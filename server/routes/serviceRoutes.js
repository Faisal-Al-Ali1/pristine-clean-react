const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const upload = require('../middlewares/upload');

// Get all services
router.get('/', serviceController.getAllServices);

// Get a single service by ID
router.get('/:id', serviceController.getServiceById);

// Create a new service
router.post('/', upload.single('image'), serviceController.createService);

// Update a service
router.put('/:id', upload.single('image'), serviceController.updateService);

// Soft delete a service
router.delete('/:id', serviceController.deleteService);

// Restore a soft-deleted service
router.patch('/:id/restore', serviceController.restoreService);


module.exports = router;