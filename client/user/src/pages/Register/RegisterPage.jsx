import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// Import icon Facebook và Google
import { FaFacebookF, FaGoogle } from 'react-icons/fa';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <Header />

      {/* ================= BREADCRUMB (Điều hướng) ================= */}
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 text-[13px] text-gray-500 flex items-center gap-2">
          <a href="/" className="hover:text-[#e30019] transition-colors">
            <span className="text-red-500 mr-1">🏠</span> Trang chủ
          </a>
          <span>/</span>
          <span className="text-gray-800">Đăng ký</span>
        </div>
      </div>

      {/* ================= NỘI DUNG CHÍNH ================= */}
      <main className="flex-grow flex items-center justify-center py-16 bg-white">
        <div className="w-full max-w-[500px] px-4">
          <h1 className="text-[22px] font-normal text-center text-gray-800 mb-6 uppercase tracking-wide">
            Đăng ký tài khoản
          </h1>
          <p className="text-center text-gray-600 mb-4 text-[15px]">
            Nhập số điện thoại của bạn để đăng ký:
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              className="w-full border border-gray-300 p-3 outline-none focus:border-[#e30019] transition-colors text-[14px]"
            />
            {/* Nút màu hồng cam giống ảnh mẫu */}
            <button
              type="button"
              className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px]"
            >
              TIẾP TỤC
            </button>
          </form>

          <div className="mt-8 text-center text-[14px] text-gray-600">
            <p>
              Bạn đã có tài khoản <a href="/login" className="text-blue-600 hover:underline">Đăng nhập tại đây</a>
            </p>
            <p className="mt-4 mb-4">Hoặc đăng nhập bằng</p>

            {/* Nút Mạng Xã Hội */}
            <div className="flex justify-center gap-4">
              <button className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-6 py-2.5 w-[140px] hover:bg-blue-800 transition-colors">
                <FaFacebookF size={16} /> <span className="text-[13px]">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#dd4b39] text-white px-6 py-2.5 w-[140px] hover:bg-red-700 transition-colors">
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

export default RegisterPage;