import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SidebarFilter from './components/SidebarFilter';
import ProductCard from '../Home/components/ProductCard'; 

// ================= IMPORT HÌNH ẢNH THẬT =================
import imgBinh316 from "../../images/binh_giu_nhiet_inox_316_elmich_el8306_dung_tich_500ml.png";
import imgBinh304 from "../../images/binh_giu_nhiet_inox_304_elmich_el8376_dung_tich_720ml.png";
import imgCoc304 from "../../images/coc_giu_nhiet_inox_304_elmich_el8385_dung_tich_500ml.png";
import imgNoiCeramic from "../../images/noi_chong_dinh_ceramic_elmich.png";
import imgNoiOlive from "../../images/noi_phu_su_chong_dinh_elmich_olive.png";
import imgNoiLau from "../../images/noi_chao_lau_da_nang_inox_lien_khoi_elmich.png";
import imgBoNoi from "../../images/bo_noi.png";
import imgMayXayMini from "../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
import imgMayXayCamTay from "../../images/may_xay_sinh_to_cam_tay_elmich_ble_9213.png";
import imgMayXay8763 from "../../images/may_xay_sinh_to_elmich_ble_8763.png";
import imgMayEp from "../../images/may_ep.png";
import imgDungCu from "../../images/dung_cu_nha_bep.png";
import imgChaoCeramic from "../../images/noi_chao_ceramic.png";

// ================= COMPONENT SKELETON (GIẢ LẬP ĐANG LOAD) =================
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
    {/* Khung ảnh xám */}
    <div className="w-full h-[180px] lg:h-[200px] bg-gray-200 rounded-lg mb-5"></div>
    {/* Dòng tiêu đề 1 */}
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    {/* Dòng tiêu đề 2 */}
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-5"></div>
    {/* Khung giá & nút bấm */}
    <div className="flex justify-between items-end pt-3 border-t border-gray-50">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

const MOCK_PRODUCTS = [
  { id: 21, name: "Bình giữ nhiệt Inox 316 Elmich 500ml", price: 359000, oldPrice: 729000, discount: 51, category: "Bình giữ nhiệt", rating: 5, image: imgBinh316 },
  { id: 22, name: "Nồi chống dính ceramic Elmich EL5540PT", price: 675000, oldPrice: 1009000, discount: 33, category: "Nồi chảo Ceramic", rating: 4, image: imgNoiCeramic },
  { id: 23, name: "Cốc giữ nhiệt inox 304 Elmich EL1049", price: 369000, oldPrice: 619000, discount: 40, category: "Bình giữ nhiệt", rating: 5, image: imgCoc304 },
  { id: 24, name: "Máy xay sinh tố mini Elmich BLE9244", price: 699000, oldPrice: 1549000, discount: 55, category: "Máy xay sinh tố", rating: 5, image: imgMayXayMini },
  { id: 25, name: "Nồi chảo lẩu đa năng Inox liền khối Elmich", price: 925000, oldPrice: 1390000, discount: 33, category: "Bộ nồi Inox", rating: 4, image: imgNoiLau },
  { id: 26, name: "Bộ nồi Inox cao cấp Elmich Trimax", price: 2150000, oldPrice: 3500000, discount: 38, category: "Bộ nồi Inox", rating: 5, image: imgBoNoi },
  { id: 27, name: "Máy ép chậm Elmich nguyên quả", price: 1890000, oldPrice: 2500000, discount: 24, category: "Máy ép trái cây", rating: 4, image: imgMayEp },
  { id: 28, name: "Chảo chống dính đáy từ Elmich 26cm", price: 250000, oldPrice: 450000, discount: 44, category: "Nồi chảo Ceramic", rating: 3, image: imgChaoCeramic },
  { id: 29, name: "Bình giữ nhiệt Elmich EL8376 720ml", price: 450000, oldPrice: 800000, discount: 43, category: "Bình giữ nhiệt", rating: 5, image: imgBinh304 },
  { id: 30, name: "Nồi phủ sứ chống dính Elmich Olive", price: 1650000, oldPrice: 2800000, discount: 41, category: "Nồi chảo Ceramic", rating: 5, image: imgNoiOlive },
  { id: 31, name: "Máy xay sinh tố Elmich BLE-8763", price: 850000, oldPrice: 1200000, discount: 29, category: "Máy xay sinh tố", rating: 4, image: imgMayXay8763 },
  { id: 32, name: "Bộ dụng cụ nhà bếp Elmich Inox", price: 120000, oldPrice: 200000, discount: 40, category: "Dụng cụ nhà bếp", rating: 4, image: imgDungCu },
  { id: 33, name: "Máy xay sinh tố cầm tay BLE-9213", price: 550000, oldPrice: 900000, discount: 38, category: "Máy xay sinh tố", rating: 5, image: imgMayXayCamTay },
  { id: 34, name: "Nồi Ceramic Elmich size 20cm", price: 525000, oldPrice: 789000, discount: 33, category: "Nồi chảo Ceramic", rating: 4, image: imgChaoCeramic },
  { id: 35, name: "Bộ 3 nồi inox 304 Elmich Trimax", price: 1350000, oldPrice: 2100000, discount: 35, category: "Bộ nồi Inox", rating: 5, image: imgBoNoi },
];

const ProductListPage = () => {
  const [activeSort, setActiveSort] = useState('Phổ biến');
  const [filters, setFilters] = useState({ categories: [], minPrice: 0, maxPrice: Infinity, rating: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // <--- QUẢN LÝ TRẠNG THÁI LOADING
  const itemsPerPage = 10; 

  const sortOptions = ["Phổ biến", "Giá thấp đến cao", "Giá cao đến thấp"];

  // Giả lập hiệu ứng Loading mỗi khi chuyển trang hoặc thay đổi bộ lọc
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700); // Đợi 0.7 giây để hiện Skeleton
    return () => clearTimeout(timer);
  }, [filters, activeSort, currentPage]);

  // ================= XỬ LÝ LỌC & SẮP XẾP =================
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    if (filters.minPrice !== undefined) {
        result = result.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== Infinity) {
        result = result.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.rating && filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    if (activeSort === "Giá thấp đến cao") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "Giá cao đến thấp") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters, activeSort]);

  // ================= XỬ LÝ PHÂN TRANG =================
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  };

  const handleSortChange = (option) => {
    setActiveSort(option);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <Header />
      
      <div className="bg-white py-3 border-b border-gray-200">
        <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12 text-[13px] text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-[#e30019] transition-colors">
            <span className="text-red-500 mr-1">🏠</span> Trang chủ
          </Link>
          <span>/</span> <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
        </div>
      </div>

      <main className="flex-grow max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12 py-8 w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <SidebarFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1 flex flex-col">
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center gap-4 justify-between mb-6">
            <span className="text-[14px] text-gray-600 font-medium">
              Tìm thấy <strong className="text-[#ed1c24]">{filteredAndSortedProducts.length}</strong> sản phẩm
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] text-gray-600 mr-2">Sắp xếp theo:</span>
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className={`px-3 py-1.5 text-[13px] rounded transition-colors ${
                    activeSort === option 
                      ? 'bg-[#ed1c24] text-white font-medium shadow-sm' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* ================= LƯỚI SẢN PHẨM HOẶC SKELETON ================= */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5 mb-10">
            {isLoading ? (
              // Hiện 10 ô Skeleton khi đang load
              [...Array(10)].map((_, i) => <ProductSkeleton key={i} />)
            ) : currentProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-100">
                <p className="text-gray-500 mb-2 font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button 
                  onClick={() => setFilters({ categories: [], minPrice: 0, maxPrice: Infinity, rating: 0 })} 
                  className="text-[#ed1c24] hover:underline font-bold"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* PHÂN TRANG (PAGINATION) - Ẩn khi đang load để tránh bấm nhầm */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-auto flex justify-center items-center gap-2 py-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                &lt;
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${
                    currentPage === i + 1 
                      ? 'bg-[#ed1c24] text-white font-bold shadow-md border-none scale-110' 
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-[#ed1c24] hover:text-[#ed1c24]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                &gt;
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductListPage;