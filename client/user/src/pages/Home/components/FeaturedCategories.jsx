import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaChevronRight, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { toast } from 'react-toastify';
import axios from "axios";

const PLACEHOLDER_IMG = '/images/may_xay_sinh_to_mini_elmich_ble9244.png';

const vouchers = [
  { id: 1, title: "Voucher Giảm 120K", code: "L7TXMUHVO26M", desc: "Giảm 120.000đ đơn từ 1.000.000đ" },
  { id: 2, title: "Voucher Giảm 200K", code: "1VV3D9YJAYNS", desc: "Giảm 200.000đ đơn từ 1.899.000đ" },
  { id: 3, title: "Voucher Giảm 300K", code: "XOPC0393NT08", desc: "Giảm 300.000đ đơn từ 2.799.000đ" },
  { id: 4, title: "Voucher Giảm 10%", code: "NJRVAXXY4J7E", desc: "Giảm 10% đơn từ 5 triệu" },
];

const FeaturedCategories = () => {
  const { addToCart } = useCart();
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;
    return url.startsWith('/images/') ? url : `/images/${url}`;
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await axios.get("https://nhom17-chieut6.onrender.com/api/products?limit=5");
        if (response.data && response.data.success) {
          setTopProducts(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi API Top Sản Phẩm:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchTopProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("https://nhom17-chieut6.onrender.com/api/categories");
        // Giả sử API trả về { success: true, data: [...] } hoặc trực tiếp array
        const list = response.data.data || response.data || [];
        setCategories(list.slice(0, 6)); // Lấy 6 danh mục đầu tiên
      } catch (error) {
        console.error("Lỗi API Danh Mục:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`📋 Đã sao chép mã: ${code}`, { position: "top-center", autoClose: 2000 });
    });
  };

  return (
    <div className="w-full bg-[#f5f5f5] pt-4 pb-10">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-12">
          {vouchers.map((v) => (
            <div key={v.id} style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.06))' }} className="h-full group hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white h-full p-5 lg:p-6 flex flex-col justify-between relative"
                style={{ clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 5%, calc(100% - 6px) 10%, 100% 15%, calc(100% - 6px) 20%, 100% 25%, calc(100% - 6px) 30%, 100% 35%, calc(100% - 6px) 40%, 100% 45%, calc(100% - 6px) 50%, 100% 55%, calc(100% - 6px) 60%, 100% 65%, calc(100% - 6px) 70%, 100% 75%, calc(100% - 6px) 80%, 100% 85%, calc(100% - 6px) 90%, 100% 95%, calc(100% - 6px) 100%, 6px 100%, 0% 95%, 6px 90%, 0% 85%, 6px 80%, 0% 75%, 6px 70%, 0% 65%, 6px 60%, 0% 55%, 6px 50%, 0% 45%, 6px 40%, 0% 35%, 6px 30%, 0% 25%, 6px 20%, 0% 15%, 6px 10%, 0% 5%)' }}>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-800 mb-2 uppercase">{v.title}</h3>
                  <p className="text-[13px] text-gray-500 mb-1 leading-snug">NHẬP MÃ 🏷️ <span className="font-extrabold text-gray-800">{v.code}</span></p>
                  <p className="text-[13px] text-gray-500 leading-snug mb-4">{v.desc}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <button onClick={() => handleCopyCode(v.code)} className="bg-[#e30019] text-white text-[13px] font-bold px-6 py-2 rounded-full hover:bg-red-800 shadow-sm active:scale-95">Sao chép</button>
                  <span className="text-[#007bff] text-[13px] font-medium cursor-pointer hover:underline">Điều kiện</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-14">
          <h2 className="text-[20px] lg:text-[22px] font-bold text-[#333] mb-6 uppercase">TOP SẢN PHẨM ĐƯỢC QUAN TÂM</h2>
          <div className="relative">
            {loadingProducts ? (
              <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-[#e30019] text-3xl" /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {topProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-[#ebebeb] p-4 flex flex-col h-full relative group">
                    <Link to={`/product/${product.id}`} className="w-full h-[180px] mt-6 mb-2 flex items-center justify-center">
                      <img src={getImageUrl(product.thumbnail_url)} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform" />
                    </Link>
                    <Link to={`/product/${product.id}`}><h3 className="text-[15px] text-[#333] font-medium mb-3 line-clamp-2 min-h-[44px] hover:text-[#e30019]">{product.name}</h3></Link>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-[#e30019] text-[18px] font-bold">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                      <button onClick={() => addToCart(product)} className="bg-[#e30019] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-800"><FaShoppingCart size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-[20px] lg:text-[22px] font-bold text-[#333] mb-6 uppercase">DANH MỤC NỔI BẬT</h2>
          {loadingCategories ? (
            <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-[#e30019] text-3xl" /></div>
          ) : (
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${categories.length === 4 ? 'lg:grid-cols-4' : categories.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-4 md:gap-6`}>
              {categories.map((cat) => (
                <Link to="/products" state={{ category: cat.name }} key={cat.id} className="bg-white rounded-xl py-6 px-4 text-center cursor-pointer border border-[#ebebeb] hover:border-[#e30019] transition-all group shadow-sm hover:shadow-md hover:-translate-y-1">
                  <img src={getImageUrl(cat.thumbnail_url)} alt={cat.name} className="w-[75px] h-[75px] object-contain mb-5 mx-auto group-hover:-translate-y-1.5 transition-transform duration-300" />
                  <p className="text-[14px] font-medium text-[#333] group-hover:text-[#e30019]">{cat.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FeaturedCategories;