// Lấy tất cả danh mục để hiển thị lên bộ lọc
const getAllCategories = (req, res) => {
    const db = req.app.get('db');
    const sql = "SELECT * FROM categories ORDER BY name ASC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({
            success: true,
            data: results
        });
    });
};

module.exports = {
    getAllCategories
};