const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/category/category.controller');

// Định nghĩa route lấy danh sách danh mục
router.get('/', categoryController.getAllCategories);

module.exports = router;