import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';

import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import CraftDetailPage from './pages/CraftDetailPage';
import ArtisansPage from './pages/ArtisansPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import RegionsPage from './pages/RegionsPage';
import SeasonalPage from './pages/SeasonalPage';
import FavouritesPage from './pages/FavouritesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin CMS Portal (SEC 6.3 RBAC)
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminCraftsPage from './pages/admin/AdminCraftsPage';
import AdminCraftEditPage from './pages/admin/AdminCraftEditPage';
import AdminArtisansPage from './pages/admin/AdminArtisansPage';
import AdminArtisanEditPage from './pages/admin/AdminArtisanEditPage';

export default function App() {
  return (
    <AuthProvider>
      <FavouritesProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </FavouritesProvider>
    </AuthProvider>
  );
}
