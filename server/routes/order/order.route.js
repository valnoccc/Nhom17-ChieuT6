const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order/order.controller');

router.post('/checkout', orderController.checkout);
router.get('/user/:userId', orderController.getUserOrders);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;