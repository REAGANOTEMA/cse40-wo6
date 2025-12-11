const Wishlist = require('../models/wishlist');

// Show wishlist page
exports.getWishlistPage = async (req, res) => {
    try {
        const items = await Wishlist.find().sort({ createdAt: -1 });
        res.render('wishlist', { items, errors: null });
    } catch (error) {
        res.status(500).send("Server Error: Unable to load wishlist.");
    }
};

// Add a new wishlist item
exports.addWishlistItem = async (req, res) => {
    const { userEmail, productName, notes } = req.body;
    const errors = [];

    if (!userEmail || !productName) {
        errors.push("Email and Product Name are required.");
    }

    if (errors.length > 0) {
        const items = await Wishlist.find().sort({ createdAt: -1 });
        return res.render('wishlist', { items, errors });
    }

    try {
        const item = new Wishlist({ userEmail, productName, notes });
        await item.save();
        res.redirect('/wishlist');
    } catch (error) {
        res.status(500).send("Error saving wishlist item.");
    }
};
