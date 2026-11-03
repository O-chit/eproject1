import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PrivateRoute - Protects routes that require authentication
 * If unauthenticated, redirect to login page.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-canvas-linen flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-spec-code text-[12px] text-text-secondary uppercase tracking-widest">
          CHECKING AUTHENTICATION SESSION...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
