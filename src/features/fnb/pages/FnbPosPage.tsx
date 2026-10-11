import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Magnifer,
  CloseCircle,
  AltArrowDown,
  TrashBinTrash,
  CheckCircle,
  DangerCircle,
  ShieldWarning,
  Shop2,
  UsersGroupTwoRounded,
  ChefHat,
  Eye,
  AddSquare
} from '@solar-icons/react';
import {
  IN_HOUSE_FNB_GUESTS,
  FNB_MENU_ITEMS,
  checkAllergyConflict,
  type FnbGuest,
  type FnbMenuItem,
} from '../data/fnbMenuData';

interface CartItem {
  menuItem: FnbMenuItem;
  quantity: number;
  specialInstructions?: string;
}

export function FnbPosPage() {
  const navigate = useNavigate();

  // State
  const [selectedGuest, setSelectedGuest] = useState<FnbGuest | null>(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(true); // prompt says: harus memilih guestnya dulu!
  const [guestSearchQuery, setGuestSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [hideAllergens, setHideAllergens] = useState(false);

  const [activeItemForModal, setActiveItemForModal] = useState<FnbMenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('Seascape Ocean Restaurant');
  const [selectedTable, setSelectedTable] = useState('Table 04 (Terrace)');

  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any>(null);

  // Filtered in-house guests for selection
  const filteredGuests = useMemo(() => {
    return IN_HOUSE_FNB_GUESTS.filter((g) => {
      const q = guestSearchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.room.toLowerCase().includes(q) ||
        g.property.toLowerCase().includes(q) ||
        g.allergies.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [guestSearchQuery]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return FNB_MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query match (name, description, or ingredients)
      if (menuSearchQuery.trim()) {
        const q = menuSearchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIng = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }
      // Hide allergens filter
      if (hideAllergens && selectedGuest) {
        const { hasConflict } = checkAllergyConflict(selectedGuest, item);
        if (hasConflict) return false;
      }
      return true;
    });
  }, [selectedCategory, menuSearchQuery, hideAllergens, selectedGuest]);

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  }, [cart]);

  const serviceCharge = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const hospitalityTax = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const grandTotal = subtotal + serviceCharge + hospitalityTax;

  // Cart operations
  const addToCart = (item: FnbMenuItem) => {
    // Allergy enforcement check
    if (selectedGuest) {
      const { hasConflict, reason } = checkAllergyConflict(selectedGuest, item);
      if (hasConflict) {
        alert(`CANNOT ORDER: ${reason}`);
        return;
      }
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQ = ci.quantity + delta;
            return newQ > 0 ? { ...ci, quantity: newQ } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const handleSelectGuest = (guest: FnbGuest) => {
    setSelectedGuest(guest);
    setIsGuestModalOpen(false);

    // If changing guest, check if existing cart has conflicting items
    if (cart.length > 0) {
      const conflictingCartItems = cart.filter((ci) => {
        const { hasConflict } = checkAllergyConflict(guest, ci.menuItem);
        return hasConflict;
      });

      if (conflictingCartItems.length > 0) {
        // Automatically purge conflicting items for guest safety
        setCart((prev) =>
          prev.filter((ci) => {
            const { hasConflict } = checkAllergyConflict(guest, ci.menuItem);
            return !hasConflict;
          })
        );
      }
    }
  };

  const handleCheckoutOrder = () => {
    if (!selectedGuest) {
      setIsGuestModalOpen(true);
      return;
    }
    if (cart.length === 0) return;

    // Verify zero allergy conflicts
    for (const item of cart) {
      const { hasConflict, reason } = checkAllergyConflict(selectedGuest, item.menuItem);
      if (hasConflict) {
        alert(`Cannot complete order. ${reason}`);
        return;
      }
    }

    const orderData = {
      orderId: `POS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guest: selectedGuest,
      outlet: selectedOutlet,
      table: selectedTable,
      items: [...cart],
      subtotal,
      serviceCharge,
      hospitalityTax,
      grandTotal,
    };

    setLastPlacedOrder(orderData);
    setShowOrderSuccessModal(true);
    setCart([]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">

      {/* Top POS Control Bar */}
      <header className="shrink-0 h-16 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-sm">
            <Shop2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                SOSEI F&B Point of Sale (POS)
              </h1>
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Allergy Safe KDS
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-normal mt-1">
              {selectedOutlet} · {selectedTable}
            </p>
          </div>
        </div>

        {/* Selected Guest Trigger & Exit */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsGuestModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${selectedGuest
                ? selectedGuest.allergies.length > 0
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:bg-rose-100/70'
                  : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60'
                : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 animate-pulse'
              }`}
          >
            <UsersGroupTwoRounded size={15} />
            <div className="text-left">
              {selectedGuest ? (
                <>
                  <div className="text-[11px] font-bold leading-tight">{selectedGuest.name}</div>
                  <div className="text-[9px] font-medium opacity-80">{selectedGuest.room}</div>
                </>
              ) : (
                <div className="text-[11px] font-bold">Select Guest First *</div>
              )}
            </div>
            <AltArrowDown size={12} className="opacity-70 ml-0.5" />
          </button>

          <button
            onClick={() => navigate('/dashboard/experience/fnb')}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium cursor-pointer transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Guest Allergy Status Banner */}
      {selectedGuest ? (
        <div
          className={`shrink-0 px-4 lg:px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${selectedGuest.allergies.length > 0
              ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
              : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
            }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedGuest.allergies.length > 0 ? (
              <ShieldWarning size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
            ) : (
              <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span className="font-bold text-[11px]">
              {selectedGuest.name} ({selectedGuest.room})
            </span>
            <span className="text-[11px] opacity-80 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10.5px] font-medium opacity-90">Medical Allergies:</span>
              {selectedGuest.allergies.length > 0 ? (
                selectedGuest.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-rose-600 text-white dark:bg-rose-700 shadow-xs"
                  >
                    ⚠️ {allergy}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-600 text-white dark:bg-emerald-700">
                  ✓ None (No Known Allergies)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedGuest.allergies.length > 0 && (
              <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-900/40 px-2 py-0.5 rounded-md">
                Conflicting dishes are locked automatically
              </span>
            )}
            <button
              onClick={() => setIsGuestModalOpen(true)}
              className="text-[10.5px] underline font-medium hover:opacity-80 cursor-pointer"
            >
              Switch Guest
            </button>
          </div>
        </div>
      ) : (
        <div className="shrink-0 px-4 lg:px-6 py-2 bg-amber-500/10 border-b border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <DangerCircle size={16} className="text-amber-600 shrink-0" />
            <span className="font-semibold text-[11px]">
              Guest not selected. Please select an in-house guest to unlock dining ticket and allergy verification.
            </span>
          </div>
          <button
            onClick={() => setIsGuestModalOpen(true)}
            className="text-[10.5px] font-bold underline cursor-pointer"
          >
            Select In-House Guest →
          </button>
        </div>
      )}

      {/* Main POS Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Side: Menu Catalog (Cards) */}
        <main className="flex-1 flex flex-col min-w-0 border-r border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">

          {/* Catalog Controls: Categories & Search */}
          <div className="shrink-0 p-4 border-b border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xs space-y-3">
            {/* Search & Allergen Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1 max-w-md">
                <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search dishes or ingredients (e.g. wagyu, caviar, truffle)..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-900 dark:focus:border-zinc-400 transition-colors"
                />
              </div>

              {/* Safe Only Switch */}
              <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 font-medium cursor-pointer select-none">
                <Checkbox
                  checked={hideAllergens}
                  onCheckedChange={(checked) => setHideAllergens(checked === true)}
                  disabled={!selectedGuest || selectedGuest.allergies.length === 0}
                  className="size-3.5"
                />
                <span>Hide Conflicting Allergens</span>
              </label>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Dishes' },
                { id: 'starters', label: 'Starters & Caviar' },
                { id: 'mains', label: 'Main Courses & Grills' },
                { id: 'pasta', label: 'Wood-Fired & Pasta' },
                { id: 'bowls', label: 'Sanctuary Bowls' },
                { id: 'desserts', label: 'Artisanal Desserts' },
                { id: 'beverages', label: 'Cellar & Highball' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-tight whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat.id
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => {
                const { hasConflict, conflictingAllergens } = checkAllergyConflict(
                  selectedGuest,
                  item
                );
                const cartEntry = cart.find((ci) => ci.menuItem.id === item.id);

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-xs ${hasConflict
                        ? 'border-rose-300/80 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 opacity-90'
                        : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                  >
                    {/* Image & Badges */}
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${hasConflict ? 'filter grayscale-40' : ''
                          }`}
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[80%]">
                        {item.isChefSignature && (
                          <span className="bg-zinc-900/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <ChefHat size={11} /> Signature
                          </span>
                        )}
                        {item.dietaryBadges.slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Price Tag */}
                      <div className="absolute bottom-2.5 right-2.5 bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-xs font-bold px-2.5 py-1 rounded-xl shadow-md backdrop-blur-xs">
                        ${item.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Conflict Warning Ribbon */}
                        {hasConflict && (
                          <div className="mb-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white flex items-center justify-between text-[10px] font-bold shadow-xs">
                            <span className="flex items-center gap-1 truncate">
                              <ShieldWarning size={13} className="shrink-0" />
                              CONFLICT: Contains {conflictingAllergens.join(', ')}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider ml-1 shrink-0 opacity-90">
                              LOCKED
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-1">
                            {item.name}
                          </h3>
                        </div>

                        <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Ingredients Tag Preview */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {item.ingredients.slice(0, 3).map((ing) => (
                            <span
                              key={ing}
                              className="text-[9px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
                            >
                              {ing}
                            </span>
                          ))}
                          {item.ingredients.length > 3 && (
                            <button
                              onClick={() => setActiveItemForModal(item)}
                              className="text-[9px] text-zinc-600 dark:text-zinc-400 underline hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ml-0.5"
                            >
                              +{item.ingredients.length - 3} ingredients
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveItemForModal(item)}
                          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 cursor-pointer transition-colors py-1"
                        >
                          <Eye size={12} /> View Ingredients
                        </button>

                        {/* Order Button with Allergy Lock */}
                        {hasConflict ? (
                          <button
                            disabled
                            className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 text-[10.5px] font-semibold flex items-center gap-1 cursor-not-allowed border border-rose-200 dark:border-rose-900/50"
                            title={`Locked due to guest allergy (${conflictingAllergens.join(', ')})`}
                          >
                            <ShieldWarning size={13} className="text-rose-500" />
                            Locked (Allergy)
                          </button>
                        ) : cartEntry ? (
                          <div className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl px-2 py-1 shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:opacity-70 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1">{cartEntry.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center font-bold text-xs hover:opacity-70 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <AddSquare size={13} /> Add to Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Side: Active Order Ticket (Cart) */}
        <aside className="w-[320px] lg:w-[360px] shrink-0 border-l border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between z-20">

          {/* Ticket Header */}
          <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400">Guest Dining Folio</span>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedGuest ? selectedGuest.name : 'No Guest Assigned'}
                </h2>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {selectedGuest ? `${selectedGuest.room} · ${selectedGuest.folioNumber}` : 'Select guest to open folio ticket'}
                </p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  title="Clear Ticket"
                >
                  <TrashBinTrash size={16} />
                </button>
              )}
            </div>

            {/* Outlet & Table Selectors */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg p-1.5">
                <span className="text-[8.5px] text-zinc-400 block font-medium">Dining Venue</span>
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full bg-transparent font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer text-[10px]"
                >
                  <option value="Seascape Ocean Restaurant">Seascape Ocean</option>
                  <option value="Terra Alpine Pavilion">Terra Alpine</option>
                  <option value="The Tea Lounge & Bar">The Tea Lounge</option>
                  <option value="In-Villa Private Dining">In-Villa Dining</option>
                </select>
              </div>

              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg p-1.5">
                <span className="text-[8.5px] text-zinc-400 block font-medium">Table / Delivery</span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full bg-transparent font-semibold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer text-[10px]"
                >
                  <option value="Table 04 (Terrace)">Table 04 (Terrace)</option>
                  <option value="Table 08 (Window)">Table 08 (Window)</option>
                  <option value="Private Dining Suite 1">Private Suite 1</option>
                  <option value="Villa Delivery">In-Villa Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-2">
                <Shop2 size={32} className="opacity-40" />
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Ticket is empty</p>
                <p className="text-[10px] leading-relaxed max-w-[200px]">
                  Select verified safe items from the catalog to add to this guest's dining folio.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        ${item.menuItem.price} each · {item.menuItem.categoryLabel}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      ${item.menuItem.price * item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 bg-white dark:bg-zinc-900">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, -1)}
                        className="text-zinc-600 dark:text-zinc-300 font-bold hover:text-zinc-900 cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, 1)}
                        className="text-zinc-600 dark:text-zinc-300 font-bold hover:text-zinc-900 cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-[10px] text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Billing Footer */}
          <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Food & Beverage Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Service Charge (10%)</span>
                <span>${serviceCharge}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Hospitality Luxury Tax (10%)</span>
                <span>${hospitalityTax}</span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <span>Total Folio Charge</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutOrder}
              disabled={cart.length === 0 || !selectedGuest}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${cart.length > 0 && selectedGuest
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                }`}
            >
              <CheckCircle size={15} /> Charge to Villa Folio & Send KDS
            </button>
          </div>
        </aside>
      </div>

      {/* ================= MODAL 1: SELECT GUEST (MANDATORY STEP) ================= */}
      {isGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                  <UsersGroupTwoRounded size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                    Select In-House Guest
                  </h3>
                  <p className="text-[10.5px] text-zinc-500">
                    Assign dining ticket and load guest allergy profile from PMS.
                  </p>
                </div>
              </div>
              {selectedGuest && (
                <button
                  onClick={() => setIsGuestModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <CloseCircle size={20} />
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20">
              <div className="relative">
                <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by guest name, villa number, or allergy (e.g. Sal, Villa 108, Peanuts)..."
                  value={guestSearchQuery}
                  onChange={(e) => setGuestSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-900 dark:focus:border-zinc-300"
                />
              </div>
            </div>

            {/* Guests List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-4 space-y-2.5">
              {filteredGuests.map((guest) => {
                const isCurrent = selectedGuest?.id === guest.id;
                const hasAllergies = guest.allergies.length > 0;

                return (
                  <div
                    key={guest.id}
                    onClick={() => handleSelectGuest(guest)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${isCurrent
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/70 dark:bg-zinc-800/80 shadow-sm'
                        : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xs'
                      }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {guest.name}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {guest.vipTier}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {guest.room} · <span className="font-medium text-zinc-700 dark:text-zinc-300">{guest.property}</span> · Party of {guest.partySize}
                      </p>
                      {guest.notes && (
                        <p className="text-[10px] text-zinc-400 mt-1 italic line-clamp-1">
                          "{guest.notes}"
                        </p>
                      )}
                    </div>

                    {/* Allergies Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
                      {hasAllergies ? (
                        guest.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          >
                            ⚠️ {allergy}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          ✓ No Allergies
                        </span>
                      )}

                      <button
                        className={`px-3 py-1 rounded-lg text-xs font-bold ml-2 cursor-pointer transition-colors ${isCurrent
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200'
                          }`}
                      >
                        {isCurrent ? 'Active' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: INGREDIENTS & RECIPE DETAIL ================= */}
      {activeItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Image Header */}
            <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
              <img
                src={activeItemForModal.image}
                alt={activeItemForModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveItemForModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <CloseCircle size={18} />
              </button>
              <div className="absolute bottom-3 left-3 bg-zinc-900/90 text-white text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-xs">
                ${activeItemForModal.price} · {activeItemForModal.categoryLabel}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-4 text-xs">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {activeItemForModal.name}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  {activeItemForModal.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 mt-2">
                  <span>⏱ Prep time: {activeItemForModal.prepTimeMinutes} mins</span>
                  <span>🔥 Calories: {activeItemForModal.calories} kcal</span>
                </div>
              </div>

              {/* Allergy Evaluation for currently selected guest */}
              {selectedGuest && (
                (() => {
                  const { hasConflict, reason } = checkAllergyConflict(
                    selectedGuest,
                    activeItemForModal
                  );
                  return hasConflict ? (
                    <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-400">
                        <ShieldWarning size={16} /> ALLERGEN SAFETY CONFLICT DETECTED
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {reason}
                      </p>
                      <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mt-1">
                        SOSEI Medical Safety Protocol: This dish is completely locked and cannot be added to {selectedGuest.name}'s dining ticket.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-xs">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">Verified Allergen-Safe for {selectedGuest.name}.</span>
                        <p className="text-[10px] opacity-80">No matching allergens found in ingredient registry.</p>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Comprehensive Ingredients Breakdown */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Full Culinary Ingredients Registry
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeItemForModal.ingredients.map((ing) => {
                    const isAllergenMatch = selectedGuest?.allergies.some((allg) =>
                      ing.toLowerCase().includes(allg.toLowerCase())
                    );
                    return (
                      <div
                        key={ing}
                        className={`p-2 rounded-lg border text-[11px] flex items-center gap-1.5 ${isAllergenMatch
                            ? 'border-rose-300 bg-rose-50 text-rose-900 font-bold dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                            : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300'
                          }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        <span className="truncate">{ing}</span>
                        {isAllergenMatch && (
                          <span className="text-[8.5px] uppercase bg-rose-600 text-white px-1.5 py-0.2 rounded ml-auto">
                            Allergen
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registered Allergen Tags */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Declared Allergen Categories
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeItemForModal.allergens.length > 0 ? (
                    activeItemForModal.allergens.map((allg) => (
                      <span
                        key={allg}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                      >
                        {allg}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Zero declared allergens (Clean recipe)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-2">
              <button
                onClick={() => setActiveItemForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Close
              </button>

              {(() => {
                const { hasConflict } = checkAllergyConflict(selectedGuest, activeItemForModal);
                return (
                  <button
                    onClick={() => {
                      addToCart(activeItemForModal);
                      setActiveItemForModal(null);
                    }}
                    disabled={hasConflict}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer ${hasConflict
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                      }`}
                  >
                    {hasConflict ? 'Locked (Allergy Conflict)' : 'Add to Order Ticket'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ORDER SENT TO KITCHEN SUCCESS ================= */}
      {showOrderSuccessModal && lastPlacedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle size={28} />
            </div>

            <div>
              <span className="text-[9.5px] font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                Order Confirmed & Routed
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Charged to {lastPlacedOrder.guest.room}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Order #{lastPlacedOrder.orderId} successfully billed to Folio #{lastPlacedOrder.guest.folioNumber} ({lastPlacedOrder.guest.name}).
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left text-xs space-y-2">
              <div className="flex justify-between font-medium text-zinc-500 text-[11px]">
                <span>Venue & Table:</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{lastPlacedOrder.outlet} · {lastPlacedOrder.table}</span>
              </div>
              <div className="flex justify-between font-medium text-zinc-500 text-[11px]">
                <span>Allergy Check:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Verified Safe</span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1.5 flex justify-between font-bold text-zinc-900 dark:text-zinc-100">
                <span>Grand Total:</span>
                <span>${lastPlacedOrder.grandTotal}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowOrderSuccessModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold hover:opacity-90 cursor-pointer shadow-xs"
              >
                Back to POS Dining
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
