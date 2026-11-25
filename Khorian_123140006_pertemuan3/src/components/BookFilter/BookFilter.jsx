import React from 'react';
import PropTypes from 'prop-types';
import './BookFilter.css';

/**
 * Komponen Reusable untuk memfilter buku berdasarkan status dan kata kunci pencarian.
 */
const BookFilter = ({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const filterOptions = [
    { value: 'semua', label: 'Semua Buku' },
    { value: 'milik', label: 'Dimiliki' },
    { value: 'baca', label: 'Sedang Dibaca' },
    { value: 'beli', label: 'Ingin Dibeli' },
  ];

  return (
    <div className="book-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Cari judul buku atau nama penulis..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cari buku"
        />
      </div>

      <div className="filter-tabs" role="group" aria-label="Filter status buku">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-btn ${filterStatus === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

BookFilter.propTypes = {
  filterStatus: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default BookFilter;