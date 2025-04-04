const Contact = require('../models/Contact');
const { validateContactInput } = require('../validation/contactValidation');
const { sendContactNotification, sendAutoReply } = require('../utils/emailSender');

/**
 * @desc    Submit a new contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContactForm = async (req, res) => {
  try {
    // Validate input
    const { errors, isValid } = validateContactInput(req.body);
    
    
    if (!isValid) {
      return res.status(400).json({ 
        success: false,
        errors 
      });
    }

    const { name, email, subject, message } = req.body;

    // Create new contact submission
    const contact = await Contact.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    // Send emails (non-blocking)
    Promise.all([
        sendContactNotification(contact),
        sendAutoReply(contact.email)
      ]).catch(console.error);
      
    res.status(201).json({
      success: true,
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      },
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all contact submissions (Admin only)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getContactSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions'
    });
  }
};

/**
 * @desc    Update contact submission status (Admin only)
 * @route   PUT /api/contact/:id/status
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: contact._id,
        status: contact.status
      },
      message: 'Contact status updated successfully'
    });

  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};