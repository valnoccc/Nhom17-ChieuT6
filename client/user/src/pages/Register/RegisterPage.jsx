import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import { API } from '../../services/config';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email.";
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else {
      const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ (Phải là số VN).";
      }
    }

    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu.";
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự.";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(API.REGISTER, {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (res.data.success) {
        toast.success("🚀 Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "⚠️ Có lỗi xảy ra khi đăng ký!");
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        {/* ================= BREADCRUMB ================= */}
        <div className="bg-white py-3 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#e30019] transition-colors">
              <span className="text-red-500 mr-1">🏠</span> Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800">Đăng ký</span>
          </div>
        </div>

        {/* ================= NỘI DUNG CHÍNH ================= */}
        <main className="flex-grow flex items-center justify-center py-16 bg-[#f5f5f5]">
          <div className="w-full max-w-[500px] px-4">
            <h1 className="text-[22px] font-normal text-center text-gray-800 mb-8 uppercase tracking-wide">
              Đăng ký tài khoản
            </h1>

            {/* FORM ĐĂNG KÝ */}
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Họ và tên"
                  className={`w-full border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.fullName && <p className="text-red-500 text-[12px] italic mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.email && <p className="text-red-500 text-[12px] italic mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className={`w-full border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.phone && <p className="text-red-500 text-[12px] italic mt-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                  className={`w-full border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.password && <p className="text-red-500 text-[12px] italic mt-1">{errors.password}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[12px] italic mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px] mt-2 shadow-sm active:scale-95"
              >
                ĐĂNG KÝ
              </button>
            </form>

            {/* CÁC LIÊN KẾT BÊN DƯỚI */}
            <div className="mt-6 text-center text-[14px] text-gray-600 flex flex-col gap-2">
              <p>
                Bạn đã có tài khoản? <Link to="/login" className="text-[#337ab7] hover:underline font-medium">Đăng nhập tại đây</Link>
              </p>
              <p className="mt-3 mb-3 text-[15px]">Hoặc đăng nhập bằng</p>

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

export default RegisterPage;