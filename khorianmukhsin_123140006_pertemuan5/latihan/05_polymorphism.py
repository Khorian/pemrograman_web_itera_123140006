"""Polymorphism, duck typing, collection heterogen, dan operator overloading."""

class MetodePembayaran:
    def __init__(self, nama_metode):
        self.nama_metode = nama_metode

    def bayar(self, tagihan):
        raise NotImplementedError("Subclass wajib mengimplementasikan bayar()!")

class TransferBank(MetodePembayaran):
    def __init__(self, nama_bank, nomor_va):
        super().__init__(f"Transfer Bank {nama_bank}")
        self.nomor_va = nomor_va

    def bayar(self, tagihan):
        biaya_admin = 4000
        total = tagihan + biaya_admin
        print(f"[{self.nama_metode}] Tagihan Rp {tagihan:,.2f} + Admin Rp {biaya_admin:,} = Rp {total:,.2f}")
        print(f" -> Virtual Account: {self.nomor_va}")
        return True

class EWallet(MetodePembayaran):
    def __init__(self, nama_provider, nomor_hp, saldo_wallet):
        super().__init__(f"E-Wallet {nama_provider}")
        self.nomor_hp = nomor_hp
        self.saldo_wallet = saldo_wallet

    def bayar(self, tagihan):
        if self.saldo_wallet >= tagihan:
            self.saldo_wallet -= tagihan
            cashback = tagihan * 0.05
            print(f"[{self.nama_metode}] Pembayaran Rp {tagihan:,.2f} berhasil via {self.nomor_hp}.")
            print(f" -> Cashback Rp {cashback:,.2f}. Sisa saldo Rp {self.saldo_wallet:,.2f}")
            return True
        print(f"[{self.nama_metode}] Gagal: saldo tidak cukup!")
        return False

class CryptoPayment:
    """Contoh duck typing: tidak mewarisi MetodePembayaran, tetapi punya bayar()."""
    def __init__(self, wallet_address, crypto_symbol="USDT"):
        self.wallet_address = wallet_address
        self.crypto_symbol = crypto_symbol

    def bayar(self, tagihan):
        total_crypto = tagihan / 16000
        print(f"[Crypto Gateway] Rp {tagihan:,.2f} -> {total_crypto:.2f} {self.crypto_symbol}")
        print(f" -> Wallet {self.wallet_address[:10]}... Success!")
        return True

def proses_checkout_pesanan(daftar_opsi_bayar, total_belanja):
    print(f"\n================ CHECKOUT Rp {total_belanja:,.2f} ================")
    for opsi in daftar_opsi_bayar:
        nama = getattr(opsi, "nama_metode", type(opsi).__name__)
        print(f"\nMemproses opsi: {nama}...")
        opsi.bayar(total_belanja)

class Dompet:
    def __init__(self, pemilik, saldo):
        self.pemilik = pemilik
        self.saldo = saldo

    def __add__(self, other):
        if isinstance(other, Dompet):
            return Dompet(f"{self.pemilik} & {other.pemilik}", self.saldo + other.saldo)
        if isinstance(other, (int, float)):
            return Dompet(self.pemilik, self.saldo + other)
        return NotImplemented

    def __eq__(self, other):
        return isinstance(other, Dompet) and self.saldo == other.saldo

    def __str__(self):
        return f"Dompet({self.pemilik}): Rp {self.saldo:,.2f}"

if __name__ == "__main__":
    channels = [
        TransferBank("BCA", "880121140001"),
        EWallet("GoPay", "081234567890", 500000),
        CryptoPayment("0x71C...b89A", "USDT"),
    ]
    proses_checkout_pesanan(channels, 320000)
    print("\n--- Operator Overloading ---")
    d1 = Dompet("Andi", 150000)
    d2 = Dompet("Budi", 250000)
    print("Dompet 1:", d1)
    print("Dompet 2:", d2)
    print("Hasil d1 + d2:", d1 + d2)
    print("Apakah saldo d1 == d2?:", d1 == d2)
