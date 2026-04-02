const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart/cart.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');

router.post('/add', authenticateToken, cartController.addToCart);
router.put('/update', authenticateToken, cartController.updateCartItem);
router.delete('/remove', authenticateToken, cartController.removeCartItem);

module.exports = router;