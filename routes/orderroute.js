// routes/orderroute.js

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/ordercontroller');

// Import authentication middleware
const { protect, admin } = require('../middleware/authmiddleware');

// =========================
// USER ORDER ROUTES
// =========================

// Create a new order
router.post('/', protect, createOrder);

// Get logged-in user's orders
router.get('/myorders', protect, getMyOrders);

// Get specific order by ID
router.get('/:id', protect, getOrderById);

// =========================
// ADMIN ROUTES
// =========================

// Update order status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Export router
module.exports = router;
