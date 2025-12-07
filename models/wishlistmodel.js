const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
