import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminArtisanEditPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [refCode, setRefCode] = useState('');
  const [roleTitle, setRoleTitle] = useState('Nghệ nhân');
  const [specialty, setSpecialty] = useState('');
  const [generation, setGeneration] = useState(1);
  const [yearsOfExperience, setYearsOfExperience] = useState(30);
  const [age, setAge] = useState(60);
  const [avatar, setAvatar] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [bio, setBio] = useState('');
  const [isNationalHeritage, setIsNationalHeritage] = useState(true);
  const [visitMaxGuests, setVisitMaxGuests] = useState(15);
  const [workshopAddress, setWorkshopAddress] = useState('');

  // Milestones Repeater
  const [milestones, setMilestones] = useState([
    { year: '1999', event: 'Phục dựng thành công bài men rạn thời Lê' },
    { year: '2010', event: 'Được Nhà nước phong tặng danh hiệu Nghệ nhân Nhân dân' },
  ]);

  useEffect(() => {
    if (isNew) {
      setRefCode(`ART-AUTO-${Math.floor(10 + Math.random() * 90)}`);
    } else {
      async function loadArtisan() {
        setLoading(true);
        try {
          const data = await api.getArtisanById(id);
          if (data) {
            setFullName(data.name || data.fullName || '');
            setRefCode(data.code || data.refCode || `ART-${id}`);
            setRoleTitle(data.title || data.roleTitle || 'Nghệ nhân');
            setSpecialty(data.specialty || '');
            setGeneration(data.generation || 1);
            setYearsOfExperience(data.years_of_experience || data.yearsOfExperience || 30);
            setAge(data.age || 60);
            setAvatar(data.avatar_url || data.avatar || '');
            setPhilosophy(data.philosophy || '');
            setBio(data.bio || '');
            setIsNationalHeritage(Boolean(data.is_national_heritage || data.isNationalHeritage));
            setVisitMaxGuests(data.visit_max_guests || data.visitMaxGuests || 15);
            setWorkshopAddress(data.workshop_address || data.workshopAddress || '');

            if (Array.isArray(data.milestones) && data.milestones.length > 0) {
              setMilestones(
                data.milestones.map((m) => ({
                  year: String(m.year || '2026'),
                  event: m.event || m.title || m.description || '',
                }))
              );
            }
          }
        } catch (err) {
          console.error('Lỗi nạp nghệ nhân:', err);
          setErrorMsg(err.message || 'Không thể tải hồ sơ nghệ nhân.');
        } finally {
          setLoading(false);
        }
      }
      loadArtisan();
    }
  }, [id, isNew]);

  // Thao tác với Milestones
  const handleAddMilestone = () => {
    setMilestones([...milestones, { year: '2020', event: 'Mốc son vinh danh mới...' }]);
  };

  const handleUpdateMilestone = (idx, field, value) => {
    const updated = [...milestones];
    updated[idx][field] = value;
    setMilestones(updated);
  };

  const handleRemoveMilestone = (idx) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ tên bậc thầy nghệ nhân.');
      return;
    }
    if (!refCode.trim()) {
      setErrorMsg('Vui lòng nhập mã định danh nghệ nhân.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      fullName: fullName.trim(),
      refCode: refCode.trim(),
      roleTitle: roleTitle.trim(),
      specialty: specialty.trim() || undefined,
      generation: parseInt(generation, 10) || 1,
      yearsOfExperience: parseInt(yearsOfExperience, 10) || 0,
      age: parseInt(age, 10) || undefined,
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      philosophy: philosophy.trim(),
      bio: bio.trim(),
      isNationalHeritage,
      visitMaxGuests: parseInt(visitMaxGuests, 10) || 0,
      workshopAddress: workshopAddress.trim(),
      milestones,
    };

    try {
      if (isNew) {
        await api.createArtisan(payload);
        setSuccessMsg('Thêm mới hồ sơ nghệ nhân thành công!');
        setTimeout(() => navigate('/admin/artisans'), 1200);
      } else {
        await api.updateArtisan(id, payload);
        setSuccessMsg('Cập nhật hồ sơ nghệ nhân thành công!');
        setTimeout(() => navigate('/admin/artisans'), 1200);
      }
    } catch (err) {
      console.error('Lỗi khi lưu nghệ nhân:', err);
      setErrorMsg(err.message || 'Lỗi khi lưu dữ liệu nghệ nhân.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">ĐANG NẠP HỒ SƠ BẬC THẦY...</p>
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
            onClick={() => navigate('/admin/artisans')}
            className="w-9 h-9 border border-border-neutral bg-surface-crisp flex items-center justify-center hover:border-accent-terracotta hover:text-accent-terracotta cursor-pointer transition-colors"
            title="Quay lại danh sách"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
              {refCode || 'ART-NEW'} · {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {isNew ? 'Thêm Hồ Sơ Bậc Thầy Mới' : `Hồ Sơ: ${fullName || 'Nghệ Nhân'}`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              to={`/artisans/${id}`}
              target="_blank"
              className="px-3.5 py-2 border border-border-neutral bg-surface-crisp hover:bg-surface-subtle font-['Montserrat'] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
              <span>Xem Bản Khách</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/artisans')}
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
            <span>{saving ? 'Đang Lưu...' : 'Lưu Hồ Sơ'}</span>
          </button>
        </div>
      </div>

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

      {/* 2. BỐ CỤC 2 CỘT FORM NGHỆ NHÂN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cột Trái (8 cột): Dữ liệu tư liệu & tiểu sử */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Họ Và Tên Bậc Thầy <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Ví dụ: Trần Độ..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-serif text-[16px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Mã Hồ Sơ (Ref Code) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  required
                  placeholder="ART-BATTRANG-01"
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Danh Hiệu Vinh Danh
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Nghệ nhân Nhân dân Bát Tràng"
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Thế Hệ Kế Thừa (Đời thứ)
                </label>
                <input
                  type="number"
                  value={generation}
                  onChange={(e) => setGeneration(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Số Năm Làm Nghề
                </label>
                <input
                  type="number"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                Tuyên Ngôn Triết Lý Nghề (Philosophy Quote)
              </label>
              <textarea
                rows="2"
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="Câu trích dẫn tâm đắc nhất của nghệ nhân về nghề..."
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-serif italic text-[14px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              ></textarea>
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                Tiểu Sử Chi Tiết &amp; Đóng Góp Di Sản (Biography)
              </label>
              <textarea
                rows="5"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Con đường gắn bó, học nghề và cống hiến cho di sản..."
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta leading-relaxed"
              ></textarea>
            </div>

            {/* Niên biểu sự nghiệp (Milestones Repeater) */}
            <div className="pt-4 border-t border-border-neutral">
              <div className="flex items-center justify-between mb-2">
                <label className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                  Niên Biểu Sự Nghiệp &amp; Mốc Son Vinh Danh
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-accent-terracotta font-spec-code text-[11px] uppercase font-semibold hover:underline"
                >
                  + Thêm Mốc Son
                </button>
              </div>

              <div className="space-y-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)}
                      placeholder="Năm..."
                      className="w-24 px-2.5 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px]"
                    />
                    <input
                      type="text"
                      value={m.event}
                      onChange={(e) => handleUpdateMilestone(idx, 'event', e.target.value)}
                      placeholder="Sự kiện, thành tựu hoặc giải thưởng..."
                      className="flex-1 px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-sans text-[12px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-text-secondary hover:text-red-700 px-1 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Cột Phải (4 cột): Chân dung & Tiếp đón khách */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ảnh chân dung */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">portrait</span>
              <span>Ảnh Chân Dung Khổ Dọc</span>
            </h3>

            <div className="border border-border-neutral overflow-hidden bg-surface-subtle h-60 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-spec-code text-text-secondary">Chưa có ảnh chân dung</span>
              )}
            </div>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                URL Hình Ảnh Chân Dung
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-2.5 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
            </div>
          </div>

          {/* Cấu hình tiếp đón khách */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-4">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">event_available</span>
              <span>Đón Khách Thăm Xưởng</span>
            </h3>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Số Khách Tối Đa / Lượt (0 nếu đóng cửa)
              </label>
              <input
                type="number"
                value={visitMaxGuests}
                onChange={(e) => setVisitMaxGuests(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[12px]"
              />
            </div>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Địa Chỉ Nhà Xưởng Trưng Bày
              </label>
              <input
                type="text"
                value={workshopAddress}
                onChange={(e) => setWorkshopAddress(e.target.value)}
                placeholder="Ví dụ: Xóm 1, Làng Cổ Bát Tràng, Hà Nội..."
                className="w-full px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-sans text-[12px]"
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
