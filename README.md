# NoteUR — Personal Note App

**Live Demo:** [https://noteur.netlify.app](https://noteur.netlify.app)

NoteUR adalah aplikasi catatan pribadi berbasis React untuk membantu pengguna menulis, melihat, mencari, mengarsipkan, dan menghapus catatan melalui antarmuka web yang sederhana.

## Fitur

- **Catatan aktif:** melihat daftar catatan yang belum diarsipkan beserta judul, tanggal dibuat, dan ringkasan isi.
- **Detail catatan:** membuka catatan tertentu untuk membaca isinya.
- **Tambah catatan:** membuat catatan dengan mengisi judul dan isi melalui form.
- **Hapus catatan:** menghapus catatan yang tidak diperlukan lagi.
- **Arsip:** mengarsipkan catatan dan mengembalikannya ke daftar aktif.
- **Pencarian:** menyaring catatan berdasarkan judul.
- **Pencarian pada URL:** kata kunci pencarian disimpan sebagai query parameter sehingga dapat terlihat pada URL.
- **Halaman 404:** menampilkan halaman khusus untuk rute yang tidak dikenali.

## Teknologi

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- JavaScript
- CSS

## Menjalankan Proyek di Lokal

### Prasyarat

Pastikan [Node.js](https://nodejs.org/) dan npm telah terpasang.

### Langkah instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/RafieFirman/Personal-Note-App.git
   ```

2. Masuk ke direktori proyek:

   ```bash
   cd Personal-Note-App
   ```

3. Instal dependensi sesuai lockfile:

   ```bash
   npm ci
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka alamat lokal yang ditampilkan oleh Vite di terminal.

## Build Produksi

Buat build aplikasi dengan perintah:

```bash
npm run build
```

Untuk menjalankan pratinjau hasil build:

```bash
npm run preview
```

## Struktur Proyek

```text
Personal-Note-App/
├── public/       # Aset statis
├── src/          # Halaman, komponen, konteks, utilitas, dan stylesheet
├── index.html    # HTML utama aplikasi
├── package.json  # Dependensi dan scripts
├── package-lock.json
└── vite.config.js
```

## Catatan

NoteUR merupakan proyek pembelajaran React. Data catatan pada implementasi saat ini dikelola melalui data lokal aplikasi dan tidak menggunakan backend untuk sinkronisasi data antarpengguna.

## Lisensi

Repository ini belum menyertakan lisensi open-source. Silakan hubungi pemilik repository sebelum menggunakan ulang kode untuk kebutuhan lain.
