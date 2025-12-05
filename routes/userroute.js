// routes/userroutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { protect, admin } = require('../middleware/authmiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', protect, userController.getProfile);

// Admin routes (optional)
router.get('/', protect, admin, userController.getAllUsers); // Example: get all users

module.exports = router;
