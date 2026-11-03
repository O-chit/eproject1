import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminCraftEditPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  // Active Tab: 'general' | 'specs' | 'media'
  const [activeTab, setActiveTab] = useState('general');

  // Loading & Error State
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dropdown Metadata
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [artisans, setArtisans] = useState([]);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [priceVnd, setPriceVnd] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [summary, setSummary] = useState('');
  const [culturalContext, setCulturalContext] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [status, setStatus] = useState('published');
  const [isSpotlight, setIsSpotlight] = useState(false);
  const [selectedArtisanId, setSelectedArtisanId] = useState('');

  // Gallery
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // Crafting Stages Repeater
  const [stages, setStages] = useState([
    { name: 'Clay Refinement & Wheel Throwing', duration: '2 days', description: 'Selecting fine alluvial clay and hand-shaping on potter wheel' },
    { name: 'Imperial Wood Kiln Firing', duration: '24 hours', description: 'Reduction firing for crackle glaze reaches 1,280°C' },
  ]);

  // Load categories, regions, artisans
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [catRes, regRes, artRes] = await Promise.all([
          api.getCategories().catch(() => []),
          api.getRegions().catch(() => []),
          api.getArtisans().catch(() => []),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : catRes?.categories || []);
        setRegions(Array.isArray(regRes) ? regRes : regRes?.regions || []);
        const artList = Array.isArray(artRes) ? artRes : artRes?.artisans || artRes?.items || [];
        setArtisans(artList);

        if (isNew) {
          setSku(`CR-NEW-${Math.floor(100 + Math.random() * 900)}`);
          if (Array.isArray(catRes) && catRes[0]) setCategoryId(catRes[0].id);
          if (Array.isArray(regRes) && regRes[0]) setRegionId(regRes[0].id);
        }
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    fetchMetadata();
  }, [isNew]);

  // If in edit mode, fetch craft details
  useEffect(() => {
    if (!isNew && id) {
      async function loadCraftDetail() {
        setLoading(true);
        try {
          const data = await api.getCraftById(id);
          if (data) {
            setName(data.name || '');
            setSku(data.sku || `CR-${id}`);
            setSlug(data.slug || '');
            setCategoryId(data.category_id || data.category?.id || '');
            setRegionId(data.region_id || data.region?.id || '');
            setVillageId(data.village_id || '');
            setPriceVnd(data.price_vnd || data.price || '');
            setCoverImage(data.cover_image || data.image_url || '');
            setSummary(data.short_description || data.summary || '');
            setCulturalContext(data.cultural_context || '');
            setDimensions(data.dimensions || (data.specifications?.dimensions ? JSON.stringify(data.specifications.dimensions) : ''));
            setStatus(data.status || (data.is_published === false ? 'draft' : 'published'));
            setIsSpotlight(Boolean(data.is_spotlight || data.is_featured));

            if (Array.isArray(data.gallery) && data.gallery.length > 0) {
              setGalleryUrls(data.gallery.map((g) => (typeof g === 'string' ? g : g.url)));
            }
            if (Array.isArray(data.stages) && data.stages.length > 0) {
              setStages(data.stages);
            }
            if (Array.isArray(data.artisans) && data.artisans[0]) {
              setSelectedArtisanId(data.artisans[0].id || data.artisans[0].artisan_id || '');
            }
          }
        } catch (err) {
          console.error('Error loading craft detail:', err);
          setErrorMsg(err.message || 'Unable to find craft.');
        } finally {
          setLoading(false);
        }
      }
      loadCraftDetail();
    }
  }, [id, isNew]);

  // Generate slug automatically
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (isNew) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryInput.trim()) {
      setGalleryUrls([...galleryUrls, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
  };

  const handleAddStage = () => {
    setStages([...stages, { name: 'New Crafting Stage', duration: '1 day', description: 'Technical description' }]);
  };

  const handleUpdateStage = (idx, field, value) => {
    const updated = [...stages];
    updated[idx][field] = value;
    setStages(updated);
  };

  const handleRemoveStage = (idx) => {
    setStages(stages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter the heritage craft name.');
      return;
    }
    if (!sku.trim()) {
      setErrorMsg('Please enter the craft SKU code.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      slug: slug.trim() || undefined,
      categoryId: parseInt(categoryId, 10) || 1,
      regionId: parseInt(regionId, 10) || 1,
      villageId: villageId ? parseInt(villageId, 10) : undefined,
      priceVnd: priceVnd ? parseInt(priceVnd, 10) : 0,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      summary: summary.trim(),
      culturalContext: culturalContext.trim(),
      dimensions: dimensions.trim() || '25 x 25 x 40 cm',
      status,
      isSpotlight,
      gallery: galleryUrls,
      stages,
      artisans: selectedArtisanId ? [{ artisanId: parseInt(selectedArtisanId, 10), roleTitle: 'Lead Master Artisan', isLead: true }] : [],
    };

    try {
      if (isNew) {
        await api.createCraft(payload);
        setSuccessMsg('Heritage craft created successfully!');
        setTimeout(() => navigate('/admin/crafts'), 1200);
      } else {
        await api.updateCraft(id, payload);
        setSuccessMsg('Heritage craft updated successfully!');
        setTimeout(() => navigate('/admin/crafts'), 1200);
      }
    } catch (err) {
      console.error('Error saving craft:', err);
      setErrorMsg(err.message || 'Error saving craft. Please check your data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">LOADING CRAFT INFORMATION...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-neutral">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/crafts')}
            className="w-9 h-9 border border-border-neutral bg-surface-crisp flex items-center justify-center hover:border-accent-terracotta hover:text-accent-terracotta cursor-pointer transition-colors"
            title="Back to craft directory"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
              {sku || 'CR-NEW'} · {isNew ? 'Create New' : 'Edit'}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {isNew ? 'Add New Heritage Craft' : `Edit: ${name || 'Craft'}`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              to={`/crafts/${id}`}
              target="_blank"
              className="px-3.5 py-2 border border-border-neutral bg-surface-crisp hover:bg-surface-subtle font-['Montserrat'] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
              <span>View Visitor Page</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/crafts')}
            className="px-3.5 py-2 border border-border-neutral bg-surface-crisp hover:bg-surface-subtle font-['Montserrat'] text-[11px] uppercase tracking-wider text-text-secondary cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">save</span>
            <span>{saving ? 'Saving...' : 'Save Craft'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-[13px] font-spec-code">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-spec-code">
          ✅ {successMsg}
        </div>
      )}

      {/* 2. 2-Column Grid: Main Form (8 cols) & Settings (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs bar */}
          <div className="flex border-b border-border-neutral bg-surface-crisp px-4 pt-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 font-spec-code text-[11px] uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'border-accent-terracotta text-accent-terracotta font-semibold bg-surface-crisp'
                  : 'border-transparent text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              1. Basic Info &amp; Culture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 font-spec-code text-[11px] uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-accent-terracotta text-accent-terracotta font-semibold bg-surface-crisp'
                  : 'border-transparent text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              2. Techniques &amp; Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 font-spec-code text-[11px] uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'border-accent-terracotta text-accent-terracotta font-semibold bg-surface-crisp'
                  : 'border-transparent text-text-secondary hover:text-accent-terracotta'
              }`}
            >
              3. Gallery &amp; Process
            </button>
          </div>

          {/* TAB 1: BASIC INFO & CULTURE */}
          {activeTab === 'general' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Heritage Craft Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Lotus Motif Antique Crackle Glaze Vase..."
                  className="w-full px-3.5 py-2.5 bg-surface-subtle/50 border border-border-neutral font-serif text-[16px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Administrative SKU <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    placeholder="CR-BATTRANG-001"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="antique-crackle-glaze-vase"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-secondary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Craft Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Cultural Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Lead Summary
                </label>
                <textarea
                  rows="2"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Concise 1-2 sentence overview of the craft..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                ></textarea>
              </div>

              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Historical &amp; Cultural Context
                </label>
                <textarea
                  rows="5"
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value)}
                  placeholder="In-depth notes on historical era, dynasty, symbolic motifs, and heritage significance..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta leading-relaxed"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNIQUES & SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Dimensions (Standard Specifications)
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 28 x 28 x 45 cm"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Reference Valuation (VND)
                  </label>
                  <input
                    type="number"
                    value={priceVnd}
                    onChange={(e) => setPriceVnd(e.target.value)}
                    placeholder="12000000"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY & PROCESS */}
          {activeTab === 'media' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-6">
              {/* Photo Gallery */}
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-2">
                  Detailed Photo Gallery
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newGalleryInput}
                    onChange={(e) => setNewGalleryInput(e.target.value)}
                    placeholder="Paste high-resolution image URL (Unsplash...)..."
                    className="flex-1 px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3 py-1.5 bg-surface-crisp border border-accent-terracotta text-accent-terracotta font-spec-code text-[11px] uppercase hover:bg-accent-terracotta hover:text-white transition-colors"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative border border-border-neutral p-1 group">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 right-2 bg-black/70 text-white w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {galleryUrls.length === 0 && (
                    <p className="text-[12px] text-text-secondary col-span-4 italic">No detailed photos in gallery yet.</p>
                  )}
                </div>
              </div>

              {/* Stages Repeater */}
              <div className="pt-4 border-t border-border-neutral">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                    Crafting Stages (Stages Repeater)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="text-accent-terracotta font-spec-code text-[11px] uppercase font-semibold hover:underline"
                  >
                    + Add Stage
                  </button>
                </div>

                <div className="space-y-3">
                  {stages.map((stage, idx) => (
                    <div key={idx} className="p-3.5 bg-surface-subtle/60 border border-border-neutral space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 bg-accent-terracotta text-white font-spec-code text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => handleUpdateStage(idx, 'name', e.target.value)}
                            placeholder="Stage name..."
                            className="flex-1 px-2.5 py-1 bg-surface-crisp border border-border-neutral font-['Montserrat'] font-semibold text-[13px]"
                          />
                        </div>
                        <input
                          type="text"
                          value={stage.duration}
                          onChange={(e) => handleUpdateStage(idx, 'duration', e.target.value)}
                          placeholder="Duration..."
                          className="w-28 px-2 py-1 bg-surface-crisp border border-border-neutral font-spec-code text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(idx)}
                          className="text-text-secondary hover:text-red-700 px-1 text-lg font-bold"
                          title="Delete stage"
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        value={stage.description}
                        onChange={(e) => handleUpdateStage(idx, 'description', e.target.value)}
                        placeholder="Technical description..."
                        className="w-full px-2.5 py-1 bg-surface-crisp border border-border-neutral font-sans text-[12px] text-text-secondary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR: SETTINGS & PUBLISHING */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publishing Status */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-4">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">toggle_on</span>
              <span>Publishing Status</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="accent-accent-terracotta"
                />
                <span className="font-sans text-[13px] font-semibold text-emerald-800">Public (Published)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-accent-terracotta"
                />
                <span className="font-sans text-[13px] text-text-secondary">Draft (Unpublished)</span>
              </label>
            </div>

            <div className="pt-3 border-t border-border-neutral">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpotlight}
                  onChange={(e) => setIsSpotlight(e.target.checked)}
                  className="mt-0.5 accent-accent-terracotta"
                />
                <div>
                  <span className="font-sans text-[13px] font-semibold text-text-primary">Featured in Spotlight</span>
                  <p className="font-sans text-[11px] text-text-secondary">Showcase this masterpiece on homepage and interactive heritage map.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Master Artisan */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">person</span>
              <span>Master Artisan</span>
            </h3>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Lead Master Artisan
              </label>
              <select
                value={selectedArtisanId}
                onChange={(e) => setSelectedArtisanId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
              >
                <option value="">-- No artisan assigned --</option>
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || a.fullName} ({a.title || 'Artisan'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">image</span>
              <span>Cover Image (Primary Preview)</span>
            </h3>

            <div className="border border-border-neutral overflow-hidden bg-surface-subtle h-44 flex items-center justify-center">
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-spec-code text-text-secondary">No cover image set</span>
              )}
            </div>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-2.5 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
