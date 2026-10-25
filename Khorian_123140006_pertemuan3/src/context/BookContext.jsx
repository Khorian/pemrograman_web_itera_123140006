import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BookContext = createContext();

/**
 * Custom hook pembungkus untuk mempermudah pemanggilan BookContext
 */
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }
  return context;
};

/**
 * Provider utama untuk mengelola state buku, pencarian, filter, dan proses edit
 */
export const BookProvider = ({ children }) => {
  // Menyimpan daftar buku secara persisten di localStorage
  const [books, setBooks] = useLocalStorage('khorian_books_data', []);
  
  // State untuk filter status ('semua', 'milik', 'baca', 'beli') dan kata kunci pencarian
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk menyimpan buku yang sedang diedit
  const [editingBook, setEditingBook] = useState(null);

  // Fungsi menambah buku baru
  const addBook = (newBook) => {
    const bookWithId = {
      ...newBook,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBooks((prevBooks) => [bookWithId, ...prevBooks]);
  };

  // Fungsi memperbarui buku yang sedang diedit
  const updateBook = (id, updatedData) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === id ? { ...book, ...updatedData } : book))
    );
    setEditingBook(null);
  };

  // Fungsi menghapus buku
  const deleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    if (editingBook && editingBook.id === id) {
      setEditingBook(null);
    }
  };

  // Memfilter buku berdasarkan status dan pencarian judul/penulis
  const filteredBooks = books.filter((book) => {
    const matchesStatus = filterStatus === 'semua' || book.status === filterStatus;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const value = {
    books,
    filteredBooks,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    editingBook,
    setEditingBook,
    addBook,
    updateBook,
    deleteBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};