const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistcontroller');

router.get('/', wishlistController.getWishlistPage);
router.post('/add', wishlistController.addWishlistItem);

module.exports = router;
