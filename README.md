# NoteUR — Personal Note App

**Live Demo:** [https://noteur.netlify.app](https://noteur.netlify.app)

NoteUR adalah aplikasi catatan pribadi berbasis React. Aplikasi menyediakan daftar catatan aktif, detail catatan, pencarian, arsip, dan penghapusan. Dengan konfigurasi Supabase, pengguna dapat mendaftar dan masuk untuk menyimpan catatan ke database online.

## Fitur

- Membuat, membaca, mengarsipkan, membatalkan arsip, dan menghapus catatan.
- Pencarian catatan berdasarkan judul dengan query parameter URL.
- Login dan registrasi menggunakan email dan password Supabase Auth.
- Penyimpanan catatan di PostgreSQL melalui Supabase.
- Pembatasan data per pengguna menggunakan Row Level Security (RLS).
- Halaman 404 dan tampilan status saat catatan sedang dimuat.

## Teknologi

- React
- React Router
- Vite
- Supabase Auth dan PostgreSQL
- JavaScript dan CSS

## Menyiapkan Supabase

Penyimpanan permanen aktif setelah kamu menghubungkan aplikasi ke project Supabase. Tanpa konfigurasi tersebut, aplikasi berjalan dalam **mode demo lokal** dan perubahan catatan tidak bertahan setelah halaman dimuat ulang.

1. Buat project di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor** pada project tersebut, lalu jalankan seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql). Skrip ini membuat tabel `public.notes` dan kebijakan RLS agar pengguna hanya dapat mengakses catatan miliknya.
3. Buka pengaturan API/Connect pada project Supabase dan salin **Project URL** serta **publishable key**. Jangan gunakan service-role key di frontend.
4. Salin file `.env.example` menjadi `.env.local`, lalu isi nilainya:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

5. Instal dependensi dan jalankan aplikasi:

   ```bash
   npm ci
   npm run dev
   ```

6. Daftar melalui halaman NoteUR, lalu login. Jika project meminta konfirmasi email, buka email konfirmasi terlebih dahulu, kemudian login ke aplikasi.

## Konfigurasi Netlify

Agar versi deploy menggunakan database online:

1. Buka pengaturan site di Netlify dan cari **Environment variables**.
2. Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dengan nilai dari project Supabase yang sama.
3. Jalankan deploy ulang agar variabel tersedia pada build frontend.
4. Uji registrasi/login, pembuatan catatan, arsip, pembatalan arsip, dan penghapusan. Muat ulang halaman untuk memastikan perubahan tetap tersimpan.

Publishable key memang digunakan di frontend. Keamanan data bergantung pada kebijakan RLS di database. Jangan pernah menambahkan service-role key atau password database ke file frontend maupun repository.

## Menjalankan Secara Lokal

Prasyarat: Node.js dan npm.

```bash
git clone https://github.com/RafieFirman/Personal-Note-App.git
cd Personal-Note-App
npm ci
npm run dev
```

Untuk build produksi dan melihat pratinjaunya:

```bash
npm run build
npm run preview
```

## Struktur Proyek

```text
Personal-Note-App/
├── src/
│   ├── context/       # State catatan dan autentikasi
│   ├── lib/            # Integrasi Supabase
│   ├── pages/          # Halaman aplikasi dan autentikasi
│   └── styles/         # Stylesheet
├── supabase/
│   └── schema.sql      # Tabel dan kebijakan RLS
├── .env.example        # Template konfigurasi environment
├── index.html
├── package.json
└── package-lock.json
```

## Lisensi

Repository ini belum menyertakan lisensi open-source.
