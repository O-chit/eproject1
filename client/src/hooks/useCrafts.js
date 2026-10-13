import { useState, useEffect, useCallback } from 'react';
import { getCrafts } from '../api/crafts';

/**
 * useCrafts: Quản lý toàn bộ vòng đời lấy dữ liệu tác phẩm thủ công
 * @param {Object} params - { q, category, region, material, sort, page, limit }
 * @returns {Object} { crafts, loading, error, pagination, refetch }
 */
export function useCrafts(params = {}) {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  // Stringify params để làm dependency ổn định cho useEffect
  const paramsKey = JSON.stringify(params);

  const fetchCrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCrafts(params);
      setCrafts(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('[useCrafts] Lỗi nạp dữ liệu tác phẩm:', err);
      setError(err.message || 'Không thể tải danh sách tác phẩm');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    fetchCrafts();
  }, [fetchCrafts]);

  return {
    crafts,
    loading,
    error,
    pagination,
    refetch: fetchCrafts,
  };
}

export default useCrafts;
