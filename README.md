# uts-pemweb-123140149
# 🐾 Proyek Galeri Fakta Hewan

Ini adalah proyek aplikasi web galeri hewan (Anjing & Kucing) yang dibuat untuk memenuhi tugas UTS Pemrograman Web.

## 🚀 Link Demo

**Aplikasi dapat diakses langsung di sini:** [https://nama-proyek-anda.vercel.app/](https://nama-proyek-anda.vercel.app/) 
*(Ganti ini dengan link Vercel Anda)*

---

## 📸 Screenshot

*(Sangat penting untuk Kriteria Penilaian!)*

**Tampilan Desktop:**
![Tampilan Desktop Aplikasi](link-ke-screenshot-desktop.png)

**Tampilan Mobile:**
![Tampilan Mobile Aplikasi](link-ke-screenshot-mobile.png)

*(Cara menambah screenshot: Ambil screenshot, masukkan file .png itu ke dalam folder proyek Anda (misal, buat folder `screenshots/`), lalu gunakan link lokal seperti di atas).*

---

## 💻 Technical Stack

* **Framework:** ReactJS (via Vite)
* **Styling:** CSS Murni (Flexbox, CSS Grid, Media Queries)
* **HTTP Client:** Axios
* **State Management:** React Hooks (useState, useEffect)
* **API yang Digunakan:**
    * Dog API (https://dog.ceo/dog-api/)
    * The Cat API (https://api.thecatapi.com/)
    * Cat Facts API (https://catfact.ninja/)
* **Deployment:** Vercel

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

1.  Clone repositori ini:
    ```bash
    git clone [link-github-anda.git]
    ```
2.  Masuk ke direktori proyek:
    ```bash
    cd my-app
    ```
3.  Install semua dependensi:
    ```bash
    npm install
    ```
4.  Buat file `.env.local` dan masukkan API Key Kucing Anda:
    ```
    VITE_CAT_API_KEY="KEY_ANDA_DARI_THECATAPI.COM"
    ```
5.  Jalankan development server:
    ```bash
    npm run dev
    ```