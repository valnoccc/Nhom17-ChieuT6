const express = require('express');
const router = express.Router();
const adminController = require('../../controller/admin/admin.controller');

// Đăng ký đúng cú pháp giảng viên yêu cầu
router.get('/users', adminController.getAllUsers);      // URL local: http://localhost:10000/users
router.get('/users/:id', adminController.getUserById);  // URL local: http://localhost:10000/users/1

// Các chức năng quản trị khác
router.post('/add', adminController.addUser);
router.put('/update/:id', adminController.updateUser);
router.delete('/delete/:id', adminController.deleteUser);

module.exports = router;