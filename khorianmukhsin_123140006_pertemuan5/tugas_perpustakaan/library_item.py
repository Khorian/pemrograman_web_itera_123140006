"""Abstract item perpustakaan dan implementasi Buku serta Majalah."""

from abc import ABC, abstractmethod

class LibraryItem(ABC):
    """Class abstrak dasar untuk semua koleksi perpustakaan."""

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        self._item_id = str(item_id)
        self._judul = str(judul)
        self._tahun_terbit = int(tahun_terbit)
        self.__is_dipinjam = False

    @property
    def item_id(self) -> str:
        """ID koleksi yang hanya dapat dibaca dari luar."""
        return self._item_id

    @property
    def judul(self) -> str:
        """Judul item yang hanya dapat dibaca dari luar."""
        return self._judul

    @property
    def tahun_terbit(self) -> int:
        return self._tahun_terbit

    @property
    def is_dipinjam(self) -> bool:
        """Status pinjam read-only untuk menjaga enkapsulasi."""
        return self.__is_dipinjam

    def pinjam(self) -> bool:
        """Mengubah status menjadi dipinjam jika item tersedia."""
        if self.__is_dipinjam:
            return False
        self.__is_dipinjam = True
        return True

    def kembalikan(self) -> bool:
        """Mengubah status menjadi tersedia jika sebelumnya dipinjam."""
        if not self.__is_dipinjam:
            return False
        self.__is_dipinjam = False
        return True

    @abstractmethod
    def get_detail(self) -> str:
        """Kontrak detail yang wajib diimplementasikan subclass."""
        raise NotImplementedError

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> int:
        """Kontrak perhitungan denda yang wajib diimplementasikan subclass."""
        raise NotImplementedError


class Book(LibraryItem):
    """Item buku dengan informasi penulis dan penerbit."""

    def __init__(self, item_id, judul, tahun_terbit, penulis, penerbit):
        super().__init__(item_id, judul, tahun_terbit)
        self.penulis = penulis
        self.penerbit = penerbit

    def get_detail(self):
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[BUKU] ID: {self.item_id} | {self.judul} ({self.tahun_terbit}) | "
            f"Penulis: {self.penulis} | Penerbit: {self.penerbit} | Status: {status}"
        )

    def hitung_denda(self, hari_terlambat):
        return max(0, int(hari_terlambat)) * 2000


class Magazine(LibraryItem):
    """Item majalah dengan informasi edisi dan kategori."""

    def __init__(self, item_id, judul, tahun_terbit, edisi, kategori):
        super().__init__(item_id, judul, tahun_terbit)
        self.edisi = edisi
        self.kategori = kategori

    def get_detail(self):
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[MAJALAH] ID: {self.item_id} | {self.judul} ({self.tahun_terbit}) | "
            f"Edisi: {self.edisi} | Kategori: {self.kategori} | Status: {status}"
        )

    def hitung_denda(self, hari_terlambat):
        return max(0, int(hari_terlambat)) * 1000
