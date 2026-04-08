const getAllProducts = async (req, res) => {
    const db = req.app.get('db');

    try {
        // TEST THỬ KẾT NỐI TRƯỚC
        await db.query("SELECT 1");

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const sqlCount = "SELECT COUNT(*) as total FROM products";
        const [countResult] = await db.query(sqlCount);
        
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        const sqlData = "SELECT * FROM products ORDER BY id DESC LIMIT ? OFFSET ?";
        const [results] = await db.query(sqlData, [Number(limit), Number(offset)]);

        res.json({
            success: true,
            pagination: { totalItems, totalPages, currentPage: page, limit },
            data: results
        });
    } catch (err) {
        console.error("❌ LỖI API /products:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const getProductById = async (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;

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
    
    try {
        const [results] = await db.query(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }

        const product = results[0];
        if (product.all_images) {
            product.all_images = product.all_images.split(',');
        } else {
            product.all_images = []; 
        }

        res.json({
            success: true,
            message: "Lấy chi tiết sản phẩm thành công",
            data: product
        });
    } catch (err) {
        console.error("LỖI LẤY CHI TIẾT SẢN PHẨM:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const searchProducts = async (req, res) => {
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

    try {
        const [results] = await db.query(sql, params);
        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        console.error("LỖI TÌM KIẾM SẢN PHẨM:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getAllProducts, getProductById, searchProducts };