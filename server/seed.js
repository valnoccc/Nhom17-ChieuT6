require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

const createAdminUser = async () => {
    const email = 'demo@admin.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (full_name, email, password_hash, phone, role) 
                 VALUES (?, ?, ?, ?, 'admin')`;

    db.query(sql, ['Demo Admin', email, hashedPassword, '0123456789'], (err, result) => {
        if (err) {
            console.error('Lỗi tạo user:', err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`User "${email}" đã tồn tại. Không cần tạo mới.`);
            }
        } else {
            console.log(`✅ Tạo admin user thành công!`);
            console.log(`📧 Email: ${email}`);
            console.log(`🔐 Password: ${password}`);
        }
        db.end();
    });
};

createAdminUser();
