const rateLimit = require('express-rate-limit');

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    success: false,
    message: 'Too many contact attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  contactRateLimiter
};