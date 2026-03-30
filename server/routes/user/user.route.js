const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/user.controller');

// Public routes (không cần authentication)
router.post('/login', userController.login);
router.post('/register', userController.register);

// Protected routes (cần authentication - có thể thêm middleware sau)
router.get('/', userController.getAllUsers);

module.exports = router;