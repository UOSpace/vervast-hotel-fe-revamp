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
  // 1. SOSEI Courchevel (Courchevel, France)
  {
    id: 'rest-andermatt-stube',
    propertyId: 'sosei-courchevel',
    propertyName: 'SOSEI Courchevel',
    propertyLocation: 'Courchevel, France',
    collectionName: 'SOSEI Ski',
    name: 'Le Chabichou Savoie',
    concept: 'French Haute Gastronomie, Beaufort d’Alpage & Black Périgord Truffle',
    cuisineTag: 'French Haute Gastronomie',
    hours: '12:00 – 22:30',
    seating: '46 Covers · Salon Savoyard',
    tables: ['Cheminée Table 01', 'Bellecôte Glass 04', 'Salon Privé Savoie 02', 'Chalet Delivery'],
    image: switzerlandStubeImg,
  },
  {
    id: 'rest-andermatt-firn',
    propertyId: 'sosei-courchevel',
    propertyName: 'SOSEI Courchevel',
    propertyLocation: 'Courchevel, France',
    collectionName: 'SOSEI Ski',
    name: 'L’Alpage des Neiges',
    concept: 'Savoyard Alpine Bistro, Brittany Blue Lobster Thermidor & Grand Cru Cellar',
    cuisineTag: 'French Alpine Bistro',
    hours: '07:30 – 21:00',
    seating: '38 Covers · Courchevel 1850 Terrace',
    tables: ['Saulire Sun Deck 02', 'Brasero Table 05', 'Salon Alpin 01', 'Chalet Delivery'],
    image: switzerlandFirnImg,
  },

  // 2. SOSEI Amalfi (Amalfi, Italy)
  {
    id: 'rest-umbria-arashiyama',
    propertyId: 'sosei-amalfi',
    propertyName: 'SOSEI Amalfi',
    propertyLocation: 'Amalfi, Italy',
    collectionName: 'SOSEI Beach Resort',
    name: 'Terrazza dei Limoni',
    concept: 'Amalfi Cliffside Crudo, Gragnano Artisanal Pasta & Alba Truffle Table',
    cuisineTag: 'Amalfi Coastal Gastronomy',
    hours: '07:30 – 22:30',
    seating: '38 Covers · Tyrrhenian Loggia',
    tables: ['Cliffside Loggia 01', 'Lemon Pergola 03', 'Ravello Terrace', 'Villa Delivery'],
    image: barcelonaCasamiroImg,
  },
  {
    id: 'rest-umbria-saryo',
    propertyId: 'sosei-amalfi',
    propertyName: 'SOSEI Amalfi',
    propertyLocation: 'Amalfi, Italy',
    collectionName: 'SOSEI Beach Resort',
    name: 'Cantina di Positano',
    concept: 'Campania Vintage Wine Cellar, Burrata di Bufala & Wood-Fired Tyrrhenian Catch',
    cuisineTag: 'Italian Cellar & Crudo',
    hours: '12:00 – 23:00',
    seating: '28 Covers · Vaulted Stone Cellar',
    tables: ['Cellar Stone Table 02', 'Vault Alcove 04', 'Sea Breeze Veranda 01', 'Villa Delivery'],
    image: barcelonaBodegaImg,
  },

  // 3. SOSEI Los Cabos (Los Cabos, Mexico)
  {
    id: 'rest-melides-cedar',
    propertyId: 'sosei-los-cabos',
    propertyName: 'SOSEI Los Cabos',
    propertyLocation: 'Los Cabos, Mexico',
    collectionName: 'SOSEI Beach Resort',
    name: 'Manta Cortés Grill',
    concept: 'Sea of Cortez Mesquite-Fired Catch, Baja Aguachile & Mezcal Cellar',
    cuisineTag: 'Baja Coastal Grill',
    hours: '07:00 – 22:30',
    seating: '50 Covers · Ocean Cliff Hall',
    tables: ['Cortez Ledge 03', 'Agave Terrace 06', 'Chef Parilla Table', 'Casita Delivery'],
    image: canadaCedarImg,
  },
  {
    id: 'rest-melides-blackcomb',
    propertyId: 'sosei-los-cabos',
    propertyName: 'SOSEI Los Cabos',
    propertyLocation: 'Los Cabos, Mexico',
    collectionName: 'SOSEI Beach Resort',
    name: 'Copal Crudo & Agave Bar',
    concept: 'Pacific Raw Bar, Baja Chocolata Clams & Ancestral Sotol Infusions',
    cuisineTag: 'Pacific Raw Bar & Mezcal',
    hours: '15:00 – 23:30',
    seating: '32 Covers · Desert Fireside',
    tables: ['Raw Bar Counter 02', 'Fireside Lounge 04', 'Cardón Alcove 01', 'Casita Delivery'],
    image: canadaBlackcombImg,
  },

  // 4. SOSEI Muscat (Muscat, Oman)
  {
    id: 'rest-tinos-shinju',
    propertyId: 'sosei-muscat',
    propertyName: 'SOSEI Muscat',
    propertyLocation: 'Muscat, Oman',
    collectionName: 'SOSEI Beach Resort',
    name: 'Al-Bustan Cliff Pavilion',
    concept: 'Royal Omani Underground Lamb Shuwa, Saffron Qabuli & Gulf Lobster',
    cuisineTag: 'Royal Omani Gastronomy',
    hours: '12:00 – 23:00',
    seating: '44 Covers · Gulf Cliff Pavilion',
    tables: ['Gulf Arch 01', 'Hajar Terrace 05', 'Royal Majlis Suite', 'Villa Delivery'],
    image: omanAlhajarImg,
  },
  {
    id: 'rest-tinos-sumibi',
    propertyId: 'sosei-muscat',
    propertyName: 'SOSEI Muscat',
    propertyLocation: 'Muscat, Oman',
    collectionName: 'SOSEI Beach Resort',
    name: 'Wadi Damask Terrace',
    concept: 'Jebel Akhdar Pomegranate Mezze, Black Lime Kingfish & Hojari Frankincense',
    cuisineTag: 'Arabian Sea & Mountain Mezze',
    hours: '12:00 – 23:30',
    seating: '38 Covers · Stone Canyon Terrace',
    tables: ['Canyon Ledge 03', 'Oman Horizon 08', 'Frankincense Alcove', 'Villa Delivery'],
    image: omanWadidamaskImg,
  },

  // 5. SOSEI Geneva (Geneva, Switzerland)
  {
    id: 'rest-barcelona-casamiro',
    propertyId: 'sosei-geneva',
    propertyName: 'SOSEI Geneva',
    propertyLocation: 'Geneva, Switzerland',
    collectionName: 'SOSEI Urban',
    name: 'Le Rivage du Léman',
    concept: 'Lake Geneva Perch Filets, Aged Gruyère AOP & Swiss Grand Cru Gastronomy',
    cuisineTag: 'Swiss Haute Cuisine',
    hours: '12:00 – 23:30',
    seating: '52 Covers · Lakefront Salon',
    tables: ['Léman Window 04', 'Mont-Blanc Terrace 07', 'Salon Horloger Private', 'Suite Delivery'],
    image: switzerlandStubeImg,
  },
  {
    id: 'rest-barcelona-bodega',
    propertyId: 'sosei-geneva',
    propertyName: 'SOSEI Geneva',
    propertyLocation: 'Geneva, Switzerland',
    collectionName: 'SOSEI Urban',
    name: 'Caveau de Lavaux',
    concept: 'UNESCO Lavaux Chasselas Cellar, Valais Artisanal Charcuterie & Alpine Fondue',
    cuisineTag: 'Swiss Wine Cellar & Bistro',
    hours: '16:00 – 00:30',
    seating: '34 Covers · Limestone Vault',
    tables: ['Oak Cask Table 02', 'Sommelier Counter 05', 'Vault Alcove 01', 'Suite Delivery'],
    image: switzerlandFirnImg,
  },

  // 6. SOSEI Marrakech (Marrakech, Morocco)
  {
    id: 'rest-elgouna-amun',
    propertyId: 'sosei-marrakech',
    propertyName: 'SOSEI Marrakech',
    propertyLocation: 'Marrakech, Morocco',
    collectionName: 'SOSEI Urban',
    name: 'Dar Al-Atlas Riad Table',
    concept: 'Royal Moroccan Saffron Tagines, Atlas Mountain Lamb & Preserved Lemon',
    cuisineTag: 'Royal Moroccan Gastronomy',
    hours: '07:30 – 22:30',
    seating: '40 Covers · Riad Courtyard',
    tables: ['Zellige Courtyard 01', 'Orange Blossom Alcove 03', 'Atlas Roof 02', 'Riad Delivery'],
    image: egyptAmunImg,
  },
  {
    id: 'rest-elgouna-palmeraie',
    propertyId: 'sosei-marrakech',
    propertyName: 'SOSEI Marrakech',
    propertyLocation: 'Marrakech, Morocco',
    collectionName: 'SOSEI Urban',
    name: 'Palmeraie Kasbah Majlis',
    concept: 'Clay-Oven Duck with Medjool Dates, Argan Dukkah Mezze & Mint Tea Salon',
    cuisineTag: 'Moroccan Clay-Oven & Mezze',
    hours: '11:00 – 22:30',
    seating: '32 Covers · Palm Colonnade',
    tables: ['Palm Grove Table 02', 'Olive Shade 04', 'Kasbah Lantern 01', 'Riad Delivery'],
    image: egyptPalmeraieImg,
  },

  // 7. SOSEI Patagonia (Torres del Paine, Chile)
  {
    id: 'rest-osa-selva',
    propertyId: 'sosei-patagonia',
    propertyName: 'SOSEI Patagonia',
    propertyLocation: 'Torres del Paine, Chile',
    collectionName: 'SOSEI Nature',
    name: 'Fogón del Paine',
    concept: 'Patagonian Lenga-Wood Asado, Austral Toothfish & Southern Fjord Ceviche',
    cuisineTag: 'Patagonian Fire & Fjord',
    hours: '11:30 – 22:30',
    seating: '44 Covers · Granite Peak Deck',
    tables: ['Cuernos View 01', 'Lenga Hearth 04', 'Glacier Ledge 02', 'Estancia Delivery'],
    image: costaricaSelvaImg,
  },
  {
    id: 'rest-osa-nicoya',
    propertyId: 'sosei-patagonia',
    propertyName: 'SOSEI Patagonia',
    propertyLocation: 'Torres del Paine, Chile',
    collectionName: 'SOSEI Nature',
    name: 'Estancia Austral Botanical',
    concept: 'Andean Ancestral Harvest, Calafate Berry Elixirs & Organic Pampa Bowls',
    cuisineTag: 'Andean Botanical Kitchen',
    hours: '07:00 – 21:00',
    seating: '36 Covers · Steppe Conservatory',
    tables: ['Conservatory 02', 'Granite Stone 05', 'Condor Sun Deck 01', 'Estancia Delivery'],
    image: costaricaNicoyaImg,
  },

  // 8. SOSEI Kyoto (Kyoto, Japan)
  {
    id: 'rest-bali-wantilan',
    propertyId: 'sosei-kyoto',
    propertyName: 'SOSEI Kyoto',
    propertyLocation: 'Kyoto, Japan',
    collectionName: 'SOSEI Wellness',
    name: 'Arashiyama Kaiseki Pavilion',
    concept: 'Seasonal Kyoto Ryotei Kaiseki, Matsutake Dashi & Binchotan Kuroge Wagyu',
    cuisineTag: 'Kyoto Haute Kaiseki',
    hours: '07:30 – 22:00',
    seating: '36 Covers · Katsura River Pavilion',
    tables: ['Katsura Veranda 01', 'Maple Tatami 04', 'Hinoki Counter 02', 'Ryokan Delivery'],
    image: japanArashiyamaImg,
  },
  {
    id: 'rest-bali-karang',
    propertyId: 'sosei-kyoto',
    propertyName: 'SOSEI Kyoto',
    propertyLocation: 'Kyoto, Japan',
    collectionName: 'SOSEI Wellness',
    name: 'Saryo Zen & Tea Sanctuary',
    concept: 'Zen Temple Shojin Ryori, Fresh Kyoto Yuba & First-Harvest Uji Matcha',
    cuisineTag: 'Shojin Ryori & Uji Tea',
    hours: '09:00 – 21:30',
    seating: '28 Covers · Bamboo Moss Garden',
    tables: ['Bamboo Terrace 02', 'Moss Garden Ledge 05', 'Chashitsu Alcove 01', 'Ryokan Delivery'],
    image: japanSaryoImg,
  },

  // 9. SOSEI AlUla (AlUla, Saudi Arabia)
  {
    id: 'rest-auh-alhajar',
    propertyId: 'sosei-alula',
    propertyName: 'SOSEI AlUla',
    propertyLocation: 'AlUla, Saudi Arabia',
    collectionName: 'SOSEI Wellness',
    name: 'Hegra Sandstone Pavilion',
    concept: 'Nabataean Oasis Gastronomy, Hejazi Spiced Lamb & Red Sea Lobster',
    cuisineTag: 'Nabataean & Hejazi Cuisine',
    hours: '07:00 – 22:30',
    seating: '48 Covers · Canyon Monolith Edge',
    tables: ['Monolith Rim 01', 'Oasis Pool 04', 'Royal Incense Majlis', 'Tent Villa Delivery'],
    image: omanAlhajarImg,
  },
  {
    id: 'rest-auh-wadidamask',
    propertyId: 'sosei-alula',
    propertyName: 'SOSEI AlUla',
    propertyLocation: 'AlUla, Saudi Arabia',
    collectionName: 'SOSEI Wellness',
    name: 'Ashar Stargazing Lounge',
    concept: 'Warm Levantine Mezze, AlUla Citrus Groves & Desert Botanical Elixirs',
    cuisineTag: 'Desert Oasis Mezze & Elixirs',
    hours: '11:00 – 23:00',
    seating: '34 Covers · Ashar Valley Deck',
    tables: ['Sandstone Arch 02', 'Desert Firepit 05', 'Stargazing Deck 01', 'Tent Villa Delivery'],
    image: omanWadidamaskImg,
  },

  // 10. SOSEI Niseko (Niseko, Japan)
  {
    id: 'rest-niseko-shirakaba',
    propertyId: 'sosei-niseko',
    propertyName: 'SOSEI Niseko',
    propertyLocation: 'Niseko, Japan',
    collectionName: 'SOSEI Ski',
    name: 'Shirakaba Robata & Sushi',
    concept: 'Hokkaido King Crab, Edomae Uni Nigiri & Binchotan Charcoal Hearth',
    cuisineTag: 'Hokkaido Robatayaki & Sushi',
    hours: '12:00 – 23:00',
    seating: '44 Covers · Birch Hearth',
    tables: ['Hinoki Counter 01', 'Yotei View 04', 'Birch Booth 02', 'Chalet Delivery'],
    image: tokyoSumibiImg,
  },

  // 11. SOSEI Aspen (Aspen, United States)
  {
    id: 'rest-aspen-elk',
    propertyId: 'sosei-aspen',
    propertyName: 'SOSEI Aspen',
    propertyLocation: 'Aspen, United States',
    collectionName: 'SOSEI Ski',
    name: 'Elk Horn Chophouse',
    concept: 'Rocky Mountain Dry-Aged Wagyu, Colorado Elk & Reserve Napa Cellar',
    cuisineTag: 'Rocky Mountain Chophouse',
    hours: '12:00 – 23:00',
    seating: '48 Covers · Timber Lodge',
    tables: ['Hearth Table 01', 'Ajax View 03', 'Cellar Booth 02', 'Chalet Delivery'],
    image: canadaCedarImg,
  },

  // 12. SOSEI Sumba (Sumba, Indonesia)
  {
    id: 'rest-sumba-ombak',
    propertyId: 'sosei-sumba',
    propertyName: 'SOSEI Sumba',
    propertyLocation: 'Sumba, Indonesia',
    collectionName: 'SOSEI Beach Resort',
    name: 'Ombak Nihiwatu Wantilan',
    concept: 'Coconut-Husk Wood-Fired Indian Ocean Lobster, Sate Lilit & Nusantara Spices',
    cuisineTag: 'Nusantara Coastal Grill',
    hours: '07:00 – 22:30',
    seating: '42 Covers · Cliff Pendopo',
    tables: ['Surf Ledge 01', 'Bale Table 03', 'Sunset Deck 02', 'Villa Delivery'],
    image: baliWantilanImg,
  },

  // 13. SOSEI Seychelles (Mahé, Seychelles)
  {
    id: 'rest-seychelles-takamaka',
    propertyId: 'sosei-seychelles',
    propertyName: 'SOSEI Seychelles',
    propertyLocation: 'Mahé, Seychelles',
    collectionName: 'SOSEI Beach Resort',
    name: 'Takamaka Cove Grill',
    concept: 'Indian Ocean Line-Caught Crudo, Spiny Lobster Curry & Creole Botanicals',
    cuisineTag: 'Indian Ocean Crudo & Grill',
    hours: '07:30 – 22:30',
    seating: '44 Covers · Granite Cove',
    tables: ['Granite Cove 01', 'Lagoon Edge 04', 'Palm Veranda 02', 'Villa Delivery'],
    image: baliKarangImg,
  },

  // 14. SOSEI Serengeti (Serengeti, Tanzania)
  {
    id: 'rest-serengeti-kopje',
    propertyId: 'sosei-serengeti',
    propertyName: 'SOSEI Serengeti',
    propertyLocation: 'Serengeti, Tanzania',
    collectionName: 'SOSEI Nature',
    name: 'Kopje Savannah Table',
    concept: 'Open-Fire Acacia Grill, East African Heritage Spices & Bush Boma',
    cuisineTag: 'Savannah Fire & Heritage',
    hours: '06:30 – 22:00',
    seating: '38 Covers · Kopje Deck',
    tables: ['Kopje Horizon 01', 'Acacia Firepit 03', 'Savannah Veranda 02', 'Tent Delivery'],
    image: costaricaSelvaImg,
  },
];

/**
 * IN-HOUSE GUESTS SYNCHRONIZED WITH PMS ACROSS ALL 9 SOSEI PROPERTIES
 */
export const IN_HOUSE_FNB_GUESTS: FnbGuest[] = [
  // SOSEI Kyoto
  {
    id: 'gst-bali-01',
    name: 'Maya Wulandari',
    room: 'Arashiyama Bamboo Ryokan 12',
    propertyId: 'sosei-kyoto',
    property: 'SOSEI Kyoto',
    vipTier: 'Property Patron',
    allergies: ['Peanuts', 'Shellfish'],
    dietaryRestrictions: ['No Pork'],
    partySize: 2,
    folioNumber: 'FOL-KYO-112',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Prefers Kyoto kaiseki dashi without crustaceans. Allergic to peanuts and shellfish.',
  },
  {
    id: 'gst-bali-02',
    name: 'Alexander & Claire Wright',
    room: 'Katsura River Pavilion 04',
    propertyId: 'sosei-kyoto',
    property: 'SOSEI Kyoto',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Celiac Friendly'],
    partySize: 2,
    folioNumber: 'FOL-KYO-104',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Celiac sensitivity. Use pure gluten-free tamari soy only.',
  },
  {
    id: 'gst-bali-03',
    name: 'Raden Baskoro',
    room: 'Higashiyama Residence 01',
    propertyId: 'sosei-kyoto',
    property: 'SOSEI Kyoto',
    vipTier: 'Founding Circle',
    allergies: [],
    dietaryRestrictions: ['None'],
    partySize: 4,
    folioNumber: 'FOL-KYO-101',
    checkIn: 'Oct 13, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Enjoys authentic Kyoto Shojin Ryori and ceremonial Uji matcha.',
  },

  // SOSEI Muscat
  {
    id: 'gst-tinos-01',
    name: 'Julian Vance',
    room: 'Al-Bustan Cliffside Villa 310',
    propertyId: 'sosei-muscat',
    property: 'SOSEI Muscat',
    vipTier: 'Platinum VIP',
    allergies: ['Shellfish', 'Crustaceans'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-MCT-310',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Shellfish allergy. Arabian Sea finfish (kingfish) and Omani lamb shuwa are safe.',
  },
  {
    id: 'gst-tinos-02',
    name: 'Haruka Sato',
    room: 'Gulf of Oman Terrace Suite 502',
    propertyId: 'sosei-muscat',
    property: 'SOSEI Muscat',
    vipTier: 'Diamond Patron',
    allergies: ['Dairy', 'Eggs'],
    dietaryRestrictions: ['Low Dairy'],
    partySize: 1,
    folioNumber: 'FOL-MCT-502',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid clarified ghee and egg yolk emulsions.',
  },

  // SOSEI Amalfi
  {
    id: 'gst-umbria-01',
    name: 'Kenzo Tanaka',
    room: 'Ravello Cliffside Suite 08',
    propertyId: 'sosei-amalfi',
    property: 'SOSEI Amalfi',
    vipTier: 'Founding Circle',
    allergies: ['Dairy', 'Tree Nuts'],
    dietaryRestrictions: ['Organic Only'],
    partySize: 2,
    folioNumber: 'FOL-AML-008',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Lactose intolerance and hazelnut/pine nut sensitivity.',
  },
  {
    id: 'gst-umbria-02',
    name: 'Lady Eleanor Vance',
    room: 'Positano Lemon Grove Villa 03',
    propertyId: 'sosei-amalfi',
    property: 'SOSEI Amalfi',
    vipTier: 'Platinum VIP',
    allergies: ['Soy', 'Sesame'],
    dietaryRestrictions: ['Vegetarian'],
    partySize: 2,
    folioNumber: 'FOL-AML-003',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers pure Campania olive oil and Amalfi Sfusato lemon preparations.',
  },

  // SOSEI Geneva
  {
    id: 'gst-bcn-01',
    name: 'Dr. Elizabeth Hall',
    room: 'Lac Léman Grand Suite 402',
    propertyId: 'sosei-geneva',
    property: 'SOSEI Geneva',
    vipTier: 'Gold VIP',
    allergies: ['Shellfish', 'Tree Nuts'],
    dietaryRestrictions: ['Mediterranean'],
    partySize: 2,
    folioNumber: 'FOL-GVA-402',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to crustaceans and hazelnuts/pine nuts.',
  },
  {
    id: 'gst-bcn-02',
    name: 'Carlos & Sofia Mendoza',
    room: 'Mont-Blanc Terrace 205',
    propertyId: 'sosei-geneva',
    property: 'SOSEI Geneva',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Gluten-Free'],
    partySize: 2,
    folioNumber: 'FOL-GVA-205',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Requires gluten-free accompaniments.',
  },

  // SOSEI AlUla
  {
    id: 'gst-auh-01',
    name: 'Martin Fuentes',
    room: 'Hegra Sandstone Canyon Villa 108',
    propertyId: 'sosei-alula',
    property: 'SOSEI AlUla',
    vipTier: 'Founding Circle',
    allergies: ['Shellfish', 'Peanuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-ALU-108',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Enjoys Red Sea coral trout but allergic to lobster/crab and peanuts.',
  },
  {
    id: 'gst-auh-02',
    name: 'David Rothschild',
    room: 'Ashar Valley Oasis Suite 09',
    propertyId: 'sosei-alula',
    property: 'SOSEI AlUla',
    vipTier: 'Platinum VIP',
    allergies: ['Tree Nuts', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-ALU-009',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to walnuts, pistachios, almonds, and sesame tahini.',
  },

  // SOSEI Courchevel
  {
    id: 'gst-and-01',
    name: 'Sal Zanjabila',
    room: 'Courchevel 1850 Penthouse 401',
    propertyId: 'sosei-courchevel',
    property: 'SOSEI Courchevel',
    vipTier: 'Platinum VIP',
    allergies: ['Peanuts', 'Tree Nuts'],
    dietaryRestrictions: ['Pescatarian'],
    partySize: 2,
    folioNumber: 'FOL-CRV-401',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Bellecôte glacier view table preferred. Allergic to hazelnuts, walnuts, and peanuts.',
  },
  {
    id: 'gst-and-02',
    name: 'Baron Lukas von Berg',
    room: 'Bellecôte Chalet 201',
    propertyId: 'sosei-courchevel',
    property: 'SOSEI Courchevel',
    vipTier: 'Founding Circle',
    allergies: ['Gluten'],
    dietaryRestrictions: ['None'],
    partySize: 3,
    folioNumber: 'FOL-CRV-201',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Serve Beaufort d’Alpage fondue with steamed Savoyard potatoes instead of wheat bread.',
  },

  // SOSEI Los Cabos
  {
    id: 'gst-mel-01',
    name: 'Henrik Lindqvist',
    room: 'Cortez Cliff Casita 104',
    propertyId: 'sosei-los-cabos',
    property: 'SOSEI Los Cabos',
    vipTier: 'Property Elite',
    allergies: ['Shellfish', 'Tree Nuts'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-CAB-104',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to crab/oysters and pecans.',
  },
  {
    id: 'gst-mel-02',
    name: 'Camille Laurent',
    room: 'Baja Ocean Suite 302',
    propertyId: 'sosei-los-cabos',
    property: 'SOSEI Los Cabos',
    vipTier: 'Platinum VIP',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Dairy-Free'],
    partySize: 2,
    folioNumber: 'FOL-CAB-302',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Dairy-free mesquite wood-fired preparations requested.',
  },

  // SOSEI Patagonia
  {
    id: 'gst-osa-01',
    name: 'Lord Sterling',
    room: 'Paine Massif Villa 14',
    propertyId: 'sosei-patagonia',
    property: 'SOSEI Patagonia',
    vipTier: 'Founding Circle',
    allergies: ['Tree Nuts', 'Eggs'],
    dietaryRestrictions: ['Low Sodium'],
    partySize: 2,
    folioNumber: 'FOL-PAT-014',
    checkIn: 'Oct 09, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Allergic to cashews and egg whites.',
  },
  {
    id: 'gst-osa-02',
    name: 'Elena Rostova',
    room: 'Grey Glacier Lodge 07',
    propertyId: 'sosei-patagonia',
    property: 'SOSEI Patagonia',
    vipTier: 'VVIP Tier 1',
    allergies: ['Gluten', 'Shellfish'],
    dietaryRestrictions: ['Clean Organic'],
    partySize: 1,
    folioNumber: 'FOL-PAT-007',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Prefers Austral finfish ceviche and Andean botanical bowls.',
  },

  // SOSEI Marrakech
  {
    id: 'gst-elg-01',
    name: 'Sheikh Tariq Al-Mansoor',
    room: 'Royal Palmeraie Riad 01',
    propertyId: 'sosei-marrakech',
    property: 'SOSEI Marrakech',
    vipTier: 'Royal Patron',
    allergies: ['Shellfish', 'Sesame'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-MRK-001',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Avoid sesame tahini and crustaceans. Enjoys clay-oven duck tagine.',
  },
  {
    id: 'gst-elg-02',
    name: 'Sophia Lorenzi',
    room: 'Atlas Garden Pavilion 05',
    propertyId: 'sosei-marrakech',
    property: 'SOSEI Marrakech',
    vipTier: 'Platinum VIP',
    allergies: ['Gluten', 'Tree Nuts'],
    dietaryRestrictions: ['Mediterranean'],
    partySize: 2,
    folioNumber: 'FOL-MRK-005',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Gluten sensitivity (avoid wheat freekeh and khobz flatbread).',
  },

  // SOSEI Niseko
  {
    id: 'gst-nsk-01',
    name: 'Hiroshi & Yumi Watanabe',
    room: 'Annupuri Powder Chalet 02',
    propertyId: 'sosei-niseko',
    property: 'SOSEI Niseko',
    vipTier: 'Founding Circle',
    allergies: ['Shellfish'],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-NSK-002',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers Hokkaido Ezo venison and binchotan robatayaki.',
  },

  // SOSEI Aspen
  {
    id: 'gst-asp-01',
    name: 'Jonathan & Victoria Mercer',
    room: 'Ajax Mountain Penthouse 01',
    propertyId: 'sosei-aspen',
    property: 'SOSEI Aspen',
    vipTier: 'Platinum VIP',
    allergies: ['Tree Nuts'],
    dietaryRestrictions: ['Low Carb'],
    partySize: 2,
    folioNumber: 'FOL-ASP-001',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Enjoys Colorado dry-aged ribeye and Reserve Napa Cabernet.',
  },

  // SOSEI Sumba
  {
    id: 'gst-smb-01',
    name: 'Kartika Wijaya',
    room: 'Nihiwatu Cliff Villa 05',
    propertyId: 'sosei-sumba',
    property: 'SOSEI Sumba',
    vipTier: 'Property Patron',
    allergies: ['Peanuts'],
    dietaryRestrictions: ['Halal'],
    partySize: 2,
    folioNumber: 'FOL-SMB-005',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 18, 2026',
    notes: 'Prefers wood-fired reef fish and fresh turmeric jamu.',
  },

  // SOSEI Seychelles
  {
    id: 'gst-sey-01',
    name: 'Henri & Claire Moreau',
    room: 'Granite Ocean Sanctuary 03',
    propertyId: 'sosei-seychelles',
    property: 'SOSEI Seychelles',
    vipTier: 'Platinum VIP',
    allergies: ['Dairy'],
    dietaryRestrictions: ['Dairy-Free'],
    partySize: 2,
    folioNumber: 'FOL-SEY-003',
    checkIn: 'Oct 11, 2026',
    checkOut: 'Oct 17, 2026',
    notes: 'Prefers Indian Ocean crudo and coconut-lime dressings.',
  },

  // SOSEI Serengeti
  {
    id: 'gst-ser-01',
    name: 'Sir Alistair & Lady Finch',
    room: 'Kopje Royal Safari Tent 01',
    propertyId: 'sosei-serengeti',
    property: 'SOSEI Serengeti',
    vipTier: 'Founding Circle',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Gluten-Free'],
    partySize: 2,
    folioNumber: 'FOL-SER-001',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 16, 2026',
    notes: 'Prefers acacia-grilled tenderloin and private bush sundowner service.',
  },
];

/**
 * REGIONALLY AUTHENTIC MENUS PER SOSEI PROPERTY
 */
export const FNB_MENU_ITEMS: FnbMenuItem[] = [
  // ============================================================================
  // 1. SOSEI Courchevel (Courchevel, France) — French Haute Gastronomie & Savoyard Alpine Cuisine
  // ============================================================================
  {
    id: 'che-01',
    propertyId: 'sosei-courchevel',
    name: 'Caviar Osciètre de Sologne, Omble Chevalier & Pommes Anna',
    category: 'starters',
    categoryLabel: 'Entrées Françaises',
    price: 165,
    image: caviarImg,
    description: 'Royal Sologne Oscietra caviar and smoked Savoyard Arctic char served over crisp buttered Pommes Anna with Normandy Isigny crème fraîche.',
    prepTimeMinutes: 12,
    calories: 310,
    isChefSignature: true,
    dietaryBadges: ['Courchevel 1850 Signature', 'Gluten-Free'],
    ingredients: ['Sologne Oscietra Caviar', 'Lake Geneva Arctic Char', 'Pommes Anna Potatoes', 'Isigny Crème Fraîche (Dairy)', 'Chives'],
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'che-02',
    propertyId: 'sosei-courchevel',
    name: 'Tartelette Feuilletée aux Morilles de Savoie & Vin Jaune',
    category: 'starters',
    categoryLabel: 'Entrées Françaises',
    price: 48,
    image: mushroomTartletImg,
    description: 'Hand-foraged Savoyard alpine morels and girolles glazed in aged Jura Vin Jaune shallot velouté inside crisp French puff pastry.',
    prepTimeMinutes: 15,
    calories: 250,
    dietaryBadges: ['Savoyard Terroir', 'Vegetarian'],
    ingredients: ['Savoyard Morels', 'Girolles', 'French Feuilletage Pastry (Gluten)', 'Beurre d’Échiré (Dairy)', 'Vin Jaune'],
    allergens: ['Gluten', 'Dairy'],
  },
  {
    id: 'che-03',
    propertyId: 'sosei-courchevel',
    name: 'Homard Bleu de Bretagne Thermidor au Champagne',
    category: 'mains',
    categoryLabel: 'Grands Plats de Savoie',
    price: 158,
    image: lobsterThermidorImg,
    description: 'Whole Brittany blue lobster roasted in its shell with aged Beaufort d’Alpage cream, Champagne sabayon, and French tarragon.',
    prepTimeMinutes: 24,
    calories: 540,
    isChefSignature: true,
    dietaryBadges: ['Haute Gastronomie'],
    ingredients: ['Brittany Blue Lobster', 'Beaufort d’Alpage AOP (Dairy)', 'Champagne Reduction', 'Organic Egg Yolk (Eggs)', 'French Tarragon'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Eggs'],
  },
  {
    id: 'che-04',
    propertyId: 'sosei-courchevel',
    name: 'Raviole du Dauphiné, Beaufort d’Alpage & Truffe Noire du Périgord',
    category: 'mains',
    categoryLabel: 'Grands Plats de Savoie',
    price: 98,
    image: taglioliniTruffleImg,
    description: 'Delicate French artisanal pasta folded into 24-month Beaufort d’Alpage emulsion with shaved black Périgord winter truffle.',
    prepTimeMinutes: 16,
    calories: 560,
    isChefSignature: true,
    dietaryBadges: ['Périgord Truffle'],
    ingredients: ['24-Month Beaufort d’Alpage (Dairy)', 'Comté Vieux (Dairy)', 'Périgord Black Truffle', 'Wheat Flour (Gluten)', 'Organic Egg Yolks'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'che-05',
    propertyId: 'sosei-courchevel',
    name: 'Filet de Boeuf Charolais Rossini & Jus Périgueux',
    category: 'mains',
    categoryLabel: 'Grands Plats de Savoie',
    price: 142,
    image: wagyuStriploinImg,
    description: 'Tender French Charolais beef tenderloin seared in clarified butter, accompanied by Ardèche chestnut mousseline and black truffle jus.',
    prepTimeMinutes: 22,
    calories: 590,
    dietaryBadges: ['Gluten-Free'],
    ingredients: ['French Charolais Beef Tenderloin', 'Ardèche Chestnuts (Tree Nuts)', 'Beurre d’Échiré (Dairy)', 'Black Truffle Jus', 'Shallots'],
    allergens: ['Dairy', 'Tree Nuts'],
  },
  {
    id: 'che-06',
    propertyId: 'sosei-courchevel',
    name: 'Soufflé Chaud au Chocolat Valrhona Guanaja 70% & Noisette',
    category: 'desserts',
    categoryLabel: 'Haute Pâtisserie Française',
    price: 34,
    image: chocolateSouffleImg,
    description: 'Baked-to-order French Valrhona Guanaja 70% dark chocolate soufflé with Normandy double cream and toasted hazelnut praline.',
    prepTimeMinutes: 20,
    calories: 480,
    isChefSignature: true,
    dietaryBadges: ['Pâtisserie Signature', 'Vegetarian'],
    ingredients: ['Valrhona Guanaja 70% Chocolate', 'Normandy Double Cream (Dairy)', 'Farm Eggs', 'Toasted Hazelnuts (Tree Nuts)', 'Wheat Flour'],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },

  // ============================================================================
  // 2. SOSEI Kyoto (Kyoto, Japan) — Kyoto Kaiseki, Shojin Ryori & Edomae Sushi
  // ============================================================================
  {
    id: 'japan-01',
    propertyId: 'sosei-kyoto',
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
    id: 'tokyo-01',
    propertyId: 'sosei-kyoto',
    name: 'Hon-Maguro Otoro & Hokkaido Uni Kaiseki Tsukuri (6 pcs)',
    category: 'starters',
    categoryLabel: 'Sakizuke (Kaiseki Starters)',
    price: 135,
    image: dishTokyoNigiriImg,
    description: 'Aged Oma bluefin otoro, chutoro, and Rishiri sea urchin hand-pressed over warm akazu red vinegar shari.',
    prepTimeMinutes: 12,
    calories: 340,
    isChefSignature: true,
    dietaryBadges: ['Kyoto Ryotei', 'Dairy-Free'],
    ingredients: ['Oma Bluefin Tuna', 'Hokkaido Sea Urchin (Uni)', 'Koshihikari Rice', 'Aged Akazu Vinegar', 'Nikiri Soy (Soy, Wheat)', 'Hon-Wasabi'],
    allergens: ['Fish', 'Shellfish', 'Soy', 'Gluten'],
  },
  {
    id: 'japan-02',
    propertyId: 'sosei-kyoto',
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
    propertyId: 'sosei-kyoto',
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
    id: 'tokyo-03',
    propertyId: 'sosei-kyoto',
    name: 'Omi A5 Kuroge Wagyu Binchotan Striploin',
    category: 'mains',
    categoryLabel: 'Shojin & Kaiseki Mains',
    price: 175,
    image: wagyuStriploinImg,
    description: 'Charcoal-seared Shiga Omi A5 wagyu sirloin over Kishu white binchotan, served with aged tamari, grated wasabi, and Kujo negi.',
    prepTimeMinutes: 20,
    calories: 650,
    isChefSignature: true,
    dietaryBadges: ['Binchotan Hearth'],
    ingredients: ['Omi A5 Wagyu Beef', 'Cultured Butter (Dairy)', 'Aged Tamari Soy', 'Kujo Negi Leek', 'Fresh Wasabi'],
    allergens: ['Dairy', 'Soy'],
  },
  {
    id: 'japan-04',
    propertyId: 'sosei-kyoto',
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
    propertyId: 'sosei-kyoto',
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
  // 3. SOSEI Amalfi (Amalfi, Italy) — Coastal Italian Crudo, Pasta & Truffle
  // ============================================================================
  {
    id: 'ita-01',
    propertyId: 'sosei-amalfi',
    name: 'Crudo di Capesante di Positano & Limone Sfusato',
    category: 'starters',
    categoryLabel: 'Antipasti di Mare',
    price: 52,
    image: scallopCrudoImg,
    description: 'Thinly sliced Tyrrhenian sea scallops dressed with Amalfi Sfusato lemon oil, sea fennel, and roasted Piedmont hazelnut crumble.',
    prepTimeMinutes: 10,
    calories: 210,
    isChefSignature: true,
    dietaryBadges: ['Amalfi Signature', 'Gluten-Free'],
    ingredients: ['Tyrrhenian Sea Scallops', 'Sfusato Amalfi Lemon', 'Piedmont Hazelnuts (Tree Nuts)', 'Extra Virgin Olive Oil', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs', 'Tree Nuts'],
  },
  {
    id: 'ita-02',
    propertyId: 'sosei-amalfi',
    name: 'Burrata Campana DOP, Salmone Affumicato & Basilico',
    category: 'starters',
    categoryLabel: 'Antipasti di Mare',
    price: 46,
    image: salmonBurrataImg,
    description: 'Artisanal Campania buffalo burrata paired with citrus-cured salmon, heirloom Vesuvio tomatoes, and cold-pressed basil oil.',
    prepTimeMinutes: 10,
    calories: 360,
    dietaryBadges: ['Gluten-Free'],
    ingredients: ['Campania Burrata DOP (Dairy)', 'Citrus-Cured Salmon', 'Vesuvio Tomatoes', 'Sweet Basil', 'Olive Oil'],
    allergens: ['Dairy', 'Fish'],
  },
  {
    id: 'ita-03',
    propertyId: 'sosei-amalfi',
    name: 'Tagliolini al Tartufo Bianco d’Alba & Parmigiano 36 Mesi',
    category: 'mains',
    categoryLabel: 'Primi & Secondi',
    price: 96,
    image: taglioliniTruffleImg,
    description: 'Hand-cut 40-yolk tagliolini tossed in alpine mountain butter and 36-month Parmigiano Reggiano with shaved white truffle.',
    prepTimeMinutes: 16,
    calories: 550,
    isChefSignature: true,
    dietaryBadges: ['Italian Classic', 'Vegetarian'],
    ingredients: ['White Alba Truffle', 'Parmigiano Reggiano 36M (Dairy)', 'Cultured Butter (Dairy)', 'Durum Wheat Semolina (Gluten)', 'Egg Yolks'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'ita-04',
    propertyId: 'sosei-amalfi',
    name: 'Ravioloni di Granchio Reale & Bisque al Limone d’Amalfi',
    category: 'mains',
    categoryLabel: 'Primi & Secondi',
    price: 78,
    image: crabRavioloniImg,
    description: 'Handmade pasta parcels filled with sweet Mediterranean crab and sheep’s milk ricotta in a roasted shell and lemon thyme bisque.',
    prepTimeMinutes: 18,
    calories: 480,
    dietaryBadges: ['Coastal Pasta'],
    ingredients: ['Mediterranean Crab', 'Sheep Ricotta (Dairy)', 'Durum Wheat Pasta (Gluten)', 'Farm Eggs', 'Amalfi Lemon Zest'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'ita-05',
    propertyId: 'sosei-amalfi',
    name: 'Gnocchi di Patate alle Erbe della Costiera & Pesto di Pinoli',
    category: 'mains',
    categoryLabel: 'Primi & Secondi',
    price: 54,
    image: herbGnocchiImg,
    description: 'Pillow-soft potato gnocchi tossed with San Marzano datterini tomatoes, coastal basil, and toasted Mediterranean pine nuts.',
    prepTimeMinutes: 15,
    calories: 410,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['Potato Gnocchi (Gluten)', 'Coastal Sweet Basil', 'Toasted Pine Nuts (Tree Nuts)', 'San Marzano Tomatoes', 'Olive Oil'],
    allergens: ['Gluten', 'Tree Nuts'],
  },
  {
    id: 'ita-06',
    propertyId: 'sosei-amalfi',
    name: 'Sorbetto al Limone Sfusato d’Amalfi, Arancia Rossa & Pesca',
    category: 'desserts',
    categoryLabel: 'Dolci della Costiera',
    price: 24,
    image: sorbetTrioImg,
    description: 'Chilled artisanal trio of Amalfi Sfusato lemon, Sicilian blood orange, and white vineyard peach sorbets.',
    prepTimeMinutes: 8,
    calories: 140,
    dietaryBadges: ['Vegan', 'Allergen-Free'],
    ingredients: ['Amalfi Sfusato Lemon', 'Sicilian Blood Orange', 'White Vineyard Peach', 'Cane Sugar'],
    allergens: [],
  },

  // ============================================================================
  // 4. SOSEI Geneva (Geneva, Switzerland) — Swiss Lake Geneva & European Gastronomy
  // ============================================================================
  {
    id: 'bcn-01',
    propertyId: 'sosei-geneva',
    name: 'Noix de Saint-Jacques Rôties & Beurre Noisette du Léman',
    category: 'starters',
    categoryLabel: 'Entrées du Lac',
    price: 48,
    image: scallopCrudoImg,
    description: 'Pan-seared sea scallops with roasted hazelnut brown butter, Lavaux Chasselas reduction, and crispy sourdough.',
    prepTimeMinutes: 12,
    calories: 260,
    dietaryBadges: ['Geneva Signature'],
    ingredients: ['Sea Scallops', 'Roasted Hazelnuts (Tree Nuts)', 'Swiss Butter (Dairy)', 'Lavaux White Wine', 'Sourdough Crumb (Gluten)'],
    allergens: ['Shellfish', 'Molluscs', 'Tree Nuts', 'Gluten', 'Dairy'],
  },
  {
    id: 'bcn-02',
    propertyId: 'sosei-geneva',
    name: 'Tarte Fine aux Chanterelles du Jura & Thym Citron',
    category: 'starters',
    categoryLabel: 'Entrées du Lac',
    price: 36,
    image: mushroomTartletImg,
    description: 'Crisp artisanal pastry topped with wild Jura mountain chanterelles, roasted garlic confit, and lemon thyme.',
    prepTimeMinutes: 14,
    calories: 280,
    dietaryBadges: ['Vegan', 'Nut-Free'],
    ingredients: ['Jura Chanterelles', 'Artisanal Wheat Pastry', 'Garlic Confit', 'Extra Virgin Olive Oil', 'Lemon Thyme'],
    allergens: ['Gluten'],
  },
  {
    id: 'bcn-03',
    propertyId: 'sosei-geneva',
    name: 'Riz Vénéré au Homard Bleu & Safran de Mund',
    category: 'mains',
    categoryLabel: 'Plats Principaux',
    price: 128,
    image: dishBarcelonaPaellaImg,
    description: 'Iron-pan heirloom rice simmered in roasted crustacean fumet with blue lobster, red prawns, and Valais Mund saffron aioli.',
    prepTimeMinutes: 26,
    calories: 620,
    isChefSignature: true,
    dietaryBadges: ['Geneva Signature', 'Gluten-Free'],
    ingredients: ['Heirloom Rice', 'Blue Lobster', 'Red Prawns', 'Valais Mund Saffron', 'Garlic Egg Aioli (Eggs)'],
    allergens: ['Shellfish', 'Crustaceans', 'Fish', 'Eggs'],
  },
  {
    id: 'bcn-04',
    propertyId: 'sosei-geneva',
    name: 'Ravioles de Crabe Royal, Gruyère Doux & Voile de Truffe',
    category: 'mains',
    categoryLabel: 'Plats Principaux',
    price: 68,
    image: crabRavioloniImg,
    description: 'Handmade pasta stuffed with sweet king crab and alpine curd, finished with black winter truffle velouté.',
    prepTimeMinutes: 18,
    calories: 490,
    dietaryBadges: ['Lac Léman Classic'],
    ingredients: ['King Crab', 'Swiss Alpine Curd (Dairy)', 'Durum Wheat Pasta', 'Farm Eggs', 'Black Winter Truffle'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'bcn-05',
    propertyId: 'sosei-geneva',
    name: 'Fondant au Chocolat Grand Cru Suisse & Praliné Noisette',
    category: 'desserts',
    categoryLabel: 'Haute Pâtisserie',
    price: 28,
    image: chocolateSouffleImg,
    description: 'Warm Swiss Grand Cru 70% dark chocolate fondant with roasted hazelnut praline and Gruyère double cream gelato.',
    prepTimeMinutes: 18,
    calories: 470,
    isChefSignature: true,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['70% Swiss Dark Chocolate', 'Hazelnuts (Tree Nuts)', 'Farm Eggs', 'Gruyère Cream (Dairy)', 'Wheat Flour'],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },
  {
    id: 'bcn-06',
    propertyId: 'sosei-geneva',
    name: 'Élixir Botanique des Alpes & Chasselas de Lavaux',
    category: 'beverages',
    categoryLabel: 'Caveau & Cocktails',
    price: 26,
    image: botanicalElixirImg,
    description: 'Lavaux white Chasselas infused with alpine verbena, blood orange, wild mountain berries, and sparkling spring water.',
    prepTimeMinutes: 5,
    calories: 130,
    dietaryBadges: ['Vegan', 'Gluten-Free'],
    ingredients: ['Lavaux Chasselas', 'Alpine Verbena', 'Blood Orange', 'Mountain Berries'],
    allergens: [],
  },

  // ============================================================================
  // 5. SOSEI Muscat (Muscat, Oman) — Jebel Akhdar Royal Omani Shuwa & Gulf Seafood
  // ============================================================================
  {
    id: 'omn-01',
    propertyId: 'sosei-muscat',
    name: 'Charred Jebel Cauliflower, Pine Nut Tahini & Pomegranate',
    category: 'starters',
    categoryLabel: 'Mountain & Gulf Mezze',
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
    propertyId: 'sosei-muscat',
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
    propertyId: 'sosei-muscat',
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
    propertyId: 'sosei-muscat',
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
    propertyId: 'sosei-muscat',
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
  // 6. SOSEI AlUla (AlUla, Saudi Arabia) — Nabataean Oasis & Red Sea Gastronomy
  // ============================================================================
  {
    id: 'alu-01',
    propertyId: 'sosei-alula',
    name: 'Ashar Valley Roasted Cauliflower, Tahini & Pistachio Dukkah',
    category: 'starters',
    categoryLabel: 'Oasis Mezze & Crudo',
    price: 42,
    image: cauliflowerSteakImg,
    description: 'Wood-roasted cauliflower basted in AlUla moringa oil with artisanal sesame tahini, pomegranate, and toasted pistachio dukkah.',
    prepTimeMinutes: 15,
    calories: 310,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Roasted Cauliflower', 'Sesame Tahini', 'Pistachios & Walnuts (Tree Nuts)', 'Pomegranate', 'Wild Za’atar'],
    allergens: ['Sesame', 'Tree Nuts'],
  },
  {
    id: 'mle-01',
    propertyId: 'sosei-alula',
    name: 'Red Sea Scallop Crudo & AlUla Jaffa Citrus Oil',
    category: 'starters',
    categoryLabel: 'Oasis Mezze & Crudo',
    price: 54,
    image: scallopCrudoImg,
    description: 'Chilled Red Sea scallops dressed with AlUla sweet orange blossom citrus, young coconut water reduction, and coriander oil.',
    prepTimeMinutes: 10,
    calories: 165,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free', 'Halal'],
    ingredients: ['Red Sea Scallops', 'AlUla Citrus', 'Cold-Pressed Olive Oil', 'Coriander Blossom', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'alu-02',
    propertyId: 'sosei-alula',
    name: 'Hegra Underground Slow-Roasted Lamb & Saffron Kabsa Rice',
    category: 'mains',
    categoryLabel: 'Nabataean Hearth Mains',
    price: 104,
    image: dishOmanShuwaImg,
    description: '18-hour sandstone pit-roasted Najdi lamb shoulder with black lime kabsa spices, saffron basmati rice, and toasted almonds.',
    prepTimeMinutes: 22,
    calories: 640,
    isChefSignature: true,
    dietaryBadges: ['AlUla Signature', 'Halal', 'Gluten-Free'],
    ingredients: ['Najdi Lamb Shoulder', 'Hejazi Kabsa Spices', 'Saffron Basmati Rice', 'Toasted Almonds (Tree Nuts)', 'Clarified Ghee (Dairy)'],
    allergens: ['Tree Nuts', 'Dairy'],
  },
  {
    id: 'mle-03',
    propertyId: 'sosei-alula',
    name: 'Red Sea Spiny Lobster Charcoal Grill & Saffron Butter',
    category: 'mains',
    categoryLabel: 'Nabataean Hearth Mains',
    price: 142,
    image: lobsterThermidorImg,
    description: 'Whole Red Sea spiny lobster grilled over tamarisk embers, glazed with saffron clarified butter, cardamon, and AlUla lime.',
    prepTimeMinutes: 24,
    calories: 560,
    isChefSignature: true,
    dietaryBadges: ['Red Sea Catch', 'Gluten-Free', 'Halal'],
    ingredients: ['Red Sea Spiny Lobster', 'Saffron Clarified Ghee (Dairy)', 'Cardamom', 'AlUla Lime', 'Fresh Herbs'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy'],
  },
  {
    id: 'mle-04',
    propertyId: 'sosei-alula',
    name: 'Line-Caught Red Sea Najil (Coral Trout) & Black Lime',
    category: 'mains',
    categoryLabel: 'Nabataean Hearth Mains',
    price: 82,
    image: toothfishImg,
    description: 'Sustainably hand-lined Red Sea coral trout basted in dried black lime, sumac, and wild desert honey.',
    prepTimeMinutes: 20,
    calories: 410,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free', 'Halal'],
    ingredients: ['Red Sea Coral Trout', 'Dried Black Lime', 'Sumac', 'Desert Honey', 'Olive Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'mle-05',
    propertyId: 'sosei-alula',
    name: 'AlUla Blood Orange, Oasis Fig & Pomegranate Sorbet',
    category: 'desserts',
    categoryLabel: 'Oasis Desserts & Elixirs',
    price: 24,
    image: sorbetTrioImg,
    description: 'Chilled trio of house-churned AlUla orchard blood orange, desert fig, and pomegranate sorbets.',
    prepTimeMinutes: 8,
    calories: 145,
    dietaryBadges: ['Vegan', 'Allergen-Free', 'Halal'],
    ingredients: ['AlUla Blood Orange', 'Desert Fig', 'Pomegranate', 'Cane Sugar'],
    allergens: [],
  },

  // ============================================================================
  // 7. SOSEI Los Cabos (Los Cabos, Mexico) — Baja Coastal Grill & Sea of Cortez
  // ============================================================================
  {
    id: 'can-01',
    propertyId: 'sosei-los-cabos',
    name: 'Baja Smoked Yellowtail, Burrata & Hibiscus Aguachile',
    category: 'starters',
    categoryLabel: 'Crudo & Entradas Baja',
    price: 44,
    image: salmonBurrataImg,
    description: 'Mesquite-kissed Sea of Cortez yellowtail and creamy artisan burrata with hibiscus flower aguachile and micro cilantro.',
    prepTimeMinutes: 10,
    calories: 380,
    isChefSignature: true,
    dietaryBadges: ['Cortez Catch', 'Gluten-Free'],
    ingredients: ['Sea of Cortez Yellowtail', 'Artisan Burrata (Dairy)', 'Hibiscus Reduction', 'Lime', 'Micro Cilantro'],
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'can-02',
    propertyId: 'sosei-los-cabos',
    name: 'Oaxacan Huitlacoche & Wild Mushroom Tlayuda Tartlet',
    category: 'starters',
    categoryLabel: 'Crudo & Entradas Baja',
    price: 38,
    image: mushroomTartletImg,
    description: 'Foraged mountain mushrooms and black corn truffle roasted with epazote and shallots in a crisp pastry shell.',
    prepTimeMinutes: 15,
    calories: 240,
    dietaryBadges: ['Vegan', 'Nut-Free'],
    ingredients: ['Wild Mushrooms', 'Huitlacoche', 'Artisanal Wheat Pastry (Gluten)', 'Shallots', 'Epazote'],
    allergens: ['Gluten'],
  },
  {
    id: 'can-03',
    propertyId: 'sosei-los-cabos',
    name: 'Sonoran Prime Ribeye Striploin over Mesquite Embers',
    category: 'mains',
    categoryLabel: 'Parilla & Mariscos',
    price: 125,
    image: wagyuStriploinImg,
    description: 'Dry-aged Sonoran striploin grilled over desert mesquite wood, served with smoked bone marrow butter and charred cebolla.',
    prepTimeMinutes: 22,
    calories: 610,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Nut-Free'],
    ingredients: ['Sonoran Prime Striploin', 'Cultured Butter (Dairy)', 'Roasted Bone Marrow', 'Spring Onion', 'Sea Salt'],
    allergens: ['Dairy'],
  },
  {
    id: 'can-04',
    propertyId: 'sosei-los-cabos',
    name: 'Ensenada Crab & Epazote Ricotta Ravioloni',
    category: 'mains',
    categoryLabel: 'Parilla & Mariscos',
    price: 72,
    image: crabRavioloniImg,
    description: 'Handmade pasta parcels filled with sweet Baja rock crab and queso fresco ricotta in a roasted guajillo shell bisque.',
    prepTimeMinutes: 18,
    calories: 470,
    dietaryBadges: ['Baja Coastal'],
    ingredients: ['Baja Rock Crab', 'Ricotta & Queso Fresco (Dairy)', 'Durum Wheat (Gluten)', 'Farm Eggs', 'Guajillo Bisque'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'can-05',
    propertyId: 'sosei-los-cabos',
    name: 'Damiana, Prickly Pear & Smoked Agave Botanical Elixir',
    category: 'beverages',
    categoryLabel: 'Agave & Botanicals',
    price: 24,
    image: botanicalElixirImg,
    description: 'Cold-pressed Baja red prickly pear, wild damiana herb, rosemary smoke, and sparkling mineral water.',
    prepTimeMinutes: 5,
    calories: 75,
    dietaryBadges: ['Non-Alcoholic', 'Vegan'],
    ingredients: ['Red Prickly Pear (Tuna)', 'Baja Damiana Herb', 'Rosemary', 'Sparkling Mineral Water'],
    allergens: [],
  },

  // ============================================================================
  // 8. SOSEI Patagonia (Torres del Paine, Chile) — Patagonian Asado & Fjord Cuisine
  // ============================================================================
  {
    id: 'cri-01',
    propertyId: 'sosei-patagonia',
    name: 'Austral Fjord Scallop & Calafate Citrus Ceviche',
    category: 'starters',
    categoryLabel: 'Cevichería Austral',
    price: 42,
    image: scallopCrudoImg,
    description: 'Magellanic fjord scallops and Austral hake cured in lime leche de tigre, Patagonian calafate berry, and micro cilantro.',
    prepTimeMinutes: 12,
    calories: 190,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Magellanic Fjord Scallops', 'Austral Hake', 'Lime', 'Calafate Berry', 'Cilantro'],
    allergens: ['Fish', 'Shellfish', 'Molluscs'],
  },
  {
    id: 'cri-02',
    propertyId: 'sosei-patagonia',
    name: 'Andean Quinoa, Hass Avocado & Steppe Harvest Bowl',
    category: 'mains',
    categoryLabel: 'Cocina de la Patagonia',
    price: 36,
    image: zenGardenBowlImg,
    description: 'Heirloom Andean quinoa, Hass avocado, roasted squash, organic greens, and toasted cashew merquén crema.',
    prepTimeMinutes: 12,
    calories: 380,
    isChefSignature: true,
    dietaryBadges: ['Andean Vegan', 'Gluten-Free'],
    ingredients: ['Andean Quinoa', 'Hass Avocado', 'Roasted Squash', 'Roasted Cashews (Tree Nuts)', 'Smoked Merquén'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'cri-03',
    propertyId: 'sosei-patagonia',
    name: 'Chiloé Native Potato Gnocchi & Wild Herb Pesto',
    category: 'mains',
    categoryLabel: 'Cocina de la Patagonia',
    price: 44,
    image: herbGnocchiImg,
    description: 'Hand-rolled Chiloé heirloom potato gnocchi tossed in roasted cherry tomato passata and Patagonian herb cashew pesto.',
    prepTimeMinutes: 15,
    calories: 390,
    dietaryBadges: ['Gluten-Free', 'Vegan'],
    ingredients: ['Chiloé Native Potatoes', 'Sweet Basil', 'Roasted Cashews (Tree Nuts)', 'Heirloom Tomatoes', 'Olive Oil'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'cri-04',
    propertyId: 'sosei-patagonia',
    name: 'Lenga-Wood Grilled Patagonian Toothfish (Bacalao Austral)',
    category: 'mains',
    categoryLabel: 'Cocina de la Patagonia',
    price: 94,
    image: toothfishImg,
    description: 'Deep-water Patagonian toothfish fillet roasted over lenga embers, served with charred heart of palm and merquén citrus oil.',
    prepTimeMinutes: 18,
    calories: 440,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Patagonian Toothfish', 'Heart of Palm', 'Smoked Merquén', 'Cilantro', 'Extra Virgin Olive Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'cri-05',
    propertyId: 'sosei-patagonia',
    name: 'Warm 80% Andean Cacao Fondant & Roasted Macadamia',
    category: 'desserts',
    categoryLabel: 'Postres Australes',
    price: 26,
    image: chocolateSouffleImg,
    description: 'Warm dark cacao molten cake with espresso anglaise and caramelized macadamia nuts.',
    prepTimeMinutes: 18,
    calories: 440,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['80% Dark Cacao', 'Roasted Macadamia Nuts (Tree Nuts)', 'Farm Eggs', 'Cultured Butter (Dairy)'],
    allergens: ['Tree Nuts', 'Eggs', 'Dairy'],
  },

  // ============================================================================
  // 9. SOSEI Marrakech (Marrakech, Morocco) — Royal Moroccan Tagines & Mezze
  // ============================================================================
  {
    id: 'egy-01',
    propertyId: 'sosei-marrakech',
    name: 'Atlas Roasted Cauliflower, Argan Oil & Hazelnut Dukkah',
    category: 'starters',
    categoryLabel: 'Kemia & Moroccan Mezze',
    price: 36,
    image: cauliflowerSteakImg,
    description: 'Clay-oven charred cauliflower with first-press Essaouira argan oil, stone-ground sesame tahini, and roasted hazelnut dukkah.',
    prepTimeMinutes: 15,
    calories: 320,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Roasted Cauliflower', 'Essaouira Argan Oil (Tree Nuts)', 'Sesame Tahini', 'Hazelnut & Coriander Dukkah (Tree Nuts, Sesame)'],
    allergens: ['Sesame', 'Tree Nuts'],
  },
  {
    id: 'egy-02',
    propertyId: 'sosei-marrakech',
    name: 'Marrakech Clay-Oven Duck Tagine with Medjool Dates & Saffron',
    category: 'mains',
    categoryLabel: 'Royal Tagines & Grill',
    price: 82,
    image: dishBaliBetutuImg,
    description: 'Slow-roasted Palmeraie duck glazed with Tafilalet Medjool dates, Atlas green olives, and smoky roasted wheat freekeh.',
    prepTimeMinutes: 22,
    calories: 590,
    isChefSignature: true,
    dietaryBadges: ['Royal Marrakech', 'Halal', 'Dairy-Free'],
    ingredients: ['Palmeraie Duck Breast', 'Medjool Dates', 'Atlas Green Olives', 'Roasted Wheat Freekeh (Gluten)', 'Taliouine Saffron'],
    allergens: ['Gluten'],
  },
  {
    id: 'egy-03',
    propertyId: 'sosei-marrakech',
    name: 'Atlantic Spiny Lobster Tagine with Chermoula & Preserved Lemon',
    category: 'mains',
    categoryLabel: 'Royal Tagines & Grill',
    price: 125,
    image: lobsterThermidorImg,
    description: 'Oualidia spiny lobster baked in earthen tagine with Marrakech preserved lemon, garlic chermoula, and Taliouine saffron butter.',
    prepTimeMinutes: 24,
    calories: 530,
    dietaryBadges: ['Halal', 'Gluten-Free'],
    ingredients: ['Atlantic Spiny Lobster', 'Preserved Lemon', 'Fresh Cilantro & Parsley', 'Saffron Clarified Butter (Dairy)', 'Garlic'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy'],
  },
  {
    id: 'egy-04',
    propertyId: 'sosei-marrakech',
    name: 'Ourika Valley Ancient Grain, Avocado & Pomegranate Bowl',
    category: 'mains',
    categoryLabel: 'Royal Tagines & Grill',
    price: 34,
    image: zenGardenBowlImg,
    description: 'Heirloom quinoa, avocado, roasted chickpeas, pickled turnip, and cold-pressed sesame lemon dressing.',
    prepTimeMinutes: 10,
    calories: 340,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Organic Quinoa', 'Chickpeas', 'Avocado', 'Pickled Turnip', 'Sesame Tahini', 'Lemon'],
    allergens: ['Sesame'],
  },
  {
    id: 'egy-05',
    propertyId: 'sosei-marrakech',
    name: 'Palmeraie Hibiscus, Atlas Spearmint & Orange Blossom Elixir',
    category: 'beverages',
    categoryLabel: 'Riad Elixirs & Tea',
    price: 20,
    image: botanicalElixirImg,
    description: 'Sun-dried crimson hibiscus flowers steeped cold with Atlas mountain spearmint, orange blossom water, and citrus.',
    prepTimeMinutes: 5,
    calories: 65,
    isChefSignature: true,
    dietaryBadges: ['Vegan', 'Allergen-Free', 'Halal'],
    ingredients: ['Crimson Hibiscus Petals', 'Atlas Spearmint', 'Orange Blossom Water', 'Organic Cane Nectar'],
    allergens: [],
  },

  // ============================================================================
  // 10. SOSEI Sumba (Sumba, Indonesia) — Nusantara & Balinese Coastal Cuisine
  // ============================================================================
  {
    id: 'bali-01',
    propertyId: 'sosei-sumba',
    name: 'Sate Lilit Ikan Karang & Sambal Matah',
    category: 'starters',
    categoryLabel: 'Pembuka (Starters)',
    price: 38,
    image: dishBaliSatelilitImg,
    description: 'Minced Indian Ocean reef snapper blended with grated young coconut and Nusantara spice paste, grilled on lemongrass stalks.',
    prepTimeMinutes: 14,
    calories: 290,
    isChefSignature: true,
    dietaryBadges: ['Nusantara Heritage', 'Gluten-Free'],
    ingredients: ['Reef Snapper', 'Young Coconut', 'Lemongrass', 'Shallots', 'Kaffir Lime', 'Torch Ginger', 'Coconut Oil'],
    allergens: ['Fish'],
  },
  {
    id: 'bali-02',
    propertyId: 'sosei-sumba',
    name: 'Kepiting Soka Sambal Kacang (Crispy Soft-Shell Crab)',
    category: 'starters',
    categoryLabel: 'Pembuka (Starters)',
    price: 44,
    image: softShellCrabImg,
    description: 'Crisp mangrove soft-shell crab served over roasted peanut sambal, young mango lawar, and kaffir lime leaf oil.',
    prepTimeMinutes: 15,
    calories: 380,
    dietaryBadges: ['Archipelago Coastal'],
    ingredients: ['Mangrove Soft-Shell Crab', 'Roasted Peanuts', 'Green Mango', 'Kaffir Lime', 'Coconut Milk', 'Palm Sugar'],
    allergens: ['Shellfish', 'Crustaceans', 'Peanuts'],
  },
  {
    id: 'bali-03',
    propertyId: 'sosei-sumba',
    name: 'Bebek Betutu Asap Daun Pinang (Smoke-Roasted Duck)',
    category: 'mains',
    categoryLabel: 'Hidangan Utama (Mains)',
    price: 68,
    image: dishBaliBetutuImg,
    description: '12-hour slow-smoked heritage duck in betutu spice paste, wrapped in areca bark with cassava leaves and red rice.',
    prepTimeMinutes: 22,
    calories: 610,
    isChefSignature: true,
    dietaryBadges: ['Archipelago Signature', 'Dairy-Free'],
    ingredients: ['Heritage Duck Breast & Confit', 'Bumbu Betutu Spices', 'Cassava Leaves', 'Red Rice', 'Candlenut (Tree Nuts)', 'Shallot Sambal'],
    allergens: ['Tree Nuts'],
  },
  {
    id: 'bali-04',
    propertyId: 'sosei-sumba',
    name: 'Udang Karang Bakar Nihiwatu (Wood-Fired Spiny Lobster)',
    category: 'mains',
    categoryLabel: 'Hidangan Utama (Mains)',
    price: 115,
    image: lobsterThermidorImg,
    description: 'Whole Sumbanese spiny lobster grilled over coconut husks, glazed with wild forest honey, garlic, and fermented shrimp terasi.',
    prepTimeMinutes: 24,
    calories: 520,
    isChefSignature: true,
    dietaryBadges: ['Nihiwatu Grill'],
    ingredients: ['Indian Ocean Spiny Lobster', 'Fermented Shrimp Paste (Terasi)', 'Wild Forest Honey', 'Red Chili', 'Kalamansi Lime', 'Kemangi Basil'],
    allergens: ['Shellfish', 'Crustaceans'],
  },
  {
    id: 'bali-07',
    propertyId: 'sosei-sumba',
    name: 'Jamu Kunyit Asam & Botanical Tonic',
    category: 'beverages',
    categoryLabel: 'Jamu & Minuman (Elixirs)',
    price: 20,
    image: botanicalElixirImg,
    description: 'Cold-pressed organic turmeric, java tamarind, ginger blossom, and sparkling spring water.',
    prepTimeMinutes: 5,
    calories: 65,
    dietaryBadges: ['Archipelago Wellness', 'Vegan'],
    ingredients: ['Organic Turmeric', 'Java Tamarind', 'Red Ginger', 'Coconut Nectar', 'Spring Water'],
    allergens: [],
  },

  // ============================================================================
  // 11. SOSEI Niseko (Niseko, Japan) — Hokkaido Robatayaki & Edomae Sushi
  // ============================================================================
  {
    id: 'nsk-01',
    propertyId: 'sosei-niseko',
    name: 'Otaru Hon-Maguro & Rishiri Uni Nigiri (6 pcs)',
    category: 'starters',
    categoryLabel: 'Hokkaido Sushi & Crudo',
    price: 138,
    image: dishTokyoNigiriImg,
    description: 'Hokkaido bluefin tuna and Rishiri sea urchin hand-pressed over warm akazu vinegar rice with freshly grated wasabi.',
    prepTimeMinutes: 12,
    calories: 340,
    isChefSignature: true,
    dietaryBadges: ['Hokkaido Signature', 'Dairy-Free'],
    ingredients: ['Bluefin Tuna', 'Rishiri Sea Urchin (Uni)', 'Hokkaido Yumepirika Rice', 'Nikiri Soy (Soy, Wheat)', 'Wasabi'],
    allergens: ['Fish', 'Shellfish', 'Soy', 'Gluten'],
  },
  {
    id: 'nsk-02',
    propertyId: 'sosei-niseko',
    name: 'Hokkaido Hotate Scallop & Sudachi Crudo',
    category: 'starters',
    categoryLabel: 'Hokkaido Sushi & Crudo',
    price: 52,
    image: scallopCrudoImg,
    description: 'Live Okhotsk sea scallop sliced thin with green yuzu kosho, sudachi citrus, and sea salt.',
    prepTimeMinutes: 10,
    calories: 155,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Hokkaido Sea Scallops', 'Sudachi Citrus', 'Yuzu Kosho', 'Shiso Blossom', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'nsk-03',
    propertyId: 'sosei-niseko',
    name: 'Shiraoi A5 Wagyu & Ezo Venison Binchotan Grill',
    category: 'mains',
    categoryLabel: 'Robata Hearth Mains',
    price: 168,
    image: wagyuStriploinImg,
    description: 'Charcoal-grilled Hokkaido Shiraoi A5 wagyu sirloin with Tokachi butter, aged tamari soy, and charred mountain leek.',
    prepTimeMinutes: 20,
    calories: 640,
    isChefSignature: true,
    dietaryBadges: ['Robata Hearth'],
    ingredients: ['Hokkaido A5 Wagyu', 'Tokachi Butter (Dairy)', 'Aged Tamari Soy', 'Mountain Leek', 'Wasabi'],
    allergens: ['Dairy', 'Soy'],
  },
  {
    id: 'nsk-04',
    propertyId: 'sosei-niseko',
    name: 'Yoichi Single Malt Mizunara Golden Highball',
    category: 'beverages',
    categoryLabel: 'Hokkaido Whisky & Sake',
    price: 42,
    image: goldenHighballImg,
    description: 'Hokkaido Yoichi single malt whisky, Niseko snowmelt spring soda, hand-carved ice, and gold leaf.',
    prepTimeMinutes: 5,
    calories: 115,
    dietaryBadges: ['Niseko Signature'],
    ingredients: ['Yoichi Single Malt', 'Snowmelt Spring Soda', 'Yuzu Twist', 'Gold Leaf'],
    allergens: [],
  },

  // ============================================================================
  // 12. SOSEI Aspen (Aspen, United States) — Rocky Mountain Chophouse
  // ============================================================================
  {
    id: 'asp-01',
    propertyId: 'sosei-aspen',
    name: 'Rocky Mountain Smoked Trout, Oscietra Caviar & Potato Pavé',
    category: 'starters',
    categoryLabel: 'Mountain Starters',
    price: 155,
    image: caviarImg,
    description: 'Roaring Fork smoked rainbow trout and Oscietra caviar over crisp layered potato pavé with cultured crème fraîche.',
    prepTimeMinutes: 12,
    calories: 310,
    isChefSignature: true,
    dietaryBadges: ['Aspen Signature', 'Gluten-Free'],
    ingredients: ['Oscietra Caviar', 'Colorado Rainbow Trout', 'Potato Pavé', 'Crème Fraîche (Dairy)', 'Chives'],
    allergens: ['Fish', 'Dairy'],
  },
  {
    id: 'asp-02',
    propertyId: 'sosei-aspen',
    name: 'Colorado Dry-Aged Prime Wagyu Ribeye & Morel Butter',
    category: 'mains',
    categoryLabel: 'Chophouse Mains',
    price: 162,
    image: wagyuStriploinImg,
    description: '45-day dry-aged Colorado wagyu ribeye grilled over white oak, finished with wild mountain morel herb butter.',
    prepTimeMinutes: 22,
    calories: 670,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Nut-Free'],
    ingredients: ['Colorado Wagyu Ribeye', 'Wild Morel Butter (Dairy)', 'Roasted Garlic', 'Rosemary', 'Sea Salt'],
    allergens: ['Dairy'],
  },
  {
    id: 'asp-03',
    propertyId: 'sosei-aspen',
    name: 'Warm Valrhona Dark Chocolate Soufflé & Pecan Praline',
    category: 'desserts',
    categoryLabel: 'Alpine Desserts',
    price: 32,
    image: chocolateSouffleImg,
    description: 'Baked-to-order dark chocolate soufflé with bourbon vanilla bean cream and toasted pecan praline.',
    prepTimeMinutes: 20,
    calories: 480,
    dietaryBadges: ['Vegetarian'],
    ingredients: ['Dark Chocolate', 'Bourbon Vanilla Cream (Dairy)', 'Farm Eggs', 'Toasted Pecans (Tree Nuts)', 'Wheat Flour'],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },

  // ============================================================================
  // 13. SOSEI Seychelles (Mahé, Seychelles) — Indian Ocean Crudo & Creole Grill
  // ============================================================================
  {
    id: 'sey-01',
    propertyId: 'sosei-seychelles',
    name: 'Mahé Lagoon Scallop Crudo & Takamaka Lime',
    category: 'starters',
    categoryLabel: 'Lagoon Raw Bar',
    price: 54,
    image: scallopCrudoImg,
    description: 'Chilled sea scallops dressed with Seychelles lime, young coconut water reduction, and cinnamon leaf oil.',
    prepTimeMinutes: 10,
    calories: 165,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Dairy-Free'],
    ingredients: ['Sea Scallops', 'Young Coconut Water', 'Seychelles Lime', 'Cinnamon Leaf Oil', 'Sea Salt'],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'sey-02',
    propertyId: 'sosei-seychelles',
    name: 'Seychelles Spiny Lobster Creole Coconut Curry',
    category: 'mains',
    categoryLabel: 'Indian Ocean Mains',
    price: 145,
    image: lobsterThermidorImg,
    description: 'Indian Ocean spiny lobster poached in first-press coconut milk, curry leaf, lemongrass, and saffron rice.',
    prepTimeMinutes: 24,
    calories: 550,
    isChefSignature: true,
    dietaryBadges: ['Seychelles Signature', 'Gluten-Free'],
    ingredients: ['Indian Ocean Spiny Lobster', 'First-Press Coconut Milk', 'Curry Leaves', 'Lemongrass', 'Clarified Butter (Dairy)'],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy'],
  },
  {
    id: 'sey-03',
    propertyId: 'sosei-seychelles',
    name: 'Tropical Mango, Coco de Mer Coconut & Passionfruit Sorbet',
    category: 'desserts',
    categoryLabel: 'Island Desserts',
    price: 24,
    image: sorbetTrioImg,
    description: 'Chilled trio of ripe island mango, young coconut, and passionfruit sorbets.',
    prepTimeMinutes: 8,
    calories: 145,
    dietaryBadges: ['Vegan', 'Allergen-Free'],
    ingredients: ['Island Mango', 'Young Coconut', 'Passionfruit', 'Cane Sugar'],
    allergens: [],
  },

  // ============================================================================
  // 14. SOSEI Serengeti (Serengeti, Tanzania) — Savannah Open-Fire & Heritage
  // ============================================================================
  {
    id: 'ser-01',
    propertyId: 'sosei-serengeti',
    name: 'Kopje Fire-Roasted Cauliflower, Sesame Tahini & Dukkah',
    category: 'starters',
    categoryLabel: 'Savannah Starters',
    price: 36,
    image: cauliflowerSteakImg,
    description: 'Acacia-charred cauliflower with stone-ground sesame tahini, pomegranate, and roasted cashew spice dukkah.',
    prepTimeMinutes: 15,
    calories: 310,
    dietaryBadges: ['Vegan', 'Gluten-Free'],
    ingredients: ['Roasted Cauliflower', 'Sesame Tahini', 'Roasted Cashews (Tree Nuts)', 'Coriander Seed', 'Olive Oil'],
    allergens: ['Sesame', 'Tree Nuts'],
  },
  {
    id: 'ser-02',
    propertyId: 'sosei-serengeti',
    name: 'Acacia-Ember Prime Beef Striploin & Zanzibar Black Pepper Jus',
    category: 'mains',
    categoryLabel: 'Bush Fire Grill',
    price: 128,
    image: wagyuStriploinImg,
    description: 'Open-fire grilled prime striploin basted in herb butter with crushed Zanzibar black peppercorn jus.',
    prepTimeMinutes: 22,
    calories: 610,
    isChefSignature: true,
    dietaryBadges: ['Serengeti Signature', 'Gluten-Free'],
    ingredients: ['Prime Beef Striploin', 'Cultured Herb Butter (Dairy)', 'Zanzibar Black Pepper', 'Shallots', 'Sea Salt'],
    allergens: ['Dairy'],
  },
  {
    id: 'ser-03',
    propertyId: 'sosei-serengeti',
    name: 'Hibiscus, Baobab & Wild Mint Sundowner Elixir',
    category: 'beverages',
    categoryLabel: 'Sundowner Elixirs',
    price: 22,
    image: botanicalElixirImg,
    description: 'Cold-steeped East African crimson hibiscus, baobab citrus, wild spearmint, and sparkling spring water.',
    prepTimeMinutes: 5,
    calories: 65,
    dietaryBadges: ['Vegan', 'Allergen-Free'],
    ingredients: ['Crimson Hibiscus', 'Baobab Fruit', 'Wild Spearmint', 'Spring Water'],
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
