// Restaurant Architectural Images (Generated per SOSEI Property)
import baliWantilanImg from '@/assets/fnb/restaurants/bali_wantilan.jpg';
import baliKarangImg from '@/assets/fnb/restaurants/bali_karang.jpg';
import tokyoShinjuImg from '@/assets/fnb/restaurants/tokyo_shinju.jpg';
import tokyoSumibiImg from '@/assets/fnb/restaurants/tokyo_sumibi.jpg';
import japanArashiyamaImg from '@/assets/fnb/restaurants/japan_arashiyama.jpg';
import japanSaryoImg from '@/assets/fnb/restaurants/japan_saryo.jpg';
import barcelonaCasamiroImg from '@/assets/fnb/restaurants/barcelona_casamiro.jpg';
import barcelonaBodegaImg from '@/assets/fnb/restaurants/barcelona_bodega.jpg';
import maldivesFarumathiImg from '@/assets/fnb/restaurants/maldives_farumathi.jpg';
import maldivesVeliImg from '@/assets/fnb/restaurants/maldives_veli.jpg';
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
  // 1. SOSEI BALI (Uluwatu, Bali, Indonesia)
  {
    id: 'rest-bali-wantilan',
    propertyId: 'sosei-bali',
    propertyName: 'SOSEI BALI',
    propertyLocation: 'Uluwatu, Bali, Indonesia',
    collectionName: 'SOSEI Beach Resort',
    name: 'Wantilan Agung',
    concept: 'Royal Balinese Heritage Cuisine & Sacred Spice Kitchen',
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
    propertyLocation: 'Uluwatu, Bali, Indonesia',
    collectionName: 'SOSEI Beach Resort',
    name: 'Karang Jimbaran Grill',
    concept: 'Coconut-Husk Wood-Fired Indian Ocean Catch & Sambal Bar',
    cuisineTag: 'Nusantara Coastal Grill',
    hours: '12:00 – 23:00',
    seating: '36 Covers · Limestone Terrace',
    tables: ['Limestone Terrace 02', 'Ocean Ledge 05', 'Sunset Alcove 01', 'In-Villa Delivery'],
    image: baliKarangImg,
  },

  // 2. SOSEI TOKYO (Tokyo, Japan)
  {
    id: 'rest-tokyo-shinju',
    propertyId: 'sosei-tokyo',
    propertyName: 'SOSEI TOKYO',
    propertyLocation: 'Tokyo, Japan',
    collectionName: 'SOSEI Urban',
    name: 'Sushi Shinju',
    concept: 'Traditional Edomae Sushi & Toyosu Aged Omakase Counter',
    cuisineTag: 'Edomae Omakase',
    hours: '17:30 – 23:00',
    seating: '12 Seats · Hinoki Counter',
    tables: ['Hinoki Counter Seat 1–2', 'Hinoki Counter Seat 5–6', 'Private Tatami Room', 'Suite Delivery'],
    image: tokyoShinjuImg,
  },
  {
    id: 'rest-tokyo-sumibi',
    propertyId: 'sosei-tokyo',
    propertyName: 'SOSEI TOKYO',
    propertyLocation: 'Tokyo, Japan',
    collectionName: 'SOSEI Urban',
    name: 'Sumibi Aoyama',
    concept: 'Binchotan Charcoal A5 Wagyu & Seasonal Tokyo Robatayaki',
    cuisineTag: 'Binchotan & Wagyu',
    hours: '12:00 – 23:30',
    seating: '40 Covers · Skyline Hearth',
    tables: ['Hearth Counter 03', 'Skyline Window 08', 'Private Sanctuary Suite', 'Suite Delivery'],
    image: tokyoSumibiImg,
  },

  // 3. SOSEI JAPAN (Kyoto, Japan)
  {
    id: 'rest-japan-arashiyama',
    propertyId: 'sosei-japan',
    propertyName: 'SOSEI JAPAN',
    propertyLocation: 'Kyoto, Japan',
    collectionName: 'SOSEI Nature',
    name: 'Arashiyama Shojin',
    concept: 'Zen Temple Shojin Ryori & Seasonal Kyoto Kaiseki',
    cuisineTag: 'Kyoto Kaiseki',
    hours: '07:30 – 21:30',
    seating: '28 Covers · Bamboo Pavilion',
    tables: ['Moss Garden Engawa 01', 'Tatami Pavilion 03', 'Bamboo Grove Room', 'Pavilion Delivery'],
    image: japanArashiyamaImg,
  },
  {
    id: 'rest-japan-saryo',
    propertyId: 'sosei-japan',
    propertyName: 'SOSEI JAPAN',
    propertyLocation: 'Kyoto, Japan',
    collectionName: 'SOSEI Nature',
    name: 'Saryo Kamo',
    concept: 'Ceremonial Uji Matcha, Artisanal Wagashi & Dashi Broth Bar',
    cuisineTag: 'Tea & Kyoto Craft',
    hours: '09:00 – 19:00',
    seating: '24 Covers · Stone Garden',
    tables: ['Water Basin Table 02', 'Hinoki Alcove 04', 'Garden Veranda 01', 'Pavilion Delivery'],
    image: japanSaryoImg,
  },

  // 4. SOSEI BARCELONA (Barcelona, Spain)
  {
    id: 'rest-barcelona-casamiro',
    propertyId: 'sosei-barcelona',
    propertyName: 'SOSEI BARCELONA',
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
    propertyName: 'SOSEI BARCELONA',
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

  // 5. SOSEI MALDIVES (North Malé Atoll, Maldives)
  {
    id: 'rest-maldives-farumathi',
    propertyId: 'sosei-maldives',
    propertyName: 'SOSEI MALDIVES',
    propertyLocation: 'North Malé Atoll, Maldives',
    collectionName: 'SOSEI Beach Resort',
    name: 'Farumathi Reef Pavilion',
    concept: 'Overwater Maldivian Spice Cuisine & Line-Caught Atoll Seafood',
    cuisineTag: 'Maldivian & Indian Ocean',
    hours: '07:00 – 22:30',
    seating: '42 Covers · Overwater Deck',
    tables: ['Lagoon Edge 01', 'Coral Deck 04', 'Overwater Pier 02', 'In-Villa Delivery'],
    image: maldivesFarumathiImg,
  },
  {
    id: 'rest-maldives-veli',
    propertyId: 'sosei-maldives',
    propertyName: 'SOSEI MALDIVES',
    propertyLocation: 'North Malé Atoll, Maldives',
    collectionName: 'SOSEI Beach Resort',
    name: 'Veli Sandbank Lounge',
    concept: 'Barefoot Lagoon Crudo Bar & Cold-Pressed Island Botanicals',
    cuisineTag: 'Atoll Raw Bar',
    hours: '11:00 – 22:00',
    seating: '28 Covers · Private Sandbank',
    tables: ['Sandbank Daybed 01', 'Shoreline Table 03', 'Sunset Lantern 05', 'In-Villa Delivery'],
    image: maldivesVeliImg,
  },

  // 6. SOSEI SWITZERLAND (Zermatt, Switzerland)
  {
    id: 'rest-switzerland-stube',
    propertyId: 'sosei-switzerland',
    propertyName: 'SOSEI SWITZERLAND',
    propertyLocation: 'Zermatt, Switzerland',
    collectionName: 'SOSEI Ski',
    name: 'Matterhorn Stube',
    concept: 'Valais Alpine Hearth, Aged Gruyère Fondue & Wild Game',
    cuisineTag: 'Swiss Valais Hearth',
    hours: '12:00 – 22:30',
    seating: '46 Covers · Larch Dining Room',
    tables: ['Fireplace Table 01', 'Matterhorn Glass 04', 'Valais Chalet Booth 02', 'Chalet Delivery'],
    image: switzerlandStubeImg,
  },
  {
    id: 'rest-switzerland-firn',
    propertyId: 'sosei-switzerland',
    propertyName: 'SOSEI SWITZERLAND',
    propertyLocation: 'Zermatt, Switzerland',
    collectionName: 'SOSEI Ski',
    name: 'Firn Glacier Terrace',
    concept: 'High-Altitude Alpine Bistro, Foraged Morels & Swiss Cellar',
    cuisineTag: 'High-Altitude Bistro',
    hours: '07:30 – 21:00',
    seating: '38 Covers · Glacier Terrace',
    tables: ['Glacier Sun Deck 02', 'Firepit Table 05', 'Alpine Lounge 01', 'Chalet Delivery'],
    image: switzerlandFirnImg,
  },

  // 7. SOSEI CANADA (Whistler, Canada)
  {
    id: 'rest-canada-cedar',
    propertyId: 'sosei-canada',
    propertyName: 'SOSEI CANADA',
    propertyLocation: 'Whistler, Canada',
    collectionName: 'SOSEI Ski',
    name: 'Cedar & Peak',
    concept: 'Pacific Northwest Cedar-Plank Salmon, Bison & Foraged Woods',
    cuisineTag: 'Pacific Northwest',
    hours: '07:00 – 22:30',
    seating: '50 Covers · Douglas Fir Hall',
    tables: ['Timber Hall 03', 'Forest Window 06', 'Chef Hearth Table', 'Estate Delivery'],
    image: canadaCedarImg,
  },
  {
    id: 'rest-canada-blackcomb',
    propertyId: 'sosei-canada',
    propertyName: 'SOSEI CANADA',
    propertyLocation: 'Whistler, Canada',
    collectionName: 'SOSEI Ski',
    name: 'Blackcomb Hearth',
    concept: 'Coast Mountain Raw Bar, Fogo Island Crab & Okanagan Cellar',
    cuisineTag: 'Coastal Raw Bar & Grill',
    hours: '15:00 – 23:30',
    seating: '32 Covers · Slate Fireside',
    tables: ['Slate Raw Bar 02', 'Fireside Lounge 04', 'Evergreen Alcove 01', 'Estate Delivery'],
    image: canadaBlackcombImg,
  },

  // 8. SOSEI COSTA RICA (Papagayo, Costa Rica)
  {
    id: 'rest-costarica-selva',
    propertyId: 'sosei-costa-rica',
    propertyName: 'SOSEI COSTA RICA',
    propertyLocation: 'Papagayo, Costa Rica',
    collectionName: 'SOSEI Nature',
    name: 'Selva Papagayo',
    concept: 'Rainforest Canopy Cevichería & Wood-Fired Pacific Catch',
    cuisineTag: 'Pacific Ceviche & Grill',
    hours: '11:30 – 22:30',
    seating: '44 Covers · Canopy Deck',
    tables: ['Canopy Treehouse 01', 'Pacific Breeze 04', 'Jungle Ledge 02', 'Villa Delivery'],
    image: costaricaSelvaImg,
  },
  {
    id: 'rest-costarica-nicoya',
    propertyId: 'sosei-costa-rica',
    propertyName: 'SOSEI COSTA RICA',
    propertyLocation: 'Papagayo, Costa Rica',
    collectionName: 'SOSEI Nature',
    name: 'Nicoya Longevity Kitchen',
    concept: 'Blue Zone Ancestral Harvest, Organic Bowls & Single-Origin Cacao',
    cuisineTag: 'Blue Zone Botanical',
    hours: '07:00 – 21:00',
    seating: '36 Covers · Botanical Terrace',
    tables: ['Botanical Garden 02', 'Volcanic Stone 05', 'Morning Sun Deck 01', 'Villa Delivery'],
    image: costaricaNicoyaImg,
  },

  // 9. SOSEI OMAN (Jebel Akhdar, Oman)
  {
    id: 'rest-oman-alhajar',
    propertyId: 'sosei-oman',
    propertyName: 'SOSEI OMAN',
    propertyLocation: 'Jebel Akhdar, Oman',
    collectionName: 'SOSEI Wellness',
    name: 'Al Hajar Cliffside',
    concept: 'Royal Omani Underground Shuwa, Saffron & Mountain Pomegranate',
    cuisineTag: 'Royal Omani Cuisine',
    hours: '07:00 – 22:30',
    seating: '48 Covers · Canyon Edge',
    tables: ['Canyon Rim 01', 'Reflecting Pool 04', 'Royal Majlis Alcove', 'Villa Delivery'],
    image: omanAlhajarImg,
  },
  {
    id: 'rest-oman-wadidamask',
    propertyId: 'sosei-oman',
    propertyName: 'SOSEI OMAN',
    propertyLocation: 'Jebel Akhdar, Oman',
    collectionName: 'SOSEI Wellness',
    name: 'Wadi Damask Lounge',
    concept: 'Warm Mountain Mezze, Frankincense Infusions & Damask Rose Tea',
    cuisineTag: 'Omani Mezze & Botanicals',
    hours: '11:00 – 23:00',
    seating: '34 Covers · Rose Terrace',
    tables: ['Rose Terrace 02', 'Limestone Arch 05', 'Stargazing Deck 01', 'Villa Delivery'],
    image: omanWadidamaskImg,
  },

  // 10. SOSEI EGYPT (Siwa Oasis, Egypt)
  {
    id: 'rest-egypt-amun',
    propertyId: 'sosei-egypt',
    propertyName: 'SOSEI EGYPT',
    propertyLocation: 'Siwa Oasis, Egypt',
    collectionName: 'SOSEI Wellness',
    name: 'Amun Salt Pavilion',
    concept: 'Siwan Kershef Clay-Oven Cuisine, Desert Dates & Oasis Olive Oil',
    cuisineTag: 'Siwan Oasis Heritage',
    hours: '07:30 – 22:30',
    seating: '40 Covers · Salt Lake Terrace',
    tables: ['Salt Lake Ledge 01', 'Beeswax Alcove 03', 'Dune Horizon 02', 'Tent Delivery'],
    image: egyptAmunImg,
  },
  {
    id: 'rest-egypt-palmeraie',
    propertyId: 'sosei-egypt',
    propertyName: 'SOSEI EGYPT',
    propertyLocation: 'Siwa Oasis, Egypt',
    collectionName: 'SOSEI Wellness',
    name: 'Palmeraie Majlis',
    concept: 'Ancient Date-Palm Grove Tagines, Roasted Freekeh & Karkadeh Bar',
    cuisineTag: 'North African Sanctuary',
    hours: '11:00 – 22:00',
    seating: '32 Covers · Palm Colonnade',
    tables: ['Palm Grove Table 02', 'Olive Shade 04', 'Spring Courtyard 01', 'Tent Delivery'],
    image: egyptPalmeraieImg,
  },
];

/**
 * IN-HOUSE GUESTS SYNCHRONIZED WITH PMS ACROSS ALL 10 SOSEI PROPERTIES
 */
export const IN_HOUSE_FNB_GUESTS: FnbGuest[] = [
  // SOSEI BALI
  {
    id: 'gst-bali-01',
    name: 'Maya Wulandari',
    room: 'Cliffside Sanctuary Villa 12',
    propertyId: 'sosei-bali',
    property: 'SOSEI Bali',
    vipTier: 'Sanctuary Patron',
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
    property: 'SOSEI Bali',
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
    property: 'SOSEI Bali',
    vipTier: 'Founding Circle',
    allergies: [],
    dietaryRestrictions: ['None'],
    partySize: 4,
    folioNumber: 'FOL-BLI-101',
    checkIn: 'Oct 13, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Enjoys authentic Balinese spicy preparations and heritage jamu.',
  },

  // SOSEI TOKYO
  {
    id: 'gst-tokyo-01',
    name: 'Julian Vance',
    room: 'Imperial Sanctuary Loft 310',
    propertyId: 'sosei-tokyo',
    property: 'SOSEI Tokyo',
    vipTier: 'Platinum VIP',
    allergies: ['Shellfish', 'Crustaceans'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-TYO-310',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Shellfish allergy. Finfish (tuna, sea bream, wagyu) is safe.',
  },
  {
    id: 'gst-tokyo-02',
    name: 'Haruka Sato',
    room: 'Aoyama Sky Suite 502',
    propertyId: 'sosei-tokyo',
    property: 'SOSEI Tokyo',
    vipTier: 'Diamond Patron',
    allergies: ['Dairy', 'Eggs'],
    dietaryRestrictions: ['Low Dairy'],
    partySize: 1,
    folioNumber: 'FOL-TYO-502',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid butter and egg yolk emulsions.',
  },
  {
    id: 'gst-tokyo-03',
    name: 'Marcus Chen',
    room: 'Tower Residence 801',
    propertyId: 'sosei-tokyo',
    property: 'SOSEI Tokyo',
    vipTier: 'Founding Circle',
    allergies: [],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-TYO-801',
    checkIn: 'Oct 13, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Whisky collector and Edomae sushi connoisseur.',
  },

  // SOSEI JAPAN (KYOTO)
  {
    id: 'gst-japan-01',
    name: 'Kenzo Tanaka',
    room: 'Bamboo Pavilion Ryokan 08',
    propertyId: 'sosei-japan',
    property: 'SOSEI Japan',
    vipTier: 'Founding Circle',
    allergies: ['Dairy', 'Tree Nuts'],
    dietaryRestrictions: ['Organic Only'],
    partySize: 2,
    folioNumber: 'FOL-KYO-008',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Lactose intolerance and walnut/almond sensitivity.',
  },
  {
    id: 'gst-japan-02',
    name: 'Lady Eleanor Vance',
    room: 'Cedar Sanctuary Villa 03',
    propertyId: 'sosei-japan',
    property: 'SOSEI Japan',
    vipTier: 'Platinum VIP',
    allergies: ['Soy', 'Sesame'],
    dietaryRestrictions: ['Vegetarian'],
    partySize: 2,
    folioNumber: 'FOL-KYO-003',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers pure kombu dashi without soy sauce or sesame paste.',
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

  // SOSEI MALDIVES
  {
    id: 'gst-mle-01',
    name: 'Martin Fuentes',
    room: 'Overwater Grand Villa 108',
    propertyId: 'sosei-maldives',
    property: 'SOSEI Maldives',
    vipTier: 'Founding Circle',
    allergies: ['Shellfish', 'Peanuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-MLE-108',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Enjoys reef finfish (tuna, snapper) but allergic to lobster/crab and peanuts.',
  },
  {
    id: 'gst-mle-02',
    name: 'John Anderson',
    room: 'Sunset Water Villa 102',
    propertyId: 'sosei-maldives',
    property: 'SOSEI Maldives',
    vipTier: 'Gold VIP',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Low Dairy'],
    partySize: 1,
    folioNumber: 'FOL-MLE-102',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Prefers coconut-based curries and clarified preparations.',
  },

  // SOSEI SWITZERLAND
  {
    id: 'gst-che-01',
    name: 'Sal Zanjabila',
    room: 'Matterhorn Penthouse 401',
    propertyId: 'sosei-switzerland',
    property: 'SOSEI Switzerland',
    vipTier: 'Platinum VIP',
    allergies: ['Peanuts', 'Tree Nuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-ZMT-401',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Matterhorn view table preferred. Allergic to hazelnuts, walnuts, and peanuts.',
  },
  {
    id: 'gst-che-02',
    name: 'Baron Lukas von Berg',
    room: 'Glacier Chalet 201',
    propertyId: 'sosei-switzerland',
    property: 'SOSEI Switzerland',
    vipTier: 'Founding Circle',
    allergies: ['Gluten'],
    dietaryRestrictions: ['None'],
    partySize: 3,
    folioNumber: 'FOL-ZMT-201',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Serve fondue with steamed alpine potatoes instead of wheat bread.',
  },

  // SOSEI CANADA
  {
    id: 'gst-can-01',
    name: 'Henrik Lindqvist',
    room: 'Olympic Peak Estate 104',
    propertyId: 'sosei-canada',
    property: 'SOSEI Canada',
    vipTier: 'Sanctuary Elite',
    allergies: ['Shellfish', 'Tree Nuts'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-WHS-104',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to crab/oysters and pecans.',
  },
  {
    id: 'gst-can-02',
    name: 'Camille Laurent',
    room: 'Blackcomb Pine Suite 302',
    propertyId: 'sosei-canada',
    property: 'SOSEI Canada',
    vipTier: 'Platinum VIP',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Dairy-Free'],
    partySize: 2,
    folioNumber: 'FOL-WHS-302',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Dairy-free cedar-plank preparations requested.',
  },

  // SOSEI COSTA RICA
  {
    id: 'gst-cri-01',
    name: 'Lord Sterling',
    room: 'Rainforest Canopy Villa 14',
    propertyId: 'sosei-costa-rica',
    property: 'SOSEI Costa Rica',
    vipTier: 'Founding Circle',
    allergies: ['Tree Nuts', 'Eggs'],
    dietaryRestrictions: ['Low Sodium'],
    partySize: 2,
    folioNumber: 'FOL-CRI-014',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to cashews and egg whites.',
  },
  {
    id: 'gst-cri-02',
    name: 'Elena Rostova',
    room: 'Papagayo Cliff Villa 07',
    propertyId: 'sosei-costa-rica',
    property: 'SOSEI Costa Rica',
    vipTier: 'VVIP Tier 1',
    allergies: ['Gluten', 'Shellfish'],
    dietaryRestrictions: ['Clean Organic'],
    partySize: 1,
    folioNumber: 'FOL-CRI-007',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Prefers finfish ceviche and Nicoya longevity bowls.',
  },

  // SOSEI OMAN
  {
    id: 'gst-omn-01',
    name: 'David Rothschild',
    room: 'Canyon Ridge Sanctuary 09',
    propertyId: 'sosei-oman',
    property: 'SOSEI Oman',
    vipTier: 'Platinum VIP',
    allergies: ['Tree Nuts', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-OMN-009',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to walnuts, pistachios, pine nuts, and sesame tahini.',
  },
  {
    id: 'gst-omn-02',
    name: 'Amira Al-Sayed',
    room: 'Jebel Cliff Villa 02',
    propertyId: 'sosei-oman',
    property: 'SOSEI Oman',
    vipTier: 'Founding Circle',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Halal'],
    partySize: 3,
    folioNumber: 'FOL-OMN-002',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers traditional Omani shuwa without dairy ghee.',
  },

  // SOSEI EGYPT
  {
    id: 'gst-egy-01',
    name: 'Sheikh Tariq Al-Mansoor',
    room: 'Desert Mineral Royal Tent 01',
    propertyId: 'sosei-egypt',
    property: 'SOSEI Egypt',
    vipTier: 'Royal Patron',
    allergies: ['Shellfish', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-EGY-001',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid sesame tahini and crustaceans. Enjoys clay-oven Siwan duck.',
  },
  {
    id: 'gst-egy-02',
    name: 'Sophia Lorenzi',
    room: 'Siwa Palm Pavilion 05',
    propertyId: 'sosei-egypt',
    property: 'SOSEI Egypt',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten', 'Tree Nuts'],
    dietaryRestrictions: ['Mediterranean'],
    partySize: 2,
    folioNumber: 'FOL-EGY-005',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-tokyo',
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
    propertyId: 'sosei-japan',
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
    propertyId: 'sosei-japan',
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
    propertyId: 'sosei-japan',
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
    propertyId: 'sosei-japan',
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
    propertyId: 'sosei-japan',
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
    propertyId: 'sosei-maldives',
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
    propertyId: 'sosei-maldives',
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
    propertyId: 'sosei-maldives',
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
    propertyId: 'sosei-maldives',
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
    propertyId: 'sosei-maldives',
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
    propertyId: 'sosei-switzerland',
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
    propertyId: 'sosei-switzerland',
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
    propertyId: 'sosei-switzerland',
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
    propertyId: 'sosei-switzerland',
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
    propertyId: 'sosei-switzerland',
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
    propertyId: 'sosei-canada',
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
    propertyId: 'sosei-canada',
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
    propertyId: 'sosei-canada',
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
    propertyId: 'sosei-canada',
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
    propertyId: 'sosei-canada',
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
    propertyId: 'sosei-costa-rica',
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
    propertyId: 'sosei-costa-rica',
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
    propertyId: 'sosei-costa-rica',
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
    propertyId: 'sosei-costa-rica',
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
    propertyId: 'sosei-costa-rica',
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
    propertyId: 'sosei-oman',
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
    propertyId: 'sosei-oman',
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
    propertyId: 'sosei-oman',
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
    propertyId: 'sosei-oman',
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
    propertyId: 'sosei-oman',
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
    propertyId: 'sosei-egypt',
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
    propertyId: 'sosei-egypt',
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
    propertyId: 'sosei-egypt',
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
    propertyId: 'sosei-egypt',
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
    propertyId: 'sosei-egypt',
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
