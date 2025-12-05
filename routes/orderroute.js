// routes/orderroutes.js
const express = require('express');
const router = express.Router();

// Import controllers (must match EXACT export names)
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/ordercontroller');

// Auth middleware
const { protect, admin } = require('../middleware/authmiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin route (update order status)
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
