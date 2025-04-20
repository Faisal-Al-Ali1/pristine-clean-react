const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuthenticated = (req, res, next) => {
  // 1) Retrieve the token from the "token" cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3) Attach the decoded payload to req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

exports.isCleaner = (req, res, next) => {
  if (!req.user || req.user.role !== 'cleaner') {
    return res.status(403).json({ message: 'Access denied. Cleaner access only.' });
  }
  next();
};

