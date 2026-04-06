const getCart = (req, res) => {
    const db = req.app.get('db');
    const { user_id } = req.params;

    const findCartSql = "SELECT id FROM Carts WHERE user_id = ?";
    db.query(findCartSql, [user_id], (err, cartResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (cartResults.length === 0) return res.json({ success: true, data: [] });

        const cart_id = cartResults[0].id;
        const getItemsSql = `
            SELECT ci.product_id, ci.quantity, p.name, p.price, p.thumbnail_url 
            FROM Cart_Items ci 
            JOIN Products p ON ci.product_id = p.id 
            WHERE ci.cart_id = ?
        `;
        db.query(getItemsSql, [cart_id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            // Trả về dữ liệu được map giống cấu trúc cartItems trên frontend
            const formattedItems = items.map(item => ({
                id: item.product_id,
                name: item.name,
                price: item.price,
                thumbnail_url: item.thumbnail_url,
                quantity: item.quantity,
                cart_id: cart_id
            }));
            res.json({ success: true, cart_id: cart_id, data: formattedItems });
        });
    });
};

const addToCart = (req, res) => {
    const db = req.app.get('db');
    const { user_id, product_id, quantity } = req.body;

    // 1. Tìm hoặc tạo Giỏ hàng (Carts) cho user
    const findCartSql = "SELECT id FROM Carts WHERE user_id = ?";
    db.query(findCartSql, [user_id], (err, cartResults) => {
        if (err) return res.status(500).json({ error: err.message });

        let cart_id;

        const proceedToAddItem = (cid) => {
            // 2. Kiểm tra sản phẩm đã có trong Cart_Items chưa
            const checkItemSql = "SELECT * FROM Cart_Items WHERE cart_id = ? AND product_id = ?";
            db.query(checkItemSql, [cid, product_id], (err, itemResults) => {
                if (err) return res.status(500).json({ error: err.message });

                if (itemResults.length > 0) {
                    // Cập nhật số lượng nếu đã tồn tại
                    const updateSql = "UPDATE Cart_Items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?";
                    db.query(updateSql, [quantity, cid, product_id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, message: "Đã cập nhật số lượng mục hàng" });
                    });
                } else {
                    // Thêm mới vào Cart_Items
                    const insertSql = "INSERT INTO Cart_Items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
                    db.query(insertSql, [cid, product_id, quantity], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.status(201).json({ success: true, message: "Đã thêm sản phẩm vào giỏ" });
                    });
                }
            });
        };

        if (cartResults.length === 0) {
            // Nếu chưa có giỏ thì tạo mới
            db.query("INSERT INTO Carts (user_id) VALUES (?)", [user_id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                proceedToAddItem(result.insertId);
            });
        } else {
            proceedToAddItem(cartResults[0].id);
        }
    });
};

const updateCartItem = (req, res) => {
    const db = req.app.get('db');
    const { cart_id, product_id, quantity } = req.body;

    const sql = "UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
    db.query(sql, [quantity, cart_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Đã thay đổi số lượng" });
    });
};

const removeCartItem = (req, res) => {
    const db = req.app.get('db');
    const { cart_id, product_id } = req.body;

    const sql = "DELETE FROM Cart_Items WHERE cart_id = ? AND product_id = ?";
    db.query(sql, [cart_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Đã xóa mục hàng khỏi giỏ" });
    });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };