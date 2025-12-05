const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller');

// List all products
router.get('/', productController.listProducts);

// Add product form
router.get('/add', productcontroller.showAddForm);
router.post('/add', productcontroller.addProduct);

// Edit product
router.get('/edit/:id', productController.showEditForm);
router.post('/edit/:id', productController.updateProduct);

// View single product
router.get('/details/:id', productController.productDetails);

// Delete product
router.post('/delete/:id', productController.deleteProduct);

module.exports = router;
