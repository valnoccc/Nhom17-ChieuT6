import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// Import icon Facebook và Google
import { FaFacebookF, FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <Header />

      {/* ================= BREADCRUMB (Điều hướng) ================= */}
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 text-[13px] text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-[#e30019] transition-colors">
            <span className="text-red-500 mr-1">🏠</span> Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-800">Đăng nhập</span>
        </div>
      </div>

      {/* ================= NỘI DUNG CHÍNH ================= */}
      <main className="flex-grow flex items-center justify-center py-16 bg-[#f5f5f5]">
        <div className="w-full max-w-[500px] px-4">
          <h1 className="text-[22px] font-normal text-center text-gray-800 mb-8 uppercase tracking-wide">
            Đăng nhập
          </h1>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white"
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white"
            />

            {/* Quên mật khẩu */}
            <div className="text-center mt-1">
              <a href="#" className="text-[14px] text-gray-600 hover:text-[#e30019] transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="button"
              className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px] mt-2 shadow-sm"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          {/* Các liên kết bên dưới */}
          <div className="mt-6 text-center text-[14px] text-gray-600 flex flex-col gap-2">
            <a href="#" className="hover:text-[#e30019] transition-colors">Đăng nhập với SMS</a>
            <p>
              Bạn chưa có tài khoản <Link to="/register" className="text-[#337ab7] hover:underline">Đăng ký tại đây</Link>
            </p>
            <p className="mt-3 mb-3 text-[15px]">Hoặc đăng nhập bằng</p>

            {/* Nút Mạng Xã Hội */}
            <div className="flex justify-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-6 py-2.5 w-[140px] hover:bg-blue-800 transition-colors shadow-sm">
                <FaFacebookF size={16} /> <span className="text-[13px]">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#dd4b39] text-white px-6 py-2.5 w-[140px] hover:bg-red-700 transition-colors shadow-sm">
                <FaGoogle size={16} /> <span className="text-[13px]">Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;