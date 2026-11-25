import React from 'react';
import { useBooks } from '../../context/BookContext';
import { useBookStats } from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Halaman Statistik Koleksi Buku menggunakan custom hook useBookStats.
 */
const Stats = () => {
  const { books } = useBooks();
  const stats = useBookStats(books);

  return (
    <div className="stats-page">
      <h2 className="stats-heading">Statistik Koleksi Buku</h2>
      <p className="stats-subtitle">
        Ringkasan data buku pribadi Anda berdasarkan status bacaan saat ini.
      </p>

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Buku</h3>
          <p className="stat-number">{stats.total}</p>
          <span className="stat-desc">Seluruh koleksi tercatat</span>
        </div>

        <div className="stat-card milik">
          <h3>Sudah Dimiliki</h3>
          <p className="stat-number">{stats.milik}</p>
          <span className="stat-desc">{stats.persentaseMilik}% dari total buku</span>
        </div>

        <div className="stat-card baca">
          <h3>Sedang Dibaca</h3>
          <p className="stat-number">{stats.baca}</p>
          <span className="stat-desc">{stats.persentaseBaca}% dari total buku</span>
        </div>

        <div className="stat-card beli">
          <h3>Ingin Dibeli</h3>
          <p className="stat-number">{stats.beli}</p>
          <span className="stat-desc">{stats.persentaseBeli}% dari total buku</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;