# 🌌 Astro Motion Portfolio - Next.js & Firebase Edition

Website portofolio interaktif dan modern yang diadaptasi dari template **Astro Motion** dengan integrasi **Full-Stack Next.js 15**, **React 19**, **Tailwind CSS v4**, serta **Admin Dashboard (CMS)** berbasis **Firebase Firestore & Authentication**.

> [!IMPORTANT]
> **Keterangan Modifikasi & Lisensi Asli (Attribution & Disclaimer):**  
> Proyek ini merupakan **karya modifikasi & rekonstruksi ulang**. Desain tampilan visual asli dibuat oleh [TemplateMo](https://templatemo.com) (*TemplateMo 564 Astro Motion*). Keterangan lisensi dan kredit desainer asli tetap dipertahankan pada **footer website** (*Designed by TemplateMo*).  
>  
> **Peningkatan & Modifikasi yang Diterapkan:**
> - Dirombak total dari HTML5/jQuery/CSS statis menjadi arsitektur modern **Next.js 15 (App Router)** dan **React 19**.
> - Ditulis ulang secara penuh dengan **TypeScript** untuk static type-checking yang aman dan skalabel.
> - Menggunakan engine styling terbaru **Tailwind CSS v4** dengan *dynamic CSS variables*.
> - Penambahan **Full CMS Admin Dashboard** (`/admin`) dengan autentikasi admin via **Firebase Auth**.
> - Seluruh konten (teks, gambar Google Drive, tautan resume, portofolio, form kontak, hingga warna aksen tema) dapat diubah langsung secara *real-time* melalui Firebase Firestore tanpa harus menyentuh kode program.
> - Pelacak statistik kunjungan website (*pageviews*, *unique visitors*) otomatis.

---

## 🛠️ Framework & Teknologi yang Digunakan

Website ini dibangun menggunakan ekosistem teknologi modern:

| Komponen / Fitur | Teknologi / Pustaka | Versi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Framework Utama** | [Next.js](https://nextjs.org/) | `15.3.3` | App Router, Static Site Generation (SSG / Static Export `output: "export"`) |
| **Library UI** | [React](https://react.dev/) | `19.0.0` | React Server/Client Components, Context API |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | `^5.0.0` | Strict type safety di seluruh komponen & konfigurasi |
| **Styling & CSS** | [Tailwind CSS](https://tailwindcss.com/) | `^4.0.0` | Engine Tailwind CSS v4 terbaru dengan PostCSS |
| **Icon Set** | [Lucide React](https://lucide.dev/) | `^0.475.0` | Icon SVG modern, ringan, dan konsisten |
| **Backend & Database** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) | `^12.17.1` (SDK v12) | NoSQL Realtime Database untuk menyimpan seluruh data konten CMS |
| **Autentikasi** | [Firebase Authentication](https://firebase.google.com/docs/auth) | `^12.17.1` (SDK v12) | Sistem login aman untuk akun pengelola Admin Dashboard |
| **Hosting & Deploy** | Firebase Hosting / Vercel / Netlify | - | Siap di-*deploy* sebagai Static HTML Export di berbagai platform |
| **Layanan Kontak** | [Formspree](https://formspree.io/) | - | Endpoint pengiriman pesan dari formulir kontak langsung ke email |

---

## ✨ Fitur-Fitur Unggulan

1. **Latar Belakang Video Sinematik (*Ambient Background Video*)**:
   - Pemutaran video latar *autoplay loop* mulus dengan overlay estetis.
2. **Navigasi Tab Interaktif**:
   - Transisi mulus antar seksi (*Home*, *Projects Gallery*, *About*, *Contact*).
3. **Admin Dashboard Terintegrasi (`/admin`)**:
   - **Navigation & Footer**: Ubah nama brand, teks menu, copyright, dan tautan desainer.
   - **Home Section**: Ubah *headline*, paragraf perkenalan, link Resume/CV, dan sertifikat (Google Drive embed).
   - **Projects Gallery**: Tambah, edit, hapus proyek lengkap dengan gambar, tag kategori, deskripsi, dan link live demo.
   - **About Section**: Kelola deskripsi profil diri serta kartu-kartu keunggulan / keahlian (*skill cards*).
   - **Contact & Sosmed**: Atur email, nomor telepon, query Google Maps, Formspree endpoint, dan sosial media (LinkedIn, GitHub, Instagram, Twitter/X).
   - **Color Theme Customizer**: Ganti warna aksen utama website (*primary color*) dengan pemilih warna interaktif (*color picker*). Warna berubah seketika di seluruh halaman (*real-time*).
4. **Optimalisasi Media Google Drive**:
   - Mendukung input gambar langsung dari Google Drive (otomatis dikonversi ke direct streaming URL & *auto-cropped*).
5. **Statistik Pengunjung Otomatis**:
   - Menghitung jumlah kunjungan (*pageviews* & *unique visits*) serta estimasi data yang disajikan di dashboard admin.

---

## 📁 Struktur Direktori Proyek

```text
├── app/
│   ├── admin/                # Halaman CMS Admin Dashboard & Login
│   │   ├── login/            # Halaman login otentikasi Firebase
│   │   └── page.tsx          # Dashboard admin interaktif untuk mengedit konten
│   ├── components/           # Komponen UI utama (Navbar, Sections, Footer, Preloader)
│   ├── globals.css           # Konfigurasi Tailwind CSS v4 & custom theme variables
│   ├── layout.tsx            # Root layout, Google Fonts (Source Sans 3), & SEO Meta Tags
│   └── page.tsx              # Halaman beranda utama dengan tab navigation
├── lib/
│   ├── ConfigContext.tsx     # Context API untuk sinkronisasi config (Firestore + LocalStorage)
│   ├── defaultConfig.ts      # Data default website jika Firestore belum terisi
│   ├── firebase.ts           # Inisialisasi Firebase App, Auth, & Firestore SDK
│   ├── stats.ts              # Fungsi pencatatan statistik kunjungan website
│   ├── types.ts              # Interface & Type definition TypeScript
│   └── utils.ts              # Helper parser Google Drive link, format data, dll.
├── public/                   # Asset statis (video, gambar favicon, icon, open graph preview)
├── .env.example              # Template variabel lingkungan Firebase
├── .firebaserc               # Konfigurasi target project Firebase CLI
├── firebase.json             # Konfigurasi Firebase Hosting & rewrite rules
├── next.config.ts            # Konfigurasi Next.js (output: "export" untuk static build)
├── package.json              # Daftar dependencies & script npm
├── tsconfig.json             # Konfigurasi compiler TypeScript
└── README.md                 # Dokumentasi panduan proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terinstal:
- **Node.js**: Versi `18.18.0` atau yang lebih baru (Disarankan Node.js `20.x` LTS).
- **npm** (bawaan Node.js), **yarn**, atau **pnpm**.
- Akun Google / [Firebase Console](https://console.firebase.google.com/) (Gratis - Spark Plan).

---

### 2. Kloning Repositori
Buka terminal Anda dan jalankan perintah berikut:

```bash
# Kloning repositori dari GitHub
git clone https://github.com/USERNAME_ANDA/NAMA_REPOSITORY.git

# Masuk ke direktori proyek
cd NAMA_REPOSITORY
```

---

### 3. Instalasi Dependensi
Jalankan perintah berikut untuk mengunduh seluruh library yang dibutuhkan:

```bash
npm install
```

---

### 4. Konfigurasi Firebase SDK

Proyek ini memerlukan kredensial Firebase untuk fitur database Firestore dan autentikasi login Admin.

#### A. Buat Proyek di Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com/) dan klik **Add project**.
2. Masukkan nama proyek Anda, lalu ikuti instruksi hingga selesai.
3. Di dalam proyek Anda, buat **Web App** (klik ikon web `</>`). Beri nama aplikasi dan klik **Register app**.
4. Anda akan melihat blok konfigurasi Firebase SDK yang berisi `apiKey`, `authDomain`, `projectId`, dll.

#### B. Aktifkan Layanan Firebase
1. **Authentication**:
   - Di menu sebelah kiri Firebase Console, klik **Build ➔ Authentication**.
   - Klik **Get Started**, pilih tab **Sign-in method**, lalu aktifkan provider **Email/Password**.
   - Buka tab **Users**, klik **Add user**, lalu buat akun Email dan Password yang akan Anda gunakan untuk login ke `/admin`.
2. **Cloud Firestore**:
   - Di menu sebelah kiri, klik **Build ➔ Firestore Database**.
   - Klik **Create database**, pilih lokasi database terdekat (misalnya `asia-southeast1` untuk Jakarta/Singapura).
   - Pada pilihan aturan keamanan, pilih **Start in production mode**.
   - Buka tab **Rules** pada Firestore, lalu atur aturan agar publik dapat membaca konfigurasi & mencatat kunjungan, namun hanya admin login yang dapat mengedit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pengaturan konfigurasi website
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Statistik pengunjung website
    match /stats/{document=**} {
      allow read, write: if true;
    }
  }
}
```
Klik **Publish**.

#### C. Masukkan Kredensial ke dalam Proyek
Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Buka file `.env.local` dan masukkan kredensial Firebase SDK Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyek-anda.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyek-anda
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyek-anda.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# URL domain website Anda (opsional, untuk meta tags OpenGraph)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 *Catatan:* Konfigurasi di atas dibaca secara otomatis oleh file `lib/firebase.ts`. Jika Anda memilih tidak menggunakan `.env.local`, Anda juga dapat memasukkan nilai konfigurasi langsung di `lib/firebase.ts`.

---

### 5. Menjalankan Server Lokal (Development)

Jalankan perintah berikut:

```bash
npm run dev
```

Buka browser dan akses alamat:
- **Tampilan Website**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) (Login menggunakan email & password admin yang telah didaftarkan di Firebase Authentication).

---

### 6. Build untuk Produksi & Deployment

Website ini menggunakan fitur **Static Export** (`output: "export"` pada `next.config.ts`), sehingga menghasilkan file HTML, CSS, dan JS statis di direktori `out/`.

Untuk melakukan build:

```bash
npm run build
```

Hasil build berada di folder `out/` dan dapat langsung di-*deploy* ke:
- **Firebase Hosting**:
  1. Login ke Firebase CLI: `npx firebase login`
  2. Inisialisasi/atur proyek: `npx firebase use --add` (pilih Project ID Anda)
  3. Deploy: `npx firebase deploy --only hosting`
- **Vercel / Netlify / GitHub Pages**:
  - Hubungkan repositori GitHub Anda ke Vercel/Netlify.
  - Masukkan variabel lingkungan dari `.env.example` ke dashboard Vercel/Netlify.
  - Set build command: `npm run build` dan output directory: `out`.

---

## 📖 Panduan Penggunaan Halaman Admin CMS

Setelah login di `/admin`, Anda dapat mengelola seluruh elemen website:

1. **Mengubah Teks & Navigasi**:
   - Di tab **Navigation & Footer**, **Home**, dan **About**, Anda bisa mengubah teks judul, subjudul, dan deskripsi secara bebas.
2. **Memasukkan Gambar dari Google Drive**:
   - Unggah gambar ke Google Drive Anda.
   - Klik kanan gambar ➔ **Share** ➔ ubah akses menjadi **Anyone with the link**.
   - Salin tautan dan tempelkan ke kolom URL gambar di Admin. Sistem akan otomatis memproses dan menampilkannya secara presisi.
3. **Link File Resume / CV & Sertifikat**:
   - Unggah file PDF ke Google Drive dengan akses *Anyone with the link*.
   - Tempel tautan pada kolom **Resume Link** atau **Certificate Link**.
4. **Formulir Kontak (Formspree)**:
   - Buat formulir baru secara gratis di [Formspree.io](https://formspree.io/).
   - Salin Endpoint Formspree (contoh: `https://formspree.io/f/xzyqwbdr`) ke kolom **Formspree Endpoint Link** di tab Contact.
5. **Mengubah Warna Utama (*Theme Color*)**:
   - Masuk ke tab **Primary Theme & Media**.
   - Pilih warna yang diinginkan melalui kotak warna. Seluruh aksen warna website (tombol, link, scrollbar) akan langsung berubah.
6. **Menyimpan Perubahan**:
   - Pastikan selalu menekan tombol hijau **Save All Changes** di pojok kanan atas setelah selesai melakukan pengeditan.

---

## 📄 Lisensi & Kredit

- **Desain Asli**: [TemplateMo](https://templatemo.com) (*TemplateMo 564 Astro Motion*).
- **Modifikasi & Pengembangan Web Modern**: Dibuat ulang menggunakan Next.js 15, React 19, TypeScript, Tailwind CSS v4, dan Firebase.
- Hak cipta desain visual dan aset gambar orisinal tetap berada pada pemilik aslinya sesuai lisensi TemplateMo.
