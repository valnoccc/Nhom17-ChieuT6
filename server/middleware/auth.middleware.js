const jwt = require('jsonwebtoken');

// Middleware xác thực token JWT
// Sử dụng cho tất cả các endpoint bảo vệ (admin, user, cart, order)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Thiếu token xác thực. Vui lòng đăng nhập trước.' 
        });
    }

    // Xác thực token với secret key
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.status(403).json({ 
                success: false,
                error: 'Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.' 
            });
        }
        req.user = user;
        next();
    });
};

// Middleware kiểm tra quyền admin
// Sử dụng cho các endpoint quản trị
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            error: 'Bạn không có quyền truy cập tài nguyên này. Chỉ admin mới được phép.' 
        });
    }
    next();
};

module.exports = { authenticateToken, adminOnly };
