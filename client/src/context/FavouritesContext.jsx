import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { useAgentLiveSync } from '../services/liveAgentSync';

const FavouritesContext = createContext(null);
const GUEST_FAVS_KEY = 'craftroots_guest_favs';

export function FavouritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial read or refresh saved crafts
  const refreshFavourites = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // 1. If logged in: Check if there are guest saved items that need syncing
        const rawGuestFavs = localStorage.getItem(GUEST_FAVS_KEY) || localStorage.getItem('craftroots_favourites');
        if (rawGuestFavs) {
          try {
            const guestItems = JSON.parse(rawGuestFavs);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              const guestIds = guestItems.map((item) => Number(item.id || item)).filter(Boolean);
              if (guestIds.length > 0) {
                await api.syncFavourites(guestIds);
              }
              localStorage.removeItem(GUEST_FAVS_KEY);
              localStorage.removeItem('craftroots_favourites');
            }
          } catch (err) {
            console.warn('[FavouritesContext] Error syncing guest saved items:', err);
          }
        }

        // 2. Load saved items from server
        try {
          const res = await api.getFavourites();
          const serverFavs = (Array.isArray(res) ? res : res.data || []).map(
            (item) => item.craft_id || item.craftId || item.id || item
          );
          setFavourites(serverFavs);
        } catch (err) {
          console.warn('[FavouritesContext] Server not ready, keeping current state');
        }
      } else {
        // Not logged in: Read from guest localStorage
        const raw = localStorage.getItem(GUEST_FAVS_KEY) || localStorage.getItem('craftroots_favourites');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setFavourites(parsed.map((item) => Number(item.id || item)).filter(Boolean));
          } else {
            setFavourites([]);
          }
        } else {
          setFavourites([]);
        }
      }
    } catch (err) {
      console.error('[FavouritesContext] Error loading saved items:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavourites();
  }, [refreshFavourites]);

  useEffect(() => {
    const handleSync = () => {
      refreshFavourites();
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('craftroots_favs_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('craftroots_favs_updated', handleSync);
    };
  }, [refreshFavourites]);

  // Update saved state automatically when AI Agent runs add_favourite
  useAgentLiveSync(({ tool, data }) => {
    if (tool === 'add_favourite') {
      const targetId = Number(data?.id || data?.craftId);
      if (targetId) {
        setFavourites((prev) => [...new Set([...prev, targetId])]);
      }
      refreshFavourites();
    }
  }, [refreshFavourites]);

  // Check if a craft is in saved list
  const isFav = useCallback(
    (craftId) => {
      const idNum = Number(craftId);
      return favourites.some((id) => Number(id) === idNum);
    },
    [favourites]
  );

  // Toggle favorite status
  const toggleFav = useCallback(
    async (craftId) => {
      const idNum = Number(craftId);
      const isCurrentlyFav = isFav(idNum);

      // Optimistic UI update
      let nextFavs;
      if (isCurrentlyFav) {
        nextFavs = favourites.filter((id) => Number(id) !== idNum);
      } else {
        nextFavs = [...favourites, idNum];
      }
      setFavourites(nextFavs);

      // Synchronize with server if logged in
      if (isAuthenticated) {
        try {
          if (isCurrentlyFav) {
            await api.removeFavourite(idNum);
          } else {
            await api.addFavourite(idNum);
          }
        } catch (err) {
          console.warn('[FavouritesContext] Unable to save favourite on server:', err);
        }
      } else {
        try {
          localStorage.setItem(GUEST_FAVS_KEY, JSON.stringify(nextFavs));
          localStorage.setItem('craftroots_favourites', JSON.stringify(nextFavs));
        } catch (err) {
          console.warn('Unable to save favourite to localStorage:', err);
        }
      }
      window.dispatchEvent(new Event('craftroots_favs_updated'));
    },
    [favourites, isFav, isAuthenticated]
  );

  const clearAll = useCallback(async () => {
    setFavourites([]);
    if (isAuthenticated) {
      try {
        await api.clearFavourites();
      } catch (err) {
        console.warn('[FavouritesContext] Unable to clear all favourites on server:', err);
      }
    }
    try {
      localStorage.removeItem(GUEST_FAVS_KEY);
      localStorage.removeItem('craftroots_favourites');
      localStorage.removeItem('craftroots_favourites_archive');
      window.dispatchEvent(new Event('storage'));
    } catch {
      //
    }
  }, [isAuthenticated]);

  // Artisan favorite state
  const [artisanFavs, setArtisanFavs] = useState(() => {
    try {
      const stored = localStorage.getItem('craftroots_artisan_favs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const isArtisanFavourited = useCallback(
    (artisanId) => artisanFavs.includes(Number(artisanId)),
    [artisanFavs]
  );

  const toggleArtisanFavourite = useCallback((artisanId) => {
    const idNum = Number(artisanId);
    setArtisanFavs((prev) => {
      const next = prev.includes(idNum) ? prev.filter((id) => id !== idNum) : [...prev, idNum];
      try {
        localStorage.setItem('craftroots_artisan_favs', JSON.stringify(next));
      } catch {
        //
      }
      return next;
    });
  }, []);

  const value = {
    favourites,
    isFav,
    toggleFav,
    clearAll,
    refreshFavourites,
    isArtisanFavourited,
    toggleArtisanFavourite,
    loading,
    totalFavourites: favourites.length,
  };

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}

export default FavouritesContext;
