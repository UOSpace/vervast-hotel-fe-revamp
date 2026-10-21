import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Magnifer,
  CloseCircle,
  TrashBinTrash,
  CheckCircle,
  ShieldWarning,
  DangerTriangle,
  UsersGroupTwoRounded,
  ChefHat,
  AltArrowLeft,
  AltArrowRight,
  Eye,
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
}

const getRestaurantCode = (restaurant: SoseiRestaurant) =>
  restaurant.id.replace(/^rest-/, '');

const findRestaurantByCode = (code?: string): SoseiRestaurant | null => {
  if (!code) return null;
  const normalized = code.trim().toLowerCase();
  return (
    SOSEI_RESTAURANTS.find(
      (r) =>
        r.id.toLowerCase() === normalized ||
        getRestaurantCode(r).toLowerCase() === normalized
    ) || null
  );
};

const getDefaultGuestForRestaurant = (restaurant: SoseiRestaurant | null): FnbGuest | null => {
  if (!restaurant) return null;
  const propertyGuests = IN_HOUSE_FNB_GUESTS.filter(
    (g) => g.propertyId === restaurant.propertyId
  );
  const guestWithAllergy = propertyGuests.find((g) => g.allergies.length > 0);
  return guestWithAllergy || propertyGuests[0] || IN_HOUSE_FNB_GUESTS[0] || null;
};

export function FnbPosPage() {
  const navigate = useNavigate();
  const { restaurantCode } = useParams<{ restaurantCode?: string }>();

  // ── FLOW STEP 1: Restaurant Derived Directly from URL :restaurantCode ────
  const selectedRestaurant = useMemo(
    () => findRestaurantByCode(restaurantCode),
    [restaurantCode]
  );
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [restaurantSearch, setRestaurantSearch] = useState<string>('');

  // ── FLOW STEP 2: 3-Column POS Workspace State ────────────────────────────
  const [selectedGuest, setSelectedGuest] = useState<FnbGuest | null>(() =>
    getDefaultGuestForRestaurant(selectedRestaurant)
  );
  const [guestScope, setGuestScope] = useState<'property' | 'all'>('property');
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [showInHouseGuests, setShowInHouseGuests] = useState<boolean>(true);
  const [hideConflictingAllergens, setHideConflictingAllergens] = useState<boolean>(false);
  const [inspectIngredientsItem, setInspectIngredientsItem] = useState<FnbMenuItem | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>(
    () => selectedRestaurant?.tables[0] || 'Table 01'
  );

  // Cart / Order List
  const [cart, setCart] = useState<CartItem[]>([]);

  // Keep table & default guest synced when URL changes via browser Back/Forward or direct entry
  const [syncedRestaurantId, setSyncedRestaurantId] = useState<string | null>(
    () => selectedRestaurant?.id || null
  );
  if ((selectedRestaurant?.id || null) !== syncedRestaurantId) {
    setSyncedRestaurantId(selectedRestaurant?.id || null);
    if (selectedRestaurant) {
      setSelectedTable(selectedRestaurant.tables[0] || 'Table 01');
      setSelectedCategory('all');
      setMenuSearchQuery('');
      setGuestSearchQuery('');
      setGuestScope('property');
      setCart([]);
      setSelectedGuest(getDefaultGuestForRestaurant(selectedRestaurant));
    }
  }

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
  const posProperties = useMemo(
    () =>
      MASTER_PROPERTIES.map((prop) => ({
        property: prop,
        totalRestaurants: SOSEI_RESTAURANTS.filter((r) => r.propertyId === prop.id).length,
      })),
    []
  );

  const visiblePropertyCount = useMemo(
    () => posProperties.filter((p) => p.totalRestaurants >= 2).length,
    [posProperties]
  );

  const groupedPropertyRestaurants = useMemo(() => {
    const q = restaurantSearch.trim().toLowerCase();

    return posProperties
      .filter(({ property: prop }) => {
        if (propertyFilter !== 'all' && prop.id !== propertyFilter) return false;
        return true;
      })
      .map(({ property: prop, totalRestaurants }) => {
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
          totalRestaurants,
          inHouseCount,
        };
      })
      .filter((group) => group.restaurants.length > 0)
      .sort((a, b) => b.totalRestaurants - a.totalRestaurants);
  }, [posProperties, propertyFilter, restaurantSearch]);

  // ── Handle Selecting a Restaurant ────────────────────────────────────────
  const handleSelectRestaurant = (restaurant: SoseiRestaurant) => {
    setSyncedRestaurantId(restaurant.id);
    setSelectedTable(restaurant.tables[0] || 'Table 01');
    setSelectedCategory('all');
    setMenuSearchQuery('');
    setGuestSearchQuery('');
    setGuestScope('property');
    setCart([]);
    setSelectedGuest(getDefaultGuestForRestaurant(restaurant));
    navigate(`/dashboard/fnb/pos/${getRestaurantCode(restaurant)}`);
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
      { id: 'all', label: 'All Dishes' },
      ...Array.from(map.entries()).map(([id, label]) => ({ id, label })),
    ];
  }, [propertyMenuItems]);

  const filteredMenuItems = useMemo(() => {
    const q = menuSearchQuery.trim().toLowerCase();
    return propertyMenuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (hideConflictingAllergens && checkAllergyConflict(selectedGuest, item).hasConflict) {
        return false;
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    });
  }, [propertyMenuItems, selectedCategory, menuSearchQuery, hideConflictingAllergens, selectedGuest]);

  // ── Cart & Order List Calculations ───────────────────────────────────────
  const subtotal = useMemo(
    () => cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0),
    [cart]
  );
  const serviceCharge = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const luxuryTax = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const serviceAndTax = serviceCharge + luxuryTax;
  const grandTotal = subtotal + serviceAndTax;

  // ── Handle Selecting / Adding a Menu Item (Strict Allergy Lock) ──────────
  const handleSelectMenuItem = (item: FnbMenuItem) => {
    const { hasConflict } = checkAllergyConflict(selectedGuest, item);

    // Strictly lock dishes with allergy conflicts — cannot be selected
    if (hasConflict) {
      return;
    }

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
        },
      ];
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

  // ── When Switching Guest, Automatically Remove Conflicting Items ─────────
  const handleSelectGuest = (guest: FnbGuest) => {
    setSelectedGuest(guest);
    setCart((prev) =>
      prev.filter((ci) => !checkAllergyConflict(guest, ci.menuItem).hasConflict)
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
              Select Dining Venue
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
            All SOSEI Properties ({visiblePropertyCount})
          </button>
          {posProperties.map(({ property: prop, totalRestaurants }) => (
            <button
              key={prop.id}
              onClick={() => setPropertyFilter(prop.id)}
              className={`${totalRestaurants < 2 ? 'hidden ' : ''}px-3 py-1 rounded-full text-[10px] font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
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
          {groupedPropertyRestaurants.map(({ property, restaurants, totalRestaurants }) => (
            <section
              key={property.id}
              className={totalRestaurants < 2 ? 'hidden' : 'space-y-3 animate-card-enter'}
            >
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
    <div className="w-full h-full flex flex-col bg-white text-zinc-900 overflow-hidden select-none animate-fade-in">
      {/* Top POS Bar */}
      <header className="shrink-0 h-14 border-b border-zinc-100 bg-white px-4 lg:px-5 flex items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/dashboard/fnb/pos')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-[10.5px] font-medium cursor-pointer transition-colors shrink-0"
          >
            <AltArrowLeft size={12} />
            <span>Venues</span>
          </button>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                SOSEI F&B Point of Sale (POS)
              </h1>
            </div>
            {/* <p className="text-[9.5px] text-zinc-500 truncate">
              {selectedRestaurant.name} · {selectedTable} · {selectedRestaurant.propertyName}
            </p> */}
          </div>
        </div>

        {/* Right Controls: Active Guest Pill, In-House Guests Toggle & Back to Dashboard */}
        <div className="flex items-center gap-2.5 shrink-0">
          {selectedGuest && (
            <button
              type="button"
              onClick={() => setShowInHouseGuests((prev) => !prev)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl border text-left transition-all cursor-pointer ${
                selectedGuest.allergies.length > 0
                  ? 'border-[#fecdd3] bg-[#fff1f2]/60 hover:bg-[#fff1f2]'
                  : 'border-zinc-200/80 bg-zinc-50/70 hover:bg-zinc-100'
              }`}
              title="Click to toggle In-House Guests panel"
            >
              <UsersGroupTwoRounded
                size={14}
                className={
                  selectedGuest.allergies.length > 0 ? 'text-[#800020]' : 'text-zinc-700'
                }
              />
              <div className="leading-tight">
                <p
                  className={`text-[10.5px] font-bold ${
                    selectedGuest.allergies.length > 0 ? 'text-[#800020]' : 'text-zinc-900'
                  }`}
                >
                  {selectedGuest.name}
                </p>
                <p
                  className={`text-[9px] ${
                    selectedGuest.allergies.length > 0 ? 'text-[#800020]/80' : 'text-zinc-500'
                  }`}
                >
                  {selectedGuest.room}
                </p>
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/dashboard/fnb')}
            className="px-3 py-1.5 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 text-[10.5px] font-medium text-zinc-700 hover:text-zinc-900 cursor-pointer transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Full-Width Medical Allergies Alert Banner */}
      {selectedGuest && (
        <div
          className={`shrink-0 px-4 lg:px-5 py-2 border-b flex flex-wrap items-center justify-between gap-3 ${
            selectedGuest.allergies.length > 0
              ? 'bg-[#fff1f2] border-[#fecdd3]/80'
              : 'bg-[#ecfdf5]/60 border-[#bbf7d0]/70'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {selectedGuest.allergies.length > 0 ? (
              <>
                <ShieldWarning size={15} className="text-[#e11d48] shrink-0" />
                <span className="text-[11px] font-bold text-[#800020]">
                  {selectedGuest.name} ({selectedGuest.room})
                </span>
                <span className="text-[#fda4af]">|</span>
                <span className="text-[10.5px] font-medium text-[#800020]">
                  Medical Allergies:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedGuest.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white text-[9px] font-bold uppercase tracking-wider"
                    >
                      <DangerTriangle size={10} />
                      <span>{allergy}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <CheckCircle size={14} className="text-[#14532d] shrink-0" />
                <span className="text-[11px] font-semibold text-zinc-900">
                  {selectedGuest.name} ({selectedGuest.room})
                </span>
                <span className="text-zinc-300">|</span>
                <span className="text-[10.5px] font-medium text-[#14532d]">
                  Medical Allergies: None Registered — All dishes available
                </span>
              </>
            )}
          </div>

          {selectedGuest.allergies.length > 0 && (
            <div className="flex items-center shrink-0">
              <span className="text-[10px] font-semibold text-[#e11d48] hidden sm:inline">
                Conflicting dishes are locked automatically
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3-Column POS Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ──────────────────────────────────────────────────────────────────────
            COLUMN 1 (THIRD SIDEBAR): IN-HOUSE GUESTS LIST TAB (COLLAPSIBLE HIDE/SHOW)
           ────────────────────────────────────────────────────────────────────── */}
        {showInHouseGuests ? (
          <aside className="w-[230px] lg:w-[255px] shrink-0 border-r border-zinc-100 bg-zinc-50/40 flex flex-col h-full transition-all duration-300">
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
            COLUMN 2 (CENTER): REGIONAL MENU CATALOG (ALLERGY SAFE KDS)
           ────────────────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
          {/* Search & Category Filter Header */}
          <div className="shrink-0 px-5 py-3 border-b border-zinc-100 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Dish Search */}
              <div className="relative w-full sm:w-80">
                <Magnifer size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search dishes or ingredients (e.g. wagyu, caviar, truffle)..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/40 text-[11px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                />
              </div>

              {/* Hide Conflicting Allergens Checkbox */}
              <label className="inline-flex items-center gap-2 text-[11px] text-zinc-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideConflictingAllergens}
                  onChange={(e) => setHideConflictingAllergens(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                />
                <span>Hide Conflicting Allergens</span>
              </label>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-0.5">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-[10.5px] font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-200/80 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                showInHouseGuests ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-3'
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
                    onClick={() => {
                      if (!hasConflict) {
                        handleSelectMenuItem(item);
                      }
                    }}
                    className={`group rounded-[14px] border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      hasConflict
                        ? 'border-[#fecdd3]/80 bg-zinc-50/70 opacity-60 cursor-not-allowed'
                        : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-md hover:shadow-black/5 cursor-pointer'
                    }`}
                  >
                    <div>
                      {/* Dish Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            hasConflict ? 'grayscale-[60%] opacity-65' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                        />

                        {/* Top-Left Dietary & Signature Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
                          {item.isChefSignature && (
                            <span className="bg-zinc-900/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ChefHat size={10} /> SIGNATURE
                            </span>
                          )}
                          {item.dietaryBadges.slice(0, 2).map((badge) => (
                            <span
                              key={badge}
                              className="bg-white/95 text-zinc-800 text-[8.5px] font-semibold px-2 py-0.5 rounded-full shadow-2xs"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Bottom-Right Price Pill */}
                        <span className="absolute bottom-2.5 right-2.5 bg-zinc-900/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                          ${item.price}
                        </span>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-3.5 pb-2">
                        {/* Conflict Locked Banner */}
                        {hasConflict && (
                          <div className="mb-2.5 px-2.5 py-1 rounded-md bg-[#e11d48] text-white flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold truncate">
                              <ShieldWarning size={12} className="shrink-0" />
                              <span className="truncate">
                                CONFLICT: Contains {conflictingAllergens.join(', ')}
                              </span>
                            </span>
                            <span className="text-[8.5px] font-bold uppercase tracking-wider shrink-0">
                              LOCKED
                            </span>
                          </div>
                        )}

                        {/* Dish Title */}
                        <h3
                          className={`text-[13px] font-bold leading-snug ${
                            hasConflict ? 'text-zinc-500' : 'text-zinc-900'
                          }`}
                        >
                          {item.name}
                        </h3>

                        {/* Concise Description */}
                        <p
                          className={`text-[10.5px] mt-1 line-clamp-2 leading-relaxed ${
                            hasConflict ? 'text-zinc-400' : 'text-zinc-500'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: View Ingredients & Action / Locked State */}
                    <div className="px-3.5 pb-3.5 pt-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectIngredientsItem(item);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer whitespace-nowrap"
                      >
                        <Eye size={12} className="shrink-0" />
                        <span>View Ingredients</span>
                      </button>

                      {hasConflict ? (
                        <button
                          type="button"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-[#800020]/70 border border-[#fecdd3] text-[10px] font-semibold cursor-not-allowed whitespace-nowrap shrink-0"
                        >
                          <ShieldWarning size={12} className="text-[#e11d48]/80 shrink-0" />
                          <span>Locked</span>
                        </button>
                      ) : cartEntry ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-3 px-3 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold"
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="hover:text-zinc-300 cursor-pointer px-0.5"
                          >
                            -
                          </button>
                          <span className="min-w-[12px] text-center">{cartEntry.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="hover:text-zinc-300 cursor-pointer px-0.5"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMenuItem(item);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-semibold cursor-pointer transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ──────────────────────────────────────────────────────────────────────
            COLUMN 3 (RIGHT): GUEST DINING FOLIO (NO TAKE NOTE)
           ────────────────────────────────────────────────────────────────────── */}
        <aside className="w-[295px] lg:w-[340px] shrink-0 border-l border-zinc-100 bg-white flex flex-col justify-between h-full">
          {/* Folio Header & Venue / Table Selectors */}
          <div className="p-4 border-b border-zinc-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                GUEST DINING FOLIO
              </span>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-zinc-400 hover:text-[#800020] cursor-pointer transition-colors"
                  title="Clear Folio"
                >
                  <TrashBinTrash size={14} />
                </button>
              )}
            </div>

            {selectedGuest ? (
              <div>
                <h2 className="text-sm font-bold text-zinc-900 leading-tight">
                  {selectedGuest.name}
                </h2>
                <p className="text-[10.5px] text-zinc-500 mt-0.5">
                  {selectedGuest.room} · {selectedGuest.folioNumber}
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 text-[10px] text-zinc-400">
                Select an in-house guest from the left panel.
              </div>
            )}

            {/* Dining Venue & Table / Delivery Selectors */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2 rounded-lg border border-zinc-200/80 bg-zinc-50/40">
                <span className="block text-[8.5px] text-zinc-400 font-medium">Dining Venue</span>
                <select
                  value={selectedRestaurant.id}
                  onChange={(e) => {
                    const nextRest = SOSEI_RESTAURANTS.find((r) => r.id === e.target.value);
                    if (nextRest) handleSelectRestaurant(nextRest);
                  }}
                  className="w-full bg-transparent text-[10.5px] font-semibold text-zinc-900 outline-none cursor-pointer truncate mt-0.5"
                >
                  {SOSEI_RESTAURANTS.filter(
                    (r) => r.propertyId === selectedRestaurant.propertyId
                  ).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2 rounded-lg border border-zinc-200/80 bg-zinc-50/40">
                <span className="block text-[8.5px] text-zinc-400 font-medium">
                  Table / Delivery
                </span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full bg-transparent text-[10.5px] font-semibold text-zinc-900 outline-none cursor-pointer truncate mt-0.5"
                >
                  {selectedRestaurant.tables.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Items (Clean — No Take Note) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-zinc-400 space-y-1.5">
                <UsersGroupTwoRounded size={22} className="opacity-40" />
                <p className="text-[11px] font-medium text-zinc-600">No items in folio</p>
                <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                  Select allergy-safe dishes from {selectedRestaurant.name} menu to build the dining folio.
                </p>
              </div>
            ) : (
              cart.map((ci) => (
                <div
                  key={ci.menuItem.id}
                  className="p-3 rounded-[10px] bg-white border border-zinc-200/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[11.5px] font-bold text-zinc-900 leading-snug">
                        {ci.menuItem.name}
                      </h4>
                      <span className="text-[9.5px] text-zinc-400">
                        ${ci.menuItem.price} each · {ci.menuItem.categoryLabel}
                      </span>
                    </div>
                    <span className="text-[11.5px] font-bold text-zinc-900 shrink-0">
                      ${ci.menuItem.price * ci.quantity}
                    </span>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-2.5 border border-zinc-200 rounded-md px-2.5 py-0.5 bg-zinc-50/50">
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, -1)}
                        className="text-zinc-600 hover:text-zinc-900 font-semibold text-xs cursor-pointer px-1"
                      >
                        -
                      </button>
                      <span className="text-[10.5px] font-bold text-zinc-900 min-w-[14px] text-center">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, 1)}
                        className="text-zinc-600 hover:text-zinc-900 font-semibold text-xs cursor-pointer px-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(ci.menuItem.id)}
                      className="text-[10px] font-medium text-[#e11d48] hover:text-[#800020] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Totals & Submit */}
          <div className="p-4 border-t border-zinc-100 bg-white space-y-3">
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-zinc-500">
                <span>Food & Beverage Subtotal</span>
                <span className="text-zinc-800 font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Service Charge (10%)</span>
                <span className="text-zinc-800 font-medium">${serviceCharge}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Hospitality Luxury Tax (10%)</span>
                <span className="text-zinc-800 font-medium">${luxuryTax}</span>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex justify-between text-xs font-bold text-zinc-900">
                <span>Total Folio Charge</span>
                <span className="text-sm">${grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutOrder}
              disabled={cart.length === 0 || !selectedGuest}
              className={`w-full py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                cart.length > 0 && selectedGuest
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle size={14} />
              <span>Charge to Villa Folio & Send KDS</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ========================================================================
          MODAL 1: VIEW INGREDIENTS & ALLERGEN BREAKDOWN
         ======================================================================== */}
      {inspectIngredientsItem &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity animate-fade-in"
              onClick={() => setInspectIngredientsItem(null)}
            />

            <div
              role="dialog"
              aria-modal="true"
              className="relative z-10 bg-white w-full max-w-md rounded-[12px] border border-zinc-200 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                  Dish Ingredients & Allergen Profile
                </h3>
                <button
                  onClick={() => setInspectIngredientsItem(null)}
                  className="text-zinc-400 hover:text-zinc-900 cursor-pointer"
                >
                  <CloseCircle size={18} />
                </button>
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900 text-sm">
                      {inspectIngredientsItem.name}
                    </span>
                    <span className="text-zinc-900 font-bold">
                      ${inspectIngredientsItem.price}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-zinc-500 mt-1 leading-relaxed">
                    {inspectIngredientsItem.description}
                  </p>
                </div>

                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Complete Ingredients ({inspectIngredientsItem.ingredients.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectIngredientsItem.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-[10px] font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Registered Allergens
                  </p>
                  {inspectIngredientsItem.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {inspectIngredientsItem.allergens.map((alg) => (
                        <span
                          key={alg}
                          className="px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#800020] border border-[#fecdd3] text-[10px] font-semibold"
                        >
                          {alg}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10.5px] text-[#14532d] font-medium">
                      Allergen-Free
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                <button
                  onClick={() => setInspectIngredientsItem(null)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium cursor-pointer"
                >
                  Close
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
