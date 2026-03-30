import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCheckCircle, FaStar, FaFacebook, FaFacebookMessenger, FaLink, FaFireAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// IMPORT HÌNH ẢNH MẪU
import logoElmich from "../../images/logo_elmich.png"; 
import imgMain from "../../images/may_xay_sinh_to_cam_tay_elmich_ble_3890.png"; 
import imgThumb1 from "../../images/may_xay_sinh_to.png"; 
import imgThumb2 from "../../images/may_ep.png";

// Dữ liệu mẫu
const PRODUCT = {
  id: "BLE-3890",
  name: "MÁY XAY SINH TỐ CẦM TAY ELMICH BLE-3890",
  code: "4023890",
  sold: 684,
  rating: 5,
  reviews: 2,
  price: 550000,
  oldPrice: 959000,
  discount: "43%",
  color: "Xanh Mint",
  images: [imgMain, imgThumb1, imgThumb2, imgMain],
  vouchers: [
    { display: "Giảm 120K", code: "L7TXMUHVO26M" },
    { display: "Giảm 200K", code: "1VV3D9YJAYNS" },
    { display: "Giảm 300K", code: "XOPC0393NT08" },
    { display: "Giảm 10%", code: "NJRVAXXY4J7E" }
  ],
  features: [
    "An toàn theo CHUẨN CHÂU ÂU.",
    "Xay nhuyễn mịn trong 40s nhờ lưỡi dao inox 10 cánh cấu tạo 3 tầng sắc bén với tốc độ quay siêu nhanh 32.000 vòng/phút.",
    "Gọn nhẹ dễ dàng cho vào túi xách, Mang theo mọi lúc, mọi nơi như đi du lịch, dã ngoại, cắm trại.",
    "Sạc pin nhanh chóng, sử dụng được trong 9 chu kỳ xay/1 lần sạc.",
    "Dễ tháo lắp và vệ sinh, tiết kiệm thời gian.",
    "THIẾT KẾ trẻ trung, thời trang.",
    "Bảo hành và dịch vụ sau bán hàng theo chuẩn Châu Âu, bảo hành 24 tháng, 1 đổi 1 trong 12 tháng."
  ]
};

const RECENTLY_VIEWED = [
  { id: 1, name: "MÁY XAY SINH TỐ CẦM TAY 400ML ELMICH BLE-9215", image: imgThumb1 },
  { id: 2, name: "BÌNH GIỮ NHIỆT INOX 304 ELMICH EL8376 DUNG TÍCH 720ML", image: imgThumb2 },
  { id: 3, name: "BÌNH GIỮ NHIỆT GIA ĐÌNH INOX 304 ELMICH DUNG TÍCH 1.2L", image: imgMain },
];

const REVIEW_FILTERS = ['Tất cả', '5 Điểm (2)', '4 Điểm (0)', '3 Điểm (0)', '2 Điểm (0)', '1 Điểm (0)', 'Có hình ảnh (0)'];

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [activeImage, setActiveImage] = useState(PRODUCT.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  // ================= ĐÃ SỬA Ở ĐÂY =================
  // Bỏ dòng toast.success đi để tránh bị đúp thông báo
  const handleAddToCart = () => {
    addToCart({ ...PRODUCT, price: PRODUCT.price, image: PRODUCT.images[0] }, quantity);
  };
  // =================================================

  const handleBuyNow = () => {
    addToCart({ ...PRODUCT, price: PRODUCT.price, image: PRODUCT.images[0] }, quantity);
    navigate('/checkout');
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`📋 Đã lưu mã: ${code}`);
    });
  };

  const handleShare = (platform) => {
    toast.info(`🔗 Đang mở chia sẻ qua ${platform}...`);
  };

  const handleRelatedProductClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Đang chuyển đến sản phẩm...");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        {/* BREADCRUMB */}
        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#e30019] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-800 font-bold">Máy xay sinh tố</span>
          </div>
        </div>

        <main className="flex-grow max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8 w-full space-y-6 md:space-y-8">
          
          {/* ================= PHẦN 1: HERO SECTION ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-10 lg:gap-14">
            
            {/* Cột Trái: Hình ảnh */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col gap-5">
              <div className="w-full aspect-square border border-gray-200 rounded-lg p-6 flex items-center justify-center bg-gray-50 relative">
                 <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-100 flex items-center gap-1 z-10">
                    <img src={logoElmich} alt="elmich" className="h-4" />
                    <span className="text-[11px] font-bold text-gray-700">CHUẨN CHÂU ÂU</span>
                 </div>
                 <img src={activeImage} alt="Product" className="w-full h-full object-contain mix-blend-multiply transition-all duration-300" />
              </div>
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {PRODUCT.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 lg:w-24 lg:h-24 border-2 rounded-lg p-1.5 cursor-pointer flex-shrink-0 transition-all ${activeImage === img ? 'border-[#e30019] shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
              
              {/* Chia sẻ */}
              <div className="flex items-center gap-3 mt-2 text-[14px] text-gray-600">
                <span className="font-medium">Chia sẻ:</span>
                <div className="flex gap-2.5">
                  <FaFacebook onClick={() => handleShare('Facebook')} className="text-blue-600 text-2xl cursor-pointer hover:opacity-80 transition-opacity" />
                  <FaFacebookMessenger onClick={() => handleShare('Messenger')} className="text-blue-500 text-2xl cursor-pointer hover:opacity-80 transition-opacity" />
                  <FaLink onClick={() => handleCopyVoucher(window.location.href)} className="text-gray-500 text-2xl cursor-pointer hover:text-black transition-colors" />
                </div>
              </div>
            </div>

            {/* Cột Phải: Thông tin giá & Mua */}
            <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col">
              <h1 className="text-[26px] lg:text-[32px] font-bold text-gray-800 leading-tight mb-4">
                {PRODUCT.name}
              </h1>
              
              <div className="flex items-center gap-4 text-[14px] text-gray-600 mb-5 pb-5 border-b border-gray-100">
                <span className="flex items-center gap-1 font-medium">🛒 Đã bán {PRODUCT.sold}</span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-yellow-400 text-[16px]">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <span onClick={() => document.getElementById('reviews-section').scrollIntoView({behavior: 'smooth'})} className="text-blue-600 hover:underline cursor-pointer font-medium">({PRODUCT.reviews} đánh giá)</span>
              </div>

              <p className="text-[15px] text-gray-500 mb-6">Mã sản phẩm: <span className="font-bold text-gray-800">{PRODUCT.code}</span></p>

              <div className="bg-gray-50/80 border border-gray-100 p-5 lg:p-6 rounded-xl flex items-end gap-5 mb-8">
                <span className="text-[36px] lg:text-[40px] font-black text-[#e30019] leading-none tracking-tight">{PRODUCT.price.toLocaleString()}đ</span>
                <span className="text-[18px] text-gray-400 line-through mb-1.5">{PRODUCT.oldPrice.toLocaleString()}đ</span>
                <span className="bg-[#e30019] text-white text-[13px] font-bold px-2.5 py-1 rounded-sm mb-1.5 shadow-sm">{PRODUCT.discount}</span>
              </div>

              {/* Nút Voucher */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[15px] font-bold text-gray-700 w-20">Voucher:</span>
                <div className="flex flex-wrap gap-2.5">
                  {PRODUCT.vouchers.map((v, i) => (
                    <span 
                      key={i} 
                      onClick={() => handleCopyVoucher(v.code)}
                      title={`Bấm để sao chép mã: ${v.code}`}
                      className="bg-red-50 text-[#e30019] border border-red-200 px-3 py-1.5 text-[13px] font-medium rounded-sm cursor-pointer hover:bg-[#e30019] hover:text-white transition-colors active:scale-95"
                    >
                      {v.display}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8 flex items-start gap-4">
                <span className="block text-[15px] font-bold text-gray-700 w-20 pt-2">Màu sắc:</span>
                <div className="border-2 border-[#e30019] bg-white px-5 py-2.5 rounded-md inline-flex items-center gap-3 cursor-pointer relative overflow-hidden shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-teal-200 border border-gray-300"></div>
                  <span className="text-[15px] font-medium">{PRODUCT.color}</span>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#e30019] flex items-center justify-center rounded-tl-md">
                    <FaCheckCircle className="text-white text-[12px]" />
                  </div>
                </div>
              </div>

              {/* Số lượng & Mua */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[15px] font-bold text-gray-700 w-20">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden shadow-sm">
                    <button onClick={handleDecrease} className="w-12 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium active:bg-gray-200">-</button>
                    <input type="text" value={quantity} readOnly className="w-14 h-11 text-center text-[16px] font-bold text-gray-800 outline-none border-x border-gray-300 bg-transparent" />
                    <button onClick={handleIncrease} className="w-12 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium active:bg-gray-200">+</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                  <button onClick={handleBuyNow} className="flex-[2] bg-[#e30019] text-white py-4 rounded-xl flex flex-col items-center justify-center hover:bg-red-800 transition-colors shadow-lg active:scale-95">
                    <span className="text-[18px] font-black uppercase tracking-wide">Mua Ngay</span>
                    <span className="text-[13px] font-medium opacity-90">(Giao hàng tận nơi)</span>
                  </button>
                  <button onClick={handleAddToCart} className="flex-[1] bg-white border-2 border-[#e30019] text-[#e30019] py-4 rounded-xl flex flex-col items-center justify-center hover:bg-red-50 transition-colors active:scale-95 shadow-sm">
                    <FaShoppingCart size={22} className="mb-1" />
                    <span className="text-[14px] font-bold">Thêm vào giỏ</span>
                  </button>
                </div>

                <div className="mt-6 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl p-3.5 flex items-center gap-3 shadow-md">
                  <FaFireAlt size={24} className="animate-pulse flex-shrink-0" />
                  <span className="text-[14px] font-medium leading-snug">Hơn 135 khách hàng mua sản phẩm này đã nhận ưu đãi</span>
                </div>
              </div>

            </div>
          </div>

          {/* ================= PHẦN 2: THÔNG TIN - ĐÁNH GIÁ ================= */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            
            <div className="flex-[7.5] space-y-6 md:space-y-8">
              
              {/* Đặc điểm nổi bật */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <h3 className="text-[20px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Đặc điểm nổi bật</h3>
                <ul className="space-y-4">
                  {PRODUCT.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
                      <FaCheckCircle className="text-green-500 mt-1.5 flex-shrink-0 text-lg" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 relative">
                <h3 className="text-[20px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Thông tin sản phẩm</h3>
                
                <div className={`relative overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1500px]' : 'max-h-[350px]'}`}>
                  <div className="w-full aspect-video md:aspect-[21/9] bg-gray-900 rounded-xl relative flex items-center justify-center cursor-pointer group shadow-inner overflow-hidden mb-6">
                    <img src={imgMain} alt="cover" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#e30019] rounded-full flex items-center justify-center text-white z-10 shadow-xl group-hover:scale-110 transition-transform">
                      <span className="text-2xl ml-1">▶</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">Máy xay sinh tố cầm tay Elmich BLE-3890 là thiết bị nhà bếp thông minh, thiết kế nhỏ gọn, phù hợp cho người tập gym, dân văn phòng hoặc mang đi du lịch. Động cơ mạnh mẽ giúp xay nhuyễn đá, trái cây đông lạnh chỉ trong chớp mắt.</p>
                  <p className="text-gray-700 leading-relaxed pb-12">Sản phẩm sử dụng nhựa Tritan an toàn cho sức khỏe, không chứa BPA. Lưỡi dao Inox 304 không gỉ sắc bén, chống ăn mòn. Dung lượng pin lớn, dễ dàng sạc qua cổng Type-C tiện lợi.</p>

                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                   <button 
                     onClick={() => setIsExpanded(!isExpanded)}
                     className="bg-white border border-gray-200 text-gray-800 px-8 py-2.5 rounded-full text-[14px] font-bold shadow-lg hover:bg-gray-50 hover:text-[#e30019] transition-colors"
                   >
                     {isExpanded ? 'Thu gọn ⌃' : 'Xem thêm ⌄'}
                   </button>
                </div>
              </div>

              {/* Đánh giá */}
              <div id="reviews-section" className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <h3 className="text-[20px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Đánh giá sản phẩm</h3>
                
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center bg-[#f9fafb] border border-gray-100 p-8 rounded-xl mb-8">
                  <div className="text-center">
                    <span className="text-[56px] font-black text-yellow-500 leading-none drop-shadow-sm">5/5</span>
                    <div className="flex text-yellow-500 text-[20px] justify-center my-3 gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
                    <span className="text-[14px] text-gray-500 font-medium">({PRODUCT.reviews} đánh giá)</span>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-3 justify-center md:justify-start">
                    {REVIEW_FILTERS.map((filter, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 border rounded-md text-[14px] font-medium transition-colors ${activeFilter === filter ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-bold text-[15px] text-gray-800">Lê Thu Thủy</span>
                      <div className="flex text-yellow-400 text-[12px]"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
                    </div>
                    <p className="text-[13px] text-green-600 flex items-center gap-1.5 mb-3 font-medium"><FaCheckCircle /> Đã mua hàng tại Elmich chính hãng</p>
                    <p className="text-[15px] text-gray-700 mb-3 leading-relaxed">Máy này có xay được thực phẩm nóng không shop?</p>
                    <p className="text-[13px] text-gray-400">Gửi trả lời • <span className="hover:text-blue-500 cursor-pointer transition-colors">👍 Hữu ích</span> • <span className="hover:text-red-500 cursor-pointer transition-colors">⚠️ Báo cáo sai phạm</span> • 10:48 08/03/2026</p>
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-bold text-[15px] text-gray-800">Hoạch</span>
                      <div className="flex text-yellow-400 text-[12px]"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
                    </div>
                    <p className="text-[13px] text-green-600 flex items-center gap-1.5 mb-3 font-medium"><FaCheckCircle /> Đã mua hàng tại Elmich chính hãng</p>
                    <p className="text-[15px] text-gray-700 mb-3 leading-relaxed">Dung tích như nào?</p>
                    <p className="text-[13px] text-gray-400">Gửi trả lời • <span className="hover:text-blue-500 cursor-pointer transition-colors">👍 Hữu ích</span> • <span className="hover:text-red-500 cursor-pointer transition-colors">⚠️ Báo cáo sai phạm</span> • 20:43 01/03/2026</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toast.info("Tính năng Gửi đánh giá đang được cập nhật!")}
                  className="mt-8 bg-green-500 text-white px-8 py-3 rounded-lg text-[15px] font-bold hover:bg-green-600 transition-colors shadow-md active:scale-95"
                >
                  Gửi đánh giá của bạn
                </button>
              </div>

            </div>

            {/* Cột Phải: Sản phẩm đã xem */}
            <div className="flex-[2.5]">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-[18px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Sản phẩm bạn đã xem</h3>
                <div className="space-y-5">
                  {RECENTLY_VIEWED.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleRelatedProductClick(item.id)}
                      className="flex gap-4 items-center group cursor-pointer"
                    >
                      <div className="w-20 h-20 border border-gray-200 rounded-lg p-1.5 bg-gray-50 flex-shrink-0 group-hover:border-red-400 transition-colors">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <p className="text-[13px] font-bold text-gray-700 leading-snug line-clamp-3 group-hover:text-[#e30019] transition-colors">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default ProductDetailPage;