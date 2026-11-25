# Dashboard Latihan 

Nama: Khorian Mukhsin
NIM: 123140006
Kelas praktikum: RB

## Struktur

```text
modul/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Menjalankan

Buka `modul/index.html` melalui Live Server di VS Code. Navigasi di atas mengarahkan ke bagian fitur pada halaman yang sama. Tidak perlu npm/build. Post API membutuhkan internet.

## Fitur dan logika

1. Form mahasiswa: nama minimal 3 karakter, NIM 9 digit unik, email valid, dan prodi wajib dipilih. Pesan merah ditampilkan di bawah input. Data valid masuk tabel dan form di-reset.
2. Persistensi mahasiswa: array diserialisasi melalui JSON.stringify ke localStorage dan dimuat menggunakan JSON.parse setelah refresh. Data rusak atau kegagalan penyimpanan ditangani.
3. Search post: fetch dari https://jsonplaceholder.typicode.com/posts. Judul disaring dengan filter dan includes tanpa membedakan huruf besar/kecil. Dokumentasi API: https://jsonplaceholder.typicode.com/.
4. Dark mode: classList.toggle mengubah class dark-mode pada body, CSS mengubah seluruh dashboard. Pilihan tema disimpan ke localStorage.
5. Pagination: hasil pencarian dibagi lima post per halaman memakai slice. Previous dan Next dinonaktifkan pada batas halaman. Search kembali ke halaman pertama. Loading, hasil kosong, timeout, dan kegagalan fetch ditangani.
6. Todo: tambah tugas, checkbox selesai, dan hapus menggunakan createElement, textContent, append, dan splice. Tugas kosong/spasi ditolak. Data dan status selesai disimpan ke localStorage.

Setiap fitur memakai key penyimpanan berbeda. Semua logika berada di script.js; fungsi dibungkus untuk mencegah konflik variabel. Prefix ID menghindari konflik elemen antarfitur. Data yang dimasukkan ditampilkan melalui textContent.

## Pengujian

- Mahasiswa: submit kosong, input salah, tambah valid, NIM duplikat, refresh.
- Post: Next/Previous, search huruf kapital, hasil kosong, search dari halaman terakhir, kosongkan search. Uji Coba Lagi saat fetch gagal.
- Tema: aktifkan dark mode, periksa semua bagian berubah, refresh, kembali ke light mode.
- Todo: tambah, tolak spasi, tandai selesai, refresh, hapus, refresh lagi.
- Responsif: perkecil layar; panel menjadi satu kolom dan tabel mahasiswa dapat digeser horizontal.

Sintaks serta integrasi ID diperiksa saat pembuatan. Pengujian browser langsung dan koneksi API dari perangkat pengguna masih perlu dilakukan.
