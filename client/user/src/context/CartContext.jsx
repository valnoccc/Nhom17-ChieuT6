// Import thêm useEffect để theo dõi sự thay đổi
import React, { createContext, useState, useContext, useEffect } from 'react';
// ================= THÊM DÒNG NÀY =================
import { toast } from 'react-toastify';
// ==================================================

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Khởi tạo giỏ hàng từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('elmich_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Lưu vào localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('elmich_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ================= ĐÃ SỬA CHỖ NÀY =================
  // Thêm tham số quantityToAdd (mặc định là 1 nếu không truyền vào)
  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Nếu đã có trong giỏ, cộng thêm số lượng khách vừa chọn
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        // Nếu chưa có, thêm mới với số lượng khách chọn
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });

    // Thay thế alert bằng toast siêu đẹp
    toast.success(`🛒 Đã thêm ${quantityToAdd} "${product.name}" vào giỏ!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };
  // ==================================================

  // (Optional) Các hàm xóa sản phẩm hoặc cập nhật ở trang Giỏ hàng nếu bạn có
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info("🗑️ Đã xóa sản phẩm khỏi giỏ hàng", { autoClose: 1500 });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};