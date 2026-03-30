import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 

// ================= THÊM THƯ VIỆN THÔNG BÁO =================
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ==========================================================

// Import Providers
import { CartProvider } from './context/CartContext'; 

// Import Pages
import HomePage from './pages/Home/HomePage';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ProductListPage from './pages/ProductList/ProductListPage';
import OrderHistoryPage from './pages/Account/OrderHistoryPage'; 
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage';
import PostDetailPage from './pages/Blog/PostDetailPage';
// Component con để xử lý hiệu ứng chuyển động khi đổi URL
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/account/orders" element={<OrderHistoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/blog/:id" element={<PostDetailPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AnimatedRoutes />
        
        {/* Cấu hình cho thông báo hiện lên đẹp mắt */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </CartProvider>
  );
}

export default App;