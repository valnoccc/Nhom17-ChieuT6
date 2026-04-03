const express = require('express');
const router = express.Router();
const cartController = require('../../controller/cart/cart.controller');

router.get('/user/:user_id', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeCartItem);

module.exports = router;