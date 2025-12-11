const Review = require('../models/review');

// List all reviews
const list = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading reviews' });
  }
};

// Add a new review
const add = async (req, res) => {
  try {
    const { product, user, rating, comment } = req.body;

    if (!product || !user || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = await Review.create({ product, user, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding review' });
  }
};

module.exports = { list, add };
