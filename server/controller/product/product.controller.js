// Lấy danh sách sản phẩm với phân trang
const getAllProducts = (req, res) => {
    const db = req.app.get('db');

    // 1. Lấy tham số từ Query String (ví dụ: ?page=1&limit=5)
    // Nếu không truyền thì mặc định page 1, mỗi trang 10 sản phẩm
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    // 2. Câu lệnh lấy dữ liệu có LIMIT và OFFSET
    const sqlData = `
        SELECT id, category_id, name, price, stock_quantity, thumbnail_url 
        FROM products 
        ORDER BY id DESC 
        LIMIT ? OFFSET ?
    `;

    // 3. Câu lệnh đếm tổng số sản phẩm (để Frontend biết có tổng bao nhiêu trang)
    const sqlCount = "SELECT COUNT(*) as total FROM products";

    // Thực hiện đếm tổng trước
    db.query(sqlCount, (err, countResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Sau đó mới lấy dữ liệu trang hiện tại
        db.query(sqlData, [limit, offset], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                success: true,
                message: "Lấy danh sách sản phẩm thành công",
                pagination: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: page,
                    limit: limit
                },
                data: results
            });
        });
    });
};

// Lấy chi tiết sản phẩm theo ID
const getProductById = (req, res) => {
    
    const db = req.app.get('db');
    const id = req.params.id;
    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            message: "Lấy chi tiết sản phẩm thành công",
            data: results[0]
        });
    });
};

//tìm kiếm sản phẩm 
const searchProducts = (req, res) => {
    const db = req.app.get('db');

    // Lấy các tham số từ Query String (?name=...&minPrice=...&maxPrice=...)
    const { name, minPrice, maxPrice } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    // Nếu có truyền tên sản phẩm
    if (name) {
        sql += " AND name LIKE ?";
        params.push(`%${name}%`); // Tìm kiếm tương đối (chứa từ khóa)
    }

    // Nếu có truyền giá thấp nhất
    if (minPrice) {
        sql += " AND price >= ?";
        params.push(parseFloat(minPrice));
    }

    // Nếu có truyền giá cao nhất
    if (maxPrice) {
        sql += " AND price <= ?";
        params.push(parseFloat(maxPrice));
    }

    sql += " ORDER BY id DESC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

module.exports = { getAllProducts, getProductById, searchProducts };