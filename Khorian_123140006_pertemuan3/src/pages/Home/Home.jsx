import React from 'react';
import { useBooks } from '../../context/BookContext';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import './Home.css';

/**
 * Halaman Utama (Home) yang menggabungkan Form, Filter, dan Daftar Buku.
 */
const Home = () => {
  const {
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
  } = useBooks();

  const handleFormSubmit = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }
  };

  return (
    <div className="home-page">
      <aside className="home-sidebar">
        <BookForm
          onSubmit={handleFormSubmit}
          editingBook={editingBook}
          onCancelEdit={() => setEditingBook(null)}
        />
      </aside>

      <section className="home-content">
        <BookFilter
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <BookList
          books={filteredBooks}
          onEdit={(book) => setEditingBook(book)}
          onDelete={deleteBook}
        />
      </section>
    </div>
  );
};

export default Home;