import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaSignOutAlt, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';


const TABS = ['TẤT CẢ', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Hàm chuyển đổi nhãn hiển thị cho Tab
const getTabLabel = (tab) => {
  switch (tab) {
    case 'PENDING': return 'CHỜ XÁC NHẬN';
    case 'PROCESSING': return 'ĐANG XỬ LÝ';
    case 'SHIPPED': return 'ĐANG GIAO';
    case 'DELIVERED': return 'ĐÃ GIAO';
    case 'CANCELLED': return 'ĐÃ HỦY';
    default: return 'TẤT CẢ';
  }
};

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('TẤT CẢ');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem('user')) || {};

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=Elmich";
    if (url.startsWith('http')) return url;
    return url.startsWith('/images/') ? url : `/images/${url}`;
  };

  const handleReorder = async (items) => {
    if (isReordering) return;
    setIsReordering(true);
    toast.info("Đang thêm sản phẩm vào giỏ hàng...", { autoClose: 1000 });

    try {
      // Bắt buộc dùng id/product_id hợp lệ
      const addPromises = items.map(item => 
        addToCart({ id: item.id || item.product_id, name: item.name }, item.quantity, false)
      );
      
      await Promise.all(addPromises);
      
      toast.success("🛒 Đã dồn thành công các món vào giỏ hàng!");
      navigate('/cart');
    } catch (error) {
      console.error("Lỗi mua lại:", error);
      toast.error("Có lỗi xảy ra, không thể dồn vào giỏ hàng.");
    } finally {
      setIsReordering(false);
    }
  };

  const handleCancelOrderClick = (orderId) => {
    setCancelModal({ isOpen: true, orderId });
  };

  const confirmCancelOrder = async () => {
    const orderId = cancelModal.orderId;
    setCancelModal({ isOpen: false, orderId: null });
    try {
      const response = await axios.put(`http://localhost:10000/api/orders/${orderId}/cancel`);
      if (response.data && response.data.success) {
        toast.success("✅ Hủy đơn hàng thành công!");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      }
    } catch (error) {
      console.error("Lỗi hủy đơn:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra, không thể hủy đơn hàng.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        // 1. Lấy token từ localStorage (Lộc kiểm tra xem lúc Login đã lưu chưa nhé)
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error("Vui lòng đăng nhập lại!");
          return;
        }

        // 2. Gửi request kèm Header Authorization
        const response = await axios.get("http://localhost:10000/api/orders/history", {
          headers: {
            Authorization: `Bearer ${token}` // Đây là phần quan trọng nhất
          }
        });

        if (response.data && response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi:", error.response);
        if (error.response && [401, 403].includes(error.response.status)) {
           toast.error("Phiên đăng nhập hết hạn! Đang chuyển hướng...");
           setTimeout(() => {
             localStorage.clear();
             navigate('/login');
           }, 1000);
        } else {
           toast.error(error.response?.data?.message || "Không thể tải lịch sử đơn hàng!");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'TẤT CẢ') return true;
    return order.status?.toUpperCase() === activeTab.toUpperCase();
  });

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return <span className="text-orange-500 flex items-center gap-1 font-bold"><FaBox /> CHỜ XÁC NHẬN</span>;
      case 'SHIPPED': return <span className="text-blue-500 flex items-center gap-1 font-bold"><FaTruck /> ĐANG GIAO</span>;
      case 'DELIVERED': return <span className="text-green-600 flex items-center gap-1 font-bold"><FaCheckCircle /> ĐÃ GIAO THÀNH CÔNG</span>;
      case 'CANCELLED': return <span className="text-red-500 flex items-center gap-1 font-bold"><FaTimesCircle /> ĐÃ HỦY</span>;
      default: return <span className="text-gray-500 font-bold">{status}</span>;
    }
  };

  // Hình ảnh hiển thị logic
  let displayAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  if (localUser && localUser.avatar_url) {
    const serverUrl = 'https://nhom17-chieut6.onrender.com';
    displayAvatar = localUser.avatar_url.startsWith('http') ? localUser.avatar_url : `${serverUrl}/public/images/${localUser.avatar_url}`;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />

        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1250px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#ed1c24] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
            <span>/</span> <span className="hover:text-[#ed1c24] cursor-pointer transition-colors">Tài khoản</span>
            <span>/</span> <span className="text-gray-800 font-bold">Lịch sử đơn hàng</span>
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
                  onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt size={18} /> Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[120px] py-4 text-[13px] font-bold transition-all border-b-2 ${activeTab === tab ? 'text-[#ed1c24] border-[#ed1c24]' : 'text-gray-500 border-transparent'}`}
                >
                  {getTabLabel(tab)}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="py-20 text-center"><FaSpinner className="animate-spin inline text-2xl text-red-500" /></div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-20 text-center text-gray-400">Chưa có đơn hàng nào ở trạng thái này.</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between border-b pb-4 mb-4">
                      <span className="font-bold">Mã đơn: #{order.id}</span>
                      {getStatusDisplay(order.status)}
                    </div>

                    {/* Tách và hiển thị từng Item chính xác */}
                    <div className="flex flex-col gap-4 mt-2 mb-2">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50 p-2 rounded-lg">
                          <div className="w-16 h-16 bg-white rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                             <img src={getImageUrl(item.thumbnail_url || item.image)} alt={item.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-800 line-clamp-2">{item.name}</p>
                            <p className="text-[13px] text-gray-500 mt-1">x{item.quantity}</p>
                          </div>
                          <span className="text-[14px] font-bold text-[#ed1c24]">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                      <div>
                        <p className="text-[13px] text-gray-500 mb-1">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                        <span className="text-gray-600 text-sm font-medium">Tổng thanh toán: </span>
                        <span className="text-xl font-black text-[#ed1c24]">{Number(order.total_amount).toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Link to={`/account/orders/${order.id}`} className="px-5 py-2.5 border border-gray-300 rounded-lg font-bold text-[13px] text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                          Xem chi tiết
                        </Link>
                        {order.status?.toUpperCase() === 'DELIVERED' && (
                          <button 
                            onClick={() => handleReorder(order.items)}
                            disabled={isReordering}
                            className="px-5 py-2.5 bg-[#ed1c24] text-white rounded-lg font-bold text-[13px] hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                          >
                            {isReordering ? <FaSpinner className="animate-spin text-lg" /> : 'Mua lại'}
                          </button>
                        )}
                        {order.status?.toUpperCase() === 'PENDING' && (
                          <button 
                            onClick={() => handleCancelOrderClick(order.id)}
                            className="px-5 py-2.5 border border-red-500 text-red-500 bg-white rounded-lg font-bold text-[13px] hover:bg-red-50 transition-colors shadow-sm"
                          >
                            Hủy đơn
                          </button>
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

      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             animate={{ opacity: 1, scale: 1 }} 
             exit={{ opacity: 0, scale: 0.9 }}
             className="bg-white rounded-2xl p-6 md:p-8 w-[90%] max-w-[400px] shadow-2xl flex flex-col items-center text-center"
           >
             <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <FaTimesCircle className="text-3xl" />
             </div>
             <h3 className="text-xl font-black text-gray-800 mb-2">Hủy đơn hàng?</h3>
             <p className="text-gray-500 text-sm mb-6">Bạn có chắc chắn muốn hủy đơn hàng #{cancelModal.orderId} không? Hành động này không thể hoàn tác.</p>
             <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setCancelModal({ isOpen: false, orderId: null })}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Không, giữ lại
                </button>
                <button 
                  onClick={confirmCancelOrder}
                  className="flex-1 py-3 bg-[#ed1c24] text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md"
                >
                  Có, hủy đơn
                </button>
             </div>
           </motion.div>
        </div>
      )}
    </PageWrapper>
  );
};

export default OrderHistoryPage;