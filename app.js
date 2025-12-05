// app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors'); // optional, for console logs

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.green.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};
connectDB();

// Routes (ensure filenames are lowercase)
const orderRoutes = require('./routes/orderroute');    // orderroute.js
const userRoutes = require('./routes/userroute');      // userroute.js
const productRoutes = require('./routes/productroute'); // productroute.js

// Mount routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    routes: [
      { method: 'POST', path: '/api/orders' },
      { method: 'GET', path: '/api/orders/myorders' },
      { method: 'PUT', path: '/api/orders/:id/status' },
      { method: 'GET', path: '/api/products' },
      { method: 'POST', path: '/api/users/login' },
      { method: 'POST', path: '/api/users/register' },
    ],
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

module.exports = app;
