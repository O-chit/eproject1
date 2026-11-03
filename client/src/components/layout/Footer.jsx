import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-canvas-linen border-t border-border-neutral pt-8 sm:pt-12 md:pt-space-xl pb-6 sm:pb-space-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-gutter pb-8 sm:pb-space-xl border-b border-border-neutral">
          
          {/* Column 1: CraftRoots Brand & Living Archive */}
          <div className="md:col-span-4 flex flex-col pr-0 md:pr-space-md">
            <div className="flex items-center gap-2 sm:gap-space-sm mb-2 sm:mb-space-sm">
              <span className="font-headline-title text-[20px] sm:text-headline-title text-text-primary tracking-tight">
                CraftRoots
              </span>
              <span className="text-[10px] font-spec-code tracking-[0.15em] sm:tracking-[0.2em] uppercase text-accent-terracotta border border-accent-terracotta px-2 py-0.5 rounded-[50px]">
                Living Archive
              </span>
            </div>
            <p className="font-body-spec text-[12px] sm:text-body-spec text-text-secondary leading-relaxed mb-3 sm:mb-space-md">
              Preserving the essence of craft villages and honoring the master hands of Vietnamese artisans through every line, tactile material, and cultural heritage.
            </p>
            <div className="text-body-spec font-body-spec text-text-primary space-y-1">
              <div className="font-semibold text-text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-accent-terracotta">
                  location_on
                </span>
                Studio &amp; Heritage Archive:
              </div>
              <div className="text-text-secondary pl-5 text-[12px]">
                Village 1, Bat Trang, Gia Lam, Hanoi
              </div>
            </div>
          </div>

          {/* Column 2: Heritage & Restoration Newsletter */}
          <div className="md:col-span-5 flex flex-col justify-start md:px-space-md border-t md:border-t-0 md:border-l md:border-r border-border-neutral pt-space-md md:pt-0">
            <span className="font-label-action text-label-action uppercase tracking-[0.18em] text-text-primary font-semibold mb-space-xs">
              Heritage &amp; Restoration Newsletter
            </span>
            <p className="font-body-spec text-body-spec text-text-secondary mb-space-md">
              Receive fieldwork documentation, traditional technique archives, and monthly limited craft collection releases.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center w-full max-w-md h-[46px] rounded-[50px] border border-border-neutral bg-surface-crisp px-space-sm transition-colors focus-within:border-accent-terracotta"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to subscribe..."
                required
                className="flex-1 bg-transparent px-space-sm text-body-spec text-text-primary placeholder:text-text-secondary/60 focus:outline-none text-[13px]"
              />
              <button
                type="submit"
                className="font-label-action text-label-action uppercase tracking-[0.15em] bg-text-primary hover:bg-accent-terracotta text-surface-crisp px-4 py-2 rounded-[50px] transition-colors shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <span className="text-[12px] text-accent-terracotta mt-2 font-body-spec flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Successfully subscribed to the heritage newsletter!
              </span>
            )}
          </div>

          {/* Column 3: Principles & Connect */}
          <div className="md:col-span-3 flex flex-col justify-between md:pl-space-md pt-space-md md:pt-0">
            <div className="flex flex-col">
              <span className="font-label-action text-label-action uppercase tracking-[0.18em] text-text-primary font-semibold mb-space-sm">
                Principles &amp; Connect
              </span>
              <nav className="flex flex-wrap items-center font-body-spec text-body-spec text-text-secondary leading-loose">
                <Link to="/crafts" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-charter">
                  Charter
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/artisans" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-artisans">
                  Partner Artisans
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/crafts" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-conservation">
                  Preservation
                </Link>
                <span className="mx-2 text-border-neutral opacity-60 font-light select-none">|</span>
                <Link to="/contact" className="hover:text-accent-terracotta transition-colors" data-path="craftroots-contact">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="pt-space-md">
              <span className="font-spec-code text-[11px] uppercase tracking-[0.1em] text-text-secondary block">
                Documented in accordance with ethnographic heritage standards
              </span>
            </div>
          </div>
        </div>

        {/* Coordinates & Copyright Footer */}
        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between text-body-spec text-text-secondary text-[12px]">
          <div>
            © 2024 CraftRoots. All rights reserved. Living heritage and intangible craftsmanship archive.
          </div>
          <div className="flex items-center gap-space-md mt-space-xs sm:mt-0 font-spec-code text-spec-code text-[11px] text-text-secondary">
            <span>Longitude: 105.9142° E</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Latitude: 20.9782° N</span>
            <span className="text-border-neutral opacity-60">|</span>
            <span>Standard: Vietnam Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
