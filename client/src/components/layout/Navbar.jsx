import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavourites } from '../../context/FavouritesContext';
import api from '../../services/api';

const SEASON_OPTIONS = [
  {
    key: 'spring',
    name: 'Spring',
    icon: '🌸',
    title: 'Verdant Awakening',
    subtitle: 'Mulberry silk & crackle-glaze ceramics for spring',
    tag: 'Spring Bloom',
    color: '#059669',
  },
  {
    key: 'summer',
    name: 'Summer',
    icon: '☀️',
    title: 'Natural Fibers & Terracotta',
    subtitle: 'Cool ash-glazed stoneware & bamboo rattan weaving',
    tag: 'Summer Cool',
    color: '#0284c7',
  },
  {
    key: 'autumn',
    name: 'Autumn',
    icon: '🍂',
    title: 'Mellow Earth & Rustic Stoneware',
    subtitle: 'Sandstone pottery & lotus-scented tea',
    tag: 'Autumn Calm',
    color: '#d97706',
  },
  {
    key: 'winter',
    name: 'Winter',
    icon: '❄️',
    title: 'Warmth of Kiln Fires',
    subtitle: 'Flame-treated bronze & deep stone carving',
    tag: 'Winter Warm',
    color: '#6366f1',
  },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalFavourites } = useFavourites();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ crafts: 0, artisans: 0, regions: 0, categories: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentSeason = searchParams.get('season')?.toLowerCase();
  const isSeasonalActive = location.pathname === '/seasonal';
  const [seasonalDropdownOpen, setSeasonalDropdownOpen] = useState(isSeasonalActive);

  // Open dropdown if currently on seasonal page
  useEffect(() => {
    if (location.pathname === '/seasonal') {
      setSeasonalDropdownOpen(true);
    }
  }, [location.pathname]);

  // Load stats from backend
  useEffect(() => {
    api.getStats()
      .then((data) => {
        if (data && typeof data.crafts === 'number') {
          setStats({
            crafts: data.crafts,
            artisans: data.artisans,
            regions: data.regions,
            categories: data.categories || 0,
          });
        }
      })
      .catch(() => { });
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/crafts?q=${encodeURIComponent(searchQuery.trim())}`);
      setDrawerOpen(false);
    }
  };

  const closeMenu = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-canvas-linen/95 backdrop-blur-md border-b border-border-neutral">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-margin flex items-center justify-between gap-3 sm:gap-6 relative">

          {/* Left Cluster: Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              id="craft-menu-toggle"
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-text-primary hover:text-accent-terracotta transition-colors rounded-none focus:outline-none bg-transparent cursor-pointer"
              aria-label="Open navigation menu"
              title="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <Link to="/" data-path="craftroots-home" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-[#B86B35] flex items-center justify-center bg-[#F9F8F6] text-[#B86B35] font-serif font-bold text-sm tracking-widest shrink-0">
                CR
              </div>
              <div className="flex flex-col">
                <span className="font-['Montserrat'] text-[13px] uppercase tracking-[0.25em] text-[#1C1B1A] font-semibold group-hover:text-[#B86B35] transition-colors leading-tight">
                  CraftRoots
                </span>
                <span className="font-['Inter'] text-[9px] uppercase tracking-[0.18em] text-[#5A5854] leading-none mt-0.5">
                  Living Heritage
                </span>
              </div>
            </Link>
          </div>

          {/* Center Cluster: Desktop Search Bar */}
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-text-secondary text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search heritage, artisans, villages..."
                className="w-full h-[40px] pl-10 pr-12 bg-surface-crisp border border-border-neutral rounded-none text-body-spec font-body-spec text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-terracotta transition-colors text-[13px]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 font-spec-code text-[10px] uppercase tracking-wider text-text-secondary/60 hover:text-accent-terracotta select-none cursor-pointer"
                >
                  CLEAR
                </button>
              ) : (
                <span className="absolute right-3 font-spec-code text-[10px] uppercase tracking-wider text-text-secondary/60 select-none">
                  ESC
                </span>
              )}
            </form>
          </div>

          {/* Right Cluster: Saved & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              to="/favourites"
              data-path="craftroots-saved"
              className="text-on-surface-variant hover:text-accent-terracotta transition-colors font-label-action text-label-action tracking-[0.15em] uppercase flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[16px] text-accent-terracotta">
                bookmark
              </span>
              <span className="hidden sm:inline">Saved ({totalFavourites})</span>
            </Link>

            <span className="text-border-neutral opacity-60 font-light select-none hidden sm:inline">
              |
            </span>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <Link
                    to="/admin/crafts"
                    id="navbar-admin-cms-btn"
                    className="h-9 px-2.5 border border-accent-terracotta bg-surface-crisp hover:bg-accent-terracotta hover:text-white text-accent-terracotta transition-all flex items-center gap-1.5 text-[11px] font-spec-code uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
                    title="Access Heritage Management & Editorial CMS"
                  >
                    <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                    <span className="hidden md:inline">{user?.role === 'admin' ? 'CMS Admin' : 'CMS Editor'}</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  id="navbar-user-profile-btn"
                  className="h-9 px-3 border border-border-neutral bg-surface-crisp hover:border-accent-terracotta hover:bg-surface-subtle transition-all flex items-center gap-2 text-[12px] text-accent-terracotta font-medium group cursor-pointer shadow-xs"
                  title={`User profile: ${user?.fullName || user?.email}`}
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                    account_circle
                  </span>
                  <span className="hidden sm:inline max-w-[120px] truncate text-text-primary group-hover:text-accent-terracotta transition-colors">
                    {user?.fullName?.split(' ')[0] || user?.fullName || 'Profile'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden md:flex w-9 h-9 border border-border-neutral bg-surface-crisp items-center justify-center text-text-secondary hover:text-error hover:border-error transition-colors cursor-pointer"
                  title="Log out"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-none border border-border-neutral bg-surface-crisp flex items-center justify-center text-text-primary hover:border-accent-terracotta transition-colors cursor-pointer"
                title="Sign in"
              >
                <span className="material-symbols-outlined text-text-primary text-[20px]">
                  person
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-border-neutral/60 bg-canvas-linen">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-text-secondary text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crafts, artisans, villages..."
              className="w-full h-[36px] pl-9 pr-3 bg-surface-crisp border border-border-neutral rounded-none text-body-spec font-body-spec text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-terracotta text-[12px]"
            />
          </form>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-[134px] md:h-20"></div>

      {/* FULL HEIGHT VERTICAL DRAWER */}
      <div
        id="craft-vertical-sidebar-drawer"
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        style={{ height: '100vh', maxHeight: '100vh', width: '100vw' }}
      >
        {/* Backdrop Overlay */}
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm transition-opacity cursor-pointer z-40"
          aria-label="Close navigation"
        ></div>

        {/* Vertical Drawer Aside */}
        <aside
          className={`relative w-80 md:w-96 max-w-[85vw] h-screen min-h-screen max-h-screen bg-canvas-linen border-r border-border-neutral shadow-2xl z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}
        >
          <div className="p-6">

            {/* Drawer Header with Logo & Close Button */}
            <div className="flex items-center justify-between pb-5 border-b border-border-neutral mb-6">
              <Link
                to="/"
                onClick={closeMenu}
                data-path="craftroots-home"
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full border border-accent-terracotta flex items-center justify-center bg-surface-subtle text-accent-terracotta font-serif font-bold text-sm tracking-widest shrink-0">
                  CR
                </div>
                <div className="flex flex-col">
                  <span className="font-['Montserrat'] text-[13px] uppercase tracking-[0.25em] text-text-primary font-semibold leading-tight group-hover:text-accent-terracotta transition-colors">
                    CraftRoots
                  </span>
                  <span className="font-['Inter'] text-[9px] uppercase tracking-[0.18em] text-text-secondary leading-none mt-0.5">
                    Living Heritage
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="w-8 h-8 rounded-none border border-border-neutral bg-surface-crisp flex items-center justify-center text-text-secondary hover:text-accent-terracotta hover:border-accent-terracotta transition-colors focus:outline-none cursor-pointer"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Admin CMS Portal banner if Admin / Editor */}
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'editor') && (
              <div className="mb-6 p-3.5 bg-surface-crisp border border-accent-terracotta flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-accent-terracotta">admin_panel_settings</span>
                  <div>
                    <div className="font-['Montserrat'] font-semibold text-[12px] text-text-primary">
                      {user?.role === 'admin' ? 'System Administration' : 'Heritage Editorial'}
                    </div>
                    <div className="font-spec-code text-[10px] text-accent-terracotta">SEC 6.3 Admin CMS Portal</div>
                  </div>
                </div>
                <Link
                  to="/admin/crafts"
                  onClick={closeMenu}
                  className="px-2.5 py-1 bg-accent-terracotta text-white font-spec-code text-[10px] uppercase font-semibold hover:bg-[#8E4A16] transition-colors"
                >
                  Enter CMS →
                </Link>
              </div>
            )}

            {/* Drawer Quick Search */}
            <div className="mb-8">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-text-secondary text-[18px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search heritage, artisans..."
                  className="w-full bg-surface-crisp border border-border-neutral focus:border-accent-terracotta pl-10 pr-3 py-2.5 font-body-spec text-[13px] text-text-primary placeholder:text-text-secondary/60 rounded-none outline-none transition-colors"
                />
              </form>
            </div>

            {/* HERITAGE NAVIGATION */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold">
                  HERITAGE NAVIGATION
                </span>
                <span className="w-12 h-px bg-border-neutral"></span>
              </div>

              <nav className="flex flex-col space-y-3">
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-accent-terracotta">
                      cottage
                    </span>
                    Home (Overview)
                  </span>
                  <span className="font-spec-code text-[11px] text-accent-terracotta uppercase font-medium">
                    01
                  </span>
                </NavLink>

                <NavLink
                  to="/crafts"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-text-secondary">
                      inventory_2
                    </span>
                    Craft Heritage Archive
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase">
                    {stats.crafts} Items
                  </span>
                </NavLink>

                <NavLink
                  to="/artisans"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-text-secondary">
                      badge
                    </span>
                    Master Artisan Profiles
                  </span>
                  <span className="font-spec-code text-[11px] text-accent-terracotta uppercase tracking-wider">
                    {stats.artisans} Masters
                  </span>
                </NavLink>

                <NavLink
                  to="/regions"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-text-secondary">
                      map
                    </span>
                    Cultural Craft Map
                  </span>
                  <span className="font-spec-code text-[11px] text-text-secondary uppercase">
                    {stats.regions} Regions
                  </span>
                </NavLink>

                {/* SEASONAL COLLECTIONS DROPDOWN (SPRING - SUMMER - AUTUMN - WINTER) */}
                <div
                  className={`border transition-all duration-200 overflow-hidden ${
                    seasonalDropdownOpen
                      ? 'border-accent-terracotta/40 bg-surface-subtle/50 shadow-xs'
                      : isSeasonalActive
                        ? 'border-accent-terracotta/50 bg-surface-subtle/60'
                        : 'border-border-neutral/70 bg-surface-subtle/20 hover:border-border-neutral'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSeasonalDropdownOpen((prev) => !prev)}
                    className="w-full px-3.5 py-3 text-left flex items-center justify-between group cursor-pointer transition-colors"
                    aria-expanded={seasonalDropdownOpen}
                    title="Toggle 4-season collection list"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-colors ${
                          seasonalDropdownOpen || isSeasonalActive
                            ? 'text-accent-terracotta'
                            : 'text-text-secondary group-hover:text-accent-terracotta'
                        }`}
                      >
                        filter_vintage
                      </span>
                      <span className="font-title-card text-[15px] text-text-primary group-hover:text-accent-terracotta transition-colors font-medium">
                        Seasonal Collections
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-spec-code text-[10px] uppercase tracking-wider text-accent-terracotta border border-accent-terracotta/60 bg-accent-terracotta/10 px-1.5 py-0.5 font-medium">
                        4 SEASONS
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                          seasonalDropdownOpen
                            ? 'rotate-180 text-accent-terracotta'
                            : 'text-text-secondary/70 group-hover:text-text-primary'
                        }`}
                      >
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* 4 Seasons: Spring, Summer, Autumn, Winter */}
                  {seasonalDropdownOpen && (
                    <div className="border-t border-border-neutral/60 bg-surface-crisp px-2.5 py-2.5 space-y-1.5">
                      <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between text-[11px] font-spec-code uppercase tracking-wider text-text-secondary/70">
                        <span>Select Solar Term &amp; Season:</span>
                        <span className="text-[10px] text-accent-terracotta font-semibold">2026</span>
                      </div>

                      {SEASON_OPTIONS.map((season) => {
                        const isSelected =
                          isSeasonalActive &&
                          (currentSeason === season.key || (!currentSeason && season.key === 'autumn'));

                        return (
                          <button
                            key={season.key}
                            type="button"
                            onClick={() => {
                              navigate(`/seasonal?season=${season.key}`);
                              closeMenu();
                            }}
                            className={`w-full text-left p-2.5 flex items-center justify-between transition-all group/item cursor-pointer border ${
                              isSelected
                                ? 'bg-surface-subtle/80 border-accent-terracotta shadow-xs'
                                : 'border-transparent hover:border-border-neutral hover:bg-surface-subtle/40'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-8 h-8 flex items-center justify-center shrink-0 border text-[15px]"
                                style={{
                                  backgroundColor: `${season.color}14`,
                                  borderColor: `${season.color}35`,
                                  color: season.color,
                                }}
                              >
                                {season.icon}
                              </span>
                              <div className="flex flex-col min-w-0">
                                <span className="font-title-card text-[14px] font-medium text-text-primary group-hover/item:text-accent-terracotta transition-colors flex items-center gap-1.5 truncate">
                                  {season.name}
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta inline-block"></span>
                                  )}
                                </span>
                                <span className="font-spec-code text-[11px] text-text-secondary truncate">
                                  {season.title}
                                </span>
                              </div>
                            </div>

                            <span
                              className="font-spec-code text-[10px] uppercase tracking-wider px-1.5 py-0.5 border shrink-0 ml-2"
                              style={{
                                color: season.color,
                                borderColor: `${season.color}40`,
                                backgroundColor: `${season.color}10`,
                              }}
                            >
                              {season.tag}
                            </span>
                          </button>
                        );
                      })}

                      {/* Explore All Button */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/seasonal');
                          closeMenu();
                        }}
                        className="w-full text-center py-2 text-[11px] font-spec-code uppercase tracking-[0.15em] text-accent-terracotta hover:text-primary hover:underline transition-colors block border-t border-border-neutral/30 mt-1 cursor-pointer"
                      >
                        Explore Full Collection →
                      </button>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/favourites"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-accent-terracotta">
                      bookmark
                    </span>
                    Saved Crafts &amp; Favourites
                  </span>
                  <span className="font-spec-code text-[11px] text-accent-terracotta font-semibold">
                    {String(totalFavourites).padStart(2, '0')}
                  </span>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `px-3.5 py-3 text-text-primary hover:text-accent-terracotta hover:bg-surface-subtle font-title-card text-[15px] transition-all flex items-center justify-between border-l-2 ${isActive
                      ? 'border-accent-terracotta bg-surface-subtle/80 text-accent-terracotta font-medium shadow-xs'
                      : 'border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-text-secondary">
                      calendar_month
                    </span>
                    Contact &amp; Studio Booking
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-text-secondary">
                    arrow_outward
                  </span>
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Drawer Footer: LIVING HERITAGE 1924 INITIATIVE */}
          <div className="p-6 border-t border-border-neutral bg-surface-subtle">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-terracotta inline-block"></span>
              <span className="font-spec-code text-[11px] uppercase tracking-[0.15em] text-text-primary font-semibold">
                LIVING HERITAGE 1924 INITIATIVE
              </span>
            </div>
            <p className="font-body-spec text-[12px] text-text-secondary leading-relaxed mb-4">
              Documenting and preserving {stats.regions > 0 ? stats.regions : '—'} indigenous cultural regions and traditional Vietnamese crafting techniques.
            </p>
            <div className="pt-3 border-t border-border-neutral space-y-1.5 font-spec-code text-[11px] text-text-secondary">
              <div className="flex items-center justify-between">
                <span>Inquiry Hotline:</span>
                <a
                  href="tel:0988246810"
                  className="text-text-primary font-medium hover:text-accent-terracotta transition-colors"
                >
                  (+84) 988.246.810
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Email:</span>
                <a
                  href="mailto:lienhe@craftroots.vn"
                  className="text-accent-terracotta hover:underline"
                >
                  lienhe@craftroots.vn
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
