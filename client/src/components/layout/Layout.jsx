import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  // Tự động cuộn lên đầu trang khi chuyển Route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Lắng nghe vị trí cuộn để hiện nút BackToTop
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#1C1B1A]">
      <Navbar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />

      {/* Nút Back to Top chuẩn Linework */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 border border-[#E6E2DA] hover:border-[#B86B35] bg-[#FFFFFF] shadow-md hover:shadow-lg flex items-center justify-center text-[#1C1B1A] hover:text-[#B86B35] transition-all transform hover:-translate-y-1 focus:outline-none"
          aria-label="Cuộn lên đầu trang"
          title="Lên đầu trang"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_upward
          </span>
        </button>
      )}
    </div>
  );
}
