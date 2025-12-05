// routes/orderroutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const { protect, admin } = require('../middleware/authmiddleware');

// User routes
router.post('/', protect, orderController.createOrder);
router.get('/myorders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);

// Admin route
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

module.exports = router;
