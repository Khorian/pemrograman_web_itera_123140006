import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookForm from './components/BookForm/BookForm';
import BookList from './components/BookList/BookList';
import BookFilter from './components/BookFilter/BookFilter';
import App from './App';

describe('Pengujian Unit Aplikasi Manajemen Buku Pribadi', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // TEST 1: Error Handling & Validasi Form
  it('1. Menampilkan pesan error visual jika form disubmit dalam keadaan kosong', () => {
    const mockSubmit = vi.fn();
    render(<BookForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Judul buku wajib diisi!')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi!')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // TEST 2: Menambah Buku Baru melalui BookForm
  it('2. Memanggil fungsi onSubmit dengan data yang benar saat input valid', () => {
    const mockSubmit = vi.fn();
    render(<BookForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/judul buku/i), {
      target: { value: 'Filosofi Teras' },
    });
    fireEvent.change(screen.getByLabelText(/penulis/i), {
      target: { value: 'Henry Manampiring' },
    });
    fireEvent.change(screen.getByLabelText(/status buku/i), {
      target: { value: 'baca' },
    });

    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Filosofi Teras',
      author: 'Henry Manampiring',
      status: 'baca',
    });
  });

  // TEST 3: Render Daftar Buku & Fungsi Hapus pada BookList
  it('3. Merender daftar buku dengan benar dan memicu fungsi hapus ketika tombol Hapus diklik', () => {
    const sampleBooks = [
      { id: '1', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'milik' },
    ];
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();

    render(<BookList books={sampleBooks} onEdit={mockEdit} onDelete={mockDelete} />);

    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.getByText(/Pramoedya Ananta Toer/i)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /hapus bumi manusia/i });
    fireEvent.click(deleteBtn);

    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  // TEST 4: Pencarian & Filter pada BookFilter
  it('4. Memicu perubahan pencarian dan filter status dengan benar pada BookFilter', () => {
    const mockFilterChange = vi.fn();
    const mockSearchChange = vi.fn();

    render(
      <BookFilter
        filterStatus="semua"
        onFilterChange={mockFilterChange}
        searchQuery=""
        onSearchChange={mockSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/cari judul buku/i);
    fireEvent.change(searchInput, { target: { value: 'Atomic Habits' } });
    expect(mockSearchChange).toHaveBeenCalledWith('Atomic Habits');

    const filterBeliBtn = screen.getByRole('button', { name: /ingin dibeli/i });
    fireEvent.click(filterBeliBtn);
    expect(mockFilterChange).toHaveBeenCalledWith('beli');
  });

  // TEST 5: Integrasi Penuh (Tambah Buku & Navigasi ke Halaman Statistik)
  it('5. Menambahkan buku baru di halaman Beranda dan memeriksa perhitungannya di halaman Statistik', () => {
    render(<App />);

    // Tambah 1 buku baru
    fireEvent.change(screen.getByLabelText(/judul buku/i), {
      target: { value: 'Clean Code' },
    });
    fireEvent.change(screen.getByLabelText(/penulis/i), {
      target: { value: 'Robert C. Martin' },
    });
    fireEvent.click(screen.getByRole('button', { name: /tambah buku/i }));

    // Pastikan buku tampil di list
    expect(screen.getByText('Clean Code')).toBeInTheDocument();

    // Pindah ke halaman Statistik
    const statsNav = screen.getByRole('link', { name: /statistik/i });
    fireEvent.click(statsNav);

    // Pastikan halaman statistik menampilkan judul dan total buku = 1
    expect(screen.getByText(/Statistik Koleksi Buku/i)).toBeInTheDocument();
    expect(screen.getByText('100% dari total buku')).toBeInTheDocument();
  });
});