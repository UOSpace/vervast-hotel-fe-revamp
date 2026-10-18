import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Magnifer,
  CloseCircle,
  TrashBinTrash,
  CheckCircle,
  ShieldWarning,
  UsersGroupTwoRounded,
  ChefHat,
  AltArrowLeft,
  AltArrowRight,
  Pen,
} from '@solar-icons/react';
import { MASTER_PROPERTIES } from '@/constants/categories';
import {
  SOSEI_RESTAURANTS,
  IN_HOUSE_FNB_GUESTS,
  FNB_MENU_ITEMS,
  checkAllergyConflict,
  type SoseiRestaurant,
  type FnbGuest,
  type FnbMenuItem,
} from '../data/fnbMenuData';

interface CartItem {
  menuItem: FnbMenuItem;
  quantity: number;
  notes?: string;
  hasAllergyWarning?: boolean;
  conflictingAllergens?: string[];
}

const QUICK_ALLERGY_NOTES = [
  'Omit allergen ingredient',
  'Separate pan & clean utensils',
  'Sauce & garnish on the side',
  'For accompanying guest at table',
  'Guest acknowledged & approved',
];

export function FnbPosPage() {
  const navigate = useNavigate();

  // ── FLOW STEP 1: Restaurant Selection State ──────────────────────────────
  const [selectedRestaurant, setSelectedRestaurant] = useState<SoseiRestaurant | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [restaurantSearch, setRestaurantSearch] = useState<string>('');

  // ── FLOW STEP 2: 3-Column POS Workspace State ────────────────────────────
  const [selectedGuest, setSelectedGuest] = useState<FnbGuest | null>(null);
  const [guestScope, setGuestScope] = useState<'property' | 'all'>('property');
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [showInHouseGuests, setShowInHouseGuests] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('');

  // Cart / Order List
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── RULE 4: Allergy Confirmation & Notes Modal State ─────────────────────
  const [pendingAllergyItem, setPendingAllergyItem] = useState<{
    item: FnbMenuItem;
    conflictingAllergens: string[];
    existingNote?: string;
    isEditingCartItem?: boolean;
  } | null>(null);
  const [allergyNoteInput, setAllergyNoteInput] = useState('');

  // Order Confirmation Modal
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<{
    orderId: string;
    timestamp: string;
    restaurant: SoseiRestaurant;
    guest: FnbGuest;
    table: string;
    items: CartItem[];
    subtotal: number;
    serviceAndTax: number;
    grandTotal: number;
  } | null>(null);

  // ── Grouped Restaurants by SOSEI Property List ───────────────────────────
  const groupedPropertyRestaurants = useMemo(() => {
    const q = restaurantSearch.trim().toLowerCase();

    return MASTER_PROPERTIES.filter((prop) => {
      if (propertyFilter !== 'all' && prop.id !== propertyFilter) return false;
      return true;
    })
      .map((prop) => {
        const restaurants = SOSEI_RESTAURANTS.filter((r) => {
          if (r.propertyId !== prop.id) return false;
          if (!q) return true;
          return (
            r.name.toLowerCase().includes(q) ||
            r.concept.toLowerCase().includes(q) ||
            r.cuisineTag.toLowerCase().includes(q) ||
            prop.name.toLowerCase().includes(q) ||
            prop.location.toLowerCase().includes(q)
          );
        });
        const inHouseCount = IN_HOUSE_FNB_GUESTS.filter((g) => g.propertyId === prop.id).length;
        return {
          property: prop,
          restaurants,
          inHouseCount,
        };
      })
      .filter((group) => group.restaurants.length > 0);
  }, [propertyFilter, restaurantSearch]);

  // ── Handle Selecting a Restaurant ────────────────────────────────────────
  const handleSelectRestaurant = (restaurant: SoseiRestaurant) => {
    setSelectedRestaurant(restaurant);
    setSelectedTable(restaurant.tables[0] || 'Table 01');
    setSelectedCategory('all');
    setMenuSearchQuery('');
    setGuestSearchQuery('');
    setGuestScope('property');
    setCart([]);

    // Default to the first in-house guest at this SOSEI property
    const propertyGuests = IN_HOUSE_FNB_GUESTS.filter(
      (g) => g.propertyId === restaurant.propertyId
    );
    setSelectedGuest(propertyGuests[0] || IN_HOUSE_FNB_GUESTS[0] || null);
  };

  // ── Filtered In-House Guests for Third Sidebar ───────────────────────────
  const filteredGuests = useMemo(() => {
    const q = guestSearchQuery.trim().toLowerCase();
    return IN_HOUSE_FNB_GUESTS.filter((g) => {
      if (
        guestScope === 'property' &&
        selectedRestaurant &&
        g.propertyId !== selectedRestaurant.propertyId
      ) {
        return false;
      }
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.room.toLowerCase().includes(q) ||
        g.property.toLowerCase().includes(q) ||
        g.allergies.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [guestScope, selectedRestaurant, guestSearchQuery]);

  // ── Filtered Regional Menu Items for Center Panel ────────────────────────
  const propertyMenuItems = useMemo(() => {
    if (!selectedRestaurant) return [];
    return FNB_MENU_ITEMS.filter((item) => item.propertyId === selectedRestaurant.propertyId);
  }, [selectedRestaurant]);

  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    propertyMenuItems.forEach((item) => {
      if (!map.has(item.category)) {
        map.set(item.category, item.categoryLabel);
      }
    });
    return [
      { id: 'all', label: 'All Menu' },
      ...Array.from(map.entries()).map(([id, label]) => ({ id, label })),
    ];
  }, [propertyMenuItems]);

  const filteredMenuItems = useMemo(() => {
    const q = menuSearchQuery.trim().toLowerCase();
    return propertyMenuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    });
  }, [propertyMenuItems, selectedCategory, menuSearchQuery]);

  // ── Cart & Order List Calculations ───────────────────────────────────────
  const subtotal = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0),
    [cart]
  );
  const serviceAndTax = useMemo(() => Math.round(subtotal * 0.2), [subtotal]);
  const grandTotal = subtotal + serviceAndTax;

  // ── Handle Selecting / Adding a Menu Item (with Rule 4 Allergy Modal) ────
  const handleSelectMenuItem = (item: FnbMenuItem) => {
    const { hasConflict, conflictingAllergens } = checkAllergyConflict(selectedGuest, item);
    const existingCartItem = cart.find((ci) => ci.menuItem.id === item.id);

    if (hasConflict) {
      // Rule 4: Item with allergy can still be selected, but opens confirmation modal with notes
      setAllergyNoteInput(existingCartItem?.notes || '');
      setPendingAllergyItem({
        item,
        conflictingAllergens,
        existingNote: existingCartItem?.notes,
        isEditingCartItem: false,
      });
      return;
    }

    // Safe item: add directly
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          menuItem: item,
          quantity: 1,
          hasAllergyWarning: false,
          conflictingAllergens: [],
        },
      ];
    });
  };

  // ── Confirm Allergy Item from Modal ──────────────────────────────────────
  const handleConfirmAllergyModal = () => {
    if (!pendingAllergyItem) return;
    const { item, conflictingAllergens, isEditingCartItem } = pendingAllergyItem;
    const cleanNote = allergyNoteInput.trim() || 'Allergy acknowledged — prepare with caution';

    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id
            ? {
                ...ci,
                quantity: isEditingCartItem ? ci.quantity : ci.quantity + 1,
                notes: cleanNote,
                hasAllergyWarning: conflictingAllergens.length > 0,
                conflictingAllergens,
              }
            : ci
        );
      }
      return [
        ...prev,
        {
          menuItem: item,
          quantity: 1,
          notes: cleanNote,
          hasAllergyWarning: conflictingAllergens.length > 0,
          conflictingAllergens,
        },
      ];
    });

    setPendingAllergyItem(null);
    setAllergyNoteInput('');
  };

  // ── Open Note Editor for an Existing Cart Item ───────────────────────────
  const handleEditCartItemNote = (cartItem: CartItem) => {
    const { conflictingAllergens } = checkAllergyConflict(selectedGuest, cartItem.menuItem);
    setAllergyNoteInput(cartItem.notes || '');
    setPendingAllergyItem({
      item: cartItem.menuItem,
      conflictingAllergens,
      existingNote: cartItem.notes,
      isEditingCartItem: true,
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  // ── When Switching Guest, Re-evaluate Cart Allergy Badges ────────────────
  const handleSelectGuest = (guest: FnbGuest) => {
    setSelectedGuest(guest);
    setCart((prev) =>
      prev.map((ci) => {
        const { hasConflict, conflictingAllergens } = checkAllergyConflict(guest, ci.menuItem);
        return {
          ...ci,
          hasAllergyWarning: hasConflict,
          conflictingAllergens,
        };
      })
    );
  };

  // ── Submit Order ─────────────────────────────────────────────────────────
  const handleCheckoutOrder = () => {
    if (!selectedRestaurant || !selectedGuest || cart.length === 0) return;

    setLastPlacedOrder({
      orderId: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      restaurant: selectedRestaurant,
      guest: selectedGuest,
      table: selectedTable,
      items: [...cart],
      subtotal,
      serviceAndTax,
      grandTotal,
    });
    setShowOrderSuccessModal(true);
    setCart([]);
  };

  // ============================================================================
  // VIEW 1: RESTAURANT SELECTION GROUPED BY SOSEI PROPERTY LIST
  // ============================================================================
  if (!selectedRestaurant) {
    return (
      <div className="w-full h-full flex flex-col bg-white text-zinc-900 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pt-4 lg:pt-6 pb-10">
        {/* Minimalist Header (Ma & Wabi-Sabi) */}
        <header className="shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-zinc-100 animate-card-enter">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              SOSEI F&B Point of Sale
            </p>
            <h1 className="text-xl lg:text-2xl font-normal text-zinc-900 tracking-tight leading-none">
              Select Dining Vanue
            </h1>
            <p className="text-[11px] text-zinc-500 font-normal mt-1.5">
              Choose a restaurant grouped by SOSEI property portfolio to open the in-house dining console.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-56 sm:w-64">
              <Magnifer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search restaurant or cuisine..."
                value={restaurantSearch}
                onChange={(e) => setRestaurantSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/50 text-[11px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>

            <button
              onClick={() => navigate('/dashboard/fnb')}
              className="px-3 py-1.5 rounded-lg border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap"
            >
              F&B Overview
            </button>
          </div>
        </header>

        {/* Property Filter Pills */}
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-3.5 border-b border-zinc-100">
          <button
            onClick={() => setPropertyFilter('all')}
            className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              propertyFilter === 'all'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900 border border-zinc-200/60'
            }`}
          >
            All SOSEI Properties ({MASTER_PROPERTIES.length})
          </button>
          {MASTER_PROPERTIES.map((prop) => (
            <button
              key={prop.id}
              onClick={() => setPropertyFilter(prop.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                propertyFilter === prop.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900 border border-zinc-200/60'
              }`}
            >
              {prop.name.replace('SOSEI ', '')}
            </button>
          ))}
        </div>

        {/* Grouped Property Sections */}
        <div className="flex-1 space-y-8 pt-6">
          {groupedPropertyRestaurants.map(({ property, restaurants, inHouseCount }) => (
            <section key={property.id} className="space-y-3 animate-card-enter">
              {/* Property Group Header */}
              <div className="flex items-baseline justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-baseline gap-2.5">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900">
                    {property.name}
                  </h2>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    {property.location}
                  </span>
                </div>
                <span className="text-[9.5px] text-zinc-400 font-medium">
                  {inHouseCount} In-House VIP Profiles · {restaurants.length} Venues
                </span>
              </div>

              {/* Restaurants Grid for this Property */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => handleSelectRestaurant(rest)}
                    className="group relative rounded-[12px] border border-zinc-200/70 bg-zinc-50/30 hover:bg-zinc-50/90 hover:border-zinc-300 hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col sm:flex-row"
                  >
                    {/* Restaurant Image */}
                    <div className="sm:w-48 md:w-52 h-40 sm:h-auto shrink-0 overflow-hidden bg-zinc-100 relative">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Minimalist Wabi-Sabi Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
                            {rest.cuisineTag}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-normal">
                            {rest.hours}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-zinc-900 mt-1 tracking-tight group-hover:text-black">
                          {rest.name}
                        </h3>

                        <p className="text-[10.5px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                          {rest.concept}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 font-normal">{rest.seating}</span>
                        <span className="font-medium text-zinc-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Enter Venue <AltArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: 3-COLUMN POS WORKSPACE (In-House Guest Sidebar | Menu | Order List)
  // ============================================================================
  return (
    <div className="w-full h-full flex flex-col bg-white text-zinc-900 overflow-hidden select-none">
      {/* Minimalist Top Bar */}
      <header className="shrink-0 h-14 border-b border-zinc-100 bg-white px-4 lg:px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-[10.5px] font-medium cursor-pointer transition-colors"
          >
            <AltArrowLeft size={12} />
            <span>Venues</span>
          </button>

          <div className="h-4 w-px bg-zinc-200" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                {selectedRestaurant.name}
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium hidden sm:inline">
                · {selectedRestaurant.propertyName}
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-400 truncate">
              {selectedRestaurant.propertyLocation} · {selectedRestaurant.cuisineTag}
            </p>
          </div>
        </div>

        {/* Right Controls: In-House Guests Toggle & Table Selector */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowInHouseGuests((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10.5px] font-medium cursor-pointer transition-all ${
              showInHouseGuests
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200/80 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
            title={showInHouseGuests ? 'Hide In-House Guests Panel' : 'Show In-House Guests Panel'}
          >
            <UsersGroupTwoRounded size={13} />
            <span>{showInHouseGuests ? 'Hide In-House Guests' : 'Show In-House Guests'}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                showInHouseGuests ? 'bg-white/20 text-white' : 'bg-zinc-200/80 text-zinc-700'
              }`}
            >
              {filteredGuests.length}
            </span>
          </button>

          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/70 rounded-lg px-2.5 py-1">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Table</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-transparent text-[10.5px] font-medium text-zinc-900 outline-none cursor-pointer"
            >
              {selectedRestaurant.tables.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* 3-Column POS Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ──────────────────────────────────────────────────────────────────────
            COLUMN 1 (THIRD SIDEBAR): IN-HOUSE GUESTS LIST TAB (COLLAPSIBLE HIDE/SHOW)
           ────────────────────────────────────────────────────────────────────── */}
        {showInHouseGuests ? (
          <aside className="w-[230px] lg:w-[260px] shrink-0 border-r border-zinc-100 bg-zinc-50/40 flex flex-col h-full transition-all duration-300">
            {/* Sidebar Header */}
            <div className="p-3.5 border-b border-zinc-100 space-y-2.5">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 truncate">
                    In-House Guests
                  </span>
                  <span className="text-[9px] text-zinc-400 font-medium shrink-0">
                    ({filteredGuests.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInHouseGuests(false)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 cursor-pointer transition-colors shrink-0"
                  title="Hide In-House Guests"
                >
                  <AltArrowLeft size={11} />
                  <span>Hide</span>
                </button>
              </div>

            {/* Scope Toggle: Current Property vs All SOSEI */}
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-zinc-100/80 rounded-lg text-[9.5px]">
              <button
                onClick={() => setGuestScope('property')}
                className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
                  guestScope === 'property'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {selectedRestaurant.propertyName.replace('SOSEI ', '')}
              </button>
              <button
                onClick={() => setGuestScope('all')}
                className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
                  guestScope === 'all'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                All Portfolio
              </button>
            </div>

            {/* Guest Search */}
            <div className="relative">
              <Magnifer size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter guest or room..."
                value={guestSearchQuery}
                onChange={(e) => setGuestSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-zinc-200/80 bg-white text-[10.5px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
          </div>

          {/* Guest List Tabs */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5">
            {filteredGuests.map((guest) => {
              const isSelected = selectedGuest?.id === guest.id;
              const hasAllergies = guest.allergies.length > 0;

              return (
                <button
                  key={guest.id}
                  onClick={() => handleSelectGuest(guest)}
                  className={`w-full text-left p-2.5 rounded-[10px] border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-zinc-900 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-white/80 hover:border-zinc-200/70'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900" />
                  )}

                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-[11px] font-semibold text-zinc-900 leading-tight truncate">
                      {guest.name}
                    </span>
                    <span className="text-[8.5px] text-zinc-400 font-medium shrink-0">
                      {guest.partySize} pax
                    </span>
                  </div>

                  <p className="text-[9.5px] text-zinc-500 mt-0.5 truncate">
                    {guest.room}
                  </p>

                  {/* Minimalist Allergy Indicator */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hasAllergies ? (
                      guest.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="inline-flex items-center px-1.5 py-0.2 rounded text-[8.5px] font-medium bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-[8.5px] text-zinc-400 font-normal">
                        No registered allergies
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          </aside>
        ) : (
          <aside className="w-10 shrink-0 border-r border-zinc-100 bg-zinc-50/50 flex flex-col items-center py-3 justify-between h-full">
            <button
              type="button"
              onClick={() => setShowInHouseGuests(true)}
              className="flex flex-col items-center gap-2 py-2 px-1 rounded-lg hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900 cursor-pointer transition-colors"
              title="Show In-House Guests"
            >
              <AltArrowRight size={13} />
              <UsersGroupTwoRounded size={14} />
              <span
                className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 py-1"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                In-House Guests ({filteredGuests.length})
              </span>
            </button>
          </aside>
        )}

        {/* ──────────────────────────────────────────────────────────────────────
            COLUMN 2 (CENTER): REGIONAL MENU CATALOG (MA & WABI-SABI)
           ────────────────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
          {/* Category Tabs & Search Bar */}
          <div className="shrink-0 px-5 py-3 border-b border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-[10.5px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Dish Search */}
            <div className="relative w-full sm:w-56">
              <Magnifer size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search dish or ingredient..."
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 rounded-lg border border-zinc-200/80 bg-zinc-50/50 text-[10.5px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                showInHouseGuests ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
              } gap-4`}
            >
              {filteredMenuItems.map((item) => {
                const { hasConflict, conflictingAllergens } = checkAllergyConflict(
                  selectedGuest,
                  item
                );
                const cartEntry = cart.find((ci) => ci.menuItem.id === item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMenuItem(item)}
                    className={`group rounded-[12px] border p-3.5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                      hasConflict
                        ? 'border-[#fecdd3] bg-[#fff1f2]/20 hover:bg-[#fff1f2]/40'
                        : 'border-zinc-200/70 bg-zinc-50/30 hover:bg-zinc-50/80 hover:border-zinc-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Dish Image */}
                      <div className="relative h-36 w-full rounded-[8px] overflow-hidden bg-zinc-100 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {item.isChefSignature && (
                          <span className="absolute top-2 left-2 bg-zinc-900/85 text-white text-[8.5px] font-medium uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <ChefHat size={10} /> Signature
                          </span>
                        )}
                        {cartEntry && (
                          <span className="absolute top-2 right-2 bg-zinc-900 text-white text-[9.5px] font-semibold px-2 py-0.5 rounded">
                            {cartEntry.quantity} in order
                          </span>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[11.5px] font-semibold text-zinc-900 leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-[11.5px] font-semibold text-zinc-900 shrink-0">
                          ${item.price}
                        </span>
                      </div>

                      {/* Concise Description */}
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Minimalist Footer: Allergen Status & Action */}
                    <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      {hasConflict ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80 truncate">
                          <ShieldWarning size={11} className="shrink-0" />
                          <span>Allergen: {conflictingAllergens.join(', ')}</span>
                        </span>
                      ) : item.allergens.length > 0 ? (
                        <span className="text-[9px] text-zinc-400 truncate">
                          Contains: {item.allergens.join(', ')}
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#14532d] font-medium">
                          Allergen-Free
                        </span>
                      )}

                      <span className="text-[10px] font-medium text-zinc-900 shrink-0 group-hover:underline">
                        {hasConflict ? '+ Add with Note' : '+ Add'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ──────────────────────────────────────────────────────────────────────
            COLUMN 3 (RIGHT): ORDER LIST
           ────────────────────────────────────────────────────────────────────── */}
        <aside className="w-[290px] lg:w-[330px] shrink-0 border-l border-zinc-100 bg-zinc-50/30 flex flex-col justify-between h-full">
          {/* Order Header & Selected Guest Summary */}
          <div className="p-4 border-b border-zinc-100 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                Order List
              </span>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[9.5px] text-zinc-400 hover:text-[#800020] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <TrashBinTrash size={12} /> Clear
                </button>
              )}
            </div>

            {selectedGuest ? (
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-900">
                    {selectedGuest.name}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-medium">
                    {selectedGuest.folioNumber}
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500">
                  {selectedGuest.room} · {selectedTable}
                </p>
                {selectedGuest.allergies.length > 0 && (
                  <div className="pt-1 flex items-center gap-1 flex-wrap">
                    <span className="text-[8.5px] text-[#800020] font-medium">
                      Allergies: {selectedGuest.allergies.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 text-[10px] text-zinc-400">
                Select an in-house guest from the left panel.
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-zinc-400 space-y-1.5">
                <UsersGroupTwoRounded size={22} className="opacity-40" />
                <p className="text-[11px] font-medium text-zinc-600">No items in order</p>
                <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                  Select dishes from {selectedRestaurant.name} menu to build the dining order.
                </p>
              </div>
            ) : (
              cart.map((ci) => (
                <div
                  key={ci.menuItem.id}
                  className="p-3 rounded-[10px] bg-white border border-zinc-200/70 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-semibold text-zinc-900 leading-snug">
                        {ci.menuItem.name}
                      </h4>
                      <span className="text-[9.5px] text-zinc-400">
                        ${ci.menuItem.price} each
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-900 shrink-0">
                      ${ci.menuItem.price * ci.quantity}
                    </span>
                  </div>

                  {/* Allergy / Kitchen Note Display */}
                  {ci.notes && (
                    <div
                      onClick={() => handleEditCartItemNote(ci)}
                      className={`p-2 rounded-md text-[9.5px] flex items-start justify-between gap-2 cursor-pointer ${
                        ci.hasAllergyWarning
                          ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                          : 'bg-zinc-50 text-zinc-600 border border-zinc-200/60'
                      }`}
                    >
                      <div className="leading-relaxed">
                        {ci.hasAllergyWarning && (
                          <span className="font-semibold block">
                            Allergy Note ({ci.conflictingAllergens?.join(', ')}):
                          </span>
                        )}
                        <span>{ci.notes}</span>
                      </div>
                      <Pen size={11} className="shrink-0 mt-0.5 opacity-70" />
                    </div>
                  )}

                  {/* Quantity & Note Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 border border-zinc-200 rounded-md px-2 py-0.5 bg-zinc-50/50">
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, -1)}
                        className="text-zinc-600 hover:text-zinc-900 font-semibold text-xs cursor-pointer px-1"
                      >
                        -
                      </button>
                      <span className="text-[10.5px] font-semibold text-zinc-900 min-w-[14px] text-center">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, 1)}
                        className="text-zinc-600 hover:text-zinc-900 font-semibold text-xs cursor-pointer px-1"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {!ci.notes && (
                        <button
                          onClick={() => handleEditCartItemNote(ci)}
                          className="text-[9.5px] text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                        >
                          + Note
                        </button>
                      )}
                      <button
                        onClick={() => removeFromCart(ci.menuItem.id)}
                        className="text-[9.5px] text-zinc-400 hover:text-[#800020] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Totals & Submit */}
          <div className="p-4 border-t border-zinc-100 bg-white space-y-3">
            <div className="space-y-1 text-[10.5px]">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Service & Tax (20%)</span>
                <span>${serviceAndTax}</span>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex justify-between text-xs font-semibold text-zinc-900">
                <span>Total Folio Charge</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutOrder}
              disabled={cart.length === 0 || !selectedGuest}
              className={`w-full py-2.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                cart.length > 0 && selectedGuest
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle size={14} />
              <span>Send Order & Charge Folio</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ========================================================================
          MODAL 1 (RULE 4): ALLERGY CONFIRMATION & KITCHEN NOTES MODAL
         ======================================================================== */}
      {pendingAllergyItem &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Full-viewport Backdrop covering sidebars and all workspace panels */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
              onClick={() => setPendingAllergyItem(null)}
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative z-10 bg-white w-full max-w-md rounded-[12px] border border-zinc-200 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pendingAllergyItem.conflictingAllergens.length > 0 ? (
                    <ShieldWarning size={16} className="text-[#800020] shrink-0" />
                  ) : (
                    <Pen size={15} className="text-zinc-700 shrink-0" />
                  )}
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                    {pendingAllergyItem.conflictingAllergens.length > 0
                      ? 'Allergy Confirmation & Notes'
                      : 'Kitchen Instruction Note'}
                  </h3>
                </div>
                <button
                  onClick={() => setPendingAllergyItem(null)}
                  className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
                >
                  <CloseCircle size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-zinc-900">
                      {pendingAllergyItem.item.name}
                    </span>
                    <span className="text-zinc-500 font-medium">
                      ${pendingAllergyItem.item.price}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Ingredients: {pendingAllergyItem.item.ingredients.join(', ')}
                  </p>
                </div>

                {pendingAllergyItem.conflictingAllergens.length > 0 && selectedGuest && (
                  <div className="p-3 rounded-lg bg-[#fff1f2] border border-[#fecdd3]/80 text-[#800020] space-y-1">
                    <p className="text-[10.5px] font-semibold">
                      Allergen Match: {pendingAllergyItem.conflictingAllergens.join(', ')}
                    </p>
                    <p className="text-[10px] leading-relaxed opacity-90">
                      {selectedGuest.name} ({selectedGuest.room}) has a registered allergy to{' '}
                      <strong>{selectedGuest.allergies.join(', ')}</strong>. Please add kitchen
                      preparation or modification notes before confirming.
                    </p>
                  </div>
                )}

                {/* Quick Preset Chips */}
                <div className="space-y-1.5">
                  <label className="block text-[9.5px] font-medium text-zinc-400">
                    Quick Kitchen Instructions
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ALLERGY_NOTES.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          setAllergyNoteInput((prev) =>
                            prev ? `${prev}; ${preset}` : preset
                          )
                        }
                        className="px-2 py-1 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[9.5px] text-zinc-700 cursor-pointer transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-[9.5px] font-medium text-zinc-400">
                    Kitchen / Allergy Modification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={allergyNoteInput}
                    onChange={(e) => setAllergyNoteInput(e.target.value)}
                    placeholder="Add notes for the chef (e.g., omit allergen ingredient, prepare in separate pan)..."
                    autoFocus
                    className="w-full p-2.5 rounded-lg border border-zinc-200 bg-white text-[11px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-2">
                <button
                  onClick={() => setPendingAllergyItem(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-[11px] font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAllergyModal}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium cursor-pointer"
                >
                  {pendingAllergyItem.isEditingCartItem
                    ? 'Save Note'
                    : 'Confirm & Add to Order'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================
          MODAL 2: ORDER SENT CONFIRMATION
         ======================================================================== */}
      {showOrderSuccessModal &&
        lastPlacedOrder &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
              onClick={() => setShowOrderSuccessModal(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative z-10 bg-white w-full max-w-sm rounded-[12px] border border-zinc-200 shadow-2xl p-5 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80 flex items-center justify-center mx-auto">
                <CheckCircle size={20} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#14532d]">
                  Order Dispatched
                </p>
                <h3 className="text-base font-semibold text-zinc-900 mt-1">
                  {lastPlacedOrder.restaurant.name}
                </h3>
                <p className="text-[10.5px] text-zinc-500 mt-0.5">
                  Order #{lastPlacedOrder.orderId} · Billed to {lastPlacedOrder.guest.name} (
                  {lastPlacedOrder.guest.room})
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/70 text-left text-[10.5px] space-y-1.5">
                <div className="flex justify-between text-zinc-500">
                  <span>Property</span>
                  <span className="text-zinc-900 font-medium">
                    {lastPlacedOrder.restaurant.propertyName}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Table / Delivery</span>
                  <span className="text-zinc-900 font-medium">{lastPlacedOrder.table}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Items</span>
                  <span className="text-zinc-900 font-medium">
                    {lastPlacedOrder.items.reduce((s, i) => s + i.quantity, 0)} dishes
                  </span>
                </div>
                <div className="pt-1.5 border-t border-zinc-200/70 flex justify-between font-semibold text-zinc-900">
                  <span>Total Charged</span>
                  <span>${lastPlacedOrder.grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setShowOrderSuccessModal(false)}
                className="w-full py-2 rounded-lg bg-zinc-900 text-white text-[11px] font-medium hover:bg-zinc-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
