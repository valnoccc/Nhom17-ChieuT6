import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// ================= TẤT CẢ IMPORT PHẢI Ở TRÊN CÙNG =================
// ================= DÙNG ĐƯỜNG DẪN PUBLIC =================
const PLACEHOLDER_IMG = '/images/may_xay_sinh_to_mini_elmich_ble9244.png';

const STATIC_VOUCHERS = [
  { display: "Giảm 120K", code: "L7TXMUHVO26M" },
  { display: "Giảm 200K", code: "1VV3D9YJAYNS" },
  { display: "Giảm 300K", code: "XOPC0393NT08" },
  { display: "Giảm 10%", code: "NJRVAXXY4J7E" }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // HÀM XỬ LÝ ẢNH 
  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith('http')) return url;
    return url.startsWith('/images/') ? url : `/images/${url}`;
  };

  // 1. GỌI API LẤY CHI TIẾT SẢN PHẨM
  // 1. GỌI API LẤY CHI TIẾT SẢN PHẨM THỰC TẾ
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        // Gọi trực tiếp API với ID từ URL
        const response = await axios.get(`https://nhom17-chieut6.onrender.com/api/products/${id}`);

        // Kiểm tra dữ liệu trả về từ server
        if (response.data && response.data.success) {
          const productData = response.data.data;

          setProduct(productData);

          // Ưu tiên hiển thị ảnh thumbnail_url trước vì nó là ảnh đại diện (ảnh 1)
          const defaultImg = productData.thumbnail_url ||
            ((productData.all_images && productData.all_images.length > 0) ? productData.all_images[0] : PLACEHOLDER_IMG);

          setActiveImage(defaultImg);
        } else {
          toast.error(response.data.message || "Không tìm thấy sản phẩm!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ server:", error);
        toast.error("Không thể kết nối đến máy chủ!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <FaSpinner className="animate-spin text-[#e30019] text-4xl" />
        <span className="ml-3 font-bold text-gray-600">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại!</div>;
  }

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`📋 Đã lưu mã: ${code}`);
    });
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#e30019]">🏠 Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-800 font-bold">{product.category_id || 'Sản phẩm'}</span>
          </div>
        </div>

        <main className="flex-grow max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full space-y-8">

          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-10 lg:gap-14">

            {/* HÌNH ẢNH */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col gap-5">
              {/* Khung ảnh lớn */}
              <div className="w-full aspect-square border border-gray-200 rounded-lg p-6 flex items-center justify-center bg-gray-50 relative">
                <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-100 flex items-center gap-1 z-10">
                  <img src="/images/logo_elmich.png" alt="elmich" className="h-4" />
                  <span className="text-[11px] font-bold text-gray-700">CHUẨN CHÂU ÂU</span>
                </div>
                <img
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
                />
              </div>

              {/* Danh sách ảnh con (Thumbnails) */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {/* Luôn hiển thị ảnh đại diện chính trước */}
                <div
                  onClick={() => setActiveImage(product.thumbnail_url)}
                  className={`w-20 h-20 lg:w-24 lg:h-24 border-2 rounded-lg p-1.5 cursor-pointer flex-shrink-0 transition-all ${activeImage === product.thumbnail_url ? 'border-[#e30019]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <img src={getImageUrl(product.thumbnail_url)} alt="main-thumb" className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                {/* Hiển thị các ảnh phụ từ mảng all_images */}
                {product.all_images && product.all_images.map((img, index) => (
                  // Tránh lặp lại nếu ảnh phụ trùng với thumbnail_url
                  img !== product.thumbnail_url && (
                    <div
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 lg:w-24 lg:h-24 border-2 rounded-lg p-1.5 cursor-pointer flex-shrink-0 transition-all ${activeImage === img ? 'border-[#e30019]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`thumb-${index}`}
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => { e.target.style.display = 'none'; }} // Ẩn nếu ảnh lỗi
                      />
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* THÔNG TIN */}
            <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col">
              <h1 className="text-[26px] lg:text-[32px] font-bold text-gray-800 leading-tight mb-4 uppercase">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-[14px] text-gray-600 mb-5 pb-5 border-b border-gray-100">
                <span className="font-medium">🛒 Trong kho: {product.stock_quantity || 0}</span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>

              <div className="bg-gray-50/80 border border-gray-100 p-5 lg:p-6 rounded-xl flex items-end gap-5 mb-8">
                <span className="text-[36px] lg:text-[40px] font-black text-[#e30019] tracking-tight">{Number(product.price).toLocaleString('vi-VN')}đ</span>
              </div>

              {/* Voucher */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[15px] font-bold text-gray-700 w-20">Voucher:</span>
                <div className="flex flex-wrap gap-2.5">
                  {STATIC_VOUCHERS.map((v, i) => (
                    <span key={i} onClick={() => handleCopyVoucher(v.code)} className="bg-red-50 text-[#e30019] border border-red-200 px-3 py-1.5 text-[13px] font-medium rounded-sm cursor-pointer hover:bg-[#e30019] hover:text-white transition-colors">
                      {v.display}
                    </span>
                  ))}
                </div>
              </div>

              {/* Số lượng & Mua */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[15px] font-bold text-gray-700 w-20">Số lượng:</span>
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button onClick={handleDecrease} className="w-12 h-11 flex items-center justify-center hover:bg-gray-100">-</button>
                    <input type="text" value={quantity} readOnly className="w-14 h-11 text-center font-bold text-gray-800 outline-none border-x border-gray-300" />
                    <button onClick={handleIncrease} className="w-12 h-11 flex items-center justify-center hover:bg-gray-100">+</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                  <button onClick={handleBuyNow} className="flex-[2] bg-[#e30019] text-white py-4 rounded-xl font-black uppercase shadow-lg active:scale-95 transition-all">
                    Mua Ngay
                  </button>
                  <button onClick={handleAddToCart} className="flex-[1] bg-white border-2 border-[#e30019] text-[#e30019] py-4 rounded-xl font-bold flex flex-col items-center justify-center active:scale-95 transition-all">
                    <FaShoppingCart size={22} />
                    <span className="text-[12px]">Thêm vào giỏ</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* CHI TIẾT DƯỚI */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[7.5] space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <h3 className="text-[20px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Đặc điểm nổi bật</h3>
                <div className="text-[15px] text-gray-700 leading-relaxed space-y-4">
                  <div dangerouslySetInnerHTML={{ __html: product.description || 'Đang cập nhật mô tả...' }} />
                </div>
              </div>
            </div>

            <div className="flex-[2.5]">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 text-center">
                <p className="text-gray-400 italic">Cam kết hàng chính hãng 100%</p>
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