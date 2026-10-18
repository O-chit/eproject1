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

  // Thư viện ảnh gallery
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  // Công đoạn chế tác (Stages Repeater)
  const [stages, setStages] = useState([
    { name: 'Luyện đất & Tạo hình', duration: '2 ngày', description: 'Chọn lọc đất sa mộc và vuốt tay bàn xoay' },
    { name: 'Nung lò củi hoàng cung', duration: '24 giờ', description: 'Nhiệt độ khử nung men rạn đạt 1.280°C' },
  ]);

  // Nạp dữ liệu danh mục, vùng miền, nghệ nhân
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
          // Sinh SKU tự động cho bài mới
          setSku(`CR-NEW-${Math.floor(100 + Math.random() * 900)}`);
          if (Array.isArray(catRes) && catRes[0]) setCategoryId(catRes[0].id);
          if (Array.isArray(regRes) && regRes[0]) setRegionId(regRes[0].id);
        }
      } catch (err) {
        console.error('Lỗi nạp metadata:', err);
      }
    }
    fetchMetadata();
  }, [isNew]);

  // Nếu là chế độ Edit, nạp thông tin chi tiết của Craft
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
          console.error('Lỗi nạp chi tiết tác phẩm:', err);
          setErrorMsg(err.message || 'Không thể tìm thấy tác phẩm.');
        } finally {
          setLoading(false);
        }
      }
      loadCraftDetail();
    }
  }, [id, isNew]);

  // Tự sinh Slug từ Tên tác phẩm
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

  // Thêm ảnh vào gallery
  const handleAddGalleryImage = () => {
    if (newGalleryInput.trim()) {
      setGalleryUrls([...galleryUrls, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
  };

  // Thêm/Xóa công đoạn chế tác
  const handleAddStage = () => {
    setStages([...stages, { name: 'Công đoạn mới', duration: '1 ngày', description: 'Mô tả kỹ thuật' }]);
  };

  const handleUpdateStage = (idx, field, value) => {
    const updated = [...stages];
    updated[idx][field] = value;
    setStages(updated);
  };

  const handleRemoveStage = (idx) => {
    setStages(stages.filter((_, i) => i !== idx));
  };

  // Gửi Form Lưu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên tác phẩm di sản.');
      return;
    }
    if (!sku.trim()) {
      setErrorMsg('Vui lòng nhập mã SKU tác phẩm.');
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
      artisans: selectedArtisanId ? [{ artisanId: parseInt(selectedArtisanId, 10), roleTitle: 'Nghệ nhân chủ trì chế tác', isLead: true }] : [],
    };

    try {
      if (isNew) {
        await api.createCraft(payload);
        setSuccessMsg('Tạo mới tác phẩm di sản thành công!');
        setTimeout(() => navigate('/admin/crafts'), 1200);
      } else {
        await api.updateCraft(id, payload);
        setSuccessMsg('Cập nhật tác phẩm di sản thành công!');
        setTimeout(() => navigate('/admin/crafts'), 1200);
      }
    } catch (err) {
      console.error('Lỗi khi lưu tác phẩm:', err);
      setErrorMsg(err.message || 'Lỗi khi lưu tác phẩm. Vui lòng kiểm tra lại dữ liệu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">ĐANG NẠP THÔNG TIN TÁC PHẨM...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header Tác Vụ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-neutral">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/crafts')}
            className="w-9 h-9 border border-border-neutral bg-surface-crisp flex items-center justify-center hover:border-accent-terracotta hover:text-accent-terracotta cursor-pointer transition-colors"
            title="Quay lại danh sách"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
              {sku || 'CR-NEW'} · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {isNew ? 'Thêm Tác Phẩm Di Sản Mới' : `Chỉnh Sửa: ${name || 'Tác Phẩm'}`}
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
              <span>Xem Bản Khách</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/crafts')}
            className="px-3.5 py-2 border border-border-neutral bg-surface-crisp hover:bg-surface-subtle font-['Montserrat'] text-[11px] uppercase tracking-wider text-text-secondary cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold cursor-pointer shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">save</span>
            <span>{saving ? 'Đang Lưu...' : 'Lưu Tác Phẩm'}</span>
          </button>
        </div>
      </div>

      {/* Thông báo lỗi / thành công */}
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

      {/* 2. BỐ CỤC 2 CỘT: CỘT CHÍNH (8 CỘT) & CỘT CÀI ĐẶT (4 CỘT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CỘT CHÍNH: FORM TABS */}
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
              1. Thông Tin &amp; Văn Hóa
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
              2. Kỹ Pháp &amp; Thông Số
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
              3. Thư Viện Ảnh &amp; Quy Trình
            </button>
          </div>

          {/* TAB 1: THÔNG TIN & VĂN HÓA */}
          {activeTab === 'general' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Tên Tác Phẩm Di Sản <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                  placeholder="Ví dụ: Bình Gốm Men Rạn Cổ Hoa Sen..."
                  className="w-full px-3.5 py-2.5 bg-surface-subtle/50 border border-border-neutral font-serif text-[16px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Mã SKU Quản Trị <span className="text-red-600">*</span>
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
                    Đường Dẫn Tĩnh (Slug URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="binh-gom-men-ran-co"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-secondary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Ngành Nghề Thủ Công <span className="text-red-600">*</span>
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
                    Vùng Văn Hóa Di Sản <span className="text-red-600">*</span>
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
                  Tóm Tắt Ngắn (Lead Summary)
                </label>
                <textarea
                  rows="2"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Mô tả súc tích 1-2 câu về tác phẩm..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                ></textarea>
              </div>

              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Bối Cảnh Lịch Sử &amp; Ý Nghĩa Văn Hóa (Cultural Context)
                </label>
                <textarea
                  rows="5"
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value)}
                  placeholder="Ghi chép sâu về niên đại, triều đại, ý nghĩa họa tiết..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta leading-relaxed"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 2: KỸ PHÁP & THÔNG SỐ */}
          {activeTab === 'specs' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Kích Thước (Quy cách tiêu chuẩn)
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Ví dụ: 28 x 28 x 45 cm"
                    className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                    Giá Tham Chiếu (VNĐ)
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

          {/* TAB 3: MEDIA & QUY TRÌNH NUNG ĐÚC */}
          {activeTab === 'media' && (
            <div className="bg-surface-crisp border border-border-neutral p-6 space-y-6">
              {/* Thư viện ảnh */}
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-2">
                  Thư Viện Ảnh Chi Tiết (Gallery)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newGalleryInput}
                    onChange={(e) => setNewGalleryInput(e.target.value)}
                    placeholder="Dán link ảnh URL chi tiết (Unsplash...)"
                    className="flex-1 px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3 py-1.5 bg-surface-crisp border border-accent-terracotta text-accent-terracotta font-spec-code text-[11px] uppercase hover:bg-accent-terracotta hover:text-white transition-colors"
                  >
                    + Thêm Ảnh
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
                    <p className="text-[12px] text-text-secondary col-span-4 italic">Chưa có ảnh chi tiết nào trong thư viện.</p>
                  )}
                </div>
              </div>

              {/* Các công đoạn chế tác (Stages Repeater) */}
              <div className="pt-4 border-t border-border-neutral">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                    Các Công Đoạn Chế Tác Thủ Công (Stages Repeater)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="text-accent-terracotta font-spec-code text-[11px] uppercase font-semibold hover:underline"
                  >
                    + Thêm Công Đoạn
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
                            placeholder="Tên công đoạn..."
                            className="flex-1 px-2.5 py-1 bg-surface-crisp border border-border-neutral font-['Montserrat'] font-semibold text-[13px]"
                          />
                        </div>
                        <input
                          type="text"
                          value={stage.duration}
                          onChange={(e) => handleUpdateStage(idx, 'duration', e.target.value)}
                          placeholder="Thời gian..."
                          className="w-28 px-2 py-1 bg-surface-crisp border border-border-neutral font-spec-code text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(idx)}
                          className="text-text-secondary hover:text-red-700 px-1 text-lg font-bold"
                          title="Xóa công đoạn"
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="text"
                        value={stage.description}
                        onChange={(e) => handleUpdateStage(idx, 'description', e.target.value)}
                        placeholder="Mô tả kỹ thuật thực hiện..."
                        className="w-full px-2.5 py-1 bg-surface-crisp border border-border-neutral font-sans text-[12px] text-text-secondary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHỤ (4 CỘT - THIẾT LẬP & XUẤT BẢN) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trạng thái xuất bản */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-4">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">toggle_on</span>
              <span>Trạng Thái Xuất Bản</span>
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
                <span className="font-sans text-[13px] font-semibold text-emerald-800">Công Khai (Published)</span>
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
                <span className="font-sans text-[13px] text-text-secondary">Lưu Nháp (Draft)</span>
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
                  <span className="font-sans text-[13px] font-semibold text-text-primary">Đưa vào Tiêu Biểu (Spotlight)</span>
                  <p className="font-sans text-[11px] text-text-secondary">Hiển thị kiệt tác tại trang chủ và bản đồ di sản tương tác.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Nghệ nhân chế tác */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">person</span>
              <span>Nghệ Nhân Chế Tác</span>
            </h3>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Nghệ Nhân Chủ Trì
              </label>
              <select
                value={selectedArtisanId}
                onChange={(e) => setSelectedArtisanId(e.target.value)}
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
              >
                <option value="">-- Chưa gắn nghệ nhân --</option>
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || a.fullName} ({a.title || 'Nghệ nhân'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ảnh bìa đại diện */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">image</span>
              <span>Ảnh Bìa Đại Diện (Cover)</span>
            </h3>

            <div className="border border-border-neutral overflow-hidden bg-surface-subtle h-44 flex items-center justify-center">
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-spec-code text-text-secondary">Chưa có ảnh bìa</span>
              )}
            </div>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                URL Hình Ảnh Bìa
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
