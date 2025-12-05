// src/middleware/errormiddleware.js

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // If the request expects JSON (API), send JSON
  if (req.originalUrl.startsWith('/api')) {
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  } else {
    // For frontend routes, render the error page
    res.render('error', {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '' : err.stack
    });
  }
};

module.exports = { notFound, errorHandler };
