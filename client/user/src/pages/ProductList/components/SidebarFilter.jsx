import React, { useState, useEffect } from 'react';
import { FaStar, FaFilter } from 'react-icons/fa';

const SidebarFilter = ({ onFilterChange = () => {} }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedRating, setSelectedRating] = useState(0);

  const categories = ["Bình giữ nhiệt", "Nồi chảo Ceramic", "Máy xay sinh tố", "Bộ nồi Inox", "Máy ép trái cây", "Dụng cụ nhà bếp"];

  // Mỗi khi có bất kỳ thay đổi nào, đẩy dữ liệu lên Cha ngay lập tức
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      rating: selectedRating
    });
  }, [selectedCategories, priceRange, selectedRating]); // Rất quan trọng: useEffect lắng nghe 3 biến này

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: Infinity });
    setSelectedRating(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 text-[#ed1c24]">
        <FaFilter /> <h2 className="text-[16px] font-bold text-gray-800 uppercase">Bộ lọc</h2>
      </div>

      {/* DANH MỤC */}
      <div className="mb-6">
        <h3 className="text-[15px] font-bold mb-4">Danh mục</h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="w-4 h-4 accent-[#ed1c24]" />
              <span className="text-[14px] text-gray-600 group-hover:text-[#ed1c24]">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* KHOẢNG GIÁ */}
      <div className="mb-6 border-t pt-5">
        <h3 className="text-[15px] font-bold mb-4">Khoảng giá</h3>
        <div className="space-y-3">
          {[
            { label: 'Tất cả', min: 0, max: Infinity },
            { label: 'Dưới 500.000đ', min: 0, max: 500000 },
            { label: '500k - 1 triệu', min: 500000, max: 1000000 },
            { label: 'Trên 1 triệu', min: 1000000, max: Infinity },
          ].map((range, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="price" checked={priceRange.max === range.max && priceRange.min === range.min} onChange={() => setPriceRange({min: range.min, max: range.max})} className="accent-[#ed1c24]" />
              <span className="text-[14px] text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ĐÁNH GIÁ */}
      <div className="mb-6 border-t pt-5">
        <h3 className="text-[15px] font-bold mb-4">Đánh giá</h3>
        {[5, 4, 3].map(star => (
          <div key={star} onClick={() => setSelectedRating(star)} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="radio" checked={selectedRating === star} readOnly className="accent-[#ed1c24]" />
            <div className="flex text-yellow-400 text-[12px]">
              {[...Array(5)].map((_, i) => <FaStar key={i} className={i < star ? "text-yellow-400" : "text-gray-200"} />)}
            </div>
            <span className="text-[13px] text-gray-500">{star === 5 ? "" : "trở lên"}</span>
          </div>
        ))}
      </div>

      <button onClick={clearFilters} className="w-full py-2 bg-gray-100 text-gray-600 rounded font-bold text-[13px] hover:bg-gray-200">XÓA TẤT CẢ</button>
    </div>
  );
};

export default SidebarFilter;