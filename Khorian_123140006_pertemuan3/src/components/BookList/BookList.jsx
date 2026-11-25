import React from 'react';
import PropTypes from 'prop-types';
import './BookList.css';

/**
 * Komponen Reusable untuk merender daftar kartu buku beserta aksi Edit & Hapus.
 */
const BookList = ({ books, onEdit, onDelete }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case 'milik':
        return { text: 'Dimiliki', className: 'badge-milik' };
      case 'baca':
        return { text: 'Sedang Dibaca', className: 'badge-baca' };
      case 'beli':
        return { text: 'Ingin Dibeli', className: 'badge-beli' };
      default:
        return { text: status, className: '' };
    }
  };

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>Belum ada buku yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => {
        const badge = getStatusLabel(book.status);
        return (
          <div key={book.id} className="book-card">
            <div className="book-info">
              <span className={`status-badge ${badge.className}`}>
                {badge.text}
              </span>
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">Penulis: {book.author}</p>
            </div>
            <div className="book-actions">
              <button
                type="button"
                className="btn-edit"
                onClick={() => onEdit(book)}
                aria-label={`Edit ${book.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(book.id)}
                aria-label={`Hapus ${book.title}`}
              >
                Hapus
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookList;