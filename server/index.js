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
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chia sẻ pool vào app để các controller lấy ra dùng
app.set('db', db); 

// 4. ĐĂNG KÝ ROUTES
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);

app.get('/', (req, res) => {
    res.send('Backend Nhóm 17 đang hoạt động ổn định!');
});

// 5. XỬ LÝ LỖI TẬP TRUNG (Optional nhưng nên có)
app.use((err, req, res, next) => {
    console.error("Lỗi Server:", err.stack);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi hệ thống!" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));