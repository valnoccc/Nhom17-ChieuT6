import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaPhoneAlt,
  FaRegUser,
  FaBars,
  FaTimes,
  FaRegEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaClipboardList,
  FaHeart,
  FaKey
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // CLICK OUTSIDE ĐỂ ĐÓNG MENU
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= STATE & HÀM TÌM KIẾM =================
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Chặn load lại trang khi bấm Enter
    if (searchQuery.trim()) {
      // Đẩy người dùng sang trang danh sách sản phẩm kèm từ khóa tìm kiếm trên URL
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleQuickSearch = (keyword) => {
    setSearchQuery(keyword);
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };
  // =======================================================

  // KIỂM TRA ĐĂNG NHẬP
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="w-full font-sans bg-white relative z-50">
      {/* 🔴 1. TOP BAR */}
      <div className="bg-[#ed1c24] text-white text-[14px] py-2">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="gift">🎁</span>
            <span className="font-medium">Chào mừng bạn tới Elmich - Ưu đãi tháng này!</span>
          </div>
          <button className="bg-white text-[#ed1c24] px-4 py-1 rounded-full text-[12px] font-bold hover:bg-gray-100 transition-colors uppercase shadow-sm">
            XEM NGAY
          </button>
        </div>
      </div>

      {/* ⚪ 2. MAIN HEADER */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex items-center justify-between gap-4">

          {/* NÚT MENU MOBILE */}
          <button
            className="md:hidden text-[#ed1c24] text-[24px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* LEFT: LOGO */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex flex-col items-start">
              <h1 className="text-[36px] md:text-[42px] font-black text-[#ed1c24] italic tracking-tighter leading-none hover:opacity-80 transition-opacity">
                elmich
              </h1>
            </div>
          </Link>

          {/* MIDDLE: SEARCH BAR (PC) */}
          <div className="hidden md:flex flex-1 max-w-[600px] flex-col mx-4 lg:mx-10">
            <form onSubmit={handleSearch} className="flex border-[1px] border-gray-300 rounded-full overflow-hidden h-[42px] bg-white focus-within:border-[#ed1c24] transition-colors group shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm (VD: Tủ lạnh, Máy giặt)..."
                className="flex-1 px-5 text-[14px] outline-none text-gray-700 bg-transparent"
              />
              <button type="submit" className="px-5 text-gray-400 group-hover:text-[#ed1c24] transition-colors hover:bg-gray-50">
                <FaSearch size={18} />
              </button>
            </form>

            {/* Top Tìm Kiếm - Cập nhật cho khớp Điện máy */}
            <div className="flex items-center gap-2 mt-2 text-[12px]">
              <span className="text-gray-500 font-bold">Top Tìm Kiếm:</span>
              {["Tủ lạnh", "Máy giặt", "Máy xay"].map((item, i) => (
                <span
                  key={i}
                  onClick={() => handleQuickSearch(item)}
                  className="bg-[#d57171] text-white px-3 py-0.5 rounded-full cursor-pointer hover:bg-red-600 transition-colors shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: HOTLINE - ACCOUNT - CART */}
          <div className="flex items-center gap-4 lg:gap-7">
            <div className="hidden xl:flex items-center gap-2 hover:text-[#ed1c24] cursor-pointer transition-colors">
              <FaPhoneAlt className="text-gray-700" size={16} />
              <div className="flex flex-col leading-none">
                <span className="text-[12px] text-gray-500">Hotline</span>
                <span className="text-[14px] font-bold">1900636925</span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 hover:text-[#ed1c24] cursor-pointer transition-colors">
              <FaRegEnvelope className="text-gray-700" size={18} />
              <div className="flex flex-col leading-none">
                <span className="text-[12px] text-gray-500">Email</span>
                <span className="text-[14px] font-bold">cskh@elmich.vn</span>
              </div>
            </div>

            {/* TÀI KHOẢN & DROPDOWN */}
            <div className="relative" ref={userMenuRef}>
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : null}
              >
                <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center group-hover:border-[#ed1c24] group-hover:bg-red-50 transition-colors overflow-hidden bg-white">
                  {user && user.avatar_url ? (
                    <img
                      src={user.avatar_url.startsWith('http') ? user.avatar_url : `https://nhom17-chieut6.onrender.com/public/images/${user.avatar_url}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaRegUser size={18} className="text-gray-700 group-hover:text-[#ed1c24]" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-[13px] leading-tight font-bold">
                  {user ? (
                    <>
                      <span className="text-gray-800">Xin chào,</span>
                      <span className="text-[#ed1c24] truncate max-w-[120px]">{user.full_name || user.name || user.username}</span>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="hover:text-[#ed1c24] transition-colors">Đăng nhập</Link>
                      <Link to="/register" className="hover:text-[#ed1c24] transition-colors">Đăng ký</Link>
                    </>
                  )}
                </div>
              </div>

              {/* DROPDOWN MENU */}
              {user && (
                <div
                  className={`absolute top-full right-0 mt-3 w-[230px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 z-[999] transition-all duration-300 origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                >
                  <Link to="/account/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors font-medium">
                    <FaUserCircle size={16} /> Thông tin cá nhân
                  </Link>
                  <Link to="/account/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors font-medium">
                    <FaClipboardList size={16} /> Lịch sử đơn hàng
                  </Link>
                  <Link to="/account/password" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors font-medium">
                    <FaKey size={16} /> Đổi mật khẩu
                  </Link>
                  <div className="h-[1px] bg-gray-100 my-2 mx-2"></div>
                  <button
                    onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors"
                  >
                    <FaSignOutAlt size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FaShoppingCart size={24} className="text-gray-800 group-hover:text-[#ed1c24] transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-[#ed1c24] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {totalItems}
                  </span>
                </div>
                <span className="hidden lg:block text-[13px] font-bold text-gray-800 group-hover:text-[#ed1c24] transition-colors">Giỏ hàng</span>
              </div>
            </Link>
          </div>
        </div>

        {/* THANH TÌM KIẾM CHO MOBILE */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="flex border border-[#ed1c24] rounded-full overflow-hidden h-[40px] shadow-sm focus-within:ring-2 focus-within:ring-red-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 px-4 text-[14px] outline-none"
            />
            <button type="submit" className="bg-[#ed1c24] text-white px-5 active:bg-red-800 transition-colors">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>

      {/* 🔴 3. NAVBAR */}
      <nav className={`bg-[#ed1c24] ${isMobileMenuOpen ? 'block absolute w-full shadow-lg z-40' : 'hidden'} md:block`}>
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row">

          <Link to="/products" className="bg-[#c8161e] text-white px-6 py-3 flex items-center gap-3 font-bold text-[14px] hover:bg-black transition-colors shadow-inner">
            <FaBars /> TẤT CẢ SẢN PHẨM
          </Link>

          <ul className="flex flex-col md:flex-row flex-1 text-white font-bold text-[13px] uppercase tracking-tight">
            {[
              { name: "Trang chủ", link: "/" },
              { name: "Tháng của Nàng", link: "#" },
              { name: "BST Chạm Vào Xanh", link: "#" },
              { name: "Bảo hành", link: "#" },
              { name: "Hệ thống cửa hàng", link: "#" },
              { name: "Tin tức", link: "#" },
            ].map((item, index) => (
              <li key={index} className="border-b border-red-500/30 md:border-none">
                <Link to={item.link} className="block px-4 py-3 md:py-4 hover:bg-white hover:text-[#ed1c24] transition-all">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;