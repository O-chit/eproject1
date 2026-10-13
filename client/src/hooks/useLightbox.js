import { useState, useEffect, useCallback } from 'react';

/**
 * useLightbox: Quản lý trạng thái mở modal xem ảnh toàn màn hình và điều hướng bàn phím
 * @param {Array} images - Danh sách ảnh
 */
export function useLightbox(images = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Lắng nghe sự kiện bàn phím ESC, Mũi tên trái/phải
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  return {
    isOpen,
    currentIndex,
    currentImage: images[currentIndex] || null,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
  };
}

export default useLightbox;
