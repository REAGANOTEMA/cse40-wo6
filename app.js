// app.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db'); // MongoDB connection

// Routes
const productRoutes = require('./routes/productroute');
const reviewRoutes = require('./routes/reviewroute');
const orderRoutes = require('./routes/orderroute');
const userRoutes = require('./routes/userroute');

// Middleware
const { notFound, errorHandler } = require('./middleware/errormiddleware');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Frontend routes
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
