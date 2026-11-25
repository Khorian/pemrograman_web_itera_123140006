import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

/**
 * Komponen Form Reusable untuk menambah atau mengedit data buku.
 * Dilengkapi validasi input wajib isi dan feedback visual error.
 */
const BookForm = ({ onSubmit, editingBook, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('milik');
  const [errors, setErrors] = useState({});

  // Mengisi form secara otomatis ketika pengguna menekan tombol Edit pada daftar buku
  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setStatus(editingBook.status);
      setErrors({});
    } else {
      setTitle('');
      setAuthor('');
      setStatus('milik');
    }
  }, [editingBook]);

  // Fungsi validasi form sebelum disubmit
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Judul buku wajib diisi!';
    }
    if (!author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      status,
    });

    // Reset form jika bukan mode edit
    if (!editingBook) {
      setTitle('');
      setAuthor('');
      setStatus('milik');
    }
    setErrors({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <h3 className="form-title">
        {editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}
      </h3>

      <div className="form-group">
        <label htmlFor="book-title">Judul Buku</label>
        <input
          id="book-title"
          type="text"
          placeholder="Contoh: Laskar Pelangi"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-message" role="alert">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="book-author">Penulis</label>
        <input
          id="book-author"
          type="text"
          placeholder="Contoh: Andrea Hirata"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            if (errors.author) setErrors({ ...errors, author: '' });
          }}
          className={errors.author ? 'input-error' : ''}
        />
        {errors.author && <span className="error-message" role="alert">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="book-status">Status Buku</label>
        <select
          id="book-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="milik">Sudah Dimiliki (Milik)</option>
          <option value="baca">Sedang Dibaca (Baca)</option>
          <option value="beli">Ingin Dibeli (Beli)</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {editingBook ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
        {editingBook && (
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancelEdit}
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

BookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  editingBook: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']),
  }),
  onCancelEdit: PropTypes.func,
};

BookForm.defaultProps = {
  editingBook: null,
  onCancelEdit: () => {},
};

export default BookForm;