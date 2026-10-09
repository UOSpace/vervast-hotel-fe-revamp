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
  {
    id: 'sosei-nocturne',
    name: 'SOSEI NOCTURNE',
    city: 'Zermatt, Switzerland',
    country: 'Switzerland',
    grouping: 'Alpine',
    coordinates: [8.2275, 46.8182],
    totalRooms: 95,
    occupiedRooms: 74,
    occupancyPct: 77.9,
    occupancyFormatted: '77.9%',
    adrUsd: 2800,
    adrFormatted: '$2,800',
    revparUsd: 2181,
    revparFormatted: '$2,181',
    monthlyRevenueUsd: 2200000,
    revenueFormatted: '$2.20M',
    guestsInHouse: 148,
    arrivalsToday: 18,
    departuresToday: 12,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_001',
      guestName: 'Sal Zanjabila',
      guestTitle: 'Ms.',
      vipTier: 'Platinum VIP',
      nationality: 'British',
      roomType: 'Matterhorn Penthouse Suite',
      roomNumber: 'Rm 401',
      checkInDate: 'Aug 28',
      checkOutDate: 'Sep 02',
      nights: 5,
      dailyRate: 2850,
      totalStayAmount: 14250,
      specialRequest: 'Gluten-Free · Helipad Ski Concierge',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-aurora',
    name: 'SOSEI AURORA',
    city: 'Rovaniemi, Finland',
    country: 'Finland',
    grouping: 'Alpine',
    coordinates: [25.7208, 66.5039],
    totalRooms: 48,
    occupiedRooms: 36,
    occupancyPct: 75.0,
    occupancyFormatted: '75.0%',
    adrUsd: 2600,
    adrFormatted: '$2,600',
    revparUsd: 1950,
    revparFormatted: '$1,950',
    monthlyRevenueUsd: 2000000,
    revenueFormatted: '$2.00M',
    guestsInHouse: 72,
    arrivalsToday: 10,
    departuresToday: 8,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_007',
      guestName: 'Henrik Lindqvist',
      guestTitle: 'Mr.',
      vipTier: 'Sanctuary Elite',
      nationality: 'Swedish',
      roomType: 'Glass Igloo Observatory Suite',
      roomNumber: 'Rm 104',
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 02',
      nights: 4,
      dailyRate: 2600,
      totalStayAmount: 10400,
      specialRequest: 'Aurora Borealis wake-up alarm · Sauna',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-marea',
    name: 'SOSEI MARÉA',
    city: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    grouping: 'Ocean',
    coordinates: [73.5089, 4.1755],
    totalRooms: 52,
    occupiedRooms: 40,
    occupancyPct: 76.9,
    occupancyFormatted: '76.9%',
    adrUsd: 2400,
    adrFormatted: '$2,400',
    revparUsd: 1846,
    revparFormatted: '$1,846',
    monthlyRevenueUsd: 1400000,
    revenueFormatted: '$1.40M',
    guestsInHouse: 95,
    arrivalsToday: 12,
    departuresToday: 9,
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
      checkInDate: 'Aug 26',
      checkOutDate: 'Sep 03',
      nights: 8,
      dailyRate: 2612,
      totalStayAmount: 20900,
      specialRequest: 'Private Sommelier · Sunset reef excursion',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-pelagia',
    name: 'SOSEI PELAGIA',
    city: 'Uluwatu, Indonesia',
    country: 'Indonesia',
    grouping: 'Ocean',
    coordinates: [115.1889, -8.4095],
    totalRooms: 64,
    occupiedRooms: 45,
    occupancyPct: 70.3,
    occupancyFormatted: '70.3%',
    adrUsd: 1900,
    adrFormatted: '$1,900',
    revparUsd: 1336,
    revparFormatted: '$1,336',
    monthlyRevenueUsd: 1200000,
    revenueFormatted: '$1.20M',
    guestsInHouse: 101,
    arrivalsToday: 14,
    departuresToday: 11,
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
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 02',
      nights: 4,
      dailyRate: 2150,
      totalStayAmount: 8600,
      specialRequest: 'Holistic Balinese purification ritual',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-verper',
    name: 'SOSEI VERPER',
    city: 'New York, USA',
    country: 'USA',
    grouping: 'City',
    coordinates: [-74.006, 40.7128],
    totalRooms: 120,
    occupiedRooms: 74,
    occupancyPct: 61.7,
    occupancyFormatted: '61.7%',
    adrUsd: 1450,
    adrFormatted: '$1,450',
    revparUsd: 895,
    revparFormatted: '$895',
    monthlyRevenueUsd: 1300000,
    revenueFormatted: '$1.30M',
    guestsInHouse: 198,
    arrivalsToday: 32,
    departuresToday: 28,
    status: 'attention',
    statusLabel: 'Attention',
    activeGuest: {
      guestId: 'gst_ind_003',
      guestName: 'Dr. Elizabeth Hall',
      guestTitle: 'Dr.',
      vipTier: 'Gold VIP',
      nationality: 'British',
      roomType: 'Central Park Skyline Loft',
      roomNumber: 'Rm 2204',
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 01',
      nights: 3,
      dailyRate: 1450,
      totalStayAmount: 4350,
      specialRequest: 'High floor study table · Late 14:00 checkout',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-elan',
    name: 'SOSEI ÉLAN',
    city: 'Los Angeles, USA',
    country: 'USA',
    grouping: 'City',
    coordinates: [-118.2437, 34.0522],
    totalRooms: 85,
    occupiedRooms: 59,
    occupancyPct: 69.4,
    occupancyFormatted: '69.4%',
    adrUsd: 1600,
    adrFormatted: '$1,600',
    revparUsd: 1111,
    revparFormatted: '$1,111',
    monthlyRevenueUsd: 1100000,
    revenueFormatted: '$1.10M',
    guestsInHouse: 116,
    arrivalsToday: 16,
    departuresToday: 14,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_011',
      guestName: 'Julian Vance',
      guestTitle: 'Mr.',
      vipTier: 'Platinum VIP',
      nationality: 'American',
      roomType: 'Beverly Hills Terrace Suite',
      roomNumber: 'Rm 502',
      checkInDate: 'Aug 28',
      checkOutDate: 'Sep 01',
      nights: 4,
      dailyRate: 1700,
      totalStayAmount: 6800,
      specialRequest: 'Private rooftop pool cabana reserved',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-sylvan',
    name: 'SOSEI SYLVAN',
    city: 'Kyoto, Japan',
    country: 'Japan',
    grouping: 'Forest',
    coordinates: [135.7681, 35.0116],
    totalRooms: 42,
    occupiedRooms: 35,
    occupancyPct: 83.3,
    occupancyFormatted: '83.3%',
    adrUsd: 2100,
    adrFormatted: '$2,100',
    revparUsd: 1750,
    revparFormatted: '$1,750',
    monthlyRevenueUsd: 1000000,
    revenueFormatted: '$1.00M',
    guestsInHouse: 64,
    arrivalsToday: 8,
    departuresToday: 6,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_002',
      guestName: 'Kenzo Tanaka',
      guestTitle: 'Mr.',
      vipTier: 'Founding Circle',
      nationality: 'Japanese',
      roomType: 'Bamboo Pavilion Garden Ryokan',
      roomNumber: 'Villa 12',
      checkInDate: 'Aug 27',
      checkOutDate: 'Sep 01',
      nights: 5,
      dailyRate: 2340,
      totalStayAmount: 11700,
      specialRequest: 'Private tea ceremony with Zen Master',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-verdant',
    name: 'SOSEI VERDANT',
    city: 'Chiang Mai, Thailand',
    country: 'Thailand',
    grouping: 'Forest',
    coordinates: [98.9853, 18.7883],
    totalRooms: 50,
    occupiedRooms: 29,
    occupancyPct: 58.0,
    occupancyFormatted: '58.0%',
    adrUsd: 1250,
    adrFormatted: '$1,250',
    revparUsd: 725,
    revparFormatted: '$725',
    monthlyRevenueUsd: 800000,
    revenueFormatted: '$0.80M',
    guestsInHouse: 53,
    arrivalsToday: 7,
    departuresToday: 5,
    status: 'attention',
    statusLabel: 'Attention',
    activeGuest: {
      guestId: 'gst_ind_015',
      guestName: 'Charlotte Dupuis',
      guestTitle: 'Mme.',
      vipTier: 'Silver VIP',
      nationality: 'French',
      roomType: 'Canopy Rainforest Treehouse',
      roomNumber: 'Suite 08',
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 02',
      nights: 4,
      dailyRate: 1250,
      totalStayAmount: 5000,
      specialRequest: 'Organic botanical spa consultation',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-hearth',
    name: 'SOSEI HEARTH',
    city: 'Tuscany, Italy',
    country: 'Italy',
    grouping: 'Countryside',
    coordinates: [11.2558, 43.7696],
    totalRooms: 54,
    occupiedRooms: 43,
    occupancyPct: 79.6,
    occupancyFormatted: '79.6%',
    adrUsd: 1950,
    adrFormatted: '$1,950',
    revparUsd: 1552,
    revparFormatted: '$1,552',
    monthlyRevenueUsd: 1100000,
    revenueFormatted: '$1.10M',
    guestsInHouse: 86,
    arrivalsToday: 11,
    departuresToday: 9,
    status: 'above_plan',
    statusLabel: 'Performing above plan',
    activeGuest: {
      guestId: 'gst_ind_008',
      guestName: 'Lord Sterling',
      guestTitle: 'Lord',
      vipTier: 'Founding Circle',
      nationality: 'British',
      roomType: 'Chianti Vineyard Master Estate',
      roomNumber: 'Suite 204',
      checkInDate: 'Aug 28',
      checkOutDate: 'Sep 04',
      nights: 7,
      dailyRate: 1957,
      totalStayAmount: 13700,
      specialRequest: 'Private winery barrel tasting with estate vintner',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-pastoral',
    name: 'SOSEI PASTORAL',
    city: 'Provence, France',
    country: 'France',
    grouping: 'Countryside',
    coordinates: [5.2684, 43.7151],
    totalRooms: 45,
    occupiedRooms: 32,
    occupancyPct: 71.1,
    occupancyFormatted: '71.1%',
    adrUsd: 1750,
    adrFormatted: '$1,750',
    revparUsd: 1244,
    revparFormatted: '$1,244',
    monthlyRevenueUsd: 900000,
    revenueFormatted: '$0.90M',
    guestsInHouse: 62,
    arrivalsToday: 8,
    departuresToday: 7,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_018',
      guestName: 'Isabelle Moreau',
      guestTitle: 'Mrs.',
      vipTier: 'Sanctuary Elite',
      nationality: 'French',
      roomType: 'Lavender Valley Chateau Suite',
      roomNumber: 'Chateau 16',
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 02',
      nights: 4,
      dailyRate: 1750,
      totalStayAmount: 7000,
      specialRequest: 'Truffle foraging with Executive Chef',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-mirage',
    name: 'SOSEI MIRAGE',
    city: 'Giza / Siwa, Egypt',
    country: 'Egypt',
    grouping: 'Desert',
    coordinates: [31.13, 29.97],
    totalRooms: 38,
    occupiedRooms: 21,
    occupancyPct: 55.3,
    occupancyFormatted: '55.3%',
    adrUsd: 1650,
    adrFormatted: '$1,650',
    revparUsd: 912,
    revparFormatted: '$912',
    monthlyRevenueUsd: 1000000,
    revenueFormatted: '$1.00M',
    guestsInHouse: 47,
    arrivalsToday: 6,
    departuresToday: 4,
    status: 'attention',
    statusLabel: 'Attention',
    activeGuest: {
      guestId: 'gst_ind_022',
      guestName: 'Sheikh Tariq Al-Mansoor',
      guestTitle: 'H.E.',
      vipTier: 'Royal Patron',
      nationality: 'Emirati',
      roomType: 'Oasis Royal Stargazing Tent',
      roomNumber: 'Tent 01',
      checkInDate: 'Aug 30',
      checkOutDate: 'Sep 02',
      nights: 3,
      dailyRate: 1933,
      totalStayAmount: 5800,
      specialRequest: 'Private astronomer guide & dunes dinner',
      bookingStatus: 'in_house',
    },
  },
  {
    id: 'sosei-solstice',
    name: 'SOSEI SOLSTICE',
    city: 'Jebel Akhdar, Oman',
    country: 'Oman',
    grouping: 'Desert',
    coordinates: [58.4059, 23.5859],
    totalRooms: 46,
    occupiedRooms: 30,
    occupancyPct: 65.2,
    occupancyFormatted: '65.2%',
    adrUsd: 1850,
    adrFormatted: '$1,850',
    revparUsd: 1206,
    revparFormatted: '$1,206',
    monthlyRevenueUsd: 800000,
    revenueFormatted: '$0.80M',
    guestsInHouse: 46,
    arrivalsToday: 5,
    departuresToday: 4,
    status: 'on_plan',
    statusLabel: 'On plan',
    activeGuest: {
      guestId: 'gst_ind_025',
      guestName: 'David Rothschild',
      guestTitle: 'Mr.',
      vipTier: 'Platinum VIP',
      nationality: 'Swiss',
      roomType: 'Canyon Ridge Dune Villa',
      roomNumber: 'Villa 09',
      checkInDate: 'Aug 29',
      checkOutDate: 'Sep 02',
      nights: 4,
      dailyRate: 1850,
      totalStayAmount: 7400,
      specialRequest: 'Private canyon sunrise yoga & falconry',
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
  localTime: string;
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
    id: 'alpine',
    name: 'SOSEI Alpine',
    location: 'Switzerland & Finland',
    totalRooms: 143,
    occupiedRooms: 110,
    occ: '76.92%',
    occNum: 76.92,
    targetOcc: 74.0,
    adr: '$2,734.55',
    adrNum: 2735,
    targetAdr: 2600,
    revenue: '$4.20M',
    revenueNum: 4.20,
    targetRev: 3.90,
    revpar: '$2,103.50',
    revparNum: 2103.50,
    targetRevpar: 1924.00,
    status: 'High Demand',
    localTime: '14:30 CET',
    children: [
      { name: 'SOSEI NOCTURNE', location: 'Zermatt, Switzerland', totalRooms: 95, occupiedRooms: 74, occ: '77.89%', adr: '$2,800', revenue: '$2.20M', revpar: '$2,181' },
      { name: 'SOSEI AURORA', location: 'Rovaniemi, Finland', totalRooms: 48, occupiedRooms: 36, occ: '75.00%', adr: '$2,600', revenue: '$2.00M', revpar: '$1,950' },
    ],
  },
  {
    id: 'ocean',
    name: 'SOSEI Ocean',
    location: 'Maldives & Indonesia',
    totalRooms: 116,
    occupiedRooms: 85,
    occ: '73.28%',
    occNum: 73.28,
    targetOcc: 71.5,
    adr: '$2,135.29',
    adrNum: 2135,
    targetAdr: 2050,
    revenue: '$2.60M',
    revenueNum: 2.60,
    targetRev: 2.45,
    revpar: '$1,564.66',
    revparNum: 1564.66,
    targetRevpar: 1465.75,
    status: 'Optimal Flow',
    localTime: '18:30 MVT',
    children: [
      { name: 'SOSEI MARÉA', location: 'North Malé Atoll, Maldives', totalRooms: 52, occupiedRooms: 40, occ: '76.92%', adr: '$2,400', revenue: '$1.40M', revpar: '$1,846' },
      { name: 'SOSEI PELAGIA', location: 'Uluwatu, Indonesia', totalRooms: 64, occupiedRooms: 45, occ: '70.31%', adr: '$1,900', revenue: '$1.20M', revpar: '$1,336' },
    ],
  },
  {
    id: 'city',
    name: 'SOSEI City',
    location: 'New York & Los Angeles',
    totalRooms: 205,
    occupiedRooms: 133,
    occ: '64.88%',
    occNum: 64.88,
    targetOcc: 68.0,
    adr: '$1,516.54',
    adrNum: 1517,
    targetAdr: 1550,
    revenue: '$2.40M',
    revenueNum: 2.40,
    targetRev: 2.50,
    revpar: '$983.90',
    revparNum: 983.90,
    targetRevpar: 1054.00,
    status: 'Corporate Peak',
    localTime: '08:30 EDT',
    children: [
      { name: 'SOSEI VERPER', location: 'New York, USA', totalRooms: 120, occupiedRooms: 74, occ: '61.67%', adr: '$1,450', revenue: '$1.30M', revpar: '$895' },
      { name: 'SOSEI ÉLAN', location: 'Los Angeles, USA', totalRooms: 85, occupiedRooms: 59, occ: '69.41%', adr: '$1,600', revenue: '$1.10M', revpar: '$1,111' },
    ],
  },
  {
    id: 'countryside',
    name: 'SOSEI Countryside',
    location: 'Tuscany & Provence',
    totalRooms: 99,
    occupiedRooms: 75,
    occ: '75.76%',
    occNum: 75.76,
    targetOcc: 73.0,
    adr: '$1,864.67',
    adrNum: 1865,
    targetAdr: 1800,
    revenue: '$2.00M',
    revenueNum: 2.00,
    targetRev: 1.90,
    revpar: '$1,412.63',
    revparNum: 1412.63,
    targetRevpar: 1314.00,
    status: 'Leisure Stable',
    localTime: '14:30 CET',
    children: [
      { name: 'SOSEI HEARTH', location: 'Tuscany, Italy', totalRooms: 54, occupiedRooms: 43, occ: '79.63%', adr: '$1,950', revenue: '$1.10M', revpar: '$1,552' },
      { name: 'SOSEI PASTORAL', location: 'Provence, France', totalRooms: 45, occupiedRooms: 32, occ: '71.11%', adr: '$1,750', revenue: '$0.90M', revpar: '$1,244' },
    ],
  },
  {
    id: 'forest',
    name: 'SOSEI Forest',
    location: 'Kyoto & Chiang Mai',
    totalRooms: 92,
    occupiedRooms: 64,
    occ: '69.57%',
    occNum: 69.57,
    targetOcc: 70.0,
    adr: '$1,714.84',
    adrNum: 1715,
    targetAdr: 1680,
    revenue: '$1.80M',
    revenueNum: 1.80,
    targetRev: 1.75,
    revpar: '$1,192.93',
    revparNum: 1192.93,
    targetRevpar: 1176.00,
    status: 'High Demand',
    localTime: '22:30 JST',
    children: [
      { name: 'SOSEI SYLVAN', location: 'Kyoto, Japan', totalRooms: 42, occupiedRooms: 35, occ: '83.33%', adr: '$2,100', revenue: '$1.00M', revpar: '$1,750' },
      { name: 'SOSEI VERDANT', location: 'Chiang Mai, Thailand', totalRooms: 50, occupiedRooms: 29, occ: '58.00%', adr: '$1,250', revenue: '$0.80M', revpar: '$725' },
    ],
  },
  {
    id: 'desert',
    name: 'SOSEI Desert',
    location: 'Egypt & Oman',
    totalRooms: 84,
    occupiedRooms: 51,
    occ: '60.71%',
    occNum: 60.71,
    targetOcc: 62.0,
    adr: '$1,745.10',
    adrNum: 1745,
    targetAdr: 1700,
    revenue: '$1.80M',
    revenueNum: 1.80,
    targetRev: 1.70,
    revpar: '$1,059.52',
    revparNum: 1059.52,
    targetRevpar: 1054.00,
    status: 'Optimal Flow',
    localTime: '17:30 GST',
    children: [
      { name: 'SOSEI MIRAGE', location: 'Giza / Siwa, Egypt', totalRooms: 38, occupiedRooms: 21, occ: '55.26%', adr: '$1,650', revenue: '$1.00M', revpar: '$912' },
      { name: 'SOSEI SOLSTICE', location: 'Jebel Akhdar, Oman', totalRooms: 46, occupiedRooms: 30, occ: '65.22%', adr: '$1,850', revenue: '$0.80M', revpar: '$1,206' },
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
    revenueTrend: '+12% vs LY',
    roomNightsOtb: '14,820',
    roomNightsOtbNum: 14820,
    roomNightsTrend: '+11% vs LY',
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
      affectedProperties: ['SOSEI MAREA', 'SOSEI ELAN', 'SOSEI SYLVAN'],
      category: 'Demand',
      isAiAssisted: false,
      aiRecommendation: 'Consider releasing premium villa inventory with 4-night minimum stay to maximize ADR yield.',
    },
    {
      id: 'sig_2',
      title: 'Alpine outperforming plan',
      description: 'RevPAR is 9% above budget with occupancy 2 pts ahead of plan.',
      timestamp: 'Today',
      signalType: 'opportunity',
      iconType: 'up_arrow',
      impactSummary: '+9% RevPAR vs Budget (+2.0 pts Occ)',
      affectedProperties: ['SOSEI NOCTURNE', 'SOSEI AURORA'],
      category: 'Performance',
      isAiAssisted: false,
      aiRecommendation: 'Opportunity to advance ski concierge package pricing for December festive peak.',
    },
    {
      id: 'sig_3',
      title: 'Corporate demand softening',
      description: 'Corporate room nights are down 7% across three properties.',
      timestamp: 'Yesterday',
      signalType: 'risk',
      iconType: 'down_arrow',
      impactSummary: '-7% RN vs STLY in Corporate Segment',
      affectedProperties: ['SOSEI ELAN', 'SOSEI VERPER', 'SOSEI HEARTH'],
      category: 'Corporate',
      isAiAssisted: false,
      aiRecommendation: 'Activate relationship intelligence with Swiss Bank and Tokyo executive partners for midweek retreats.',
    },
    {
      id: 'sig_4',
      title: 'Increased cancellation exposure',
      description: '$1.4M of booked revenue falls within high-risk cancellation windows.',
      timestamp: 'Yesterday',
      signalType: 'neutral',
      iconType: 'dash',
      impactSummary: '$1.4M Revenue in Flexible/Non-Guaranteed Window',
      affectedProperties: ['SOSEI PELAGIA', 'SOSEI SOLSTICE', 'SOSEI MIRAGE'],
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
      id: 'alpine',
      property: 'SOSEI Alpine',
      location: 'Switzerland',
      occupancy: '76%',
      occupancyNum: 76,
      adrFormatted: '$1,420',
      adrNum: 1420,
      revparFormatted: '$1,079',
      revparNum: 1079,
      roomRevenueFormatted: '$24.0M',
      roomRevenueNum: 24.0,
      totalRevenueFormatted: '$31.2M',
      totalRevenueNum: 31.2,
      growthVsLy: '+18%',
      growthVsLyNum: 18,
      growthVsLyUp: true,
      vsBudget: '+9%',
      vsBudgetNum: 9,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=alpine',
    },
    {
      id: 'ocean',
      property: 'SOSEI Ocean',
      location: 'Indonesia',
      occupancy: '72%',
      occupancyNum: 72,
      adrFormatted: '$1,180',
      adrNum: 1180,
      revparFormatted: '$850',
      revparNum: 850,
      roomRevenueFormatted: '$21.5M',
      roomRevenueNum: 21.5,
      totalRevenueFormatted: '$28.1M',
      totalRevenueNum: 28.1,
      growthVsLy: '+14%',
      growthVsLyNum: 14,
      growthVsLyUp: true,
      vsBudget: '+6%',
      vsBudgetNum: 6,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=ocean',
    },
    {
      id: 'city',
      property: 'SOSEI City',
      location: 'Japan',
      occupancy: '81%',
      occupancyNum: 81,
      adrFormatted: '$890',
      adrNum: 890,
      revparFormatted: '$721',
      revparNum: 721,
      roomRevenueFormatted: '$18.4M',
      roomRevenueNum: 18.4,
      totalRevenueFormatted: '$24.0M',
      totalRevenueNum: 24.0,
      growthVsLy: '+8%',
      growthVsLyNum: 8,
      growthVsLyUp: true,
      vsBudget: '+4%',
      vsBudgetNum: 4,
      vsBudgetUp: true,
      status: 'on_plan',
      propertyRoute: '/dashboard/property?id=city',
    },
    {
      id: 'countryside',
      property: 'SOSEI Countryside',
      location: 'Italy & France',
      occupancy: '75%',
      occupancyNum: 75,
      adrFormatted: '$1,340',
      adrNum: 1340,
      revparFormatted: '$1,005',
      revparNum: 1005,
      roomRevenueFormatted: '$16.2M',
      roomRevenueNum: 16.2,
      totalRevenueFormatted: '$21.1M',
      totalRevenueNum: 21.1,
      growthVsLy: '+11%',
      growthVsLyNum: 11,
      growthVsLyUp: true,
      vsBudget: '+5%',
      vsBudgetNum: 5,
      vsBudgetUp: true,
      status: 'above_plan',
      propertyRoute: '/dashboard/property?id=countryside',
    },
    {
      id: 'forest',
      property: 'SOSEI Forest',
      location: 'Japan & Thailand',
      occupancy: '70%',
      occupancyNum: 70,
      adrFormatted: '$1,280',
      adrNum: 1280,
      revparFormatted: '$896',
      revparNum: 896,
      roomRevenueFormatted: '$14.8M',
      roomRevenueNum: 14.8,
      totalRevenueFormatted: '$19.2M',
      totalRevenueNum: 19.2,
      growthVsLy: '+7%',
      growthVsLyNum: 7,
      growthVsLyUp: true,
      vsBudget: '+2%',
      vsBudgetNum: 2,
      vsBudgetUp: true,
      status: 'on_plan',
      propertyRoute: '/dashboard/property?id=forest',
    },
    {
      id: 'desert',
      property: 'SOSEI Desert',
      location: 'UAE',
      occupancy: '61%',
      occupancyNum: 61,
      adrFormatted: '$1,250',
      adrNum: 1250,
      revparFormatted: '$763',
      revparNum: 763,
      roomRevenueFormatted: '$12.1M',
      roomRevenueNum: 12.1,
      totalRevenueFormatted: '$16.8M',
      totalRevenueNum: 16.8,
      growthVsLy: '-3%',
      growthVsLyNum: -3,
      growthVsLyUp: false,
      vsBudget: '-6%',
      vsBudgetNum: -6,
      vsBudgetUp: false,
      status: 'attention',
      propertyRoute: '/dashboard/property?id=desert',
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
      id: 'europe',
      market: 'Europe',
      roomNightsPct: 31,
      roomNightsFormatted: '31%',
      adrUsd: 1380,
      adrFormatted: '$1,380',
      revenueUsdMillions: 41,
      revenueFormatted: '$41M',
      vsLyPct: 12,
      vsLyFormatted: '↑ +12%',
      isPositive: true,
      feederCountries: ['United Kingdom', 'Switzerland', 'Germany', 'France'],
      keyHubs: 'London (LHR), Zurich (ZRH), Frankfurt (FRA), Paris (CDG)',
    },
    {
      id: 'apac',
      market: 'APAC',
      roomNightsPct: 35,
      roomNightsFormatted: '35%',
      adrUsd: 1090,
      adrFormatted: '$1,090',
      revenueUsdMillions: 38,
      revenueFormatted: '$38M',
      vsLyPct: 18,
      vsLyFormatted: '↑ +18%',
      isPositive: true,
      feederCountries: ['Japan', 'Singapore', 'Australia', 'Hong Kong'],
      keyHubs: 'Tokyo (HND/NRT), Singapore (SIN), Sydney (SYD)',
    },
    {
      id: 'americas',
      market: 'Americas',
      roomNightsPct: 24,
      roomNightsFormatted: '24%',
      adrUsd: 1240,
      adrFormatted: '$1,240',
      revenueUsdMillions: 28,
      revenueFormatted: '$28M',
      vsLyPct: 8,
      vsLyFormatted: '↑ +8%',
      isPositive: true,
      feederCountries: ['United States', 'Canada', 'Brazil'],
      keyHubs: 'New York (JFK), Los Angeles (LAX), Miami (MIA)',
    },
    {
      id: 'middle-east',
      market: 'Middle East',
      roomNightsPct: 10,
      roomNightsFormatted: '10%',
      adrUsd: 1520,
      adrFormatted: '$1,520',
      revenueUsdMillions: 11,
      revenueFormatted: '$11M',
      vsLyPct: 6,
      vsLyFormatted: '↑ +6%',
      isPositive: true,
      feederCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar'],
      keyHubs: 'Dubai (DXB), Riyadh (RUH), Doha (DOH)',
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
  totalRevenue: '$127M',
  items: [
    {
      id: 'leisure',
      segment: 'Leisure',
      roomNightsPct: 45,
      roomNightsFormatted: '45%',
      adrUsd: 1120,
      adrFormatted: '$1,120',
      revenueUsdMillions: 52,
      revenueFormatted: '$52M',
      vsLyPct: 14,
      vsLyFormatted: '↑ +14%',
      isPositive: true,
      description: 'High net-worth leisure travelers, couples & holidaymakers',
      avgLeadTimeDays: 52,
      cancellationRisk: 'Low',
    },
    {
      id: 'corporate',
      segment: 'Corporate',
      roomNightsPct: 22,
      roomNightsFormatted: '22%',
      adrUsd: 1340,
      adrFormatted: '$1,340',
      revenueUsdMillions: 31,
      revenueFormatted: '$31M',
      vsLyPct: -7,
      vsLyFormatted: '↓ -7%',
      isPositive: false,
      description: 'C-suite executives, partner firms & business retreats',
      avgLeadTimeDays: 21,
      cancellationRisk: 'High',
    },
    {
      id: 'group-mice',
      segment: 'Group / MICE',
      roomNightsPct: 14,
      roomNightsFormatted: '14%',
      adrUsd: 1580,
      adrFormatted: '$1,580',
      revenueUsdMillions: 19,
      revenueFormatted: '$19M',
      vsLyPct: 9,
      vsLyFormatted: '↑ +9%',
      isPositive: true,
      description: 'Executive leadership forums, board meetings & private celebrations',
      avgLeadTimeDays: 85,
      cancellationRisk: 'Medium',
    },
    {
      id: 'wellness',
      segment: 'Wellness',
      roomNightsPct: 9,
      roomNightsFormatted: '9%',
      adrUsd: 1760,
      adrFormatted: '$1,760',
      revenueUsdMillions: 14,
      revenueFormatted: '$14M',
      vsLyPct: 19,
      vsLyFormatted: '↑ +19%',
      isPositive: true,
      description: 'Sanctuary immersion, longevity & medical wellness packages',
      avgLeadTimeDays: 64,
      cancellationRisk: 'Low',
    },
    {
      id: 'social-other',
      segment: 'Social / Other',
      roomNightsPct: 10,
      roomNightsFormatted: '10%',
      adrUsd: 980,
      adrFormatted: '$980',
      revenueUsdMillions: 11,
      revenueFormatted: '$11M',
      vsLyPct: 5,
      vsLyFormatted: '↑ +5%',
      isPositive: true,
      description: 'Exclusive private events, weddings & affiliated stays',
      avgLeadTimeDays: 42,
      cancellationRisk: 'Low',
    },
  ],
};






