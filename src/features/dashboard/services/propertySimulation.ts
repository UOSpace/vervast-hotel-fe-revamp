// Dynamic property simulation service connecting PMS database (reservations, guests, property inventory)
// Calculates live Occupancy, ADR, RevPAR, and in-house guest records dynamically.

export interface GuestBookingRecord {
  guestId: string;
  guestName: string;
  guestTitle: string;
  vipTier: string;
  nationality: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  dailyRate: number;
  totalStayAmount: number;
  specialRequest: string;
  bookingStatus: 'in_house' | 'arrival_today' | 'confirmed';
}

export interface SimulatedPropertyMapItem {
  id: string;
  name: string;
  city: string;
  country: string;
  grouping: string;
  coordinates: [number, number];

  // Property room inventory & calculated occupancy
  totalRooms: number;
  occupiedRooms: number;
  occupancyPct: number;
  occupancyFormatted: string;

  // Rate & revenue calculations
  adrUsd: number;
  adrFormatted: string;
  revparUsd: number;
  revparFormatted: string;
  monthlyRevenueUsd: number;
  revenueFormatted: string;

  // Operational guest movement
  guestsInHouse: number;
  arrivalsToday: number;
  departuresToday: number;

  // Calculated performance status
  status: 'above_plan' | 'on_plan' | 'attention';
  statusLabel: string;

  // Live in-house guest record
  activeGuest: GuestBookingRecord;
}

export const simulatedPropertiesData: SimulatedPropertyMapItem[] = [
  // ── Sosei Urban (Barcelona, Tokyo) ────────────────────────────────────────
  {
    id: 'sosei-barcelona',
    name: 'SOSEI BARCELONA',
    city: 'Barcelona, Spain',
    country: 'Spain',
    grouping: 'Urban',
    coordinates: [2.1734, 41.3851],
    totalRooms: 110,
    occupiedRooms: 75,
    occupancyPct: 68.2,
    occupancyFormatted: '68.2%',
    adrUsd: 2540,
    adrFormatted: '$2,540',
    revparUsd: 1732,
    revparFormatted: '$1,732',
    monthlyRevenueUsd: 1750000,
    revenueFormatted: '$1.75M',
    guestsInHouse: 132,
    arrivalsToday: 22,
    departuresToday: 18,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_003',
      guestName: 'Dr. Elizabeth Hall',
      guestTitle: 'Dr.',
      vipTier: 'Gold VIP',
      nationality: 'British',
      roomType: 'Paseo de Gracia Grand Suite',
      roomNumber: 'Suite 402',
      checkInDate: 'Oct 11',
      checkOutDate: 'Oct 15',
      nights: 4,
      dailyRate: 2540,
      totalStayAmount: 10160,
      specialRequest: 'Private architectural tour with Gaudi historian',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-tokyo',
    name: 'SOSEI TOKYO',
    city: 'Tokyo, Japan',
    country: 'Japan',
    grouping: 'Urban',
    coordinates: [139.6917, 35.6895],
    totalRooms: 90,
    occupiedRooms: 64,
    occupancyPct: 71.1,
    occupancyFormatted: '71.1%',
    adrUsd: 2450,
    adrFormatted: '$2,450',
    revparUsd: 1742,
    revparFormatted: '$1,742',
    monthlyRevenueUsd: 1280000,
    revenueFormatted: '$1.28M',
    guestsInHouse: 118,
    arrivalsToday: 18,
    departuresToday: 15,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_011',
      guestName: 'Julian Vance',
      guestTitle: 'Mr.',
      vipTier: 'Platinum VIP',
      nationality: 'American',
      roomType: 'Imperial Garden Sanctuary Loft',
      roomNumber: 'Loft 310',
      checkInDate: 'Oct 10',
      checkOutDate: 'Oct 14',
      nights: 4,
      dailyRate: 2450,
      totalStayAmount: 9800,
      specialRequest: 'Private omakase dinner with Master Chef',
      bookingStatus: 'in_house',
    },
  },

  // ── Sosei Beach Resort (Bali, Maldives) ───────────────────────────────────
  {
    id: 'sosei-bali',
    name: 'SOSEI BALI',
    city: 'Uluwatu, Bali, Indonesia',
    country: 'Indonesia',
    grouping: 'Beach Resort',
    coordinates: [115.1889, -8.4095],
    totalRooms: 75,
    occupiedRooms: 53,
    occupancyPct: 70.7,
    occupancyFormatted: '70.7%',
    adrUsd: 2150,
    adrFormatted: '$2,150',
    revparUsd: 1520,
    revparFormatted: '$1,520',
    monthlyRevenueUsd: 1220000,
    revenueFormatted: '$1.22M',
    guestsInHouse: 104,
    arrivalsToday: 15,
    departuresToday: 12,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_009',
      guestName: 'Maya Wulandari',
      guestTitle: 'Mrs.',
      vipTier: 'Sanctuary Patron',
      nationality: 'Indonesian',
      roomType: 'Cliffside Ocean Sanctuary Villa',
      roomNumber: 'Villa 12',
      checkInDate: 'Oct 12',
      checkOutDate: 'Oct 16',
      nights: 4,
      dailyRate: 2150,
      totalStayAmount: 8600,
      specialRequest: 'Holistic Balinese purification ritual',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-maldives',
    name: 'SOSEI MALDIVES',
    city: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    grouping: 'Beach Resort',
    coordinates: [73.5089, 4.1755],
    totalRooms: 65,
    occupiedRooms: 50,
    occupancyPct: 76.9,
    occupancyFormatted: '76.9%',
    adrUsd: 2420,
    adrFormatted: '$2,420',
    revparUsd: 1861,
    revparFormatted: '$1,861',
    monthlyRevenueUsd: 1380000,
    revenueFormatted: '$1.38M',
    guestsInHouse: 98,
    arrivalsToday: 14,
    departuresToday: 10,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_002',
      guestName: 'Martin Fuentes',
      guestTitle: 'Mr.',
      vipTier: 'Founding Circle',
      nationality: 'American',
      roomType: 'Overwater Grand Sanctuary Villa',
      roomNumber: 'Villa 108',
      checkInDate: 'Oct 09',
      checkOutDate: 'Oct 16',
      nights: 7,
      dailyRate: 2420,
      totalStayAmount: 16940,
      specialRequest: 'Private sommelier & reef bioluminescence cruise',
      bookingStatus: 'in_house',
    },
  },

  // ── Sosei Ski (Switzerland, Canada) ───────────────────────────────────────
  {
    id: 'sosei-switzerland',
    name: 'SOSEI SWITZERLAND',
    city: 'Zermatt, Switzerland',
    country: 'Switzerland',
    grouping: 'Ski',
    coordinates: [7.7491, 45.9765],
    totalRooms: 70,
    occupiedRooms: 55,
    occupancyPct: 78.6,
    occupancyFormatted: '78.6%',
    adrUsd: 2780,
    adrFormatted: '$2,780',
    revparUsd: 2185,
    revparFormatted: '$2,185',
    monthlyRevenueUsd: 2180000,
    revenueFormatted: '$2.18M',
    guestsInHouse: 125,
    arrivalsToday: 18,
    departuresToday: 14,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_001',
      guestName: 'Sal Zanjabila',
      guestTitle: 'Ms.',
      vipTier: 'Platinum VIP',
      nationality: 'British',
      roomType: 'Matterhorn Glacier Penthouse Chalet',
      roomNumber: 'Chalet 401',
      checkInDate: 'Oct 10',
      checkOutDate: 'Oct 15',
      nights: 5,
      dailyRate: 2780,
      totalStayAmount: 13900,
      specialRequest: 'Helipad Ski Concierge & Thermal Spa',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-canada',
    name: 'SOSEI CANADA',
    city: 'Whistler, Canada',
    country: 'Canada',
    grouping: 'Ski',
    coordinates: [-122.9574, 50.1163],
    totalRooms: 60,
    occupiedRooms: 44,
    occupancyPct: 73.3,
    occupancyFormatted: '73.3%',
    adrUsd: 2620,
    adrFormatted: '$2,620',
    revparUsd: 1921,
    revparFormatted: '$1,921',
    monthlyRevenueUsd: 2020000,
    revenueFormatted: '$2.02M',
    guestsInHouse: 92,
    arrivalsToday: 12,
    departuresToday: 9,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_007',
      guestName: 'Henrik Lindqvist',
      guestTitle: 'Mr.',
      vipTier: 'Sanctuary Elite',
      nationality: 'Swedish',
      roomType: 'Olympic Peak Chalet Estate',
      roomNumber: 'Estate 104',
      checkInDate: 'Oct 11',
      checkOutDate: 'Oct 15',
      nights: 4,
      dailyRate: 2620,
      totalStayAmount: 10480,
      specialRequest: 'Private backcountry heli-ski guide',
      bookingStatus: 'in_house',
    },
  },

  // ── Sosei Nature (Costa Rica, Japan) ──────────────────────────────────────
  {
    id: 'sosei-costa-rica',
    name: 'SOSEI COSTA RICA',
    city: 'Papagayo, Costa Rica',
    country: 'Costa Rica',
    grouping: 'Nature',
    coordinates: [-85.6600, 10.6300],
    totalRooms: 70,
    occupiedRooms: 51,
    occupancyPct: 72.9,
    occupancyFormatted: '72.9%',
    adrUsd: 1950,
    adrFormatted: '$1,950',
    revparUsd: 1421,
    revparFormatted: '$1,421',
    monthlyRevenueUsd: 1550000,
    revenueFormatted: '$1.55M',
    guestsInHouse: 88,
    arrivalsToday: 12,
    departuresToday: 10,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_008',
      guestName: 'Lord Sterling',
      guestTitle: 'Lord',
      vipTier: 'Founding Circle',
      nationality: 'British',
      roomType: 'Rainforest Canopy Ocean Villa',
      roomNumber: 'Villa 14',
      checkInDate: 'Oct 09',
      checkOutDate: 'Oct 16',
      nights: 7,
      dailyRate: 1950,
      totalStayAmount: 13650,
      specialRequest: 'Private naturalist wildlife expedition',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-japan',
    name: 'SOSEI JAPAN',
    city: 'Kyoto, Japan',
    country: 'Japan',
    grouping: 'Nature',
    coordinates: [135.7681, 35.0116],
    totalRooms: 75,
    occupiedRooms: 52,
    occupancyPct: 69.3,
    occupancyFormatted: '69.3%',
    adrUsd: 1780,
    adrFormatted: '$1,780',
    revparUsd: 1234,
    revparFormatted: '$1,234',
    monthlyRevenueUsd: 1250000,
    revenueFormatted: '$1.25M',
    guestsInHouse: 85,
    arrivalsToday: 11,
    departuresToday: 9,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_002',
      guestName: 'Kenzo Tanaka',
      guestTitle: 'Mr.',
      vipTier: 'Founding Circle',
      nationality: 'Japanese',
      roomType: 'Historic Bamboo Pavilion Ryokan',
      roomNumber: 'Pavilion 08',
      checkInDate: 'Oct 10',
      checkOutDate: 'Oct 15',
      nights: 5,
      dailyRate: 1780,
      totalStayAmount: 8900,
      specialRequest: 'Private Zen garden meditation with temple abbot',
      bookingStatus: 'in_house',
    },
  },

  // ── Sosei Wellness (Oman, Egypt) ──────────────────────────────────────────
  {
    id: 'sosei-oman',
    name: 'SOSEI OMAN',
    city: 'Jebel Akhdar, Oman',
    country: 'Oman',
    grouping: 'Wellness',
    coordinates: [57.6599, 23.0673],
    totalRooms: 85,
    occupiedRooms: 56,
    occupancyPct: 65.9,
    occupancyFormatted: '65.9%',
    adrUsd: 1860,
    adrFormatted: '$1,860',
    revparUsd: 1225,
    revparFormatted: '$1,225',
    monthlyRevenueUsd: 1420000,
    revenueFormatted: '$1.42M',
    guestsInHouse: 94,
    arrivalsToday: 10,
    departuresToday: 8,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_025',
      guestName: 'David Rothschild',
      guestTitle: 'Mr.',
      vipTier: 'Platinum VIP',
      nationality: 'Swiss',
      roomType: 'Canyon Ridge Stargazing Sanctuary',
      roomNumber: 'Villa 09',
      checkInDate: 'Oct 11',
      checkOutDate: 'Oct 15',
      nights: 4,
      dailyRate: 1860,
      totalStayAmount: 7440,
      specialRequest: 'Private cliffside sound healing therapy',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-egypt',
    name: 'SOSEI EGYPT',
    city: 'Siwa Oasis, Egypt',
    country: 'Egypt',
    grouping: 'Wellness',
    coordinates: [25.5195, 29.2032],
    totalRooms: 80,
    occupiedRooms: 47,
    occupancyPct: 58.8,
    occupancyFormatted: '58.8%',
    adrUsd: 1740,
    adrFormatted: '$1,740',
    revparUsd: 1022,
    revparFormatted: '$1,022',
    monthlyRevenueUsd: 1180000,
    revenueFormatted: '$1.18M',
    guestsInHouse: 74,
    arrivalsToday: 8,
    departuresToday: 6,
    status: 'attention',
    statusLabel: 'Attention',
    activeGuest: {
      guestId: 'gst_ind_022',
      guestName: 'Sheikh Tariq Al-Mansoor',
      guestTitle: 'H.E.',
      vipTier: 'Royal Patron',
      nationality: 'Emirati',
      roomType: 'Desert Mineral Spring Royal Tent',
      roomNumber: 'Tent 01',
      checkInDate: 'Oct 11',
      checkOutDate: 'Oct 14',
      nights: 3,
      dailyRate: 1740,
      totalStayAmount: 5220,
      specialRequest: 'Private thermal salt spring therapy & dunes dinner',
      bookingStatus: 'in_house',
    },
  },
];


// Unified Category Performance for Metric Drawer & Deep-Dives
export interface PropertyPerformanceCategory {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  occupiedRooms: number;
  occ: string;
  occNum: number;
  targetOcc: number;
  adr: string;
  adrNum: number;
  targetAdr: number;
  revenue: string;
  revenueNum: number;
  targetRev: number;
  revpar: string;
  revparNum: number;
  targetRevpar: number;
  status: string;
  children: Array<{
    name: string;
    location: string;
    totalRooms: number;
    occupiedRooms: number;
    occ: string;
    adr: string;
    revenue: string;
    revpar: string;
  }>;
}

export const simulatedCategoryPerformance: PropertyPerformanceCategory[] = [
  {
    id: 'urban',
    name: 'SOSEI Urban',
    location: 'Barcelona & Tokyo',
    totalRooms: 200,
    occupiedRooms: 139,
    occ: '69.50%',
    occNum: 69.50,
    targetOcc: 68.0,
    adr: '$2,498.56',
    adrNum: 2499,
    targetAdr: 2500,
    revenue: '$3.03M',
    revenueNum: 3.03,
    targetRev: 2.95,
    revpar: '$1,736.50',
    revparNum: 1736.50,
    targetRevpar: 1700.00,
    status: 'Corporate Peak',
    children: [
      { name: 'SOSEI BARCELONA', location: 'Barcelona, Spain', totalRooms: 110, occupiedRooms: 75, occ: '68.18%', adr: '$2,540', revenue: '$1.75M', revpar: '$1,731' },
      { name: 'SOSEI TOKYO', location: 'Tokyo, Japan', totalRooms: 90, occupiedRooms: 64, occ: '71.11%', adr: '$2,450', revenue: '$1.28M', revpar: '$1,742' },
    ],
  },
  {
    id: 'beach-resort',
    name: 'SOSEI Beach Resort',
    location: 'Bali & Maldives',
    totalRooms: 140,
    occupiedRooms: 103,
    occ: '73.57%',
    occNum: 73.57,
    targetOcc: 71.5,
    adr: '$2,281.07',
    adrNum: 2281,
    targetAdr: 2150,
    revenue: '$2.60M',
    revenueNum: 2.60,
    targetRev: 2.45,
    revpar: '$1,678.14',
    revparNum: 1678.14,
    targetRevpar: 1537.25,
    status: 'Optimal Flow',
    children: [
      { name: 'SOSEI BALI', location: 'Uluwatu, Bali, Indonesia', totalRooms: 75, occupiedRooms: 53, occ: '70.67%', adr: '$2,150', revenue: '$1.22M', revpar: '$1,519' },
      { name: 'SOSEI MALDIVES', location: 'North Malé Atoll, Maldives', totalRooms: 65, occupiedRooms: 50, occ: '76.92%', adr: '$2,420', revenue: '$1.38M', revpar: '$1,861' },
    ],
  },
  {
    id: 'ski',
    name: 'SOSEI Ski',
    location: 'Switzerland & Canada',
    totalRooms: 130,
    occupiedRooms: 99,
    occ: '76.15%',
    occNum: 76.15,
    targetOcc: 74.0,
    adr: '$2,709.09',
    adrNum: 2709,
    targetAdr: 2600,
    revenue: '$4.20M',
    revenueNum: 4.20,
    targetRev: 3.90,
    revpar: '$2,063.08',
    revparNum: 2063.08,
    targetRevpar: 1924.00,
    status: 'High Demand',
    children: [
      { name: 'SOSEI SWITZERLAND', location: 'Zermatt, Switzerland', totalRooms: 70, occupiedRooms: 55, occ: '78.57%', adr: '$2,780', revenue: '$2.18M', revpar: '$2,184' },
      { name: 'SOSEI CANADA', location: 'Whistler, Canada', totalRooms: 60, occupiedRooms: 44, occ: '73.33%', adr: '$2,620', revenue: '$2.02M', revpar: '$1,921' },
    ],
  },
  {
    id: 'nature',
    name: 'SOSEI Nature',
    location: 'Costa Rica & Japan',
    totalRooms: 145,
    occupiedRooms: 103,
    occ: '71.03%',
    occNum: 71.03,
    targetOcc: 70.0,
    adr: '$1,864.08',
    adrNum: 1864,
    targetAdr: 1800,
    revenue: '$2.80M',
    revenueNum: 2.80,
    targetRev: 2.70,
    revpar: '$1,324.14',
    revparNum: 1324.14,
    targetRevpar: 1260.00,
    status: 'Leisure Stable',
    children: [
      { name: 'SOSEI COSTA RICA', location: 'Papagayo, Costa Rica', totalRooms: 70, occupiedRooms: 51, occ: '72.86%', adr: '$1,950', revenue: '$1.55M', revpar: '$1,421' },
      { name: 'SOSEI JAPAN', location: 'Kyoto, Japan', totalRooms: 75, occupiedRooms: 52, occ: '69.33%', adr: '$1,780', revenue: '$1.25M', revpar: '$1,234' },
    ],
  },
  {
    id: 'wellness',
    name: 'SOSEI Wellness',
    location: 'Oman & Egypt',
    totalRooms: 165,
    occupiedRooms: 103,
    occ: '62.42%',
    occNum: 62.42,
    targetOcc: 60.0,
    adr: '$1,805.83',
    adrNum: 1806,
    targetAdr: 1650,
    revenue: '$2.60M',
    revenueNum: 2.60,
    targetRev: 2.50,
    revpar: '$1,127.27',
    revparNum: 1127.27,
    targetRevpar: 990.00,
    status: 'Restorative Demand',
    children: [
      { name: 'SOSEI OMAN', location: 'Jebel Akhdar, Oman', totalRooms: 85, occupiedRooms: 56, occ: '65.88%', adr: '$1,860', revenue: '$1.42M', revpar: '$1,225' },
      { name: 'SOSEI EGYPT', location: 'Siwa Oasis, Egypt', totalRooms: 80, occupiedRooms: 47, occ: '58.75%', adr: '$1,740', revenue: '$1.18M', revpar: '$1,022' },
    ],
  },
];


// Unified Booking Pace Simulation (Next 90 Days)
export interface BookingPaceData {
  timeframe: string;
  series: Array<{
    month: string;
    thisYear: number;
    lastYear: number;
    displayThisYear: string;
    displayLastYear: string;
  }>;
  summary: {
    paceVsLy: string;
    paceVsLyNum: number;
    roomNightsOtb: string;
    roomNightsOtbNum: number;
    roomNightsTrend: string;
    revenueOtb: string;
    revenueOtbNum: number;
    revenueTrend: string;
    pickup7d: string;
    pickup30d: string;
    paceVsBudget: string;
  };
}

export const simulatedBookingPaceData: BookingPaceData = {
  timeframe: 'NEXT 90 DAYS (ROOM NIGHTS OTB)',
  series: [
    { month: 'Oct', thisYear: 8820, lastYear: 6010, displayThisYear: '8.8K', displayLastYear: '6.0K' },
    { month: 'Nov', thisYear: 15540, lastYear: 11520, displayThisYear: '15.5K', displayLastYear: '11.5K' },
    { month: 'Dec', thisYear: 19500, lastYear: 14020, displayThisYear: '19.5K', displayLastYear: '14.0K' },
  ],
  summary: {
    paceVsLy: '+12%',
    paceVsLyNum: 12,
    roomNightsOtb: '14,820',
    roomNightsOtbNum: 14820,
    roomNightsTrend: '+12%',
    revenueOtb: '$38.4M',
    revenueOtbNum: 38.4,
    revenueTrend: '+14%',
    pickup7d: '+6%',
    pickup30d: '+12%',
    paceVsBudget: '+4.5% vs Target',
  },
};

// ============================================================================
// 4. REVENUE & DEMAND MIX (Single Source of Truth for 5 Pillars + Packages)
// ============================================================================

export interface MixItem {
  id: string;
  name: string;
  color: string;
  // Revenue Mode
  revenueUsd: number;
  revenueFormatted: string;
  revenuePct: number;
  revenuePctFormatted: string;
  revenueTrend: string;
  revenueTrendUp: boolean;
  // Demand Mode
  demandValue: number;
  demandFormatted: string;
  demandUnit: string;
  demandPct: number;
  demandPctFormatted: string;
  demandTrend: string;
  demandTrendUp: boolean;
  // Pillar metadata
  description: string;
  pillarRoute?: string;
}

export interface RevenueDemandMixData {
  timeframe: string;
  totalRevenueFormatted: string;
  totalRevenueNum: number;
  totalDemandFormatted: string;
  totalDemandNum: number;
  items: MixItem[];
}

export const simulatedRevenueDemandMixData: RevenueDemandMixData = {
  timeframe: 'MTD (BY BUSINESS)',
  totalRevenueFormatted: '$152.4M',
  totalRevenueNum: 152.4,
  totalDemandFormatted: '158.4K',
  totalDemandNum: 158400,
  items: [
    {
      id: 'rooms',
      name: 'Rooms',
      color: '#0f172a', // deep luxury black
      revenueUsd: 118.0,
      revenueFormatted: '$118.0M',
      revenuePct: 77,
      revenuePctFormatted: '77%',
      revenueTrend: '+14%',
      revenueTrendUp: true,
      demandValue: 74200,
      demandFormatted: '74,200 RN',
      demandUnit: 'Room Nights Occupied',
      demandPct: 47,
      demandPctFormatted: '47%',
      demandTrend: '+12%',
      demandTrendUp: true,
      description: 'Luxury suites, chalets, overwater villas and sanctuary pavilions',
      pillarRoute: '/dashboard/property',
    },
    {
      id: 'fnb',
      name: 'F&B',
      color: '#334155', // dark charcoal slate
      revenueUsd: 12.0,
      revenueFormatted: '$12.0M',
      revenuePct: 8,
      revenuePctFormatted: '8%',
      revenueTrend: '+9%',
      revenueTrendUp: true,
      demandValue: 48500,
      demandFormatted: '48,500 Covers',
      demandUnit: 'Dining Covers & Checks',
      demandPct: 31,
      demandPctFormatted: '31%',
      demandTrend: '+8%',
      demandTrendUp: true,
      description: 'Fine dining restaurants, omakase counters, wine cellars & private dining',
      pillarRoute: '/dashboard/experience/fnb',
    },
    {
      id: 'spa',
      name: 'Spa',
      color: '#475569', // medium dark slate gray
      revenueUsd: 8.0,
      revenueFormatted: '$8.0M',
      revenuePct: 5,
      revenuePctFormatted: '5%',
      revenueTrend: '+12%',
      revenueTrendUp: true,
      demandValue: 11200,
      demandFormatted: '11,200 Treats',
      demandUnit: 'Signature Spa Treatments',
      demandPct: 7,
      demandPctFormatted: '7%',
      demandTrend: '+14%',
      demandTrendUp: true,
      description: 'Alpine thermal baths, onsen therapies, signature massages & holistic rituals',
      pillarRoute: '/dashboard/experience/spa',
    },
    {
      id: 'wellness',
      name: 'Wellness',
      color: '#64748b', // slate gray
      revenueUsd: 7.0,
      revenueFormatted: '$7.0M',
      revenuePct: 5,
      revenuePctFormatted: '5%',
      revenueTrend: '+18%',
      revenueTrendUp: true,
      demandValue: 9800,
      demandFormatted: '9,800 Sessions',
      demandUnit: 'Wellness & Medical Sessions',
      demandPct: 6,
      demandPctFormatted: '6%',
      demandTrend: '+19%',
      demandTrendUp: true,
      description: 'Longevity diagnostics, cryotherapy, sound healing & meditation journeys',
      pillarRoute: '/dashboard/experience/wellness',
    },
    {
      id: 'activities',
      name: 'Activities',
      color: '#94a3b8', // light slate gray
      revenueUsd: 5.4,
      revenueFormatted: '$5.4M',
      revenuePct: 3,
      revenuePctFormatted: '3%',
      revenueTrend: '+16%',
      revenueTrendUp: true,
      demandValue: 10400,
      demandFormatted: '10,400 Guests',
      demandUnit: 'Activity Participants',
      demandPct: 6,
      demandPctFormatted: '6%',
      demandTrend: '+15%',
      demandTrendUp: true,
      description: 'Heli-skiing, desert safaris, private yacht charters & cultural expeditions',
      pillarRoute: '/dashboard/experience/activities',
    },
    {
      id: 'packages',
      name: 'Packages',
      color: '#cbd5e1', // soft silver gray
      revenueUsd: 2.0,
      revenueFormatted: '$2.0M',
      revenuePct: 2,
      revenuePctFormatted: '2%',
      revenueTrend: '+11%',
      revenueTrendUp: true,
      demandValue: 4300,
      demandFormatted: '4,300 Bookings',
      demandUnit: 'All-Inclusive Packages Booked',
      demandPct: 3,
      demandPctFormatted: '3%',
      demandTrend: '+10%',
      demandTrendUp: true,
      description: 'Curated multi-day journeys combining suites, fine dining, spa & excursions',
      pillarRoute: '/dashboard/sales/events',
    },
  ],
};

// ============================================================================
// 5. FORWARD BUSINESS (Committed On-The-Books / OTB for Future Periods)
// ============================================================================

export type ForwardBusinessWindow = '30D' | '90D' | '180D' | '365D';

export interface ForwardPeriodBucket {
  label: string; // e.g. "0–30D", "31–60D", "61–90D"
  revenueFormatted: string; // e.g. "$12.4M"
  revenueUsd: number;
  committedRevenueUsd: number; // dark bar (paid / contracted)
  tentativeRevenueUsd: number; // light bar (guaranteed / hold)
  roomNights: number;
  occupancyPct: number;
  highlight?: boolean;
}

export interface ForwardBusinessData {
  timeframe: string;
  defaultWindow: ForwardBusinessWindow;
  revenueOtb: string;
  revenueOtbNum: number;
  revenueTrend: string;
  roomNightsOtb: string;
  roomNightsOtbNum: number;
  roomNightsTrend: string;
  occupancyOtb: string;
  occupancyOtbNum: number;
  occupancyTrend: string; // "+4 pts vs LY"
  adrOtb: string;
  adrOtbNum: number;
  adrTrend: string;
  cancellationExposure: string;
  cancellationExposureNum: number;
  cancellationTrend: string;
  cancellationTrendUp: boolean; // true = risk higher
  strongestDemandPeriod: string;
  weakestDemandPeriod: string;
  forecastRevenue: string;
  buckets: ForwardPeriodBucket[];
}

export const simulatedForwardBusinessData: Record<ForwardBusinessWindow, ForwardBusinessData> = {
  '30D': {
    timeframe: 'NEXT 30 DAYS (OTB)',
    defaultWindow: '30D',
    revenueOtb: '$12.4M',
    revenueOtbNum: 12.4,
    revenueTrend: '+14% vs LY',
    roomNightsOtb: '4,820',
    roomNightsOtbNum: 4820,
    roomNightsTrend: '+12% vs LY',
    occupancyOtb: '78%',
    occupancyOtbNum: 78,
    occupancyTrend: '+5 pts vs LY',
    adrOtb: '$2,180',
    adrOtbNum: 2180,
    adrTrend: '+7% vs LY',
    cancellationExposure: '$0.6M',
    cancellationExposureNum: 0.6,
    cancellationTrend: '+4% vs LY',
    cancellationTrendUp: true,
    strongestDemandPeriod: 'Late October Peak',
    weakestDemandPeriod: 'Mid-week Tuesdays',
    forecastRevenue: '$13.2M',
    buckets: [
      { label: 'Day 1–10', revenueFormatted: '$4.2M', revenueUsd: 4.2, committedRevenueUsd: 2.8, tentativeRevenueUsd: 1.4, roomNights: 1650, occupancyPct: 81 },
      { label: 'Day 11–20', revenueFormatted: '$4.6M', revenueUsd: 4.6, committedRevenueUsd: 3.1, tentativeRevenueUsd: 1.5, roomNights: 1780, occupancyPct: 84, highlight: true },
      { label: 'Day 21–30', revenueFormatted: '$3.6M', revenueUsd: 3.6, committedRevenueUsd: 2.4, tentativeRevenueUsd: 1.2, roomNights: 1390, occupancyPct: 70 },
    ],
  },
  '90D': {
    timeframe: 'NEXT 90 DAYS (OTB)',
    defaultWindow: '90D',
    revenueOtb: '$38.4M',
    revenueOtbNum: 38.4,
    revenueTrend: '+14% vs LY',
    roomNightsOtb: '14,820',
    roomNightsOtbNum: 14820,
    roomNightsTrend: '+12% vs LY',
    occupancyOtb: '76%',
    occupancyOtbNum: 76,
    occupancyTrend: '+4 pts vs LY',
    adrOtb: '$2,120',
    adrOtbNum: 2120,
    adrTrend: '+6% vs LY',
    cancellationExposure: '$2.1M',
    cancellationExposureNum: 2.1,
    cancellationTrend: '+8% vs LY',
    cancellationTrendUp: true,
    strongestDemandPeriod: 'December Festive Holidays',
    weakestDemandPeriod: 'Early November Shoulder',
    forecastRevenue: '$42.1M',
    buckets: [
      { label: '0–30D', revenueFormatted: '$12.4M', revenueUsd: 12.4, committedRevenueUsd: 7.8, tentativeRevenueUsd: 4.6, roomNights: 4820, occupancyPct: 78 },
      { label: '31–60D', revenueFormatted: '$14.8M', revenueUsd: 14.8, committedRevenueUsd: 9.6, tentativeRevenueUsd: 5.2, roomNights: 5800, occupancyPct: 82, highlight: true },
      { label: '61–90D', revenueFormatted: '$11.2M', revenueUsd: 11.2, committedRevenueUsd: 6.8, tentativeRevenueUsd: 4.4, roomNights: 4200, occupancyPct: 68 },
    ],
  },
  '180D': {
    timeframe: 'NEXT 180 DAYS (OTB)',
    defaultWindow: '180D',
    revenueOtb: '$68.2M',
    revenueOtbNum: 68.2,
    revenueTrend: '+10% vs LY',
    roomNightsOtb: '27,400',
    roomNightsOtbNum: 27400,
    roomNightsTrend: '+9% vs LY',
    occupancyOtb: '69%',
    occupancyOtbNum: 69,
    occupancyTrend: '+3 pts vs LY',
    adrOtb: '$2,080',
    adrOtbNum: 2080,
    adrTrend: '+5% vs LY',
    cancellationExposure: '$4.2M',
    cancellationExposureNum: 4.2,
    cancellationTrend: '+7% vs LY',
    cancellationTrendUp: true,
    strongestDemandPeriod: 'Q1 Winter Ski Season',
    weakestDemandPeriod: 'Late January Transition',
    forecastRevenue: '$76.5M',
    buckets: [
      { label: '0–60D', revenueFormatted: '$27.2M', revenueUsd: 27.2, committedRevenueUsd: 17.4, tentativeRevenueUsd: 9.8, roomNights: 10620, occupancyPct: 80 },
      { label: '61–120D', revenueFormatted: '$24.6M', revenueUsd: 24.6, committedRevenueUsd: 14.8, tentativeRevenueUsd: 9.8, roomNights: 9800, occupancyPct: 72, highlight: true },
      { label: '121–180D', revenueFormatted: '$16.4M', revenueUsd: 16.4, committedRevenueUsd: 9.4, tentativeRevenueUsd: 7.0, roomNights: 6980, occupancyPct: 56 },
    ],
  },
  '365D': {
    timeframe: 'NEXT 365 DAYS (OTB)',
    defaultWindow: '365D',
    revenueOtb: '$104.5M',
    revenueOtbNum: 104.5,
    revenueTrend: '+8% vs LY',
    roomNightsOtb: '41,800',
    roomNightsOtbNum: 41800,
    roomNightsTrend: '+8% vs LY',
    occupancyOtb: '54%',
    occupancyOtbNum: 54,
    occupancyTrend: '+2 pts vs LY',
    adrOtb: '$2,040',
    adrOtbNum: 2040,
    adrTrend: '+4% vs LY',
    cancellationExposure: '$6.8M',
    cancellationExposureNum: 6.8,
    cancellationTrend: '+6% vs LY',
    cancellationTrendUp: true,
    strongestDemandPeriod: 'Summer & Festive Holidays',
    weakestDemandPeriod: 'Spring Shoulder Season',
    forecastRevenue: '$122.0M',
    buckets: [
      { label: 'Q1 OTB', revenueFormatted: '$38.4M', revenueUsd: 38.4, committedRevenueUsd: 24.2, tentativeRevenueUsd: 14.2, roomNights: 14820, occupancyPct: 76, highlight: true },
      { label: 'Q2 OTB', revenueFormatted: '$29.8M', revenueUsd: 29.8, committedRevenueUsd: 17.6, tentativeRevenueUsd: 12.2, roomNights: 12100, occupancyPct: 62 },
      { label: 'Q3–Q4', revenueFormatted: '$36.3M', revenueUsd: 36.3, committedRevenueUsd: 20.4, tentativeRevenueUsd: 15.9, roomNights: 14880, occupancyPct: 45 },
    ],
  },
};

// ============================================================================
// 6. PORTFOLIO SIGNALS (SOSEI Signals - Portfolio Intelligence & AI Layer)
// ============================================================================

export type SignalType = 'opportunity' | 'risk' | 'neutral' | 'ai_recommendation';

export interface PortfolioSignalItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // "Today", "Yesterday"
  signalType: SignalType;
  iconType: 'up_arrow' | 'down_arrow' | 'dash' | 'sparkle';
  impactSummary: string;
  affectedProperties: string[];
  category: 'Demand' | 'Performance' | 'Corporate' | 'Cancellation' | 'Intelligence';
  aiRecommendation?: string;
  isAiAssisted?: boolean;
}

export interface SOSEISignalsData {
  title: string;
  subtitle: string;
  items: PortfolioSignalItem[];
}

export const simulatedSOSEISignalsData: SOSEISignalsData = {
  title: 'SOSEI SIGNALS',
  subtitle: 'KEY INSIGHTS FOR TODAY',
  items: [
    {
      id: 'sig_1',
      title: 'Demand accelerating in Asia Pacific',
      description: 'APAC room night pickup is +18% vs last year across Ocean and City.',
      timestamp: 'Today',
      signalType: 'opportunity',
      iconType: 'up_arrow',
      impactSummary: '+18% RN Pickup vs STLY',
      affectedProperties: ['SOSEI MALDIVES', 'SOSEI BALI', 'SOSEI JAPAN'],
      category: 'Demand',
      isAiAssisted: false,
      aiRecommendation: 'Consider releasing premium villa inventory with 4-night minimum stay to maximize ADR yield.',
    },
    {
      id: 'sig_2',
      title: 'Ski resorts outperforming plan',
      description: 'RevPAR is 9% above budget with occupancy 2 pts ahead of plan.',
      timestamp: 'Today',
      signalType: 'opportunity',
      iconType: 'up_arrow',
      impactSummary: '+9% RevPAR vs Budget (+2.0 pts Occ)',
      affectedProperties: ['SOSEI SWITZERLAND', 'SOSEI CANADA'],
      category: 'Performance',
      isAiAssisted: false,
      aiRecommendation: 'Opportunity to advance ski concierge package pricing for December festive peak.',
    },
    {
      id: 'sig_3',
      title: 'Corporate demand softening',
      description: 'Corporate room nights are down 7% across urban properties.',
      timestamp: 'Yesterday',
      signalType: 'risk',
      iconType: 'down_arrow',
      impactSummary: '-7% RN vs STLY in Corporate Segment',
      affectedProperties: ['SOSEI TOKYO', 'SOSEI BARCELONA'],
      category: 'Corporate',
      isAiAssisted: false,
      aiRecommendation: 'Activate relationship intelligence with corporate partners for midweek retreats.',
    },
    {
      id: 'sig_4',
      title: 'Increased cancellation exposure',
      description: '$1.4M of booked revenue falls within high-risk cancellation windows.',
      timestamp: 'Yesterday',
      signalType: 'neutral',
      iconType: 'dash',
      impactSummary: '$1.4M Revenue in Flexible/Non-Guaranteed Window',
      affectedProperties: ['SOSEI BALI', 'SOSEI OMAN', 'SOSEI EGYPT'],
      category: 'Cancellation',
      isAiAssisted: false,
      aiRecommendation: 'Engage Butler Concierge for personalized pre-arrival itinerary confirmations to lock in deposits.',
    },
  ],
};

// ============================================================================
// 7. PORTFOLIO COMPARISON (CEO "Who is winning?" Property Comparison Table)
// ============================================================================

export interface PortfolioComparisonItem {
  id: string;
  property: string;
  location: string;
  occupancy: string;
  occupancyNum: number;
  adrFormatted: string;
  adrNum: number;
  revparFormatted: string;
  revparNum: number;
  roomRevenueFormatted: string;
  roomRevenueNum: number;
  totalRevenueFormatted: string;
  totalRevenueNum: number;
  growthVsLy: string;
  growthVsLyNum: number;
  growthVsLyUp: boolean;
  vsBudget: string;
  vsBudgetNum: number;
  vsBudgetUp: boolean;
  status: 'above_plan' | 'on_plan' | 'attention';
  propertyRoute?: string;
}

export interface PortfolioComparisonData {
  title: string;
  subtitle: string;
  items: PortfolioComparisonItem[];
}

export const simulatedPortfolioComparisonData: PortfolioComparisonData = {
  title: 'PORTFOLIO COMPARISON',
  subtitle: 'PERFORMANCE BY PROPERTY (MTD)',
  items: [
    {
      id: 'urban',
      property: 'SOSEI Urban',
      location: 'Spain & Japan (Barcelona & Tokyo)',
      occupancy: '69%',
      occupancyNum: 69.5,
      adrFormatted: '$2,499',
      adrNum: 2499,
      revparFormatted: '$1,737',
      revparNum: 1737,
      roomRevenueFormatted: '$24.5M',
      roomRevenueNum: 24.5,
      totalRevenueFormatted: '$31.6M',
      totalRevenueNum: 31.6,
      growthVsLy: '+12%',
      growthVsLyNum: 12,
      growthVsLyUp: true,
      vsBudget: '+6%',
      vsBudgetNum: 6,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=urban',
    },
    {
      id: 'beach-resort',
      property: 'SOSEI Beach Resort',
      location: 'Indonesia & Maldives (Bali & Maldives)',
      occupancy: '74%',
      occupancyNum: 73.6,
      adrFormatted: '$2,281',
      adrNum: 2281,
      revparFormatted: '$1,678',
      revparNum: 1678,
      roomRevenueFormatted: '$23.2M',
      roomRevenueNum: 23.2,
      totalRevenueFormatted: '$29.8M',
      totalRevenueNum: 29.8,
      growthVsLy: '+14%',
      growthVsLyNum: 14,
      growthVsLyUp: true,
      vsBudget: '+6%',
      vsBudgetNum: 6,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=beach-resort',
    },
    {
      id: 'ski',
      property: 'SOSEI Ski',
      location: 'Switzerland & Canada',
      occupancy: '76%',
      occupancyNum: 76.2,
      adrFormatted: '$2,709',
      adrNum: 2709,
      revparFormatted: '$2,063',
      revparNum: 2063,
      roomRevenueFormatted: '$26.8M',
      roomRevenueNum: 26.8,
      totalRevenueFormatted: '$34.5M',
      totalRevenueNum: 34.5,
      growthVsLy: '+18%',
      growthVsLyNum: 18,
      growthVsLyUp: true,
      vsBudget: '+9%',
      vsBudgetNum: 9,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=ski',
    },
    {
      id: 'nature',
      property: 'SOSEI Nature',
      location: 'Costa Rica & Japan',
      occupancy: '71%',
      occupancyNum: 71.0,
      adrFormatted: '$1,864',
      adrNum: 1864,
      revparFormatted: '$1,324',
      revparNum: 1324,
      roomRevenueFormatted: '$22.5M',
      roomRevenueNum: 22.5,
      totalRevenueFormatted: '$28.9M',
      totalRevenueNum: 28.9,
      growthVsLy: '+11%',
      growthVsLyNum: 11,
      growthVsLyUp: true,
      vsBudget: '+5%',
      vsBudgetNum: 5,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=nature',
    },
    {
      id: 'wellness',
      property: 'SOSEI Wellness',
      location: 'Oman & Egypt',
      occupancy: '62%',
      occupancyNum: 62.4,
      adrFormatted: '$1,806',
      adrNum: 1806,
      revparFormatted: '$1,127',
      revparNum: 1127,
      roomRevenueFormatted: '$21.0M',
      roomRevenueNum: 21.0,
      totalRevenueFormatted: '$27.6M',
      totalRevenueNum: 27.6,
      growthVsLy: '+7%',
      growthVsLyNum: 7,
      growthVsLyUp: true,
      vsBudget: '+3%',
      vsBudgetNum: 3,
      vsBudgetUp: true,
      status: 'on_plan',
      propertyRoute: '/dashboard/property?id=wellness',
    },
  ],
};

// ==========================================
// 8A. GEO MARKET DATA (SSOT)
// ==========================================
export interface GeoMarketItem {
  id: string;
  market: string;
  roomNightsPct: number;
  roomNightsFormatted: string;
  adrUsd: number;
  adrFormatted: string;
  revenueUsdMillions: number;
  revenueFormatted: string;
  vsLyPct: number;
  vsLyFormatted: string;
  isPositive: boolean;
  feederCountries: string[];
  keyHubs: string;
}

export const simulatedGeoMarketData: {
  title: string;
  subtitle: string;
  question: string;
  totalRevenue: string;
  items: GeoMarketItem[];
} = {
  title: 'GEO MARKET',
  subtitle: 'Regional Feeder Market Distribution',
  question: 'Where is demand coming from?',
  totalRevenue: '$118M',
  items: [
    {
      id: 'asia-pacific',
      market: 'Asia Pacific',
      roomNightsPct: 35,
      roomNightsFormatted: '35%',
      adrUsd: 1380,
      adrFormatted: '$1,380',
      revenueUsdMillions: 41,
      revenueFormatted: '$41M',
      vsLyPct: 16,
      vsLyFormatted: '↑ +16%',
      isPositive: true,
      feederCountries: ['Japan', 'Singapore', 'Australia', 'Hong Kong'],
      keyHubs: 'Tokyo (HND/NRT), Singapore (SIN), Sydney (SYD)',
    },
    {
      id: 'europe',
      market: 'Europe',
      roomNightsPct: 25,
      roomNightsFormatted: '25%',
      adrUsd: 1520,
      adrFormatted: '$1,520',
      revenueUsdMillions: 30,
      revenueFormatted: '$30M',
      vsLyPct: 12,
      vsLyFormatted: '↑ +12%',
      isPositive: true,
      feederCountries: ['United Kingdom', 'Switzerland', 'Germany', 'France'],
      keyHubs: 'London (LHR), Zurich (ZRH), Frankfurt (FRA), Paris (CDG)',
    },
    {
      id: 'america',
      market: 'America',
      roomNightsPct: 20,
      roomNightsFormatted: '20%',
      adrUsd: 1410,
      adrFormatted: '$1,410',
      revenueUsdMillions: 24,
      revenueFormatted: '$24M',
      vsLyPct: 8,
      vsLyFormatted: '↑ +8%',
      isPositive: true,
      feederCountries: ['United States', 'Canada', 'Brazil', 'Mexico'],
      keyHubs: 'New York (JFK), Los Angeles (LAX), Miami (MIA)',
    },
    {
      id: 'middle-east',
      market: 'Middle East',
      roomNightsPct: 12,
      roomNightsFormatted: '12%',
      adrUsd: 1650,
      adrFormatted: '$1,650',
      revenueUsdMillions: 16,
      revenueFormatted: '$16M',
      vsLyPct: 9,
      vsLyFormatted: '↑ +9%',
      isPositive: true,
      feederCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar'],
      keyHubs: 'Dubai (DXB), Riyadh (RUH), Doha (DOH)',
    },
    {
      id: 'africa',
      market: 'Africa',
      roomNightsPct: 8,
      roomNightsFormatted: '8%',
      adrUsd: 1120,
      adrFormatted: '$1,120',
      revenueUsdMillions: 7,
      revenueFormatted: '$7M',
      vsLyPct: 5,
      vsLyFormatted: '↑ +5%',
      isPositive: true,
      feederCountries: ['South Africa', 'Kenya', 'Morocco', 'Egypt'],
      keyHubs: 'Johannesburg (JNB), Nairobi (NBO), Casablanca (CMN)',
    },
  ],
};

// ==========================================
// 8B. MARKET SEGMENT DATA (SSOT)
// ==========================================
export interface MarketSegmentItem {
  id: string;
  segment: string;
  roomNightsPct: number;
  roomNightsFormatted: string;
  adrUsd: number;
  adrFormatted: string;
  revenueUsdMillions: number;
  revenueFormatted: string;
  vsLyPct: number;
  vsLyFormatted: string;
  isPositive: boolean;
  description: string;
  avgLeadTimeDays: number;
  cancellationRisk: 'Low' | 'Medium' | 'High';
}

export const simulatedMarketSegmentData: {
  title: string;
  subtitle: string;
  question: string;
  totalRevenue: string;
  items: MarketSegmentItem[];
} = {
  title: 'MARKET SEGMENT',
  subtitle: 'Guest Demand & Guest Type Composition',
  question: 'What kind of demand are we attracting?',
  totalRevenue: '$118M',
  items: [
    {
      id: 'leisure',
      segment: 'Leisure',
      roomNightsPct: 55,
      roomNightsFormatted: '55%',
      adrUsd: 1380,
      adrFormatted: '$1,380',
      revenueUsdMillions: 65,
      revenueFormatted: '$65M',
      vsLyPct: 14,
      vsLyFormatted: '↑ +14%',
      isPositive: true,
      description: 'High net-worth leisure travelers, couples & luxury holidaymakers',
      avgLeadTimeDays: 52,
      cancellationRisk: 'Low',
    },
    {
      id: 'business',
      segment: 'Business',
      roomNightsPct: 25,
      roomNightsFormatted: '25%',
      adrUsd: 1620,
      adrFormatted: '$1,620',
      revenueUsdMillions: 30,
      revenueFormatted: '$30M',
      vsLyPct: 8,
      vsLyFormatted: '↑ +8%',
      isPositive: true,
      description: 'C-suite executives, corporate retreat buyouts & partner stays',
      avgLeadTimeDays: 21,
      cancellationRisk: 'Medium',
    },
    {
      id: 'social',
      segment: 'Social',
      roomNightsPct: 10,
      roomNightsFormatted: '10%',
      adrUsd: 1180,
      adrFormatted: '$1,180',
      revenueUsdMillions: 11,
      revenueFormatted: '$11M',
      vsLyPct: 10,
      vsLyFormatted: '↑ +10%',
      isPositive: true,
      description: 'Private celebrations, bespoke weddings & family gatherings',
      avgLeadTimeDays: 45,
      cancellationRisk: 'Low',
    },
    {
      id: 'mice',
      segment: 'MICE',
      roomNightsPct: 7,
      roomNightsFormatted: '7%',
      adrUsd: 1720,
      adrFormatted: '$1,720',
      revenueUsdMillions: 9,
      revenueFormatted: '$9M',
      vsLyPct: 12,
      vsLyFormatted: '↑ +12%',
      isPositive: true,
      description: 'Executive leadership summits, conferences & private buyouts',
      avgLeadTimeDays: 85,
      cancellationRisk: 'Medium',
    },
    {
      id: 'others',
      segment: 'Others',
      roomNightsPct: 3,
      roomNightsFormatted: '3%',
      adrUsd: 1050,
      adrFormatted: '$1,050',
      revenueUsdMillions: 3,
      revenueFormatted: '$3M',
      vsLyPct: 4,
      vsLyFormatted: '↑ +4%',
      isPositive: true,
      description: 'Diplomatic delegations, media partners & industry affiliations',
      avgLeadTimeDays: 18,
      cancellationRisk: 'Low',
    },
  ],
};






