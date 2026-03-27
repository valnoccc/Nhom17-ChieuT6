import React from 'react';
import { FaFacebook, FaTiktok, FaYoutube, FaAngleUp, FaPhoneAlt, FaFacebookMessenger } from 'react-icons/fa';

// IMPORT ẢNH THẬT TỪ THƯ MỤC IMAGES (Lùi 2 cấp: ../../)
import logoElmich from '../../images/logo_elmich.png';
import logoShopee from '../../images/logo_shopee.png';
import payment1 from '../../images/payment-1.png';
import payment2 from '../../images/payment-2.png';
import payment3 from '../../images/payment-3.png';
import logoBct from '../../images/logo_bct.png';

const Footer = () => {
  return (
    <>
      {/* 1. THANH CÔNG CỤ LIÊN HỆ BÊN PHẢI */}
      <div className="fixed right-0 top-[60%] -translate-y-1/2 bg-[#ed1c24] text-white flex flex-col items-center py-4 px-2 rounded-l-2xl z-50 shadow-lg space-y-6">
        <a href="#" className="hover:scale-110 transition-transform"><FaPhoneAlt size={20} /></a>
        <a href="#" className="hover:scale-110 transition-transform"><FaFacebookMessenger size={22} /></a>
        <a href="#" className="hover:scale-110 transition-transform text-[13px] font-black bg-white text-[#ed1c24] px-1 py-0.5 rounded-sm">Zalo</a>
      </div>

      {/* 2. NÚT CUỘN LÊN ĐẦU TRANG */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-6 bottom-6 bg-[#ed1c24] text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 shadow-xl transition-transform hover:-translate-y-1 z-50"
        title="Cuộn lên đầu trang"
      >
        <FaAngleUp size={24} />
      </div>

      {/* 3. NỘI DUNG FOOTER */}
      <footer className="bg-white pt-16 pb-6 border-t border-gray-200 mt-10 relative font-sans text-[#333]">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* TOP SECTION: 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 lg:gap-x-12 xl:gap-x-20 mb-14">
            
            {/* CỘT 1: Thông tin công ty */}
            <div className="lg:col-span-4">
              <img 
                src={logoElmich} 
                alt="Elmich Logo"
                className="mb-4"
              />
              <div className="text-[14.5px] leading-8 text-gray-700">
                <p>
                  <strong className="text-gray-900 font-bold">Elmich Group:</strong> U Hrubku 1570 Ostrava Nova Ves 70900, Czech Republic
                </p>
                <p>
                  <strong className="text-gray-900 font-bold">Văn phòng Việt Nam:</strong> Tầng 17 tòa nhà 319 Bộ Quốc Phòng, Số 63 Lê Văn Lương, phường Yên Hòa, thành phố Hà Nội.
                </p>
                <p>
                  <strong className="text-gray-900 font-bold">Email:</strong> cskh@elmich.vn
                </p>
                <p>
                  <strong className="text-gray-900 font-bold">Hotline:</strong> 1900 6369 25
                </p>
                <p>
                  <strong className="text-gray-900 font-bold">Mã số thuế:</strong> 0700525789
                </p>
              </div>
            </div>

            {/* CỘT 2: Hướng dẫn - Chính sách */}
            <div className="lg:col-span-3">
              <h4 className="font-bold text-[18px] lg:text-[20px] text-gray-800 mb-6 whitespace-nowrap">Hướng dẫn - Chính sách</h4>
              <ul className="text-[15px] text-gray-600 space-y-4 whitespace-nowrap">
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách bảo hành</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách giao hàng, kiểm hàng</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách thanh toán</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách bảo mật thông tin</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chính sách trả góp 0%</a></li>
              </ul>
            </div>

            {/* CỘT 3: Liên hệ - Giới thiệu */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-[18px] lg:text-[20px] text-gray-800 mb-6 whitespace-nowrap">Liên hệ - Giới thiệu</h4>
              <ul className="text-[15px] text-gray-600 space-y-4 whitespace-nowrap">
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Giới thiệu về ELMICH</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Chứng nhận sản phẩm</a></li>
                <li><a href="#" className="hover:text-[#ed1c24] transition-colors">Liên hệ - Hỗ trợ</a></li>
              </ul>
            </div>

            {/* CỘT 4: Kết nối & Thanh toán */}
            <div className="lg:col-span-3 lg:pl-10">
              <h4 className="font-bold text-[18px] lg:text-[20px] text-gray-800 mb-5 whitespace-nowrap">Kết nối với chúng tôi</h4>
              
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a href="#" className="w-[38px] h-[38px] rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[20px] hover:opacity-80 shadow-sm transition-transform hover:scale-105"><FaFacebook /></a>
                <a href="#" className="w-[38px] h-[38px] rounded-full bg-black text-white flex items-center justify-center text-[18px] hover:opacity-80 shadow-sm transition-transform hover:scale-105"><FaTiktok /></a>
                <a href="#" className="w-[38px] h-[38px] rounded-full bg-[#1ba8ff] text-white flex items-center justify-center text-[13px] font-bold hover:opacity-80 shadow-sm transition-transform hover:scale-105">Tiki</a>
                <a href="#" className="w-[38px] h-[38px] rounded-full bg-[#ff0000] text-white flex items-center justify-center text-[20px] hover:opacity-80 shadow-sm transition-transform hover:scale-105"><FaYoutube /></a>
                <a href="#" className="w-[38px] h-[38px] rounded-full overflow-hidden hover:opacity-80 shadow-sm transition-transform hover:scale-105">
                  <img src={logoShopee} alt="Shopee" className="w-full h-full object-cover scale-110" />
                </a>
              </div>

              <h4 className="text-[16px] text-gray-700 mb-4 font-semibold whitespace-nowrap">Phương thức thanh toán</h4>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <img src={payment1} alt="VNPay" className="h-[24px] object-contain" />
                <img src={payment2} alt="Visa" className="h-[20px] object-contain" />
                <img src={payment3} alt="MasterCard" className="h-[24px] object-contain" />
              </div>

              <img src={logoBct} alt="Đã thông báo Bộ Công Thương" className="h-12 object-contain" />
            </div>

          </div>

          {/* BOTTOM SECTION: Copyright */}
          <div className="border-t border-gray-200 pt-6 mt-4 pb-2">
            <div className="text-[14px] text-gray-500 text-center md:text-left">
              Bản quyền thuộc về ELMICH.
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;