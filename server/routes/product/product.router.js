const express = require('express');
const router = express.Router();
const productController = require('../../controller/product/product.controller');
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
module.exports = router;