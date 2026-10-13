import { useState, useEffect } from 'react';

/**
 * useLocalStorage: Quản lý đọc/ghi đồng bộ dữ liệu vào localStorage
 * @param {string} key - Tên key trong localStorage
 * @param {*} initialValue - Giá trị khởi tạo mặc định
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Lỗi khi đọc localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Lỗi khi ghi localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
