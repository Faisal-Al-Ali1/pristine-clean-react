const validator = require('validator');

exports.validateContactInput = (data) => {
  let errors = {};

  // Name validation
  if (!data.name || validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  } else if (!validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = 'Name must be between 2 and 50 characters';
  }

  // Email validation
  if (!data.email || validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Message validation
  if (!data.message || validator.isEmpty(data.message)) {
    errors.message = 'Message is required';
  } else if (!validator.isLength(data.message, { min: 10, max: 1000 })) {
    errors.message = 'Message must be between 10 and 1000 characters';
  }

  // Optional subject validation
  if (data.subject && !validator.isLength(data.subject, { max: 100 })) {
    errors.subject = 'Subject cannot exceed 100 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};