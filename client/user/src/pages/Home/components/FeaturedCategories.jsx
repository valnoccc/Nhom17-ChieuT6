import React from "react";
import { FaShoppingCart, FaChevronRight } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";

// ================= THÊM THƯ VIỆN THÔNG BÁO =================
import { toast } from 'react-toastify';
// ==========================================================

// Import ảnh Danh mục 
import imgBinhGiuNhiet from "../../../images/binh_giu_nhiet.png";
import imgBoNoi from "../../../images/bo_noi.png";
import imgDungCu from "../../../images/dung_cu_nha_bep.png";
import imgMayEp from "../../../images/may_ep.png";
import imgMayXay from "../../../images/may_xay_sinh_to.png";
import imgCeramic from "../../../images/noi_chao_ceramic.png"; 

import imgTop1 from "../../../images/coc_giu_nhiet_inox_304_elmich_el8385_dung_tich_500ml.png";
import imgTop2 from "../../../images/binh_giu_nhiet_inox_316_elmich_el8306_dung_tich_500ml.png";
import imgTop3 from "../../../images/noi_chong_dinh_ceramic_elmich.png";
import imgTop4 from "../../../images/noi_phu_su_chong_dinh_elmich_olive.png";
import imgTop5 from "../../../images/noi_chao_lau_da_nang_inox_lien_khoi_elmich.png";

const vouchers = [
  { id: 1, title: "Voucher Giảm 120K", code: "L7TXMUHVO26M", desc: "Giảm 120.000đ đơn từ 1.000.000đ" },
  { id: 2, title: "Voucher Giảm 200K", code: "1VV3D9YJAYNS", desc: "Giảm 200.000đ đơn từ 1.899.000đ" },
  { id: 3, title: "Voucher Giảm 300K", code: "XOPC0393NT08", desc: "Giảm 300.000đ đơn từ 2.799.000đ" },
  { id: 4, title: "Voucher Giảm 10%", code: "NJRVAXXY4J7E", desc: "Giảm 10% đơn từ 5 triệu" },
];

const topProducts = [
  { id: 11, name: "Cốc giữ nhiệt inox 304 Elmich EL1049 dung tích 550ml", price: 369000, oldPrice: 619000, discount: "Giảm 40%", image: imgTop1 },
  { id: 12, name: "Bình giữ nhiệt inox 316 Elmich EL8311 dung tích 800ml", price: 349000, oldPrice: 779000, discount: "Giảm 55%", image: imgTop2 },
  { id: 13, name: "Nồi chống dính ceramic Elmich Harmony EL5540PT", price: 675000, oldPrice: 1009000, discount: "Giảm 33%", image: imgTop3 },
  { id: 14, name: "Nồi phủ sứ chống dính Elmich Olive Classic EL-5532OV Siz...", price: 525000, oldPrice: 789000, discount: "Giảm 33%", image: imgTop4 },
  { id: 15, name: "Nồi chảo lẩu đa năng Inox liền khối Elmich Trimax XS EL...", price: 925000, oldPrice: 1390000, discount: "Giảm 33%", image: imgTop5 },
];

const categories = [
  { id: 1, name: "Nồi chảo Ceramic", img: imgCeramic },
  { id: 2, name: "Máy xay sinh tố", img: imgMayXay },
  { id: 3, name: "Bình giữ nhiệt", img: imgBinhGiuNhiet },
  { id: 4, name: "Bộ nồi", img: imgBoNoi },
  { id: 5, name: "Máy ép trái cây", img: imgMayEp },
  { id: 6, name: "Bộ dụng cụ nhà bếp", img: imgDungCu },
];

const FeaturedCategories = () => {
  const { addToCart } = useCart();

  // ================= 1. HÀM XỬ LÝ COPY MÃ =================
  const handleCopyCode = (code) => {
    // Gọi API Clipboard của trình duyệt để copy text
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`📋 Đã sao chép mã: ${code}`, {
        position: "top-center", // Hiện ở giữa bên trên cho khách dễ thấy
        autoClose: 2000,
      });
    }).catch(() => {
      toast.error("Không thể sao chép mã lúc này!");
    });
  };

  // ================= 2. HÀM HIỂN THỊ ĐIỀU KIỆN =================
  const handleShowCondition = (desc) => {
    toast.info(`📌 Điều kiện áp dụng: ${desc}`, {
      position: "bottom-right",
      autoClose: 4000,
    });
  };

  return (
    <div className="w-full bg-[#f5f5f5] pt-4 pb-10">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12">

        {/* VOUCHER*/}
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
                  {/* Gắn hàm xử lý vào nút Sao chép */}
                  <button 
                    onClick={() => handleCopyCode(v.code)}
                    className="bg-[#e30019] text-white text-[13px] font-bold px-6 py-2 rounded-full hover:bg-red-800 transition-colors shadow-sm active:scale-95"
                  >
                    Sao chép
                  </button>
                  {/* Gắn hàm xử lý vào nút Điều kiện */}
                  <span 
                    onClick={() => handleShowCondition(v.desc)}
                    className="text-[#007bff] text-[13px] font-medium cursor-pointer hover:underline"
                  >
                    Điều kiện
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOP SẢN PHẨM */}
        <div className="mb-14">
          <h2 className="text-[20px] lg:text-[22px] font-bold text-[#333] mb-6 uppercase">TOP SẢN PHẨM ĐƯỢC QUAN TÂM</h2>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {topProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-[#ebebeb] transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 bg-[#e30019] text-white text-[12px] font-bold px-2.5 py-1 rounded-br-[12px] z-10">{product.discount}</div>
                  <div className="w-full h-[180px] lg:h-[200px] mt-6 mb-2 flex items-center justify-center p-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 p-4 pt-0">
                    <h3 className="text-[15px] lg:text-[16px] text-[#333] font-medium mb-3 line-clamp-2 leading-snug min-h-[44px]">{product.name}</h3>
                    <div className="mt-auto flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[#e30019] text-[18px] font-bold">{product.price.toLocaleString('vi-VN')}đ</span>
                        <span className="text-[#999] text-[13px] line-through">{product.oldPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-[#e30019] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-800 transform hover:scale-110 active:scale-95"
                      >
                        <FaShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[42px] h-[42px] bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center z-20 text-gray-400 hover:text-[#e30019] transition-colors"><FaChevronRight size={18} /></button>
          </div>
        </div>

        {/* DANH MỤC NỔI BẬT */}
        <div>
          <h2 className="text-[20px] lg:text-[22px] font-bold text-[#333] mb-6 uppercase">DANH MỤC NỔI BẬT</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl py-6 px-4 text-center cursor-pointer border border-[#ebebeb] hover:border-[#e30019] hover:shadow-md group flex flex-col items-center justify-between transition-colors">
                <img src={cat.img} alt={cat.name} className="w-[75px] h-[75px] lg:w-[90px] lg:h-[90px] object-contain mb-5 transform group-hover:-translate-y-1.5 group-hover:scale-105 transition-transform duration-300" />
                <p className="text-[14px] xl:text-[15px] font-medium text-[#333] group-hover:text-[#e30019] transition-colors">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;