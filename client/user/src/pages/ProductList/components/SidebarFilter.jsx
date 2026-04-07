import React, { useState, useEffect } from 'react';
import { FaStar, FaFilter } from 'react-icons/fa';

// Thêm categoriesList vào phần nhận props
const SidebarFilter = ({ onFilterChange = () => { }, initialCategory = null, categoriesList = [] }) => {
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedRating, setSelectedRating] = useState(0);


  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      rating: selectedRating
    });
  }, [selectedCategories, priceRange, selectedRating]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 text-[#ed1c24]">
        <FaFilter /> <h2 className="text-[16px] font-bold text-gray-800 uppercase">Bộ lọc</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-[15px] font-bold mb-4">Danh mục</h3>
        <div className="space-y-3">
          {categoriesList.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)} // So sánh với cat.name
                onChange={() => handleCategoryChange(cat.name)}
                className="w-4 h-4 accent-[#ed1c24]"
              />
              <span className="text-[14px] text-gray-600 group-hover:text-[#ed1c24]">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 border-t pt-5">
        <h3 className="text-[15px] font-bold mb-4">Khoảng giá</h3>
        <div className="space-y-3">
          {[{ label: 'Tất cả', min: 0, max: Infinity }, { label: 'Dưới 500.000đ', min: 0, max: 500000 }, { label: '500k - 1 triệu', min: 500000, max: 1000000 }, { label: 'Trên 1 triệu', min: 1000000, max: Infinity }].map((range, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="price" checked={priceRange.max === range.max && priceRange.min === range.min} onChange={() => setPriceRange({ min: range.min, max: range.max })} className="accent-[#ed1c24]" />
              <span className="text-[14px] text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={() => { setSelectedCategories([]); setPriceRange({ min: 0, max: Infinity }); }} className="w-full py-2 bg-gray-100 text-gray-600 rounded font-bold text-[13px] hover:bg-gray-200 transition-colors">XÓA TẤT CẢ</button>
    </div>
  );
};
export default SidebarFilter;