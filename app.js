const express = require('express');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderroute');
const { notFound, errorHandler } = require('./middleware/errormiddleware');

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
