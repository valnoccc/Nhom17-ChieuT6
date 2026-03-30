import React from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
// =================================================

const ProductCard = ({ product }) => {
  // 2. Gọi hàm addToCart (thêm vào giỏ) từ kho ra để sử dụng
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer relative group">
      
      {/* NHÃN GIẢM GIÁ */}
      {product.discount && (
        <div className="absolute top-0 left-0 z-10 bg-[#e30019] text-white text-[12px] font-bold px-3 py-1 rounded-br-xl shadow-md">
          Giảm {product.discount}%
        </div>
      )}

      {/* KHỐI ẢNH CỐ ĐỊNH CHIỀU CAO */}
      <div className="relative w-full h-[220px] md:h-[240px] bg-white flex items-center justify-center p-4 border-b border-gray-50">
        <img 
          src={product.image || "https://via.placeholder.com/300"} 
          alt={product.name} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* THÔNG TIN SẢN PHẨM */}
      <div className="p-4 lg:p-5 flex flex-col flex-1">
        <h3 className="text-[15px] lg:text-[16px] text-[#333] font-medium mb-2 line-clamp-2 leading-snug group-hover:text-[#e30019] transition-colors h-[44px]">
          {product.name}
        </h3>

        <div className="flex items-center text-yellow-400 text-[14px] mb-4 gap-0.5">
          {[...Array(5)].map((_, i) => (<FaStar key={i} />))}
          <span className="text-gray-400 ml-2 text-[12px] font-normal">(Đánh giá)</span>
        </div>

        <div className="mt-auto flex justify-between items-end gap-2 pt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[#e30019] font-black text-[20px] lg:text-[22px] leading-none">
              {product.price?.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-gray-400 line-through text-[14px] leading-none">
              {product.oldPrice?.toLocaleString('vi-VN')}đ
            </span>
          </div>
          
          {/* 3. Gắn sự kiện onClick gọi hàm addToCart */}
          <button 
            onClick={(e) => {
              e.preventDefault(); 
              addToCart(product); 
            }}
            className="bg-[#e30019] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors shadow-md transform hover:scale-110 mb-1 flex-shrink-0"
          >
            <FaShoppingCart size={16} />
          </button>
          {/* ========================================================== */}
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;