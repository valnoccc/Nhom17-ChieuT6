const checkout = async (req, res) => {
    // 1. Lấy pool trực tiếp và sử dụng đối tượng promise()
    const pool = req.app.get('db').promise(); 
    const { user_id, shipping_address, items } = req.body;

    let connection;

    try {
        // 2. Mượn kết nối từ pool bằng promise
        connection = await pool.getConnection();

        // 3. BẮT ĐẦU TRANSACTION
        await connection.beginTransaction();

        let total_amount = 0;

        // BƯỚC 1: KIỂM TRA TỒN KHO VÀ KHÓA DÒNG (FOR UPDATE)
        for (const item of items) {
            const [products] = await connection.query(
                "SELECT stock_quantity, price FROM products WHERE id = ? FOR UPDATE",
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

        // BƯỚC 2: TẠO ĐƠN HÀNG (Bảng orders)
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'Pending')",
            [user_id, total_amount, shipping_address]
        );
        const orderId = orderResult.insertId;

        // BƯỚC 3: TẠO CHI TIẾT VÀ TRỪ KHO
        for (const item of items) {
            // Lấy giá chuẩn từ database để lưu vào chi tiết
            const [pInfo] = await connection.query("SELECT price FROM products WHERE id = ?", [item.product_id]);

            await connection.query(
                "INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [orderId, item.product_id, item.quantity, pInfo[0].price]
            );

            await connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                [item.quantity, item.product_id]
            );
        }

        // XÓA GIỎ HÀNG SAU KHI ĐẶT HÀNG THÀNH CÔNG
        if (user_id) {
            await connection.query(
                "DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)",
                [user_id]
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

const getUserOrders = (req, res) => {
    const db = req.app.get('db');
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu user_id" });
    }

    const queryOrders = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    
    db.query(queryOrders, [userId], (err, orders) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi lấy danh sách đơn: " + err.message });
        
        if (orders.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const orderIds = orders.map(o => o.id);
        const queryDetails = `
            SELECT od.order_id, od.product_id, od.quantity, od.unit_price as price, p.name, p.thumbnail_url as image 
            FROM order_details od 
            JOIN products p ON od.product_id = p.id 
            WHERE od.order_id IN (?)
        `;
        
        db.query(queryDetails, [orderIds], (err2, details) => {
            if (err2) return res.status(500).json({ success: false, message: "Lỗi lấy chi tiết đơn: " + err2.message });

            const formattedOrders = orders.map(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleString('vi-VN');

                let statusVN = order.status;
                if (order.status === 'Pending') statusVN = 'CHỜ XÁC NHẬN';
                else if (order.status === 'Processing') statusVN = 'ĐANG XỬ LÝ';
                else if (order.status === 'Shipped') statusVN = 'ĐANG GIAO';
                else if (order.status === 'Delivered') statusVN = 'ĐÃ GIAO';
                else if (order.status === 'Cancelled') statusVN = 'ĐÃ HỦY';

                return {
                    id: order.id,
                    date: dateStr,
                    status: statusVN,
                    total: order.total_amount,
                    discount: 0,
                    shippingFee: 0,
                    items: details.filter(d => d.order_id === order.id).map(item => ({
                        id: item.product_id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    }))
                };
            });

            res.json({ success: true, data: formattedOrders });
        });
    });
};

const cancelOrder = (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;

    const sql = "UPDATE orders SET status = 'Cancelled' WHERE id = ? AND status = 'Pending'";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi kết nối CSDL khi hủy đơn" });
        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Không thể hủy đơn hàng này (đã được xử lý hoặc không tồn tại)" });
        }
        res.json({ success: true, message: "Đã hủy đơn hàng" });
    });
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

module.exports = { checkout, getUserOrders, cancelOrder, getOrderHistory };
