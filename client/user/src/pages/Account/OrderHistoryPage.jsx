import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaMapMarkerAlt, FaSignOutAlt, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaHeart, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// ẢNH DỰ PHÒNG KHI LỖI HOẶC CHƯA CÓ ẢNH
import imgDefault from "../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
const PLACEHOLDER_IMG = imgDefault;

// ================= DỮ LIỆU ĐƠN HÀNG MẪU (DỰ PHÒNG KHI API LỖI) =================
const MOCK_ORDERS = [
  {
    id: "ELM-2508-9823",
    date: "25/08/2025 14:30",
    status: "ĐÃ GIAO",
    items: [
      { name: "Cốc giữ nhiệt inox 304 Elmich EL1049 dung tích 550ml", price: 369000, quantity: 2, image: PLACEHOLDER_IMG },
      { name: "Nồi chống dính ceramic Elmich Harmony EL5540PT", price: 675000, quantity: 1, image: PLACEHOLDER_IMG }
    ],
    shippingFee: 0,
    discount: 120000,
    total: 1293000
  },
  {
    id: "ELM-2808-1105",
    date: "28/08/2025 09:15",
    status: "CHỜ XÁC NHẬN",
    items: [
      { name: "Nồi chảo lẩu đa năng Inox liền khối Elmich Trimax XS", price: 925000, quantity: 1, image: PLACEHOLDER_IMG }
    ],
    shippingFee: 35000,
    discount: 0,
    total: 960000
  },
  {
    id: "ELM-1007-4421",
    date: "10/07/2025 19:45",
    status: "ĐÃ HỦY",
    items: [
      { name: "Cốc giữ nhiệt inox 304 Elmich EL1049 dung tích 550ml", price: 369000, quantity: 1, image: PLACEHOLDER_IMG }
    ],
    shippingFee: 35000,
    discount: 0,
    total: 404000
  }
];

const TABS = ['TẤT CẢ', 'CHỜ XÁC NHẬN', 'ĐANG GIAO', 'ĐÃ GIAO', 'ĐÃ HỦY'];

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('TẤT CẢ');

  // ================= STATE DỮ LIỆU TỪ API =================
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // LẤY DỮ LIỆU USER TỪ LOCAL STORAGE
  const localUser = JSON.parse(localStorage.getItem('user')) || {};
  let displayAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  if (localUser.avatar_url) {
    const serverUrl = 'https://nhom17-chieut6.onrender.com';
    displayAvatar = localUser.avatar_url.startsWith('http') ? localUser.avatar_url : `${serverUrl}/public/images/${localUser.avatar_url}`;
  }

  // HÀM XỬ LÝ LINK ẢNH CHUẨN MỰC TỪ SERVER
  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;
    return `https://nhom17-chieut6.onrender.com/public/images/${url}`;
  };

  // ================= GỌI API LẤY LỊCH SỬ ĐƠN HÀNG =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Lưu ý: Thay đổi endpoint này cho đúng với API backend của bạn
        const response = await axios.get("https://nhom17-chieut6.onrender.com/api/orders");

        if (response.data && response.data.success && response.data.data.length > 0) {
          // Format lại dữ liệu từ DB (nếu cần)
          const formattedOrders = response.data.data.map(order => ({
            ...order,
            // Đảm bảo items có format đúng chuẩn để render
            items: order.items?.map(item => ({
              ...item,
              image: getImageUrl(item.image || item.thumbnail_url)
            })) || []
          }));
          setOrders(formattedOrders);
        } else {
          // Nếu API gọi thành công nhưng mảng rỗng
          setOrders([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy API Đơn hàng, đang dùng dữ liệu dự phòng:", error);
        // NẾU CHƯA CÓ API THÌ DÙNG MOCK DATA ĐỂ KHÔNG BỊ TRẮNG TRANG
        setOrders(MOCK_ORDERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc đơn hàng theo Tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'TẤT CẢ') return true;
    return order.status?.toUpperCase() === activeTab;
  });

  const handleReorder = () => {
    toast.success("🛒 Đã thêm các sản phẩm vào giỏ hàng!");
  };

  const handleCancelOrder = () => {
    toast.info("Đã gửi yêu cầu hủy đơn hàng!");
  };

  // Hàm render màu sắc và icon theo trạng thái
  const getStatusDisplay = (status) => {
    const safeStatus = status?.toUpperCase();
    switch (safeStatus) {
      case 'CHỜ XÁC NHẬN': return <span className="text-orange-500 flex items-center gap-1 font-bold"><FaBox /> CHỜ XÁC NHẬN</span>;
      case 'ĐANG GIAO': return <span className="text-blue-500 flex items-center gap-1 font-bold"><FaTruck /> ĐANG GIAO</span>;
      case 'ĐÃ GIAO': return <span className="text-green-600 flex items-center gap-1 font-bold"><FaCheckCircle /> ĐÃ GIAO THÀNH CÔNG</span>;
      case 'ĐÃ HỦY': return <span className="text-red-500 flex items-center gap-1 font-bold"><FaTimesCircle /> ĐÃ HỦY</span>;
      default: return <span className="font-bold text-gray-600">{status}</span>;
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        {/* Breadcrumb */}
        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#ed1c24] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
            <span>/</span> <span className="hover:text-[#ed1c24] cursor-pointer transition-colors">Tài khoản</span>
            <span>/</span> <span className="text-gray-800 font-bold">Lịch sử đơn hàng</span>
          </div>
        </div>

        <main className="flex-grow max-w-[1250px] mx-auto px-4 md:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">

          {/* ================= SIDEBAR TÀI KHOẢN (25%) ================= */}
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
                <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-[#ed1c24] bg-red-50 rounded-lg transition-colors">
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

          {/* ================= NỘI DUNG ĐƠN HÀNG (75%) ================= */}
          <div className="flex-1 flex flex-col gap-6">

            <h1 className="text-[22px] font-bold text-gray-800 hidden lg:block">Lịch sử đơn hàng</h1>

            {/* THANH TABS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-x-auto custom-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 min-w-[120px] py-4 text-[14px] font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#ed1c24]' : 'text-gray-500 hover:text-[#ed1c24]'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ed1c24] rounded-t-md" />
                  )}
                </button>
              ))}
            </div>

            {/* DANH SÁCH ĐƠN HÀNG */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-20 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-[#ed1c24] text-4xl mb-4" />
                <p className="text-gray-500 font-medium">Đang tải dữ liệu đơn hàng...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-20 flex flex-col items-center justify-center">
                <img src="https://cdn-icons-png.flaticon.com/512/743/743131.png" alt="Empty" className="w-24 h-24 mb-4 opacity-30 grayscale" />
                <p className="text-gray-500 font-medium">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 transition-shadow hover:shadow-md">

                    {/* Header Đơn hàng */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-2">
                      <div className="flex flex-wrap items-center gap-4 text-[13px]">
                        <span className="font-bold text-gray-800">Mã đơn: {order.id}</span>
                        <span className="text-gray-400 hidden md:block">|</span>
                        <span className="text-gray-500">Ngày đặt: {order.date}</span>
                      </div>
                      <div className="text-[13px]">{getStatusDisplay(order.status)}</div>
                    </div>

                    {/* Danh sách Sản phẩm */}
                    <div className="space-y-4">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-20 h-20 border border-gray-200 rounded-lg p-1 bg-gray-50 flex-shrink-0">
                            <img src={item.image} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-2">
                            <div>
                              <p className="text-[14px] text-gray-800 font-medium line-clamp-2 leading-snug">{item.name}</p>
                              <p className="text-[13px] text-gray-500 mt-1">x{item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[14px] font-bold text-[#ed1c24]">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Đơn hàng: Tính tiền & Nút bấm */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col md:flex-row items-end justify-between gap-4 bg-[#fafafa] -mx-5 -mb-5 px-5 py-4 rounded-b-xl">
                      <div className="w-full md:w-auto text-[14px] text-gray-600 space-y-1">
                        {order.discount > 0 && <p className="flex justify-between md:justify-start md:gap-4">Giảm giá: <span className="font-medium">- {Number(order.discount).toLocaleString('vi-VN')}đ</span></p>}
                        <p className="flex justify-between md:justify-start md:gap-4">Thành tiền: <span className="text-[20px] font-black text-[#ed1c24]">{Number(order.total).toLocaleString('vi-VN')}đ</span></p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        {order.status === 'ĐÃ HỦY' || order.status === 'ĐÃ GIAO' ? (
                          <>
                            <button className="flex-1 md:flex-none border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors">Xem chi tiết</button>
                            <button onClick={handleReorder} className="flex-1 md:flex-none bg-[#ed1c24] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold shadow-md hover:bg-red-800 transition-colors">Mua lại</button>
                          </>
                        ) : (
                          <>
                            {order.status === 'CHỜ XÁC NHẬN' && (
                              <button onClick={handleCancelOrder} className="flex-1 md:flex-none border border-red-200 text-red-500 bg-red-50 px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-red-100 transition-colors">Hủy đơn</button>
                            )}
                            <button className="flex-1 md:flex-none bg-[#338dbc] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold shadow-md hover:bg-blue-700 transition-colors">Liên hệ CSKH</button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default OrderHistoryPage;