import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaSignOutAlt, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

import imgDefault from "../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
const PLACEHOLDER_IMG = imgDefault;

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

  const localUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        // Lấy ID của user đang login từ localStorage
        const localUser = JSON.parse(localStorage.getItem('user')) || {};
        const userId = localUser.id;

        if (!userId) {
          toast.error("Vui lòng đăng nhập để xem lịch sử!");
          return;
        }

        // Gửi kèm userId vào query string để Backend nhận được
        const response = await axios.get(`http://localhost:10000/api/orders/history?userId=${userId}`);

        if (response.data && response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi API Đơn hàng:", error);
        toast.error("Không thể tải lịch sử đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'TẤT CẢ') return true;
    return order.status === activeTab;
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

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />

        <main className="flex-grow max-w-[1250px] mx-auto px-4 py-8 w-full flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sticky top-24">
              <div className="p-4 border-b border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-[#ed1c24] rounded-full flex items-center justify-center font-bold">
                  {localUser.full_name?.charAt(0) || 'U'}
                </div>
                <span className="font-bold text-gray-700">{localUser.full_name || 'Khách hàng'}</span>
              </div>
              <Link to="/account/orders" className="flex items-center gap-3 px-4 py-3 text-[#ed1c24] bg-red-50 rounded-lg font-bold mt-2">
                <FaClipboardList /> Lịch sử đơn hàng
              </Link>
              <button onClick={() => { localStorage.clear(); window.location.href = '/login' }} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-500 mt-2">
                <FaSignOutAlt /> Đăng xuất
              </button>
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

                    {/* Phần hiển thị tên sản phẩm (Từ chuỗi GROUP_CONCAT của bạn) */}
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded border flex items-center justify-center">
                        <FaBox className="text-gray-300 text-2xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-medium text-gray-800">{order.product_names || "Chi tiết đơn hàng"}</p>
                        <p className="text-[13px] text-gray-500 mt-1">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex flex-col md:flex-row justify-between items-end gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">Tổng thanh toán: </span>
                        <span className="text-xl font-black text-[#ed1c24]">{Number(order.total_amount).toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-5 py-2 border rounded-lg font-bold text-[13px] hover:bg-gray-50">Xem chi tiết</button>
                        {order.status === 'DELIVERED' && (
                          <button className="px-5 py-2 bg-[#ed1c24] text-white rounded-lg font-bold text-[13px]">Mua lại</button>
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