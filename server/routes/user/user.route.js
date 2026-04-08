const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/user.controller');
const upload = require('../../middleware/upload');
const { authenticateToken } = require('../../middleware/auth.middleware');

// Public routes (không cần authentication)
router.post('/login', userController.login);
router.post('/register', userController.register);

// Protected routes (cần authentication)
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, upload.single('avatar'), userController.updateProfile);
router.post('/change-password', authenticateToken, userController.changePassword);

module.exports = router;