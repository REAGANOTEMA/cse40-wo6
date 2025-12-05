// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection
const path = require('path');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
const productRoutes = require('./routes/productroutes');
const reviewRoutes = require('./routes/reviewroutes');
const orderRoutes = require('./routes/orderroutes');
const userRoutes = require('./routes/userroutes');

// API routes
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Frontend views (optional)
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errormiddleware');
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
