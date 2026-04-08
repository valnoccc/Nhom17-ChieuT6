import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../services/config';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import ProductCard from './ProductCard';

// IMPORT BANNER (Giữ lại ảnh tĩnh cho banner)
// ================= DÙNG ĐƯỜNG DẪN PUBLIC =================
const PLACEHOLDER_IMG = '/images/may_xay_sinh_to_mini_elmich_ble9244.png';

const ProductGrid = ({ title = "Danh sách" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY SẢN PHẨM
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy 7 sản phẩm để cộng với 1 Banner = 8 ô (Vừa đẹp 2 hàng lưới)
        const response = await axios.get("https://nhom17-chieut6.onrender.com/api/products?limit=7");

        if (response.data && response.data.success) {
          // XỬ LÝ DỮ LIỆU: Đổi tên cột từ API cho khớp với ProductCard
          const formattedProducts = response.data.data.map(item => {
            // Xử lý link ảnh
            let imgUrl = PLACEHOLDER_IMG;
            if (item.thumbnail_url) {
              imgUrl = item.thumbnail_url.startsWith('http')
                ? item.thumbnail_url
                : (item.thumbnail_url.startsWith('/images/') ? item.thumbnail_url : `/images/${item.thumbnail_url}`);
            }

            return {
              ...item,
              image: imgUrl,

              oldPrice: item.old_price || item.oldPrice || null,
            };
          });

          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ProductGrid:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-[26px] font-bold text-gray-800 uppercase tracking-tight">{title}</h2>
          <Link to="/products" className="text-[#e30019] hover:underline text-sm font-medium">Xem thêm</Link>
        </div>

        {/* ================= ĐIỀU CHỈNH BỐ CỤC ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 xl:gap-8">

          {/* Ô SỐ 1: LUÔN HIỂN THỊ BANNER */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group h-full flex flex-col">
            <img
              src="/images/banner_binh_giu_nhiet.png"
              alt="Banner Khuyến Mãi"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
            />
          </div>

          {/* CÁC Ô CÒN LẠI: LẶP DỮ LIỆU TỪ API */}
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <FaSpinner className="animate-spin text-[#e30019] text-3xl" />
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}

        </div>

        <div className="mt-14 text-center">
          <Link to="/products" className="border-2 border-[#e30019] text-[#e30019] px-8 py-2.5 rounded font-bold hover:bg-[#e30019] hover:text-white transition duration-300 transform hover:scale-105 active:scale-95 shadow-sm inline-block">
            Xem tất cả {title.toLowerCase()}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;