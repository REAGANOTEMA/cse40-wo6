const Review = require('../models/review');

exports.showReviewForm = (req, res) => {
    res.render('reviews/reviewForm', { error: null, designer: 'Reagan Otema', product_id: req.query.product_id });
};

exports.createReview = async (req, res) => {
    try {
        const { product_id, user_name, rating, comment } = req.body;

        if (!user_name || !rating || rating < 1 || rating > 5) {
            return res.status(400).render('reviews/reviewForm', {
                error: 'Name and rating (1-5) are required!',
                designer: 'Reagan Otema',
                product_id
            });
        }

        await Review.addReview({ product_id, user_name, rating, comment });
        res.redirect(`/reviews/product/${product_id}`);
    } catch (err) {
        res.status(500).render('reviews/reviewForm', { error: err.message, designer: 'Reagan Otema', product_id });
    }
};

exports.listReviews = async (req, res) => {
    try {
        const product_id = req.params.id;
        const reviews = await Review.getReviewsByProduct(product_id);
        res.render('reviews/reviewList', { reviews, designer: 'Reagan Otema' });
    } catch (err) {
        res.status(500).send('Error fetching reviews: ' + err.message);
    }
};
