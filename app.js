// app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: '*', // Allow all clients (Render-friendly)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// MongoDB Connection
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ ERROR: MONGO_URI is missing in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Avoid long hangs
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('➡️ FIX: Make sure your MongoDB Atlas IP whitelist includes 0.0.0.0/0');
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
  res.status(200).json({
    status: 'success',
    message: 'API is running successfully',
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

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: `Route Not Found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err);

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
