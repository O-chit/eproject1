import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PublicOnlyRoute - Only for unauthenticated users (Login, Register)
 * If already logged in, redirects to the destination or home page.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          Verifying session...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return children;
}
