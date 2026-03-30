import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroBanner from './components/HeroBanner';
import BlogSection from './components/BlogSection';
import FeaturedCategories from './components/FeaturedCategories';
import FlashSale from './components/FlashSale';
import ProductGrid from './components/ProductGrid';

// IMPORT ẢNH BANNER VÀ ẢNH SẢN PHẨM
import sideBannerBinh from '../../images/banner2.jpg'; 
import imgCocInox304 from "../../images/coc_giu_nhiet_inox_304_elmich_el8385_dung_tich_500ml.png";
import imgBinhInox316 from "../../images/binh_giu_nhiet_inox_316_elmich_el8306_dung_tich_500ml.png";
import imgBinhInoxGiaDinh from "../../images/binh_giu_nhiet_gia_dinh_inox_304_elmich_dung_tich_1.2l.png";
import imgBinhInox8376 from "../../images/binh_giu_nhiet_inox_304_elmich_el8376_dung_tich_720ml.png";

const HomePage = () => {
  const sampleProducts = [
    { id: 1, name: "Cốc giữ nhiệt inox 304 Elmich EL1049 dung tích 550ml", price: 369000, oldPrice: 619000, discount: 40, image: imgCocInox304 },
    { id: 2, name: "Bình giữ nhiệt inox 316 Elmich EL8306 dung tích...", price: 359000, oldPrice: 729000, discount: 51, image: imgBinhInox316 },
    { id: 3, name: "Bình giữ nhiệt gia đình inox 304 Elmich dung tích 1.2L", price: 715000, oldPrice: 1100000, discount: 35, image: imgBinhInoxGiaDinh },
    { id: 4, name: "Bình giữ nhiệt inox 304 Elmich EL8376 dung tích...", price: 289000, oldPrice: 509000, discount: 43, image: imgBinhInox8376 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <Header />
      <main>
        <HeroBanner />
        <FeaturedCategories />
        <FlashSale />
        
        <div className="w-full">
            {/* Khối Bình Giữ Nhiệt */}
            <ProductGrid 
                title="Bình giữ nhiệt" 
                products={sampleProducts} 
                bannerImg={sideBannerBinh}
            />

            {/* ================= BANNER QUẢNG CÁO NGANG ================= */}
<div className="max-w-[700px] mx-auto px-4 my-6">
  <div className="w-full py-2 rounded-lg flex items-center justify-center shadow-sm overflow-hidden bg-[#F05123]">
    <img 
      src={sideBannerBinh} 
      alt="Quảng cáo ngang" 
      className="w-full h-16 md:h-20 object-contain"
    />
  </div>
</div>
            {/* ========================================================== */}

            {/* Khối Sản phẩm mới */}
            <ProductGrid title="Sản phẩm mới" products={sampleProducts} bannerImg={null} />
        </div>

        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;