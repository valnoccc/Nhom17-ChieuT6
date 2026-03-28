import React from "react";

// IMPORT ẢNH 
import imgToiChao from "../../../images/toi-chao-lan-dau.png";

const sidePosts = [
  {
    id: 1,
    title: "Chảo Chống Dính Bị Tróc Lớp Chống Dính Có An Toàn...",
    date: "29/12/2025",
    desc: "Nấu nướng là một nghệ thuật, và chiếc chảo chống dính là “cây cọ” đắc lực nhất của mọi đầu bếp gia đình. Tuy nhiên, sau m...",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&auto=format&fit=crop", 
  },
  {
    id: 2,
    title: "Có Nên Rửa Nồi Chảo Chống Dính Bằng Máy Rửa Bát...",
    date: "29/12/2025",
    desc: "Bài viết này sẽ đi sâu vào phân tích sự thật đằng sau việc rửa nồi chống dính bằng máy rửa bát, cung cấp hướng dẫn các...",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Phủ Ceramic Là Gì? Giải Mã Công Nghệ Chống Dính...",
    date: "29/12/2025",
    desc: "Trong hành trình tìm kiếm giải pháp nấu nướng an toàn và lành mạnh, người tiêu dùng hiện đại ngày càng khắt khe hơn với v...",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Những sai lầm phổ biến khi dùng chảo chống dính và...",
    date: "29/12/2025",
    desc: "Chảo chống dính là vật dụng không thể thiếu trong mọi căn bếp hiện đại, giúp việc nấu nướng trở nên nhanh chóng và d...",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=300&auto=format&fit=crop",
  }
];

const BlogSection = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="w-full px-4 md:px-10 lg:px-16 xl:px-24">
        
        {/* TIÊU ĐỀ */}
        <h2 className="text-[22px] lg:text-[26px] font-bold text-gray-800 uppercase mb-8 tracking-wide">
          KINH NGHIỆM HAY
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          
          {/* CỘT TRÁI - Bài viết chính */}
          <div className="flex flex-col cursor-pointer group">
            <div className="relative overflow-hidden rounded-md mb-5 aspect-[16/10] bg-gray-100 shadow-sm">
              <img 
                src={imgToiChao} // ĐÃ ĐỔI SANG BIẾN IMPORT
                alt="Main post" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badge Ngày Tháng */}
              <div className="absolute top-0 left-0 bg-[#ed1c24] text-white flex flex-col items-center justify-center w-20 h-20 rounded-br-[3rem] shadow-md z-10">
                <span className="text-[22px] font-bold leading-none mt-[-4px]">29</span>
                <span className="text-[12px] leading-none mt-1">12/2025</span>
              </div>
            </div>
            
            <h3 className="text-[20px] xl:text-[24px] font-bold text-gray-800 mb-3 group-hover:text-[#ed1c24] transition-colors leading-snug">
              Cách tôi chảo chống dính Ceramic lần đầu sử dụng
            </h3>
            <p className="text-[15px] xl:text-[16px] text-gray-500 line-clamp-2 leading-relaxed">
              Bài viết này, Elmich sẽ cung cấp một hướng dẫn cách tôi chảo chống dính ceramic chi tiết, giúp bạn thực hiện đúng kỹ thuật ngay từ lần đầu tiên, đảm bảo chiếc chảo yêu qu...
            </p>
          </div>

          {/* CỘT PHẢI - Danh sách bài viết phụ */}
          <div className="flex flex-col gap-6 xl:gap-8 justify-start">
            {sidePosts.map((post) => (
              <div key={post.id} className="flex gap-5 xl:gap-6 cursor-pointer group">
                <div className="w-[160px] h-[100px] xl:w-[200px] xl:h-[120px] flex-shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[16px] xl:text-[18px] font-bold text-gray-800 mb-2 group-hover:text-[#ed1c24] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h4>
                  <span className="text-[13px] xl:text-[14px] text-gray-400 mb-1.5">{post.date}</span>
                  <p className="text-[14px] xl:text-[15px] text-gray-500 line-clamp-2 leading-snug">
                    {post.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogSection;