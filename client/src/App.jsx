import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import CraftDetailPage from './pages/CraftDetailPage';
import ArtisansPage from './pages/ArtisansPage';
import RegionsPage from './pages/RegionsPage';
import SeasonalPage from './pages/SeasonalPage';
import FavouritesPage from './pages/FavouritesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="crafts" element={<DirectoryPage />} />
          <Route path="crafts/:id" element={<CraftDetailPage />} />
          <Route path="artisans" element={<ArtisansPage />} />
          <Route path="artisans/:id" element={<ArtisansPage />} />
          <Route path="regions" element={<RegionsPage />} />
          <Route path="seasonal" element={<SeasonalPage />} />
          <Route path="favourites" element={<FavouritesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
