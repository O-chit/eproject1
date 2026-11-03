import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../../context/FavouritesContext';

/**
 * ArtisanDetailPopup - Deep Dive Master Artisan Dossier Modal
 * Follows Human-Crafted Sharp Linework & Canvas Linen Theme
 */
export default function ArtisanDetailPopup({
  artisan,
  isOpen,
  onClose,
  onBookVisit,
  onPrev,
  onNext,
  currentIndex = 0,
  totalArtisans = 6,
  prevIndexLabel = '#01',
  nextIndexLabel = '#03',
}) {
  const { isArtisanFavourited, toggleArtisanFavourite } = useFavourites();

  // 1. Manage Focus Trap, Escape, Arrow Keys, and Body Scroll Lock
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Sync URL hash
      const refCode = artisan?.ref || artisan?.code || `ART-0${artisan?.id || 1}`;
      window.history.replaceState(null, '', `#artisan/${refCode}`);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (isOpen && window.location.hash.startsWith('#artisan')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
  }, [isOpen, onClose, onPrev, onNext, artisan]);

  if (!isOpen || !artisan) return null;

  const refCode = artisan.ref || artisan.code || `ART-0${artisan.id || 1}`;
  const isFav = isArtisanFavourited ? isArtisanFavourited(artisan.id) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1B1A]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="artisan-popup-title"
      aria-describedby="artisan-popup-desc"
    >
      <div
        className="relative bg-surface-crisp border border-border-neutral w-full max-w-[1040px] max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in scale-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center bg-surface-crisp/90 hover:bg-text-primary text-text-primary hover:text-white border border-border-neutral transition-colors cursor-pointer"
          aria-label="Close artisan profile"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* LEFT COLUMN: Portrait Image */}
        <div className="w-full md:w-5/12 aspect-video md:aspect-auto min-h-0 md:min-h-full relative bg-[#1C1B1A] flex flex-col justify-between p-4 sm:p-6 overflow-hidden shrink-0">
          <img
            src={artisan.avatar_url || artisan.avatarUrl || artisan.image_url || artisan.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'}
            alt={artisan.name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none"></div>

          {/* Top Label Bar */}
          <div className="relative z-10 flex items-center justify-between pb-2 font-spec-code text-[10px] uppercase tracking-wider text-surface-crisp/90">
            <span className="bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/20 text-[#ffb689] font-semibold">
              {artisan.craft_category || artisan.specialty || 'Traditional Craft'}
            </span>
            <span className="bg-black/70 backdrop-blur-sm text-white/90 px-2 py-1 border border-white/20">
              REF: {refCode}
            </span>
          </div>

          {/* Bottom Label Bar */}
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 font-spec-code text-[10px] uppercase">
            <div className="flex items-center gap-1.5">
              <span className="bg-accent-terracotta text-surface-crisp px-2.5 py-1 font-medium shadow-sm">
                {artisan.years_of_experience || artisan.yearsOfExperience || 40} Yrs Craft
              </span>
              <span className="bg-black/70 backdrop-blur-sm text-surface-crisp border border-white/20 px-2 py-1 font-semibold">
                {artisan.generation || '5th Generation'}
              </span>
            </div>
            <span className="font-spec-code text-[11px] text-surface-crisp/90 bg-black/70 backdrop-blur-sm border border-white/20 px-2 py-0.5 tracking-widest uppercase font-semibold">
              #{String(currentIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Dossier Content */}
        <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto max-h-[85vh] space-y-6 bg-surface-crisp flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 pb-4 border-b border-border-neutral">
              <div className="font-spec-code text-[11px] uppercase tracking-[0.18em] text-text-secondary flex flex-wrap items-center gap-1.5">
                <span className="text-accent-terracotta font-semibold">Master Artisan</span>
                <span className="text-border-neutral select-none opacity-60">|</span>
                <span>{artisan.craft_category || artisan.specialty || 'Traditional Craft'}</span>
                <span className="text-border-neutral select-none opacity-60">|</span>
                <span>{artisan.village || artisan.regionName || 'Traditional Craft Village'}, {artisan.province || 'Vietnam'}</span>
              </div>
              <h2
                id="artisan-popup-title"
                className="font-headline-title text-[26px] sm:text-[30px] font-semibold text-text-primary leading-tight"
              >
                {artisan.name}
              </h2>
              <p id="artisan-popup-desc" className="font-spec-code text-[12px] sm:text-[13px] text-text-secondary">
                {artisan.title || 'Master Artisan'} • {artisan.age || 68} yrs old • <span className="text-accent-terracotta font-semibold">{artisan.years_of_experience || artisan.yearsOfExperience || 40} Yrs Craft</span> ({artisan.generation || '5th Generation'})
              </p>
            </div>

            {/* Philosophy Quote */}
            <blockquote className="border-l-2 border-accent-terracotta pl-4 py-2.5 bg-surface-subtle/50 font-label-signature italic text-[14px] text-text-primary leading-relaxed">
              "{artisan.quote || 'Earth possesses a soul, fire possesses a temperament. The craftsman is merely the bridge connecting the essence of heaven and earth with worldly form.'}"
            </blockquote>

            {/* Biography & Timeline */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ BIOGRAPHY &amp; CRAFT JOURNEY
              </h4>
              <p className="font-body-default text-[13px] text-text-secondary leading-relaxed">
                {artisan.biography ||
                  'Born into a multi-generational craft lineage in the Red River Delta. Dedicated for more than half a century to traditional wood-fired kilns, masterfully resurrecting lost ancient craft techniques.'}
              </p>
            </div>

            {/* Specs Table */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ SIGNATURE TECHNIQUES &amp; SPECIFICATIONS
              </h4>
              <div className="border border-border-neutral divide-y divide-border-neutral text-[12px]">
                <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Raw materials</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.material || 'Truc Thon kaolin clay, refined rice husk ash'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-spec-code text-text-secondary uppercase">Firing technique</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.firing_technique || 'Climbing kiln wood-fired at 1280°C continuously for 72 hours'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2.5 bg-surface-subtle/40">
                  <span className="font-spec-code text-text-secondary uppercase">Signature mark</span>
                  <span className="col-span-2 font-medium text-text-primary">
                    {artisan.signature_style || 'Three-color crackle glaze painted with indigo wash lines'}
                  </span>
                </div>
              </div>
            </div>

            {/* Representative Work */}
            <div>
              <h4 className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold mb-2">
                ■ REPRESENTATIVE MASTERPIECE
              </h4>
              <div className="p-3 bg-surface-subtle border border-border-neutral flex items-center justify-between">
                <div>
                  <span className="font-headline-title text-[14px] font-semibold text-text-primary block">
                    {artisan.masterwork_name || artisan.crafts?.[0]?.name || '18th-century antique crackle glaze lime pot'}
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary">
                    One-of-a-kind handcrafted artifact • CraftRoots Heritage Provenance Certificate
                  </span>
                </div>
                <span className="material-symbols-outlined text-accent-terracotta text-[22px]">verified</span>
              </div>
            </div>

            {/* Studio Visit Protocol */}
            <div className="p-4 bg-canvas-linen border border-border-neutral space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-terracotta text-[18px]">local_cafe</span>
                <span className="font-spec-code text-[10px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                  STUDIO VISIT &amp; MASTER MEETING PROTOCOL
                </span>
              </div>
              <p className="font-body-spec text-[12px] text-text-secondary leading-relaxed">
                Studio hosts a maximum of 6 visitors per session. Booking required 48 hours in advance for indigenous coordinator arrangements.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href="tel:0988246810"
                  className="flex-1 bg-text-primary hover:bg-accent-terracotta text-surface-crisp font-label-action text-[11px] uppercase tracking-[0.18em] py-2.5 px-4 text-center transition-colors"
                >
                  Hotline: (+84) 988.246.810
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onBookVisit) onBookVisit(artisan);
                  }}
                  className="flex-1 bg-surface-crisp border border-text-primary hover:bg-canvas-linen text-text-primary font-label-action text-[11px] uppercase tracking-[0.18em] py-2.5 px-4 text-center transition-colors cursor-pointer"
                >
                  Request Studio Visit
                </button>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 mt-6 border-t border-border-neutral flex flex-col sm:flex-row items-center justify-between gap-4 font-spec-code text-[11px]">
            <div className="flex items-center gap-2 text-text-secondary">
              <button
                type="button"
                onClick={onPrev}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1 cursor-pointer"
                title="Previous profile (Left arrow)"
              >
                ← {prevIndexLabel}
              </button>
              <span className="text-border-neutral opacity-50 select-none">|</span>
              <button
                type="button"
                onClick={onNext}
                className="hover:text-accent-terracotta transition-colors flex items-center gap-1 cursor-pointer"
                title="Next profile (Right arrow)"
              >
                {nextIndexLabel} →
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleArtisanFavourite && toggleArtisanFavourite(artisan)}
                className={`flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer ${
                  isFav ? 'text-accent-terracotta font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isFav ? 'bookmark_added' : 'bookmark'}
                </span>
                <span>{isFav ? 'Saved' : 'Save Profile'}</span>
              </button>
              <span className="text-border-neutral opacity-50 select-none">|</span>
              <Link
                to={`/artisans/${artisan.id}`}
                className="text-accent-terracotta hover:underline uppercase tracking-wider font-semibold"
              >
                View Full Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
