const express = require('express');
const router = express.Router();
const productController = require('../controllers/productcontroller'); // must match exact filename

router.get('/', productController.list);
router.get('/add', productController.addForm);
router.post('/add', productController.add);
router.get('/edit/:id', productController.editForm);
router.post('/edit/:id', productController.update);
router.get('/:id', productController.details);
router.post('/delete/:id', productController.delete);

module.exports = router;
