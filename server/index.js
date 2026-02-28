require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

const userRoute = require('./routes/user/user.route');
const adminRoute = require('./routes/admin/admin.route');

app.use(cors());
app.use(express.json());

// Cấu hình kết nối TiDB Cloud
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

app.set('db', db); // Chia sẻ kết nối db cho các controller

// Sử dụng Routes đã tách
app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));