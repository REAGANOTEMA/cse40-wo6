const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewcontroller');

router.get('/new', reviewController.showReviewForm);
router.post('/', reviewController.createReview);
router.get('/product/:id', reviewController.listReviews);

module.exports = router;
