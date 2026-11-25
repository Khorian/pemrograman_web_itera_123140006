"""Pengelola koleksi dan anggota perpustakaan dengan enkapsulasi."""

from .library_item import LibraryItem
from .member import Member

class Library:
    """Menyimpan koleksi dan anggota menggunakan atribut private."""

    def __init__(self, nama: str):
        self.nama = nama
        self.__koleksi: list[LibraryItem] = []
        self.__anggota: list[Member] = []
        self.__peminjaman: dict[str, str] = {}

    def tambah_item(self, item: LibraryItem) -> bool:
        """Menambahkan item jika bertipe LibraryItem dan ID belum digunakan."""
        if not isinstance(item, LibraryItem):
            print("Gagal: objek bukan LibraryItem.")
            return False
        if self.cari_item(item_id=item.item_id) is not None:
            print(f"Gagal: ID item {item.item_id} sudah terdaftar.")
            return False
        self.__koleksi.append(item)
        print(f"Item '{item.judul}' berhasil ditambahkan.")
        return True

    def tambah_anggota(self, anggota: Member) -> bool:
        """Mendaftarkan anggota dengan ID unik."""
        if not isinstance(anggota, Member):
            print("Gagal: objek bukan Member.")
            return False
        if self.cari_anggota(anggota.member_id) is not None:
            print(f"Gagal: ID anggota {anggota.member_id} sudah terdaftar.")
            return False
        self.__anggota.append(anggota)
        print(f"Anggota '{anggota.nama}' berhasil didaftarkan.")
        return True

    def cari_anggota(self, member_id: str):
        """Mencari anggota berdasarkan ID."""
        for anggota in self.__anggota:
            if anggota.member_id == str(member_id):
                return anggota
        return None

    def cari_item(self, judul=None, item_id=None):
        """Mencari koleksi berdasarkan ID atau judul (tidak peka huruf besar/kecil)."""
        for item in self.__koleksi:
            if item_id is not None and item.item_id == str(item_id):
                return item
            if judul is not None and str(judul).casefold() in item.judul.casefold():
                return item
        return None

    def daftar_item(self, hanya_tersedia=False):
        """Mengembalikan daftar item; dapat difilter hanya yang tersedia."""
        if hanya_tersedia:
            return [item for item in self.__koleksi if not item.is_dipinjam]
        return list(self.__koleksi)

    def tampilkan_katalog(self, hanya_tersedia=False):
        """Menampilkan katalog melalui method polymorphic get_detail()."""
        daftar = self.daftar_item(hanya_tersedia)
        judul = "KATALOG ITEM TERSEDIA" if hanya_tersedia else "SELURUH KATALOG"
        print(f"\n=== {judul} - {self.nama} ===")
        if not daftar:
            print("Belum ada item pada katalog.")
            return
        for item in daftar:
            print(item.get_detail())

    def pinjam_item(self, member_id: str, item_id: str) -> bool:
        """Memproses peminjaman dan menghubungkan item dengan anggota."""
        anggota = self.cari_anggota(member_id)
        item = self.cari_item(item_id=item_id)
        if anggota is None:
            print(f"Gagal: anggota dengan ID {member_id} tidak ditemukan.")
            return False
        if item is None:
            print(f"Gagal: item dengan ID {item_id} tidak ditemukan.")
            return False
        if not item.pinjam():
            print(f"Gagal: '{item.judul}' sedang dipinjam.")
            return False
        self.__peminjaman[item.item_id] = anggota.member_id
        print(f"'{item.judul}' berhasil dipinjam oleh {anggota.nama}.")
        return True

    def kembalikan_item(self, item_id: str, hari_terlambat: int = 0) -> bool:
        """Memproses pengembalian dan menghitung denda secara polymorphic."""
        item = self.cari_item(item_id=item_id)
        if item is None or not item.is_dipinjam:
            print("Gagal: item tidak ditemukan atau tidak sedang dipinjam.")
            return False
        item.kembalikan()
        self.__peminjaman.pop(item.item_id, None)
        denda = item.hitung_denda(hari_terlambat)
        print(f"'{item.judul}' berhasil dikembalikan. Denda: Rp {denda:,}.")
        return True
