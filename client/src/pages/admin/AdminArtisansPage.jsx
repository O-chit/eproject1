import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminArtisansPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchArtisans = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getArtisans();
      const list = Array.isArray(res) ? res : res?.artisans || res?.items || [];
      setArtisans(list);
    } catch (err) {
      console.error('Lỗi tải danh sách nghệ nhân:', err);
      setErrorMsg(err.message || 'Không thể tải danh sách nghệ nhân.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const filteredArtisans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return artisans;
    return artisans.filter(
      (a) =>
        (a.name || a.fullName || '').toLowerCase().includes(q) ||
        (a.code || a.refCode || '').toLowerCase().includes(q) ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.specialty || '').toLowerCase().includes(q)
    );
  }, [artisans, searchQuery]);

  // Xóa hồ sơ nghệ nhân
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteArtisan(deleteTarget.id);
      showToast(`Đã xóa thành công hồ sơ nghệ nhân "${deleteTarget.name || deleteTarget.fullName}".`);
      setArtisans((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || 'Lỗi khi xóa hồ sơ nghệ nhân.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border-neutral">
        <div>
          <div className="flex items-center gap-2 text-accent-terracotta font-spec-code text-[11px] uppercase tracking-widest font-semibold mb-1">
            <span>HỒ SƠ BẬC THẦY DI SẢN</span>
            <span>/</span>
            <span>LƯU TRỮ VĂN HÓA SỐ</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Quản Trị Hồ Sơ Bậc Thầy Nghệ Nhân
          </h1>
          <p className="font-sans text-[13px] text-text-secondary mt-1">
            Danh bạ các nghệ nhân gìn giữ bí truyền văn hóa, thế hệ truyền thừa và lịch đón tiếp khách ghé thăm xưởng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/artisans/new"
            className="px-4 py-2.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-['Montserrat'] text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Thêm Bậc Thầy Mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Thanh Tìm Kiếm */}
      <div className="bg-surface-crisp border border-border-neutral p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-secondary text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên nghệ nhân, mã hồ sơ hoặc sở trường nghề..."
            className="w-full pl-9 pr-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta transition-colors"
          />
        </div>
      </div>

      {/* 3. Bảng Dữ Liệu Nghệ Nhân */}
      <div className="bg-surface-crisp border border-border-neutral overflow-x-auto shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-spec-code text-[11px] text-text-secondary uppercase tracking-widest">ĐANG NẠP HỒ SƠ NGHỆ NHÂN...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-error font-spec-code text-[12px]">{errorMsg}</div>
        ) : filteredArtisans.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <span className="material-symbols-outlined text-[36px] text-border-neutral mb-2">person_celebrate</span>
            <p className="font-serif text-base text-text-primary">Không tìm thấy hồ sơ nghệ nhân phù hợp</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border-neutral font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
                <th className="p-3 w-16 text-center">Chân Dung</th>
                <th className="p-3">Họ Tên &amp; Mã Hồ Sơ</th>
                <th className="p-3">Danh Hiệu &amp; Làng Nghề</th>
                <th className="p-3">Đời Truyền Thừa / Kinh Nghiệm</th>
                <th className="p-3 text-center">Đón Khách</th>
                <th className="p-3 text-center w-28">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-neutral font-sans text-[13px]">
              {filteredArtisans.map((artisan) => {
                const name = artisan.name || artisan.fullName;
                const code = artisan.code || artisan.refCode || `ART-${artisan.id}`;
                const title = artisan.title || 'Nghệ nhân';
                const avatar = artisan.avatar_url || artisan.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                const village = artisan.village_name || artisan.villageName || artisan.region_name || 'Làng nghề truyền thống';
                const generation = artisan.generation || 1;
                const years = artisan.years_of_experience || artisan.yearsOfExperience || 30;
                const isOpen = artisan.visit_max_guests > 0 || artisan.visitMaxGuests > 0 || artisan.open_days?.length > 0;

                return (
                  <tr key={artisan.id} className="hover:bg-surface-subtle/40 transition-colors">
                    <td className="p-3 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-accent-terracotta overflow-hidden mx-auto bg-surface-subtle">
                        <img
                          src={avatar}
                          alt={name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/artisans/${artisan.id}/edit`}
                        className="font-['Montserrat'] font-semibold text-text-primary hover:text-accent-terracotta transition-colors block"
                      >
                        {name}
                      </Link>
                      <div className="font-spec-code text-[11px] text-text-secondary mt-0.5">
                        MÃ: {code}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-accent-terracotta">{title}</div>
                      <div className="text-[11px] text-text-secondary">{village}</div>
                    </td>
                    <td className="p-3 font-spec-code text-[12px]">
                      <div>Thế hệ thứ <strong>{generation}</strong></div>
                      <div className="text-text-secondary">{years} năm cống hiến</div>
                    </td>
                    <td className="p-3 text-center">
                      {isOpen ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-spec-code text-[10px] uppercase font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Đang Nhận
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-subtle border border-border-neutral text-text-secondary font-spec-code text-[10px] uppercase font-semibold">
                          Tạm Ngừng
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/artisans/${artisan.id}`}
                          target="_blank"
                          title="Xem bản ngoài"
                          className="p-1 hover:text-accent-terracotta hover:bg-surface-subtle cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <Link
                          to={`/admin/artisans/${artisan.id}/edit`}
                          title="Chỉnh sửa hồ sơ"
                          className="p-1 hover:text-accent-terracotta hover:bg-surface-subtle cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(artisan)}
                            title="Xóa hồ sơ (Admin)"
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

      {/* 4. Modal Xóa Hồ Sơ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setDeleteTarget(null)}></div>
          <div className="relative bg-surface-crisp border border-border-neutral max-w-md w-full p-6 shadow-2xl space-y-4 z-10">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-text-primary">Xác Nhận Xóa Hồ Sơ Nghệ Nhân</h3>
                <p className="font-spec-code text-[10px] text-text-secondary uppercase">Thao tác dành cho Administrator</p>
              </div>
            </div>

            <p className="font-sans text-[13px] text-text-secondary">
              Bạn có chắc chắn muốn xóa hồ sơ bậc thầy <strong className="text-text-primary">"{deleteTarget.name || deleteTarget.fullName}"</strong>? Thao tác này sẽ gỡ toàn bộ liên kết khỏi các tác phẩm hiện hữu và không thể hoàn tác.
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

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1B1A] text-white px-4 py-3 border-l-4 border-accent-terracotta shadow-xl flex items-center gap-3 text-[13px] font-sans">
          <span className="material-symbols-outlined text-accent-terracotta text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
