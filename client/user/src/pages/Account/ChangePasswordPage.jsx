import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaHeart, FaKey, FaSignOutAlt, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);

  // LẤY DỮ LIỆU USER TỪ LOCAL STORAGE
  const localUser = JSON.parse(localStorage.getItem('user')) || {};
  let displayAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  if (localUser.avatar_url) {
    const serverUrl = 'https://nhom17-chieut6.onrender.com';
    displayAvatar = localUser.avatar_url.startsWith('http') ? localUser.avatar_url : `${serverUrl}/public/images/${localUser.avatar_url}`;
  }

  if (!localStorage.getItem('user')) {
    window.location.href = '/login';
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.new_password.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }
    if (formData.new_password !== formData.confirm_password) {
      return toast.error("Mật khẩu nhập lại không khớp!");
    }

    setIsSaving(true);
    try {
      const apiUrl = `https://nhom17-chieut6.onrender.com/api/users/change-password`;
      const res = await axios.post(apiUrl, {
        id: localUser.id || 1,
        old_password: formData.old_password,
        new_password: formData.new_password
      });

      if (res.data.success) {
        toast.success(res.data.message || "Đổi mật khẩu thành công!");
        setFormData({ old_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#ed1c24] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
            <span>/</span> <span className="hover:text-[#ed1c24] cursor-pointer transition-colors">Tài khoản</span>
            <span>/</span> <span className="text-gray-800 font-bold">Đổi mật khẩu</span>
          </div>
        </div>

        <main className="flex-grow max-w-[1250px] mx-auto px-4 md:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR TÀI KHOẢN */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-5 flex items-center gap-4 border-b border-gray-100 bg-gray-50/50">
                <img src={displayAvatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                <div>
                  <p className="text-[13px] text-gray-500">Tài khoản của</p>
                  <p className="text-[16px] font-bold text-gray-800">{localUser.full_name || localUser.name || 'Khách hàng'}</p>
                </div>
              </div>
              <div className="p-2">
                <Link to="/account/profile" className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-600 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors">
                  <FaUserCircle size={18} /> Thông tin cá nhân
                </Link>
                <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-600 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors">
                  <FaClipboardList size={18} /> Lịch sử đơn hàng
                </Link>
                <Link to="/account/password" className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-[#ed1c24] bg-red-50 rounded-lg transition-colors">
                  <FaKey size={18} /> Đổi mật khẩu
                </Link>
                <div className="h-[1px] bg-gray-100 my-2 mx-4"></div>
                <button
                  onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt size={18} /> Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* NỘI DUNG ĐỔI MẬT KHẨU */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 max-w-2xl">
              <h1 className="text-[22px] font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Đổi Mật Khẩu</h1>

              <form onSubmit={handleSave} className="space-y-5">

                <div>
                  <label className="block text-[14px] text-gray-600 font-medium mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showPass.old ? "text" : "password"}
                      name="old_password"
                      value={formData.old_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#ed1c24] text-[14px] transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPass.old ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-gray-600 font-medium mb-2">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPass.new ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#ed1c24] text-[14px] transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPass.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự.</p>
                </div>

                <div>
                  <label className="block text-[14px] text-gray-600 font-medium mb-2">Nhập lại mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPass.confirm ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#ed1c24] text-[14px] transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPass.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-6 bg-[#ed1c24] text-white px-8 py-3 rounded-lg text-[14px] font-bold hover:bg-red-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {isSaving && <FaSpinner className="animate-spin" />} CẬP NHẬT MẬT KHẨU
                </button>

              </form>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default ChangePasswordPage;
