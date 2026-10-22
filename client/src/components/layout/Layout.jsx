import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from '../common/Breadcrumbs';

export default function Layout() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const isMapPage = location.pathname === '/regions';

  // Tự động cuộn lên đầu trang khi chuyển Route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Lắng nghe vị trí cuộn để hiện nút BackToTop khi scrollY > 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-canvas-linen text-text-primary font-body-default antialiased ${
        isMapPage ? 'h-screen overflow-hidden' : ''
      }`}
    >
      <Navbar />
      {!isMapPage && <Breadcrumbs />}

      <main
        className={`w-full ${
          isMapPage ? 'flex-1 h-[calc(100vh-80px)] overflow-hidden flex flex-col' : 'flex-1'
        }`}
      >
        <Outlet />
      </main>

      {!isMapPage && <Footer />}

      {/* Nút Back to Top chuẩn Linework */}
      {!isMapPage && showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 w-11 h-11 border border-border-neutral hover:border-accent-terracotta bg-surface-crisp shadow-md hover:shadow-lg flex items-center justify-center text-text-primary hover:text-accent-terracotta transition-all transform hover:-translate-y-1 focus:outline-none cursor-pointer"
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
