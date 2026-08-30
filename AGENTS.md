# Vervast Hotel Revamp — Design System & Layout Rules

Dokumen ini adalah aturan paten dan pedoman desain untuk seluruh halaman web aplikasi Vervast Hotel Revamp. Semua halaman harus mematuhi aturan ini agar tampilan konsisten, elegan, mewah (*luxury*), dan tidak bertumpuk/remek.

---

## 1. Skema Warna & Token Desain (Zinc Palette)
Dilarang menggunakan warna-warna legacy coklat/beige lama (seperti `#4a3c31`, `#f3eae1`, `#d4c4b7`, `#7d6b5e`, `#8c6b4f`, `#a65e52`). Gunakan token Zinc modern:
- **Latar belakang dashboard/halaman**: Bersih, transparan, atau background image portal.
- **Teks Utama / Angka Besar**: `text-zinc-900`
- **Teks Sekunder / Body**: `text-zinc-700` atau `text-zinc-600`
- **Label / Metrik / Placeholder**: `text-zinc-500` atau `text-zinc-400`
- **Garis Pembatas (Borders)**: `border-zinc-100` atau `border-zinc-200/80`
- **Indikator Tren Naik (Positive YoY/MoM)**: `text-emerald-700` / `bg-emerald-50 text-emerald-700`
- **Indikator Tren Turun (Negative YoY/MoM)**: `text-rose-600` / `bg-rose-50 text-rose-600`

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

---

## 4. Struktur Grid & Penjajaran Vertikal (Alignment Rules)
Untuk mencegah tampilan remek dan kartu tidak sejajar:
1. **Sistem Grid 12 Kolom Seragam**:
   - **Kolom Kiri (5 Kolom)**: `col-span-12 lg:col-span-5` (sejajar dari Layer 1 sampai Layer 4).
   - **Kolom Kanan (7 Kolom)**: `col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5` (menghasilkan 2 sub-kartu berukuran 3.5 kolom yang sejajar persis antar layer).
2. **Ketinggian Sama & Distribusi Vertikal**:
   - Setiap kartu di baris yang sama harus memiliki tinggi sama (`h-full justify-between`).
   - Konten di dalam kartu menggunakan `flex-1 flex flex-col justify-between` agar elemen pertama dan elemen terakhir pada kartu bersebelahan sejajar horizontal rata.
3. **Pemisah Antar Layer**:
   - **Jangan gunakan garis horizontal keras (`border-t / hr`)** di antara layer.
   - Gunakan `gap-4` atau `gap-5` alami untuk pemisahan layer yang bersih dan lapang.

---

## 5. Visualisasi Chart
- **Donut Chart**: Selalu gunakan **Pure SVG Vector Donut** (`size={110}`, `strokeWidth={14}`) agar 100% bulat sempurna, razor-sharp, dan tidak terpotong oleh Recharts `ResponsiveContainer`.
- **Progress Bar**: Tipis dan minimalis (`h-1.5 bg-zinc-100 rounded-full`, bar: `bg-zinc-800 rounded-full`).
