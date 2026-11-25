import { useMemo } from 'react';

/**
 * Custom Hook untuk menghitung statistik buku berdasarkan daftar buku saat ini.
 * @param {Array} books - Daftar objek buku
 */
export function useBookStats(books = []) {
  const stats = useMemo(() => {
    const total = books.length;
    const milik = books.filter((b) => b.status === 'milik').length;
    const baca = books.filter((b) => b.status === 'baca').length;
    const beli = books.filter((b) => b.status === 'beli').length;

    const getPercentage = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return {
      total,
      milik,
      baca,
      beli,
      persentaseMilik: getPercentage(milik),
      persentaseBaca: getPercentage(baca),
      persentaseBeli: getPercentage(beli),
    };
  }, [books]);

  return stats;
}