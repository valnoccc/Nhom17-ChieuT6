require('dotenv').config();
const express = require('express');
// SỬA: Dùng mysql2 bản thường (hỗ trợ Callback) thay vì /promise
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// 1. IMPORT ROUTES
const userRoute = require('./routes/user/user.route');
const adminRoute = require('./routes/admin/admin.route');
const productRoute = require('./routes/product/product.router');
const cartRoute = require('./routes/cart/cart.route');
const orderRoute = require('./routes/order/order.route');
const categoryRoutes = require('./routes/category/category.route');

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Debug
app.use((req, res, next) => {
    console.log(`>>> [${req.method}] ${req.url}`);
    next();
});

// 3. CẤU HÌNH KẾT NỐI TIDB CLOUD (Bản Callback)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// Quan trọng: Gán db vào app để các controller gọi req.app.get('db') chạy được callback
app.set('db', db);

// Trang chủ kiểm tra trạng thái server
app.get('/', (req, res) => {
    res.json({
        message: 'Backend Nhóm 17 đang hoạt động ổn định! (Hỗ trợ Callback Mode)',
        version: '1.0.0',
        endpoints: {
            admin: '/admin/*',
            users: '/api/users/*',
            products: '/api/products/*',
            cart: '/api/cart/*',
            orders: '/api/orders/*'
        }
    });
});

// 4. SỬ DỤNG ROUTES
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/', adminRoute);
// Cho phép truy cập thư mục public
app.use('/public', express.static('public'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Nhóm 17 chạy tại cổng: ${PORT}`);
});