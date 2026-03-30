const { responseHandler, validateRequired } = require('../../utils/helpers');

const adminController = {
    // ============ USERS MANAGEMENT ============

    getAllUsers: (req, res) => {
        const db = req.app.get('db');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        db.query(
            "SELECT id, full_name, email, phone, address, role, created_at FROM users LIMIT ? OFFSET ?",
            [limit, offset],
            (err, results) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy danh sách người dùng', 500);
                }

                // Lấy tổng số user
                db.query("SELECT COUNT(*) as total FROM users", (countErr, countResult) => {
                    if (countErr) {
                        return responseHandler.error(res, countErr, 'Lỗi đếm tổng user', 500);
                    }

                    responseHandler.success(res, {
                        users: results,
                        total: countResult[0].total,
                        page,
                        limit,
                        pages: Math.ceil(countResult[0].total / limit)
                    }, 'Lấy danh sách người dùng thành công');
                });
            }
        );
    },

    getUserById: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "SELECT id, full_name, email, phone, address, role, created_at FROM users WHERE id = ?",
            [id],
            (err, results) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy thông tin người dùng', 500);
                }
                if (results.length === 0) {
                    return responseHandler.error(res, 'Không tìm thấy người dùng', 'Người dùng không tồn tại', 404);
                }
                responseHandler.success(res, results[0], 'Lấy thông tin người dùng thành công');
            }
        );
    },

    updateUserRole: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['admin', 'customer'].includes(role)) {
            return responseHandler.error(res, 'Role không hợp lệ', 'Role phải là admin hoặc customer', 400);
        }

        db.query(
            "UPDATE users SET role = ? WHERE id = ?",
            [role, id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi cập nhật quyền', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy người dùng', 'Người dùng không tồn tại', 404);
                }
                responseHandler.success(res, { id, role }, 'Cập nhật quyền thành công');
            }
        );
    },

    deleteUser: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        // Kiểm tra không được xóa chính mình
        if (req.user && req.user.id == id) {
            return responseHandler.error(res, 'Không thể xóa tài khoản của chính mình', '', 400);
        }

        db.query(
            "DELETE FROM users WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi xóa người dùng', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy người dùng', 'Người dùng không tồn tại', 404);
                }
                responseHandler.success(res, { id }, 'Xóa người dùng thành công');
            }
        );
    },

    // ============ PRODUCTS MANAGEMENT ============

    getAllProducts: (req, res) => {
        const db = req.app.get('db');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const category_id = req.query.category_id;

        let query = "SELECT p.id, p.category_id, p.name, p.description, p.price, p.stock_quantity, p.thumbnail_url, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id";
        let queryParams = [];

        if (category_id) {
            query += " WHERE p.category_id = ?";
            queryParams.push(category_id);
        }

        query += " LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        db.query(query, queryParams, (err, results) => {
            if (err) {
                return responseHandler.error(res, err, 'Lỗi khi lấy danh sách sản phẩm', 500);
            }

            let countQuery = "SELECT COUNT(*) as total FROM products";
            let countParams = [];
            if (category_id) {
                countQuery += " WHERE category_id = ?";
                countParams.push(category_id);
            }

            db.query(countQuery, countParams, (countErr, countResult) => {
                if (countErr) {
                    return responseHandler.error(res, countErr, 'Lỗi đếm tổng sản phẩm', 500);
                }

                responseHandler.success(res, {
                    products: results,
                    total: countResult[0].total,
                    page,
                    limit,
                    pages: Math.ceil(countResult[0].total / limit)
                }, 'Lấy danh sách sản phẩm thành công');
            });
        });
    },

    getProductById: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "SELECT p.id, p.category_id, p.name, p.description, p.price, p.stock_quantity, p.thumbnail_url, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?",
            [id],
            (err, results) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy sản phẩm', 500);
                }
                if (results.length === 0) {
                    return responseHandler.error(res, 'Không tìm thấy sản phẩm', 'Sản phẩm không tồn tại', 404);
                }

                // Lấy các ảnh của sản phẩm
                db.query(
                    "SELECT id, image_url, alt_text FROM product_images WHERE product_id = ?",
                    [id],
                    (imgErr, images) => {
                        if (!imgErr) {
                            results[0].images = images;
                        }
                        responseHandler.success(res, results[0], 'Lấy thông tin sản phẩm thành công');
                    }
                );
            }
        );
    },

    addProduct: (req, res) => {
        const db = req.app.get('db');
        const { name, description, price, stock_quantity, category_id, thumbnail_url } = req.body;

        if (!validateRequired([name, price])) {
            return responseHandler.error(res, 'Dữ liệu không đầy đủ', 'Tên và giá là bắt buộc', 400);
        }

        db.query(
            "INSERT INTO products (name, description, price, stock_quantity, category_id, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)",
            [name, description || null, price, stock_quantity || 0, category_id || null, thumbnail_url || null],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi thêm sản phẩm', 500);
                }
                responseHandler.success(res, { id: result.insertId, name, price }, 'Thêm sản phẩm thành công', 201);
            }
        );
    },

    updateProduct: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { name, description, price, stock_quantity, category_id, thumbnail_url } = req.body;

        if (!validateRequired([name, price])) {
            return responseHandler.error(res, 'Dữ liệu không đầy đủ', 'Tên và giá là bắt buộc', 400);
        }

        db.query(
            "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, thumbnail_url = ? WHERE id = ?",
            [name, description || null, price, stock_quantity || 0, category_id || null, thumbnail_url || null, id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi cập nhật sản phẩm', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy sản phẩm', 'Sản phẩm không tồn tại', 404);
                }
                responseHandler.success(res, { id, name, price }, 'Cập nhật sản phẩm thành công');
            }
        );
    },

    deleteProduct: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "DELETE FROM products WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi xóa sản phẩm', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy sản phẩm', 'Sản phẩm không tồn tại', 404);
                }
                responseHandler.success(res, { id }, 'Xóa sản phẩm thành công');
            }
        );
    },

    // ============ CATEGORIES MANAGEMENT ============

    getAllCategories: (req, res) => {
        const db = req.app.get('db');

        db.query(
            "SELECT id, name, description FROM categories",
            (err, results) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy danh sách danh mục', 500);
                }
                responseHandler.success(res, results, 'Lấy danh sách danh mục thành công');
            }
        );
    },

    getCategoryById: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "SELECT id, name, description FROM categories WHERE id = ?",
            [id],
            (err, results) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy danh mục', 500);
                }
                if (results.length === 0) {
                    return responseHandler.error(res, 'Không tìm thấy danh mục', 'Danh mục không tồn tại', 404);
                }
                responseHandler.success(res, results[0], 'Lấy thông tin danh mục thành công');
            }
        );
    },

    addCategory: (req, res) => {
        const db = req.app.get('db');
        const { name, description } = req.body;

        if (!validateRequired([name])) {
            return responseHandler.error(res, 'Dữ liệu không đầy đủ', 'Tên danh mục là bắt buộc', 400);
        }

        db.query(
            "INSERT INTO categories (name, description) VALUES (?, ?)",
            [name, description || null],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi thêm danh mục', 500);
                }
                responseHandler.success(res, { id: result.insertId, name }, 'Thêm danh mục thành công', 201);
            }
        );
    },

    updateCategory: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { name, description } = req.body;

        if (!validateRequired([name])) {
            return responseHandler.error(res, 'Dữ liệu không đầy đủ', 'Tên danh mục là bắt buộc', 400);
        }

        db.query(
            "UPDATE categories SET name = ?, description = ? WHERE id = ?",
            [name, description || null, id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi cập nhật danh mục', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy danh mục', 'Danh mục không tồn tại', 404);
                }
                responseHandler.success(res, { id, name }, 'Cập nhật danh mục thành công');
            }
        );
    },

    deleteCategory: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "DELETE FROM categories WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi xóa danh mục', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy danh mục', 'Danh mục không tồn tại', 404);
                }
                responseHandler.success(res, { id }, 'Xóa danh mục thành công');
            }
        );
    },

    // ============ ORDERS MANAGEMENT ============

    getAllOrders: (req, res) => {
        const db = req.app.get('db');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const status = req.query.status;

        let query = "SELECT o.id, o.user_id, o.total_amount, o.shipping_address, o.status, o.created_at, u.full_name, u.email FROM orders o JOIN users u ON o.user_id = u.id";
        let queryParams = [];

        if (status) {
            query += " WHERE o.status = ?";
            queryParams.push(status);
        }

        query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        db.query(query, queryParams, (err, results) => {
            if (err) {
                return responseHandler.error(res, err, 'Lỗi khi lấy danh sách đơn hàng', 500);
            }

            let countQuery = "SELECT COUNT(*) as total FROM orders";
            let countParams = [];
            if (status) {
                countQuery += " WHERE status = ?";
                countParams.push(status);
            }

            db.query(countQuery, countParams, (countErr, countResult) => {
                if (countErr) {
                    return responseHandler.error(res, countErr, 'Lỗi đếm tổng đơn hàng', 500);
                }

                responseHandler.success(res, {
                    orders: results,
                    total: countResult[0].total,
                    page,
                    limit,
                    pages: Math.ceil(countResult[0].total / limit)
                }, 'Lấy danh sách đơn hàng thành công');
            });
        });
    },

    getOrderById: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;

        db.query(
            "SELECT o.id, o.user_id, o.total_amount, o.shipping_address, o.status, o.created_at, u.full_name, u.email, u.phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?",
            [id],
            (err, orderResults) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi lấy đơn hàng', 500);
                }
                if (orderResults.length === 0) {
                    return responseHandler.error(res, 'Không tìm thấy đơn hàng', 'Đơn hàng không tồn tại', 404);
                }

                // Lấy chi tiết đơn hàng
                db.query(
                    "SELECT od.id, od.product_id, od.quantity, od.unit_price, p.name, p.thumbnail_url FROM order_details od JOIN products p ON od.product_id = p.id WHERE od.order_id = ?",
                    [id],
                    (detailErr, details) => {
                        if (detailErr) {
                            return responseHandler.error(res, detailErr, 'Lỗi khi lấy chi tiết đơn hàng', 500);
                        }

                        const order = orderResults[0];
                        order.items = details;
                        responseHandler.success(res, order, 'Lấy thông tin đơn hàng thành công');
                    }
                );
            }
        );
    },

    updateOrderStatus: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return responseHandler.error(res, 'Trạng thái không hợp lệ', `Trạng thái phải là: ${validStatuses.join(', ')}`, 400);
        }

        db.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id],
            (err, result) => {
                if (err) {
                    return responseHandler.error(res, err, 'Lỗi khi cập nhật trạng thái đơn hàng', 500);
                }
                if (result.affectedRows === 0) {
                    return responseHandler.error(res, 'Không tìm thấy đơn hàng', 'Đơn hàng không tồn tại', 404);
                }
                responseHandler.success(res, { id, status }, 'Cập nhật trạng thái đơn hàng thành công');
            }
        );
    },

    // ============ DASHBOARD & STATISTICS ============

    getDashboardStats: (req, res) => {
        const db = req.app.get('db');

        const queries = [
            { query: "SELECT COUNT(*) as total FROM users", key: 'totalUsers' },
            { query: "SELECT COUNT(*) as total FROM products", key: 'totalProducts' },
            { query: "SELECT COUNT(*) as total FROM orders", key: 'totalOrders' },
            { query: "SELECT SUM(total_amount) as revenue FROM orders WHERE status = 'Delivered'", key: 'totalRevenue' }
        ];

        const stats = {};
        let completed = 0;

        queries.forEach(({ query, key }) => {
            db.query(query, (err, results) => {
                if (!err) {
                    stats[key] = results[0].total || results[0].revenue || 0;
                }
                completed++;

                if (completed === queries.length) {
                    responseHandler.success(res, stats, 'Lấy thống kê dashboard thành công');
                }
            });
        });
    },

    getRevenueStats: (req, res) => {
        const db = req.app.get('db');
        const period = req.query.period || 'month'; // 'day', 'month', or 'year'

        let dateFormat = '%Y-%m';
        if (period === 'day') dateFormat = '%Y-%m-%d';
        if (period === 'year') dateFormat = '%Y';

        const query = `
            SELECT 
                DATE_FORMAT(created_at, '${dateFormat}') as period,
                SUM(total_amount) as revenue,
                COUNT(*) as orders
            FROM orders
            WHERE status = 'Delivered'
            GROUP BY DATE_FORMAT(created_at, '${dateFormat}')
            ORDER BY period ASC
        `;

        db.query(query, (err, results) => {
            if (err) {
                return responseHandler.error(res, err, 'Lỗi khi lấy thống kê doanh thu', 500);
            }
            responseHandler.success(res, results, 'Lấy thống kê doanh thu thành công');
        });
    },

    getOrderStatusStats: (req, res) => {
        const db = req.app.get('db');

        const query = `
            SELECT status, COUNT(*) as count
            FROM orders
            GROUP BY status
        `;

        db.query(query, (err, results) => {
            if (err) {
                return responseHandler.error(res, err, 'Lỗi khi lấy thống kê trạng thái đơn hàng', 500);
            }
            responseHandler.success(res, results, 'Lấy thống kê trạng thái đơn hàng thành công');
        });
    }
};

module.exports = adminController;