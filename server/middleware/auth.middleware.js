const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Thiếu token xác thực' });
    }

    jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn' });
        }
        req.user = user;
        next();
    });
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "Chưa đăng nhập!" });

    // Dùng đúng biến môi trường đã khai báo
    jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, decoded) => {
        if (err) {
            console.error("Lỗi Token:", err.message); // In ra terminal để debug
            return res.status(403).json({ success: false, message: "Token không hợp lệ!" });
        }
        req.user = decoded; // Gán user vào request
        next();
    });
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Bạn không có quyền truy cập tài nguyên này' });
    }
    next();
};

module.exports = { authenticateToken, adminOnly, verifyToken };
