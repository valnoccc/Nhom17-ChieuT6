import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { FaShippingFast, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

// ẢNH DỰ PHÒNG KHI LỖI
const PLACEHOLDER_IMG = "https://via.placeholder.com/150?text=Elmich";

const CartPage = () => {
  const { cartItems, setCartItems } = useCart();

  // ================= HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH =================
  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;
    return `http://localhost:10000/public/images/${url}`; 
  };

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Hàm xóa sản phẩm
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Hàm tăng/giảm số lượng
  const updateQuantity = (id, amount) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + amount;
        // Đảm bảo số lượng không bị tụt xuống dưới 1
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <Header />

      <main className="flex-grow py-10">
        <div className="max-w-[1200px] mx-auto px-4 bg-white py-8 shadow-sm rounded-sm">
          
          {/* Nút MUA THÊM ở trên cùng */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <button className="bg-[#e30019] text-white px-8 py-2.5 rounded text-[14px] font-medium hover:bg-red-800 transition-colors">
                MUA THÊM
              </button>
            </Link>
          </div>

          <h2 className="text-[20px] font-bold text-gray-800 mb-6 uppercase tracking-wide">
            Giỏ hàng
          </h2>

          {/* HIỂN THỊ KHI GIỎ HÀNG TRỐNG */}
          {cartItems.length === 0 ? (
            <div className="bg-[#fff8e5] border border-yellow-200 text-[#856404] px-6 py-4 text-[14px] rounded-sm">
              Không có sản phẩm nào. Quay lại <Link to="/" className="font-bold hover:underline">cửa hàng</Link> để tiếp tục mua sắm.
            </div>
          ) : (
            /* HIỂN THỊ KHI CÓ SẢN PHẨM */
            <div>
              {/* Tiêu đề bảng */}
              <div className="grid grid-cols-12 gap-4 bg-[#f5f5f5] py-3 px-4 font-bold text-[14px] text-gray-700 hidden md:grid">
                <div className="col-span-6">Sản Phẩm</div>
                <div className="col-span-2 text-center">Đơn Giá</div>
                <div className="col-span-2 text-center">Số Lượng</div>
                <div className="col-span-2 text-center">Tổng</div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-4 border-b border-gray-100 last:border-0">
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      {/* ĐÃ SỬA: Dùng getImageUrl và check fallback thumbnail_url */}
                      <img 
                        src={getImageUrl(item.thumbnail_url || item.image)} 
                        alt={item.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                        className="w-20 h-20 object-contain border border-gray-100 p-1" 
                      />
                      <Link to={`/product/${item.id}`} className="text-[15px] font-medium text-gray-800 hover:text-[#e30019] cursor-pointer">
                        {item.name}
                      </Link>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-center text-[#e30019] font-bold text-[15px]">
                      {Number(item.price).toLocaleString('vi-VN')} đ
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        >−</button>
                        
                        <input type="text" value={item.quantity} readOnly className="w-10 text-center text-[14px] outline-none border-l border-r border-gray-300 py-1.5 bg-white" />
                        
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        >+</button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center justify-between mt-4 md:mt-0">
                      <span className="text-[#e30019] font-bold text-[15px] w-full text-center">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="border border-[#e30019] text-[#e30019] px-3 py-1 rounded text-[13px] hover:bg-[#e30019] hover:text-white transition-colors"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phần tổng kết bên dưới */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-8 px-4">
                <div className="flex gap-8 text-[14px] text-gray-600 mb-6 lg:mb-0">
                  <div className="flex items-center gap-2">
                    <FaShippingFast size={24} className="text-gray-400" />
                    <span>Freeship đơn hàng ≥ 1.000.000đ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShieldAlt size={22} className="text-gray-400" />
                    <span>Bảo hành đổi trả 30 ngày (*)</span>
                  </div>
                </div>

                <div className="w-full lg:w-auto text-right">
                  <div className="flex justify-between lg:justify-end gap-16 mb-2 text-[15px]">
                    <span className="text-gray-600">Tổng tiền tạm tính:</span>
                    <span className="font-medium text-gray-800">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between lg:justify-end gap-16 items-center mb-6">
                    <span className="font-bold text-gray-800 text-[16px]">Tổng tiền:</span>
                    <span className="font-bold text-[#e30019] text-[24px]">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                  </div>
                  
                  <Link to="/checkout">
                    <button className="w-full lg:w-auto bg-[#e30019] text-white px-12 py-3 rounded text-[15px] font-medium hover:bg-red-800 transition-colors shadow-sm">
                      TIẾN HÀNH THANH TOÁN
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;