import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// 1. IMPORT ẢNH VÀO ĐÂY
import bannerImg1 from '../../../images/banner1.jpg';
import bannerImg2 from "../../../images/banner2.jpg"; 
// ========================================================

const HeroBanner = () => {
  return (
    // Bỏ mt-6 để banner dính sát vào thanh menu đỏ phía trên cho liền mạch
    <div className="w-full bg-white mb-8">
      
      {/* Đã xóa max-w-[1200px], px-4 và rounded-2xl để ảnh bung tràn 100% màn hình */}
      <div className="w-full overflow-hidden">
        <Swiper 
          slidesPerView={1} 
          loop={true} 
          // Cập nhật lại chiều cao cho các màn hình để ảnh hiển thị to, đầy đặn hơn
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px]"
        >
          
          {/* SLIDE 1 */}
          <SwiperSlide>
            <img 
              src={bannerImg1} 
              alt="Banner Khuyến Mãi 1" 
              // object-cover và object-center giúp ảnh full khung, tâm ảnh luôn ở giữa
              className="w-full h-full object-cover object-center"
            />
          </SwiperSlide>

          {/* SLIDE 2 - ĐÃ CHỈNH SỬA ĐỂ HIỂN THỊ ẢNH MỚI VÀO */}
          <SwiperSlide>
            <img 
              // Sử dụng biến nhập mới trỏ đến ảnh mới có tên banner 2
              src={bannerImg2} 
              alt="Banner Khuyến Mãi 2" 
              // Sử dụng cùng class để ảnh tràn khung và căn giữa giống Slide 1
              className="w-full h-full object-cover object-center"
            />
          </SwiperSlide>

        </Swiper>
      </div>

    </div>
  );
};

export default HeroBanner;