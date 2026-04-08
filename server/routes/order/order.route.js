const express = require('express');
const router = express.Router();
const orderController = require('../../controller/order/order.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.post('/checkout', orderController.checkout);

// API Thanh toán
router.post('/create_payment_url', orderController.createPaymentUrl);
router.get('/vnpay_ipn', orderController.vnpayReturnIpn);
router.get('/vnpay_return', orderController.vnpayReturn);

// API Lịch sử & Hủy đơn
router.get('/history', authenticateToken, orderController.getHistory);
router.put('/cancel/:id', authenticateToken, orderController.cancelOrder);

module.exports = router;