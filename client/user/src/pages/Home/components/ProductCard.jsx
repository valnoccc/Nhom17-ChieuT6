import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn việc click giỏ hàng bị nhảy trang
    addToCart(product);
  };

  // ================= XỬ LÝ ĐỊNH DẠNG TIỀN TỆ Ở ĐÂY =================
  // Dùng Number() để ép kiểu bỏ đuôi .00, sau đó dùng toLocaleString để thêm dấu chấm
  const formattedPrice = Number(product.price).toLocaleString('vi-VN');
  const formattedOldPrice = product.oldPrice ? Number(product.oldPrice).toLocaleString('vi-VN') : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-[#ebebeb] transition-all duration-300 group flex flex-col h-full overflow-hidden relative p-4">
      
      {/* Ảnh sản phẩm */}
      <Link to={`/product/${product.id}`} className="w-full h-[180px] mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" 
        />
      </Link>

      <div className="flex flex-col flex-1">
        {/* Tên sản phẩm */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[14px] lg:text-[15px] text-[#333] font-medium mb-2 line-clamp-2 leading-snug min-h-[44px] hover:text-[#e30019] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Đánh giá sao */}
        <div className="flex items-center gap-1 text-yellow-400 text-[12px] mb-3">
          {[...Array(product.rating || 5)].map((_, i) => <FaStar key={i} />)}
          <span className="text-gray-400 ml-1 text-[11px]">(Đánh giá)</span>
        </div>

        {/* Khung Giá & Nút Thêm Giỏ Hàng */}
        <div className="mt-auto flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[#e30019] text-[18px] lg:text-[20px] font-bold">
              {formattedPrice}đ
            </span>
            {formattedOldPrice && (
              <span className="text-[#999] text-[13px] line-through mt-0.5">
                {formattedOldPrice}đ
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-[#e30019] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-800 transform hover:scale-110 active:scale-95 transition-all flex-shrink-0"
          >
            <FaShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;