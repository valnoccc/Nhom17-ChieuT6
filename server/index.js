require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

const userRoute = require('./routes/user/user.route');
const adminRoute = require('./routes/admin/admin.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình kết nối TiDB Cloud
const db = mysql.createConnection({
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

// Kiểm tra kết nối database
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err);
        process.exit(1);
    }
    console.log('✓ Kết nối TiDB Cloud thành công!');
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Lỗi server:', err);
    res.status(500).json({
        success: false,
        message: 'Lỗi server nội bộ',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint không tồn tại',
        path: req.path
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server Nhóm 17 chạy tại: http://localhost:${PORT}`);
    console.log(`   Admin API: http://localhost:${PORT}/admin/*`);
});