import React from 'react';
import ProductCard from './ProductCard';

// IMPORT ẢNH THẬT
import imgBinhInoxGiaDinh from "../../../images/binh_giu_nhiet.png";
import imgBinhInox316 from "../../../images/binh_giu_nhiet_inox_316_elmich_el8306_dung_tich_500ml.png";
import imgCocInox304 from "../../../images/coc_giu_nhiet_inox_304_elmich_el8385_dung_tich_500ml.png";
import imgNoiHarmony from "../../../images/noi_chong_dinh_ceramic_elmich.png";
import imgNoiPhuSu from "../../../images/noi_phu_su_chong_dinh_elmich_olive.png";
import imgNoiChaoXS from "../../../images/noi_chao_lau_da_nang_inox_lien_khoi_elmich.png"; 
import bannerBinhGiuNhiet from "../../../images/banner_binh_giu_nhiet.png";


const productsData = [
  { id: 1, name: 'Bình giữ nhiệt Elmich INOX 316 800ml', price: 349000, oldPrice: 779000, discount: 55, image: imgBinhInox316 },
  { id: 2, name: 'Cốc giữ nhiệt INOX 304 550ml', price: 369000, oldPrice: 619000, discount: 40, image: imgCocInox304 },
  { id: 3, name: 'Nồi chống dính ceramic Elmich Harmony 20cm', price: 675000, oldPrice: 1009000, discount: 33, image: imgNoiHarmony },
  { id: 4, name: 'Nồi phủ sứ chống dính Elmich Olive Classic EL-5532OV Siz...', price: 525000, oldPrice: 789000, discount: 33, image: imgNoiPhuSu },
  { id: 5, name: 'Bình giữ nhiệt Elmich gia đình 1.2L', price: 715000, oldPrice: 1100000, discount: 35, image: imgBinhInoxGiaDinh },
  { id: 6, name: 'Nồi chảo lẩu đa năng Inox Trimax XS EL...', price: 925000, oldPrice: 1390000, discount: 33, image: imgNoiChaoXS },
];

const ProductGrid = ({ title = "Danh sách", products = productsData }) => {
  return (
    <section className="py-12 bg-white">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-[26px] font-bold text-gray-800 uppercase tracking-tight">{title}</h2>
          <a href="#" className="text-[#e30019] hover:underline text-sm font-medium">Xem thêm</a>
        </div>
        
        {/* ================= ĐIỀU CHỈNH BỐ CỤC ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 xl:gap-8">
          
          {/* LẶP QUA MẢNG VÀ CHÈN BANNER VÀO VỊ TRÍ ĐẦU TIÊN (MÁY XAY MINI) */}
          {products.map((product, index) => {
            // Nếu là sản phẩm đầu tiên (id=1, index=0), chèn banner
            if (index === 0) {
              return (
                <div 
                  key="banner_left" 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group h-full flex flex-col"
                >
                  {/* Banner */}
                  <img 
                    src={bannerBinhGiuNhiet} 
                    alt="Banner Bình Giữ Nhiệt" 
                    // object-contain giúp ảnh không bị méo, h-full object-cover giúp ảnh tràn viền khớp cao
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  />
                </div>
              );
            }
            // Mặc định cho các sản phẩm khác
            return (
              <ProductCard key={product.id} product={product} />
            );
          })}
        </div>
        
        <div className="mt-14 text-center">
          <button className="border-2 border-[#e30019] text-[#e30019] px-8 py-2.5 rounded font-bold hover:bg-[#e30019] hover:text-white transition duration-300 transform hover:scale-105 active:scale-95 shadow-sm">
            Xem tất cả {title.toLowerCase()}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;