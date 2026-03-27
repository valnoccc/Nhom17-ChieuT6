const adminController = {
    // 1. Lấy tất cả người dùng (Đáp ứng BASE_API/users)
    getAllUsers: (req, res) => {
        const db = req.app.get('db');
        db.query("SELECT * FROM users", (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Lấy user theo ID (Đáp ứng BASE_API/users/1)
    getUserById: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');
        db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy user" });
            res.json(result[0]); // Trả về đối tượng user đầu tiên tìm thấy
        });
    },

    // 3. Thêm người dùng mới
    addUser: (req, res) => {
        const { name, email, phone } = req.body;
        const db = req.app.get('db');
        db.query("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
            [name, email, phone], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Thêm thành công", id: result.insertId });
            });
    },

    // 4. Cập nhật thông tin người dùng
    updateUser: (req, res) => {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const db = req.app.get('db');

        const sql = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
        db.query(sql, [name, email, phone, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Cập nhật thành công" });
        });
    },

    // 5. Xóa người dùng
    deleteUser: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');
        db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Admin đã xóa thành công" });
        });
    }
};

module.exports = adminController;