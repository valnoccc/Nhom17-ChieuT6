const checkout = async (req, res) => {
    // 1. Lấy pool trực tiếp (BỎ .promise() vì index.js đã dùng mysql2/promise)
    const pool = req.app.get('db');
    const { user_id, shipping_address, items } = req.body;

    let connection;

    try {
        // 2. Mượn kết nối từ pool
        connection = await pool.getConnection();

        // 3. BẮT ĐẦU TRANSACTION
        await connection.beginTransaction();

        let total_amount = 0;

        // BƯỚC 1: KIỂM TRA TỒN KHO VÀ KHÓA DÒNG (FOR UPDATE)
        for (const item of items) {
            const [products] = await connection.query(
                "SELECT stock_quantity, price FROM Products WHERE id = ? FOR UPDATE",
                [item.product_id]
            );

            if (products.length === 0) {
                throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại!`);
            }

            if (products[0].stock_quantity < item.quantity) {
                throw new Error(`Sản phẩm ${item.product_id} không đủ hàng!`);
            }

            total_amount += products[0].price * item.quantity;
        }

        // BƯỚC 2: TẠO ĐƠN HÀNG (Bảng Orders)
        const [orderResult] = await connection.query(
            "INSERT INTO Orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'Pending')",
            [user_id, total_amount, shipping_address]
        );
        const orderId = orderResult.insertId;

        // BƯỚC 3: TẠO CHI TIẾT VÀ TRỪ KHO
        for (const item of items) {
            // Lấy giá chuẩn từ database để lưu vào chi tiết
            const [pInfo] = await connection.query("SELECT price FROM Products WHERE id = ?", [item.product_id]);

            await connection.query(
                "INSERT INTO Order_Details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, pInfo[0].price]
            );

            await connection.query(
                "UPDATE Products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        // XÁC NHẬN GIAO DỊCH
        await connection.commit();

        res.json({
            success: true,
            message: "Đặt hàng thành công!",
            order_id: orderId
        });

    } catch (error) {
        // HỦY GIAO DỊCH NẾU CÓ LỖI
        if (connection) await connection.rollback();

        console.error("Lỗi giao dịch:", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });

    } finally {
        // GIẢI PHÓNG KẾT NỐI
        if (connection) connection.release();
    }
};

const getOrderHistory = (req, res) => {
    const db = req.app.get('db');
    const userId = req.user.id; // Lấy từ verifyToken

    const sql = `
        SELECT 
            o.id, 
            o.total_amount, 
            o.status, 
            o.created_at,
            GROUP_CONCAT(p.name SEPARATOR ', ') AS product_names
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        JOIN products p ON od.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: results });
    });
};

module.exports = { checkout, getOrderHistory };