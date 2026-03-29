const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order/order.controller');

router.post('/checkout', orderController.checkout);

module.exports = router;