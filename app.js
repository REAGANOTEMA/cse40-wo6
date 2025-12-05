const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

// Load env variables
dotenv.config();

const app = express();
app.use(express.json()); // parse JSON

// MongoDB connection
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

// Routes
const userRoutes = require('./routes/userroute');
const productRoutes = require('./routes/productroute');
const orderRoutes = require('./routes/orderroute');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    routes: [
      { method: 'POST', path: '/api/users/register' },
      { method: 'POST', path: '/api/users/login' },
      { method: 'GET', path: '/api/products' },
      { method: 'POST', path: '/api/orders' },
    ],
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error handler
const { errorHandler } = require('./middleware/errormiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold));

module.exports = app;
