import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminCraftsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Batch Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Quick Preview Drawer
  const [previewCraft, setPreviewCraft] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Nạp dữ liệu sản phẩm, danh mục, vùng miền từ backend API
  const fetchAllData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [craftsRes, catRes, regRes] = await Promise.all([
        api.getCrafts({ limit: 100 }),
        api.getCategories().catch(() => []),
        api.getRegions().catch(() => []),
      ]);

      const craftItems = Array.isArray(craftsRes)
        ? craftsRes
        : craftsRes?.items || craftsRes?.crafts || [];

      setCrafts(craftItems);
      setCategories(Array.isArray(catRes) ? catRes : catRes?.categories || []);
      setRegions(Array.isArray(regRes) ? regRes : regRes?.regions || []);
    } catch (err) {
      console.error('Lỗi nạp danh sách tác phẩm:', err);
      setErrorMsg(err.message || 'Không thể tải dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Lọc dữ liệu client-side nhanh chóng
  const filteredCrafts = useMemo(() => {
    return crafts.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchName = !q || c.name?.toLowerCase().includes(q);
      const matchSku = !q || c.sku?.toLowerCase().includes(q);
      const matchVillage = !q || c.village_name?.toLowerCase().includes(q) || c.village?.name?.toLowerCase().includes(q);

      const matchRegion =
        !selectedRegion ||
        String(c.region_id) === String(selectedRegion) ||
        c.region_code === selectedRegion ||
        c.region?.code === selectedRegion;

      const matchCategory =
        !selectedCategory ||
        String(c.category_id) === String(selectedCategory) ||
        c.category_slug === selectedCategory ||
        c.category?.slug === selectedCategory;

      let matchStatus = true;
      if (selectedStatus === 'spotlight') {
        matchStatus = Boolean(c.is_spotlight || c.is_featured);
      } else if (selectedStatus === 'published') {
        matchStatus = c.status === 'published' || c.is_published !== false;
      } else if (selectedStatus === 'draft') {
        matchStatus = c.status === 'draft' || c.is_published === false;
      }

      return (matchName || matchSku || matchVillage) && matchRegion && matchCategory && matchStatus;
    });
  }, [crafts, searchQuery, selectedRegion, selectedCategory, selectedStatus]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = crafts.length;
    const published = crafts.filter((c) => c.status === 'published' || c.is_published !== false).length;
    const drafts = total - published;
    const spotlight = crafts.filter((c) => c.is_spotlight || c.is_featured).length;
    return { total, published, drafts, spotlight };
  }, [crafts]);

  // Checkbox Selection
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCrafts.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Thao tác xóa
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteCraft(deleteTarget.id);
      showToast(`Đã xóa vĩnh viễn tác phẩm "${deleteTarget.name}" thành công.`);
      setCrafts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa tác phẩm.');
    } finally {
      setDeleting(false);
    }
  };

  // Thao tác hàng loạt (Batch Actions)
  const handleBatchDelete = async () => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Administrator mới có quyền xóa dữ liệu!');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tác phẩm đã chọn?`)) {
      return;
    }
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await api.deleteCraft(id).catch(() => {});
      }
      showToast(`Đã xóa thành công ${selectedIds.length} tác phẩm di sản.`);
      setSelectedIds([]);
      fetchAllData();
    } catch (err) {
      alert(err.message || 'Lỗi khi xử lý thao tác hàng loạt.');
    } finally {
      setLoading(false);
    }
  };

  const formatVnd = (num) => {
    if (!num) return 'Tham chiếu';
    return Number(num).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Tiêu đề */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border-neutral">
        <div>
          <div className="flex items-center gap-2 text-accent-terracotta font-spec-code text-[11px] uppercase tracking-widest font-semibold mb-1">
            <span>HỆ THỐNG QUẢN LÝ DI SẢN</span>
            <span>/</span>
            <span>SEC 6.3 RESTFUL API</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Quản Trị Tác Phẩm Thủ Công Di Sản
          </h1>
          <p className="font-sans text-[13px] text-text-secondary mt-1">
            Kiểm soát danh mục các kiệt tác văn hóa, thông số kỹ thuật, quy trình nung đúc và nghệ nhân chế tác.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/crafts/new"
            className="px-4 py-2.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Thêm Tác Phẩm Mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Bốn Khối Chỉ Số Nhanh (Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-crisp border border-border-neutral p-4 flex flex-col">
          <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">Tổng Tác Phẩm</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-serif text-2xl font-bold text-text-primary">{stats.total}</span>
            <span className="font-spec-code text-[10px] text-tertiary">CSDL Hiện Có</span>
          </div>
        </div>
        <div className="bg-surface-crisp border border-border-neutral p-4 flex flex-col">
          <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">Đã Xuất Bản</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-serif text-2xl font-bold text-tertiary">{stats.published}</span>
            <span className="font-spec-code text-[10px] text-tertiary">Công khai website</span>
          </div>
        </div>
        <div className="bg-surface-crisp border border-border-neutral p-4 flex flex-col">
          <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">Bản Nháp (Drafts)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-serif text-2xl font-bold text-text-secondary">{stats.drafts}</span>
            <span className="font-spec-code text-[10px] text-accent-terracotta">Chưa duyệt</span>
          </div>
        </div>
        <div className="bg-surface-crisp border border-border-neutral p-4 flex flex-col">
          <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">Tiêu Biểu (Spotlight)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-serif text-2xl font-bold text-accent-terracotta">{stats.spotlight}</span>
            <span className="font-spec-code text-[10px] text-accent-terracotta">Trang chủ</span>
          </div>
        </div>
      </div>

      {/* 3. Thanh Tìm Kiếm & Bộ Lọc Đa Diện */}
      <div className="bg-surface-crisp border border-border-neutral p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Ô Tìm Kiếm */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên tác phẩm, mã SKU hoặc làng nghề..."
            className="w-full pl-9 pr-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta transition-colors"
          />
        </div>

        {/* Dropdowns Lọc */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-9 px-2.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
          >
            <option value="">Tất cả Vùng Miền</option>
            {regions.map((r) => (
              <option key={r.id || r.code} value={r.id || r.code}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-2.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
          >
            <option value="">Tất cả Ngành Nghề</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.id || c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-2.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px] text-text-primary focus:outline-none focus:border-accent-terracotta cursor-pointer"
          >
            <option value="">Tất cả Trạng Thái</option>
            <option value="published">Đã Xuất Bản</option>
            <option value="draft">Bản Nháp</option>
            <option value="spotlight">Spotlight (Tiêu biểu)</option>
          </select>
        </div>
      </div>

      {/* 4. Thanh Thao Tác Hàng Loạt (Batch Actions) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#1C1B1A] text-white p-3 border border-[#2C2B29] flex items-center justify-between text-[12px] font-spec-code">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-terracotta">check_box</span>
            <span>Đã chọn <strong className="text-accent-terracotta">{selectedIds.length}</strong> mục di sản</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-semibold cursor-pointer"
              >
                🗑️ Xóa Các Mục Đã Chọn
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              Bỏ Chọn
            </button>
          </div>
        </div>
      )}

      {/* 5. Bảng Dữ Liệu Sharp Linework */}
      <div className="bg-surface-crisp border border-border-neutral overflow-x-auto shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-spec-code text-[11px] text-text-secondary uppercase tracking-widest">ĐANG NẠP DANH SÁCH DI SẢN...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-error font-spec-code text-[12px]">
            {errorMsg}
          </div>
        ) : filteredCrafts.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <span className="material-symbols-outlined text-[36px] text-border-neutral mb-2">inventory_2</span>
            <p className="font-serif text-base text-text-primary">Không tìm thấy tác phẩm nào phù hợp</p>
            <p className="text-[12px] text-text-secondary mt-1">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm phía trên.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-neutral font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCrafts.length && filteredCrafts.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-accent-terracotta cursor-pointer"
                  />
                </th>
                <th className="p-3 w-16">Ảnh</th>
                <th className="p-3">Tác Phẩm &amp; Mã SKU</th>
                <th className="p-3">Ngành Nghề &amp; Làng Nghề</th>
                <th className="p-3 text-right">Giá Ước Tính</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-center w-28">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-neutral font-sans text-[13px]">
              {filteredCrafts.map((craft) => {
                const isSelected = selectedIds.includes(craft.id);
                const isSpotlight = craft.is_spotlight || craft.is_featured;
                const isPub = craft.status === 'published' || craft.is_published !== false;

                return (
                  <tr key={craft.id} className={`hover:bg-surface-subtle/40 transition-colors ${isSelected ? 'bg-surface-subtle/60' : ''}`}>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(craft.id)}
                        className="accent-accent-terracotta cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="w-12 h-12 border border-border-neutral overflow-hidden bg-surface-subtle">
                        <img
                          src={craft.cover_image || craft.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80'}
                          alt={craft.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/crafts/${craft.id}/edit`}
                        className="font-['Montserrat'] font-semibold text-text-primary hover:text-accent-terracotta transition-colors block"
                      >
                        {craft.name}
                      </Link>
                      <div className="font-spec-code text-[11px] text-text-secondary mt-0.5 flex items-center gap-2">
                        <span>SKU: {craft.sku || `CR-${craft.id}`}</span>
                        {isSpotlight && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border-neutral"></span>
                            <span className="text-accent-terracotta font-medium">⭐ Spotlight</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-text-primary font-medium">{craft.category_name || craft.category?.name || 'Thủ công mỹ nghệ'}</div>
                      <div className="text-[11px] text-text-secondary">{craft.village_name || craft.region_name || 'Làng nghề di sản'}</div>
                    </td>
                    <td className="p-3 text-right font-spec-code font-semibold text-text-primary">
                      {formatVnd(craft.price_vnd || craft.price)}
                    </td>
                    <td className="p-3 text-center">
                      {isPub ? (
                        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-spec-code text-[10px] uppercase font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 bg-surface-subtle border border-border-neutral text-text-secondary font-spec-code text-[10px] uppercase font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewCraft(craft)}
                          title="Xem trước giao diện khách"
                          className="p-1 hover:text-accent-terracotta hover:bg-surface-subtle cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <Link
                          to={`/admin/crafts/${craft.id}/edit`}
                          title="Chỉnh sửa chi tiết"
                          className="p-1 hover:text-accent-terracotta hover:bg-surface-subtle cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(craft)}
                            title="Xóa tác phẩm (Admin)"
                            className="p-1 hover:text-red-700 hover:bg-surface-subtle cursor-pointer transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. Phân Trang & Thông Tin */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[12px] font-spec-code text-text-secondary">
        <div>
          Đang hiển thị <strong>{filteredCrafts.length}</strong> / <strong>{crafts.length}</strong> tác phẩm di sản
        </div>
      </div>

      {/* 7. Quick Preview Drawer */}
      {previewCraft && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setPreviewCraft(null)}
          ></div>
          <div className="relative ml-auto w-full max-w-md bg-surface-crisp border-l border-border-neutral shadow-2xl flex flex-col z-10">
            <div className="p-4 bg-surface-subtle border-b border-border-neutral flex items-center justify-between">
              <span className="font-spec-code text-[11px] text-accent-terracotta font-semibold uppercase tracking-wider">
                Xem Trước Giao Diện Khách
              </span>
              <button
                type="button"
                onClick={() => setPreviewCraft(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-crisp border border-transparent hover:border-border-neutral cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="border border-border-neutral overflow-hidden h-56 bg-surface-subtle">
                <img
                  src={previewCraft.cover_image || previewCraft.image_url}
                  alt={previewCraft.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="font-spec-code text-[11px] text-accent-terracotta font-semibold">
                  {previewCraft.sku || `SKU: CR-${previewCraft.id}`}
                </span>
                <h3 className="font-serif text-xl font-bold text-text-primary mt-1">
                  {previewCraft.name}
                </h3>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {previewCraft.village_name || previewCraft.region_name}
                </p>
              </div>

              <div className="p-3 bg-surface-subtle border border-border-neutral">
                <span className="font-spec-code text-[10px] uppercase text-text-secondary">Giá tham chiếu</span>
                <div className="font-serif text-xl font-bold text-accent-terracotta mt-0.5">
                  {formatVnd(previewCraft.price_vnd || previewCraft.price)}
                </div>
              </div>

              <div>
                <span className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary block mb-1">
                  Tóm Tắt Di Sản:
                </span>
                <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                  {previewCraft.short_description || previewCraft.cultural_context || 'Chưa có thông tin tóm tắt.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border-neutral flex gap-2">
                <Link
                  to={`/admin/crafts/${previewCraft.id}/edit`}
                  className="flex-1 py-2.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-wider font-semibold text-center transition-colors"
                >
                  ✏️ Chỉnh Sửa Tác Phẩm Này
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Xác Nhận Xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setDeleteTarget(null)}
          ></div>
          <div className="relative bg-surface-crisp border border-border-neutral max-w-md w-full p-6 shadow-2xl space-y-4 z-10">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary">Xác Nhận Xóa Tác Phẩm</h3>
                <p className="font-spec-code text-[10px] text-text-secondary uppercase">Thao tác dành cho Administrator</p>
              </div>
            </div>

            <p className="font-sans text-[13px] text-text-secondary">
              Bạn có chắc chắn muốn xóa vĩnh viễn tác phẩm <strong className="text-text-primary">"{deleteTarget.name}"</strong> (SKU: {deleteTarget.sku})? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-neutral">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-border-neutral bg-surface-crisp hover:bg-surface-subtle font-['Montserrat'] text-[11px] uppercase tracking-wider text-text-primary cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-['Montserrat'] text-[11px] uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Đang Xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Toast Thông Báo */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1B1A] text-white px-4 py-3 border-l-4 border-accent-terracotta shadow-xl flex items-center gap-3 text-[13px] font-sans animate-bounce-in">
          <span className="material-symbols-outlined text-accent-terracotta text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
