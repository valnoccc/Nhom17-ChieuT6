const { createVnPayUrl, verifyVnPayIpn } = require('../../utils/vnpay');

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

const createPaymentUrl = async (req, res) => {
    const { order_id, amount, gateway, bankCode } = req.body;

    if (!order_id || !amount) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng hoặc số tiền" });
    }

    try {
        // Sử dụng VNPay cho thanh toán
        const url = createVnPayUrl(req, order_id, amount, bankCode);
        return res.json({ success: true, url });
    } catch (error) {
        console.error("Lỗi tạo url thanh toán:", error);
        return res.status(500).json({ success: false, message: "Lỗi tạo URL thanh toán" });
    }
};

const vnpayReturnIpn = async (req, res) => {
    let vnp_Params = req.query;
    const isValid = verifyVnPayIpn(vnp_Params);

    if (isValid) {
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        const pool = req.app.get('db');

        try {
            let status = (rspCode === '00') ? 'Paid' : 'Failed';

            // Cập nhật status đơn hàng
            pool.query("UPDATE Orders SET status = ? WHERE id = ?", [status, orderId], async (err, results) => {
                if (err) {
                    return res.status(500).json({ RspCode: '99', Message: 'Lỗi database' });
                }

                // Nếu thanh toán thành công, xóa giỏ hàng
                if (status === 'Paid') {
                    // Lấy user_id từ Orders
                    pool.query("SELECT user_id FROM Orders WHERE id = ?", [orderId], (err, orderResults) => {
                        if (err || orderResults.length === 0) {
                            return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
                        }

                        const user_id = orderResults[0].user_id;

                        // Lấy cart_id từ Carts
                        pool.query("SELECT id FROM Carts WHERE user_id = ?", [user_id], (err, cartResults) => {
                            if (err || cartResults.length === 0) {
                                return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
                            }

                            const cart_id = cartResults[0].id;

                            // Xóa tất cả items trong giỏ hàng
                            pool.query("DELETE FROM Cart_Items WHERE cart_id = ?", [cart_id], (err) => {
                                if (err) {
                                    console.error("Lỗi xóa giỏ hàng:", err);
                                }
                                res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
                            });
                        });
                    });
                } else {
                    res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
                }
            });
        } catch (e) {
            res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
};


const getHistory = async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.get('db');

    try {
        pool.query(
            "SELECT * FROM Orders WHERE user_id = ? ORDER BY id DESC",
            [userId],
            async (err, orders) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                let ordersWithDetails = [];
                for (let order of orders) {
                    const details = await new Promise((resolve, reject) => {
                        pool.query(
                            `SELECT od.*, p.name, p.image_url 
                             FROM Order_Details od 
                             LEFT JOIN Products p ON od.product_id = p.id 
                             WHERE od.order_id = ?`,
                            [order.id],
                            (err, results) => {
                                if (err) reject(err); else resolve(results);
                            }
                        );
                    });
                    ordersWithDetails.push({ ...order, details });
                }
                res.json({ success: true, data: ordersWithDetails });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

const cancelOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    const pool = req.app.get('db');

    try {
        pool.query("SELECT status FROM Orders WHERE id = ? AND user_id = ?", [orderId, userId], async (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (results.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng của bạn" });

            const order = results[0];
            if (order.status !== 'Pending') {
                return res.status(400).json({ success: false, message: "Chỉ đơn hàng đang chờ xác nhận mới được phép huỷ" });
            }

            pool.query("SELECT product_id, quantity FROM Order_Details WHERE order_id = ?", [orderId], async (err, details) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                for (let item of details) {
                    await new Promise((resolve, reject) => {
                        pool.query(
                            "UPDATE Products SET stock_quantity = stock_quantity + ? WHERE id = ?",
                            [item.quantity, item.product_id],
                            (err) => err ? reject(err) : resolve()
                        );
                    });
                }

                pool.query("UPDATE Orders SET status = 'Cancelled' WHERE id = ?", [orderId], (err) => {
                    if (err) return res.status(500).json({ success: false, message: "Huỷ đơn hàng lỗi" });
                    res.json({ success: true, message: "Huỷ đơn hàng thành công" });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

module.exports = { checkout, createPaymentUrl, vnpayReturnIpn, getHistory, cancelOrder };