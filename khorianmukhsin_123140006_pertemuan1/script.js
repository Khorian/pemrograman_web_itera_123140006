"use strict";

// 1. Konfigurasi dan elemen HTML.
const STORAGE_KEY = "mini-pos-123140006-keranjang";
const BATAS_DISKON = 50000;
const PERSEN_DISKON = 0.1;
const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
});
const form = document.getElementById("barang-form");
const namaInput = document.getElementById("nama-barang");
const hargaInput = document.getElementById("harga-barang");
const jumlahInput = document.getElementById("jumlah-barang");
const bayarInput = document.getElementById("uang-bayar");
const tabelBody = document.getElementById("keranjang-body");
const statusPesan = document.getElementById("status-pesan");
const storagePesan = document.getElementById("storage-pesan");
const bayarPesan = document.getElementById("bayar-pesan");
let keranjang = [];
let totalAkhir = 0;

// Batasi angka agar perhitungan rupiah tetap akurat di JavaScript.
function angkaBulatValid(nilai, minimum) {
  return Number.isSafeInteger(nilai) && nilai >= minimum;
}

function hitungTotal(items) {
  return items.reduce((total, barang) => total + barang.harga * barang.qty, 0);
}

// 2. Muat JSON dan periksa bentuk data, termasuk data yang diedit manual.
function muatKeranjang() {
  try {
    const dataTersimpan = localStorage.getItem(STORAGE_KEY);
    if (dataTersimpan === null) return [];
    const data = JSON.parse(dataTersimpan);
    const valid = Array.isArray(data) && data.every(barang =>
      barang !== null && typeof barang === "object" &&
      typeof barang.nama === "string" && barang.nama.trim().length >= 3 &&
      angkaBulatValid(barang.harga, 500) && angkaBulatValid(barang.qty, 1) &&
      Number.isSafeInteger(barang.harga * barang.qty)
    );
    if (!valid || !Number.isSafeInteger(hitungTotal(data))) {
      throw new Error("Data keranjang tidak valid.");
    }
    return data.map(barang => ({
      nama: barang.nama.trim(), harga: barang.harga, qty: barang.qty
    }));
  } catch {
    storagePesan.textContent = "Keranjang tidak dapat dimuat. Data mungkin rusak atau penyimpanan browser tidak tersedia.";
    return [];
  }
}

function simpanKeranjang() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
    storagePesan.textContent = "";
  } catch {
    storagePesan.textContent = "Keranjang tetap bisa digunakan, tetapi gagal disimpan. Data bisa hilang saat halaman di-refresh.";
  }
}

// 3. Pesan kesalahan muncul di bawah input yang bersangkutan.
function tampilkanError(input, pesanId, pesan) {
  document.getElementById(pesanId).textContent = pesan;
  input.setAttribute("aria-invalid", pesan ? "true" : "false");
}

function bersihkanError() {
  tampilkanError(namaInput, "nama-error", "");
  tampilkanError(hargaInput, "harga-error", "");
  tampilkanError(jumlahInput, "jumlah-error", "");
}

function validasiBarang() {
  bersihkanError();
  const nama = namaInput.value.trim();
  const harga = Number(hargaInput.value);
  const qty = Number(jumlahInput.value);
  let inputSalah = null;

  if (nama.length < 3) {
    tampilkanError(namaInput, "nama-error", "Nama barang wajib diisi, minimal 3 karakter.");
    inputSalah = namaInput;
  }
  if (!hargaInput.value.trim() || !angkaBulatValid(harga, 500)) {
    tampilkanError(hargaInput, "harga-error", "Harga wajib berupa angka bulat minimal Rp500 dalam rentang yang didukung.");
    inputSalah ??= hargaInput;
  }
  if (!jumlahInput.value.trim() || !angkaBulatValid(qty, 1)) {
    tampilkanError(jumlahInput, "jumlah-error", "Jumlah wajib berupa angka bulat minimal 1 dalam rentang yang didukung.");
    inputSalah ??= jumlahInput;
  }
  if (!inputSalah && !Number.isSafeInteger(harga * qty)) {
    tampilkanError(jumlahInput, "jumlah-error", "Subtotal terlalu besar. Kurangi harga atau jumlah barang.");
    inputSalah = jumlahInput;
  }
  if (!inputSalah && !Number.isSafeInteger(hitungTotal(keranjang) + harga * qty)) {
    tampilkanError(hargaInput, "harga-error", "Total belanja terlalu besar. Kurangi nominal barang.");
    inputSalah = hargaInput;
  }
  if (inputSalah) {
    inputSalah.focus();
    return null;
  }
  return { nama, harga, qty };
}

// 4. Bangun tabel dengan textContent agar nama barang diperlakukan sebagai teks.
function renderKeranjang() {
  tabelBody.replaceChildren();
  if (keranjang.length === 0) {
    const baris = document.createElement("tr");
    baris.className = "empty-row";
    const sel = document.createElement("td");
    sel.colSpan = 6;
    sel.textContent = "Belum ada pesanan. Tambahkan menu terlebih dahulu.";
    baris.append(sel);
    tabelBody.append(baris);
  }

  keranjang.forEach((barang, index) => {
    const baris = document.createElement("tr");
    const nilaiKolom = [
      index + 1, barang.nama, formatRupiah.format(barang.harga),
      barang.qty, formatRupiah.format(barang.harga * barang.qty)
    ];
    nilaiKolom.forEach(nilai => {
      const sel = document.createElement("td");
      sel.textContent = nilai;
      baris.append(sel);
    });
    const aksi = document.createElement("td");
    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "button button-danger";
    tombol.textContent = "Hapus";
    tombol.setAttribute("aria-label", `Hapus ${barang.nama}, baris ${index + 1}`);
    tombol.addEventListener("click", () => hapusBarang(index));
    aksi.append(tombol);
    baris.append(aksi);
    tabelBody.append(baris);
  });
  hitungPembayaran();
}

// 5. Diskon dibulatkan ke rupiah terdekat agar pembayaran memakai rupiah utuh.
function hitungPembayaran() {
  const totalBelanja = hitungTotal(keranjang);
  const diskon = totalBelanja >= BATAS_DISKON
    ? Math.round(totalBelanja * PERSEN_DISKON) : 0;
  totalAkhir = totalBelanja - diskon;
  document.getElementById("total-belanja").textContent = formatRupiah.format(totalBelanja);
  document.getElementById("nominal-diskon").textContent = formatRupiah.format(diskon);
  document.getElementById("total-akhir").textContent = formatRupiah.format(totalAkhir);
  hitungKembalian();
}

function hitungKembalian() {
  const output = document.getElementById("kembalian");
  output.textContent = formatRupiah.format(0);
  bayarPesan.textContent = "";
  bayarPesan.classList.remove("success");
  bayarInput.setAttribute("aria-invalid", "false");
  if (!bayarInput.value.trim() && !bayarInput.validity.badInput) return;

  const uangBayar = Number(bayarInput.value);
  if (bayarInput.validity.badInput || !angkaBulatValid(uangBayar, 0)) {
    bayarPesan.textContent = "Uang bayar harus berupa angka bulat minimal Rp0 dalam rentang yang didukung.";
    bayarInput.setAttribute("aria-invalid", "true");
    return;
  }
  if (keranjang.length === 0) {
    bayarPesan.textContent = "Tambahkan barang sebelum melakukan pembayaran.";
    return;
  }
  if (uangBayar < totalAkhir) {
    bayarPesan.textContent = `Uang belum mencukupi. Kekurangan ${formatRupiah.format(totalAkhir - uangBayar)}.`;
    bayarInput.setAttribute("aria-invalid", "true");
    return;
  }
  output.textContent = formatRupiah.format(uangBayar - totalAkhir);
  bayarPesan.textContent = uangBayar === totalAkhir ? "Uang bayar pas." : "Uang bayar mencukupi.";
  bayarPesan.classList.add("success");
}

// 6. Tambah, hapus, dan reset selalu memperbarui tabel serta penyimpanan.
form.addEventListener("submit", event => {
  event.preventDefault();
  statusPesan.textContent = "";
  const barang = validasiBarang();
  if (!barang) return;
  keranjang.push(barang);
  simpanKeranjang();
  renderKeranjang();
  form.reset();
  statusPesan.textContent = `${barang.nama} berhasil ditambahkan ke keranjang.`;
  namaInput.focus();
});

function hapusBarang(index) {
  const [barang] = keranjang.splice(index, 1);
  simpanKeranjang();
  renderKeranjang();
  statusPesan.textContent = `${barang.nama} dihapus dari keranjang.`;
}

document.getElementById("reset-transaksi").addEventListener("click", () => {
  keranjang = [];
  form.reset();
  bayarInput.value = "";
  bersihkanError();
  try {
    // Hapus hanya data Mini POS; data aplikasi lain tidak ikut terhapus.
    localStorage.removeItem(STORAGE_KEY);
    storagePesan.textContent = "";
  } catch {
    storagePesan.textContent = "Keranjang sudah dikosongkan, tetapi data tersimpan gagal dihapus. Data lama mungkin muncul kembali setelah refresh.";
  }
  renderKeranjang();
  statusPesan.textContent = "Transaksi baru siap. Keranjang sudah dikosongkan.";
  namaInput.focus();
});

bayarInput.addEventListener("input", hitungKembalian);
keranjang = muatKeranjang();
renderKeranjang();
