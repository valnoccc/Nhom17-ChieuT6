// Logic lấy danh sách từ bảng users trên TiDB
const getAllUsers = (req, res) => {
    const db = req.app.get('db');
    db.query("SELECT id, name, email, phone, created_at FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = { getAllUsers };