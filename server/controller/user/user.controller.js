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
                role: user.role,
                phone: user.phone,
                avatar_url: user.avatar_url
            }
        });
    });
};

const getProfile = (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const sql = "SELECT id, full_name, email, phone, avatar_url, address, role FROM Users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, data: results[0] });
    });
};

const updateProfile = (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { full_name, phone } = req.body;
    let avatar_url = req.file ? `avatars/${req.file.filename}` : undefined;

    let sql = "UPDATE Users SET full_name = ?, phone = ?";
    const params = [full_name, phone];

    if (avatar_url !== undefined) {
        sql += ", avatar_url = ?";
        params.push(avatar_url);
    }
    sql += " WHERE id = ?";
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query("SELECT id, full_name, email, phone, avatar_url, role FROM Users WHERE id = ?", [id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({
                success: true,
                message: "Cập nhật thành công",
                data: results[0]
            });
        });
    });
};

const changePassword = (req, res) => {
    const db = req.app.get('db');
    const { id, old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu cũ và mới" });
    }

    db.query("SELECT password_hash FROM Users WHERE id = ?", [id], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

        const isMatch = await bcrypt.compare(old_password, results[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mật khẩu cũ không chính xác" });
        }

        try {
            const newHash = await bcrypt.hash(new_password, 10);
            db.query("UPDATE Users SET password_hash = ? WHERE id = ?", [newHash, id], (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false, message: updateErr.message });
                res.json({ success: true, message: "Đổi mật khẩu thành công!" });
            });
        } catch (hashError) {
            res.status(500).json({ success: false, message: "Lỗi mã hoá mật khẩu" });
        }
    });
};

module.exports = { login, register, getProfile, updateProfile, changePassword };

