// src/middleware/authmiddleware.js

// Simple auth middleware example
// Replace this with real authentication logic if needed

const protect = (req, res, next) => {
  // Example: check if a header 'authorization' exists
  if (req.headers.authorization) {
    // Normally you would verify a JWT or session here
    next();
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { protect };
