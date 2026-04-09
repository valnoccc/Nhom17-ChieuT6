import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';

const LoginPage = () => {
  // 1. Quản lý trạng thái form
  const [formData, setFormData] = useState({
    username: '', // Dùng chung cho email hoặc số điện thoại
    password: ''
  });

  // 2. Quản lý lỗi
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng nhập thành công

  // Xử lý khi người dùng gõ phím
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Ẩn lỗi ngay khi bắt đầu gõ lại
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 3. Xử lý khi bấm ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.username.trim() || !formData.password) {
      toast.error("Vui lòng nhập Email và Mật khẩu!");
      return;
    }

    try {
      const res = await axios.post('http://localhost:10000/api/users/login', {
        email: formData.username,
        password: formData.password
      });

      if (res.data.success) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem('user', JSON.stringify({
          id: res.data.user.id,
          username: res.data.user.email,
          name: res.data.user.full_name || res.data.user.email.split('@')[0],
          full_name: res.data.user.full_name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          avatar_url: res.data.user.avatar_url
        }));
        localStorage.setItem('token', res.data.token);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Vui lòng kiểm tra lại thông tin đăng nhập!");
    }
  };

  return (
    <PageWrapper>
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

            {/* FORM ĐĂNG NHẬP */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập Email"
                  className={`w-full border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.username && <p className="text-red-500 text-[12px] italic mt-1">{errors.username}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className={`w-full border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.password && <p className="text-red-500 text-[12px] italic mt-1">{errors.password}</p>}
              </div>

              {/* Quên mật khẩu */}
              <div className="text-center mt-1">
                <a href="#" className="text-[14px] text-gray-600 hover:text-[#e30019] transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Nút Đăng Nhập */}
              <button
                type="submit"
                className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px] mt-2 shadow-sm active:scale-95"
              >
                ĐĂNG NHẬP
              </button>
            </form>

            {/* Các liên kết bên dưới */}
            <div className="mt-6 text-center text-[14px] text-gray-600 flex flex-col gap-2">
              <a href="#" className="hover:text-[#e30019] transition-colors">Đăng nhập với SMS</a>
              <p>
                Bạn chưa có tài khoản? <Link to="/register" className="text-[#337ab7] hover:underline font-medium">Đăng ký tại đây</Link>
              </p>
              <p className="mt-3 mb-3 text-[15px]">Hoặc đăng nhập bằng</p>

              {/* Nút Mạng Xã Hội */}
              <div className="flex justify-center gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-6 py-2.5 w-[140px] hover:bg-blue-800 transition-colors shadow-sm active:scale-95">
                  <FaFacebookF size={16} /> <span className="text-[13px]">Facebook</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#dd4b39] text-white px-6 py-2.5 w-[140px] hover:bg-red-700 transition-colors shadow-sm active:scale-95">
                  <FaGoogle size={16} /> <span className="text-[13px]">Google</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default LoginPage;