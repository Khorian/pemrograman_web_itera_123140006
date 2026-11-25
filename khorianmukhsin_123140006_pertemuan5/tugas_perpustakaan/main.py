"""Program utama demo sistem manajemen perpustakaan (tanpa input interaktif)."""

from .library_item import Book, Magazine
from .member import Member
from .library import Library


def tampilkan_hasil_pencarian(perpustakaan, **kriteria):
    """Menampilkan hasil pencarian koleksi berdasarkan kriteria."""
    hasil = perpustakaan.cari_item(**kriteria)
    if hasil:
        print("Hasil ditemukan:")
        print(hasil.get_detail())
    else:
        print("Item tidak ditemukan.")


def main():
    """Menjalankan demonstrasi fitur utama sistem perpustakaan."""
    perpustakaan = Library("Perpustakaan ITERA")

    print("========== SISTEM MANAJEMEN PERPUSTAKAAN ==========")

    # Penambahan item: contoh objek dari dua subclass berbeda.
    print("\n--- 1. Menambahkan Koleksi ---")
    perpustakaan.tambah_item(Book("B001", "Laskar Pelangi", 2005, "Andrea Hirata", "Bentang Pustaka"))
    perpustakaan.tambah_item(Book("B002", "Bumi Manusia", 1980, "Pramoedya Ananta Toer", "Hasta Mitra"))
    perpustakaan.tambah_item(Magazine("M001", "National Geographic", 2024, "Edisi 08", "Sains"))
    perpustakaan.tambah_item(Magazine("M002", "Teknologi dan Inovasi", 2025, "Edisi 02", "Teknologi"))

    # Pendaftaran anggota.
    print("\n--- 2. Pendaftaran Anggota ---")
    perpustakaan.tambah_anggota(Member("A001", "Andi Saputra"))
    perpustakaan.tambah_anggota(Member("A002", "Nabila Putri"))

    # Katalog dan pencarian.
    print("\n--- 3. Menampilkan Katalog ---")
    perpustakaan.tampilkan_katalog()

    print("\n--- 4. Menampilkan Item yang Tersedia ---")
    perpustakaan.tampilkan_katalog(hanya_tersedia=True)

    print("\n--- 5. Pencarian Berdasarkan ID ---")
    tampilkan_hasil_pencarian(perpustakaan, item_id="B001")

    print("\n--- 6. Pencarian Berdasarkan Judul ---")
    tampilkan_hasil_pencarian(perpustakaan, judul="National Geographic")

    # Peminjaman dan pengembalian untuk demonstrasi status.
    print("\n--- 7. Peminjaman Item ---")
    perpustakaan.pinjam_item("A001", "B001")
    perpustakaan.pinjam_item("A002", "M001")

    print("\n--- 8. Katalog Setelah Peminjaman ---")
    perpustakaan.tampilkan_katalog(hanya_tersedia=True)

    print("\n--- 9. Pengembalian dan Perhitungan Denda ---")
    perpustakaan.kembalikan_item("B001", hari_terlambat=3)
    perpustakaan.kembalikan_item("M001", hari_terlambat=2)

    print("\n--- 10. Katalog Akhir ---")
    perpustakaan.tampilkan_katalog(hanya_tersedia=True)

    print("\n========== DEMO SELESAI ==========")


if __name__ == "__main__":
    main()
