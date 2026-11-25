"""Inheritance, super(), overriding, multiple inheritance, dan MRO."""

class Kendaraan:
    def __init__(self, merek: str, model: str, tahun: int):
        self.merek = merek
        self.model = model
        self.tahun = tahun
        self.odometer = 0

    def deskripsi(self) -> str:
        return f"{self.merek} {self.model} ({self.tahun})"

    def tambah_jarak(self, km: float):
        if km > 0:
            self.odometer += km
            print(f"[{self.merek}] Menempuh perjalanan +{km} km. Total Odo: {self.odometer} km")
        else:
            print("Nilai kilometer tambahan tidak valid!")

    def klakson(self) -> str:
        return "Tin tin!"

class Mobil(Kendaraan):
    def __init__(self, merek, model, tahun, jumlah_pintu, kapasitas_tangki):
        super().__init__(merek, model, tahun)
        self.jumlah_pintu = jumlah_pintu
        self.kapasitas_tangki = kapasitas_tangki
        self.sisa_bensin = kapasitas_tangki

    def deskripsi(self):
        return f"{super().deskripsi()} [Mobil {self.jumlah_pintu} Pintu, Tangki: {self.kapasitas_tangki}L]"

    def klakson(self):
        return "Telolet! Telolet! (Klakson Mobil)"

    def isi_bensin(self, liter):
        if liter > 0 and self.sisa_bensin + liter <= self.kapasitas_tangki:
            self.sisa_bensin += liter
            print(f"[{self.merek} {self.model}] Diisi bensin {liter}L. Sisa: {self.sisa_bensin}L")
        else:
            print("Pengisian tidak valid atau kapasitas tangki akan meluap!")

class Motor(Kendaraan):
    def __init__(self, merek, model, tahun, kapasitas_cc):
        super().__init__(merek, model, tahun)
        self.kapasitas_cc = kapasitas_cc

    def deskripsi(self):
        return f"{super().deskripsi()} [Motor Sport {self.kapasitas_cc}cc]"

    def klakson(self):
        return "Bip bip! (Klakson Motor)"

    def wheelie(self):
        print(f"[{self.merek} {self.model}] Melakukan atraksi wheelie satu roda!")

class KomponenBaterai:
    def __init__(self, kapasitas_kwh):
        self.kapasitas_kwh = kapasitas_kwh
        self.daya_tersisa = 100.0

    def isi_daya(self, persen):
        self.daya_tersisa = min(100.0, self.daya_tersisa + persen)
        print(f"Baterai diisi ulang. Kapasitas daya: {self.daya_tersisa}%")

class MobilListrik(Mobil, KomponenBaterai):
    def __init__(self, merek, model, tahun, kapasitas_kwh):
        Mobil.__init__(self, merek, model, tahun, jumlah_pintu=4, kapasitas_tangki=0.0)
        KomponenBaterai.__init__(self, kapasitas_kwh)

    def deskripsi(self):
        return f"{self.merek} {self.model} ({self.tahun}) [EV Baterai {self.kapasitas_kwh} kWh, Daya: {self.daya_tersisa}%]"

if __name__ == "__main__":
    avanza = Mobil("Toyota", "Avanza Veloz", 2023, 5, 45.0)
    cbr = Motor("Honda", "CBR250RR", 2022, 250)
    ioniq = MobilListrik("Hyundai", "Ioniq 5", 2024, 72.6)
    print("--- Deskripsi Kendaraan ---")
    print(avanza.deskripsi())
    print(cbr.deskripsi())
    print(ioniq.deskripsi())
    print("\n--- Uji Coba Suara Klakson ---")
    print(f"{avanza.model}: {avanza.klakson()}")
    print(f"{cbr.model}: {cbr.klakson()}")
    print("\n--- Perjalanan & Energi ---")
    avanza.tambah_jarak(120.5)
    avanza.isi_bensin(10)
    cbr.wheelie()
    ioniq.isi_daya(30)
    print("\n--- Pemeriksaan Pewarisan ---")
    print("Avanza adalah instance Mobil:", isinstance(avanza, Mobil))
    print("Avanza adalah instance Kendaraan:", isinstance(avanza, Kendaraan))
    print("CBR adalah instance Mobil:", isinstance(cbr, Mobil))
    print("Mobil subclass Kendaraan:", issubclass(Mobil, Kendaraan))
    print("MRO MobilListrik:", [c.__name__ for c in MobilListrik.__mro__])
