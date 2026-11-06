import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const DirectoryPage = lazy(() => import('./pages/DirectoryPage'));
const CraftDetailPage = lazy(() => import('./pages/CraftDetailPage'));
const ArtisansPage = lazy(() => import('./pages/ArtisansPage'));
const ArtisanDetailPage = lazy(() => import('./pages/ArtisanDetailPage'));
const RegionsPage = lazy(() => import('./pages/RegionsPage'));
const SeasonalPage = lazy(() => import('./pages/SeasonalPage'));
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin CMS Portal (SEC 6.3 RBAC)
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
const AdminCraftsPage = lazy(() => import('./pages/admin/AdminCraftsPage'));
const AdminCraftEditPage = lazy(() => import('./pages/admin/AdminCraftEditPage'));
const AdminArtisansPage = lazy(() => import('./pages/admin/AdminArtisansPage'));
const AdminArtisanEditPage = lazy(() => import('./pages/admin/AdminArtisanEditPage'));

// Code-splitting: mỗi trang được tải riêng khi truy cập (giảm kích thước bundle ban đầu)
function PageLoader() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent-terracotta border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavouritesProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* 1. Public Routes: Login & Register (Guest only) */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            {/* 2. Main Portal: Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="crafts" element={<DirectoryPage />} />
              <Route path="crafts/:id" element={<CraftDetailPage />} />
              <Route path="artisans" element={<ArtisansPage />} />
              <Route path="artisans/:id" element={<ArtisanDetailPage />} />
              <Route path="regions" element={<RegionsPage />} />
              <Route path="seasonal" element={<SeasonalPage />} />
              <Route path="favourites" element={<FavouritesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* 3. Heritage Admin CMS (SEC 6.3 RBAC) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/crafts" replace />} />
              <Route path="crafts" element={<AdminCraftsPage />} />
              <Route path="crafts/new" element={<AdminCraftEditPage />} />
              <Route path="crafts/:id/edit" element={<AdminCraftEditPage />} />
              <Route path="artisans" element={<AdminArtisansPage />} />
              <Route path="artisans/new" element={<AdminArtisanEditPage />} />
              <Route path="artisans/:id/edit" element={<AdminArtisanEditPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </FavouritesProvider>
    </AuthProvider>
  );
}
