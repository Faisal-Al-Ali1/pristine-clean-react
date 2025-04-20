// controllers/serviceController.js
const Service = require('../models/Service');

// Get all active services (exclude soft-deleted ones)
exports.getAllServices = async (req, res) => {
    try {
      const services = await Service.find({ isDeleted: false });
  
      const servicesWithAbsoluteUrls = services.map(service => {
        const serviceObject = service.toObject({ virtuals: true }); 
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

// Get all services (including soft-deleted) 
exports.getAllServicesAdmin = async (req, res) => {
  try {

    const { 
      page = 1, 
      limit = 6,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status, 
      minPrice,
      maxPrice,
      search
    } = req.body;

    const query = {};

    if (status === 'active') {
      query.isDeleted = false;
    } else if (status === 'deleted') {
      query.isDeleted = true;
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortDirection };

    const [services, total] = await Promise.all([
      Service.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Service.countDocuments(query)
    ]);

    // Transform image URLs
    const servicesWithUrls = services.map(service => ({
      ...service,
      imageUrl: service.imageUrl 
        ? `${req.protocol}://${req.get('host')}/${service.imageUrl.replace(/\\/g, '/')}`
        : null
    }));

    res.status(200).json({
      success: true,
      data: servicesWithUrls,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch services',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

    // Validate required fields
    if (!req.body.name || !req.body.description || !req.body.basePrice || !req.body.estimatedDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({ message: 'Service image is required' });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size must be less than 5MB' });
    }

    const { name, description, basePrice, estimatedDuration, detailedDescription, includedServices } = req.body;

    // Parse includedServices
    let parsedIncludedServices = [];
    if (includedServices) {
      try {
        parsedIncludedServices = JSON.parse(includedServices);
        if (!Array.isArray(parsedIncludedServices)) {
          return res.status(400).json({ message: 'includedServices must be an array' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format for includedServices' });
      }
    }

    // Construct relative image URL
    const imageUrl = req.file.path.replace(/\\/g, '/');

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

    const fullImageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

    res.status(201).json({
      ...newService.toObject(),
      imageUrl: fullImageUrl, 
    });
    
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: 'Server error while creating service' });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Validate file size if new image is uploaded
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size must be less than 5MB' });
    }

    // Update fields
    if (req.body.name) service.name = req.body.name;
    if (req.body.description) service.description = req.body.description;
    if (req.body.basePrice) service.basePrice = req.body.basePrice;
    if (req.body.estimatedDuration) service.estimatedDuration = req.body.estimatedDuration;
    if (req.body.detailedDescription) service.detailedDescription = req.body.detailedDescription;

    // Parse includedServices
    if (req.body.includedServices) {
      try {
        const parsed = JSON.parse(req.body.includedServices);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({ message: 'includedServices must be an array' });
        }
        service.includedServices = parsed;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format for includedServices' });
      }
    }

    // Update image if a new file is uploaded
    if (req.file) {
      service.imageUrl = req.file.path.replace(/\\/g, '/');
    }

    const updatedService = await service.save();

    // Construct full URL if image was updated
    const fullImageUrl = req.file 
    ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`
    : `${req.protocol}://${req.get('host')}/${updatedService.imageUrl.replace(/\\/g, '/')}`;


    res.status(200).json({
      ...updatedService.toObject(),
      imageUrl: fullImageUrl,
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Server error while updating service' });
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