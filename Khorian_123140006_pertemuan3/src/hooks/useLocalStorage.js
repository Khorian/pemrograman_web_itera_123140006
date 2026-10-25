import { useState, useEffect } from 'react';

/**
 * Custom Hook untuk menyinkronkan state React dengan localStorage browser.
 * @param {string} key - Kunci penyimpanan di localStorage
 * @param {any} initialValue - Nilai awal jika data belum ada di localStorage
 */
export function useLocalStorage(key, initialValue) {
  // Inisialisasi state dengan fungsi agar hanya dieksekusi sekali saat pertama render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error membaca localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect untuk menyimpan perubahan state ke localStorage secara otomatis
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error menyimpan ke localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}