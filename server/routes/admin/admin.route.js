const express = require('express');
const router = express.Router();
const adminController = require('../../controller/admin/admin.controller');
const { authenticateToken, adminOnly } = require('../../middleware/auth.middleware');

// ============ USERS ROUTES ============
router.get('/admin/users', authenticateToken, adminOnly, adminController.getAllUsers);
router.get('/admin/users/:id', authenticateToken, adminOnly, adminController.getUserById);
router.put('/admin/users/:id/role', authenticateToken, adminOnly, adminController.updateUserRole);
router.delete('/admin/users/:id', authenticateToken, adminOnly, adminController.deleteUser);

// ============ PRODUCTS ROUTES ============
router.get('/admin/products', authenticateToken, adminOnly, adminController.getAllProducts);
router.get('/admin/products/:id', authenticateToken, adminOnly, adminController.getProductById);
router.post('/admin/products', authenticateToken, adminOnly, adminController.addProduct);
router.put('/admin/products/:id', authenticateToken, adminOnly, adminController.updateProduct);
router.delete('/admin/products/:id', authenticateToken, adminOnly, adminController.deleteProduct);

// ============ CATEGORIES ROUTES ============
router.get('/admin/categories', authenticateToken, adminOnly, adminController.getAllCategories);
router.get('/admin/categories/:id', authenticateToken, adminOnly, adminController.getCategoryById);
router.post('/admin/categories', authenticateToken, adminOnly, adminController.addCategory);
router.put('/admin/categories/:id', authenticateToken, adminOnly, adminController.updateCategory);
router.delete('/admin/categories/:id', authenticateToken, adminOnly, adminController.deleteCategory);

// ============ ORDERS ROUTES ============
router.get('/admin/orders', authenticateToken, adminOnly, adminController.getAllOrders);
router.get('/admin/orders/:id', authenticateToken, adminOnly, adminController.getOrderById);
router.put('/admin/orders/:id/status', authenticateToken, adminOnly, adminController.updateOrderStatus);

// ============ DASHBOARD & STATISTICS ROUTES ============
router.get('/admin/dashboard/stats', authenticateToken, adminOnly, adminController.getDashboardStats);
router.get('/admin/dashboard/revenue', authenticateToken, adminOnly, adminController.getRevenueStats);
router.get('/admin/dashboard/orders-status', authenticateToken, adminOnly, adminController.getOrderStatusStats);

module.exports = router;