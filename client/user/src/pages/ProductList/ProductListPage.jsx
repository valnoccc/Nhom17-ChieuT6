import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom'; 
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SidebarFilter from './components/SidebarFilter';
import ProductCard from '../Home/components/ProductCard'; 

import imgDefault from "../../images/may_xay_sinh_to_mini_elmich_ble9244.png";
const PLACEHOLDER_IMG = imgDefault;

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
    <div className="w-full h-[180px] bg-gray-200 rounded-lg mb-5"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-6 bg-gray-200 rounded w-24"></div>
  </div>
);

const ProductListPage = () => {
  const location = useLocation();
  const initialCategory = location.state?.category;

  // === ĐỌC TỪ KHÓA TÌM KIẾM (SEARCH QUERY) TỪ THANH URL ===
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; 

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categories: initialCategory ? [initialCategory] : [], minPrice: 0, maxPrice: Infinity, rating: 0 });
  const [activeSort, setActiveSort] = useState('Phổ biến');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const itemsPerPage = 10; 

  const sortOptions = ["Phổ biến", "Giá thấp đến cao", "Giá cao đến thấp"];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:10000/api/products?limit=100");
        
        if (response.data && response.data.success) {
          const formattedData = response.data.data.map(item => {
            let catName = "Dụng cụ nhà bếp"; 
            const nameLower = (item.name || "").toLowerCase();
            
            if (nameLower.includes('tủ lạnh')) catName = 'Tủ lạnh';
            else if (nameLower.includes('giặt')) catName = 'Máy giặt';
            else if (nameLower.includes('quạt')) catName = 'Quạt';
            else if (nameLower.includes('lọc không khí')) catName = 'Máy lọc không khí';
            else if (nameLower.includes('xay') || nameLower.includes('ép')) catName = 'Máy xay sinh tố';
            else if (nameLower.includes('nồi') || nameLower.includes('bếp') || nameLower.includes('lò') || nameLower.includes('chảo') || nameLower.includes('bình')) catName = 'Dụng cụ nhà bếp';

            return {
              ...item,
              image: item.thumbnail_url?.startsWith('http') ? item.thumbnail_url : `http://localhost:10000/public/images/${item.thumbnail_url}`,
              category: catName,
              price: Number(item.price || 0), 
              oldPrice: item.old_price || item.oldPrice ? Number(item.old_price || item.oldPrice) : null,
              rating: item.rating || 5
            };
          });

          let duplicatedProducts = [];
          for (let i = 0; i < 5; i++) {
            duplicatedProducts = [...duplicatedProducts, ...formattedData.map(p => ({...p, id: `${p.id}_clone_${i}`}))];
          }

          duplicatedProducts.push(
            { id: 'test_1', name: 'Chảo chống dính mini 16cm (Mẫu Test)', price: 150000, oldPrice: 250000, category: 'Dụng cụ nhà bếp', image: PLACEHOLDER_IMG, rating: 5 },
            { id: 'test_2', name: 'Bình nước thể thao 500ml (Mẫu Test)', price: 99000, oldPrice: 150000, category: 'Dụng cụ nhà bếp', image: PLACEHOLDER_IMG, rating: 4 },
            { id: 'test_3', name: 'Quạt mini để bàn cầm tay (Mẫu Test)', price: 299000, oldPrice: null, category: 'Quạt', image: PLACEHOLDER_IMG, rating: 5 }
          );

          setProducts(duplicatedProducts);
        }
      } catch (error) { console.error("Lỗi API:", error); } 
      finally { setIsLoading(false); }
    };
    fetchAllProducts();
  }, []);

  // Tự động reset trang về 1 khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, filters, searchQuery]);

  // LOGIC LỌC TÍCH HỢP TỪ KHÓA TÌM KIẾM
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. LỌC THEO TỪ KHÓA TÌM KIẾM TRÊN HEADER
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery));
    }

    // 2. Lọc theo danh mục (bên Sidebar)
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }
    
    // 3. Lọc theo giá
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    if (activeSort === "Giá thấp đến cao") result.sort((a, b) => a.price - b.price);
    else if (activeSort === "Giá cao đến thấp") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, filters, activeSort, searchQuery]); 

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      <Header />
      <div className="bg-white py-3 border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12 text-[13px] text-gray-500">
          <Link to="/" className="hover:text-[#e30019]">🏠 Trang chủ</Link> 
          <span> / </span> 
          {searchQuery ? (
            <span className="text-gray-800 font-medium">Kết quả tìm kiếm cho: "{searchQuery}"</span>
          ) : (
            <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
          )}
        </div>
      </div>

      <main className="flex-grow max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12 py-8 w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <SidebarFilter onFilterChange={handleFilterChange} initialCategory={initialCategory} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center gap-4 justify-between mb-6">
            <span className="text-[14px] text-gray-600 font-medium">
              Tìm thấy <strong className="text-[#ed1c24]">{filteredProducts.length}</strong> sản phẩm
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] text-gray-600 mr-2">Sắp xếp theo:</span>
              {sortOptions.map((option) => (
                <button key={option} onClick={() => {setActiveSort(option); setCurrentPage(1);}} className={`px-3 py-1.5 text-[13px] rounded transition-colors ${activeSort === option ? 'bg-[#ed1c24] text-white font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5 mb-10">
            {isLoading ? [...Array(10)].map((_, i) => <ProductSkeleton key={i} />) : 
             currentItems.length === 0 ? (
               <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-lg">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchQuery}".</div>
             ) : currentItems.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="mt-auto flex justify-center items-center gap-2 py-4 border-t border-gray-100">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">&lt;</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded transition-all duration-200 ${currentPage === i + 1 ? 'bg-[#ed1c24] text-white font-bold shadow-md border-none scale-110' : 'border border-gray-300 bg-white text-gray-700 hover:border-[#ed1c24] hover:text-[#ed1c24]'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">&gt;</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ProductListPage;