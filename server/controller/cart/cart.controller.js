const getCart = async (req, res) => {
    const db = req.app.get('db');
    const { user_id } = req.params;

    try {
        const [cartResults] = await db.query("SELECT id FROM Carts WHERE user_id = ?", [user_id]);
        if (cartResults.length === 0) return res.json({ success: true, data: [] });

        const cart_id = cartResults[0].id;
        const getItemsSql = `
            SELECT ci.product_id, ci.quantity, p.name, p.price, p.thumbnail_url 
            FROM Cart_Items ci 
            JOIN Products p ON ci.product_id = p.id 
            WHERE ci.cart_id = ?
        `;
        const [items] = await db.query(getItemsSql, [cart_id]);
        
        const formattedItems = items.map(item => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            thumbnail_url: item.thumbnail_url,
            quantity: item.quantity,
            cart_id: cart_id
        }));
        res.json({ success: true, cart_id: cart_id, data: formattedItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addToCart = async (req, res) => {
    const db = req.app.get('db');
    const { user_id, product_id, quantity } = req.body;

    try {
        let [cartResults] = await db.query("SELECT id FROM Carts WHERE user_id = ?", [user_id]);
        let cart_id;

        if (cartResults.length === 0) {
            const [result] = await db.query("INSERT INTO Carts (user_id) VALUES (?)", [user_id]);
            cart_id = result.insertId;
        } else {
            cart_id = cartResults[0].id;
        }

        const [itemResults] = await db.query("SELECT * FROM Cart_Items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);

        if (itemResults.length > 0) {
            await db.query("UPDATE Cart_Items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?", [quantity, cart_id, product_id]);
            res.json({ success: true, message: "Đã cập nhật số lượng mục hàng" });
        } else {
            await db.query("INSERT INTO Cart_Items (cart_id, product_id, quantity) VALUES (?, ?, ?)", [cart_id, product_id, quantity]);
            res.status(201).json({ success: true, message: "Đã thêm sản phẩm vào giỏ" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCartItem = async (req, res) => {
    const db = req.app.get('db');
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || quantity === undefined || quantity < 0) {
        return res.status(400).json({ error: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    try {
        if (quantity === 0) {
            await db.query("DELETE FROM Cart_Items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
            return res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" });
        }

        const [productResults] = await db.query("SELECT name, stock_quantity FROM products WHERE id = ?", [product_id]);
        if (productResults.length === 0) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại" });
        }

        const product = productResults[0];
        const availableStock = product.stock_quantity;

        if (quantity > availableStock) {
            return res.status(400).json({
                error: `Không đủ hàng trong kho. Chỉ còn ${availableStock} sản phẩm "${product.name}"`,
                available_stock: availableStock,
                requested_quantity: quantity
            });
        }

        const [result] = await db.query("UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND product_id = ?", [quantity, cart_id, product_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sản phẩm không có trong giỏ hàng" });
        }

        res.json({
            success: true,
            message: `Đã cập nhật số lượng "${product.name}" thành ${quantity}`,
            new_quantity: quantity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeCartItem = async (req, res) => {
    const db = req.app.get('db');
    const { cart_id, product_id } = req.body;

    try {
        await db.query("DELETE FROM Cart_Items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
        res.json({ success: true, message: "Đã xóa mục hàng khỏi giỏ" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const clearCart = async (req, res) => {
    const db = req.app.get('db');
    const { cart_id } = req.body;

    if (!cart_id) return res.status(400).json({ error: "Thiếu cart_id" });

    try {
        await db.query("DELETE FROM Cart_Items WHERE cart_id = ?", [cart_id]);
        res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };