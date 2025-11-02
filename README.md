# Galeri Fakta Hewan

Ini adalah proyek aplikasi web yang dibuat untuk memenuhi Ujian Tengah Semester mata kuliah Pengembangan Aplikasi dan Web (RB).

- Nama: Fadzilah Saputri
- NIM: 123140149
- Kelas: Pengembangan Aplikasi dan Web (RB)

# Link Deployment

Aplikasi ini dapat diakses secara publik melalui link Vercel berikut:
https://galerifaktahewan.vercel.app/

# Deskripsi Proyek

Galeri Fakta Hewan adalah sebuah aplikasi web interaktif yang memungkinkan pengguna untuk menjelajahi galeri gambar dan menemukan fakta-fakta menarik tentang anjing dan kucing.

Aplikasi ini dibangun dengan layout dua kolom (sidebar kontrol dan area konten) yang responsif. Pengguna dapat mengalami pengalaman mereka dengan memasukkan nama panggilan (yang akan digunakan untuk sapaan), memilih ras hewan tertentu, dan menyimpan gambar favorit mereka.

# Tampilan Aplikasi

- Tampilan awal
![alt text](<Screenshot 2025-11-02 191926.png>)
- Memilih menu Anjing dan mengisi formulir di panel sebelah kiri yang sudah disediakan
![alt text](<Screenshot 2025-11-02 191955.png>)
- Menampilkan Fakta tentang Anjing
![alt text](<Screenshot 2025-11-02 192009.png>)
- Memilih menu Kucing dan mengisi formulir di panel sebelah kiri yang sudah disediakan
![alt text](<Screenshot 2025-11-02 192112.png>)
- Menampilkan Fakta tentang Kucing
![alt text](<Screenshot 2025-11-02 192122.png>)
- Menu Favorit ketika menambahkan gambar favorit
![alt text](<Screenshot 2025-11-02 192203.png>)

# Technical Stack

- Framework: React 19 (dijalankan dengan Vite)
- Styling: Ant Design (antd)
- Manajemen State: React Hooks (useState, useEffect)
- HTTP Client: Axios
- Deployment: Vercel

# Cara Instalasi dan Menjalankan

1. Clone repositori ini ke komputer Anda.

2. Buka terminal dan masuk ke direktori proyek:

```cd my-app```

3. Install semua dependency yang diperlukan:

```npm install```

4. Buat file .env.local di root folder proyek untuk menyimpan API key.

5. Masukkan API key Anda dari The Cat API:

```VITE_CAT_API_KEY="KEY_ANDA_DARI_THECATAPI_COM"```

6. Jalankan server pengembangan (development server):
```npm run dev```

7. Buka http://localhost:5173 di browser Anda.

# Catatan dan Keterbatasan

Aplikasi ini bergantung pada beberapa API pihak ketiga gratis. Ada beberapa keterbatasan yang perlu diketahui selama penggunaan:

1. Fakta Anjing Menggunakan Data Statis (Mock)
Selama pengembangan, API publik untuk fakta anjing (dog-api.kinduff.com dan dog-api.duk.io) terbukti tidak stabil dan sering down. Untuk menjamin fungsionalitas 100% dan pengalaman pengguna yang lancar, fitur fakta anjing saat ini menggunakan mock data (data statis) yang disimpan langsung di dalam kode. Fakta kucing tetap ditarik dari API live.

2. Inkonsistensi Jumlah Gambar (Berdasarkan Ras)
Saat meminta gambar kucing berdasarkan ras tertentu, TheCatAPI mungkin mengembalikan jumlah gambar yang berbeda (biasanya lebih sedikit) dari yang diminta. Ini adalah keterbatasan dari API itu sendiri yang databasenya mungkin terbatas untuk ras spesifik tersebut.

3. Blokir Sementara API (Error 429)
API fakta kucing (catfact.ninja) menerapkan rate limiting (pembatasan permintaan). Jika terlalu sering mengklik tombol "Refresh Fakta" dalam waktu singkat, nantinya akan melihat pesan Error 429 (Too Many Requests). Ini adalah perilaku yang normal. Solusinya adalah menunggu 5-10 menit hingga API membuka blokir sementara tersebut, dan fakta akan muncul kembali.