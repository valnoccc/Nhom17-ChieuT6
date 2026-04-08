// API configuration
// export const API_BASE_URL = 'https://nhom17-chieut6.onrender.com';
export const API_BASE_URL = 'https://nhom17-chieut6.onrender.com'; // Dùng local để kiểm tra lệnh đã sửa

export const API = {
    // User endpoints
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,

    // Product endpoints
    PRODUCTS: `${API_BASE_URL}/api/products`,
    PRODUCT_DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,

    // Admin endpoints
    ADMIN_PRODUCTS: `${API_BASE_URL}/admin/products`,
    ADMIN_CATEGORIES: `${API_BASE_URL}/admin/categories`,
    ADMIN_USERS: `${API_BASE_URL}/admin/users`,
    ADMIN_ORDERS: `${API_BASE_URL}/admin/orders`,
    ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,

    // Image URL
    IMAGE_URL: (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/public/images/${path}`;
    }
};
