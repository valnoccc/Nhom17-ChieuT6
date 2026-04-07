// Lấy danh sách sản phẩm với phân trang
const getAllProducts = (req, res) => {
    const db = req.app.get('db');

    // TEST THỬ KẾT NỐI TRƯỚC
    db.query("SELECT 1", (testErr) => {
        if (testErr) {
            console.error("❌ LỖI KẾT NỐI DATABASE:", testErr.code, testErr.message);
            return res.status(500).json({ success: false, error: "Không thể kết nối Database" });
        }

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        // Câu lệnh đếm đơn giản nhất - Kiểm tra kỹ tên bảng 'products'
        const sqlCount = "SELECT COUNT(*) as total FROM products";

        db.query(sqlCount, (err, countResult) => {
            if (err) {
                // IN CHI TIẾT LỖI RA TERMINAL
                console.error("❌ LỖI SQL COUNT:", err);
                return res.status(500).json({ success: false, error: err.message });
            }

            const totalItems = countResult[0].total;
            const totalPages = Math.ceil(totalItems / limit);

            const sqlData = "SELECT * FROM products ORDER BY id DESC LIMIT ? OFFSET ?";

            db.query(sqlData, [Number(limit), Number(offset)], (err, results) => {
                if (err) {
                    console.error("❌ LỖI SQL DATA:", err.message);
                    return res.status(500).json({ success: false, error: err.message });
                }

                res.json({
                    success: true,
                    pagination: { totalItems, totalPages, currentPage: page, limit },
                    data: results
                });
            });
        });
    });
};

// UPDATE: Lấy chi tiết sản phẩm + toàn bộ hình ảnh theo ID
const getProductById = (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;

    // Câu lệnh SQL sử dụng LEFT JOIN và GROUP_CONCAT để lấy mảng ảnh
    const sql = `
        SELECT 
            p.*, 
            c.name AS category_name,
            GROUP_CONCAT(pi.image_url) AS all_images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        GROUP BY p.id, c.name
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("LỖI LẤY CHI TIẾT SẢN PHẨM:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        // Xử lý biến all_images từ chuỗi thành mảng (Array)
        const product = results[0];
        if (product.all_images) {
            product.all_images = product.all_images.split(',');
        } else {
            product.all_images = []; // Trường hợp sản phẩm không có ảnh nào
        }

        res.json({
            success: true,
            message: "Lấy chi tiết sản phẩm thành công",
            data: product
        });
    });
};

// Tìm kiếm sản phẩm 
const searchProducts = (req, res) => {
    const db = req.app.get('db');
    const { name, minPrice, maxPrice } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (name) {
        sql += " AND name LIKE ?";
        params.push(`%${name}%`);
    }

    if (minPrice) {
        sql += " AND price >= ?";
        params.push(Number(minPrice));
    }

    if (maxPrice) {
        sql += " AND price <= ?";
        params.push(Number(maxPrice));
    }

    sql += " ORDER BY id DESC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("LỖI TÌM KIẾM SẢN PHẨM:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

module.exports = { getAllProducts, getProductById, searchProducts };