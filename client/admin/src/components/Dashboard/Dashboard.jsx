import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PageWrapper from '../Layout/PageWrapper';

//const BASE_URL = "http://localhost:10000";
const BASE_URL = 'https://nhom17-chieut6.onrender.com';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [customImage, setCustomImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsRes = await fetch(`${BASE_URL}/admin/dashboard/stats`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch revenue stats (by month)
      const revenueRes = await fetch(`${BASE_URL}/admin/dashboard/revenue?period=month`);
      const revenueData = await revenueRes.json();
      if (revenueData.success) {
        setRevenueData(revenueData.data);
      }

      // Fetch order status stats
      const orderRes = await fetch(`${BASE_URL}/admin/dashboard/orders-status`);
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrderStatusStats(orderData.data);
      }

      // Fetch all products for category distribution
      const productsRes = await fetch(`${BASE_URL}/admin/products?page=1&limit=9999`);
      const productsData = await productsRes.json();
      if (productsData.success) {
        setAllProducts(productsData.data.products);
      }

      // Fetch all users for user stats
      const usersRes = await fetch(`${BASE_URL}/admin/users?page=1&limit=9999`);
      const usersData = await usersRes.json();
      if (usersData.success) {
        setAllUsers(usersData.data.users);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch dashboard data';
      setError(`Dashboard Error: ${errorMsg}`);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate user role distribution
  const getUserRoleDistribution = () => {
    const admins = allUsers.filter(u => u.role === 'admin').length;
    const customers = allUsers.filter(u => u.role === 'customer').length;
    return [
      { name: 'Admins', value: admins },
      { name: 'Customers', value: customers }
    ];
  };

  // Calculate category distribution
  const getCategoryDistribution = () => {
    const categoryMap = {};
    allProducts.forEach(product => {
      const categoryName = product.category_name || 'Uncategorized';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        // Save to localStorage
        localStorage.setItem('dashboardCustomImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load custom image from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardCustomImage');
    if (saved) {
      setCustomImage(saved);
    }
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const COLORS_ROLE = ['#4F46E5', '#10B981'];
  const COLORS_STATUS = ['#FCD34D', '#3B82F6', '#A855F7', '#10B981', '#EF4444', '#6B7280'];
  const COLORS_CATEGORY = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const userRoleData = getUserRoleDistribution();
  const categoryData = getCategoryDistribution();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalProducts}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalOrders}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
            </div>
          </div>
        </div>

        {/* Charts Row 1 - Revenue Trend and Order Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-80">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={{ fill: '#4F46E5' }}
                      name="Revenue"
                      yAxisId="left"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                      name="Orders Count"
                      yAxisId="right"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No revenue data available
                </div>
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="h-80">
              {orderStatusStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {orderStatusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No order status data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 2 - User Roles and Categories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User Role Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Role Distribution</h3>
            <div className="h-80">
              {userRoleData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_ROLE[index % COLORS_ROLE.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No user data available
                </div>
              )}
            </div>
          </div>

          {/* Product by Category */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Products by Category</h3>
            <div className="h-80">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_CATEGORY[index % COLORS_CATEGORY.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>

       
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
