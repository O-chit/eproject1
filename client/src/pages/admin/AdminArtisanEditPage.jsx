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
  const [roleTitle, setRoleTitle] = useState('Artisan');
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
    { year: '1999', event: 'Successfully revived Le Dynasty crackle glaze formulations' },
    { year: '2010', event: 'Conferred the People’s Artisan title by the State' },
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
            setRoleTitle(data.title || data.roleTitle || 'Artisan');
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
          console.error('Error loading artisan:', err);
          setErrorMsg(err.message || 'Unable to load artisan dossier.');
        } finally {
          setLoading(false);
        }
      }
      loadArtisan();
    }
  }, [id, isNew]);

  // Milestone Actions
  const handleAddMilestone = () => {
    setMilestones([...milestones, { year: '2020', event: 'New career milestone or honor...' }]);
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
      setErrorMsg('Please enter the master artisan full name.');
      return;
    }
    if (!refCode.trim()) {
      setErrorMsg('Please enter the artisan reference code.');
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
        setSuccessMsg('Master artisan dossier created successfully!');
        setTimeout(() => navigate('/admin/artisans'), 1200);
      } else {
        await api.updateArtisan(id, payload);
        setSuccessMsg('Master artisan dossier updated successfully!');
        setTimeout(() => navigate('/admin/artisans'), 1200);
      }
    } catch (err) {
      console.error('Error saving artisan:', err);
      setErrorMsg(err.message || 'Error saving artisan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">LOADING MASTER ARTISAN DOSSIER...</p>
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
            onClick={() => navigate('/admin/artisans')}
            className="w-9 h-9 border border-border-neutral bg-surface-crisp flex items-center justify-center hover:border-accent-terracotta hover:text-accent-terracotta cursor-pointer transition-colors"
            title="Back to artisans list"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="font-spec-code text-[10px] uppercase tracking-wider text-text-secondary">
              {refCode || 'ART-NEW'} · {isNew ? 'Create New' : 'Edit'}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
              {isNew ? 'Add New Master Artisan Dossier' : `Dossier: ${fullName || 'Artisan'}`}
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
              <span>View Visitor Page</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/artisans')}
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
            <span>{saving ? 'Saving...' : 'Save Dossier'}</span>
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

      {/* 2. 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Biographical Data */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-crisp border border-border-neutral p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Master Artisan Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Tran Do..."
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-serif text-[16px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Dossier Ref Code <span className="text-red-600">*</span>
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
                  Honored Title
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="People's Artisan of Bat Trang"
                  className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                  Lineage Generation (e.g. 5th)
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
                  Years of Dedication
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
                Philosophy Quote
              </label>
              <textarea
                rows="2"
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="Artisan's most cherished quote regarding heritage craftsmanship..."
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-serif italic text-[14px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              ></textarea>
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1.5">
                Biography &amp; Cultural Legacy
              </label>
              <textarea
                rows="5"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Career journey, apprenticeship, and lifelong dedication to heritage..."
                className="w-full px-3 py-2 bg-surface-subtle/50 border border-border-neutral font-sans text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta leading-relaxed"
              ></textarea>
            </div>

            {/* Milestones Repeater */}
            <div className="pt-4 border-t border-border-neutral">
              <div className="flex items-center justify-between mb-2">
                <label className="font-spec-code text-[11px] uppercase tracking-wider text-text-secondary">
                  Career Milestones &amp; Honors
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-accent-terracotta font-spec-code text-[11px] uppercase font-semibold hover:underline"
                >
                  + Add Milestone
                </button>
              </div>

              <div className="space-y-2">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => handleUpdateMilestone(idx, 'year', e.target.value)}
                      placeholder="Year..."
                      className="w-24 px-2.5 py-1.5 bg-surface-subtle/50 border border-border-neutral font-spec-code text-[11px]"
                    />
                    <input
                      type="text"
                      value={m.event}
                      onChange={(e) => handleUpdateMilestone(idx, 'event', e.target.value)}
                      placeholder="Event, achievement, or national award..."
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

        {/* Right Column (4 cols): Portrait & Studio Visits */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Portrait Photo */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-3">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">portrait</span>
              <span>Vertical Portrait Photo</span>
            </h3>

            <div className="border border-border-neutral overflow-hidden bg-surface-subtle h-60 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-spec-code text-text-secondary">No portrait photo set</span>
              )}
            </div>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Portrait Image URL
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

          {/* Studio Visit Configuration */}
          <div className="bg-surface-crisp border border-border-neutral p-5 space-y-4">
            <h3 className="font-['Montserrat'] text-[12px] uppercase tracking-wider text-text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-terracotta text-[18px]">event_available</span>
              <span>Studio &amp; Workshop Visits</span>
            </h3>

            <div>
              <label className="block font-spec-code text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                Max Guests / Visit (0 if closed to public)
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
                Workshop &amp; Studio Address
              </label>
              <input
                type="text"
                value={workshopAddress}
                onChange={(e) => setWorkshopAddress(e.target.value)}
                placeholder="e.g. Lane 1, Bat Trang Ancient Village, Hanoi..."
                className="w-full px-3 py-1.5 bg-surface-subtle/50 border border-border-neutral font-sans text-[12px]"
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
