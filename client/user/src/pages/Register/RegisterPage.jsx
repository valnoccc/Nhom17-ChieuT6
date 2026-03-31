import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PageWrapper from '../../components/layout/PageWrapper';

const RegisterPage = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Xử lý khi nhập liệu
  const handleInputChange = (e) => {
    setPhone(e.target.value);
    if (error) setError(''); // Ẩn lỗi ngay khi người dùng gõ lại
  };

  // Kiểm tra dữ liệu và submit
  const handleRegister = (e) => {
    e.preventDefault(); // Chặn load lại trang

    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại.");
      return;
    } else if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ (Phải là số VN gồm 10 chữ số).");
      return;
    }

    // Nếu hợp lệ
    toast.success("🚀 Đã gửi mã xác nhận đến số điện thoại của bạn!");
    console.log("Số điện thoại đăng ký:", phone);
    
    // Giả lập chuyển hướng sang trang đăng nhập sau 1.5 giây
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        {/* ================= BREADCRUMB (Điều hướng) ================= */}
        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1200px] mx-auto px-4 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#e30019] transition-colors">
              <span className="text-red-500 mr-1">🏠</span> Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Đăng ký</span>
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

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={`w-full border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 outline-none focus:border-[#e30019] transition-colors text-[14px] rounded-sm`}
                />
                {error && <p className="text-red-500 text-[12px] italic mt-1">{error}</p>}
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#f26a6a] text-white font-medium py-3 hover:bg-[#e30019] transition-colors text-[15px] shadow-sm rounded-sm active:scale-95"
              >
                TIẾP TỤC
              </button>
            </form>

            <div className="mt-8 text-center text-[14px] text-gray-600">
              <p>
                Bạn đã có tài khoản? <Link to="/login" className="text-[#337ab7] font-medium hover:underline">Đăng nhập tại đây</Link>
              </p>
              <p className="mt-4 mb-4">Hoặc đăng nhập bằng</p>

              {/* Nút Mạng Xã Hội */}
              <div className="flex justify-center gap-4">
                <button className="flex items-center justify-center gap-2 bg-[#3b5998] text-white px-6 py-2.5 w-[140px] hover:bg-blue-800 transition-colors shadow-sm rounded-sm active:scale-95">
                  <FaFacebookF size={16} /> <span className="text-[13px]">Facebook</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#dd4b39] text-white px-6 py-2.5 w-[140px] hover:bg-red-700 transition-colors shadow-sm rounded-sm active:scale-95">
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