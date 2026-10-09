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

export interface FnbGuest {
  id: string;
  name: string;
  room: string;
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
  name: string;
  category: 'starters' | 'mains' | 'pasta' | 'bowls' | 'desserts' | 'beverages';
  categoryLabel: string;
  price: number;
  image: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  isChefSignature?: boolean;
  dietaryBadges: string[]; // e.g. 'Gluten-Free', 'Vegan', 'Organic', 'Halal'
  ingredients: string[];
  allergens: string[]; // e.g. 'Shellfish', 'Peanuts', 'Tree Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Sesame'
}

export const IN_HOUSE_FNB_GUESTS: FnbGuest[] = [
  {
    id: 'gst-101',
    name: 'Sal Zanjabila',
    room: 'Alpine Penthouse 101',
    property: 'SOSEI Alpine (St. Moritz)',
    vipTier: 'Platinum VIP',
    allergies: ['Peanuts', 'Tree Nuts'],
    dietaryRestrictions: ['Pescetarian'],
    partySize: 2,
    folioNumber: 'FOL-88092',
    checkIn: 'Oct 02, 2026',
    checkOut: 'Oct 09, 2026',
    notes: 'Matterhorn view preferred. Severe anaphylactic reaction to peanuts and walnuts.',
  },
  {
    id: 'gst-102',
    name: 'Thomas Bailey & Family',
    room: 'Overwater Villa 108',
    property: 'SOSEI Ocean (Maldives)',
    vipTier: 'Founding Circle',
    allergies: ['Shellfish', 'Crustaceans'],
    dietaryRestrictions: ['Halal Preferred'],
    partySize: 4,
    folioNumber: 'FOL-44012',
    checkIn: 'Oct 04, 2026',
    checkOut: 'Oct 11, 2026',
    notes: 'Traveling with 2 children. Strict Shellfish & Crustacean allergy registered with resort doctor.',
  },
  {
    id: 'gst-103',
    name: 'Elena Rostova',
    room: 'Skyline Residence 2801',
    property: 'SOSEI City (New York)',
    vipTier: 'VVIP Tier 1',
    allergies: ['Gluten'],
    dietaryRestrictions: ['Celiac Friendly', 'No Refined Sugar'],
    partySize: 1,
    folioNumber: 'FOL-19284',
    checkIn: 'Oct 05, 2026',
    checkOut: 'Oct 10, 2026',
    notes: 'Diagnosed Celiac disease. Requires zero cross-contamination with wheat or gluten.',
  },
  {
    id: 'gst-104',
    name: 'Kenzo Tanaka',
    room: 'Sanctuary Ryokan Villa 12',
    property: 'SOSEI Forest (Kyoto)',
    vipTier: 'Diamond Patron',
    allergies: ['Dairy', 'Lactose'],
    dietaryRestrictions: ['Organic Only'],
    partySize: 2,
    folioNumber: 'FOL-77210',
    checkIn: 'Oct 03, 2026',
    checkOut: 'Oct 08, 2026',
    notes: 'Lactose intolerance. Prefers oat milk, coconut oil, and clarified non-dairy preparations.',
  },
  {
    id: 'gst-105',
    name: 'Martin Fuentes',
    room: 'Glacier Chalet 201',
    property: 'SOSEI Alpine (Zermatt)',
    vipTier: 'Founding Circle',
    allergies: [],
    dietaryRestrictions: ['None'],
    partySize: 2,
    folioNumber: 'FOL-10024',
    checkIn: 'Oct 01, 2026',
    checkOut: 'Oct 07, 2026',
    notes: 'No known allergies. Sommelier wine pairing enthusiast.',
  },
  {
    id: 'gst-106',
    name: 'Sophia Lorenzi',
    room: 'Grand Oasis Villa 05',
    property: 'SOSEI Desert (Al Wadi)',
    vipTier: 'Platinum VIP',
    allergies: ['Soy', 'Sesame'],
    dietaryRestrictions: ['Vegetarian'],
    partySize: 2,
    folioNumber: 'FOL-55931',
    checkIn: 'Oct 04, 2026',
    checkOut: 'Oct 12, 2026',
    notes: 'High sensitivity to sesame seeds, tahini, and unfermented soy products.',
  },
  {
    id: 'gst-107',
    name: 'Lord & Lady Sterling',
    room: 'Vineyard Suite 204',
    property: 'SOSEI Countryside (Tuscany)',
    vipTier: 'VVIP Tier 1',
    allergies: ['Eggs'],
    dietaryRestrictions: ['Low Sodium'],
    partySize: 2,
    folioNumber: 'FOL-63029',
    checkIn: 'Oct 05, 2026',
    checkOut: 'Oct 14, 2026',
    notes: 'Egg albumin allergy. Sauces and pastas must be strictly egg-free.',
  },
];

export const FNB_MENU_ITEMS: FnbMenuItem[] = [
  // STARTERS & CAVIAR
  {
    id: 'fnb-str-01',
    name: 'Royal Oscietra Caviar Imperial (30g)',
    category: 'starters',
    categoryLabel: 'Starters & Caviar',
    price: 185,
    image: caviarImg,
    description: 'Aged Oscietra sturgeon caviar served with warm buckwheat blinis, organic egg yolk emulsion, crème fraîche, and garden chives.',
    prepTimeMinutes: 10,
    calories: 220,
    isChefSignature: true,
    dietaryBadges: ['Chef Signature', 'Pescatarian'],
    ingredients: [
      'Oscietra Sturgeon Caviar',
      'Buckwheat Flour',
      'Cultured Crème Fraîche (Dairy)',
      'Organic Egg Yolk',
      'French Chives',
      'Shallots',
    ],
    allergens: ['Fish', 'Dairy', 'Eggs', 'Gluten'],
  },
  {
    id: 'fnb-str-02',
    name: 'Hokkaido Scallop & Finger Lime Crudo',
    category: 'starters',
    categoryLabel: 'Starters & Caviar',
    price: 48,
    image: scallopCrudoImg,
    description: 'Sashimi-grade Hokkaido sea scallops sliced paper-thin, compressed cucumber, yuzu kosho vinaigrette, Australian finger lime pearls, and sea salt.',
    prepTimeMinutes: 12,
    calories: 160,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Pescatarian', 'Dairy-Free'],
    ingredients: [
      'Wild Hokkaido Scallops',
      'Finger Lime',
      'Yuzu Kosho',
      'Extra Virgin Olive Oil',
      'Persian Cucumber',
      'Fleur de Sel',
      'Micro Cilantro',
    ],
    allergens: ['Shellfish', 'Molluscs'],
  },
  {
    id: 'fnb-str-03',
    name: 'Wild Alpine Chanterelle & Morel Tartlet',
    category: 'starters',
    categoryLabel: 'Starters & Caviar',
    price: 36,
    image: mushroomTartletImg,
    description: 'Hand-foraged Swiss alpine morels and chanterelles pan-glazed in shallot reduction, encased in crisp vegan pastry with thyme glaze.',
    prepTimeMinutes: 15,
    calories: 240,
    dietaryBadges: ['Vegan', 'Dairy-Free', 'Nut-Free'],
    ingredients: [
      'Chanterelle Mushrooms',
      'Morel Mushrooms',
      'Shallots',
      'Organic Wheat Flour',
      'Cold-Pressed Olive Oil',
      'Fresh Thyme',
      'White Balsamic Vinegar',
    ],
    allergens: ['Gluten'],
  },
  {
    id: 'fnb-str-04',
    name: 'Crispy Soft-Shell Crab with Peanut Satay Emulsion',
    category: 'starters',
    categoryLabel: 'Starters & Caviar',
    price: 44,
    image: softShellCrabImg,
    description: 'Flash-fried soft-shell crab resting on crushed roasted peanut satay cream, green mango slaw, and kaffir lime leaf oil.',
    prepTimeMinutes: 16,
    calories: 380,
    dietaryBadges: ['Spicy', 'House Special'],
    ingredients: [
      'Mangrove Soft-Shell Crab',
      'Roasted Peanuts',
      'Coconut Milk',
      'Green Mango',
      'Kaffir Lime',
      'Red Chili',
      'Palm Sugar',
      'Sesame Oil',
    ],
    allergens: ['Shellfish', 'Crustaceans', 'Peanuts', 'Sesame'],
  },

  // MAIN COURSES & GRILLS
  {
    id: 'fnb-main-01',
    name: 'Kagoshima Wagyu A5 Striploin (180g)',
    category: 'mains',
    categoryLabel: 'Main Courses & Grills',
    price: 165,
    image: wagyuStriploinImg,
    description: 'Finest Japanese A5 black cattle sirloin seared over binchotan charcoal, accompanied by smoked potato mousseline, baby leek confit, and red wine bordelaise jus.',
    prepTimeMinutes: 22,
    calories: 680,
    isChefSignature: true,
    dietaryBadges: ['Gluten-Free', 'Nut-Free', 'Chef Signature'],
    ingredients: [
      'Kagoshima Wagyu A5 Beef',
      'Yukon Gold Potatoes',
      'Normandy Butter (Dairy)',
      'Baby Leeks',
      'Bone Marrow Reduction',
      'Black Truffle Salt',
    ],
    allergens: ['Dairy'],
  },
  {
    id: 'fnb-main-02',
    name: 'Brittany Blue Lobster Thermidor SOSEI',
    category: 'mains',
    categoryLabel: 'Main Courses & Grills',
    price: 145,
    image: lobsterThermidorImg,
    description: 'Whole Brittany blue lobster roasted in shell with Cognac reduction, aged Gruyère crust, dijon cream sauce, and fresh summer tarragon.',
    prepTimeMinutes: 25,
    calories: 590,
    isChefSignature: true,
    dietaryBadges: ['Pescatarian', 'House Special'],
    ingredients: [
      'Whole Brittany Blue Lobster',
      'Cognac',
      'Gruyère AOP Cheese (Dairy)',
      'Heavy Cream (Dairy)',
      'Dijon Mustard',
      'Wheat Breadcrumbs',
      'Fresh Tarragon',
      'Egg Yolk',
    ],
    allergens: ['Shellfish', 'Crustaceans', 'Dairy', 'Gluten', 'Eggs', 'Mustard'],
  },
  {
    id: 'fnb-main-03',
    name: 'Pan-Seared Patagonian Glacier Toothfish',
    category: 'mains',
    categoryLabel: 'Main Courses & Grills',
    price: 78,
    image: toothfishImg,
    description: 'Sustainably sourced Chilean seabass marinated 48 hours in Kyoto saikyo white miso and mirin, caramelized over coals with baby bok choy and toasted sesame.',
    prepTimeMinutes: 20,
    calories: 420,
    dietaryBadges: ['Pescatarian', 'Dairy-Free'],
    ingredients: [
      'Patagonian Glacier Toothfish (Seabass)',
      'Saikyo White Miso (Soy)',
      'Hon Mirin',
      'Baby Bok Choy',
      'Kombu Dashi',
      'Toasted White Sesame Seeds',
    ],
    allergens: ['Fish', 'Soy', 'Sesame'],
  },
  {
    id: 'fnb-main-04',
    name: 'Charred Heirloom Cauliflower Steak & Pine Nut Tahini',
    category: 'mains',
    categoryLabel: 'Main Courses & Grills',
    price: 42,
    image: cauliflowerSteakImg,
    description: 'Thick cut roasted heirloom cauliflower basted in za’atar oil, served on toasted sesame tahini, pomegranate reduction, mint chimichurri, and toasted pine nuts.',
    prepTimeMinutes: 18,
    calories: 310,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      'Heirloom White Cauliflower',
      'Pure Sesame Tahini',
      'Mediterranean Pine Nuts',
      'Pomegranate Molasses',
      'Za’atar Herbs',
      'Fresh Mint & Parsley',
      'Extra Virgin Olive Oil',
    ],
    allergens: ['Tree Nuts', 'Sesame'],
  },

  // PASTA & HANDCRAFTED
  {
    id: 'fnb-pas-01',
    name: 'Hand-Rolled Tagliolini with Alba White Truffle',
    category: 'pasta',
    categoryLabel: 'Wood-Fired & Pasta',
    price: 88,
    image: taglioliniTruffleImg,
    description: '30-egg yolk handmade silky pasta spun in cultured butter emulsion, finished tableside with fresh shavings of Italian Alba white truffle.',
    prepTimeMinutes: 15,
    calories: 520,
    isChefSignature: true,
    dietaryBadges: ['Vegetarian', 'Chef Signature'],
    ingredients: [
      '00 Wheat Flour',
      'Organic Egg Yolks',
      'Cultured Alpine Butter (Dairy)',
      'Alba White Truffle',
      'Parmigiano-Reggiano 36 Months (Dairy)',
      'Sea Salt',
    ],
    allergens: ['Gluten', 'Eggs', 'Dairy'],
  },
  {
    id: 'fnb-pas-02',
    name: 'King Crab & Buffalo Ricotta Ravioloni',
    category: 'pasta',
    categoryLabel: 'Wood-Fired & Pasta',
    price: 64,
    image: crabRavioloniImg,
    description: 'Jumbo pasta pockets stuffed with sweet red king crab meat and artisanal buffalo ricotta, floating in saffron lobster bisque with Meyer lemon oil.',
    prepTimeMinutes: 18,
    calories: 460,
    dietaryBadges: ['Pescatarian'],
    ingredients: [
      'Alaskan Red King Crab',
      'Buffalo Milk Ricotta (Dairy)',
      'Durum Wheat Semolina',
      'Whole Farm Eggs',
      'Saffron Bisque (Crustacean Stock)',
      'Meyer Lemon Zest',
    ],
    allergens: ['Shellfish', 'Crustaceans', 'Gluten', 'Eggs', 'Dairy'],
  },
  {
    id: 'fnb-pas-03',
    name: 'Gluten-Free Wild Herb & Cassava Gnocchi',
    category: 'pasta',
    categoryLabel: 'Wood-Fired & Pasta',
    price: 46,
    image: herbGnocchiImg,
    description: 'Tender pillow gnocchi crafted from mountain potatoes and organic cassava starch, tossed in roasted cherry tomato passata, Genovese basil, and walnut pesto.',
    prepTimeMinutes: 14,
    calories: 390,
    dietaryBadges: ['Gluten-Free', 'Vegetarian', 'Egg-Free'],
    ingredients: [
      'Mountain Russet Potatoes',
      'Cassava & Rice Flour',
      'San Marzano Tomatoes',
      'Genovese Sweet Basil',
      'Toasted English Walnuts',
      'Cold-Pressed Olive Oil',
      'Garlic',
    ],
    allergens: ['Tree Nuts'],
  },

  // SANCTUARY BOWLS & ORGANIC
  {
    id: 'fnb-bwl-01',
    name: 'Zen Sanctuary Garden Bowl (Organic)',
    category: 'bowls',
    categoryLabel: 'Sanctuary Bowls & Salads',
    price: 34,
    image: zenGardenBowlImg,
    description: 'Wild heirloom quinoa, avocado rose, edamame, shaved radishes, pickled lotus root, kale crisps, and cold-pressed ginger tahini dressing.',
    prepTimeMinutes: 10,
    calories: 340,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Organic', 'Dairy-Free'],
    ingredients: [
      'Tri-Color Organic Quinoa',
      'Hass Avocado',
      'Organic Edamame (Soy)',
      'Watermelon Radish',
      'Lotus Root',
      'Tuscan Lacinato Kale',
      'White Sesame Paste',
      'Cold-Pressed Ginger',
    ],
    allergens: ['Soy', 'Sesame'],
  },
  {
    id: 'fnb-bwl-02',
    name: 'Alpine Smoked Salmon & Burrata Salad',
    category: 'bowls',
    categoryLabel: 'Sanctuary Bowls & Salads',
    price: 42,
    image: salmonBurrataImg,
    description: 'House cold-smoked Swiss alpine salmon, creamy artisanal burrata heart, wild rocket arugula, pomegranate arils, and aged balsamic glaze.',
    prepTimeMinutes: 10,
    calories: 410,
    dietaryBadges: ['Gluten-Free', 'Pescatarian', 'Nut-Free', 'Egg-Free'],
    ingredients: [
      'House-Smoked Alpine Salmon',
      'Apulian Burrata Cheese (Dairy)',
      'Wild Rocket Arugula',
      'Pomegranate Seeds',
      'Aged Modena Balsamic Vinegar',
      'Cold-Pressed Olive Oil',
    ],
    allergens: ['Fish', 'Dairy'],
  },

  // ARTISANAL DESSERTS
  {
    id: 'fnb-dst-01',
    name: 'Valrhona Guanaja 70% Chocolate Soufflé',
    category: 'desserts',
    categoryLabel: 'Artisanal Desserts',
    price: 28,
    image: chocolateSouffleImg,
    description: 'Baked to order molten single-origin Grand Cru chocolate soufflé, accompanied by Tahitian vanilla bean crème anglaise and caramelized Piedmont hazelnut crunch.',
    prepTimeMinutes: 20,
    calories: 480,
    isChefSignature: true,
    dietaryBadges: ['Chef Signature', 'Vegetarian'],
    ingredients: [
      'Valrhona Guanaja 70% Dark Chocolate',
      'Organic Egg Whites & Yolks',
      'Cultured Butter (Dairy)',
      'Whole Milk (Dairy)',
      'Piedmont Hazelnuts',
      'Wheat Flour',
      'Tahitian Vanilla Beans',
    ],
    allergens: ['Dairy', 'Eggs', 'Tree Nuts', 'Gluten'],
  },
  {
    id: 'fnb-dst-02',
    name: 'Kyoto Ceremonial Uji Matcha Mille-Feuille',
    category: 'desserts',
    categoryLabel: 'Artisanal Desserts',
    price: 26,
    image: matchaMillefeuilleImg,
    description: 'Crisp caramelized inverted puff pastry layered with ceremonial grade Uji matcha mascarpone mousse and adzuki red bean coulis.',
    prepTimeMinutes: 12,
    calories: 380,
    dietaryBadges: ['Vegetarian', 'Nut-Free'],
    ingredients: [
      'Ceremonial Uji Matcha Powder',
      'Mascarpone Cheese (Dairy)',
      'Heavy Cream (Dairy)',
      'Organic Wheat Flour',
      'Hokkaido Sweet Red Beans',
      'Pastry Butter (Dairy)',
      'Egg Wash',
    ],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'fnb-dst-03',
    name: 'SOSEI Organic Sorbet Trio (100% Allergen-Free)',
    category: 'desserts',
    categoryLabel: 'Artisanal Desserts',
    price: 22,
    image: sorbetTrioImg,
    description: 'Three quenelles of fresh house-churned sorbet: Alphonso Mango & Lime, Sicilian Blood Orange, and Wild Alpine Raspberry. Completely allergen-free.',
    prepTimeMinutes: 8,
    calories: 140,
    dietaryBadges: ['Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free', '100% Allergen-Free'],
    ingredients: [
      'Alphonso Mango Puree',
      'Sicilian Blood Orange Juice',
      'Wild Alpine Raspberries',
      'Organic Cane Sugar',
      'Spring Water',
      'Fresh Lime Juice',
    ],
    allergens: [],
  },

  // SIGNATURE BEVERAGES & CELLAR
  {
    id: 'fnb-bev-01',
    name: 'SOSEI Signature Golden Highball',
    category: 'beverages',
    categoryLabel: 'Signature Beverages & Cellar',
    price: 38,
    image: goldenHighballImg,
    description: 'Yamazaki 12-Year Single Malt Whisky, artisanal cold-extracted ginger root elixir, hand-carved ice sphere, soda, finished with 24k edible gold leaf.',
    prepTimeMinutes: 5,
    calories: 120,
    isChefSignature: true,
    dietaryBadges: ['Alcoholic', 'Chef Signature', 'Gluten-Free'],
    ingredients: [
      'Yamazaki 12yr Single Malt',
      'Fresh Ginger Elixir',
      'Artisanal Spring Soda',
      '24k Edible Gold Leaf',
    ],
    allergens: [],
  },
  {
    id: 'fnb-bev-02',
    name: 'Cold-Pressed Wild Botanical Elixir (Mocktail)',
    category: 'beverages',
    categoryLabel: 'Signature Beverages & Cellar',
    price: 24,
    image: botanicalElixirImg,
    description: 'Organic mountain blackberry juice, rosemary reduction, smoked pine needles mist, and tonic water. Zero alcohol, rejuvenating botanicals.',
    prepTimeMinutes: 5,
    calories: 75,
    dietaryBadges: ['Non-Alcoholic', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'],
    ingredients: [
      'Mountain Blackberry Juice',
      'Rosemary Syrup',
      'Artisanal Tonic',
      'Smoked Pine Mist',
    ],
    allergens: [],
  },
  {
    id: 'fnb-bev-03',
    name: 'Almond Blossom Iced Matcha Latte',
    category: 'beverages',
    categoryLabel: 'Signature Beverages & Cellar',
    price: 18,
    image: icedMatchaLatteImg,
    description: 'Stone-ground ceremonial Uji matcha whisked with house-pressed raw almond milk, vanilla blossom bean syrup, and crushed ice.',
    prepTimeMinutes: 5,
    calories: 130,
    dietaryBadges: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
    ingredients: [
      'Uji Ceremonial Matcha',
      'Raw Organic Almond Milk',
      'Madagascar Vanilla Syrup',
      'Spring Water Ice',
    ],
    allergens: ['Tree Nuts'],
  },
];

/**
 * Allergy Matching Engine
 * Checks whether any of the guest's allergies conflict with the menu item's ingredients or allergen tags.
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
        (cleanAllergy === 'shellfish' && cleanAllg === 'crustaceans') ||
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
      if (cleanAllergy === 'tree nuts' && (cleanIng.includes('nut') || cleanIng.includes('hazelnut') || cleanIng.includes('almond') || cleanIng.includes('walnut') || cleanIng.includes('pecan'))) return true;
      if (cleanAllergy === 'shellfish' && (cleanIng.includes('scallop') || cleanIng.includes('lobster') || cleanIng.includes('crab') || cleanIng.includes('prawn') || cleanIng.includes('shrimp'))) return true;
      if (cleanAllergy === 'crustaceans' && (cleanIng.includes('lobster') || cleanIng.includes('crab') || cleanIng.includes('prawn') || cleanIng.includes('shrimp'))) return true;
      if (cleanAllergy === 'gluten' && (cleanIng.includes('flour') || cleanIng.includes('wheat') || cleanIng.includes('pasta') || cleanIng.includes('bread') || cleanIng.includes('semolina'))) return true;
      if (cleanAllergy === 'dairy' && (cleanIng.includes('dairy') || cleanIng.includes('butter') || cleanIng.includes('milk') || cleanIng.includes('cheese') || cleanIng.includes('cream') || cleanIng.includes('ricotta') || cleanIng.includes('burrata') || cleanIng.includes('mascarpone'))) return true;
      if (cleanAllergy === 'lactose' && (cleanIng.includes('dairy') || cleanIng.includes('milk') || cleanIng.includes('cheese') || cleanIng.includes('cream') || cleanIng.includes('butter'))) return true;
      if (cleanAllergy === 'eggs' && (cleanIng.includes('egg') || cleanIng.includes('yolk') || cleanIng.includes('albumin'))) return true;
      if (cleanAllergy === 'soy' && (cleanIng.includes('soy') || cleanIng.includes('miso') || cleanIng.includes('tofu') || cleanIng.includes('edamame'))) return true;
      if (cleanAllergy === 'sesame' && cleanIng.includes('sesame')) return true;
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
      reason: `Contains ${conflicts.join(', ')} which conflicts with ${guest.name}'s medical profile. Prohibited for ordering.`,
    };
  }

  return { hasConflict: false, conflictingAllergens: [], reason: '' };
}
