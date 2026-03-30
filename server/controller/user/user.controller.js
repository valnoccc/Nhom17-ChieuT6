
const getAllUsers = (req, res) => {
    const db = req.app.get('db');
    const sql = "SELECT id, full_name, email, phone, address, role, created_at FROM Users";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn TiDB:", err.message);
            return res.status(500).json({
                success: false,
                message: "Lỗi kết nối cơ sở dữ liệu"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lấy danh sách người dùng thành công",
            data: results
        });
    });
};
//dang ky
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 2. Đăng ký tài khoản mới
const register = (req, res) => {
    const db = req.app.get('db');
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc" });
    }

    const checkSql = "SELECT * FROM Users WHERE email = ?";
    db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertSql = `
                INSERT INTO Users (full_name, email, password_hash, phone, role)
                VALUES (?, ?, ?, ?, 'customer')
            `;

            db.query(insertSql, [full_name, email, hashedPassword, phone || null], (err) => {
                if (err) return res.status(500).json({ success: false, error: err.message });
                res.status(201).json({ success: true, message: "Đăng ký thành công" });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi mã hóa mật khẩu" });
        }
    });
};

// 3. Đăng nhập
const login = (req, res) => {
    const db = req.app.get('db');
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
    }

    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Email không tồn tại" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Sai mật khẩu" });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    });
};

module.exports = { getAllUsers, login, register };

