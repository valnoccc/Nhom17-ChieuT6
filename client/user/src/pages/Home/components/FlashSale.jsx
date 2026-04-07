import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaStar, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import axios from "axios";
import { API } from "../../../services/config";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x300?text=Elmich+S%E1%BA%A3n+Ph%E1%BA%A9m";

const FlashSale = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // HÀM XỬ LÝ ẢNH
  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;

    // Lacoste kiểm tra xem folder ảnh của bạn tên là gì nhé (vd: images hay product-img)
    const finalUrl = `https://nhom17-chieut6.onrender.com/public/images/${url}`;

    // Dòng này để bạn copy link dán lên trình duyệt test xem ảnh có tồn tại không
    console.log("Link ảnh kiểm tra:", finalUrl);

    return finalUrl;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://nhom17-chieut6.onrender.com/api/products?page=1&limit=5");
        if (response.data && response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Bộ đếm giờ
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h: h < 10 ? `0${h}` : h, m: m < 10 ? `0${m}` : m, s: s < 10 ? `0${s}` : s };
  };
  const t = formatTime(timeLeft);

  return (
    <section className="my-10 w-full px-4 md:px-10 lg:px-16 xl:px-24">
      <div className="w-full">
        <div className="bg-[#f04e6c] rounded-2xl p-6 lg:p-10 shadow-lg w-full">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center italic font-black transform -skew-x-12 bg-yellow-400 py-2 px-4 rounded">
                <span className="text-red-600 text-[11px]">Flash</span>
                <span className="text-white text-[18px]">Sale</span>
              </div>
              <h2 className="text-[22px] lg:text-[32px] font-black text-white italic uppercase tracking-wide">
                GIÁ TỐT MỖI NGÀY
              </h2>
            </div>

            <div className="flex items-center gap-2 text-white font-bold">
              <span className="bg-[#d71920] px-3 py-1 rounded">{t.h}</span>
              <span>:</span>
              <span className="bg-[#d71920] px-3 py-1 rounded">{t.m}</span>
              <span>:</span>
              <span className="bg-[#d71920] px-3 py-1 rounded animate-pulse">{t.s}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-white text-3xl" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl p-4 flex flex-col h-full group shadow-md hover:shadow-xl transition-all">
                  <Link to={`/product/${product.id}`} className="w-full mb-4 pt-4 flex flex-col items-center h-[180px]">
                    <img
                      src={getImageUrl(product.thumbnail_url)}
                      alt={product.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                      className="h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 min-h-[40px] mb-2 hover:text-[#ed1c24]">{product.name}</h3>
                  </Link>

                  <div className="flex justify-between items-center mt-auto pt-3 border-t">
                    <span className="text-[#ed1c24] font-black text-[18px]">
                      {Number(product.price).toLocaleString()}đ
                    </span>
                    <button onClick={() => addToCart(product)} className="bg-[#ed1c24] text-white p-2 rounded-lg hover:bg-red-700">
                      <FaShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;