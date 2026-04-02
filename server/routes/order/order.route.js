const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order/order.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.post('/checkout', authenticateToken, orderController.checkout);

module.exports = router;