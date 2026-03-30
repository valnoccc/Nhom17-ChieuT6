const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Lấy danh sách người dùng
const getAllUsers = (req, res) => {
    const db = req.app.get('db');
    db.query("SELECT id, full_name, email, phone, role, created_at FROM users", (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
};

// Login - Đăng nhập & lấy token
const login = (req, res) => {
    const db = req.app.get('db');
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email và password là bắt buộc'
        });
    }

    // Tìm user bằng email
    db.query(
        "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server',
                    error: err.message
                });
            }

            // Nếu không tìm thấy user
            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không chính xác'
                });
            }

            const user = results[0];

            // So sánh password
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Lỗi so sánh mật khẩu'
                    });
                }

                // Password không đúng
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email hoặc mật khẩu không chính xác'
                    });
                }

                // Tạo JWT token
                const token = jwt.sign(
                    {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role
                    },
                    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
                    { expiresIn: '24h' }
                );

                // Trả về token
                res.json({
                    success: true,
                    message: 'Đăng nhập thành công',
                    data: {
                        token,
                        user: {
                            id: user.id,
                            full_name: user.full_name,
                            email: user.email,
                            role: user.role
                        }
                    }
                });
            });
        }
    );
};

// Register - Đăng ký tài khoản mới
const register = (req, res) => {
    const db = req.app.get('db');
    const { full_name, email, password, phone, address } = req.body;

    // Validate
    if (!full_name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Tên, email và mật khẩu là bắt buộc'
        });
    }

    // Kiểm tra email đã tồn tại chưa
    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server'
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email này đã tồn tại'
                });
            }

            // Hash password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Lỗi mã hóa mật khẩu'
                    });
                }

                // Thêm user mới
                db.query(
                    "INSERT INTO users (full_name, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
                    [full_name, email, hashedPassword, phone || null, address || null, 'customer'],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Lỗi tạo tài khoản'
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: 'Đăng ký thành công',
                            data: {
                                id: result.insertId,
                                full_name,
                                email,
                                role: 'customer'
                            }
                        });
                    }
                );
            });
        }
    );
};

module.exports = { getAllUsers, login, register };