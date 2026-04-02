import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from './assets/images/logo_elmich.png';

const LoginForm = () => {
  // 1. Quản lý trạng thái form
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // 2. Quản lý lỗi
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý khi người dùng gõ phím
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Ẩn lỗi ngay khi bắt đầu gõ lại
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 3. Hàm kiểm tra dữ liệu
  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra ô email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ.";
    }

    // Kiểm tra ô mật khẩu
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Xử lý khi bấm ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("⚠️ Vui lòng kiểm tra lại thông tin đăng nhập!");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API login từ user.controller.js
      const response = await fetch('http://localhost:10000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`⚠️ ${data.message || 'Đăng nhập thất bại!'}`);
        setIsLoading(false);
        return;
      }

      // Kiểm tra role
      if (data.user.role !== 'admin') {
        toast.error("❌ Bạn không có quyền truy cập Admin Panel!");
        // Redirect đến trang "Nicetry"
        setTimeout(() => {
          navigate('/nicetry');
        }, 1500);
        setIsLoading(false);
        return;
      }

      // Lưu token và user info
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      toast.success("🚀 Đăng nhập thành công!");
      console.log("User data:", data.user);

      // Redirect đến Admin Dashboard
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ Lỗi kết nối. Vui lòng thử lại!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* ================= NỘI DUNG CHÍNH ================= */}
      <main className="flex-grow flex items-center justify-center py-16 bg-[#f5f5f5]">
        <div className="w-full max-w-[500px] px-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="Elmich Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>

          <h1 className="text-[22px] font-normal text-center text-gray-800 mb-8 uppercase tracking-wide">
            Admin Login
          </h1>

          {/* FORM ĐĂNG NHẬP */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                disabled={isLoading}
                className={`w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] bg-white text-black disabled:opacity-60`}
              />
              {errors.email && <p className="text-red-500 text-[12px] italic mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
                className={`w-full border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] text-black bg-white disabled:opacity-60`}
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
              disabled={isLoading}
              className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px] mt-2 shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          {/* Các liên kết bên dưới */}
          <div className="mt-6 text-center text-[14px] text-gray-600 flex flex-col gap-2">
            <p className="mb-3 text-[15px]">Hoặc đăng nhập bằng</p>

            {/* Nút Mạng Xã Hội */}
            <div className="flex justify-center gap-4">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-6 py-2.5 w-[140px] hover:bg-blue-800 transition-colors shadow-sm active:scale-95 disabled:opacity-60"
                disabled={isLoading}
              >
                <FaFacebookF size={16} /> <span className="text-[13px]">Facebook</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 bg-[#dd4b39] text-white px-6 py-2.5 w-[140px] hover:bg-red-700 transition-colors shadow-sm active:scale-95 disabled:opacity-60"
                disabled={isLoading}
              >
                <FaGoogle size={16} /> <span className="text-[13px]">Google</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;
