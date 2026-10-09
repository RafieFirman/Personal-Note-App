# Personal Note App

Aplikasi catatan pribadi berbasis React yang membantu pengguna membuat, membaca, mencari, mengarsipkan, dan menghapus catatan melalui antarmuka web sederhana.

## Fitur

- **Daftar catatan:** menampilkan catatan aktif beserta judul, tanggal pembuatan, dan isi catatan.
- **Detail catatan:** membuka satu catatan untuk melihat isi lengkapnya.
- **Tambah catatan:** membuat catatan baru dengan judul dan isi.
- **Hapus catatan:** menghapus catatan yang tidak lagi diperlukan.
- **Arsip catatan:** memindahkan catatan ke arsip dan mengembalikannya ke daftar aktif.
- **Pencarian:** mencari catatan berdasarkan judul.
- **URL pencarian:** menyimpan kata kunci pencarian pada query parameter URL.
- **Halaman 404:** menampilkan halaman khusus saat alamat yang dibuka tidak cocok dengan rute aplikasi.

## Teknologi

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- JavaScript
- CSS

## Menjalankan Secara Lokal

### Prasyarat

Pastikan [Node.js](https://nodejs.org/) dan npm sudah terpasang.

### Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/RafieFirman/Personal-Note-App.git
   ```

2. Masuk ke direktori proyek:

   ```bash
   cd Personal-Note-App
   ```

3. Pasang dependensi:

   ```bash
   npm ci
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka alamat lokal yang ditampilkan oleh Vite di terminal.

## Build untuk Produksi

Untuk membuat build aplikasi, jalankan:

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

## Struktur Proyek

```text
Personal-Note-App/
├── public/       # Aset statis
├── src/          # Komponen, halaman, konteks, utilitas, dan stylesheet
├── index.html    # HTML utama aplikasi
├── package.json  # Dependensi dan scripts
├── package-lock.json
└── vite.config.js
```

## Catatan

Aplikasi ini merupakan proyek pembelajaran React. Catatan awal disediakan oleh data lokal aplikasi; repository ini tidak mendokumentasikan backend atau sinkronisasi data antarpengguna.

## Lisensi

Belum ada lisensi open-source yang ditetapkan pada repository ini. Hubungi pemilik repository sebelum menggunakan ulang kode di luar ketentuan yang berlaku.
