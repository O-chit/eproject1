import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ArtisanDetailPopup from '../components/modals/ArtisanDetailPopup';
import VisitBookingModal from '../components/modals/VisitBookingModal';

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const data = await api.getArtisanById(id || 1);
        setArtisan(data);
      } catch (err) {
        console.warn('Lỗi nạp chi tiết nghệ nhân:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-canvas-linen">
        <span className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest animate-pulse">
          ĐANG NẠP HỒ SƠ DI SẢN NGHỆ NHÂN...
        </span>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-canvas-linen p-6">
        <h3 className="font-headline-title text-xl text-text-primary">Không tìm thấy hồ sơ nghệ nhân</h3>
        <Link to="/artisans" className="mt-4 px-6 py-2.5 bg-accent-terracotta text-white font-spec-code text-[11px] uppercase">
          Quay Lại Danh Sách
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-canvas-linen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="font-spec-code text-[11px] uppercase tracking-widest text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-text-primary">Trang Chủ</Link>
          <span>/</span>
          <Link to="/artisans" className="hover:text-text-primary">Nghệ Nhân</Link>
          <span>/</span>
          <span className="text-accent-terracotta">{artisan.name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-surface-crisp border border-border-neutral p-6 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-5/12 aspect-[4/5] relative bg-black overflow-hidden border border-border-neutral">
            <img
              src={artisan.avatar_url || artisan.image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
              alt={artisan.name}
              className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-white font-spec-code text-[10px] uppercase tracking-wider">
              REF: {artisan.code || `ART-${artisan.id}`}
            </div>
          </div>

          <div className="w-full md:w-7/12 space-y-5">
            <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
              HỒ SƠ BẬC THẦY DI SẢN
            </span>
            <h1 className="font-headline-title text-3xl sm:text-4xl text-text-primary font-bold">
              {artisan.name}
            </h1>
            <p className="font-spec-code text-[13px] text-text-secondary">
              {artisan.title || 'Nghệ Nhân Ưu Tú'} • {artisan.age || 68} Tuổi • {artisan.craft_category || 'Gốm Sứ'}
            </p>

            <blockquote className="border-l-2 border-accent-terracotta pl-4 py-2 bg-surface-subtle/50 font-label-signature italic text-[14px] text-text-primary">
              "{artisan.quote || 'Từng nhát búa, từng giọt men đều mang trong mình hơi thở và ký ức của tổ tiên.'}"
            </blockquote>

            <p className="font-body-default text-[13px] text-text-secondary leading-relaxed">
              {artisan.biography}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[12px] uppercase tracking-[0.18em] transition-colors cursor-pointer shadow-sm"
              >
                ĐẶT LỊCH THĂM XƯỞNG →
              </button>
              <button
                type="button"
                onClick={() => setIsPopupOpen(true)}
                className="px-6 py-3.5 border border-border-neutral hover:border-text-primary font-spec-code text-[12px] uppercase tracking-wider text-text-primary transition-colors cursor-pointer"
              >
                Mở Popup Tư Liệu
              </button>
            </div>
          </div>
        </div>
      </div>

      <ArtisanDetailPopup
        artisan={artisan}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onBookVisit={() => {
          setIsPopupOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <VisitBookingModal
        artisan={artisan}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
