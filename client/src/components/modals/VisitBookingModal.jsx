import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Ngày sớm nhất có thể đặt (YYYY-MM-DD) theo lead time của nghệ nhân — khớp kiểm tra phía server
function getEarliestDate(leadHours) {
  const d = new Date();
  d.setDate(d.getDate() + Math.ceil((leadHours || 24) / 24));
  return d.toISOString().slice(0, 10);
}

export default function VisitBookingModal({ artisan, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('Morning: 09:30 - 11:30');
  const [note, setNote] = useState('Tea dialogue & Traditional technique study');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const minDate = getEarliestDate(artisan?.visitLeadTimeHours);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!artisan?.id) {
      setErrorMsg('Unable to identify the artisan for this booking.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      const booking = await api.createBooking({
        artisanId: artisan.id,
        fullName: name,
        phone,
        email: user?.email || undefined,
        visitDate: date,
        timeSlot: slot,
        purpose: note,
      });
      setSubmitted(true);
      if (onSuccess) onSuccess(booking);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
        setDate('');
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.details?.[0]?.issue || err.message || 'Unable to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B1A]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-surface-crisp border border-border-neutral w-full max-w-lg p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <span className="font-spec-code text-[11px] uppercase tracking-widest text-accent-terracotta font-semibold">
          DIRECT HERITAGE CONNECTION
        </span>
        <h3 className="font-headline-title text-[20px] text-text-primary uppercase mt-1">
          Book Studio Visit {artisan?.name ? `• ${artisan.name}` : ''}
        </h3>
        <p className="font-body-spec text-[12px] text-text-secondary mt-1">
          Experience traditional handcrafting processes and enjoy tea dialogue with master artisans.
        </p>

        {submitted ? (
          <div className="my-6 p-4 bg-[#F4F9F5] border border-emerald-700 text-emerald-900 text-center font-body-spec text-[13px]">
            Visit request received! The CraftRoots heritage secretariat will contact you at {phone} within 4 working hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Your Full Name *
              </label>
              <input
                className="w-full h-11 bg-surface-crisp px-4 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                placeholder="Nguyen Van An"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Contact Phone Number *
              </label>
              <input
                className="w-full h-11 bg-surface-crisp px-4 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                placeholder="0912 345 678"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                  Time Slot
                </label>
                <select
                  className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                >
                  <option>Morning: 09:30 - 11:30</option>
                  <option>Afternoon: 14:00 - 16:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Purpose of Visit
              </label>
              <select
                className="w-full h-11 bg-surface-crisp px-3 font-body-spec text-[13px] border border-border-neutral focus:outline-none focus:border-accent-terracotta"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              >
                <option value="Tea dialogue & Traditional technique study">Tea dialogue &amp; Traditional technique study</option>
                <option value="Observe wood-firing kiln unload cycle">Observe wood-firing kiln unload cycle</option>
                <option value="Commission custom bespoke family heirloom">Commission custom bespoke family heirloom</option>
                <option value="Ethnographic & artistic academic research">Ethnographic &amp; artistic academic research</option>
              </select>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FDF3F0] border border-[#B23A1E] text-[#8A2A14] font-body-spec text-[12px]" role="alert">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent-terracotta hover:bg-[#8E4A16] disabled:opacity-60 disabled:cursor-not-allowed text-white font-label-action text-[12px] uppercase tracking-[0.2em] py-3.5 mt-2 transition-colors cursor-pointer"
            >
              {submitting ? 'SUBMITTING…' : 'SUBMIT VISIT REQUEST →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
