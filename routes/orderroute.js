// routes/orderroute.js
const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/ordercontroller');

const { protect, admin } = require('../middleware/authmiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin route
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
