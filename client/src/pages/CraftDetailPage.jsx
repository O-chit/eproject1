import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useFavourites } from '../context/FavouritesContext';
import { useAgentLiveSync } from '../services/liveAgentSync';

export default function CraftDetailPage() {
  const { id } = useParams();
  const craftId = id || 1;
  const navigate = useNavigate();
  const { isFav, toggleFav } = useFavourites();
  const [craft, setCraft] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [agentUpdated, setAgentUpdated] = useState(false);
  const isSaved = isFav(craftId);

  useEffect(() => {
    let isMounted = true;
    async function loadCraftDetail() {
      try {
        setLoading(true);
        const detail = await api.getCraftById(craftId);
        if (isMounted && detail) {
          setCraft(detail);
        }
        const related = await api.getRelatedCrafts(craftId).catch(() => []);
        if (isMounted && Array.isArray(related)) {
          setRelatedList(related);
        }
      } catch (err) {
        console.warn('Error loading craft detail from DB:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCraftDetail();
    setActivePhotoIndex(0);
    return () => { isMounted = false; };
  }, [craftId]);

  // Live Agent Sync
  useAgentLiveSync(({ tool, data }) => {
    if (tool === 'update_craft') {
      const isTarget = String(data?.id) === String(craftId) || String(data?.slug) === String(craftId) || (craft && craft.name === data?.name);
      if (isTarget) {
        setCraft((prev) => ({
          ...prev,
          ...data,
          priceVnd: data.priceVnd !== undefined ? data.priceVnd : prev?.priceVnd,
          shortDescription: data.shortDescription || prev?.shortDescription,
          name: data.name || prev?.name,
        }));
        setAgentUpdated(true);
        setTimeout(() => setAgentUpdated(false), 5000);
      }
    } else if (tool === 'delete_craft') {
      const isTarget = String(data?.id) === String(craftId) || (craft && craft.name === data?.name);
      if (isTarget) {
        alert(`Craft "${data?.name || craft?.name}" was deleted from DB by AI Agent.`);
        navigate('/crafts');
      }
    } else if (tool === 'add_favourite') {
      const isTarget = String(data?.id) === String(craftId) || (craft && craft.name === data?.name);
      if (isTarget && !isSaved) {
        toggleSave();
      }
    }
  }, [craftId, craft, isSaved, navigate]);

  const toggleSave = () => {
    toggleFav(craftId);
  };

  const photos = (craft?.images && craft.images.length > 0)
    ? craft.images.map((img) => ({
        url: img.url,
        title: img.caption || craft?.name,
        alt: img.altText || craft?.name,
      }))
    : [
        {
          url: craft?.thumbnailUrl || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
          title: craft?.name || 'Handcrafted artifact',
          alt: craft?.name || 'Detail photo',
        },
      ];

  const currentPhoto = photos[activePhotoIndex] || photos[0];
  const leadArtisan = craft?.artisans?.[0] || {
    name: 'Village Master Artisan',
    title: 'Master Artisan',
    roleTitle: 'Lead Craftsman',
  };
  const materialsText = craft?.materials?.map((m) => m.name).join(', ') || 'Pure natural Vietnamese materials';
  const techniquesText = craft?.techniques?.map((t) => t.name).join(', ') || 'Generational ancestral craftsmanship';

  return (
    <div className="flex flex-col w-full bg-canvas-linen">
      {/* Top Breadcrumbs */}
      <section className="w-full bg-canvas-linen py-space-sm border-b border-border-neutral">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-wrap items-center font-spec-code text-spec-code tracking-[0.16em] uppercase text-text-secondary">
            <Link to="/" className="hover:text-accent-terracotta transition-colors">Home</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/crafts" className="hover:text-accent-terracotta transition-colors">{craft?.category?.name || 'Heritage Crafts'}</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <Link to="/regions" className="hover:text-accent-terracotta transition-colors">{craft?.region?.name || 'Traditional Craft Village'}</Link>
            <span className="mx-3 opacity-35 select-none text-text-secondary">|</span>
            <span className="text-text-primary font-semibold">{craft?.name || `Artifact #CR-${craftId}`}</span>
          </div>
        </div>
      </section>

      {/* Showcase Split: 55% Left Visual / 45% Right Specification */}
      <section className="w-full py-space-lg bg-surface">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Photography Column */}
            <div className="lg:col-span-7 flex flex-col space-y-space-md">
              {/* Main Hero Image Frame */}
              <div className="relative w-full aspect-video sm:aspect-[4/3] bg-surface-subtle overflow-hidden group shadow-sm border border-border-neutral">
                <img
                  id="craft-main-display"
                  src={currentPhoto.url}
                  alt={currentPhoto.title}
                  data-alt={currentPhoto.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-text-primary/90 text-surface-crisp px-3 py-1 font-spec-code text-[11px] uppercase tracking-[0.15em] backdrop-blur-sm">
                  {craft?.category?.name || 'Handcrafted Heritage'}
                </div>
                <div className="absolute bottom-4 right-4 bg-surface-crisp/95 text-text-primary px-3 py-1.5 font-spec-code text-spec-code shadow-sm flex items-center gap-2 border border-border-neutral">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta animate-pulse"></span>
                  Inquiry views: {craft?.viewCount || 1} times
                </div>
              </div>

              {/* Thumbnail Gallery Selector */}
              <div className="grid grid-cols-4 gap-space-sm pt-space-xs">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`gallery-thumb aspect-video sm:aspect-[4/3] p-1 transition-all focus:outline-none shadow-sm cursor-pointer border ${
                      activePhotoIndex === idx
                        ? 'bg-surface-crisp ring-1 ring-accent-terracotta border-accent-terracotta'
                        : 'bg-surface-subtle hover:bg-surface-crisp border-border-neutral'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Micro Metrology Bar */}
              <div className="p-space-md bg-surface-container-low border border-border-neutral flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-accent-terracotta text-[18px]">verified</span>
                  <span className="font-spec-code text-spec-code uppercase tracking-[0.08em] text-text-primary font-medium">
                    CraftRoots Heritage Provenance Certificate
                  </span>
                </div>
                <div className="font-spec-code text-[11px] text-text-secondary tracking-widest uppercase">
                  DB Code: {craft?.slug || `craft-${craftId}`}
                </div>
              </div>
            </div>

            {/* Right Specification Column */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Heritage Category Overline */}
              <div className="flex items-center gap-2 mb-space-xs">
                <span className="w-6 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  {craft?.region?.name || 'Vietnamese Craft Village Heritage'}
                </span>
              </div>

              {/* Primary Title */}
              <h1 className="font-display-hero text-[20px] sm:text-[26px] md:text-[32px] leading-[28px] sm:leading-[34px] md:leading-[38px] tracking-[0.04em] sm:tracking-[0.1em] font-light text-text-primary uppercase mb-space-xs">
                {craft?.name || 'Traditional Handcrafted Work'}
              </h1>
              <p className="font-title-card text-[14px] sm:text-title-card italic text-text-secondary mb-space-md">
                {craft?.shortDescription || 'Pure handcrafted masterpiece from the hands of Vietnamese master artisans.'}
              </p>

              {/* Artisan Endorsement Ribbon */}
              <div className="p-3 sm:p-space-md bg-surface-subtle border border-border-neutral mb-4 sm:mb-space-lg flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-[0.12em] sm:tracking-[0.14em]">Crafted by master artisan</span>
                  <Link to={`/artisans/${leadArtisan.id || 1}`} className="font-label-signature text-[18px] sm:text-[22px] leading-tight text-text-primary font-normal hover:text-accent-terracotta transition-colors">
                    {leadArtisan.name}
                  </Link>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-surface-crisp text-accent-terracotta font-spec-code text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-semibold border border-border-neutral">
                    {leadArtisan.title || 'Master Artisan'}
                  </span>
                  <p className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary mt-0.5 sm:mt-1">{leadArtisan.roleTitle || 'Lead Craftsman'}</p>
                </div>
              </div>

              {/* Technical Spec Matrix Table */}
              <div className="bg-surface-crisp border border-border-neutral p-3 sm:p-space-md shadow-sm mb-4 sm:mb-space-lg space-y-2 sm:space-y-space-sm">
                <div className="pb-space-xs border-b border-border-neutral">
                  <span className="font-label-action text-[10px] sm:text-label-action uppercase tracking-[0.15em] sm:tracking-[0.2em] text-text-primary font-semibold">
                    Heritage Technical Specifications
                  </span>
                </div>
                <div className="grid grid-cols-1 divide-y divide-border-neutral text-body-spec">
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Identification code</span>
                    <span className="font-spec-code text-spec-code text-text-primary font-semibold text-right tracking-[0.08em]">{craft?.slug || `CR-0${craftId}`}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Origin village</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">{craft?.region?.name || 'Vietnam'}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Craft materials</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right">{materialsText}</span>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                    <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Crafting technique</span>
                    <span className="font-body-spec text-body-spec text-text-primary text-right font-medium">{techniquesText}</span>
                  </div>
                  {craft?.tools && (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Tools &amp; Utensils</span>
                      <span className="font-body-spec text-body-spec text-text-primary text-right">{craft.tools}</span>
                    </div>
                  )}
                  {craft?.traditionalUse && (
                    <div className="py-2.5 flex items-baseline justify-between gap-space-sm">
                      <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.06em] shrink-0">Recommended function</span>
                      <span className="font-body-spec text-body-spec text-accent-terracotta text-right font-medium">{craft.traditionalUse}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Valuation & Action Zone */}
              <div className="p-4 sm:p-space-lg bg-surface-subtle border border-border-neutral shadow-sm flex flex-col space-y-3 sm:space-y-space-md">
                <div>
                  <span className="font-spec-code text-[10px] sm:text-[11px] text-text-secondary uppercase tracking-[0.12em] sm:tracking-[0.15em] block mb-1">
                    Heritage transfer valuation
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-space-sm">
                    <span className={`font-headline-title text-[22px] sm:text-[28px] md:text-[32px] text-text-primary font-bold tracking-tight transition-all duration-300 ${agentUpdated ? 'text-accent-terracotta scale-105' : ''}`}>
                      {craft?.priceVnd ? `${Number(craft.priceVnd).toLocaleString('vi-VN')} ₫` : 'Curator valuation'}
                    </span>
                    {agentUpdated && (
                      <span className="font-spec-code text-[11px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full animate-bounce flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        AI Live updated!
                      </span>
                    )}
                    <span className="font-spec-code text-[11px] sm:text-spec-code text-accent-terracotta tracking-[0.05em] uppercase font-medium">
                      Batch crafted
                    </span>
                  </div>
                  <p className="font-body-spec text-[12px] text-text-secondary mt-1">
                    * Each batch yields only 12 master pieces reaching Grade A+ natural crackle ratio standards.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                  <button
                    type="button"
                    onClick={toggleSave}
                    className={`flex-1 transition-colors duration-200 py-3.5 px-6 font-label-action text-label-action uppercase tracking-[0.18em] font-semibold text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isSaved
                        ? 'bg-accent-terracotta text-surface-crisp'
                        : 'bg-text-primary text-surface-crisp hover:bg-accent-terracotta'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled' : ''}`}>
                      bookmark_add
                    </span>
                    {isSaved ? 'Saved to Collection' : 'Save to Collection'}
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 bg-surface-crisp border border-border-neutral text-text-primary hover:bg-surface-container-high transition-colors duration-200 py-3.5 px-6 font-label-action text-label-action uppercase tracking-[0.16em] font-semibold text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Book Workshop Visit</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Kiln Temperature Gauge */}
      <section className="w-full bg-surface-container border-y border-border-neutral py-space-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-4">
              <div className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold mb-2">
                Firing Transformation Process
              </div>
              <h2 className="font-headline-title text-headline-title text-text-primary tracking-tight mb-2">
                Kiln Temperature &amp; Reduction Glaze
              </h2>
              <p className="font-body-spec text-body-spec text-text-secondary leading-relaxed">
                Continuously fired for 72 hours with aged pine wood to peak at 1300°C. Crackle fractures form naturally during slow 48-hour northeast wind cooling.
              </p>
            </div>
            <div className="md:col-span-8 bg-surface-crisp border border-border-neutral p-space-lg shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter text-center">
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Stage 1</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">250°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Dehydration &amp; slow drying</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Stage 2</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">950°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Deoxygenation in sealed kiln</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-accent-terracotta font-semibold uppercase tracking-[0.1em] mb-1">Peak Heat</span>
                  <span className="font-display-hero text-[24px] text-accent-terracotta font-medium tracking-normal">1300°C</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Vitrification of ash glaze</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-spec-code text-spec-code text-text-secondary uppercase tracking-[0.1em] mb-1">Cyclic Cooling</span>
                  <span className="font-display-hero text-[24px] text-text-primary font-medium tracking-normal">48 Hours</span>
                  <span className="font-body-spec text-[12px] text-text-secondary mt-1">Crackle glaze crackles softly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Works Section */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 md:pb-space-lg border-b border-border-neutral mb-6 md:mb-8 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-[1px] bg-accent-terracotta"></span>
                <span className="font-spec-code text-spec-code text-accent-terracotta uppercase tracking-[0.2em] font-semibold">
                  Curated Collection
                </span>
              </div>
              <h3 className="font-headline-title text-[20px] sm:text-[24px] md:text-[26px] text-text-primary tracking-tight font-medium uppercase">
                Works by Master {leadArtisan.name} <span className="opacity-35 select-none font-light">|</span> {craft?.region?.name || 'Village Heritage'}
              </h3>
            </div>
            <div className="mt-space-sm md:mt-0 font-spec-code text-spec-code uppercase tracking-[0.15em] text-text-secondary">
              Archived records: {relatedList.length} related works
            </div>
          </div>

          {relatedList.length === 0 ? (
            <p className="text-center font-spec-code text-text-secondary py-8">
              Compiling related works from the same master artisan...
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-gutter">
              {relatedList.map((work) => (
                <article key={work.id} className="bg-surface-crisp border border-border-neutral transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col justify-between group">
                  <div className="relative w-full aspect-square md:aspect-[4/5] bg-surface-subtle overflow-hidden">
                    <img
                      src={work.thumbnailUrl || work.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'}
                      alt={work.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="hidden md:inline-block absolute top-3 left-3 bg-text-primary text-surface-crisp px-2.5 py-0.5 font-spec-code text-[10px] uppercase tracking-[0.15em]">
                      Ref: {work.slug || `CR-0${work.id}`}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 md:p-space-lg flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center font-spec-code text-[10px] md:text-spec-code text-accent-terracotta uppercase tracking-[0.1em] mb-1 truncate">
                        <span className="truncate">{work.region || work.category || 'Village Heritage'}</span>
                      </div>
                      <h4 className="font-title-card text-[15px] sm:text-[16px] md:text-title-card text-text-primary font-semibold mb-1 md:mb-2 group-hover:text-accent-terracotta transition-colors line-clamp-2 leading-snug">
                        <Link to={`/crafts/${work.id}`}>{work.name}</Link>
                      </h4>
                      <p className="hidden md:block font-body-spec text-body-spec text-text-secondary line-clamp-2 leading-relaxed mb-2">
                        {work.shortDescription || work.description || 'Exquisite handcrafted work.'}
                      </p>
                    </div>
                    <div className="pt-2 md:pt-space-md mt-1 md:mt-space-sm border-t border-border-neutral flex items-center justify-between gap-1">
                      <span className="font-headline-title text-[13px] sm:text-[14px] md:text-[18px] text-text-primary font-semibold truncate">
                        {work.price || 'Contact for price'}
                      </span>
                      <Link
                        to={`/crafts/${work.id}`}
                        className="font-label-action text-[9px] sm:text-[10px] md:text-label-action uppercase tracking-[0.1em] md:tracking-[0.15em] text-accent-terracotta hover:underline inline-flex items-center gap-0.5 font-semibold shrink-0"
                      >
                        <span className="hidden sm:inline">VIEW </span>DETAILS →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
