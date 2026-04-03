import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaMapMarkerAlt, FaSignOutAlt, FaCamera, FaSpinner, FaHeart, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const ProfilePage = () => {
    const [user, setUser] = useState({
        id: '',
        full_name: '',
        email: '',
        phone: '',
        avatar_url: ''
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
           // Ở dự án thật, ID sẽ được trả về khi login. Lúc này mock data nên ta ép cứng id 1 nếu thiếu.
           const fetchId = localUser.id || 1; 
           fetchProfile(fetchId);
        } else {
           window.location.href = '/login';
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            setIsLoading(true);
            const apiUrl = `http://localhost:10000/api/users/profile/${id}`;
            const res = await axios.get(apiUrl);
            
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi fetch thông tin:", error);
            // Ignore for mockup compatibility
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('full_name', user.full_name);
            formData.append('phone', user.phone || '');
            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }
            
            const apiUrl = `http://localhost:10000/api/users/profile/${user.id || 1}`;
            const res = await axios.put(apiUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data.success) {
                toast.success("Cập nhật thông tin thành công!");
                const updatedUser = res.data.data;
                setUser({ ...user, ...updatedUser });
                
                // ĐÈ LẠI LOCALSTORAGE ĐỂ HEADER CẬP NHẬT NAME & AVATAR MỚI
                let local = JSON.parse(localStorage.getItem('user')) || {};
                local = { 
                  ...local, 
                  name: updatedUser.full_name, 
                  avatar_url: updatedUser.avatar_url 
                };
                localStorage.setItem('user', JSON.stringify(local));
                
                // Xoá previewUrl để hiển thị lại ảnh online
                setPreviewUrl('');
                
                // Mẹo nhỏ: reload page để Header ăn liền dữ liệu từ localStorage
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật!");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Hình ảnh hiển thị logic
    let displayAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (previewUrl) {
       displayAvatar = previewUrl;
    } else if (user.avatar_url) {
       const serverUrl = 'http://localhost:10000';
       displayAvatar = user.avatar_url.startsWith('http') ? user.avatar_url : `${serverUrl}/public/images/${user.avatar_url}`;
    }

    return (
        <PageWrapper>
          <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
            <Header />
            
            <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
              <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
                <Link to="/" className="hover:text-[#ed1c24] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
                <span>/</span> <span className="hover:text-[#ed1c24] cursor-pointer transition-colors">Tài khoản</span>
                <span>/</span> <span className="text-gray-800 font-bold">Thông tin cá nhân</span>
              </div>
            </div>

            <main className="flex-grow max-w-[1250px] mx-auto px-4 md:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
              
              {/* SIDEBAR */}
              <div className="w-full lg:w-[280px] flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                  <div className="p-5 flex items-center gap-4 border-b border-gray-100 bg-gray-50/50">
                    <img src={displayAvatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                    <div>
                      <p className="text-[13px] text-gray-500">Tài khoản của</p>
                      <p className="text-[16px] font-bold text-gray-800">{user.full_name || 'Khách hàng'}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link to="/account/profile" className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-[#ed1c24] bg-red-50 rounded-lg transition-colors">
                      <FaUserCircle size={18} /> Thông tin cá nhân
                    </Link>
                    <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-600 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors">
                      <FaClipboardList size={18} /> Lịch sử đơn hàng
                    </Link>
                    <Link to="/account/password" className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-600 hover:bg-red-50 hover:text-[#ed1c24] rounded-lg transition-colors">
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

              {/* OVERVIEW CONTENT */}
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
                  <h1 className="text-[22px] font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Hồ Sơ Của Tôi</h1>
                  
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                       <FaSpinner className="animate-spin text-[#ed1c24] text-4xl mb-4" />
                       <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-10">
                      
                      {/* FORM BÊN TRÁI */}
                      <div className="flex-1 space-y-5 order-2 md:order-1">
                        <div>
                          <label className="block text-[14px] text-gray-600 font-medium mb-2">Họ & Tên</label>
                          <input 
                            type="text" 
                            name="full_name" 
                            value={user.full_name || ''} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#ed1c24] text-[14px] transition-colors" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] text-gray-600 font-medium mb-2">Email</label>
                          <input 
                            type="email" 
                            value={user.email || ''} 
                            disabled 
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-[14px] text-gray-500 cursor-not-allowed" 
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] text-gray-600 font-medium mb-2">Số điện thoại</label>
                          <input 
                            type="text" 
                            name="phone" 
                            value={user.phone || ''} 
                            onChange={handleInputChange} 
                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#ed1c24] text-[14px] transition-colors" 
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="mt-6 bg-[#ed1c24] text-white px-8 py-3 rounded-lg text-[14px] font-bold hover:bg-red-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                        >
                          {isSaving && <FaSpinner className="animate-spin" />} LƯU THAY ĐỔI
                        </button>
                      </div>

                      {/* UPLOAD AVATAR BÊN PHẢI */}
                      <div className="w-full md:w-[250px] border-l-0 md:border-l border-gray-100 flex flex-col items-center justify-center pt-5 md:pt-0 order-1 md:order-2">
                        <div className="relative group mb-4">
                          <img src={displayAvatar} alt="avatar" className="w-[120px] h-[120px] rounded-full object-cover border border-gray-200" />
                          <label className="absolute bottom-0 right-0 bg-[#ed1c24] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-sm hover:bg-red-800 transition-colors">
                            <FaCamera size={14} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                        </div>
                        <p className="text-[13px] text-gray-500 text-center">
                          Dụng lượng file tối đa 5 MB <br/>Định dạng: .JPEG, .PNG
                        </p>
                      </div>

                    </form>
                  )}
                </div>
              </div>
            </main>
            
            <Footer />
          </div>
        </PageWrapper>
    );
};

export default ProfilePage;
