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

module.exports = { checkout };