const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

// GET /api/wishlist/:userId
exports.getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
        .populate('products');

    res.render('wishlist/wishlist', { wishlist });
});

// POST /api/wishlist/add
exports.addToWishlist = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = new Wishlist({
            user: userId,
            products: [productId]
        });
    } else {
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }
    }

    await wishlist.save();
    res.redirect(`/api/wishlist/${userId}`);
});

// POST /api/wishlist/remove
exports.removeFromWishlist = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
    }

    res.redirect(`/api/wishlist/${userId}`);
});
