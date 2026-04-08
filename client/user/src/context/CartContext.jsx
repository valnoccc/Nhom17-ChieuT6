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
      const res = await axios.get(`https://nhom17-chieut6.onrender.com/api/cart/user/${userId}`);
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
  const addToCart = async (product, quantityToAdd = 1, showToast = true) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // DB chỉ nhận ID là số nguyên int, lọc bỏ hậu tố hoặc tiền tố lạ
    let dbProductId = 1;
    const match = String(product.id).match(/\d+/);
    if (match) {
      dbProductId = parseInt(match[0]);
    }

    if (user && user.id) {
      try {
        const res = await axios.post('https://nhom17-chieut6.onrender.com/api/cart/add', {
          user_id: user.id,
          product_id: dbProductId,
          quantity: quantityToAdd
        });
        
        // KIỂM TRA LỖI TRẢ VỀ TỪ BACKEND
        if (res.data && res.data.success === false) {
           throw new Error(res.data.message || "Sản phẩm không có ID hợp lệ hoặc hết hàng!");
        }

        await fetchCart(user.id); // BẮT BUỘC ĐỢI đồng bộ State xong mới đi tiếp
        if (showToast) {
            toast.success(`🛒 Đã thêm ${quantityToAdd} "${product.name}" vào giỏ!`, { autoClose: 2000, theme: "colored" });
        }
      } catch (error) {
        toast.error(error.message || "Không thể thêm vào giỏ hàng vì lỗi máy chủ.");
        throw error; // BẮT BUỘC: Ném lỗi ra ngoài để Promise.all chặn được luồng Navigate
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
      if (showToast) {
          toast.success(`🛒 Đã thêm ${quantityToAdd} "${product.name}" vào giỏ!`, { autoClose: 2000, theme: "colored" });
      }
    }
  };
  // ==================================================

  // (Optional) Các hàm xóa sản phẩm hoặc cập nhật ở trang Giỏ hàng nếu bạn có
  const removeFromCart = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.id && cartId) {
      try {
        await axios.delete('https://nhom17-chieut6.onrender.com/api/cart/remove', {
          data: { cart_id: cartId, product_id: id }
        });
        await fetchCart(user.id);
        toast.info("🗑️ Đã xóa sản phẩm khỏi giỏ hàng", { autoClose: 1500 });
      } catch (error) { }
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
        await axios.put('https://nhom17-chieut6.onrender.com/api/cart/update', {
          cart_id: cartId,
          product_id: id,
          quantity: newQuantity
        });
        await fetchCart(user.id);
      } catch (error) { }
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};