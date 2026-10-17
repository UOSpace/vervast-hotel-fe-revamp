// Restaurant Architectural Images (Generated per SOSEI Property)
import baliWantilanImg from '@/assets/fnb/restaurants/bali_wantilan.jpg';
import baliKarangImg from '@/assets/fnb/restaurants/bali_karang.jpg';
import tokyoShinjuImg from '@/assets/fnb/restaurants/tokyo_shinju.jpg';
import tokyoSumibiImg from '@/assets/fnb/restaurants/tokyo_sumibi.jpg';
import japanArashiyamaImg from '@/assets/fnb/restaurants/japan_arashiyama.jpg';
import japanSaryoImg from '@/assets/fnb/restaurants/japan_saryo.jpg';
import barcelonaCasamiroImg from '@/assets/fnb/restaurants/barcelona_casamiro.jpg';
import barcelonaBodegaImg from '@/assets/fnb/restaurants/barcelona_bodega.jpg';
import switzerlandStubeImg from '@/assets/fnb/restaurants/switzerland_stube.jpg';
import switzerlandFirnImg from '@/assets/fnb/restaurants/switzerland_firn.jpg';
import canadaCedarImg from '@/assets/fnb/restaurants/canada_cedar.jpg';
import canadaBlackcombImg from '@/assets/fnb/restaurants/canada_blackcomb.jpg';
import costaricaSelvaImg from '@/assets/fnb/restaurants/costarica_selva.jpg';
import costaricaNicoyaImg from '@/assets/fnb/restaurants/costarica_nicoya.jpg';
import omanAlhajarImg from '@/assets/fnb/restaurants/oman_alhajar.jpg';
import omanWadidamaskImg from '@/assets/fnb/restaurants/oman_wadidamask.jpg';
import egyptAmunImg from '@/assets/fnb/restaurants/egypt_amun.jpg';
import egyptPalmeraieImg from '@/assets/fnb/restaurants/egypt_palmeraie.jpg';

// Regional Dish Images
import dishBaliBetutuImg from '@/assets/fnb/restaurants/dish_bali_betutu.jpg';
import dishBaliSatelilitImg from '@/assets/fnb/restaurants/dish_bali_satelilit.jpg';
import dishTokyoNigiriImg from '@/assets/fnb/restaurants/dish_tokyo_nigiri.jpg';
import dishBarcelonaPaellaImg from '@/assets/fnb/restaurants/dish_barcelona_paella.jpg';
import dishOmanShuwaImg from '@/assets/fnb/restaurants/dish_oman_shuwa.jpg';

import caviarImg from '@/assets/fnb/fnb_caviar.jpg';
import scallopCrudoImg from '@/assets/fnb/fnb_scallop_crudo.jpg';
import mushroomTartletImg from '@/assets/fnb/fnb_mushroom_tartlet.jpg';
import softShellCrabImg from '@/assets/fnb/fnb_soft_shell_crab.jpg';
import wagyuStriploinImg from '@/assets/fnb/fnb_wagyu_striploin.jpg';
import lobsterThermidorImg from '@/assets/fnb/fnb_lobster_thermidor.jpg';
import toothfishImg from '@/assets/fnb/fnb_toothfish.jpg';
import cauliflowerSteakImg from '@/assets/fnb/fnb_cauliflower_steak.jpg';
import taglioliniTruffleImg from '@/assets/fnb/fnb_tagliolini_truffle.jpg';
import crabRavioloniImg from '@/assets/fnb/fnb_crab_ravioloni.jpg';
import herbGnocchiImg from '@/assets/fnb/fnb_herb_gnocchi.jpg';
import zenGardenBowlImg from '@/assets/fnb/fnb_zen_garden_bowl.jpg';
import salmonBurrataImg from '@/assets/fnb/fnb_salmon_burrata.jpg';
import chocolateSouffleImg from '@/assets/fnb/fnb_chocolate_souffle.jpg';
import matchaMillefeuilleImg from '@/assets/fnb/fnb_matcha_millefeuille.jpg';
import sorbetTrioImg from '@/assets/fnb/fnb_sorbet_trio.jpg';
import goldenHighballImg from '@/assets/fnb/fnb_golden_highball.jpg';
import botanicalElixirImg from '@/assets/fnb/fnb_botanical_elixir.jpg';
import icedMatchaLatteImg from '@/assets/fnb/fnb_iced_matcha_latte.jpg';

export interface SoseiRestaurant {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
  collectionName: string;
  name: string;
  concept: string;
  cuisineTag: string;
  hours: string;
  seating: string;
  tables: string[];
  image: string;
}

export interface FnbGuest {
  id: string;
  name: string;
  room: string;
  propertyId: string;
  property: string;
  vipTier: string;
  allergies: string[];
  dietaryRestrictions: string[];
  partySize: number;
  folioNumber: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
}

export interface FnbMenuItem {
  id: string;
  propertyId: string; // Regionally bound to the SOSEI property
  restaurantIds?: string[]; // Optional specific restaurant binding within the property
  name: string;
  category: 'starters' | 'mains' | 'specialties' | 'desserts' | 'beverages';
  categoryLabel: string;
  price: number;
  image: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  isChefSignature?: boolean;
  dietaryBadges: string[];
  ingredients: string[];
  allergens: string[];
}

/**
 * SOSEI RESTAURANTS GROUPED BY SOSEI PROPERTY LIST
 */
export const SOSEI_RESTAURANTS: SoseiRestaurant[] = [
  // 1. SOSEI Andermatt (Andermatt, Switzerland)
  {
    id: 'rest-andermatt-stube',
    propertyId: 'sosei-andermatt',
    propertyName: 'SOSEI Andermatt',
    propertyLocation: 'Andermatt, Switzerland',
    collectionName: 'SOSEI Ski',
    name: 'Gotthard Stube',
    concept: 'Swiss Alpine Hearth, Aged Gruyère Fondue & Wild Game',
    cuisineTag: 'Swiss Alpine Hearth',
    hours: '12:00 – 22:30',
    seating: '46 Covers · Larch Dining Room',
    tables: ['Fireplace Table 01', 'Gotthard Glass 04', 'Alpine Chalet Booth 02', 'Chalet Delivery'],
    image: switzerlandStubeImg,
  },
  {
    id: 'rest-andermatt-firn',
    propertyId: 'sosei-andermatt',
    propertyName: 'SOSEI Andermatt',
    propertyLocation: 'Andermatt, Switzerland',
    collectionName: 'SOSEI Ski',
    name: 'Firn Glacier Terrace',
    concept: 'High-Altitude Alpine Bistro, Foraged Morels & Swiss Cellar',
    cuisineTag: 'High-Altitude Bistro',
    hours: '07:30 – 21:00',
    seating: '38 Covers · Glacier Terrace',
    tables: ['Glacier Sun Deck 02', 'Firepit Table 05', 'Alpine Lounge 01', 'Chalet Delivery'],
    image: switzerlandFirnImg,
  },

  // 2. SOSEI El Gouna (El Gouna, Egypt)
  {
    id: 'rest-elgouna-amun',
    propertyId: 'sosei-el-gouna',
    propertyName: 'SOSEI El Gouna',
    propertyLocation: 'El Gouna, Egypt',
    collectionName: 'SOSEI Beach Resort',
    name: 'Marassi Red Sea Pavilion',
    concept: 'Red Sea Coastal Grill, Clay-Oven Seafood & Lagoon Olive Oil',
    cuisineTag: 'Red Sea Coastal',
    hours: '07:30 – 22:30',
    seating: '40 Covers · Lagoon Terrace',
    tables: ['Lagoon Ledge 01', 'Coral Alcove 03', 'Dune Horizon 02', 'Villa Delivery'],
    image: egyptAmunImg,
  },
  {
    id: 'rest-elgouna-palmeraie',
    propertyId: 'sosei-el-gouna',
    propertyName: 'SOSEI El Gouna',
    propertyLocation: 'El Gouna, Egypt',
    collectionName: 'SOSEI Beach Resort',
    name: 'Palmeraie Marina Majlis',
    concept: 'Date-Palm Grove Tagines, Roasted Freekeh & Karkadeh Bar',
    cuisineTag: 'Egyptian Coastal',
    hours: '11:00 – 22:00',
    seating: '32 Covers · Palm Colonnade',
    tables: ['Palm Grove Table 02', 'Olive Shade 04', 'Marina Courtyard 01', 'Villa Delivery'],
    image: egyptPalmeraieImg,
  },

  // 3. SOSEI AUH (Abu Dhabi, UAE)
  {
    id: 'rest-auh-alhajar',
    propertyId: 'sosei-auh',
    propertyName: 'SOSEI AUH',
    propertyLocation: 'Abu Dhabi, UAE',
    collectionName: 'SOSEI Beach Resort',
    name: 'Al-Bahr Saadiyat',
    concept: 'Royal Emirati & Levantine Coastal Cuisine, Saffron & Gulf Catch',
    cuisineTag: 'Arabian Gulf Gastronomy',
    hours: '07:00 – 22:30',
    seating: '48 Covers · Beachfront Edge',
    tables: ['Gulf Rim 01', 'Reflecting Pool 04', 'Royal Majlis Alcove', 'Villa Delivery'],
    image: omanAlhajarImg,
  },
  {
    id: 'rest-auh-wadidamask',
    propertyId: 'sosei-auh',
    propertyName: 'SOSEI AUH',
    propertyLocation: 'Abu Dhabi, UAE',
    collectionName: 'SOSEI Beach Resort',
    name: 'Saadiyat Pearl Lounge',
    concept: 'Warm Levantine Mezze, Frankincense Infusions & Damask Rose Tea',
    cuisineTag: 'Levantine Mezze & Botanicals',
    hours: '11:00 – 23:00',
    seating: '34 Covers · Dune Terrace',
    tables: ['Dune Terrace 02', 'Limestone Arch 05', 'Stargazing Deck 01', 'Villa Delivery'],
    image: omanWadidamaskImg,
  },

  // 4. SOSEI Melides (Melides, Portugal)
  {
    id: 'rest-melides-cedar',
    propertyId: 'sosei-melides',
    propertyName: 'SOSEI Melides',
    propertyLocation: 'Melides, Portugal',
    collectionName: 'SOSEI Beach Resort',
    name: 'Pinhal & Mar',
    concept: 'Alentejo Cork-Wood Fired Atlantic Fish, Black Pork & Foraged Herbs',
    cuisineTag: 'Alentejo Coastal',
    hours: '07:00 – 22:30',
    seating: '50 Covers · Pine & Dune Hall',
    tables: ['Timber Hall 03', 'Lagoon Window 06', 'Chef Hearth Table', 'Estate Delivery'],
    image: canadaCedarImg,
  },
  {
    id: 'rest-melides-blackcomb',
    propertyId: 'sosei-melides',
    propertyName: 'SOSEI Melides',
    propertyLocation: 'Melides, Portugal',
    collectionName: 'SOSEI Beach Resort',
    name: 'Praia Crudo & Cellar',
    concept: 'Atlantic Raw Bar, Setúbal Oysters & Douro Vintage Cellar',
    cuisineTag: 'Atlantic Raw Bar & Grill',
    hours: '15:00 – 23:30',
    seating: '32 Covers · Dune Fireside',
    tables: ['Slate Raw Bar 02', 'Fireside Lounge 04', 'Cork Alcove 01', 'Estate Delivery'],
    image: canadaBlackcombImg,
  },

  // 5. SOSEI Umbria (Umbria, Italy)
  {
    id: 'rest-umbria-arashiyama',
    propertyId: 'sosei-umbria',
    propertyName: 'SOSEI Umbria',
    propertyLocation: 'Umbria, Italy',
    collectionName: 'SOSEI Beach Resort',
    name: 'Il Tartufo Castello',
    concept: 'Norcia White Truffle Tasting Table & Umbrian Estate Harvest',
    cuisineTag: 'Umbrian Haute Gastronomy',
    hours: '07:30 – 21:30',
    seating: '28 Covers · Stone Loggia',
    tables: ['Vineyard Loggia 01', 'Castello Courtyard 03', 'Olive Grove Room', 'Villa Delivery'],
    image: japanArashiyamaImg,
  },
  {
    id: 'rest-umbria-saryo',
    propertyId: 'sosei-umbria',
    propertyName: 'SOSEI Umbria',
    propertyLocation: 'Umbria, Italy',
    collectionName: 'SOSEI Beach Resort',
    name: 'Cantina Sagrantino',
    concept: 'Montefalco Sagrantino Vintage Cellar, Artisanal Salumi & Olive Press',
    cuisineTag: 'Umbrian Cellar & Craft',
    hours: '09:00 – 19:00',
    seating: '24 Covers · Stone Cellar',
    tables: ['Cellar Stone Table 02', 'Vault Alcove 04', 'Garden Veranda 01', 'Villa Delivery'],
    image: japanSaryoImg,
  },

  // 6. SOSEI Tinos (Tinos, Greece)
  {
    id: 'rest-tinos-shinju',
    propertyId: 'sosei-tinos',
    propertyName: 'SOSEI Tinos',
    propertyLocation: 'Tinos, Greece',
    collectionName: 'SOSEI Beach Resort',
    name: 'Thalassa Aegean Counter',
    concept: 'Aegean Line-Caught Crudo & Cycladic Seafood Omakase Counter',
    cuisineTag: 'Aegean Crudo & Seafood',
    hours: '17:30 – 23:00',
    seating: '16 Seats · Marble Counter',
    tables: ['Marble Counter Seat 1–2', 'Marble Counter Seat 5–6', 'Private Aegean Terrace', 'Villa Delivery'],
    image: tokyoShinjuImg,
  },
  {
    id: 'rest-tinos-sumibi',
    propertyId: 'sosei-tinos',
    propertyName: 'SOSEI Tinos',
    propertyLocation: 'Tinos, Greece',
    collectionName: 'SOSEI Beach Resort',
    name: 'Pyrgos Woodfire Terrace',
    concept: 'Olive-Wood Charcoal Aegean Lobster, Cycladic Lamb & Wild Oregano',
    cuisineTag: 'Cycladic Hearth & Grill',
    hours: '12:00 – 23:30',
    seating: '40 Covers · Aegean Cliff Hearth',
    tables: ['Hearth Counter 03', 'Aegean Horizon 08', 'Private Sanctuary Suite', 'Villa Delivery'],
    image: tokyoSumibiImg,
  },

  // 7. SOSEI Barcelona (Barcelona, Spain)
  {
    id: 'rest-barcelona-casamiro',
    propertyId: 'sosei-barcelona',
    propertyName: 'SOSEI Barcelona',
    propertyLocation: 'Barcelona, Spain',
    collectionName: 'SOSEI Urban',
    name: 'Casa Miró',
    concept: 'Modernist Catalan Tasting Table & Wood-Fired Seafood Arroz',
    cuisineTag: 'Catalan Gastronomy',
    hours: '13:00 – 23:30',
    seating: '52 Covers · Vaulted Courtyard',
    tables: ['Courtyard Arch 04', 'Olive Terrace 07', 'Salon Gaudí Private', 'Suite Delivery'],
    image: barcelonaCasamiroImg,
  },
  {
    id: 'rest-barcelona-bodega',
    propertyId: 'sosei-barcelona',
    propertyName: 'SOSEI Barcelona',
    propertyLocation: 'Barcelona, Spain',
    collectionName: 'SOSEI Urban',
    name: 'Bodega Gràcia',
    concept: 'Artisanal Iberian Bellota Tapas & Biodynamic Priorat Cellar',
    cuisineTag: 'Iberian Tapas & Cellar',
    hours: '16:00 – 01:00',
    seating: '34 Covers · Stone Cellar',
    tables: ['Cellar Oak Table 02', 'Bar Counter 05', 'Vault Alcove 01', 'Suite Delivery'],
    image: barcelonaBodegaImg,
  },

  // 8. SOSEI OSA (Osa, Costa Rica)
  {
    id: 'rest-osa-selva',
    propertyId: 'sosei-osa',
    propertyName: 'SOSEI OSA',
    propertyLocation: 'Osa, Costa Rica',
    collectionName: 'SOSEI Nature',
    name: 'Selva Corcovado',
    concept: 'Rainforest Canopy Cevichería & Wood-Fired Golfo Dulce Catch',
    cuisineTag: 'Pacific Ceviche & Grill',
    hours: '11:30 – 22:30',
    seating: '44 Covers · Canopy Deck',
    tables: ['Canopy Treehouse 01', 'Pacific Breeze 04', 'Jungle Ledge 02', 'Villa Delivery'],
    image: costaricaSelvaImg,
  },
  {
    id: 'rest-osa-nicoya',
    propertyId: 'sosei-osa',
    propertyName: 'SOSEI OSA',
    propertyLocation: 'Osa, Costa Rica',
    collectionName: 'SOSEI Nature',
    name: 'Osa Botanical Kitchen',
    concept: 'Rainforest Ancestral Harvest, Organic Bowls & Single-Origin Cacao',
    cuisineTag: 'Rainforest Botanical',
    hours: '07:00 – 21:00',
    seating: '36 Covers · Botanical Terrace',
    tables: ['Botanical Garden 02', 'Volcanic Stone 05', 'Morning Sun Deck 01', 'Villa Delivery'],
    image: costaricaNicoyaImg,
  },

  // 9. SOSEI BALI (Bali, Indonesia)
  {
    id: 'rest-bali-wantilan',
    propertyId: 'sosei-bali',
    propertyName: 'SOSEI BALI',
    propertyLocation: 'Bali, Indonesia',
    collectionName: 'SOSEI Wellness',
    name: 'Wantilan Agung',
    concept: 'Royal Balinese Heritage Cuisine & Sacred Spice Longevity Kitchen',
    cuisineTag: 'Balinese Heritage',
    hours: '07:00 – 22:30',
    seating: '48 Covers · Cliff Pavilion',
    tables: ['Pendopo Table 01', 'Pendopo Table 04', 'Cliff Edge Bale 02', 'In-Villa Delivery'],
    image: baliWantilanImg,
  },
  {
    id: 'rest-bali-karang',
    propertyId: 'sosei-bali',
    propertyName: 'SOSEI BALI',
    propertyLocation: 'Bali, Indonesia',
    collectionName: 'SOSEI Wellness',
    name: 'Karang Jimbaran Grill',
    concept: 'Coconut-Husk Wood-Fired Indian Ocean Catch & Sambal Bar',
    cuisineTag: 'Nusantara Coastal Grill',
    hours: '12:00 – 23:00',
    seating: '36 Covers · Limestone Terrace',
    tables: ['Limestone Terrace 02', 'Ocean Ledge 05', 'Sunset Alcove 01', 'In-Villa Delivery'],
    image: baliKarangImg,
  },
];

/**
 * IN-HOUSE GUESTS SYNCHRONIZED WITH PMS ACROSS ALL 9 SOSEI PROPERTIES
 */
export const IN_HOUSE_FNB_GUESTS: FnbGuest[] = [
  // SOSEI BALI
  {
    id: 'gst-bali-01',
    name: 'Maya Wulandari',
    room: 'Cliffside Sanctuary Villa 12',
    propertyId: 'sosei-bali',
    property: 'SOSEI BALI',
    vipTier: 'Property Patron',
    allergies: ['Peanuts', 'Shellfish'],
    dietaryRestrictions: ['No Pork'],
    partySize: 2,
    folioNumber: 'FOL-BLI-112',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Prefers sambal matah on the side. Allergic to peanuts and prawn/shellfish paste (terasi).',
  },
  {
    id: 'gst-bali-02',
    name: 'Alexander & Claire Wright',
    room: 'Ocean Pool Villa 04',
    propertyId: 'sosei-bali',
    property: 'SOSEI BALI',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Celiac Friendly'],
    partySize: 2,
    folioNumber: 'FOL-BLI-104',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Celiac sensitivity. Use sweet soy (kecap) only if certified gluten-free.',
  },
  {
    id: 'gst-bali-03',
    name: 'Raden Baskoro',
    room: 'Uluwatu Residence 01',
    propertyId: 'sosei-bali',
    property: 'SOSEI BALI',
    vipTier: 'Founding Circle',
    allergies: [],
    dietaryRestrictions: ['None'],
    partySize: 4,
    folioNumber: 'FOL-BLI-101',
    checkIn: 'Oct 13, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Enjoys authentic Balinese spicy preparations and heritage jamu.',
  },

  // SOSEI TINOS
  {
    id: 'gst-tinos-01',
    name: 'Julian Vance',
    room: 'Aegean Cliffside Villa 310',
    propertyId: 'sosei-tinos',
    property: 'SOSEI Tinos',
    vipTier: 'Platinum VIP',
    allergies: ['Shellfish', 'Crustaceans'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-TNS-310',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Shellfish allergy. Finfish (tuna, sea bream, wagyu) is safe.',
  },
  {
    id: 'gst-tinos-02',
    name: 'Haruka Sato',
    room: 'Marble Terrace Suite 502',
    propertyId: 'sosei-tinos',
    property: 'SOSEI Tinos',
    vipTier: 'Diamond Patron',
    allergies: ['Dairy', 'Eggs'],
    dietaryRestrictions: ['Low Dairy'],
    partySize: 1,
    folioNumber: 'FOL-TNS-502',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid butter and egg yolk emulsions.',
  },

  // SOSEI UMBRIA
  {
    id: 'gst-umbria-01',
    name: 'Kenzo Tanaka',
    room: 'Castello Vineyard Suite 08',
    propertyId: 'sosei-umbria',
    property: 'SOSEI Umbria',
    vipTier: 'Founding Circle',
    allergies: ['Dairy', 'Tree Nuts'],
    dietaryRestrictions: ['Organic Only'],
    partySize: 2,
    folioNumber: 'FOL-UMB-008',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Lactose intolerance and walnut/almond sensitivity.',
  },
  {
    id: 'gst-umbria-02',
    name: 'Lady Eleanor Vance',
    room: 'Olive Grove Villa 03',
    propertyId: 'sosei-umbria',
    property: 'SOSEI Umbria',
    vipTier: 'Platinum VIP',
    allergies: ['Soy', 'Sesame'],
    dietaryRestrictions: ['Vegetarian'],
    partySize: 2,
    folioNumber: 'FOL-UMB-003',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers pure vegetable broths and estate olive oil preparations.',
  },

  // SOSEI BARCELONA
  {
    id: 'gst-bcn-01',
    name: 'Dr. Elizabeth Hall',
    room: 'Paseo Grand Suite 402',
    propertyId: 'sosei-barcelona',
    property: 'SOSEI Barcelona',
    vipTier: 'Gold VIP',
    allergies: ['Shellfish', 'Tree Nuts'],
    dietaryRestrictions: ['Mediterranean'],
    partySize: 2,
    folioNumber: 'FOL-BCN-402',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to crustaceans and hazelnuts/pine nuts in romesco sauce.',
  },
  {
    id: 'gst-bcn-02',
    name: 'Carlos & Sofia Mendoza',
    room: 'Modernist Terrace 205',
    propertyId: 'sosei-barcelona',
    property: 'SOSEI Barcelona',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Gluten-Free'],
    partySize: 2,
    folioNumber: 'FOL-BCN-205',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Requires gluten-free bread for pan con tomate.',
  },

  // SOSEI AUH
  {
    id: 'gst-auh-01',
    name: 'Martin Fuentes',
    room: 'Saadiyat Beachfront Villa 108',
    propertyId: 'sosei-auh',
    property: 'SOSEI AUH',
    vipTier: 'Founding Circle',
    allergies: ['Shellfish', 'Peanuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-AUH-108',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Enjoys reef finfish (tuna, snapper) but allergic to lobster/crab and peanuts.',
  },
  {
    id: 'gst-auh-02',
    name: 'David Rothschild',
    room: 'Arabian Gulf Pool Suite 09',
    propertyId: 'sosei-auh',
    property: 'SOSEI AUH',
    vipTier: 'Platinum VIP',
    allergies: ['Tree Nuts', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-AUH-009',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to walnuts, pistachios, pine nuts, and sesame tahini.',
  },

  // SOSEI ANDERMATT
  {
    id: 'gst-and-01',
    name: 'Sal Zanjabila',
    room: 'Gotthard Penthouse 401',
    propertyId: 'sosei-andermatt',
    property: 'SOSEI Andermatt',
    vipTier: 'Platinum VIP',
    allergies: ['Peanuts', 'Tree Nuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-AND-401',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Glacier view table preferred. Allergic to hazelnuts, walnuts, and peanuts.',
  },
  {
    id: 'gst-and-02',
    name: 'Baron Lukas von Berg',
    room: 'Glacier Chalet 201',
    propertyId: 'sosei-andermatt',
    property: 'SOSEI Andermatt',
    vipTier: 'Founding Circle',
    allergies: ['Gluten'],
    dietaryRestrictions: ['None'],
    partySize: 3,
    folioNumber: 'FOL-AND-201',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Serve fondue with steamed alpine potatoes instead of wheat bread.',
  },

  // SOSEI MELIDES
  {
    id: 'gst-mel-01',
    name: 'Henrik Lindqvist',
    room: 'Alentejo Dune Estate 104',
    propertyId: 'sosei-melides',
    property: 'SOSEI Melides',
    vipTier: 'Property Elite',
    allergies: ['Shellfish', 'Tree Nuts'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-MEL-104',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to crab/oysters and pecans.',
  },
  {
    id: 'gst-mel-02',
    name: 'Camille Laurent',
    room: 'Lagoon Terrace Suite 302',
    propertyId: 'sosei-melides',
    property: 'SOSEI Melides',
    vipTier: 'Platinum VIP',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Dairy-Free'],
    partySize: 2,
    folioNumber: 'FOL-MEL-302',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Dairy-free wood-fired preparations requested.',
  },

  // SOSEI OSA
  {
    id: 'gst-osa-01',
    name: 'Lord Sterling',
    room: 'Corcovado Canopy Villa 14',
    propertyId: 'sosei-osa',
    property: 'SOSEI OSA',
    vipTier: 'Founding Circle',
    allergies: ['Tree Nuts', 'Eggs'],
    dietaryRestrictions: ['Low Sodium'],
    partySize: 2,
    folioNumber: 'FOL-OSA-014',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to cashews and egg whites.',
  },
  {
    id: 'gst-osa-02',
    name: 'Elena Rostova',
    room: 'Golfo Dulce Cliff Villa 07',
    propertyId: 'sosei-osa',
    property: 'SOSEI OSA',
    vipTier: 'VVIP Tier 1',
    allergies: ['Gluten', 'Shellfish'],
    dietaryRestrictions: ['Clean Organic'],
    partySize: 1,
    folioNumber: 'FOL-OSA-007',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Prefers finfish ceviche and rainforest longevity bowls.',
  },

  // SOSEI EL GOUNA
  {
    id: 'gst-elg-01',
    name: 'Sheikh Tariq Al-Mansoor',
    room: 'Red Sea Lagoon Royal Villa 01',
    propertyId: 'sosei-el-gouna',
    property: 'SOSEI El Gouna',
    vipTier: 'Royal Patron',
    allergies: ['Shellfish', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-ELG-001',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid sesame tahini and crustaceans. Enjoys clay-oven coastal duck.',
  },
  {
    id: 'gst-elg-02',
    name: 'Sophia Lorenzi',
    room: 'Coral Reef Pavilion 05',
    propertyId: 'sosei-el-gouna',
    property: 'SOSEI El Gouna',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten', 'Tree Nuts'],
    dietaryRestrictions: ['Mediterranean'],
    partySize: 2,
    folioNumber: 'FOL-ELG-005',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Gluten sensitivity (avoid wheat freekeh and flatbread).',
  },
];

/**
 * REGIONALLY AUTHENTIC MENUS PER SOSEI PROPERTY
 */
export const FNB_MENU_ITEMS: FnbMenuItem[] = [
  // ============================================================================
  // 1. SOSEI BALI — Authentic Balinese & Nusantara Coastal Cuisine (NO SUSHI!)
  // ============================================================================
  {
    id: 'bali-01',
    propertyId: 'sosei-bali',
    name: 'Sate Lilit Ikan Karang & Sambal Matah',
    category: 'starters',
    categoryLabel: 'Pembuka (Starters)',
    price: 38,
    image: dishBaliSatelilitImg,
    description: 'Minced Uluwatu reef snapper blended with grated young coconut and Balinese base genep, grilled on lemongrass stalks.',
    prepTimeMinutes: 14,
    calories: 290,
    isChefSignature: true,
    dietaryBadges: ['Balinese Heritage', 'Gluten-Free'],
    ingredients: ['Reef Snapper', 'Young Coconut', 'Lemongrass', 'Shallots', 'Kaffir Lime', 'Torch Ginger', 'Coconut Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'bali-02',
    propertyId: 'sosei-bali',
    name: 'Kepiting Soka Sambal Kacang Tanah (Soft-Shell Crab)',
    category: 'starters',
    categoryLabel: 'Pembuka (Starters)',
    price: 44,
    image: softShellCrabImg,
    description: 'Crisp mangrove soft-shell crab served over roasted Tuban peanut sambal, young mango lawar, and kaffir lime leaf oil.',
    prepTimeMinutes: 15,
    calories: 380,
    dietaryBadges: ['Nusantara Coastal'],
    ingredients: ['Mangrove Soft-Shell Crab', 'Roasted Tuban Peanuts', 'Green Mango', 'Kaffir Lime', 'Coconut Milk', 'Palm Sugar'],
    allergens: ['Shellfish', 'Crustaceans', 'Peanuts'],
  },
  {
    id: 'bali-03',
    propertyId: 'sosei-bali',
    name: 'Bebek Betutu Asap Daun Pinang (Smoke-Roasted Duck)',
    category: 'mains',
    categoryLabel: 'Hidangan Utama (Mains)',
    price: 68,
    image: dishBaliBetutuImg,
    description: '12-hour slow-smoked Balinese heritage duck in betutu spice paste, wrapped in areca bark with cassava leaves and red rice.',
    prepTimeMinutes: 22,
    calories: 610,
    isChefSignature: true,
    dietaryBadges: ['Royal Balinese', 'Dairy-Free'],
    ingredients: ['Heritage Duck Breast & Confit', 'Bumbu Betutu Spices', 'Cassava Leaves', 'Jatiluwih Red Rice', 'Candlenut (Tree Nuts)', 'Shallot Sambal'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'bali-04',
    propertyId: 'sosei-bali',
    name: 'Udang Karang Bakar Jimbaran (Wood-Fired Lobster)',
    category: 'mains',
    categoryLabel: 'Hidangan Utama (Mains)',
    price: 115,
    image: lobsterThermidorImg,
    description: 'Whole Indian Ocean spiny lobster grilled over coconut husks, glazed with caramelized Balinese honey, garlic, and fermented shrimp terasi.',
    prepTimeMinutes: 24,
    calories: 520,
    isChefSignature: true,
    dietaryBadges: ['Jimbaran Grill'],
    ingredients: ['Indian Ocean Spiny Lobster', 'Fermented Shrimp Paste (Terasi)', 'Wild Forest Honey', 'Red Chili', 'Kalamansi Lime', 'Kemangi Basil'],
    allergens: ['Shellfish', 'Crustaceans'],
  },
  {
    id: 'bali-05',
    propertyId: 'sosei-bali',
    name: 'Iga Sapi Bakar Kintamani (Chargrilled Short Rib)',
    category: 'mains',
    categoryLabel: 'Hidangan Utama (Mains)',
    price: 84,
    image: wagyuStriploinImg,
    description: 'Slow-braised beef short rib glazed with artisanal palm sugar kecap manis, coriander seed, and charred Tabanan heirloom baby corn.',
    prepTimeMinutes: 20,
    calories: 640,
    dietaryBadges: ['House Special'],
    ingredients: ['Prime Beef Short Rib', 'Sweet Soy Kecap Manis (Soy, Wheat)', 'Coriander', 'Galangal', 'Tamarind', 'Heirloom Corn'],
    allergens: ['Soy', 'Gluten'],
  },
  {
    id: 'bali-06',
    propertyId: 'sosei-bali',
    name: 'Sorbet Jeruk Kintamani & Mangga Harumanis',
    category: 'desserts',
    categoryLabel: 'Manisan (Desserts)',
    price: 22,
    image: sorbetTrioImg,
    description: 'Refreshing trio of Highland Kintamani tangerine, Harumanis mango, and Bedugul wild berry sorbet with pandan syrup.',
    prepTimeMinutes: 8,
    calories: 140,
    dietaryBadges: ['Vegan', 'Allergen-Free'],
    ingredients: ['Kintamani Tangerine', 'Harumanis Mango', 'Bedugul Berries', 'Pandan Leaf', 'Cane Sugar'],
    allergens: [],
  },
  {
    id: 'bali-07',
    propertyId: 'sosei-bali',
    name: 'Jamu Kunyit Asam & Botanical Tonic',
    category: 'beverages',
    categoryLabel: 'Jamu & Minuman (Elixirs)',
    price: 20,
    image: botanicalElixirImg,
    description: 'Cold-pressed organic Ubud turmeric, java tamarind, ginger blossom, and sparkling mountain spring water.',
    prepTimeMinutes: 5,
    calories: 65,
    dietaryBadges: ['Balinese Wellness', 'Vegan'],
    ingredients: ['Organic Turmeric', 'Java Tamarind', 'Red Ginger', 'Coconut Nectar', 'Spring Water'],
    allergens: [],
  },

  // ============================================================================
  // 2. SOSEI TOKYO — Edomae Sushi, Binchotan Wagyu & Tokyo Craft
  // ============================================================================
  {
    id: 'tokyo-01',
    propertyId: 'sosei-tinos',
    name: 'Toyosu Hon-Maguro & Hokkaido Uni Nigiri (6 pcs)',
    category: 'starters',
    categoryLabel: 'Edomae Sushi & Crudo',
    price: 135,
    image: dishTokyoNigiriImg,
    description: 'Aged Oma bluefin otoro, chutoro, akami zuke, and Rishiri sea urchin hand-pressed over warm akazu red vinegar shari.',
    prepTimeMinutes: 12,
    calories: 340,
    isChefSignature: true,
    dietaryBadges: ['Edomae Signature', 'Dairy-Free'],
    ingredients: ['Oma Bluefin Tuna', 'Hokkaido Sea Urchin (Uni)', 'Koshihikari Rice', 'Aged Akazu Vinegar', 'Nikiri Soy (Soy, Wheat)', 'Hon-Wasabi'],
    allergens: ['Fish', 'Shellfish', 'Soy', 'Gluten'],
  },
  {
    id: 'tokyo-02',
    propertyId: 'sosei-tinos',
    name: 'Hokkaido Hotate & Sudachi Kosho Usuzukuri',
    category: 'starters',
    categoryLabel: 'Edomae Sushi & Crudo',
    price: 52,
    image: scallopCrudoImg,
    description: 'Live Hokkaido sea scallop sliced paper-thin with green yuzu kosho, Tokushima sudachi citrus, and sea salt.',
    prepTimeMinutes: 10,
    calories: 155,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Hokkaido Sea Scallops', 'Sudachi Citrus', 'Yuzu Kosho', 'Shiso Blossom', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'tokyo-03',
    propertyId: 'sosei-tinos',
    name: 'Kagoshima A5 Kuroge Wagyu Binchotan Striploin',
    category: 'mains',
    categoryLabel: 'Sumibi & Mains',
    price: 175,
    image: wagyuStriploinImg,
    description: 'Charcoal-seared A5 black wagyu sirloin over Kishu white binchotan, served with aged tamari, grated靜岡 wasabi, and charred negi.',
    prepTimeMinutes: 20,
    calories: 650,
    isChefSignature: true,
    dietaryBadges: ['Binchotan Hearth'],
    ingredients: ['Kagoshima A5 Wagyu Beef', 'Hokkaido Butter (Dairy)', 'Aged Tamari Soy', 'Kujo Negi Leek', 'Fresh Wasabi'],
    allergens: ['Dairy', 'Soy'],
  },
  {
    id: 'tokyo-04',
    propertyId: 'sosei-tinos',
    name: 'Gindara Saikyo-Yaki (Miso-Marinated Black Cod)',
    category: 'mains',
    categoryLabel: 'Sumibi & Mains',
    price: 78,
    image: toothfishImg,
    description: 'Wild sablefish marinated 72 hours in sweet white miso and mirin, broiled over coals with pickled hajikami ginger.',
    prepTimeMinutes: 18,
    calories: 420,
    dietaryBadges: ['Dairy-Free'],
    ingredients: ['Alaskan Black Cod', 'White Saikyo Miso (Soy)', 'Hon-Mirin', 'Sake', 'Toasted Sesame', 'Hajikami Ginger'],
    allergens: ['Fish', 'Soy', 'Sesame'],
  },
  {
    id: 'tokyo-05',
    propertyId: 'sosei-tinos',
    name: 'Uji Matcha & Wasanbon Mille-Feuille',
    category: 'desserts',
    categoryLabel: 'Kanmi (Desserts)',
    price: 28,
    image: matchaMillefeuilleImg,
    description: 'Caramelized monaka-crisp pastry layered with first-harvest Uji matcha cream and Hokkaido dainagon azuki beans.',
    prepTimeMinutes: 10,
    calories: 360,
    dietaryBadges: ['Nut-Free'],
    ingredients: ['Uji Matcha', 'Hokkaido Cream (Dairy)', 'Wheat Pastry', 'Organic Egg', 'Azuki Red Beans', 'Wasanbon Sugar'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'tokyo-06',
    propertyId: 'sosei-tinos',
    name: 'Yamazaki 12-Year Mizunara Golden Highball',
    category: 'beverages',
    categoryLabel: 'Whisky & Sake',
    price: 42,
    image: goldenHighballImg,
    description: 'Yamazaki 12yr single malt whisky, mountain spring soda, hand-carved crystal ice, and 24k Kanazawa gold leaf.',
    prepTimeMinutes: 5,
    calories: 115,
    isChefSignature: true,
    dietaryBadges: ['Tokyo Signature'],
    ingredients: ['Yamazaki 12yr Single Malt', 'Artisanal Soda', 'Yuzu Twist', '24k Kanazawa Gold Leaf'],
    allergens: [],
  },

  // ============================================================================
  // 3. SOSEI JAPAN (KYOTO) — Zen Shojin Ryori, Kaiseki & Ceremonial Tea
  // ============================================================================
  {
    id: 'japan-01',
    propertyId: 'sosei-umbria',
    name: 'Arashiyama Fresh Yuba, Matsutake & Goma-Dofu',
    category: 'starters',
    categoryLabel: 'Sakizuke (Kaiseki Starters)',
    price: 46,
    image: mushroomTartletImg,
    description: 'Artisanal Kyoto soy-milk skin (yuba) paired with roasted black sesame tofu, autumn matsutake mushroom, and dashi gelee.',
    prepTimeMinutes: 14,
    calories: 210,
    isChefSignature: true,
    dietaryBadges: ['Shojin Ryori', 'Vegan', 'Gluten-Free'],
    ingredients: ['Kyoto Fresh Yuba (Soy)', 'Black Sesame Paste', 'Kuzu Starch', 'Matsutake Mushroom', 'Rishiri Kombu Dashi'],
    allergens: ['Soy', 'Sesame'],
  },
  {
    id: 'japan-02',
    propertyId: 'sosei-umbria',
    name: 'Zen Temple Heirloom Shojin Bowl',
    category: 'mains',
    categoryLabel: 'Shojin & Kaiseki Mains',
    price: 42,
    image: zenGardenBowlImg,
    description: 'Kamo heirloom vegetables, pickled lotus root, Kyoto edamame, bamboo shoots, and cold-pressed white sesame ginger dressing.',
    prepTimeMinutes: 12,
    calories: 320,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Organic'],
    ingredients: ['Heirloom Kyoto Vegetables', 'Edamame (Soy)', 'Lotus Root', 'Bamboo Shoot', 'White Sesame', 'Ginger'],
    allergens: ['Soy', 'Sesame'],
  },
  {
    id: 'japan-03',
    propertyId: 'sosei-umbria',
    name: 'Wakasa Guji (Crispy-Scale Red Tilefish) in Kombu Broth',
    category: 'mains',
    categoryLabel: 'Shojin & Kaiseki Mains',
    price: 88,
    image: toothfishImg,
    description: 'Kyoto court delicacy of red tilefish with crisped scales resting in clear aged kombu and bonito wanmono broth with yuzu peel.',
    prepTimeMinutes: 20,
    calories: 390,
    isChefSignature: true,
    dietaryBadges: ['Kyoto Kaiseki', 'Dairy-Free', 'Gluten-Free'],
    ingredients: ['Red Tilefish (Amadai)', 'Rishiri Kombu', 'Katsuobushi', 'Kyoto Mizuna', 'Yuzu Zest', 'Sea Salt'],
    allergens: ['Fish'],
  },
  {
    id: 'japan-04',
    propertyId: 'sosei-umbria',
    name: 'Ceremonial Uji Matcha & Seasonal Nama-Wagashi',
    category: 'desserts',
    categoryLabel: 'Chakai (Tea & Sweets)',
    price: 30,
    image: matchaMillefeuilleImg,
    description: 'Hand-crafted Kyoto nerikiri sweet bean confection served alongside stone-milled Uji koicha green tea.',
    prepTimeMinutes: 10,
    calories: 240,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Dairy-Free'],
    ingredients: ['White Kidney Bean Paste', 'Uji Ceremonial Matcha', 'Roasted Walnut (Tree Nuts)', 'Rice Flour'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'japan-05',
    propertyId: 'sosei-umbria',
    name: 'Almond Blossom Cold-Whisked Uji Matcha',
    category: 'beverages',
    categoryLabel: 'Chakai (Tea & Sweets)',
    price: 22,
    image: icedMatchaLatteImg,
    description: 'Single-cultivar Samidori Uji matcha whisked over spring water ice and house-pressed raw almond milk.',
    prepTimeMinutes: 5,
    calories: 125,
    dietaryBadges: ['Vegan', 'Gluten-Free'],
    ingredients: ['Samidori Uji Matcha', 'Raw Almond Milk (Tree Nuts)', 'Wasanbon Syrup', 'Spring Ice'],
    allergens: ['Tree Nuts'],
  },

  // ============================================================================
  // 4. SOSEI BARCELONA — Catalan Gastronomy, Seafood Arroz & Iberian Tapas
  // ============================================================================
  {
    id: 'bcn-01',
    propertyId: 'sosei-barcelona',
    name: 'Vieiras de la Costa Brava & Romesco de Avellana',
    category: 'starters',
    categoryLabel: 'Tapas & Para Picar',
    price: 48,
    image: scallopCrudoImg,
    description: 'Seared Mediterranean sea scallops with Reus roasted hazelnut romesco, Arbequina olive oil, and sea fennel.',
    prepTimeMinutes: 12,
    calories: 260,
    dietaryBadges: ['Catalan Coastal'],
    ingredients: ['Mediterranean Scallops', 'Reus Hazelnuts (Tree Nuts)', 'Nyora Peppers', 'Arbequina Olive Oil', 'ourdough Crumb (Gluten)'],
    allergens: ['Shellfish', 'Molluscs', 'Tree Nuts', 'Gluten'],
  },
  {
    id: 'bcn-02',
    propertyId: 'sosei-barcelona',
    name: 'Coca de Setas Silvestres del Pirineo (Pyrenees Mushroom Coca)',
    category: 'starters',
    categoryLabel: 'Tapas & Para Picar',
    price: 36,
    image: mushroomTartletImg,
    description: 'Crisp Catalan flatbread topped with wild Pyrenees chanterelles, roasted garlic confit, and rosemary oil.',
    prepTimeMinutes: 14,
    calories: 280,
    dietaryBadges: ['Vegan', 'Nut-Free'],
    ingredients: ['Pyrenees Chanterelles', 'Artisanal Wheat Coca Dough', 'Garlic Confit', 'Extra Virgin Olive Oil', 'Fresh Rosemary'],
    allergens: ['Gluten'],
  },
  {
    id: 'bcn-03',
    propertyId: 'sosei-barcelona',
    name: 'Arroz Caldoso de Bogavante & Gamba Roja de Palamós',
    category: 'mains',
    categoryLabel: 'Arroces & Principales',
    price: 128,
    image: dishBarcelonaPaellaImg,
    description: 'Traditional Catalan iron-pan bomba rice simmered in roasted rockfish fumet with blue lobster, Palamós red prawns, and saffron aioli.',
    prepTimeMinutes: 26,
    calories: 620,
    isChefSignature: true,
    dietaryBadges: ['Catalan Signature', 'Gluten-Free'],
    ingredients: ['Delta del Ebro Bomba Rice', 'Mediterranean Blue Lobster', 'Palamós Red Prawns', 'La Mancha Saffron', 'Garlic Egg Aioli (Eggs)'],
    allergens: ['Shellfish', 'Crustaceans', 'Fish', 'Eggs'],
  },
  {
    id: 'bcn-04',
    propertyId: 'sosei-barcelona',
    name: 'Canelón Trufado de Cangrejo Real (Catalan Crab Cannelloni)',
    category: 'mains',
    categoryLabel: 'Arroces & Principales',
    price: 68,
    image: crabRavioloniImg,
    description: 'San Esteban festive Catalan pasta stuffed with sweet king crab and mató curd, finished with black truffle velouté.',
    prepTimeMinutes: 18,
    calories: 490,
    dietaryBadges: ['Barcelona Classic'],
    ingredients: ['King Crab', 'Catalan Mató Cheese (Dairy)', 'Durum Wheat Pasta', 'Farm Eggs', 'Black Winter Truffle'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'bcn-05',
    propertyId: 'sosei-barcelona',
    name: 'Coulant de Chocolate Guanaja & Avellana de Reus',
    category: 'desserts',
    categoryLabel: 'Postres Artesanos',
    price: 28,
    image: chocolateSouffleImg,
    description: 'Warm dark chocolate fondant inspired by Catalan pastry masters, with Reus hazelnut praline and olive oil gelato.',
    prepTimeMinutes: 18,
    calories: 470,
    isChefSignature: true,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['70% Dark Chocolate', 'Reus Hazelnuts (Tree Nuts)', 'Farm Eggs', 'Butter (Dairy)', 'Wheat Flour', 'Arbequina Olive Oil'],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },
  {
    id: 'bcn-06',
    propertyId: 'sosei-barcelona',
    name: 'Sangría Blanca Botánica del Priorat',
    category: 'beverages',
    categoryLabel: 'Bodega & Cócteles',
    price: 26,
    image: botanicalElixirImg,
    description: 'Priorat white Garnacha infused with Mediterranean rosemary, blood orange, wild berries, and sparkling cava.',
    prepTimeMinutes: 5,
    calories: 130,
    dietaryBadges: ['Vegan', 'Gluten-Free'],
    ingredients: ['White Garnacha', 'Cava Brut Nature', 'Blood Orange', 'Mediterranean Rosemary'],
    allergens: [],
  },

  // ============================================================================
  // 5. SOSEI MALDIVES — Maldivian Atoll Spice & Indian Ocean Reef Cuisine
  // ============================================================================
  {
    id: 'mle-01',
    propertyId: 'sosei-auh',
    name: 'Lagoon Scallop & Maldivian Githeyomirus Crudo',
    category: 'starters',
    categoryLabel: 'Atoll Raw Bar & Starters',
    price: 54,
    image: scallopCrudoImg,
    description: 'Chilled sea scallops dressed with Maldivian lime, young coconut water reduction, finger lime pearls, and curry leaf oil.',
    prepTimeMinutes: 10,
    calories: 165,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Sea Scallops', 'Young Coconut Water', 'Maldivian Lime', 'Curry Leaf', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'mle-02',
    propertyId: 'sosei-auh',
    name: 'Crispy Atoll Soft-Shell Crab & Coconut Sambol',
    category: 'starters',
    categoryLabel: 'Atoll Raw Bar & Starters',
    price: 48,
    image: softShellCrabImg,
    description: 'Tempura-light soft-shell crab with toasted coconut-peanut sambol, green mango, and screwpine leaf.',
    prepTimeMinutes: 15,
    calories: 370,
    dietaryBadges: ['Island Special'],
    ingredients: ['Soft-Shell Crab', 'Grated Coconut', 'Roasted Peanuts', 'Green Mango', 'Lime'],
    allergens: ['Shellfish', 'Crustaceans', 'Peanuts'],
  },
  {
    id: 'mle-03',
    propertyId: 'sosei-auh',
    name: 'Maldivian Reef Lobster Kandu Curry',
    category: 'mains',
    categoryLabel: 'Ocean Mains & Curries',
    price: 142,
    image: lobsterThermidorImg,
    description: 'North Malé spiny lobster poached in aromatic coconut milk, pandan leaf (raanbaiy), roasted fenugreek, and basmati rice.',
    prepTimeMinutes: 24,
    calories: 560,
    isChefSignature: true,
    dietaryBadges: ['Maldivian Signature', 'Gluten-Free'],
    ingredients: ['Maldivian Spiny Lobster', 'First-Press Coconut Milk', 'Pandan Leaf', 'Curry Leaves', 'Cardamom', 'Clarified Ghee (Dairy)'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy'],
  },
  {
    id: 'mle-04',
    propertyId: 'sosei-auh',
    name: 'Line-Caught Atoll Jobfish (Faru Mas) over Coconut Coals',
    category: 'mains',
    categoryLabel: 'Ocean Mains & Curries',
    price: 82,
    image: toothfishImg,
    description: 'Sustainably hand-lined reef jobfish basted in turmeric, tamarind, and ginger, served with charred heart of palm.',
    prepTimeMinutes: 20,
    calories: 410,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Maldivian Reef Jobfish', 'Fresh Turmeric', 'Tamarind', 'Coconut Oil', 'Heart of Palm'],
    allergens: ['Fish'],
  },
  {
    id: 'mle-05',
    propertyId: 'sosei-auh',
    name: 'Island Alphonso Mango, Coconut & Passionfruit Sorbet',
    category: 'desserts',
    categoryLabel: 'Tropical Desserts',
    price: 24,
    image: sorbetTrioImg,
    description: 'Chilled trio of house-churned Alphonso mango, young Kurumba coconut, and atoll passionfruit sorbets.',
    prepTimeMinutes: 8,
    calories: 145,
    dietaryBadges: ['Vegan', 'Allergen-Free'],
    ingredients: ['Alphonso Mango', 'Kurumba Young Coconut', 'Passionfruit', 'Cane Sugar'],
    allergens: [],
  },

  // ============================================================================
  // 6. SOSEI SWITZERLAND — Zermatt Valais Alpine Hearth & High-Altitude Cuisine
  // ============================================================================
  {
    id: 'che-01',
    propertyId: 'sosei-andermatt',
    name: 'Zermatt Alpine Smoked Trout, Caviar & Crispy Rösti',
    category: 'starters',
    categoryLabel: 'Alpine Starters',
    price: 165,
    image: caviarImg,
    description: 'Valais mountain brook trout and Oscietra caviar served over golden alpine potato rösti with cultured crème fraîche.',
    prepTimeMinutes: 12,
    calories: 310,
    isChefSignature: true,
    dietaryBadges: ['Valais Signature', 'Gluten-Free'],
    ingredients: ['Oscietra Caviar', 'Alpine Brook Trout', 'Mountain Potatoes', 'Cultured Crème Fraîche (Dairy)', 'Chives'],
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'che-02',
    propertyId: 'sosei-andermatt',
    name: 'Wild Valais Chanterelle & Alpine Morel Tartlet',
    category: 'starters',
    categoryLabel: 'Alpine Starters',
    price: 42,
    image: mushroomTartletImg,
    description: 'Hand-foraged Swiss alpine morels and chanterelles glazed in white wine shallot reduction inside crisp spelt pastry.',
    prepTimeMinutes: 15,
    calories: 250,
    dietaryBadges: ['Vegetarian', 'Nut-Free'],
    ingredients: ['Alpine Morels', 'Chanterelles', 'Swiss Spelt Flour (Gluten)', 'Alpine Butter (Dairy)', 'Mountain Thyme'],
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'che-03',
    propertyId: 'sosei-andermatt',
    name: 'Valais Aged Gruyère, Vacherin & Alba Truffle Tagliolini',
    category: 'mains',
    categoryLabel: 'Alpine Hearth Mains',
    price: 92,
    image: taglioliniTruffleImg,
    description: 'Handmade egg-yolk pasta folded into 24-month Gruyère AOP and alpine butter fondue emulsion with shaved white truffle.',
    prepTimeMinutes: 16,
    calories: 560,
    isChefSignature: true,
    dietaryBadges: ['Matterhorn Signature'],
    ingredients: ['24-Month Gruyère AOP (Dairy)', 'Vacherin Fribourgeois (Dairy)', 'White Truffle', 'Wheat Flour', 'Organic Egg Yolks'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'che-04',
    propertyId: 'sosei-andermatt',
    name: 'Roast Saddle of Swiss Alpine Venison & Juniper Jus',
    category: 'mains',
    categoryLabel: 'Alpine Hearth Mains',
    price: 138,
    image: wagyuStriploinImg,
    description: 'Tender Valais venison loin roasted over larch wood, accompanied by chestnut mousseline, lingonberry, and smoked bone jus.',
    prepTimeMinutes: 22,
    calories: 590,
    dietaryBadges: ['Gluten-Free'],
    ingredients: ['Swiss Alpine Venison', 'Roasted Chestnuts (Tree Nuts)', 'Alpine Butter (Dairy)', 'Juniper Berries', 'Lingonberry'],
    allergens: ['Dairy', 'Tree Nuts'],
  },
  {
    id: 'che-05',
    propertyId: 'sosei-andermatt',
    name: 'Swiss Grand Cru 70% Chocolate Soufflé & Hazelnut',
    category: 'desserts',
    categoryLabel: 'Patisserie Alpine',
    price: 30,
    image: chocolateSouffleImg,
    description: 'Baked-to-order Swiss dark chocolate soufflé with double Gruyère cream and roasted Piedmont hazelnut crunch.',
    prepTimeMinutes: 20,
    calories: 480,
    isChefSignature: true,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['Swiss Dark Chocolate', 'Gruyère Double Cream (Dairy)', 'Farm Eggs', 'Hazelnuts (Tree Nuts)', 'Wheat Flour'],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },

  // ============================================================================
  // 7. SOSEI CANADA — Whistler Pacific Northwest & Coast Mountain Cuisine
  // ============================================================================
  {
    id: 'can-01',
    propertyId: 'sosei-melides',
    name: 'Haida Gwaii Cold-Smoked Chinook Salmon & Burrata',
    category: 'starters',
    categoryLabel: 'Coast Mountain Starters',
    price: 44,
    image: salmonBurrataImg,
    description: 'Alderwood-smoked British Columbia wild Chinook salmon with creamy artisan burrata, spruce tips, and Saskatoon berry reduction.',
    prepTimeMinutes: 10,
    calories: 380,
    isChefSignature: true,
    dietaryBadges: ['BC Wild Catch', 'Gluten-Free'],
    ingredients: ['Wild BC Chinook Salmon', 'Artisan Burrata (Dairy)', 'Spruce Tips', 'Saskatoon Berries', 'Wild Arugula'],
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'can-02',
    propertyId: 'sosei-melides',
    name: 'Foraged Whistler Pine Mushroom & Morel Tart',
    category: 'starters',
    categoryLabel: 'Coast Mountain Starters',
    price: 38,
    image: mushroomTartletImg,
    description: 'Pemberton valley foraged morels and pine mushrooms roasted with Okanagan Pinot Noir shallots and thyme.',
    prepTimeMinutes: 15,
    calories: 240,
    dietaryBadges: ['Vegan', 'Nut-Free'],
    ingredients: ['BC Pine Mushrooms', 'Wild Morels', 'Organic Wheat Pastry', 'Shallots', 'Fresh Thyme'],
    allergens: ['Gluten'],
  },
  {
    id: 'can-03',
    propertyId: 'sosei-melides',
    name: 'Alberta Prime Bison Striploin & Smoked Bone Marrow',
    category: 'mains',
    categoryLabel: 'Timberline Mains',
    price: 125,
    image: wagyuStriploinImg,
    description: 'Grass-fed Alberta bison striploin grilled over Douglas fir embers, served with Yukon gold potato purée and birch syrup jus.',
    prepTimeMinutes: 22,
    calories: 610,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Nut-Free'],
    ingredients: ['Alberta Prime Bison', 'Yukon Gold Potatoes', 'Cultured Butter (Dairy)', 'Birch Syrup', 'Bone Marrow'],
    allergens: ['Dairy'],
  },
  {
    id: 'can-04',
    propertyId: 'sosei-melides',
    name: 'Fogo Island Snow Crab & Pemberton Potato Ravioloni',
    category: 'mains',
    categoryLabel: 'Timberline Mains',
    price: 72,
    image: crabRavioloniImg,
    description: 'Handmade pasta parcels filled with sweet Canadian snow crab and ricotta in roasted shell bisque.',
    prepTimeMinutes: 18,
    calories: 470,
    dietaryBadges: ['Canadian Coastal'],
    ingredients: ['Canadian Snow Crab', 'Ricotta (Dairy)', 'Durum Wheat', 'Farm Eggs', 'Dill Oil'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'can-05',
    propertyId: 'sosei-melides',
    name: 'Okanagan Blackberry & Smoked Pine Botanical Elixir',
    category: 'beverages',
    categoryLabel: 'Cellar & Botanicals',
    price: 24,
    image: botanicalElixirImg,
    description: 'Cold-pressed British Columbia wild blackberries, Douglas fir needle mist, rosemary, and glacier spring tonic.',
    prepTimeMinutes: 5,
    calories: 75,
    dietaryBadges: ['Non-Alcoholic', 'Vegan'],
    ingredients: ['BC Wild Blackberries', 'Douglas Fir Mist', 'Rosemary', 'Glacier Spring Tonic'],
    allergens: [],
  },

  // ============================================================================
  // 8. SOSEI COSTA RICA — Papagayo Pacific Cevichería & Nicoya Blue Zone
  // ============================================================================
  {
    id: 'cri-01',
    propertyId: 'sosei-osa',
    name: 'Papagayo Wild Snapper & Maracuyá Ceviche',
    category: 'starters',
    categoryLabel: 'Cevichería & Entradas',
    price: 42,
    image: scallopCrudoImg,
    description: 'Line-caught Pacific red snapper cured in passionfruit leche de tigre, compressed chayote, micro cilantro, and crispy plantain.',
    prepTimeMinutes: 12,
    calories: 190,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Pacific Red Snapper', 'Passionfruit (Maracuyá)', 'Mandarin Lime', 'Cilantro', 'Green Plantain'],
    allergens: ['Fish'],
  },
  {
    id: 'cri-02',
    propertyId: 'sosei-osa',
    name: 'Nicoya Blue Zone Ancestral Longevity Bowl',
    category: 'mains',
    categoryLabel: 'Cocina de la Selva',
    price: 36,
    image: zenGardenBowlImg,
    description: 'Heirloom Nicoya black beans, Hass avocado, roasted pejibaye (peach palm), quinoa, and toasted cashew lime crema.',
    prepTimeMinutes: 12,
    calories: 380,
    isChefSignature: true,
    dietaryBadges: ['Blue Zone Vegan', 'Gluten-Free'],
    ingredients: ['Heirloom Black Beans', 'Hass Avocado', 'Pejibaye Palm Fruit', 'Organic Quinoa', 'Roasted Cashews (Tree Nuts)', 'Lime'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'cri-03',
    propertyId: 'sosei-osa',
    name: 'Gluten-Free Yuca & Wild Herb Gnocchi in Cashew Pesto',
    category: 'mains',
    categoryLabel: 'Cocina de la Selva',
    price: 44,
    image: herbGnocchiImg,
    description: 'Hand-rolled organic Costa Rican cassava (yuca) gnocchi tossed in roasted cherry tomato passata and rainforest basil cashew pesto.',
    prepTimeMinutes: 15,
    calories: 390,
    dietaryBadges: ['Gluten-Free', 'Vegan'],
    ingredients: ['Organic Cassava (Yuca)', 'Rainforest Sweet Basil', 'Roasted Cashews (Tree Nuts)', 'Heirloom Tomatoes', 'Olive Oil'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'cri-04',
    propertyId: 'sosei-osa',
    name: 'Wood-Fired Pacific Dorado (Mahi-Mahi) & Heart of Palm',
    category: 'mains',
    categoryLabel: 'Cocina de la Selva',
    price: 68,
    image: toothfishImg,
    description: 'Coffee-wood grilled Pacific dorado fillet served with fresh palmito purée, charred pineapple salsa, and cilantro oil.',
    prepTimeMinutes: 18,
    calories: 420,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Pacific Dorado (Mahi-Mahi)', 'Fresh Heart of Palm (Palmito)', 'Golden Pineapple', 'Cilantro', 'Olive Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'cri-05',
    propertyId: 'sosei-osa',
    name: 'Upala Single-Origin 80% Cacao Molten Tortilla',
    category: 'desserts',
    categoryLabel: 'Cacao & Postres',
    price: 26,
    image: chocolateSouffleImg,
    description: 'Warm ceremonial Upala dark cacao cake with Tarrazú espresso anglaise and caramelized macadamia nuts.',
    prepTimeMinutes: 18,
    calories: 440,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['Upala 80% Dark Cacao', 'Tarrazú Coffee', 'Macadamia Nuts (Tree Nuts)', 'Farm Eggs', 'Butter (Dairy)'],
    allergens: ['Tree Nuts', 'Eggs', 'Dairy'],
  },

  // ============================================================================
  // 9. SOSEI OMAN — Jebel Akhdar Royal Omani Shuwa & Mountain Mezze
  // ============================================================================
  {
    id: 'omn-01',
    propertyId: 'sosei-auh',
    name: 'Charred Jebel Cauliflower, Pine Nut Tahini & Pomegranate',
    category: 'starters',
    categoryLabel: 'Mountain Mezze',
    price: 38,
    image: cauliflowerSteakImg,
    description: 'Roasted mountain cauliflower basted in wild za’atar oil, resting on artisanal sesame tahini, Jebel Akhdar pomegranate jewels, and pine nuts.',
    prepTimeMinutes: 16,
    calories: 310,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Heirloom Cauliflower', 'Sesame Tahini', 'Jebel Akhdar Pomegranate', 'Roasted Pine Nuts (Tree Nuts)', 'Wild Za’atar'],
    allergens: ['Sesame', 'Tree Nuts'],
  },
  {
    id: 'omn-02',
    propertyId: 'sosei-auh',
    name: '24-Hour Royal Omani Lamb Shuwa & Saffron Qabuli Rice',
    category: 'mains',
    categoryLabel: 'Royal Omani Mains',
    price: 96,
    image: dishOmanShuwaImg,
    description: 'Traditional Omani lamb shoulder marinated in baharat spices, wrapped in banana leaves and slow-roasted underground, with saffron rice and walnuts.',
    prepTimeMinutes: 22,
    calories: 640,
    isChefSignature: true,
    dietaryBadges: ['Royal Omani Heritage', 'Halal', 'Gluten-Free'],
    ingredients: ['Omani Mountain Lamb', 'Omani Baharat Spices', 'Saffron Basmati Rice', 'Jebel Walnuts (Tree Nuts)', 'Pomegranate', 'Clarified Ghee (Dairy)'],
    allergens: ['Tree Nuts', 'Dairy'],
  },
  {
    id: 'omn-03',
    propertyId: 'sosei-auh',
    name: 'Musandam Charcoal-Grilled Kingfish (Kan’ad) & Black Lime',
    category: 'mains',
    categoryLabel: 'Royal Omani Mains',
    price: 76,
    image: toothfishImg,
    description: 'Arabian Sea kingfish fillet rubbed with dried Omani black lime (loomi), coriander, and Sidr honey glaze.',
    prepTimeMinutes: 20,
    calories: 430,
    dietaryBadges: ['Halal', 'Gluten-Free', 'Dairy-Free'],
    ingredients: ['Arabian Sea Kingfish', 'Dried Omani Black Lime (Loomi)', 'Sidr Mountain Honey', 'Coriander', 'Olive Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'omn-04',
    propertyId: 'sosei-auh',
    name: 'Jebel Akhdar Damask Rose, Mango & Blood Orange Sorbet',
    category: 'desserts',
    categoryLabel: 'Halwa & Sweets',
    price: 24,
    image: sorbetTrioImg,
    description: 'Chilled quenelles of Jebel Akhdar Damask rosewater, Salalah mango, and blood orange sorbet.',
    prepTimeMinutes: 8,
    calories: 140,
    dietaryBadges: ['Vegan', 'Allergen-Free', 'Halal'],
    ingredients: ['Jebel Akhdar Rosewater', 'Salalah Mango', 'Blood Orange', 'Cane Sugar'],
    allergens: [],
  },
  {
    id: 'omn-05',
    propertyId: 'sosei-auh',
    name: 'Dhofar Frankincense, Rosewater & Blackberry Elixir',
    category: 'beverages',
    categoryLabel: 'Omani Infusions',
    price: 24,
    image: botanicalElixirImg,
    description: 'Sacred Hojari frankincense hydrosol infused with mountain blackberry, Damask rose petals, and sparkling spring water.',
    prepTimeMinutes: 5,
    calories: 70,
    isChefSignature: true,
    dietaryBadges: ['Zero Alcohol', 'Halal', 'Vegan'],
    ingredients: ['Royal Hojari Frankincense Water', 'Damask Rose', 'Mountain Blackberry', 'Spring Water'],
    allergens: [],
  },

  // ============================================================================
  // 10. SOSEI EGYPT — Siwa Oasis Kershef Clay-Oven & North African Sanctuary
  // ============================================================================
  {
    id: 'egy-01',
    propertyId: 'sosei-el-gouna',
    name: 'Siwa Oasis Roasted Cauliflower, Tahini & Dukkah',
    category: 'starters',
    categoryLabel: 'Siwan Mezze',
    price: 36,
    image: cauliflowerSteakImg,
    description: 'Clay-oven charred cauliflower with first-press Siwan olive oil, stone-ground sesame tahini, and roasted hazelnut dukkah.',
    prepTimeMinutes: 15,
    calories: 320,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Roasted Cauliflower', 'Siwa Extra Virgin Olive Oil', 'Sesame Tahini', 'Hazelnut & Coriander Dukkah (Tree Nuts, Sesame)'],
    allergens: ['Sesame', 'Tree Nuts'],
  },
  {
    id: 'egy-02',
    propertyId: 'sosei-el-gouna',
    name: 'Siwan Clay-Oven Duck with Medjool Date & Olive Glaze',
    category: 'mains',
    categoryLabel: 'Clay-Oven & Tagines',
    price: 82,
    image: dishBaliBetutuImg,
    description: 'Slow-roasted oasis duck glazed with Siwa Medjool date molasses, green olives, and smoky roasted freekeh grain.',
    prepTimeMinutes: 22,
    calories: 590,
    isChefSignature: true,
    dietaryBadges: ['Siwa Heritage', 'Halal', 'Dairy-Free'],
    ingredients: ['Oasis Duck Breast', 'Siwa Medjool Dates', 'Siwan Green Olives', 'Roasted Green Wheat Freekeh (Gluten)', 'Cumin & Cinnamon'],
    allergens: ['Gluten'],
  },
  {
    id: 'egy-03',
    propertyId: 'sosei-el-gouna',
    name: 'Red Sea King Lobster Tagine with Chermoula & Saffron',
    category: 'mains',
    categoryLabel: 'Clay-Oven & Tagines',
    price: 125,
    image: lobsterThermidorImg,
    description: 'Red Sea spiny lobster baked in earthen tagine with preserved lemon, Alexandria garlic chermoula, and saffron butter.',
    prepTimeMinutes: 24,
    calories: 530,
    dietaryBadges: ['Halal', 'Gluten-Free'],
    ingredients: ['Red Sea Spiny Lobster', 'Preserved Lemon', 'Fresh Cilantro & Parsley', 'Saffron Clarified Butter (Dairy)', 'Garlic'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy'],
  },
  {
    id: 'egy-04',
    propertyId: 'sosei-el-gouna',
    name: 'Oasis Ancient Grain, Avocado & Hibiscus Bowl',
    category: 'mains',
    categoryLabel: 'Clay-Oven & Tagines',
    price: 34,
    image: zenGardenBowlImg,
    description: 'Nile delta heirloom quinoa, avocado, roasted chickpeas, pickled turnip, and cold-pressed sesame lemon dressing.',
    prepTimeMinutes: 10,
    calories: 340,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Organic Quinoa', 'Chickpeas', 'Avocado', 'Pickled Turnip', 'Sesame Tahini', 'Lemon'],
    allergens: ['Sesame'],
  },
  {
    id: 'egy-05',
    propertyId: 'sosei-el-gouna',
    name: 'Cold-Pressed Aswan Karkadeh (Hibiscus) & Mint Elixir',
    category: 'beverages',
    categoryLabel: 'Oasis Elixirs',
    price: 20,
    image: botanicalElixirImg,
    description: 'Sun-dried Aswan crimson hibiscus flowers steeped cold with desert spearmint, rosewater, and citrus.',
    prepTimeMinutes: 5,
    calories: 65,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Allergen-Free', 'Halal'],
    ingredients: ['Aswan Hibiscus Petals', 'Desert Spearmint', 'Rosewater', 'Organic Cane Nectar'],
    allergens: [],
  },
];

/**
 * Allergy Matching Engine
 * Checks whether any of the guest's allergies conflict with the menu item's ingredients or allergen tags.
 * Per Rule 4: Conflicting items CAN STILL BE SELECTED, triggering a confirmation modal where staff can add notes.
 */
export function checkAllergyConflict(
  guest: FnbGuest | null,
  item: FnbMenuItem
): {
  hasConflict: boolean;
  conflictingAllergens: string[];
  reason: string;
} {
  if (!guest || !guest.allergies || guest.allergies.length === 0) {
    return { hasConflict: false, conflictingAllergens: [], reason: '' };
  }

  const conflicts: string[] = [];

  for (const allergy of guest.allergies) {
    const cleanAllergy = allergy.toLowerCase().trim();

    // 1. Direct match with item.allergens
    const matchedAllergen = item.allergens.find((allg) => {
      const cleanAllg = allg.toLowerCase().trim();
      return (
        cleanAllg.includes(cleanAllergy) ||
        cleanAllergy.includes(cleanAllg) ||
        (cleanAllergy === 'shellfish' && (cleanAllg === 'crustaceans' || cleanAllg === 'molluscs')) ||
        (cleanAllergy === 'crustaceans' && cleanAllg === 'shellfish') ||
        (cleanAllergy === 'peanuts' && cleanAllg === 'nuts') ||
        (cleanAllergy === 'lactose' && cleanAllg === 'dairy') ||
        (cleanAllergy === 'dairy' && cleanAllg === 'lactose')
      );
    });

    if (matchedAllergen) {
      if (!conflicts.includes(allergy)) conflicts.push(allergy);
      continue;
    }

    // 2. Ingredient text search
    const matchedIngredient = item.ingredients.find((ing) => {
      const cleanIng = ing.toLowerCase();
      if (cleanAllergy === 'peanuts' && cleanIng.includes('peanut')) return true;
      if (
        cleanAllergy === 'tree nuts' &&
        (cleanIng.includes('nut') ||
          cleanIng.includes('hazelnut') ||
          cleanIng.includes('almond') ||
          cleanIng.includes('walnut') ||
          cleanIng.includes('pecan') ||
          cleanIng.includes('cashew') ||
          cleanIng.includes('pistachio') ||
          cleanIng.includes('macadamia') ||
          cleanIng.includes('candlenut'))
      )
        return true;
      if (
        cleanAllergy === 'shellfish' &&
        (cleanIng.includes('scallop') ||
          cleanIng.includes('lobster') ||
          cleanIng.includes('crab') ||
          cleanIng.includes('prawn') ||
          cleanIng.includes('shrimp') ||
          cleanIng.includes('uni'))
      )
        return true;
      if (
        cleanAllergy === 'crustaceans' &&
        (cleanIng.includes('lobster') ||
          cleanIng.includes('crab') ||
          cleanIng.includes('prawn') ||
          cleanIng.includes('shrimp'))
      )
        return true;
      if (
        cleanAllergy === 'gluten' &&
        (cleanIng.includes('flour') ||
          cleanIng.includes('wheat') ||
          cleanIng.includes('pasta') ||
          cleanIng.includes('bread') ||
          cleanIng.includes('spelt') ||
          cleanIng.includes('freekeh') ||
          cleanIng.includes('semolina'))
      )
        return true;
      if (
        cleanAllergy === 'dairy' &&
        (cleanIng.includes('dairy') ||
          cleanIng.includes('butter') ||
          cleanIng.includes('milk') ||
          cleanIng.includes('cheese') ||
          cleanIng.includes('cream') ||
          cleanIng.includes('ricotta') ||
          cleanIng.includes('burrata') ||
          cleanIng.includes('ghee') ||
          cleanIng.includes('gruyère'))
      )
        return true;
      if (cleanAllergy === 'eggs' && (cleanIng.includes('egg') || cleanIng.includes('yolk') || cleanIng.includes('aioli')))
        return true;
      if (cleanAllergy === 'soy' && (cleanIng.includes('soy') || cleanIng.includes('miso') || cleanIng.includes('yuba') || cleanIng.includes('edamame') || cleanIng.includes('tamari')))
        return true;
      if (cleanAllergy === 'sesame' && (cleanIng.includes('sesame') || cleanIng.includes('tahini'))) return true;
      return cleanIng.includes(cleanAllergy);
    });

    if (matchedIngredient) {
      if (!conflicts.includes(allergy)) conflicts.push(allergy);
    }
  }

  if (conflicts.length > 0) {
    return {
      hasConflict: true,
      conflictingAllergens: conflicts,
      reason: `Contains ${conflicts.join(', ')}, which matches ${guest.name}'s registered allergy profile.`,
    };
  }

  return { hasConflict: false, conflictingAllergens: [], reason: '' };
}
