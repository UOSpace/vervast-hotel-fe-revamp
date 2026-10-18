import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AltArrowDown,
  Magnifer,
  ChefHat,
  UsersGroupTwoRounded,
} from '@solar-icons/react';
import { MASTER_PROPERTIES, resolvePropertyId } from '@/constants/categories';
import {
  SOSEI_RESTAURANTS,
  FNB_MENU_ITEMS,
  IN_HOUSE_FNB_GUESTS,
} from '@/features/fnb/data/fnbMenuData';
import { MASTER_FNB_PROPERTIES } from './FnbCategoryRegionalViews';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { getPropertyMetrics, splitByShares, PERIOD_DEFS, type PeriodId } from '@/data/portfolio';
import {
  getFnbOutletGroups,
  getFnbDayparts,
  FNB_PERIOD_SUFFIX,
} from '@/data/portfolio/fnbMix';

type TimeHorizon = PeriodId;

const HORIZON_TABS: { id: TimeHorizon; label: string; factor: number; periodLabel: string }[] = [
  { id: 'today', label: 'Today', factor: 1, periodLabel: PERIOD_DEFS.today.periodLabel },
  { id: 'mtd', label: 'MTD', factor: 1, periodLabel: PERIOD_DEFS.mtd.periodLabel },
  { id: 'ytd', label: 'YTD', factor: 1, periodLabel: PERIOD_DEFS.ytd.periodLabel },
  { id: 'forward', label: 'Forward Business', factor: 1, periodLabel: PERIOD_DEFS.forward.periodLabel },
];

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

function fmtMoney(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
  return `$${Math.round(val).toLocaleString()}`;
}

function fmtCount(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 10_000) return `${(val / 1_000).toFixed(1)}K`;
  return Math.round(val).toLocaleString();
}

function PureSvgFnbDonut({
  data,
  centerValue,
  centerLabel,
}: {
  data: { name: string; value: number; color: string }[];
  centerValue: string;
  centerLabel: string;
}) {
  const size = 110;
  const strokeWidth = 14;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  let accumulatedAngle = 0;

  return (
    <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f4f4f5" strokeWidth={strokeWidth} />
        {data.map((slice) => {
          const pct = slice.value / total;
          const dashLength = Math.max(0, pct * circumference - 1.5);
          const dashOffset = -(accumulatedAngle * circumference);
          accumulatedAngle += pct;
          return (
            <circle
              key={slice.name}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              className="transition-all duration-500 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
        <span className="text-[11px] font-bold text-zinc-900 leading-none">{centerValue}</span>
        <span className="text-[7.5px] font-semibold uppercase tracking-widest text-zinc-400 mt-1">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}

export function FnbPropertyDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openDrawer } = useDashboardDrawer();

  const propIdParam = searchParams.get('id') || searchParams.get('property');

  const getInitialProperty = () => {
    if (propIdParam) {
      const canonicalId = resolvePropertyId(propIdParam);
      const found = MASTER_PROPERTIES.find((p) => p.id === canonicalId || p.id === propIdParam);
      if (found) return found;
    }
    return MASTER_PROPERTIES[0];
  };

  const [selectedProperty, setSelectedProperty] = useState(getInitialProperty);
  const [horizon, setHorizon] = useState<TimeHorizon>('mtd');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInHouseGuests, setShowInHouseGuests] = useState<boolean>(true);
  const [showDevModal, setShowDevModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propIdParam) {
      const canonicalId = resolvePropertyId(propIdParam);
      const found = MASTER_PROPERTIES.find((p) => p.id === canonicalId || p.id === propIdParam);
      if (found && found.id !== selectedProperty.id) {
        setSelectedProperty(found);
      }
    }
  }, [propIdParam]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setSearchQuery('');
    }
  }, [isDropdownOpen]);

  const handlePropertyChange = (prop: typeof MASTER_PROPERTIES[0]) => {
    setSelectedProperty(prop);
    setSearchParams({ id: prop.id }, { replace: true });
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const filteredDropdownProps = useMemo(
    () =>
      MASTER_PROPERTIES.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  // Synchronized Property Metrics & F&B Record for active horizon
  const propMetrics = useMemo(
    () => getPropertyMetrics(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );

  const fnbRecord = useMemo(() => {
    const base =
      MASTER_FNB_PROPERTIES.find((p) => p.id === selectedProperty.id) || MASTER_FNB_PROPERTIES[0];
    return {
      ...base,
      rooms: propMetrics.rooms,
      outletsCount: propMetrics.fnb.outlets,
      mtdFnbRev: propMetrics.fnbRevenue,
      mtdCovers: propMetrics.fnb.covers,
      captureRate: Number(propMetrics.fnb.captureRatePct.toFixed(1)),
      avgCheck: Math.round(propMetrics.fnb.avgCheck),
      spendPerGuest: Math.round(propMetrics.fnb.spendPerGuestNight),
      revpash: Number(propMetrics.fnb.revpash.toFixed(2)),
      seatTurn: Number(propMetrics.fnb.seatTurn.toFixed(2)),
      bevShare: Number(propMetrics.fnb.bevSharePct.toFixed(1)),
      lflGrowth: Number(propMetrics.vsLy.fnbRevenuePct.toFixed(1)),
    };
  }, [selectedProperty.id, propMetrics]);

  const horizonMeta = HORIZON_TABS.find((t) => t.id === horizon) || HORIZON_TABS[1];
  const factor = horizonMeta.factor;

  const totalFnbRev = fnbRecord.mtdFnbRev * factor;
  const totalCovers = Math.round(fnbRecord.mtdCovers * factor);
  const bevRev = propMetrics.fnb.bevRevenue;

  // Property Restaurants from SOSEI_RESTAURANTS + Private Dining & In-Villa Dining
  const propertyRestaurants = useMemo(
    () => SOSEI_RESTAURANTS.filter((r) => r.propertyId === selectedProperty.id),
    [selectedProperty.id]
  );

  const outletTradingRows = useMemo(() => {
    const rest1 = propertyRestaurants[0];
    const rest2 = propertyRestaurants[1];
    const groups = getFnbOutletGroups(propMetrics);

    return [
      {
        id: rest1?.id || `${selectedProperty.id}-out-1`,
        name: rest1?.name || fnbRecord.signatureOutlets.split('·')[0].trim(),
        concept: rest1?.concept || fnbRecord.cuisineLead,
        cuisineTag: rest1?.cuisineTag || 'Signature Dining',
        hours: rest1?.hours || '17:30 – 23:00',
        seating: rest1?.seating || '44 Covers · Signature Room',
        image: rest1?.image || selectedProperty.img,
        covers: groups[0].covers,
        avgCheck: Math.round(groups[0].avgCheck),
        revpash: groups[0].revpash,
        revenue: groups[0].revenue,
        sharePct: Math.round(groups[0].sharePct),
        status: groups[0].status,
      },
      {
        id: rest2?.id || `${selectedProperty.id}-out-2`,
        name: rest2?.name || (fnbRecord.signatureOutlets.split('·')[1]?.trim() ?? 'All-Day Terrace'),
        concept: rest2?.concept || 'All-Day Culinary & Sunset Lounge',
        cuisineTag: rest2?.cuisineTag || 'All-Day & Lounge',
        hours: rest2?.hours || '07:00 – 23:00',
        seating: rest2?.seating || '52 Covers · Terrace & Bar',
        image: rest2?.image || selectedProperty.img,
        covers: groups[1].covers,
        avgCheck: Math.round(groups[1].avgCheck),
        revpash: groups[1].revpash,
        revenue: groups[1].revenue,
        sharePct: Math.round(groups[1].sharePct),
        status: groups[1].status,
      },
      {
        id: `${selectedProperty.id}-ivd`,
        name: 'In-Villa & Suite Private Dining',
        concept: '24-Hour Butler Service, Private Terrace Breakfast & Chef Table',
        cuisineTag: 'In-Room & Villa Service',
        hours: '24 Hours · On-Demand',
        seating: `${fnbRecord.rooms} Suites & Villas`,
        image: selectedProperty.img,
        covers: groups[2].covers,
        avgCheck: Math.round(groups[2].avgCheck),
        revpash: groups[2].revpash,
        revenue: groups[2].revenue,
        sharePct: Math.round(groups[2].sharePct),
        status: groups[2].status,
      },
      {
        id: `${selectedProperty.id}-banquet`,
        name: 'Private Cellar & Bespoke Events',
        concept: 'Sommelier Wine Dinners, Celebration Buyouts & Executive Retreats',
        cuisineTag: 'Private Events & Cellar',
        hours: 'By Reservation',
        seating: 'Up to 36 Pax · Private Salon',
        image: rest1?.image || selectedProperty.img,
        covers: groups[3].covers,
        avgCheck: Math.round(groups[3].avgCheck),
        revpash: groups[3].revpash,
        revenue: groups[3].revenue,
        sharePct: Math.round(groups[3].sharePct),
        status: groups[3].status,
      },
    ];
  }, [propertyRestaurants, selectedProperty, fnbRecord, propMetrics]);

  // Daypart Service Rhythm for this property (sums to propMetrics.fnb.covers and propMetrics.fnbRevenue)
  const daypartRows = useMemo(() => {
    return getFnbDayparts(propMetrics, fnbRecord.categoryId).map((d) => ({
      daypart: d.name,
      window: d.window,
      covers: d.covers,
      share: d.sharePct,
      rev: d.revenue,
      revpash: d.revpash.toFixed(2),
      sla: d.sla,
    }));
  }, [propMetrics, fnbRecord.categoryId]);

  // Property Revenue Centre Mix Donut
  const centreMix = useMemo(() => {
    const shares = [
      { id: 'sig', name: 'Signature Dining', share: 44, color: '#0f172a', avgCheck: Math.round(fnbRecord.avgCheck * 1.18) },
      { id: 'all', name: 'All-Day & Terrace', share: 21, color: '#334155', avgCheck: Math.round(fnbRecord.avgCheck * 0.88) },
      { id: 'bar', name: 'Bar & Sommelier Cellar', share: 14, color: '#64748b', avgCheck: Math.round(fnbRecord.avgCheck * 0.76) },
      { id: 'ivd', name: 'In-Villa Dining', share: 11, color: '#94a3b8', avgCheck: Math.round(fnbRecord.avgCheck * 0.85) },
      { id: 'evt', name: 'Private Events', share: 10, color: '#cbd5e1', avgCheck: Math.round(fnbRecord.avgCheck * 1.45) },
    ];
    const revs = splitByShares(
      totalFnbRev,
      shares.map((s) => ({ id: s.id, name: s.name, share: s.share }))
    );
    return shares.map((s, idx) => ({
      ...s,
      revenue: fmtMoney(revs[idx].value),
    }));
  }, [fnbRecord, totalFnbRev]);

  // Property Signature Menu Leaders from FNB_MENU_ITEMS
  const propertyMenuLeaders = useMemo(() => {
    const items = FNB_MENU_ITEMS.filter((item) => item.propertyId === selectedProperty.id);
    const list = items.length > 0 ? items : FNB_MENU_ITEMS.slice(0, 5);
    return list.slice(0, 5).map((item, idx) => {
      const baseOrders = Math.max(12, Math.round((totalCovers / 18) * (1 - idx * 0.14)));
      const itemRev = baseOrders * item.price;
      return {
        ...item,
        orders: baseOrders,
        itemRev,
        marginPct: item.category === 'beverages' ? 78 : 71 - idx * 2,
      };
    });
  }, [selectedProperty.id, totalCovers]);

  // Property In-House Guests
  const propertyGuests = useMemo(
    () => IN_HOUSE_FNB_GUESTS.filter((g) => g.propertyId === selectedProperty.id),
    [selectedProperty.id]
  );

  // Property F&B Signals & Operational Metrics
  const propertySignals = useMemo(() => {
    const foodCostPct = fnbRecord.status === 'attention' ? 30.2 : 26.8;
    const bevCostPct = fnbRecord.status === 'attention' ? 23.4 : 20.6;
    const sentimentScore = fnbRecord.status === 'above_plan' ? 96.2 : fnbRecord.status === 'on_plan' ? 94.1 : 89.8;
    const allergyGuestsCount = propertyGuests.filter((g) => g.allergies.length > 0).length;

    return {
      foodCostPct,
      bevCostPct,
      primeCostPct: (foodCostPct + 29.4).toFixed(1),
      sentimentScore,
      allergyGuestsCount,
      items: [
        {
          title: `${propertyRestaurants[0]?.name || 'Signature Outlet'} — Prime Seating Yield`,
          detail: `8:00 PM prime window operating at 96% table occupancy with $${Math.round(fnbRecord.avgCheck * 1.24)} avg check.`,
          badge: fnbRecord.lflGrowth >= 0 ? `+${fnbRecord.lflGrowth}% YoY` : `${fnbRecord.lflGrowth}% YoY`,
          tone: fnbRecord.lflGrowth >= 0 ? 'positive' : 'negative',
        },
        {
          title: 'Food & Beverage Cost Discipline',
          detail: `Blended F&B COGS at ${foodCostPct}% (Food) and ${bevCostPct}% (Beverage & Cellar) vs 28.0% property budget.`,
          badge: foodCostPct <= 28 ? 'On Target' : 'Watchlist',
          tone: foodCostPct <= 28 ? 'positive' : 'negative',
        },
        {
          title: 'In-House VIP Dietary & Allergen Protocol',
          detail: `${propertyGuests.length} active VIP suites in-house (${allergyGuestsCount} suites with registered kitchen allergen alerts).`,
          badge: '100% Briefed',
          tone: 'neutral',
        },
      ],
    };
  }, [fnbRecord, propertyGuests, propertyRestaurants]);

  const heroRevs = splitByShares(totalFnbRev, [
    { id: 'rest', name: 'Restaurants', share: 65 },
    { id: 'bar', name: 'Bars & Cellar', share: 14 },
    { id: 'ivd', name: 'In-Villa', share: 11 },
    { id: 'evt', name: 'Events', share: 10 },
  ]);
  const heroBreakdown = [
    { label: 'Restaurants', val: fmtMoney(heroRevs[0].value), pct: '65%' },
    { label: 'Bars & Cellar', val: fmtMoney(heroRevs[1].value), pct: '14%' },
    { label: 'In-Villa', val: fmtMoney(heroRevs[2].value), pct: '11%' },
    { label: 'Events', val: fmtMoney(heroRevs[3].value), pct: '10%' },
  ];

  const isNegGrowth = fnbRecord.lflGrowth < 0;

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      {/* ───────────────── TOP EXECUTIVE HEADER ───────────────── */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            FNB Dashboard Property View
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Active Resort: <strong className="font-semibold text-zinc-900">{selectedProperty.name}</strong> ({selectedProperty.location} · {fnbRecord.rooms} Keys · {fnbRecord.outletsCount} F&amp;B Outlets)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Time Horizon Pill Filter */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
            {HORIZON_TABS.filter((ht) => ht.id !== 'forward').map((t) => {
              const active = horizon === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setHorizon(t.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                    active ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/fnb/pos')}
            className="h-7 border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-[10px] px-3 font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <ChefHat size={13} />
            <span>Launch Outlet POS</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDevModal(true)}
            className="h-7 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3 font-medium flex items-center gap-1.5 bg-white transition-all shadow-2xs cursor-pointer"
          >
            <AltArrowDown size={13} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ───────────────── PROPERTY SELECTOR BAR (DROPDOWN + QUICK RESORT PILLS) ───────────────── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 pb-1">
        {/* Left: Searchable Property Selector Dropdown */}
        <div className="flex items-center gap-3 relative shrink-0" ref={dropdownRef}>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 shadow-2xs shrink-0">
            <img
              src={selectedProperty.img}
              alt={selectedProperty.name}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
                  {selectedProperty.name}
                </span>
                <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                  {fnbRecord.categoryName}
                </span>
                <AltArrowDown
                  size={15}
                  className={`text-zinc-400 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <span className="text-zinc-500 text-[9.5px] tracking-wider uppercase font-semibold mt-1">
                {selectedProperty.location} · {fnbRecord.cuisineLead}
              </span>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-12 left-0 sm:left-11 mt-1 w-[330px] bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in flex flex-col">
              <div className="px-3.5 pt-3 pb-2 shrink-0 border-b border-zinc-100">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Select SOSEI Resort Property
                </div>
                <div className="relative">
                  <Magnifer
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resort or destination…"
                    className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>
              </div>

              <div className="overflow-y-auto custom-scrollbar max-h-[280px] p-1.5">
                {filteredDropdownProps.length > 0 ? (
                  filteredDropdownProps.map((prop) => {
                    const pM = getPropertyMetrics(prop.id, horizon);
                    const isSelected = selectedProperty.id === prop.id;
                    return (
                      <button
                        key={prop.id}
                        type="button"
                        onClick={() => handlePropertyChange(prop)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100/80 transition-colors text-left cursor-pointer ${
                          isSelected ? 'bg-zinc-100 font-medium' : ''
                        }`}
                      >
                        <img
                          src={prop.img}
                          alt={prop.name}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-zinc-900 leading-tight truncate">
                            {prop.name}
                          </div>
                          <div className="text-[9px] text-zinc-500 mt-0.5 truncate">
                            {prop.location} · {fmtMoney(pM.fnbRevenue)} {FNB_PERIOD_SUFFIX[horizon]}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-center">
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#14532d"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-[11px] text-zinc-400 italic">
                    No properties found
                  </div>
                )}
              </div>

              <div className="px-3.5 py-2 border-t border-zinc-100 bg-zinc-50/50 shrink-0 flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 font-medium">
                  {filteredDropdownProps.length} of {MASTER_PROPERTIES.length} SOSEI properties
                </span>
                <span className="text-[9px] text-zinc-500 font-semibold">F&amp;B Command</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────── ROW 1: 5 PROPERTY F&B HEADLINE KPI CARDS ───────────────── */}
      <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
        {/* Hero Card (2 Cols): TOTAL PROPERTY F&B REVENUE */}
        <div
          className={`${CARD_CLASS} sm:col-span-2 lg:col-span-2`}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — Total F&B Revenue Breakdown`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'total_fnb_rev',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Total Property F&B Revenue across restaurants, bars, in-villa dining, and private events.">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 truncate cursor-help">
                PROPERTY F&amp;B REVENUE
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                isNegGrowth ? 'bg-[#fff1f2] text-[#800020]' : 'bg-[#ecfdf5] text-[#14532d]'
              }`}
            >
              {isNegGrowth ? '' : '+'}
              {fnbRecord.lflGrowth}% vs LY
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 my-1">
            <div className="text-[22px] font-normal text-zinc-900 leading-tight">
              {fmtMoney(totalFnbRev)}
            </div>
            <div className="text-[9.5px] font-medium text-zinc-500">
              {fmtCount(totalCovers)} Covers · {fnbRecord.outletsCount} Venues
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-zinc-200/60">
            {heroBreakdown.map((p) => (
              <div key={p.label} className="text-left">
                <div className="text-[8px] text-zinc-400 uppercase tracking-wider truncate">{p.label}</div>
                <div className="text-[9.5px] font-semibold text-zinc-900 leading-tight mt-0.5">{p.val}</div>
                <div className="text-[8px] text-zinc-400">{p.pct}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: GUEST CAPTURE RATE */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — In-House Guest Dining Capture`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'capture_rate',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Percentage of in-house resort guests dining at on-property F&B venues daily.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                GUEST CAPTURE
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +3.4 pts vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              {fnbRecord.captureRate}%
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              In-House Guests ({fnbRecord.rooms} Keys)
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              Bfast {Math.min(96, Math.round(fnbRecord.captureRate + 16))}%
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              Dinner {Math.round(fnbRecord.captureRate - 4)}%
            </span>
          </div>
        </div>

        {/* Card 3: AVG CHECK & SPEND / GUEST */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — Average Check & Spend per Guest`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'avg_check',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Average POS transaction check and daily culinary spend per unique dining guest.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                AVG CHECK
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +6.8% vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              ${fnbRecord.avgCheck}
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              ${fnbRecord.spendPerGuest} Spend / Unique Guest
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +${Math.round(fnbRecord.avgCheck * 0.05)} vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              ${Math.round(totalFnbRev / Math.max(1, totalCovers))} / Cover
            </span>
          </div>
        </div>

        {/* Card 4: REVPASH & TABLE TURN */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — RevPASH & Seat Turnover`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'revpash',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Revenue Per Available Seat Hour (RevPASH) and average dining table turnover.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                REVPASH &amp; TURN
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +8.4% vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              ${fnbRecord.revpash.toFixed(2)}
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              {fnbRecord.seatTurn}x Avg Table Turn
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +$3.20 vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              IVD 22.8m SLA
            </span>
          </div>
        </div>

        {/* Card 5: BEVERAGE & WINE SHARE */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — Beverage, Wine & Mixology Share`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'beverage',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Beverage, wine cellar, and mixology share of total property F&B revenue.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                BEVERAGE SHARE
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +2.4 pts vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              {fnbRecord.bevShare}%
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              {fmtMoney(bevRev)} Bev &amp; Cellar Rev
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +1.2 pts vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              44.2% Pairing
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 2: PROPERTY OUTLETS TRADING BOARD (7 COLS) + DAYPART SERVICE RHYTHM (5 COLS) ───────────────── */}
      <div className="-mx-4 grid grid-cols-12 gap-4 items-stretch">
        {/* Left 7 Cols: Operating Outlets & Culinary Venues */}
        <div className="col-span-12 lg:col-span-7 flex flex-col">
          <div className={CARD_CLASS}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                  OPERATING OUTLETS &amp; VENUE PERFORMANCE ({selectedProperty.name})
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                  On-property restaurants, bars, in-villa dining &amp; private cellar performance ({horizonMeta.label})
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 self-start sm:self-auto">
                {fnbRecord.outletsCount} Active Venues · {fnbRecord.cuisineLead}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {outletTradingRows.map((venue) => (
                <div
                  key={venue.id}
                  onClick={() =>
                    openDrawer({
                      type: 'FNB_DETAIL',
                      title: `${venue.name} — ${selectedProperty.name}`,
                      data: {
                        key: 'FNB_OUTLET_DAYPART',
                        horizon,
                        propertyId: selectedProperty.id,
                        propertyIds: [selectedProperty.id],
                      },
                    })
                  }
                  className="p-2.5 rounded-[10px] border border-zinc-200/70 bg-zinc-50/40 hover:bg-zinc-100/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-11 h-11 rounded-lg object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-zinc-900 truncate">{venue.name}</span>
                        <span className="text-[8px] font-medium px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-700 shrink-0">
                          {venue.cuisineTag}
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-500 truncate mt-0.5">{venue.concept}</div>
                      <div className="text-[8.5px] text-zinc-400 mt-0.5">
                        {venue.hours} · {venue.seating}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:flex sm:items-center gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200/60">
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] text-zinc-400">Covers</div>
                      <div className="text-[10px] font-semibold text-zinc-900">
                        {venue.covers.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] text-zinc-400">Avg Check</div>
                      <div className="text-[10px] font-semibold text-zinc-900">${venue.avgCheck}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] text-zinc-400">RevPASH</div>
                      <div className="text-[10px] font-semibold text-zinc-900">
                        ${venue.revpash.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] text-zinc-400">Revenue ({venue.sharePct}%)</div>
                      <div className="text-[10.5px] font-bold text-zinc-900">
                        {fmtMoney(venue.revenue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Daypart Service Rhythm & Kitchen SLA */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div
            className={CARD_CLASS}
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Daypart Productivity & Kitchen SLA`,
                data: {
                  key: 'FNB_OUTLET_DAYPART',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: [selectedProperty.id],
                },
              })
            }
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                  DAYPART SERVICE RHYTHM &amp; KITCHEN SLA
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                  Covers, RevPASH &amp; kitchen ticket speed across 5 daily service windows
                </p>
              </div>
              <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                95.2% On-Time SLA
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {daypartRows.map((d) => (
                <div
                  key={d.daypart}
                  className="p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-100 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-900">{d.daypart}</span>
                      <span className="text-[8.5px] text-zinc-400 ml-2">{d.window}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8.5px] font-medium px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-700">
                        {d.sla}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-900">{fmtMoney(d.rev)}</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${Math.min(100, d.share * 1.8)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[8.5px] text-zinc-500">
                    <span>{d.covers.toLocaleString()} Covers ({d.share}% Rev Share)</span>
                    <span className="font-medium text-zinc-700">RevPASH ${d.revpash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 3: 3-COLUMN PROPERTY CULINARY INTELLIGENCE ───────────────── */}
      <div className="-mx-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Column 1: Property Revenue Centre Mix */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — Revenue Centre Mix`,
              data: {
                key: 'FNB_REVENUE_CENTRE_SCORECARD',
                centre: 'Fine & Specialty Dining',
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                Property Revenue Centre Mix
              </span>
              <InfoTooltip text="Contribution of Signature Dining, All-Day Terrace, Bar & Cellar, In-Villa Dining, and Private Events." />
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400">5 Centres</span>
          </div>

          <div className="flex items-center gap-5 px-1 py-2">
            <PureSvgFnbDonut
              data={centreMix.map((c) => ({ name: c.name, value: c.share, color: c.color }))}
              centerValue={fmtMoney(totalFnbRev)}
              centerLabel="F&B Rev"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              {centreMix.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-[9.5px] text-zinc-700 font-medium truncate">{c.name}</span>
                  </div>
                  <span className="text-[9.5px] text-zinc-900 font-semibold shrink-0">{c.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                  <th className="text-left pb-2 pt-1 pr-1 w-[42%] truncate font-medium">Revenue Centre</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">% Share</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">Avg Check</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[22%] truncate font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {centreMix.map((row) => (
                  <tr key={row.name} className="text-[10px] border-b border-zinc-100 text-zinc-700">
                    <td className="py-2 pr-1 truncate font-medium">{row.name}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.share}%</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">${row.avgCheck}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-semibold">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Top Signature Dishes & Beverage Leaders */}
        <div
          className={CARD_CLASS}
          onClick={() => navigate('/dashboard/fnb/pos')}
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                Signature Menu &amp; Dish Leaders
              </span>
              <InfoTooltip text="Top-selling property-bound dishes and beverage pairings ordered during the selected period." />
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900">
              Open POS Menu →
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2 py-1">
            {propertyMenuLeaders.map((dish) => (
              <div
                key={dish.id}
                className="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-zinc-50/60 border border-zinc-100"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-9 h-9 rounded-lg object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-zinc-900 truncate">{dish.name}</div>
                    <div className="text-[8.5px] text-zinc-400 truncate">
                      {dish.categoryLabel} · ${dish.price} · {dish.marginPct}% Gross Margin
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-zinc-900">{fmtMoney(dish.itemRev)}</div>
                  <div className="text-[8.5px] text-[#14532d] font-medium">{dish.orders} Orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Property Culinary Signals, COGS & Guest Sentiment */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `${selectedProperty.name} — Culinary Cost, Cellar & Guest Sentiment`,
              data: {
                key: 'FNB_ACTION_SIGNAL',
                idx: 0,
                horizon,
                propertyId: selectedProperty.id,
                propertyIds: [selectedProperty.id],
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                Kitchen Cost &amp; Service Signals
              </span>
              <InfoTooltip text="Property F&B COGS discipline, prime cost ratio, guest dining satisfaction, and operational alerts." />
            </div>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
              Sentiment {propertySignals.sentimentScore}/100
            </span>
          </div>

          {/* 3 Mini Metric Boxes */}
          <div className="grid grid-cols-3 gap-2 my-1">
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
              <div className="text-[8px] uppercase tracking-wider text-zinc-400">Food Cost %</div>
              <div className="text-[13px] font-bold text-zinc-900 mt-0.5">
                {propertySignals.foodCostPct}%
              </div>
              <div className="text-[8px] text-[#14532d] font-medium">Target 28.0%</div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
              <div className="text-[8px] uppercase tracking-wider text-zinc-400">Bev Cost %</div>
              <div className="text-[13px] font-bold text-zinc-900 mt-0.5">
                {propertySignals.bevCostPct}%
              </div>
              <div className="text-[8px] text-[#14532d] font-medium">Target 22.0%</div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
              <div className="text-[8px] uppercase tracking-wider text-zinc-400">Prime Cost</div>
              <div className="text-[13px] font-bold text-zinc-900 mt-0.5">
                {propertySignals.primeCostPct}%
              </div>
              <div className="text-[8px] text-zinc-500 font-medium">COGS + Labor</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2 pt-1">
            {propertySignals.items.map((sig) => (
              <div
                key={sig.title}
                className="p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-100 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9.5px] font-bold text-zinc-900 truncate">{sig.title}</span>
                  <span
                    className={`text-[8px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                      sig.tone === 'positive'
                        ? 'bg-[#ecfdf5] text-[#14532d]'
                        : sig.tone === 'negative'
                          ? 'bg-[#fff1f2] text-[#800020]'
                          : 'bg-zinc-200/70 text-zinc-700'
                    }`}
                  >
                    {sig.badge}
                  </span>
                </div>
                <p className="text-[8.5px] text-zinc-500 leading-relaxed">{sig.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 4: COLLAPSIBLE IN-HOUSE GUESTS DINING & DIETARY DIRECTORY ───────────────── */}
      <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 animate-card-enter">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              IN-HOUSE GUESTS DINING &amp; DIETARY DIRECTORY ({selectedProperty.name})
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
              Registered in-house VIP guests at {selectedProperty.name}, suite/villa numbers, party size &amp; kitchen allergen alerts
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowInHouseGuests((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9.5px] font-medium cursor-pointer transition-all ${
              showInHouseGuests
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <UsersGroupTwoRounded size={12} />
            <span>{showInHouseGuests ? 'Hide In-House Guests' : 'Show In-House Guests'}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[8.5px] font-semibold ${
                showInHouseGuests ? 'bg-white/20 text-white' : 'bg-zinc-200/80 text-zinc-700'
              }`}
            >
              {propertyGuests.length}
            </span>
            <AltArrowDown
              size={11}
              className={`transition-transform duration-200 ${showInHouseGuests ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showInHouseGuests && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 animate-fade-in">
            {propertyGuests.map((guest) => {
              const hasAllergies = guest.allergies.length > 0;
              return (
                <div
                  key={guest.id}
                  className="p-3 rounded-[10px] border border-zinc-200/70 bg-zinc-50/40 hover:bg-zinc-100/60 transition-colors flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <span className="text-[11px] font-bold text-zinc-900">{guest.name}</span>
                        <div className="text-[9px] text-zinc-500 mt-0.5">
                          {guest.room} · Folio {guest.folioNumber}
                        </div>
                      </div>
                      <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-700 shrink-0">
                        {guest.partySize} Pax · {guest.vipTier}
                      </span>
                    </div>

                    {guest.notes && (
                      <p className="text-[8.5px] text-zinc-500 italic mt-1.5 line-clamp-2">
                        "{guest.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-zinc-100">
                    <div className="flex flex-wrap items-center gap-1">
                      {hasAllergies ? (
                        guest.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-medium bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80"
                          >
                            Allergy: {allergy}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-[#14532d] font-medium">
                          No registered allergies
                        </span>
                      )}
                      {guest.dietaryRestrictions.map((diet) => (
                        <span
                          key={diet}
                          className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>

                    <span className="text-[8px] text-zinc-400">
                      {guest.checkIn} → {guest.checkOut}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
