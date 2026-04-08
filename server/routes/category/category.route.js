const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/category/category.controller');

// Lấy danh sách toàn bộ danh mục sản phẩm
router.get('/', categoryController.getAllCategories);

module.exports = router;
