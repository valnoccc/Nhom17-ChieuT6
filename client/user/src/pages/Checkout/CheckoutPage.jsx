import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển trang
import { FaUserCircle, FaChevronLeft, FaMoneyBillWave, FaTimes, FaSpinner } from 'react-icons/fa'; // Thêm FaSpinner
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import PageWrapper from '../../components/layout/PageWrapper';

// IMPORT HÌNH ẢNH
import logoElmich from "../../images/logo_elmich.png";
import imgVnpay from "../../images/payment-1.png"; 

// 1. ================= DỮ LIỆU VOUCHER =================
const VOUCHERS = [
  { code: "L7TXMUHVO26M", type: "fixed", value: 120000, minOrder: 1000000 },
  { code: "1VV3D9YJAYNS", type: "fixed", value: 200000, minOrder: 1899000 },
  { code: "XOPC0393NT08", type: "fixed", value: 300000, minOrder: 2799000 },
  { code: "NJRVAXXY4J7E", type: "percent", value: 10, minOrder: 5000000 },
];

// 2. ================= DỮ LIỆU ĐỊA CHỈ (HCM & HN ĐẦY ĐỦ) =================
const LOCATION_DATA = {
  "HCM": {
    name: "TP Hồ Chí Minh",
    districts: {
      "Q1": { name: "Quận 1", wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Đa Kao"] },
      "Q3": { name: "Quận 3", wards: ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 5"] },
      "Q4": { name: "Quận 4", wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 6", "Phường 8"] },
      "Q5": { name: "Quận 5", wards: ["Phường 1", "Phường 2", "Phường 8", "Phường 14"] },
      "Q6": { name: "Quận 6", wards: ["Phường 1", "Phường 10", "Phường 12"] },
      "Q7": { name: "Quận 7", wards: ["Phường Tân Phong", "Phường Phú Mỹ", "Phường Tân Kiểng", "Phường Bình Thuận"] },
      "Q8": { name: "Quận 8", wards: ["Phường 1", "Phường 5", "Phường 16"] },
      "Q10": { name: "Quận 10", wards: ["Phường 1", "Phường 12", "Phường 15"] },
      "Q11": { name: "Quận 11", wards: ["Phường 1", "Phường 5", "Phường 15"] },
      "Q12": { name: "Quận 12", wards: ["Phường Tân Chánh Hiệp", "Phường Hiệp Thành", "Phường An Phú Đông"] },
      "BT": { name: "Quận Bình Thạnh", wards: ["Phường 1", "Phường 2", "Phường 15", "Phường 25"] },
      "GV": { name: "Quận Gò Vấp", wards: ["Phường 1", "Phường 5", "Phường 10", "Phường 17"] },
      "PN": { name: "Quận Phú Nhuận", wards: ["Phường 1", "Phường 9", "Phường 15"] },
      "TB": { name: "Quận Tân Bình", wards: ["Phường 1", "Phường 12", "Phường 15"] },
      "TP": { name: "Quận Tân Phú", wards: ["Phường Hòa Thạnh", "Phường Phú Thọ Hòa", "Phường Tân Thành"] },
      "BTN": { name: "Quận Bình Tân", wards: ["Phường An Lạc", "Phường Bình Hưng Hòa", "Phường Bình Trị Đông"] },
      "TD": { name: "TP. Thủ Đức", wards: ["Phường Thảo Điền", "Phường Linh Trung", "Phường Hiệp Bình Chánh", "Phường An Phú"] },
      "BC": { name: "Huyện Bình Chánh", wards: ["Xã Bình Hưng", "Xã Phong Phú", "Xã Tân Kiên"] },
      "HM": { name: "Huyện Hóc Môn", wards: ["Xã Bà Điểm", "Xã Xuân Thới Thượng", "Xã Trung Chánh"] },
      "CC": { name: "Huyện Củ Chi", wards: ["Xã Tân Thông Hội", "Xã Phước Vĩnh An"] },
      "NB": { name: "Huyện Nhà Bè", wards: ["Xã Phước Kiển", "Xã Hiệp Phước", "Xã Phú Xuân"] },
      "CG": { name: "Huyện Cần Giờ", wards: ["Xã Bình Khánh", "Xã Cần Thạnh"] },
    }
  },
  "HN": {
    name: "Hà Nội",
    districts: {
      "BD": { name: "Quận Ba Đình", wards: ["Phường Cống Vị", "Phường Điện Biên", "Phường Đội Cấn"] },
      "HK": { name: "Quận Hoàn Kiếm", wards: ["Phường Phan Chu Trinh", "Phường Hàng Đào", "Phường Tràng Tiền"] },
      "TH": { name: "Quận Tây Hồ", wards: ["Phường Bưởi", "Phường Thụy Khuê", "Phường Yên Phụ"] },
      "LB": { name: "Quận Long Biên", wards: ["Phường Bồ Đề", "Phường Gia Thụy", "Phường Ngọc Lâm"] },
      "CG": { name: "Quận Cầu Giấy", wards: ["Phường Dịch Vọng", "Phường Mai Dịch", "Phường Trung Hòa"] },
      "DD": { name: "Quận Đống Đa", wards: ["Phường Láng Hạ", "Phường Ô Chợ Dừa", "Phường Kim Liên"] },
      "HBT": { name: "Quận Hai Bà Trưng", wards: ["Phường Bách Khoa", "Phường Minh Khai", "Phường Vĩnh Tuy"] },
      "HM": { name: "Quận Hoàng Mai", wards: ["Phường Hoàng Liệt", "Phường Mai Động", "Phường Giáp Bát"] },
      "TX": { name: "Quận Thanh Xuân", wards: ["Phường Nhân Chính", "Phường Khương Trung", "Phường Thanh Xuân Bắc"] },
      "NTL": { name: "Quận Nam Từ Liêm", wards: ["Phường Mỹ Đình 1", "Phường Trung Văn"] },
      "BTL": { name: "Quận Bắc Từ Liêm", wards: ["Phường Cổ Nhuế 1", "Phường Xuân Đỉnh"] },
      "HD": { name: "Quận Hà Đông", wards: ["Phường Quang Trung", "Phường Yết Kiêu", "Phường Văn Quán"] },
    }
  }
};

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate(); // Khởi tạo hook chuyển trang

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=Elmich";
    if (url.startsWith('http')) return url;
    return `https://nhom17-chieut6.onrender.com/public/images/${url}`; 
  };
  const [formData, setFormData] = useState({
    email: '', fullName: '', phone: '', address: '',
    province: '', district: '', ward: '', note: '', paymentMethod: 'VNPAY'
  });
  
  const [errors, setErrors] = useState({});

  // STATE VOUCHER & LOADING
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái Loading

  // LOGIC TÍNH PHÍ VẬN CHUYỂN
  const isAddressComplete = !!formData.ward; 
  const currentShippingFee = isAddressComplete ? 35000 : 0;
  
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'province') { newData.district = ''; newData.ward = ''; }
      if (name === 'district') { newData.ward = ''; }
      return newData;
    });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    
    if (!formData.email) newErrors.email = "Vui lòng nhập Email";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email không đúng định dạng";
    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Số điện thoại phải có 10 số (VN)";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ chi tiết";
    if (!formData.province) newErrors.province = "Chọn Tỉnh/Thành";
    if (!formData.district) newErrors.district = "Chọn Quận/Huyện";
    if (!formData.ward) newErrors.ward = "Chọn Phường/Xã";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) return toast.warning("Vui lòng nhập mã giảm giá!");
    const foundVoucher = VOUCHERS.find(v => v.code === voucherInput.trim().toUpperCase());
    if (!foundVoucher) return toast.error("Mã giảm giá không tồn tại hoặc đã hết hạn!");
    if (subtotal < foundVoucher.minOrder) return toast.error(`Đơn hàng chưa đạt mức tối thiểu ${foundVoucher.minOrder.toLocaleString()}đ!`);

    let calculatedDiscount = foundVoucher.type === 'fixed' ? foundVoucher.value : (subtotal * foundVoucher.value) / 100;
    setDiscountAmount(calculatedDiscount);
    setAppliedVoucher(foundVoucher.code);
    setVoucherInput('');
    toast.success("🎉 Áp dụng mã giảm giá thành công!");
  };

  const handleRemoveVoucher = () => {
    setDiscountAmount(0);
    setAppliedVoucher(null);
    toast.info("Đã gỡ mã giảm giá!");
  };

  // HÀM ĐẶT HÀNG KÈM HIỆU ỨNG LOADING
  const handleOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true); // Bật hiệu ứng Loading

      // Giả lập thời gian gửi dữ liệu lên server / gọi cổng thanh toán (2 giây)
      setTimeout(() => {
        setIsProcessing(false); // Tắt Loading
        toast.success("🚀 Đặt hàng thành công!");
        
        // Chuyển hướng người dùng sang trang Lịch sử đơn hàng
        navigate('/account/orders'); 
      }, 2000);

    } else {
      toast.error("⚠️ Vui lòng kiểm tra lại các thông tin bị thiếu hoặc sai!");
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen font-sans bg-white flex justify-center">
        <div className="w-full max-w-[1250px] flex flex-col lg:flex-row">
          
          {/* ================= CỘT TRÁI & GIỮA ================= */}
          <div className="flex-[6.5] p-6 lg:p-10 lg:pr-16">
            <div className="flex justify-center lg:justify-start mb-10">
              <Link to="/">
                <img src={logoElmich} alt="Logo" className="h-16 object-contain" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* THÔNG TIN NHẬN HÀNG */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-[18px] font-bold text-gray-800">Thông tin nhận hàng</h2>
                  <Link to="/login" className="flex items-center gap-1 text-[#338dbc] text-[14px] hover:underline">
                    <FaUserCircle /> Đăng nhập
                  </Link>
                </div>
                
                <div>
                  <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} disabled={isProcessing}
                    className={`w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] outline-none focus:border-[#338dbc] transition-colors disabled:opacity-60`} />
                  {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <input name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleInputChange} disabled={isProcessing}
                    className={`w-full border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] outline-none focus:border-[#338dbc] transition-colors disabled:opacity-60`} />
                  {errors.fullName && <p className="text-red-500 text-[12px] mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <div className={`relative flex items-center border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded focus-within:border-[#338dbc] transition-colors overflow-hidden ${isProcessing ? 'opacity-60' : ''}`}>
                    <div className="bg-gray-50 px-3 flex items-center gap-1 border-r border-gray-300 py-3 h-full">
                      <span className="text-[14px] font-medium text-gray-600">VN</span>
                      <span className="text-[10px] text-gray-400">▼</span>
                    </div>
                    <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleInputChange} disabled={isProcessing}
                      className="flex-1 p-2.5 text-[14px] outline-none bg-transparent disabled:bg-transparent" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <input name="address" placeholder="Địa chỉ chi tiết" value={formData.address} onChange={handleInputChange} disabled={isProcessing}
                    className={`w-full border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] outline-none focus:border-[#338dbc] transition-colors disabled:opacity-60`} />
                  {errors.address && <p className="text-red-500 text-[12px] mt-1">{errors.address}</p>}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <select name="province" value={formData.province} onChange={handleInputChange} disabled={isProcessing}
                      className={`w-full border ${errors.province ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] bg-white outline-none focus:border-[#338dbc] disabled:opacity-60`}>
                      <option value="">Tỉnh thành</option>
                      {Object.keys(LOCATION_DATA).map(k => <option key={k} value={k}>{LOCATION_DATA[k].name}</option>)}
                    </select>
                    {errors.province && <p className="text-red-500 text-[12px] mt-1">{errors.province}</p>}
                  </div>

                  <div>
                    <select name="district" value={formData.district} onChange={handleInputChange} disabled={!formData.province || isProcessing} 
                      className={`w-full border ${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] bg-white outline-none focus:border-[#338dbc] disabled:bg-gray-50 disabled:opacity-60`}>
                      <option value="">Quận huyện</option>
                      {formData.province && Object.keys(LOCATION_DATA[formData.province].districts).map(k => <option key={k} value={k}>{LOCATION_DATA[formData.province].districts[k].name}</option>)}
                    </select>
                    {errors.district && <p className="text-red-500 text-[12px] mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <select name="ward" value={formData.ward} onChange={handleInputChange} disabled={!formData.district || isProcessing} 
                      className={`w-full border ${errors.ward ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded p-2.5 text-[14px] bg-white outline-none focus:border-[#338dbc] disabled:bg-gray-50 disabled:opacity-60`}>
                      <option value="">Phường xã</option>
                      {formData.district && LOCATION_DATA[formData.province].districts[formData.district].wards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    {errors.ward && <p className="text-red-500 text-[12px] mt-1">{errors.ward}</p>}
                  </div>
                </div>

                <textarea name="note" rows="3" placeholder="Ghi chú (tùy chọn)" value={formData.note} onChange={handleInputChange} disabled={isProcessing} className="w-full border border-gray-300 rounded p-2.5 text-[14px] outline-none focus:border-[#338dbc] disabled:opacity-60"></textarea>
                <p className="text-[13px] text-gray-500">
                  Quý khách có nhu cầu xuất hóa đơn vui lòng để lại thông tin xuất hóa đơn tại phần ghi chú.
                </p>
              </div>

              {/* PHẦN 2: VẬN CHUYỂN & THANH TOÁN */}
              <div className="space-y-8">
                {/* VẬN CHUYỂN */}
                <div className={`${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}>
                  <h2 className="text-[18px] font-bold text-gray-800 mb-4">Vận chuyển</h2>
                  {!isAddressComplete ? (
                    <div className="bg-[#d9edf7] border border-[#bce8f1] text-[#31708f] p-4 rounded text-[14px]">
                      Vui lòng nhập thông tin giao hàng
                    </div>
                  ) : (
                    <div className="border border-[#bce8f1] bg-[#f4f9fd] rounded p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-[18px] h-[18px] rounded-full border-[5px] border-[#338dbc]"></div>
                        <span className="text-[14px] text-gray-800">Giao hàng tận nơi</span>
                      </div>
                      <span className="text-[14px] text-[#338dbc] font-medium">35.000đ</span>
                    </div>
                  )}
                </div>

                {/* THANH TOÁN */}
                <div className={`${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}>
                  <h2 className="text-[18px] font-bold text-gray-800 mb-4">Thanh toán</h2>
                  <div className="border border-gray-300 rounded divide-y divide-gray-300 bg-white">
                    
                    <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="pay" value="VNPAY" checked={formData.paymentMethod === 'VNPAY'} onChange={() => setFormData({...formData, paymentMethod: 'VNPAY'})} className="hidden" />
                        <div className={`flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center ${formData.paymentMethod === 'VNPAY' ? 'border-[5px] border-[#338dbc]' : 'border border-gray-300 bg-white'}`}></div>
                        <span className="text-[14px] text-gray-700">Thanh toán online qua cổng VNPAY</span>
                      </div>
                      <img src={imgVnpay} alt="vnpay" className="h-4 ml-2" />
                    </label>

                    <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="pay" value="MB" checked={formData.paymentMethod === 'MB'} onChange={() => setFormData({...formData, paymentMethod: 'MB'})} className="hidden" />
                        <div className={`flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center ${formData.paymentMethod === 'MB' ? 'border-[5px] border-[#338dbc]' : 'border border-gray-300 bg-white'}`}></div>
                        <span className="text-[14px] text-gray-700">Thanh toán qua MBBank VietQR</span>
                      </div>
                      <span className="font-extrabold text-[#e30019] italic tracking-tighter text-[13px] ml-2">VIET<span className="text-[#102a63]">QR</span></span>
                    </label>

                    <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="pay" value="TCB" checked={formData.paymentMethod === 'TCB'} onChange={() => setFormData({...formData, paymentMethod: 'TCB'})} className="hidden" />
                        <div className={`flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center ${formData.paymentMethod === 'TCB' ? 'border-[5px] border-[#338dbc]' : 'border border-gray-300 bg-white'}`}></div>
                        <span className="text-[14px] text-gray-700">Thanh toán qua Techcombank VietQR</span>
                      </div>
                      <span className="font-extrabold text-[#e30019] italic tracking-tighter text-[13px] ml-2">VIET<span className="text-[#102a63]">QR</span></span>
                    </label>

                    <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="pay" value="COD" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({...formData, paymentMethod: 'COD'})} className="hidden" />
                        <div className={`flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center ${formData.paymentMethod === 'COD' ? 'border-[5px] border-[#338dbc]' : 'border border-gray-300 bg-white'}`}></div>
                        <span className="text-[14px] text-gray-700">Nhận hàng thanh toán (COD)</span>
                      </div>
                      <div className="bg-[#e1f0fa] text-[#338dbc] px-2.5 py-1 rounded shadow-sm border border-blue-100 ml-2"><FaMoneyBillWave size={14}/></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-start gap-4 text-[#338dbc] text-[13px]">
              <a href="#" className="hover:underline">Chính sách đổi trả và hoàn tiền</a>
              <a href="#" className="hover:underline">Chính sách bảo mật</a>
              <a href="#" className="hover:underline">Điều khoản sử dụng</a>
            </div>
          </div>

          {/* ================= CỘT PHẢI (TÓM TẮT ĐƠN HÀNG) ================= */}
          <div className="flex-[3.5] bg-[#fafafa] border-l border-gray-200 p-6 lg:p-10 shadow-inner min-h-screen">
            <h2 className="text-[18px] font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Đơn hàng ({totalItems} sản phẩm)</h2>

            <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 pt-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 border border-gray-300 rounded bg-white p-1">
                      <img 
                        src={getImageUrl(item.thumbnail_url || item.image)} 
                        alt={item.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Elmich"; }}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 bg-[#338dbc] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-gray-700 font-medium line-clamp-2 leading-snug">{item.name}</p>
                  </div>
                  <span className="text-[14px] text-gray-800 font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6 border-y border-gray-200 py-5">
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-[#e6f7ef] border border-[#a2e3c4] p-2.5 rounded flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">🏷️</span>
                    <span className="text-[13px] font-bold text-green-700">{appliedVoucher}</span>
                  </div>
                  <button onClick={handleRemoveVoucher} disabled={isProcessing} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                    <FaTimes size={14}/>
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    value={voucherInput} 
                    onChange={(e) => setVoucherInput(e.target.value)} 
                    disabled={isProcessing}
                    placeholder="Mã giảm giá" 
                    className="flex-1 border border-gray-300 rounded px-3 py-2.5 text-[14px] outline-none focus:border-[#338dbc] disabled:opacity-60" 
                  />
                  <button onClick={handleApplyVoucher} disabled={isProcessing} className="bg-[#489ecb] hover:bg-[#338dbc] text-white px-5 py-2.5 rounded font-medium text-[13px] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    ÁP DỤNG
                  </button>
                </>
              )}
            </div>

            <div className="space-y-3 text-[14px] text-gray-600 mb-6">
              <div className="flex justify-between"><span>Tạm tính</span><span className="font-bold text-gray-800">{subtotal.toLocaleString()}đ</span></div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-gray-800">{isAddressComplete ? "35.000đ" : "-"}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span className="font-bold">- {discountAmount.toLocaleString()}đ</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-5 mb-8">
              <span className="text-[18px] font-bold text-[#338dbc]">Tổng cộng</span>
              <span className="text-[#338dbc] text-[24px] font-bold">
                {Math.max(subtotal + currentShippingFee - discountAmount, 0).toLocaleString()}đ
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/cart" className={`text-gray-500 text-[14px] flex items-center gap-1 hover:text-[#338dbc] transition-colors ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                <FaChevronLeft size={10}/> Quay về giỏ hàng
              </Link>
              
              {/* NÚT ĐẶT HÀNG KÈM HIỆU ỨNG SPINNER */}
              <button 
                onClick={handleOrder} 
                disabled={isProcessing}
                className={`bg-[#489ecb] hover:bg-[#338dbc] text-white px-8 py-3 rounded text-[15px] font-medium transition-all min-w-[140px] flex justify-center items-center gap-2 ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" /> ĐANG XỬ LÝ...
                  </>
                ) : (
                  "ĐẶT HÀNG"
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default CheckoutPage;