const express = require('express');
const router = express.Router();
const adminController = require('../../controller/admin/admin.controller');

router.post('/add', adminController.addUser);
router.delete('/delete/:id', adminController.deleteUser);

// Thêm dòng này để xử lý cập nhật
router.put('/update/:id', adminController.updateUser);

module.exports = router;