// controllers/ordercontroller.js
const Order = require('../models/order');
const Product = require('../models/productmodel');
const asyncHandler = require('express-async-handler');

// @desc   Create a new order
// @route  POST /api/orders
// @access Private
exports.createOrder = asyncHandler(async (req, res) => {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400);
        throw new Error("Order must contain at least one item");
    }

    for (let item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for product: ${product.name}`);
        }

        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        user: req.user._id,
        items,
        total,
        status: "Pending"
    });

    res.status(201).json(order);
});

// @desc   Get logged-in user's orders
// @route  GET /api/orders/myorders
// @access Private
exports.getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name price');

    res.json(orders);
});

// @desc   Get a specific order by ID
// @route  GET /api/orders/:id
// @access Private
exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('items.product', 'name price')
        .populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to view this order");
    }

    res.json(order);
});

// @desc   Update order status (Admin Only)
// @route  PUT /api/orders/:id/status
// @access Admin
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];

    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid status value");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order updated", order });
});
