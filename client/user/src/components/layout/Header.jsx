import React from "react";
// ĐÃ THÊM: Import thư viện Link để chuyển trang không bị load lại web
import { Link } from "react-router-dom"; 
import {
  FaSearch,
  FaShoppingCart,
  FaPhoneAlt,
  FaRegUser,
  FaBars,
} from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full font-sans bg-[#f5f5f5]">
      {/* 🔴 TOP PROMO */}
      <div className="bg-[#d71920] text-white text-[15px] py-2">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
          <span className="font-medium tracking-wide">
            🎁 Chào mừng bạn tới Elmich - Ưu đãi tháng này!
          </span>
          <button className="bg-white text-[#d71920] px-5 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-300 hover:text-red-700 transition-colors shadow-sm">
            XEM NGAY
          </button>
        </div>
      </div>

      {/* ⚪ HEADER MAIN */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex items-center gap-8">
          {/* LOGO */}
          <Link to="/">
            <h1 className="text-[44px] font-black text-[#ed1c24] italic tracking-tighter cursor-pointer hover:scale-105 transition-transform">
              elmich
            </h1>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-[650px]">
            <div className="flex border-[2px] border-[#ed1c24] rounded-full overflow-hidden h-[46px] bg-white hover:shadow-md transition-shadow">
              <input
                type="text"
                placeholder="Nhập tên hoặc mã sản phẩm..."
                className="flex-1 px-5 text-[15px] outline-none text-gray-700"
              />
              <button className="bg-[#ed1c24] text-white px-8 text-[16px] font-bold hover:bg-red-800 transition-colors flex items-center justify-center">
                <FaSearch />
              </button>
            </div>

            {/* SUGGEST */}
            <div className="flex gap-3 mt-3 text-[13px] font-medium">
              <span className="text-gray-500">Top tìm kiếm:</span>
              {["Nồi inox", "Máy hút ẩm", "Thay lõi lọc"].map((item, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-[#ed1c24] hover:text-white cursor-pointer transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-8 ml-auto">
            {/* HOTLINE */}
            <div className="hidden lg:flex items-center gap-3 group cursor-pointer">
              <div className="bg-red-100 p-3 rounded-full text-[#ed1c24] group-hover:bg-[#ed1c24] group-hover:text-white transition-colors">
                <FaPhoneAlt size={18} />
              </div>
              <div>
                <p className="text-gray-500 text-[13px] font-medium">Hotline mua hàng</p>
                <p className="font-extrabold text-[#ed1c24] text-[18px] group-hover:scale-105 transition-transform origin-left">
                  1900 636 925
                </p>
              </div>
            </div>

            {/* ================= ACCOUNT (ĐÃ SỬA TẠI ĐÂY) ================= */}
            <div className="flex items-center gap-2 group">
              <FaRegUser size={22} className="text-gray-600 group-hover:text-[#ed1c24] group-hover:-translate-y-1 transition-all duration-300" />
              <div className="flex flex-col text-[13.5px] font-medium leading-tight">
                {/* Link sang trang Đăng nhập */}
                <Link to="/login" className="text-gray-800 hover:text-[#ed1c24] transition-colors">Đăng nhập</Link>
                {/* Link sang trang Đăng ký */}
                <Link to="/register" className="text-gray-800 hover:text-[#ed1c24] transition-colors">Đăng ký</Link>
              </div>
            </div>
            {/* ========================================================== */}

            {/* CART */}
            <div className="relative flex flex-col items-center text-gray-600 hover:text-[#ed1c24] cursor-pointer group">
              <FaShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="text-[14px] font-medium mt-1">Giỏ hàng</span>
              <span className="absolute -top-2 -right-3 bg-[#ed1c24] text-white text-[12px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 NAVBAR */}
      <nav className="bg-[#ed1c24]">
        <div className="max-w-[1200px] mx-auto flex items-center">
          {/* CATEGORY BUTTON */}
          <div className="flex items-center gap-3 bg-[#c8161e] text-white px-5 py-4 text-[15px] font-bold cursor-pointer hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            <FaBars size={17} />
            TẤT CẢ SẢN PHẨM
          </div>

          {/* MENU ITEMS */}
          <ul className="flex flex-1 justify-end lg:justify-between text-[13px] xl:text-[14px] font-bold uppercase tracking-wide whitespace-nowrap px-2">
            {[
              "Trang chủ",
              "Tháng của Nàng",
              "BST Chạm Vào Xanh",
              "Bảo hành",
              "Hệ thống cửa hàng",
              "Tin tức",
            ].map((item, index) => (
              <li
                key={index}
                className="px-4 py-4 cursor-pointer text-white hover:bg-white hover:text-[#ed1c24] transition-all duration-300 flex items-center justify-center"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;