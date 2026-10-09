# Vervast Hotel Revamp — Design System & Layout Rules

Dokumen ini adalah aturan paten dan pedoman desain untuk seluruh halaman web aplikasi Vervast Hotel Revamp. Semua halaman harus mematuhi aturan ini agar tampilan konsisten, elegan, mewah (*luxury*), dan tidak bertumpuk/remek.

---

## 1. Skema Warna & Token Desain (Black & White Minimalist + Muted Accent Indicators)
- **Latar belakang canvas & kartu**: Selalu **putih murni (`bg-white`)** dan kartu bersih (`bg-zinc-50/50 backdrop-blur-sm`).
- **DILARANG MENGGUNAKAN WARNA COKLAT / BEIGE APAPUN**: Dilarang mewarnai canvas, kartu, border, daratan peta, maupun badge dengan warna coklat, krem, linen, atau tanah. Dashboard mempertahankan tema mewah hitam-putih (*luxury monochrome black & white*).
- **DILARANG MENGGUNAKAN WARNA-WARNA CERAH / NEON / ELEKTRIK**: Hindari warna cerah mencolok. Gunakan nada warna dalam/gelap (*deep muted executive tones*).
- **Warna Selain Hitam & Putih HANYA UNTUK DETAIL KECIL SAJA**:
  - **Teks Utama / Angka Besar**: `text-zinc-900`
  - **Teks Sekunder / Body**: `text-zinc-700` atau `text-zinc-600`
  - **Label / Metrik / Placeholder**: `text-zinc-500` atau `text-zinc-400`
  - **Garis Pembatas (Borders)**: `border-zinc-100` atau `border-zinc-200/80`
  - **Indikator Tren Naik (Positive YoY/MoM)**: **Hijau Tua** (`text-[#14532d]` / `bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80`)
  - **Indikator Tren Turun / Risiko (Negative YoY/MoM)**: **Maroon** (`text-[#800020]` / `bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80`)
  - **Indikator Netral / On Plan**: `bg-zinc-100 text-zinc-600 border border-zinc-200/80`
  - **Status Dots (Peta & Komparasi Portofolio)**: Hijau tua `#14532d` (`above_plan`), abu-abu netral `zinc-500` (`on_plan`), merah maroon `#800020` (`attention`).
  - **Visualisasi Chart**:
    - **World Map**: Daratan berwarna monokrom abu-abu terang bersih (`#ebecee` / `stroke #d4d4d8`), laut putih murni, tanpa filter tekstur kertas coklat.
    - **Booking Pace Chart**: Garis kurva utama hitam solid `#18181b`, area halus pudar hitam, garis STLY putus-putus abu-abu `#a1a1aa`.
    - **Forward Business Stacked Bar**: Lapisan committed hitam solid `bg-zinc-900`, lapisan tentative abu-abu terang `bg-zinc-200`.
    - **Revenue & Demand Donut Chart**: Gradasi mewah monokrom hitam ke abu-abu (*luxury black to slate gray scale*): Rooms `#0f172a`, F&B `#334155`, Spa `#475569`, Wellness `#64748b`, Activities `#94a3b8`, Packages `#cbd5e1` (konsisten dengan skema elegan monokrom Market Segment Mix).

---

## 2. Hirarki Tipografi & Font Weight
1. **Section Headers (Judul Bagian/Widget)**:
   - `text-[10px] font-bold uppercase tracking-widest text-zinc-900`
   - Ketinggian baris judul tetap: `h-4 mb-3`
2. **KPI Metric Labels (Label Indikator KPI Atas)**:
   - `text-[10px] font-normal tracking-wider uppercase text-zinc-900`
3. **KPI Numbers / Nilai Besar**:
   - `text-[22px] font-normal text-zinc-900 leading-tight` (atau `leading-none`)
4. **Sub-title / Deskripsi / Tanggal**:
   - `text-[9.5px] text-zinc-500 font-medium` atau `text-[9px] text-zinc-400 font-normal`
5. **Header Kolom Tabel (Table Headers)**:
   - **TIDAK BOLEH UPPERCASE**: Gunakan Title Case biasa.
   - `text-[9.5px] font-medium text-zinc-400` (contoh: `Room Type`, `Revenue`, `Trend`, `Channel`, `% Share`)
6. **Teks Baris Tabel (Table Rows)**:
   - Nama/Kategori: `text-[10px] font-medium text-zinc-700 truncate`
   - Angka/Nominal: `text-[10px] font-medium text-zinc-900 text-right`
   - Tren: `text-[9.5px] font-medium text-emerald-700 text-right`

---

## 3. Styling & Efek Kartu (Card Hover Elevation)
Seluruh kartu widget harus konsisten:
- **Container Class**:
  ```tsx
  className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
  ```
- **Padding Kartu**: Selalu `p-4` (atau `p-3.5 sm:p-4`).
- **Border Radius**: Selalu `rounded-[12px]`.
- **Dilarang Menaruh Ikon Kotak / Icon Box Berat**: Hindari icon box besar di dalam list item kartu agar tampilan tidak ramai. Gunakan layout tipografi bersih.
- **Dilarang Menaruh Tombol Footer Berulang**: Jangan gunakan footer tombol *"View All →"* atau sejenisnya di setiap kartu (kartu sudah interaktif via drawer).
- **Dilarang Menggunakan Emotikon / Emoji Teks**: **DILARANG KERAS** menggunakan emoji/emotikon teks (seperti 📅, 🛏️, ⚠️, 🟢, 🔴, 💡, 🏨, dsb) di seluruh dashboard, kartu widget, label metrik, ataupun drawer. Selalu gunakan icon SVG vector elegan dari `@solar-icons/react` (contoh: `Calendar`, `Bed`, `PieChart2`, `TagPrice`, `DangerTriangle`) atau indikator status dot CSS/SVG yang bersih. Desain harus mempertahankan standar kemewahan (*luxury executive grade*).

---

## 4. Struktur Grid & Urutan Layer Dashboard (Definitive Ordering)
Untuk memastikan tampilan konsisten, simetris, dan mewah tanpa remek:
1. **Urutan Baris Dashboard (Hierarki Eksekutif)**:
   - **ROW 1 — Hero Executive**: `World Map` (56%) + `Portfolio Performance` (5 KPI Cards, 44%).
   - **ROW 2 — Tier 1 Core Drivers (3 Kartu Sejajar 4-4-4)**:
     1. `Booking Pace` (`lg:col-span-4`)
     2. `Revenue & Demand Mix` (`lg:col-span-4`)
     3. `Forward Business` (`lg:col-span-4`)
   - **ROW 3 — Tier 2 Segmentation & Signals (3 Kartu Sejajar 4-4-4)**:
     4. `Global Segmen (Geo Market)` (`lg:col-span-4`)
     5. `Market Segment` (`lg:col-span-4`)
     6. `SOSEI Signals` (`lg:col-span-4`)
   - **ROW 4 — Tier 3 Operational & Guest Sentiment (Status: Di-Hide Sementara)**:
     7. `Sentiment Score` *(Temporarily Hidden per user request)*
     8. `Top Guest Needs` *(Temporarily Hidden per user request)*
   - **ROW 4 (Aktif) — Full-Width Benchmark**:
     9. `Portfolio Comparison` (Full-width `col-span-12`).
2. **Ketinggian Sama & Distribusi Vertikal**:
   - Setiap kartu di baris yang sama wajib menggunakan `h-full justify-between`.
   - Konten di dalam kartu menggunakan `flex-1 flex flex-col justify-between` agar elemen pertama dan elemen terakhir pada kartu bersebelahan sejajar rata.
3. **Pemisah Antar Layer**:
   - Gunakan `gap-4` alami tanpa garis horizontal keras (`border-t / hr`).

---

## 5. Visualisasi Chart
- **Donut Chart**: Selalu gunakan **Pure SVG Vector Donut** (`size={110}`, `strokeWidth={14}`) agar 100% bulat sempurna, razor-sharp, dan tidak terpotong oleh Recharts `ResponsiveContainer`.
- **Progress Bar**: Tipis dan minimalis (`h-1.5 bg-zinc-100 rounded-full`, bar: `bg-zinc-800 rounded-full`).

---

## 6. Standar Struktur Folder (Project Architecture)
Seluruh kode aplikasi harus mengikuti struktur modular berbasis fitur (*feature-driven architecture*) dan komponen *reusable*:

```text
my-react-app/
├── public/
│   ├── images/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── App.tsx          # Root application shell & router mounting
│   │   ├── routes.tsx       # Route definitions & route guards
│   │   └── providers.tsx    # Context providers wrapper (Theme, Toast, etc.)
│   │
│   ├── assets/
│   │   ├── images/          # Static image assets
│   │   ├── icons/           # Custom SVG/Icon assets
│   │   └── fonts/           # Custom typography files
│   │
│   ├── components/
│   │   ├── ui/              # Reusable UI Primitives (Atomic)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── index.ts
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── layout/          # Layout Shell Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MasterLayout.tsx
│   │   │
│   │   └── common/          # Reusable Shared States & Feedback Components
│   │       ├── Loading.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorState.tsx
│   │
│   ├── features/            # Modular Feature Domains
│   │   ├── auth/
│   │   │   ├── api/auth.api.ts
│   │   │   ├── components/ (LoginForm, RegisterForm, etc.)
│   │   │   ├── hooks/useAuth.ts
│   │   │   ├── types/auth.types.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── api/dashboard.api.ts
│   │   │   ├── components/ (Widgets, Drawers, MetricCards)
│   │   │   ├── hooks/useDashboard.ts
│   │   │   ├── types/dashboard.types.ts
│   │   │   └── index.ts
│   │   └── users/
│   │       ├── api/users.api.ts
│   │       ├── components/ (UserCard, UserList)
│   │       ├── hooks/useUsers.ts
│   │       ├── types/users.types.ts
│   │       └── index.ts
│   │
│   ├── pages/               # Page Route Components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/               # Global / Shared Custom Hooks
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── services/            # Infrastructure Services
│   │   ├── api/
│   │   │   ├── client.ts        # Configured Axios Client
│   │   │   └── interceptors.ts  # Token & Error Interceptors
│   │   └── storage/
│   │       └── storage.ts       # Typed LocalStorage Service
│   │
│   ├── stores/              # Global Reactive State Stores
│   │   ├── auth.store.ts
│   │   └── app.store.ts
│   │
│   ├── types/               # Global TypeScript Interfaces
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/               # Pure Helper / Formatting Utilities
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── validation.ts
│   │
│   ├── constants/           # Global Application Constants
│   │   ├── routes.ts
│   │   └── config.ts
│   │
│   ├── main.tsx             # Application Entry Point
│   └── index.css            # Global CSS & Tailwind Directives
│
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 7. Pedoman Komponen Reusable (*Reusable Component Rules*)
Agar kode tidak berulang (*DRY*) dan tampilan tetap konsisten di seluruh modul:
1. **Atomic UI Primitives (`components/ui/[Component]/`)**:
   - Setiap komponen UI dasar diletakkan dalam foldernya sendiri dengan file utama `[Component].tsx` dan barrel `index.ts`.
   - Wajib menggunakan CVA (*class-variance-authority*) atau Tailwind class standar zinc, menerima `className`, dan mendukung `asChild` / native props.
2. **Layout Komponen (`components/layout/`)**:
   - `Navbar`, `Sidebar`, `Footer`, dan `MasterLayout` menjadi struktur kerangka utama.
   - Hindari membuat layout tersendiri di dalam halaman fitur; selalu gunakan layout induk via React Router `<Outlet />`.
3. **Common State Feedback (`components/common/`)**:
   - Gunakan `<Loading />`, `<EmptyState />`, dan `<ErrorState />` untuk semua penanganan data asinkron.
   - Dilarang membuat tampilan spinner atau banner error mentah berulang-ulang di setiap widget.
4. **Isolasi Fitur Modular (`features/[feature]/`)**:
   - Setiap fitur wajib mengemas:
     - `api/`: Panggilan API spesifik fitur.
     - `components/`: Komponen yang hanya digunakan dalam lingkup fitur tersebut.
     - `hooks/`: Custom hooks untuk state logis fitur.
     - `types/`: Deklarasi TypeScript spesifik fitur.
     - `index.ts`: Public API barrel export dari fitur tersebut.
5. **Shared Utilities & Hooks**:
   - Fungsi format uang wajib memakai `formatCurrency()` atau `formatCompactCurrency()` dari `@/utils/formatCurrency`.
   - Format tanggal wajib memakai `formatDate()` dari `@/utils/formatDate`.
   - State tersimpan di browser wajib memakai `useLocalStorage()` atau `storage` dari `@/services/storage/storage`.

---

## 8. Standar Portfolio Performance & Financial KPIs (Hospitality Heart)
Bagian **Portfolio Performance** adalah jantung finansial (*financial heart*) dari dashboard eksekutif:

### A. Time Horizon & Filter Global
- **Default Lensa Utama adalah MTD (Month-To-Date)**: Karena CEO membuka dashboard di pagi hari untuk memantau performa bulan berjalan (*how are we performing this month*). YTD tidak boleh mendominasi impresi awal.
- **Tiga Horizon Waktu CEO**:
  1. **Current / Today**: Status operasional saat ini (Occupancy hari ini, kedatangan, kepulangan, in-house guests).
  2. **MTD (Primary)**: Performa finansial bulan berjalan (Revenue, Occupancy, ADR, RevPAR vs LY & vs Budget).
  3. **Forward / Future**: OTB revenue, OTB room nights, booking pace, dan forecast.
- **Kontrol Filter Periode**:
  - Teks indikator periode: `Period: October 1–31, 2026` (atau tanggal periode aktif).
  - Tab filter interaktif: `[ Today ] [ MTD ] [ YTD ]` dengan status `MTD` aktif secara default.

### B. 5 Metrik Finansial Wajib (5 KPI Cards)
Setiap metrik menampilkan nilai utama dan **dua perbandingan sekaligus (dual comparisons)**: `vs LY` (Last Year) dan `vs Budget`:

1. **OCCUPANCY**
   - Lensa Utama: MTD (`74.2%`)
   - Perbandingan: Wajib menggunakan satuan **persentase poin (`pts`)**, bukan persen biasa (misal: `+4.8 pts vs LY`, `+2.1 pts vs Budget`), karena 6% growth berbeda secara finansial dengan 6 percentage-point growth.
2. **ADR (Average Daily Rate)**
   - Lensa Utama: MTD (`$1,420`)
   - Perbandingan: Nominal & Persentase (`+$85 vs LY (+6.0%)`, `+$42 vs Budget (+3.2%)`).
3. **REVPAR (Revenue Per Available Room)**
   - Lensa Utama: MTD (`$1,054`)
   - Perbandingan: Nominal & Persentase (`+$92 vs LY (+8.5%)`, `+$48 vs Budget (+4.1%)`).
4. **ROOM REVENUE**
   - Lensa Utama: MTD (`$118M`)
   - Perbandingan: Persentase pertumbuhan (`+14.0% vs LY`, `+5.2% vs Budget`).
5. **TOTAL HOTEL REVENUE (Executive Hotel KPI)**
   - Lensa Utama: MTD (`$152M`)
   - Perbandingan: Persentase pertumbuhan (`+11.0% vs LY`, `+4.0% vs Budget`).
   - Fungsi: Menjawab pertanyaan CEO *"What did the hotel business actually generate?"* secara menyeluruh, melampaui sekadar bisnis kamar.

### C. Arsitektur 5 Pilar Hospitality (Hospitality = Hotel Business)
Bisnis hospitality terdiri atas 5 pilar pendapatan yang terintegrasi:
```text
TOTAL HOTEL REVENUE ($152M)
├── Rooms Revenue        : $118M  (77.6%)
├── Food & Beverage (F&B): $22M   (14.5%)
├── Spa & Wellness      : $8M    (5.3%)
└── Activities & Others : $4M    (2.6%)
```
Kartu Total Hotel Revenue harus menyertakan visualisasi komposisi pilar atau drilldown ke dashboard masing-masing pilar (Rooms, F&B, Spa, Wellness, Activities).

### D. Aturan Styling Badge Perbandingan (Comparison Badges)
- Teks badge ringkas dan konsisten:
  - Positif: `bg-emerald-50 text-emerald-700 border border-emerald-100/60`
  - Netral / On Plan: `bg-zinc-100 text-zinc-700 border border-zinc-200/60`
  - Negatif: `bg-rose-50 text-rose-600 border border-rose-100/60`
- Font badge: `text-[8.5px]` atau `text-[9px] font-medium px-1.5 py-0.5 rounded`.

---

## 9. Aturan Spesifik Tiap Card Dashboard & Kamus Metrik (Card Rules Dictionary)
Setiap kartu (*widget*) pada dashboard memiliki aturan paten, tujuan bisnis (*executive intent*), dan panduan visual:

### 1. Kartu 1: World Overview Map (Orientasi Visual Portofolio Global)
- **Tujuan**: Memberi orientasi visual instan *"This is our world"* dalam 3 detik pertama bagi eksekutif.
- **Elemen Wajib**:
  - Peta proyeksi Mercator bersih bertekstur kertas halus dengan 12 pin lokasi hotel.
  - Tiga indikator status titik (*status dot*): Hijau (`above_plan`), Zinc netral (`on_plan`), Merah (`attention`).
  - Legend status di pojok kiri atas dan kontrol zoom (+, -, reset) di pojok kanan bawah.
- **Aturan Popover / Hover**:
  - Wajib menggunakan **Floating HTML Overlay di luar `overflow-hidden`** dengan level `z-50`.
  - Dilengkapi deteksi batas pintar (*smart boundary flip*): Pin di belahan bumi utara otomatis membuka ke bawah, pin di belahan bumi selatan membuka ke atas.
  - Konten popover: Nama properti, grouping & kota, total kamar (keys), Occupancy %, ADR, RevPAR, status badge, dan MTD Revenue (informasi in-house guests dan live guest record telah dihilangkan agar tampilan ringkas, rapi, dan elegan).

### 2. Kartu 2: Portfolio Performance (Jantung Finansial & 5 KPIs)
- **Tujuan**: Menjawab pertanyaan CEO *"Bagaimana kinerja finansial seluruh bisnis hotel kita?"* (bukan hanya bisnis kamar).
- **Lensa Waktu Utama**: **MTD (Month-To-Date)** sebagai lensa default pagi hari, didukung tab `[ Today ] [ MTD ] [ YTD ] [ Custom ]`.
- **5 KPI Utama**:
  1. `TOTAL HOTEL REVENUE`: **$152M** (+11.0% vs LY, +4.0% vs Budget) dengan rincian 5 pilar (Rooms $118M, F&B $22M, Spa $8M, Activities $4M).
  2. `OCCUPANCY`: **74.2%** (+4.8 pts vs LY, +2.1 pts vs Budget) — Wajib memakai satuan **persentase poin (`pts`)**.
  3. `ADR`: **$1,420** (+$85 vs LY / +6.0%, +$42 vs Budget / +3.2%).
  4. `REVPAR`: **$1,054** (+$92 vs LY / +8.5%, +$48 vs Budget / +4.1%).
  5. `ROOM REVENUE`: **$118M** (+14.0% vs LY, +5.2% vs Budget).

### 3. Kartu 3: Booking Pace (Kecepatan Pemesanan 90 Hari Kedepan)
- **Status**: **MENGGANTIKAN KARTU LAMA "Number of Guests 7-Day Overview"**.
- **Tujuan**: Menjawab pertanyaan CEO *"Seberapa cepat kita menerima pemesanan baru dan apakah permintaan sedang mengalami akselerasi atau perlambatan?"* (Bukan sekadar melihat jumlah tamu yang sudah lewat).
- **Horizon Waktu**: `Next 90 Days (Room Nights OTB)`.
- **Visual Utama**: Grafik dua kurva linear/area:
  - Garis solid hitam tebal (`#18181b`) dengan titik: **Tahun Ini (This Year OTB)**.
  - Garis putus-putus abu-abu (`#a1a1aa`): **Tahun Lalu (Last Year STLY)**.
  - Horizon 3 bulan: Oktober, November, Desember (skala 0 – 20K room nights).
- **Metrik Utama Panel Kanan**:
  - `+12% Pace vs LY` (Angka besar hijau penanda kecepatan pemesanan).
  - `14,820 Room Nights OTB` (↑ +12%).
  - `$38.4M Revenue OTB` (↑ +14%).
  - `+6% Pickup` (Pemesanan masuk 7 hari terakhir).
  - `+12% Pickup` (Pemesanan masuk 30 hari terakhir).

### 4. Kartu 4: Revenue & Demand Mix (Pilar Hospitality & Penggerak Portofolio)
- **Status**: **MENGGANTIKAN KARTU LAMA "Room Tier & Suite Occupancy Performance"**.
- **Tujuan Eksekutif**: Menjawab pertanyaan fundamental CEO *"Apa yang sebenarnya menggerakkan portofolio kita? (What is actually driving the portfolio?)"* dengan menghubungkan seluruh 5 pilar hospitality SOSEI ditambah paket pengalaman kurasi (*curated packages*).
- **Hirarki Desain & Akses**:
  - **Level CEO (Hospitality Dashboard)**: Melihat komposisi menyeluruh (*mix overview*).
  - **Level Pilar (Pillar Dashboards)**: Membuka detail mendalam tiap lini bisnis (F&B Dashboard, Spa Dashboard, Wellness, Activities).
- **Dua Lensa Interaktif (Pill Toggle: [ Revenue | Demand ])**:
  1. **Lensa Revenue (MTD By Business)**:
     - Total Portofolio: **$152.4M** (ditampilkan di pusat Donut Chart).
     - **Rooms**: $118.0M (77% pangsa, ↑ +14% YoY).
     - **F&B (Culinary)**: $12.0M (8% pangsa, ↑ +9% YoY).
     - **Spa (Thermal & Healing)**: $8.0M (5% pangsa, ↑ +12% YoY).
     - **Wellness / Medical**: $7.0M (5% pangsa, ↑ +18% YoY — Pertumbuhan Tercepat).
     - **Activities (Expeditions)**: $5.4M (3% pangsa, ↑ +16% YoY).
     - **Packages (Curated Stays)**: $2.0M (2% pangsa, ↑ +11% YoY).
  2. **Lensa Demand (Operational Volume Units)**:
     - Total Unit Permintaan: **158.4K Volume Units**.
     - **Rooms**: 74,200 Room Nights (47% volume, ↑ +12% YoY).
     - **F&B**: 48,500 Dining Covers & Checks (31% volume, ↑ +8% YoY).
     - **Spa**: 11,200 Spa Treatments (7% volume, ↑ +14% YoY).
     - **Wellness**: 9,800 Medical & Wellness Sessions (6% volume, ↑ +19% YoY).
     - **Activities**: 10,400 Activity Participants (6% volume, ↑ +15% YoY).
     - **Packages**: 4,300 Curated Journeys Booked (3% volume, ↑ +10% YoY).
- **Visual Utama**:
  - **Pure SVG Vector Donut Chart**: Kiri berukuran razor-sharp (r=42, strokeWidth=14) dengan teks ringkasan di tengah (`$152.4M Total Revenue` / `158.4K Total Demand`).
  - **Interactive Hover Synchronization**: Mengarahkan kursor pada baris tabel otomatis menyorot busur segmen warna donut yang bersangkutan.
  - **Tabel Ringkas Sisi Kanan**: Titik warna, nama pilar, % bauran (mix), nominal/unit, dan badge tren naik hijau (`↑ +X%`).
- **Integrasi Drawer**:
  - Mengklik kartu atau baris pilar membuka **Revenue & Demand Mix Drawer** yang memuat:
    - 4 kartu hero eksekutif (Total Rev $152.4M, Rooms Rev $118.0M, Non-Rooms Ancillary $34.4M, Peak Growth Driver Wellness +18%).
    - Tabel perbandingan pilar lengkap dengan deskripsi dan tombol navigasi drilldown langsung ke dashboard pilar.
    - Matriks kontribusi 12 properti luxury (100% sinkron dengan `simulatedPropertiesData`).

### 5. Kartu 5: Sentiment Score (Kepuasan Tamu Luxury)
- **Tujuan**: Memantau standar kepuasan tamu VVIP dan mendeteksi penurunan kualitas layanan lebih awal.
- **Visual**: Pure SVG Vector Donut Chart (skor global 94.6/100) dan skor per pilar layanan (Service Excellence, Culinary, Privacy, Wellness).
- **Posisi**: Berada di Row 3 sisi kanan (sejajar dengan Top Guest Needs).

### 6. Kartu 6: Top Guest Needs (Kebutuhan Tamu In-House)
- **Tujuan**: Mengantisipasi permintaan concierge dan butler paling dominan berdasarkan tamu yang saat ini sedang menginap di properti.
- **Posisi**: Berada di Row 3 sisi kanan (berdampingan dengan Sentiment Score).

### 7. Kartu 7: Forward Business (Bisnis On-The-Books / OTB Masa Depan)
- **Status**: **MENGGANTIKAN KARTU LAMA "VVIP Arrivals"**.
- **Tujuan Eksekutif**: Menjawab pertanyaan CEO *"Apa yang sudah pasti masuk ke dalam pembukuan kita untuk masa depan? (What is already committed and on the books?)"*.
  - **Pembeda Kritis**: Forward Business **bukan ramalan (*forecast*)** dan **bukan pula prospek (*pipeline*)**, melainkan pemesanan yang sudah sah terkontrak (*committed/contracted business*).
  - Informasi nama-nama tamu VIP operasional dialihkan ke dashboard operasional *Guest / Operations*.
- **Posisi Grid**: Berada di Row 4 kartu paling kiri (sejajar dari kiri ke kanan dengan Geo Market, Market Segment, dan SOSEI Signals).
- **Hubungan Komplementer dengan Booking Pace**:
  - `Booking Pace`: Mengukur **kecepatan** aliran pemesanan baru yang masuk (*velocity*).
  - `Forward Business`: Mengukur **akumulasi volume bisnis** yang sudah berhasil tercatat di buku (*committed volume*). Keduanya saling melengkapi.
- **Selector Horizon Waktu (Pill Selector)**:
  - Pilihan: `[ 30D | 90D | 180D | 365D ]` dengan **default 90D**.
- **5 Metrik Finansial OTB Panel Kiri**:
  1. `Revenue OTB`: **$38.4M** (↑ +12% vs LY) — Total pendapatan kamar & paket yang sudah terkontrak.
  2. `Room Nights OTB`: **14,820 RN** (↑ +11% vs LY) — Jumlah malam kamar yang sudah terjual.
  3. `Occupancy OTB`: **76%** (+4 pts vs LY) — Tingkat keterisian dasar dari pemesanan saat ini.
  4. `ADR OTB`: **$2,120** (↑ +6% vs LY) — Rata-rata tarif harian pemesanan masa depan.
  5. `Cancellation Exposure`: **$2.1M** (↑ +8% vs LY) — Nilai pendapatan berisiko batal (*revenue at risk* berdasar histori pembatalan / fleksibilitas rate).
- **Visualisasi Stacked Bar Panel Kanan (Cadence 90 Hari)**:
  - 3 Kolom Batang Bertumpuk (*Stacked Bars*):
    - `0–30D`: **$12.4M** (4,820 RN, 78% Occ).
    - `31–60D`: **$14.8M** (5,800 RN, 82% Occ — Puncak Tertinggi / Highlight).
    - `61–90D`: **$11.2M** (4,200 RN, 68% Occ).
    - *Total 3 Batang*: **$38.4M** (100% sinkron dengan OTB Revenue).
    - Lapisan batang bawah (gelap / `zinc-700`): Pendapatan terbayar penuh (*fully committed / paid*).
    - Lapisan batang atas (terang / `zinc-300`): Pemesanan garansi kartu kredit / tentative hold.
- **Wawasan Permintaan Strategis**:
  - *Strongest Demand Period*: Periode liburan musim dingin & Tahun Baru (Desember).
  - *Weakest Demand Period*: Masa transisi peralihan musim (*shoulder season* awal November).
- **Integrasi Drawer**:
  - Mengklik kartu membuka **Forward Business Drawer** dengan rincian 5 kartu KPI, panel ritme strategis, perbandingan OTB vs Forecast Revenue ($42.1M), dan matriks OTB 12 properti luxury.

### 8A. Kartu 8A: Geo Market (Asal Permintaan Regional / Feeder Markets)
- **Status**: **MENGGANTIKAN KARTU LAMA "Top Nationalities"** (Berdasarkan keputusan strategis eksekutif: Geo Market jauh lebih bernilai dibanding sekadar daftar bendera negara).
- **Tujuan Eksekutif**: Menjawab pertanyaan tajam direksi: *"Dari mana aliran permintaan dan booking kita berasal? (Where is demand coming from?)"*.
- **Posisi Grid**: **Row 4 — Sejajar horizontal dari kiri ke kanan bersama SOSEI Signal** (`[ Forward Business ] [ Geo Market ] [ Market Segment ] [ SOSEI Signals ]`).
- **Data & Metrik Wajib (Tabel Bersih & Razor-Sharp)**:
  1. `Europe`: **31% Room Nights** | ADR **$1,380** | Revenue **$41M** (Trend: ↑ **+12% vs LY**).
  2. `APAC`: **35% Room Nights** | ADR **$1,090** | Revenue **$38M** (Trend: ↑ **+18% vs LY** — Sesuai dengan SOSEI Signal akselerasi APAC).
  3. `Americas`: **24% Room Nights** | ADR **$1,240** | Revenue **$28M** (Trend: ↑ **+8% vs LY**).
  4. `Middle East`: **10% Room Nights** | ADR **$1,520** | Revenue **$11M** (Trend: ↑ **+6% vs LY** — Yield ADR tertinggi).
  - *Total Revenue*: **$118M** (100% identik dengan Total Rooms Revenue portofolio $118M — SSOT mutlak!).
- **Aturan Tipografi & Styling**:
  - Judul: `text-[10px] font-bold uppercase tracking-widest text-zinc-900`
  - Subtitle: `Where is demand coming from?` (`text-[9px] text-zinc-400 font-normal`)
  - Header Kolom: Title Case (`Market`, `Room Nights`, `ADR`, `Revenue`, `vs LY`) dengan `text-[9.5px] font-medium text-zinc-400` (dilarang uppercase).
  - Baris Tabel: Nama benua `text-[10px] font-medium text-zinc-900`, angka `text-right text-[10px]`, tren `text-emerald-700 text-[9.5px] font-medium`.
  - Footer Ringkas: Menampilkan `Global Feeder Markets · Total Room Rev: $118M`.
- **Integrasi Drawer**:
  - Mengklik kartu membuka **Geo Market Drawer Content** yang menyajikan 4 kartu hero (Volume Leader APAC 35%, Highest Yield Middle East $1,520, Revenue Anchor Europe $41M, Americas $28M), tabel rincian feeder gateways (LHR, ZRH, HND, SIN, JFK, DXB), serta matriks distribusi feeder di 12 luxury sanctuaries.

### 8B. Kartu 8B: Market Segment (Segmen Pasar & Profil Permintaan Tamu)
- **Status**: **KARTU TERPISAH (Completely Separate Card)** mendampingi Geo Market.
- **Tujuan Eksekutif**: Menjawab pertanyaan fundamental manajemen portofolio: *"Permintaan seperti apa yang berhasil kita tarik? (What kind of demand are we attracting?)"*.
- **Posisi Grid**: **Row 4 — Sejajar horizontal dari kiri ke kanan bersama SOSEI Signal** (`[ Forward Business ] [ Geo Market ] [ Market Segment ] [ SOSEI Signals ]`).
- **Data & Metrik Wajib (Tabel Bersih & Razor-Sharp)**:
  1. `Leisure`: **45% Room Nights** | ADR **$1,120** | Revenue **$52M** (Trend: ↑ **+14% vs LY** — Pilar utama volume & kestabilan keterisian).
  2. `Corporate`: **22% Room Nights** | ADR **$1,340** | Revenue **$31M** (Trend: ↓ **-7% vs LY** — Ditampilkan warna merah `text-rose-600` penanda pelambatan corporate demand).
  3. `Group / MICE`: **14% Room Nights** | ADR **$1,580** | Revenue **$19M** (Trend: ↑ **+9% vs LY** — Pertemuan puncak kepemimpinan & buyouts).
  4. `Wellness`: **9% Room Nights** | ADR **$1,760** | Revenue **$14M** (Trend: ↑ **+19% vs LY** — Segmen dengan pertumbuhan tercepat dan ADR tertinggi).
  5. `Social / Other`: **10% Room Nights** | ADR **$980** | Revenue **$11M** (Trend: ↑ **+5% vs LY**).
  - *Total Bookings*: **$127M** (100% volume booking yang tercatat).
- **Aturan Tipografi & Styling**:
  - Judul: `text-[10px] font-bold uppercase tracking-widest text-zinc-900`
  - Subtitle: `What kind of demand are we attracting?` (`text-[9px] text-zinc-400 font-normal`)
  - Header Kolom: Title Case (`Segment`, `Room Nights`, `ADR`, `Revenue`, `vs LY`) dengan `text-[9.5px] font-medium text-zinc-400`.
  - Tren: Positif hijau `text-emerald-700`, Negatif merah `text-rose-600` (Corporate ↓ -7%).
  - Footer Ringkas: Menampilkan `Demand Yield Realization · Total Bookings: $127M`.
- **Integrasi Drawer**:
  - Mengklik kartu membuka **Market Segment Drawer Content** yang menyajikan 4 kartu hero (Core Leisure Driver 45%, Top Yield Wellness $1,760, Leadership & MICE $19M, Watch Item Corporate -7%), profil risiko pembatalan (*cancellation risk*), rata-rata *booking lead time*, dan matriks segmen dominan di 12 luxury sanctuaries.

### 9. Kartu 9: SOSEI Signals (Portfolio Signals & Signature Intelligence Layer)
- **Status**: **MENGGANTIKAN KARTU LAMA "Notes From Yesterday"**.
- **Tujuan Eksekutif**: Menjawab pertanyaan tajam CEO: *"So what?"* (Lalu apa dampak bisnis dan tindak lanjut dari seluruh data portofolio ini?).
  - Bukan lagi memo operasional umum GM (seperti pujian tamu pada tur kapal pesiar yang merupakan ranah tim lapangan), melainkan anomali dan percepatan performa lintas portofolio.
- **Batasan Item**: Ringkas, padat, dan terkurasi: **hanya 3–4 sinyal utama per hari**.
- **Diferensiasi Sinyal Data vs Rekomendasi AI**:
  - Untuk menjaga tingkat kepercayaan (*trust*) para eksekutif, sistem membedakan secara tegas:
    1. **Data-Derived Signals**: Fakta nyata pergerakan portofolio dari PMS/database.
    2. **AI Tactical Recommendation**: Rekomendasi tindakan strategis terpisah non-binding.
- **4 Sinyal Utama Aktif**:
  1. 🟢 **Demand accelerating in Asia Pacific** (`Today`): *APAC room night pickup is +18% vs last year across Ocean and City.*
  2. 🟢 **Alpine outperforming plan** (`Today`): *RevPAR is 9% above budget with occupancy 2 pts ahead of plan.*
  3. 🔴 **Corporate demand softening** (`Yesterday`): *Corporate room nights are down 7% across three properties.*
  4. ⚪ **Increased cancellation exposure** (`Yesterday`): *$1.4M of booked revenue falls within high-risk cancellation windows.*
- **Visual**:
  - Ikon bulat status minimalis: Panah hijau naik (`↑`), panah merah turun (`↓`), dash zinc (`—`).
  - Label penanda waktu ringkas di sisi kanan (`Today`, `Yesterday`).
  - Tombol aksi sudut kanan atas: `See all signals →`.
- **Integrasi Drawer**:
  - Membuka **SOSEI Signals Drawer** dengan tab filter (*All, Opportunities, Risks*), rincian dampak finansial, properti terdampak, boks terisolasi rekomendasi AI, dan tabel audit silang 12 sanctuaries.

### 10. Kartu 10: Portfolio Comparison (Tabel Komparasi "Who is Winning?" & Navigasi Property View)
- **Status**: **MENGGANTIKAN AREA BAWAH LAMA (Global Alerts, Spend Over Time & Journey Timeline)**.
- **Tujuan Eksekutif**: Menjawab pertanyaan tajam CEO *"Who is winning across our destinations?"* (Siapa yang mencatatkan performa terbaik dan siapa yang sedang tertinggal dalam satu tabel komparasi bersih tanpa chart berbelit).
- **Format Tampilan**: Kartu lebar penuh (*full-width 12 columns*) di bagian bawah dashboard.
- **Kolom Tabel Standar**:
  1. `Property`: Title Case tebal (`text-[10.5px] font-bold text-zinc-900`) contoh: `SOSEI Alpine`, `SOSEI Ocean`, `SOSEI City`, `SOSEI Desert`.
  2. `Location`: Destinasi/negara (`Switzerland`, `Indonesia`, `Japan`, `UAE`).
  3. `Occupancy`: Realisasi keterisian bulan berjalan (`76%`, `72%`, `81%`, `61%`).
  4. `ADR (USD)`: Rata-rata tarif harian kamar (`$1,420`, `$1,180`, `$890`, `$1,250`).
  5. `RevPAR (USD)`: Pendapatan per kamar tersedia (`$1,079`, `$850`, `$721`, `$763`).
  6. `Room Revenue (USD)`: Pendapatan murni kamar (`$24.0M`, `$21.5M`, `$18.4M`, `$12.1M`).
  7. `Total Revenue (USD)`: Total omzet termasuk F&B, Spa & Aktivitas (`$31.2M`, `$28.1M`, `$24.0M`, `$16.8M`).
  8. `vs LY`: Pertumbuhan tahunan (Hijau `↑ +18%`, `↑ +14%`, `↑ +8%` atau Merah `↓ -3%`).
  9. `vs Budget`: Realisasi terhadap target anggaran (Hijau `↑ +9%`, `↑ +6%`, `↑ +4%` atau Merah `↓ -6%`).
  10. `Status`: Titik status bulat minimalis (Hijau `bg-emerald-600` untuk *above/on plan*, Merah `bg-rose-500` untuk *attention*).
- **Aksi Cepat & Navigasi**:
  - Mengklik baris properti langsung membuka **Detailed Property View** (`/dashboard/property?id=...`).
  - Tombol sudut kanan atas `See details →` membuka **Portfolio Comparison Drawer** dengan matriks performa mendalam dan perbandingan seluruh 12 sanctuary.

---

## 10. Aturan Mutlak Satu Portal Data (Single Source of Truth / SSOT)
Untuk menjaga integritas dan konsistensi data di seluruh aplikasi:
1. **Dilarang Keras Membuat Mock Data Terpisah / Duplikat**:
   - Dilarang membuat hardcoded array dummy terpisah di dalam komponen drawer, page, atau widget yang tidak sinkron dengan data utama.
2. **Pusat Data Tunggal (Single Data Portal)**:
   - Seluruh data 12 properti luxury, data kategori, 5 KPI portofolio, Booking Pace, Revenue & Demand Mix, Forward Business, SOSEI Signals, dan Portfolio Comparison **WAJIB bersumber dari satu data portal**:
     `@/features/dashboard/services/propertySimulation.ts`
3. **Sinkronisasi 100% Lintas Komponen**:
   - Jika di peta tertera properti `SOSEI NOCTURNE` (Zermatt, 95 keys, Occupancy 77.9%, ADR $2,800), maka saat membuka Metric Drawer, World Map Drawer, Booking Pace Drawer, Revenue & Demand Mix Drawer, Forward Business Drawer, SOSEI Signals Drawer, dan Portfolio Comparison Drawer, data yang tampil harus **identik 100%**.



