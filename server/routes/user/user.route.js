const express = require('express');
const router = express.Router();
const userController = require('../../controller/user/user.controller');

router.get('/', userController.getAllUsers);

//dang nhap
router.post('/login', userController.login);
//dang ky
router.post('/register', userController.register);
module.exports = router;