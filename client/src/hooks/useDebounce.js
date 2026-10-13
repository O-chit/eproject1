import { useState, useEffect } from 'react';

/**
 * useDebounce: Làm trễ giá trị nhập (mặc định 350ms)
 * Giúp tối ưu hóa trải nghiệm tìm kiếm, tránh bắn request API liên tục trên mỗi phím gõ
 * @param {*} value - Giá trị cần debounce
 * @param {number} delay - Thời gian trễ tính bằng mili-giây (mặc định 350ms)
 * @returns {*} Giá trị đã được làm trễ
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
