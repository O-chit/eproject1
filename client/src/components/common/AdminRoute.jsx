import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminRoute - Protects CMS Admin routes (SEC 6.3 RBAC)
 * Only allows users with 'admin' or 'editor' role to access.
 */
export default function AdminRoute({ children, requireAdminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          VERIFYING ADMINISTRATOR PRIVILEGES...
        </p>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role;
  const isAuthorized = requireAdminOnly ? role === 'admin' : role === 'admin' || role === 'editor';

  // 2. Logged in but insufficient permissions -> Show 403 Forbidden
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-surface-crisp border border-border-neutral p-8 shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-surface-subtle border border-accent-terracotta flex items-center justify-center text-accent-terracotta">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <span className="font-spec-code text-[11px] uppercase tracking-[0.2em] text-accent-terracotta font-semibold block mb-2">
            403 · ACCESS RESTRICTED
          </span>
          <h1 className="font-serif text-2xl font-bold text-text-primary mb-3">
            Restricted Administration Area
          </h1>
          <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-6">
            Your account (<strong className="text-text-primary">{user?.email}</strong>) currently has the role <em>{role || 'user'}</em> and does not have permission to access the CraftRoots Heritage Administration &amp; Editorial system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 bg-accent-terracotta hover:bg-[#8E4A16] text-white font-label-action text-[11px] uppercase tracking-wider font-semibold transition-colors"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
