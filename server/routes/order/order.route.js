const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order/order.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.post('/checkout', orderController.checkout);
router.get('/history', orderController.getOrderHistory);

module.exports = router;