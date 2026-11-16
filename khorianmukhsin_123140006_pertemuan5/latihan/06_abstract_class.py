"""Abstract Base Class, abstract method/property, dan interface pattern."""

from abc import ABC, abstractmethod
import math

class Shape(ABC):
    def __init__(self, nama):
        self.nama = nama

    @abstractmethod
    def luas(self) -> float:
        pass

    @abstractmethod
    def keliling(self) -> float:
        pass

    def cetak_laporan(self):
        print(f"[{self.nama}] Luas: {self.luas():.2f} | Keliling: {self.keliling():.2f}")

class PersegiPanjang(Shape):
    def __init__(self, panjang, lebar):
        super().__init__("Persegi Panjang")
        self.panjang = panjang
        self.lebar = lebar

    def luas(self):
        return self.panjang * self.lebar

    def keliling(self):
        return 2 * (self.panjang + self.lebar)

class Lingkaran(Shape):
    def __init__(self, radius):
        super().__init__("Lingkaran")
        self.radius = radius

    def luas(self):
        return math.pi * self.radius ** 2

    def keliling(self):
        return 2 * math.pi * self.radius

class DatabaseConnector(ABC):
    @property
    @abstractmethod
    def driver_name(self):
        pass

    @abstractmethod
    def connect(self, host, port, database):
        pass

    @abstractmethod
    def execute_query(self, sql):
        pass

    @abstractmethod
    def disconnect(self):
        pass

class PostgreSQLConnector(DatabaseConnector):
    @property
    def driver_name(self):
        return "PostgreSQL (psycopg2)"

    def connect(self, host, port, database):
        print(f"[{self.driver_name}] Terhubung ke postgresql://{host}:{port}/{database} [OK]")
        return True

    def execute_query(self, sql):
        print(f"[{self.driver_name}] Menjalankan SQL: '{sql}'")
        return [{"id": 1, "nama": "Ahmad"}, {"id": 2, "nama": "Nabila"}]

    def disconnect(self):
        print(f"[{self.driver_name}] Koneksi database ditutup.")

if __name__ == "__main__":
    print("--- Uji Coba Shape ---")
    PersegiPanjang(10, 5).cetak_laporan()
    Lingkaran(7).cetak_laporan()
    print("\n--- Enforcement Abstract Class ---")
    try:
        Shape("Bentuk Abstrak")
    except TypeError as err:
        print("Penolakan Python terbukti:", err)
    class SegitigaCacat(Shape):
        def __init__(self, alas, tinggi):
            super().__init__("Segitiga Cacat")
            self.alas = alas
            self.tinggi = tinggi
        def luas(self):
            return 0.5 * self.alas * self.tinggi
    try:
        SegitigaCacat(6, 8)
    except TypeError as err:
        print("Penolakan subclass cacat:", err)
    print("\n--- Interface Database ---")
    db = PostgreSQLConnector()
    db.connect("localhost", 5432, "paw_praktikum_db")
    print("Hasil Query Data:", db.execute_query("SELECT id, nama FROM mahasiswa;"))
    db.disconnect()
