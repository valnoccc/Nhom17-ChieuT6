import React, { useState, useEffect } from "react"; // Thêm useEffect
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

// IMPORT CÁC ẢNH 
import imgP1 from "../../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
import imgP2 from "../../../images/may_xay_sinh_to_cam_tay_elmich_ble_9213.png";
import imgP3 from "../../../images/may_xay_sinh_to_elmich_ble_8763.png";
import imgP4 from "../../../images/may_xay_sinh_to_cam_tay_elmich_ble_3890.png";
import imgP5 from "../../../images/may_xay_sinh_to_elmich_ble_8718.png";

const flashSaleProducts = [
  { id: 1, name: "Máy xay sinh tố mini Elmich BLE9244", price: 699000, oldPrice: 1549000, discount: 55, image: imgP1 },
  { id: 2, name: "Máy xay sinh tố cầm tay Elmich BLE 9213", price: 550000, oldPrice: 1139000, discount: 52, image: imgP2 },
  { id: 3, name: "Máy xay sinh tố Elmich BLE-8763", price: 1310000, oldPrice: 1909000, discount: 31, image: imgP3 },
  { id: 4, name: "Máy xay sinh tố cầm tay Elmich BLE-3890", price: 550000, oldPrice: 959000, discount: 43, image: imgP4 },
  { id: 5, name: "Máy xay sinh tố Elmich BLE-8718", price: 1010000, oldPrice: 1809000, discount: 44, image: imgP5 },
];

const FlashSale = () => {
  const { addToCart } = useCart();

  // ================= LOGIC BỘ ĐẾM GIỜ =================
  // Thiết lập thời gian kết thúc (Ví dụ: 24h kể từ bây giờ)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp bộ nhớ khi chuyển trang
  }, []);

  // Hàm chuyển đổi giây thành định dạng Ngày:Giờ:Phút:Giây
  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return {
      days: d < 10 ? `0${d}` : d,
      hours: h < 10 ? `0${h}` : h,
      minutes: m < 10 ? `0${m}` : m,
      seconds: s < 10 ? `0${s}` : s,
    };
  };

  const time = formatTime(timeLeft);
  // ====================================================

  return (
    <section className="my-10 w-full">
      <div className="w-full">
        <div className="bg-[#f04e6c] rounded-2xl p-8 lg:p-10 shadow-lg w-full">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center leading-none italic font-black transform -skew-x-12 bg-yellow-400 py-2 px-4 rounded shadow-sm">
                <span className="text-red-600 text-[13px] uppercase tracking-widest">Flash</span>
                <span className="text-white text-[22px] uppercase drop-shadow-md">Sale</span>
              </div>
              <h2 className="text-[28px] lg:text-[34px] font-black text-white italic uppercase drop-shadow-sm tracking-wide">
                GIÁ TỐT MỖI NGÀY
              </h2>
            </div>

            {/* RIGHT - COUNTDOWN CHẠY THẬT */}
            <div className="flex items-center gap-3 text-white font-bold text-[16px] lg:text-[18px]">
              <span className="uppercase">Kết thúc:</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">{time.days}</span>
                <span className="uppercase text-[14px] mx-1">Ngày</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">{time.hours}</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">{time.minutes}</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none animate-pulse">{time.seconds}</span>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-8">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-5 hover:shadow-2xl transition-all duration-300 relative flex flex-col group border-2 border-pink-100 h-full">
                <div className="absolute top-0 left-0 bg-[#ed1c24] text-white text-[14px] font-bold px-4 py-2 rounded-tl-xl rounded-br-xl z-10 shadow-md">
                  Giảm {product.discount}%
                </div>

                <Link to={`/product/${product.id}`} className="w-full relative mb-5 pt-8 flex flex-col items-center justify-end h-[240px] xl:h-[280px] cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[160px] xl:h-[200px] object-contain group-hover:-translate-y-3 transition-transform duration-300 z-0"
                  />
                  <div className="w-full bg-[#ffe0e5] text-[#d71920] text-[12px] xl:text-[13px] text-center py-2 mt-4 rounded-t-lg relative overflow-hidden font-medium">
                    <span className="font-bold italic">Tặng quà xịn</span>
                  </div>
                </Link>

                <Link to={`/product/${product.id}`}>
                  <h3 className="text-[16px] xl:text-[18px] text-gray-800 line-clamp-2 min-h-[48px] xl:min-h-[54px] mb-3 leading-snug group-hover:text-[#ed1c24] transition-colors font-medium cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex text-yellow-400 text-[14px] xl:text-[16px] mb-4 gap-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-yellow-400" />
                </div>

                <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[#ed1c24] font-black text-[20px] lg:text-[24px] xl:text-[26px] leading-none mb-1.5">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-gray-400 text-[14px] lg:text-[15px] line-through leading-none">
                      {product.oldPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-[#ed1c24] text-white w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-lg hover:bg-red-700 transition-colors shadow-md z-10"
                  >
                    <FaShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;