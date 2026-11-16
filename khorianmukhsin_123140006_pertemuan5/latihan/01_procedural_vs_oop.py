"""Perbandingan pendekatan prosedural dan OOP."""

mahasiswa_proc = {
    "nama": "Budi Santoso",
    "nim": "121140001",
    "jurusan": "Teknik Informatika",
    "ipk": 3.45,
}

def cetak_profil_prosedural(mhs):
    print(f"[Prosedural] {mhs['nama']} ({mhs['nim']}) - {mhs['jurusan']} | IPK: {mhs['ipk']}")

def perbarui_ipk_prosedural(mhs, ipk_baru):
    if 0.0 <= ipk_baru <= 4.0:
        mhs["ipk"] = ipk_baru
    else:
        print("Nilai IPK tidak valid!")

cetak_profil_prosedural(mahasiswa_proc)
perbarui_ipk_prosedural(mahasiswa_proc, 3.75)
cetak_profil_prosedural(mahasiswa_proc)

class Mahasiswa:
    """Menyatukan data dan perilaku mahasiswa."""

    def __init__(self, nama: str, nim: str, jurusan: str, ipk: float):
        self.nama = nama
        self.nim = nim
        self.jurusan = jurusan
        self.ipk = ipk

    def cetak_profil(self):
        print(f"[OOP] {self.nama} ({self.nim}) - {self.jurusan} | IPK: {self.ipk}")

    def update_ipk(self, ipk_baru: float):
        if 0.0 <= ipk_baru <= 4.0:
            self.ipk = ipk_baru
            print(f"IPK {self.nama} berhasil diperbarui menjadi {self.ipk}")
        else:
            print("Peringatan: Nilai IPK harus berada pada rentang 0.0 s.d 4.0!")

if __name__ == "__main__":
    print("\n--- Eksekusi Paradigma OOP ---")
    mhs_oop = Mahasiswa("Siti Rahma", "121140002", "Teknik Informatika", 3.80)
    mhs_oop.cetak_profil()
    mhs_oop.update_ipk(3.92)
    mhs_oop.cetak_profil()
