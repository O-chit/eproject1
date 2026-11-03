import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Destination after login (default home /)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setSubmitting(true);
      try {
        await register(fullName, email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(true);
      try {
        await login(email, password);
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas-linen flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* 1. Heritage Brand Header */}
      <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-accent-terracotta flex items-center justify-center bg-surface-crisp text-accent-terracotta font-serif font-bold text-base sm:text-lg tracking-widest shrink-0 shadow-sm">
            CR
          </div>
          <div className="flex flex-col text-left">
            <span className="font-['Montserrat'] text-[15px] sm:text-[18px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-text-primary font-semibold group-hover:text-accent-terracotta transition-colors leading-tight">
              CraftRoots
            </span>
            <span className="font-['Inter'] text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-text-secondary leading-none mt-1">
              Heritage &amp; Craft Villages
            </span>
          </div>
        </Link>

        {/* Member Access Notice */}
        <div className="mt-4 sm:mt-5 max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-surface-subtle border border-border-neutral text-accent-terracotta font-spec-code text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta"></span>
            HERITAGE MEMBER AUTHENTICATION PORTAL
          </div>
          <p className="font-body-default text-[12px] sm:text-[13px] text-text-secondary mt-1.5 sm:mt-2 leading-relaxed">
            Please sign in or register an account to continue exploring archives, interactive cultural maps, and Vietnamese master artisan dossiers.
          </p>
        </div>
      </div>

      {/* 2. Sharp Linework Container */}
      <div className="max-w-md w-full mx-auto my-4 sm:my-6 bg-surface-crisp border border-border-neutral shadow-lg p-5 sm:p-9">
        {/* Toggle Tabs */}
        <div className="flex border-b border-border-neutral mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 font-spec-code text-[12px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer text-center ${!isRegister
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-3 font-spec-code text-[12px] uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer text-center ${isRegister
                ? 'border-b-2 border-accent-terracotta text-accent-terracotta'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Register
          </button>
        </div>

        {/* Section Heading */}
        <div className="mb-5 text-center">
          <h2 className="font-headline-title text-[22px] font-semibold text-text-primary">
            {isRegister ? 'Create Heritage Account' : 'Sign In to Account'}
          </h2>
          <p className="font-body-spec text-[12px] text-text-secondary mt-1">
            {isRegister
              ? 'Save favorite masterpieces and receive curatorial insights.'
              : 'Continue your session to access full heritage features.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 mb-5 bg-[#FFDAD6]/50 border border-[#BA1A1A]/30 text-[#93000A] text-[13px] flex items-center gap-2 font-body-spec">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Hoang Nam Nguyen"
                className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
            </div>
          )}

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nam.nguyen@craftroots.vn"
              className="w-full h-11 px-3.5 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
            />
          </div>

          <div>
            <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
              Password {isRegister ? '(At least 8 characters)' : ''} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                placeholder="Enter password..."
                className="w-full h-11 pl-3.5 pr-11 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-spec-code text-[11px] uppercase tracking-wider text-text-secondary mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password..."
                  className="w-full h-11 pl-3.5 pr-11 bg-surface-subtle/50 border border-border-neutral font-body-spec text-[13px] text-text-primary focus:outline-none focus:border-accent-terracotta"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary hover:text-accent-terracotta transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px] select-none">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 py-3.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <span>{isRegister ? 'Create Account & Continue →' : 'Sign In & Continue →'}</span>
            )}
          </button>
        </form>
      </div>

      {/* 3. Footer Copyright */}
      <div className="text-center pb-2 font-spec-code text-[11px] text-text-secondary">
        <span>© 2026 CraftRoots. All rights reserved. Safeguarding Vietnamese Intangible Heritage.</span>
      </div>
    </div>
  );
}
