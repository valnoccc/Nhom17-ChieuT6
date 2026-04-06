const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/user.controller');
const upload = require('../../middleware/upload');

// Public routes (không cần authentication)
router.post('/login', userController.login);
router.post('/register', userController.register);

// Protected routes (cần authentication - có thể thêm middleware sau)
router.get('/', userController.getAllUsers);

router.get('/profile/:id', userController.getProfile);
router.put('/profile/:id', upload.single('avatar'), userController.updateProfile);
router.post('/change-password', userController.changePassword);

module.exports = router;