import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserEdit, FaEye, FaFacebook, FaTwitter, FaLink, FaSearch, FaAngleRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PageWrapper from '../../components/layout/PageWrapper';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// MOCK DATA: BÀI VIẾT CHÍNH
const ARTICLE = {
  id: 1,
  title: "Bí quyết chọn mua nồi chảo Inox an toàn, chất lượng cho gia đình",
  date: "15/03/2026",
  author: "Elmich Vietnam",
  views: "1,245",
  category: "Mẹo vặt nhà bếp",
  // Dùng tạm ảnh URL ngoài cho bài viết, bạn có thể thay bằng ảnh import của bạn
  coverImage: "https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&q=80&w=1200", 
  content: `
    <p>Nồi chảo inox từ lâu đã trở thành vật dụng không thể thiếu trong gian bếp của mọi gia đình Việt nhờ độ bền bỉ, sáng bóng và đặc biệt là an toàn cho sức khỏe. Tuy nhiên, giữa "ma trận" các loại nồi chảo inox trên thị trường, làm sao để chọn được sản phẩm thật sự chất lượng?</p>
    
    <h3>1. Chất liệu Inox quyết định độ an toàn</h3>
    <p>Inox được chia thành nhiều loại, nhưng phổ biến nhất trong sản xuất đồ gia dụng là Inox 304, Inox 430 và Inox 201. Trong đó, <strong>Inox 304</strong> (chứa 18% Crom và 10% Niken) là loại tốt nhất, hoàn toàn không gỉ sét, không giải phóng các chất độc hại khi đun nấu ở nhiệt độ cao.</p>
    <p>Các dòng sản phẩm cao cấp của Elmich đều sử dụng Inox 304 (thậm chí là Inox 316 dùng trong y tế) cho lớp trong cùng tiếp xúc trực tiếp với thực phẩm, đảm bảo an toàn tuyệt đối cho người sử dụng.</p>

    <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=1000" alt="Nồi chảo inox" />
    <br/>

    <h3>2. Cấu tạo đáy nồi (3 đáy, 5 đáy)</h3>
    <p>Nhược điểm lớn nhất của inox là dẫn nhiệt kém. Vì vậy, các nhà sản xuất thường ghép thêm lớp nhôm hoặc đồng ở giữa để khắc phục tình trạng này. Nồi inox 3 đáy (Inox - Nhôm - Inox) hoặc 5 đáy sẽ giúp truyền nhiệt nhanh, tỏa nhiệt đều, hạn chế tình trạng cháy khét cục bộ.</p>

    <h3>3. Khả năng bắt từ tốt</h3>
    <p>Nếu gia đình bạn sử dụng bếp từ, hãy chắc chắn rằng chiếc nồi bạn chọn có lớp đáy ngoài cùng làm từ Inox 430 (loại inox có từ tính). Thường thì các sản phẩm nồi chảo cao cấp hiện nay đều tích hợp khả năng này.</p>

    <blockquote>
      "Đầu tư vào một bộ nồi chảo inox chất lượng không chỉ là đầu tư cho bữa ăn ngon, mà còn là sự bảo vệ lâu dài cho sức khỏe của cả gia đình." - Chuyên gia Elmich.
    </blockquote>

    <p>Hy vọng với những mẹo nhỏ trên, bạn đã có thêm kiến thức để lựa chọn cho mình những sản phẩm nồi chảo ưng ý nhất. Đừng quên ghé qua các cửa hàng Elmich để trải nghiệm những bộ nồi chuẩn Châu Âu nhé!</p>
  `,
  tags: ["Nồi Inox", "Kinh nghiệm hay", "Đồ gia dụng", "Sức khỏe"]
};

// MOCK DATA: BÀI VIẾT NỔI BẬT Ở SIDEBAR
const RELATED_POSTS = [
  { id: 2, title: "Top 5 máy xay sinh tố mini đáng mua nhất 2026", date: "10/03/2026", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=300" },
  { id: 3, title: "Cách vệ sinh bình giữ nhiệt hết mùi hôi chỉ trong 5 phút", date: "05/03/2026", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=300" },
  { id: 4, title: "Làm thế nào để chảo chống dính dùng 3 năm vẫn như mới?", date: "28/02/2026", image: "https://images.unsplash.com/photo-1584269600519-112d071b4d00?auto=format&fit=crop&q=80&w=300" },
];

const CATEGORIES = ["Mẹo vặt nhà bếp", "Công thức nấu ăn", "Tin tức Elmich", "Khuyến mãi", "Review sản phẩm"];

const PostDetailPage = () => {
  
  // Tự động cuộn lên đầu khi trang load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = (platform) => {
    if (platform === 'link') {
      navigator.clipboard.writeText(window.location.href);
      toast.success("📋 Đã sao chép đường dẫn bài viết!");
    } else {
      toast.info(`🔗 Đang mở chia sẻ qua ${platform}...`);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
        <Header />

        {/* BREADCRUMB */}
        <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-[13px] text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-[#e30019] transition-colors"><span className="text-red-500 mr-1">🏠</span> Trang chủ</Link>
            <span>/</span>
            <Link to="/blogs" className="hover:text-[#e30019] transition-colors">Tin tức</Link>
            <span>/</span>
            <span className="text-gray-800 font-bold truncate max-w-[200px] md:max-w-md">{ARTICLE.category}</span>
          </div>
        </div>

        <main className="flex-grow max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-10 w-full flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ================= CỘT TRÁI: NỘI DUNG BÀI VIẾT (75%) ================= */}
          <div className="flex-[7.5] bg-white rounded-xl shadow-sm p-6 lg:p-10">
            
            {/* Header Bài viết */}
            <div className="mb-6 border-b border-gray-100 pb-6">
              <span className="bg-red-50 text-[#e30019] px-3 py-1 text-[13px] font-bold rounded-sm uppercase mb-4 inline-block tracking-wide">
                {ARTICLE.category}
              </span>
              <h1 className="text-[28px] lg:text-[38px] font-bold text-gray-900 leading-tight mb-4">
                {ARTICLE.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-[14px] text-gray-500 font-medium">
                <span className="flex items-center gap-2"><FaCalendarAlt className="text-[#e30019]"/> {ARTICLE.date}</span>
                <span className="flex items-center gap-2"><FaUserEdit className="text-[#e30019]"/> {ARTICLE.author}</span>
                <span className="flex items-center gap-2"><FaEye className="text-[#e30019]"/> {ARTICLE.views} lượt xem</span>
              </div>
            </div>

            {/* Ảnh Bìa */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-sm">
              <img src={ARTICLE.coverImage} alt={ARTICLE.title} className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Nội dung bài viết (Render HTML) */}
            {/* Sử dụng CSS nội tuyến cơ bản để format các thẻ HTML sinh ra từ trình soạn thảo */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed 
                         prose-h3:text-[22px] prose-h3:font-bold prose-h3:text-gray-900 prose-h3:mt-8 prose-h3:mb-4
                         prose-p:mb-4 prose-p:text-[16px]
                         prose-img:rounded-xl prose-img:shadow-md prose-img:w-full prose-img:my-6
                         prose-strong:text-gray-900
                         prose-blockquote:border-l-4 prose-blockquote:border-[#e30019] prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6"
              dangerouslySetInnerHTML={{ __html: ARTICLE.content }}
            />

            {/* Tags & Chia sẻ */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Tags */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-[15px] text-gray-800">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {ARTICLE.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 text-[13px] rounded-md cursor-pointer hover:bg-[#e30019] hover:text-white transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chia sẻ */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-[15px] text-gray-800">Chia sẻ:</span>
                <div className="flex gap-2">
                  <button onClick={() => handleShare('Facebook')} className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"><FaFacebook size={18}/></button>
                  <button onClick={() => handleShare('Twitter')} className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"><FaTwitter size={18}/></button>
                  <button onClick={() => handleShare('link')} className="w-9 h-9 rounded-full bg-gray-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"><FaLink size={16}/></button>
                </div>
              </div>

            </div>
          </div>

          {/* ================= CỘT PHẢI: SIDEBAR (25%) ================= */}
          <div className="flex-[2.5] space-y-8">
            
            {/* Thanh Tìm Kiếm */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-[18px] font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Tìm kiếm</h3>
              <form onSubmit={(e) => { e.preventDefault(); toast.info("Đang tìm kiếm bài viết..."); }} className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-[#e30019] transition-colors">
                <input type="text" placeholder="Tìm kiếm bài viết..." className="flex-1 px-4 py-2.5 text-[14px] outline-none" />
                <button type="submit" className="bg-[#e30019] text-white px-4 hover:bg-red-800 transition-colors"><FaSearch/></button>
              </form>
            </div>

            {/* Danh mục */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-[18px] font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Danh mục</h3>
              <ul className="space-y-3">
                {CATEGORIES.map((cat, idx) => (
                  <li key={idx}>
                    <Link to="#" className="flex items-center gap-2 text-[15px] text-gray-600 hover:text-[#e30019] transition-colors group">
                      <FaAngleRight className="text-gray-400 group-hover:text-[#e30019]" /> {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bài viết mới nhất (Sticky Sidebar) */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-[18px] font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Bài viết nổi bật</h3>
              <div className="space-y-5">
                {RELATED_POSTS.map(post => (
                  <Link to={`/blog/${post.id}`} key={post.id} className="flex gap-4 items-start group">
                    <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#e30019] transition-colors mb-1.5">{post.title}</h4>
                      <span className="text-[12px] text-gray-500 flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400"/> {post.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default PostDetailPage;