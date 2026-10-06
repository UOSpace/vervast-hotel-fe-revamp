# SOSEI Hotel Revamp — Executive Dashboard (View All) Onboarding & Architecture Guide

Dokumen panduan *onboarding* resmi untuk modul **Executive Overview Dashboard (`/dashboard?view=all`)** dalam ekosistem sistem perhotelan luxury *SOSEI*.

---

## 1. 🎯 Tujuan Bisnis & Target Pengguna

Dashboard ini dikembangkan secara spesifik untuk level **C-Suite (CEO, CFO, COO)** dan **Corporate General Manager (GM)**:
* **Helicopter View Portfolio:** Mengontrol performa 12 properti luxury global dalam satu tampilan terpadu (*Unified Command Center*).
* **Yield & Revenue Optimization:** Menilai efisiensi penetapan harga (*ADR vs Occupancy*) dan dampak langsungnya terhadap *RevPAR*.
* **Manajemen Pasar Internasional:** Mengidentifikasi pergeseran volume pasar tamu asing (*Nationality Share*) dan sentimen kepuasan tamu (*Guest Sentiment*).

---

## 2. 📐 Struktur 5-Layer Dashboard & Grid System

Dashboard dibangun menggunakan sistem grid 12-kolom yang proporsional (*45.83% Kolom Kiri vs 54.17% Kolom Kanan*):

```
+---------------------------------------------------------------------------------------------------+
|  PORTAL HEADER & EXECUTIVE PROFILE                                                                |
+-----------------------------------------------------------------------+---------------------------+
|  LAYER 1 (60.00%): LARGE WORLD MAP & GLOBAL SATELLITE PINS            |  LAYER 2 (40.00%):        |
|  - Panoramic large map with real-time MTD revenue pins                |  - 4 KPI CARDS (2x2 Grid) |
|  - Anti-clipping smart hover tooltip                                  |  - Occupancy, ADR, Rev... |
+-----------------------------------------------------------------------+---------------------------+
|  LAYER 3 (60.00%): GUEST MOVEMENT & ROOM TIER OCCUPANCY                |  LAYER 3 (40.00%):        |
|  - Number of Guests: 7-Days Overview stacked bar chart (col-6)        |  - TOP NATIONALITIES      |
|  - Room Tier Occupancy: Suite & Villa Performance (col-6)             |  - SENTIMENT SCORE        |
+-----------------------------------------------------------------------+---------------------------+
|  LAYER 4 (60.00%): VVIP ARRIVALS & TOP GUEST NEEDS                    |  LAYER 4 (40.00%):        |
|  - Founding circle & diplomatic arrivals                              |  - NOTES FROM YESTERDAY   |
|  - Guest preference requests                                          |  - Critical notes         |
+-----------------------------------------------------------------------+---------------------------+
|  LAYER 5 (60.00%): GLOBAL ALERTS & SPEND OVER TIME                    |  LAYER 5 (40.00%):        |
|  - Real-time incident logs & operational alerts (col-7)               |  - JOURNEY TIMELINE       |
|  - Annual guest expenditure trends chart (col-5)                      |  - Sanctuary milestones   |
+-----------------------------------------------------------------------+---------------------------+
```

---

## 3. 🧮 Standar Presisi PMS & Formula Finansial

Seluruh data keuangan dan persentase dihitung dengan **akurasi 2 desimal** tanpa pembulatan prematur:

### Formula Inti:
$$\text{Occupancy Rate} = \left(\frac{\text{Rooms Sold}}{\text{Available Rooms}}\right) \times 100\%$$
$$\text{ADR} = \frac{\text{Room Revenue}}{\text{Rooms Sold}}$$
$$\text{RevPAR} = \text{Occupancy Rate} \times \text{ADR} = \frac{\text{Room Revenue}}{\text{Available Rooms}}$$

### Data Ringkasan Portofolio:
| Metrik | MTD (Month-To-Date) | YTD (Year-To-Date) | Catatan |
| :--- | :--- | :--- | :--- |
| **Occupancy** | `78.40%` | `74.20%` | Tingkat keterisian kamar |
| **ADR** | `$2,450.00` | `$2,180.00` | Rata-rata tarif kamar harian |
| **RevPAR** | `$1,920.80` | `$1,617.56` | Pendapatan per kamar tersedia ($78.40\% \times \$2,450.00$) |
| **Revenue** | `$14.80M` | `$118.00M` | Total pendapatan kamar portofolio |

---

## 4. 🌍 Pangsa Pasar Tamu (Top Nationalities Share)

Distribusi pangsa pasar 5 negara tamu terbesar mencakup **74.00%** dari total tamu portofolio (sisa 26.00% berasal dari negara lain di seluruh dunia):

| # | Kebangsaan (Nationality) | Pangsa Tamu (Occupancy Share) | ADR | Total Revenue | RevPAR |
| :-: | :--- | :-: | :-: | :-: | :-: |
| **1** | United States | `24.00%` | `$1,240.00` | `$4.50M` | `$892.80` |
| **2** | United Kingdom | `18.00%` | `$1,180.00` | `$2.20M` | `$802.40` |
| **3** | Germany | `14.00%` | `$1,050.00` | `$1.70M` | `$682.50` |
| **4** | Switzerland & EU | `10.00%` | `$980.00` | `$1.50M` | `$686.00` |
| **5** | Japan & APAC | `8.00%` | `$1,120.00` | `$1.30M` | `$705.60` |
| **Σ** | **Total / Top 5 Share** | **`74.00%`** | **`$1,154.00`** | **`$11.20M`** | **`$813.86`** |

---

## 5. 🗂️ Fitur Interaktif: Modal Drawer & Freeze Headers

Semua kartu dashboard terhubung dengan **Modal Drawer (`DashboardDrawer.tsx`)**:
* **Freeze / Sticky Headers (`<thead>`):** Saat pengguna melakukan scroll pada tabel properti atau negara, baris header (`Property Type`, `Occupancy`, `ADR`, `Revenue`, `RevPAR`) tetap membeku di posisi atas (*sticky top*).
* **Dynamic Period Toggle (`MTD` / `YTD`):** Dropdown di bawah judul `PORTFOLIO PERFORMANCE` langsung mengubah nilai 4 kartu KPI dan widget breakdown kategori secara real-time.

---

## 6. 🛠️ Stack Teknologi & Lokasi File

* **Framework:** React 18 + Vite + TypeScript
* **Styling:** Tailwind CSS (Zinc Luxury Theme Palette) + Pure SVG Vectors
* **Path Penting:**
  * Halaman Dashboard: [`src/features/dashboard/pages/DashboardPage.tsx`](file:///d:/Project/Uo-space/vervast-hotel-revamp/src/features/dashboard/pages/DashboardPage.tsx)
  * Modal Drawer & Tabel: [`src/features/dashboard/components/DashboardDrawer.tsx`](file:///d:/Project/Uo-space/vervast-hotel-revamp/src/features/dashboard/components/DashboardDrawer.tsx)
  * Kalkulasi PMS: [`src/data/pms/pmsCalculations.ts`](file:///d:/Project/Uo-space/vervast-hotel-revamp/src/data/pms/pmsCalculations.ts)
  * Map Widget: [`src/features/dashboard/components/widgets/LiveOverviewMap.tsx`](file:///d:/Project/Uo-space/vervast-hotel-revamp/src/features/dashboard/components/widgets/LiveOverviewMap.tsx)
  * Design Guidelines: [`AGENTS.md`](file:///d:/Project/Uo-space/vervast-hotel-revamp/AGENTS.md)
