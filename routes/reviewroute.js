const express = require('express');
const router = express.Router();
const { list, add } = require('../controllers/reviewcontroller');

// Get all reviews
router.get('/', list);

// Add a review
router.post('/', add);

module.exports = router;
