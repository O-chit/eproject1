import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getFavouritesApi,
  addFavouriteApi,
  removeFavouriteApi,
  syncFavouritesApi,
} from '../api/favourites';

const FavouritesContext = createContext(null);
const GUEST_FAVS_KEY = 'craftroots_guest_favs';

export function FavouritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Đọc danh sách yêu thích ban đầu
  useEffect(() => {
    const loadFavourites = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // 1. Nếu đã đăng nhập: Kiểm tra xem có yêu thích của khách cần sync không
          const rawGuestFavs = localStorage.getItem(GUEST_FAVS_KEY);
          if (rawGuestFavs) {
            try {
              const guestIds = JSON.parse(rawGuestFavs);
              if (Array.isArray(guestIds) && guestIds.length > 0) {
                await syncFavouritesApi(guestIds);
                localStorage.removeItem(GUEST_FAVS_KEY);
              }
            } catch (err) {
              console.warn('[FavouritesContext] Lỗi đồng bộ yêu thích khách:', err);
            }
          }

          // 2. Tải danh sách yêu thích từ máy chủ
          try {
            const res = await getFavouritesApi();
            const serverFavs = (res.data || []).map((item) => item.craft_id || item.id || item);
            setFavourites(serverFavs);
          } catch (err) {
            console.warn('[FavouritesContext] Máy chủ chưa sẵn sàng, giữ state hiện tại');
          }
        } else {
          // Chưa đăng nhập: Đọc từ localStorage khách
          const raw = localStorage.getItem(GUEST_FAVS_KEY);
          if (raw) {
            setFavourites(JSON.parse(raw));
          } else {
            setFavourites([]);
          }
        }
      } catch (err) {
        console.error('[FavouritesContext] Lỗi nạp yêu thích:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavourites();
  }, [isAuthenticated]);

  // Kiểm tra một tác phẩm có trong danh sách yêu thích không
  const isFav = useCallback(
    (craftId) => {
      const idNum = Number(craftId);
      return favourites.some((id) => Number(id) === idNum);
    },
    [favourites]
  );

  // Bật/tắt trạng thái yêu thích
  const toggleFav = useCallback(
    async (craftId) => {
      const idNum = Number(craftId);
      const isCurrentlyFav = isFav(idNum);

      // Cập nhật Optimistic UI trước
      let nextFavs;
      if (isCurrentlyFav) {
        nextFavs = favourites.filter((id) => Number(id) !== idNum);
      } else {
        nextFavs = [...favourites, idNum];
      }
      setFavourites(nextFavs);

      // Đồng bộ theo trạng thái đăng nhập
      if (isAuthenticated) {
        try {
          if (isCurrentlyFav) {
            await removeFavouriteApi(idNum);
          } else {
            await addFavouriteApi(idNum);
          }
        } catch (err) {
          console.warn('[FavouritesContext] Không thể lưu yêu thích lên server:', err);
        }
      } else {
        // Lưu vào localStorage của khách
        try {
          localStorage.setItem(GUEST_FAVS_KEY, JSON.stringify(nextFavs));
        } catch (err) {
          console.warn('Không thể lưu yêu thích vào localStorage:', err);
        }
      }
    },
    [favourites, isFav, isAuthenticated]
  );

  const value = {
    favourites,
    isFav,
    toggleFav,
    loading,
    totalFavourites: favourites.length,
  };

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites phải được sử dụng bên trong FavouritesProvider');
  }
  return context;
}

export default FavouritesContext;
