// controllers/serviceController.js
const Service = require('../models/Service');

// Get all active services (exclude soft-deleted ones)
exports.getAllServices = async (req, res) => {
    try {
      const services = await Service.find({ isDeleted: false });
  
      // Generate absolute URLs for imageUrl and include virtuals
      const servicesWithAbsoluteUrls = services.map(service => {
        const serviceObject = service.toObject({ virtuals: true }); // Include virtuals
        return {
          ...serviceObject,
          imageUrl: serviceObject.imageUrl ? `${req.protocol}://${req.get('host')}/${serviceObject.imageUrl}` : null
        };
      });
  
      res.status(200).json(servicesWithAbsoluteUrls);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Get a single service by ID (only if not soft-deleted)
exports.getServiceById = async (req, res) => {
    try {
      const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Generate absolute URL for imageUrl and include virtuals
      const serviceObject = service.toObject({ virtuals: true }); // Include virtuals
      const serviceWithAbsoluteUrl = {
        ...serviceObject,
        imageUrl: serviceObject.imageUrl ? `${req.protocol}://${req.get('host')}/${serviceObject.imageUrl}` : null
      };
  
      res.status(200).json(serviceWithAbsoluteUrl);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Create a new service
exports.createService = async (req, res) => {
    try {

      const { name, description, basePrice, estimatedDuration, detailedDescription, includedServices } = req.body;
  
      // Parse includedServices if it's a JSON string
      let parsedIncludedServices = [];
      if (includedServices) {
        try {
          parsedIncludedServices = JSON.parse(includedServices);
        } catch (err) {
          return res.status(400).json({ message: 'Invalid JSON format for includedServices' });
        }
      }
  
      // Store the relative path of the image
      const imageUrl = req.file ? req.file.path : null;
  
      const service = new Service({
        name,
        description,
        basePrice,
        estimatedDuration,
        imageUrl, 
        detailedDescription,
        includedServices: parsedIncludedServices
      });
  
      const newService = await service.save();
      res.status(201).json(newService);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Update a service
exports.updateService = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Update fields
      service.name = req.body.name || service.name;
      service.description = req.body.description || service.description;
      service.basePrice = req.body.basePrice || service.basePrice;
      service.estimatedDuration = req.body.estimatedDuration || service.estimatedDuration;
      service.detailedDescription = req.body.detailedDescription || service.detailedDescription;
  
      // Parse includedServices if it's a JSON string
      if (req.body.includedServices) {
        try {
          service.includedServices = JSON.parse(req.body.includedServices);
        } catch (err) {
          return res.status(400).json({ message: 'Invalid JSON format for includedServices' });
        }
      }
  
      // Update image if a new file is uploaded
      if (req.file) {
        service.imageUrl = req.file.path; // Store the relative path
      }
  
      const updatedService = await service.save();
      res.status(200).json(updatedService);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

// Soft delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Mark as deleted
    service.isDeleted = true;
    await service.save();

    res.status(200).json({ message: 'Service soft deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore a soft-deleted service
exports.restoreService = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
  
      // Check if the service is already restored
      if (!service.isDeleted) {
        return res.status(400).json({ message: 'Service is already active' });
      }
  
      // Mark as not deleted
      service.isDeleted = false;
      await service.save();
  
      res.status(200).json({ message: 'Service restored successfully', service });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };