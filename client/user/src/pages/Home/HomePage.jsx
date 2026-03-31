import React from 'react';
import { motion } from 'framer-motion'; 
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroBanner from './components/HeroBanner';
import BlogSection from './components/BlogSection';
import FeaturedCategories from './components/FeaturedCategories';
import FlashSale from './components/FlashSale';
import ProductGrid from './components/ProductGrid';
import PageWrapper from '../../components/layout/PageWrapper'; 

import sideBannerBinh from '../../images/banner2.jpg'; 

const HomePage = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#f5f5f5] font-sans">
        <Header />
        
        <main>
          <HeroBanner />
          
          <section className="py-4">
             <FeaturedCategories />
          </section>
          
          <FlashSale />
          
          <div className="w-full">
            {/* Component tự gọi API nên chỉ cần truyền mỗi Title */}
            <ProductGrid title="Sản phẩm bán chạy" />

            {/* ================= BANNER QUẢNG CÁO NGANG ================= */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-[1200px] mx-auto px-4 my-8"
            >
              <div className="w-full rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-2 border-white bg-white">
                <img 
                  src={sideBannerBinh} 
                  alt="Quảng cáo ngang" 
                  className="w-full h-auto block opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
            {/* ========================================================== */}

            <ProductGrid title="Sản phẩm mới ra mắt" />
          </div>

          <BlogSection />
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
};

export default HomePage;