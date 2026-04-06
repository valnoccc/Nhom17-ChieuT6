import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  // Lắng nghe thay đổi User
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
        fetchCart(user.id);
    } else {
        const savedCart = localStorage.getItem('elmich_cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const fetchCart = async (userId) => {
      try {
          const res = await axios.get(`http://localhost:10000/api/cart/user/${userId}`);
          if (res.data.success) {
              setCartItems(res.data.data);
              setCartId(res.data.cart_id);
          }
      } catch (e) {
          console.error("Lỗi fetch cart:", e);
      }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
        localStorage.setItem('elmich_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ================= ĐÃ SỬA CHỖ NÀY =================
  const addToCart = async (product, quantityToAdd = 1) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // DB chỉ nhận ID là số nguyên int, lọc bỏ hậu tố hoặc tiền tố lạ
    let dbProductId = 1;
    const match = String(product.id).match(/\d+/);
    if (match) {
        dbProductId = parseInt(match[0]);
    }

    if (user && user.id) {
        try {
            await axios.post('http://localhost:10000/api/cart/add', {
                user_id: user.id,
                product_id: dbProductId,
                quantity: quantityToAdd
            });
            fetchCart(user.id);
            toast.success(`🛒 Đã thêm ${quantityToAdd} "${product.name}" vào giỏ!`, { autoClose: 2000, theme: "colored" });
        } catch (error) {
            toast.error("Không thể thêm vào giỏ hàng");
        }
    } else {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === product.id);
          if (existingItem) {
            return prevItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
            );
          } else {
            return [...prevItems, { ...product, quantity: quantityToAdd }];
          }
        });
        toast.success(`🛒 Đã thêm ${quantityToAdd} "${product.name}" vào giỏ!`, { autoClose: 2000, theme: "colored" });
    }
  };
  // ==================================================

  // (Optional) Các hàm xóa sản phẩm hoặc cập nhật ở trang Giỏ hàng nếu bạn có
  const removeFromCart = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.id && cartId) {
        try {
            await axios.delete('http://localhost:10000/api/cart/remove', {
                data: { cart_id: cartId, product_id: id }
            });
            fetchCart(user.id);
            toast.info("🗑️ Đã xóa sản phẩm khỏi giỏ hàng", { autoClose: 1500 });
        } catch (error) {}
    } else {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.info("🗑️ Đã xóa sản phẩm khỏi giỏ hàng", { autoClose: 1500 });
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.id && cartId) {
        try {
            await axios.put('http://localhost:10000/api/cart/update', {
                cart_id: cartId,
                product_id: id,
                quantity: newQuantity
            });
            fetchCart(user.id);
        } catch (error) {}
    } else {
        setCartItems(prevItems =>
          prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
        );
    }
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