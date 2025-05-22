const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

