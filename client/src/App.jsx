import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavouritesProvider } from './context/FavouritesContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';

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

export default function App() {
  return (
    <AuthProvider>
      <FavouritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="crafts" element={<DirectoryPage />} />
              <Route path="crafts/:id" element={<CraftDetailPage />} />
              <Route path="artisans" element={<ArtisansPage />} />
              <Route path="artisans/:id" element={<ArtisanDetailPage />} />
              <Route path="regions" element={<RegionsPage />} />
              <Route path="seasonal" element={<SeasonalPage />} />
              <Route path="favourites" element={<FavouritesPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavouritesProvider>
    </AuthProvider>
  );
}
