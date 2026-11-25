"""Encapsulation, access convention, name mangling, dan @property."""

class RekeningBank:
    def __init__(self, nomor_rekening, nama_pemilik, saldo_awal, pin):
        self.nomor_rekening = nomor_rekening
        self._pemilik = nama_pemilik
        self.__saldo = max(0.0, float(saldo_awal))
        self.__pin = str(pin)
        self._riwayat_transaksi = []

    @property
    def saldo(self):
        return self.__saldo

    @saldo.setter
    def saldo(self, jumlah_baru):
        if not isinstance(jumlah_baru, (int, float)):
            raise TypeError("Nilai saldo harus berupa angka numerik!")
        if jumlah_baru < 0:
            raise ValueError("Saldo rekening tidak boleh bernilai negatif!")
        self.__saldo = float(jumlah_baru)
        print(f"[AUDIT] Saldo {self.nomor_rekening} disesuaikan menjadi Rp {self.__saldo:,.2f}")

    def setor(self, nominal):
        if nominal <= 0:
            print("Gagal: Nominal setor harus lebih besar dari Rp 0!")
            return
        self.__saldo += nominal
        self._riwayat_transaksi.append(f"Setor Tunai: +Rp {nominal:,.2f}")
        print(f"Setor tunai Rp {nominal:,.2f} sukses. Saldo: Rp {self.__saldo:,.2f}")

    def tarik(self, nominal, pin_input):
        if pin_input != self.__pin:
            print("Gagal: PIN transaksi salah!")
            return False
        if nominal <= 0:
            print("Gagal: Nominal penarikan harus lebih dari Rp 0!")
            return False
        if nominal > self.__saldo:
            print("Gagal: Saldo tidak mencukupi!")
            return False
        self.__saldo -= nominal
        self._riwayat_transaksi.append(f"Tarik Tunai: -Rp {nominal:,.2f}")
        print(f"Tarik tunai Rp {nominal:,.2f} berhasil. Sisa saldo: Rp {self.__saldo:,.2f}")
        return True

    def cetak_mutasi(self):
        print(f"\n=== MUTASI REKENING {self.nomor_rekening} ({self._pemilik}) ===")
        for log in self._riwayat_transaksi:
            print(" -", log)
        print(f"Saldo Akhir: Rp {self.__saldo:,.2f}\n")

if __name__ == "__main__":
    rek = RekeningBank("121-009-8871", "Ahmad Fadhilah", 500000, "123456")
    print("Nomor Rekening (Public):", rek.nomor_rekening)
    print("Pemilik (Protected):", rek._pemilik)
    print("Saldo (@property): Rp", rek.saldo)
    rek.setor(250000)
    rek.tarik(100000, "999999")
    rek.tarik(100000, "123456")
    rek.tarik(1000000, "123456")
    try:
        rek.saldo = -50000
    except ValueError as err:
        print("\nValidasi tertangkap:", err)
    print("\n--- Uji Proteksi Private ---")
    try:
        print(rek.__saldo)
    except AttributeError:
        print("Akses langsung rek.__saldo gagal (AttributeError).")
    print("Nilai via name mangling:", rek._RekeningBank__saldo)
    rek.cetak_mutasi()
