// app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ ERROR: MONGO_URI is missing in environment variables');
    return process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Import routes
const orderRoutes = require('./routes/orderroute');
const userRoutes = require('./routes/userroute');
const productRoutes = require('./routes/productroute');

// Mount routes
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: 'API is running',
    available_routes: [
      { method: 'POST', path: '/api/orders' },
      { method: 'GET', path: '/api/orders/myorders' },
      { method: 'PUT', path: '/api/orders/:id/status' },
      { method: 'GET', path: '/api/products' },
      { method: 'POST', path: '/api/users/login' },
      { method: 'POST', path: '/api/users/register' }
    ]
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`❌ Server Error: ${err.message}`);
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
