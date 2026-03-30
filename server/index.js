require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // SỬA: Dùng trực tiếp bản promise
const cors = require('cors');
const app = express();

// 1. IMPORT ROUTES
const userRoute = require('./routes/user/user.route');
const adminRoute = require('./routes/admin/admin.route');
const productRoute = require('./routes/product/product.router');
const cartRoute = require('./routes/cart/cart.route');
const orderRoute = require('./routes/order/order.route');

// 2. MIDDLEWARES (Phải đặt trước Routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Debug: Giúp cậu xem request nào đang bay vào server
app.use((req, res, next) => {
    console.log(`>>> [${req.method}] ${req.url}`);
    next();
});

// 3. CẤU HÌNH KẾT NỐI TIDB CLOUD (Dùng Pool chuyên cho Promise)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

app.set('db', db); // Chia sẻ kết nối db cho các controller

app.get('/', (req, res) => {
    res.json({
        message: 'Backend Nhóm 17 đang hoạt động ổn định!',
        version: '1.0.0',
        endpoints: {
            admin: '/admin/*',
            users: '/api/users/*'
        }
    });
});

// Sử dụng Routes đã tách
app.use('/api/users', userRoute);
app.use('/', adminRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server Nhóm 17 chạy tại: http://localhost:${PORT}`);
    console.log(`   Admin API: http://localhost:${PORT}/admin/*`);
});