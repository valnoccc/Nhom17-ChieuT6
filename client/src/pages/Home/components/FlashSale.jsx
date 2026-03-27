import React from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";

// 1. IMPORT CÁC ẢNH 
import imgP1 from "../../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
import imgP2 from "../../../images/may_xay_sinh_to_cam_tay_elmich_ble_9213.png";
import imgP3 from "../../../images/may_xay_sinh_to_elmich_ble_8763.png";
import imgP4 from "../../../images/may_xay_sinh_to_cam_tay_elmich_ble_3890.png";
import imgP5 from "../../../images/may_xay_sinh_to_elmich_ble_8718.png";

const flashSaleProducts = [
  { 
    id: 1, 
    name: "Máy xay sinh tố mini Elmich BLE9244", 
    price: 699000, 
    oldPrice: 1549000, 
    discount: 55, 
    image: imgP1 
  },
  { 
    id: 2, 
    name: "Máy xay sinh tố cầm tay Elmich BLE 9213", 
    price: 550000, 
    oldPrice: 1139000, 
    discount: 52, 
    image: imgP2 
  },
  { 
    id: 3, 
    name: "Máy xay sinh tố Elmich BLE-8763", 
    price: 1310000, 
    oldPrice: 1909000, 
    discount: 31, 
    image: imgP3 
  },
  { 
    id: 4, 
    name: "Máy xay sinh tố cầm tay Elmich BLE-3890", 
    price: 550000, 
    oldPrice: 959000, 
    discount: 43, 
    image: imgP4 
  },
  { 
    id: 5, 
    name: "Máy xay sinh tố Elmich BLE-8718", 
    price: 1010000, 
    oldPrice: 1809000, 
    discount: 44, 
    image: imgP5 
  },
];

const FlashSale = () => {
  return (
    <section className="my-10 w-full">
      <div className="w-full">
        
        {/* BACKGROUND BOX */}
        <div className="bg-[#f04e6c] rounded-2xl p-8 lg:p-10 shadow-lg w-full">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            
            {/* LEFT - TITLE */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center leading-none italic font-black transform -skew-x-12 bg-yellow-400 py-2 px-4 rounded shadow-sm">
                <span className="text-red-600 text-[13px] uppercase tracking-widest">Flash</span>
                <span className="text-white text-[22px] uppercase drop-shadow-md">Sale</span>
              </div>
              
              <h2 className="text-[28px] lg:text-[34px] font-black text-white italic uppercase drop-shadow-sm outline-text tracking-wide">
                GIÁ TỐT MỖI NGÀY
              </h2>
            </div>

            {/* RIGHT - COUNTDOWN */}
            <div className="flex items-center gap-3 text-white font-bold text-[16px] lg:text-[18px]">
              <span className="uppercase">Kết thúc:</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">00</span>
                <span className="uppercase text-[14px] mx-1">Ngày</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">06</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">12</span>
                <span className="bg-[#d71920] border-[2px] border-white px-3 py-1.5 rounded-sm leading-none">27</span>
              </div>
            </div>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-8">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-5 hover:shadow-2xl transition-all duration-300 relative flex flex-col group border-2 border-pink-100 h-full">
                
                {/* DISCOUNT BADGE */}
                <div className="absolute top-0 left-0 bg-[#ed1c24] text-white text-[14px] font-bold px-4 py-2 rounded-tl-xl rounded-br-xl z-10 shadow-md">
                  Giảm {product.discount}%
                </div>

                {/* IMAGE & PROMO BANNER */}
                <div className="w-full relative mb-5 pt-8 flex flex-col items-center justify-end h-[240px] xl:h-[280px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                    className="h-[160px] xl:h-[200px] object-contain group-hover:-translate-y-3 transition-transform duration-300 z-0"
                  />
                  <div className="w-full bg-[#ffe0e5] text-[#d71920] text-[12px] xl:text-[13px] text-center py-2 mt-4 rounded-t-lg relative overflow-hidden font-medium">
                    <span className="font-bold italic">Tặng quà xịn</span> <br/>
                    
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-[16px] xl:text-[18px] text-gray-800 line-clamp-2 min-h-[48px] xl:min-h-[54px] mb-3 leading-snug group-hover:text-[#ed1c24] transition-colors font-medium">
                  {product.name}
                </h3>

                {/* 5 STARS RATING */}
                <div className="flex text-yellow-400 text-[14px] xl:text-[16px] mb-4 gap-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-yellow-400" />
                </div>

                {/* PRICE & CART BUTTON */}
                <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[#ed1c24] font-black text-[20px] lg:text-[24px] xl:text-[26px] leading-none mb-1.5">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-gray-400 text-[14px] lg:text-[15px] line-through leading-none">
                      {product.oldPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  
                  <button className="bg-[#ed1c24] text-white w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center rounded-lg hover:bg-red-700 transition-colors shadow-md">
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