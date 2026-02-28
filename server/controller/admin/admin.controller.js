const adminController = {
    // Thêm người dùng mới vào db_nhom17
    addUser: (req, res) => {
        const { name, email, phone } = req.body;
        const db = req.app.get('db');
        db.query("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
            [name, email, phone], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Thêm thành công", id: result.insertId });
            });
    },

    // Xóa người dùng dựa trên ID
    deleteUser: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');
        db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Admin đã xóa thành công" });
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const db = req.app.get('db');

        const sql = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
        db.query(sql, [name, email, phone, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Cập nhật thành công" });
        });
    }
};

module.exports = adminController;