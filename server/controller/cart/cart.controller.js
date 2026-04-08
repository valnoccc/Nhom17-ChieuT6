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

    // Validation cơ bản
    if (!user_id || !product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    // 1. Kiểm tra sản phẩm tồn tại và có đủ hàng không
    const checkStockSql = "SELECT name, stock_quantity FROM products WHERE id = ?";
    db.query(checkStockSql, [product_id], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });

        if (productResults.length === 0) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        const product = productResults[0];
        const availableStock = product.stock_quantity;

        // 2. Tìm giỏ hàng của user
        const findCartSql = "SELECT id FROM Carts WHERE user_id = ?";
        db.query(findCartSql, [user_id], (err, cartResults) => {
            if (err) return res.status(500).json({ error: err.message });

            let cart_id;

            const proceedToAddItem = (cid) => {
                // 3. Kiểm tra sản phẩm đã có trong giỏ chưa
                const checkItemSql = "SELECT quantity FROM Cart_Items WHERE cart_id = ? AND product_id = ?";
                db.query(checkItemSql, [cid, product_id], (err, itemResults) => {
                    if (err) return res.status(500).json({ error: err.message });

                    let currentQuantityInCart = 0;
                    if (itemResults.length > 0) {
                        currentQuantityInCart = itemResults[0].quantity;
                    }

                    const newTotalQuantity = currentQuantityInCart + quantity;

                    // 4. Kiểm tra tồn kho
                    if (newTotalQuantity > availableStock) {
                        return res.status(400).json({
                            error: `Không đủ hàng trong kho. Chỉ còn ${availableStock} sản phẩm "${product.name}"`,
                            available_stock: availableStock,
                            requested_quantity: newTotalQuantity
                        });
                    }

                    // 5. Thực hiện thêm/cập nhật
                    if (itemResults.length > 0) {
                        // Cập nhật số lượng nếu đã tồn tại
                        const updateSql = "UPDATE Cart_Items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?";
                        db.query(updateSql, [quantity, cid, product_id], (err) => {
                            if (err) return res.status(500).json({ error: err.message });
                            res.json({
                                success: true,
                                message: `Đã cập nhật số lượng "${product.name}" trong giỏ hàng`,
                                new_quantity: newTotalQuantity
                            });
                        });
                    } else {
                        // Thêm mới vào Cart_Items
                        const insertSql = "INSERT INTO Cart_Items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
                        db.query(insertSql, [cid, product_id, quantity], (err) => {
                            if (err) return res.status(500).json({ error: err.message });
                            res.status(201).json({
                                success: true,
                                message: `Đã thêm "${product.name}" vào giỏ hàng`,
                                quantity: quantity
                            });
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
    });
};

const updateCartItem = (req, res) => {
    const db = req.app.get('db');
    const { cart_id, product_id, quantity } = req.body;

    // Validation cơ bản
    if (!cart_id || !product_id || quantity === undefined || quantity < 0) {
        return res.status(400).json({ error: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    // Nếu quantity = 0, xóa item khỏi giỏ
    if (quantity === 0) {
        const deleteSql = "DELETE FROM Cart_Items WHERE cart_id = ? AND product_id = ?";
        db.query(deleteSql, [cart_id, product_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" });
        });
        return;
    }

    // 1. Kiểm tra tồn kho sản phẩm
    const checkStockSql = "SELECT name, stock_quantity FROM products WHERE id = ?";
    db.query(checkStockSql, [product_id], (err, productResults) => {
        if (err) return res.status(500).json({ error: err.message });

        if (productResults.length === 0) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        const product = productResults[0];
        const availableStock = product.stock_quantity;

        // 2. Kiểm tra tồn kho
        if (quantity > availableStock) {
            return res.status(400).json({
                error: `Không đủ hàng trong kho. Chỉ còn ${availableStock} sản phẩm "${product.name}"`,
                available_stock: availableStock,
                requested_quantity: quantity
            });
        }

        // 3. Cập nhật số lượng
        const updateSql = "UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
        db.query(updateSql, [quantity, cart_id, product_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Sản phẩm không có trong giỏ hàng" });
            }

            res.json({
                success: true,
                message: `Đã cập nhật số lượng "${product.name}" thành ${quantity}`,
                new_quantity: quantity
            });
        });
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

const clearCart = (req, res) => {
    const db = req.app.get('db');
    const { cart_id } = req.body;

    if (!cart_id) return res.status(400).json({ error: "Thiếu cart_id" });

    const sql = "DELETE FROM Cart_Items WHERE cart_id = ?";
    db.query(sql, [cart_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
    });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };