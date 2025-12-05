const Review = require('../models/reviewmodel');

exports.form = (req, res) => {
    res.render('reviews/addreview', { error: null });
};

exports.add = async (req, res) => {
    try {
        const { name, feedback } = req.body;

        if (!name || !feedback) {
            return res.render('reviews/addreview', {
                error: "All fields are required."
            });
        }

        await Review.create(name, feedback);
        res.redirect('/reviews/all');
    } catch (err) {
        console.error(err);
        res.status(500).render('reviews/addreview', {
            error: "Error submitting review"
        });
    }
};

exports.all = async (req, res) => {
    try {
        const [rows] = await Review.getAll();
        res.render('reviews/listreviews', { reviews: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading reviews");
    }
};
