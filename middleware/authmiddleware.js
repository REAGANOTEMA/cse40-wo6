// middleware/authmiddleware.js
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const protect = asyncHandler(async (req, res, next) => {
    // TODO: implement authentication logic
    // Example: attach req.user
    req.user = await User.findById(req.headers.userid); // replace with real auth
    if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
    }
    next();
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

module.exports = { protect, admin };
