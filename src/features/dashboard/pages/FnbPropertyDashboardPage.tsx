import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AltArrowDown,
  Magnifer,
  ChefHat,
  RoundAltArrowRight,
} from '@solar-icons/react';
import { MASTER_PROPERTIES, resolvePropertyId } from '@/constants/categories';
import {
  SOSEI_RESTAURANTS,
  FNB_MENU_ITEMS,
} from '@/features/fnb/data/fnbMenuData';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import {
  PERIOD_DEFS,
  PERIOD_ORDER,
  fmtInt,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  getPropertyMetrics,
  type PeriodId,
} from '@/data/portfolio';
import {
  FNB_PERIOD_SUFFIX,
  getFnbBigGroupEvents,
  getFnbCentres,
  getFnbDayparts,
  getFnbForwardOutlook,
  getFnbHeadlineKpis,
  getFnbOrigins,
  getFnbOutletGroups,
  getFnbPropertyRecord,
  type FnbForwardWindow,
} from '@/data/portfolio/fnbMix';

/* ───────────────────────── DESIGN SYSTEM CONSTANTS ───────────────────────── */

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

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
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [forwardWindow, setForwardWindow] = useState<FnbForwardWindow>(30);
  const [outletFilter, setOutletFilter] = useState<'all' | 'restaurant' | 'bar_villa'>('all');
  const [menuFilter, setMenuFilter] = useState<'all' | 'food' | 'beverages'>('all');
  const [guestPanelTab, setGuestPanelTab] = useState<'origins' | 'events'>('origins');
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [propIdParam, selectedProperty.id]);

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

  const handlePropertyChange = (prop: (typeof MASTER_PROPERTIES)[0]) => {
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

  // Property Metrics & F&B Engines (100% aligned with Global F&B View)
  const propIds = useMemo(() => [selectedProperty.id], [selectedProperty.id]);
  const propMetrics = useMemo(
    () => getPropertyMetrics(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );
  const fnbStatic = useMemo(
    () => getFnbPropertyRecord(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );
  const activeHeadlineKpis = useMemo(
    () => getFnbHeadlineKpis(propIds, horizon),
    [propIds, horizon]
  );
  const centres = useMemo(() => getFnbCentres(propMetrics), [propMetrics]);
  const origins = useMemo(() => getFnbOrigins(propMetrics), [propMetrics]);
  const forwardOutlook = useMemo(
    () => getFnbForwardOutlook(propIds, forwardWindow),
    [propIds, forwardWindow]
  );
  const propertyGroupEvents = useMemo(
    () => getFnbBigGroupEvents(propIds, horizon),
    [propIds, horizon]
  );

  // Pure SVG Donut Geometry (size=110, strokeWidth=14 per AGENTS.md)
  const donutSize = 110;
  const donutStroke = 14;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;

  let cumulativePct = 0;
  const donutSegments = centres.map((c) => {
    const dash = (c.sharePct / 100) * donutCircumference;
    const offset = -(cumulativePct / 100) * donutCircumference;
    cumulativePct += c.sharePct;
    return { ...c, dash, offset };
  });

  // Property Restaurants & Bars Performance (aligned with Global View columns: F&B Rev, Food, Bev, Avg Check)
  const propertyRestaurants = useMemo(
    () => SOSEI_RESTAURANTS.filter((r) => r.propertyId === selectedProperty.id),
    [selectedProperty.id]
  );

  const propertyOutlets = useMemo(() => {
    const rest1 = propertyRestaurants[0];
    const rest2 = propertyRestaurants[1];
    const groups = getFnbOutletGroups(propMetrics);
    const bevRatio = propMetrics.fnb.bevSharePct / 100;

    const rawRows = [
      {
        id: rest1?.id || `${selectedProperty.id}-out-1`,
        outletName: rest1?.name || fnbStatic.signatureOutlets.split('·')[0].trim(),
        concept: rest1?.concept || fnbStatic.cuisineLead,
        typeLabel: 'Fine Dining',
        filterGroup: 'restaurant' as const,
        covers: groups[0].covers,
        avgCheck: Math.round(groups[0].avgCheck),
        revenue: groups[0].revenue,
        bevShare: Math.min(0.42, bevRatio * 1.15),
      },
      {
        id: rest2?.id || `${selectedProperty.id}-out-2`,
        outletName: rest2?.name || (fnbStatic.signatureOutlets.split('·')[1]?.trim() ?? 'All-Day Terrace & Bar'),
        concept: rest2?.concept || 'All-Day Brasserie & Sunset Lounge',
        typeLabel: 'All-Day & Bar',
        filterGroup: 'restaurant' as const,
        covers: groups[1].covers,
        avgCheck: Math.round(groups[1].avgCheck),
        revenue: groups[1].revenue,
        bevShare: Math.min(0.48, bevRatio * 1.3),
      },
      {
        id: `${selectedProperty.id}-ivd`,
        outletName: 'In-Villa & Suite Dining',
        concept: 'Private Terrace Breakfast & 24-Hour Suite Service',
        typeLabel: 'In-Villa Dining',
        filterGroup: 'bar_villa' as const,
        covers: groups[2].covers,
        avgCheck: Math.round(groups[2].avgCheck),
        revenue: groups[2].revenue,
        bevShare: Math.max(0.18, bevRatio * 0.75),
      },
      {
        id: `${selectedProperty.id}-banquet`,
        outletName: 'Private Dining & Events',
        concept: 'Sommelier Cellar Dinners, Buyouts & Celebrations',
        typeLabel: 'Banquet & Events',
        filterGroup: 'bar_villa' as const,
        covers: groups[3].covers,
        avgCheck: Math.round(groups[3].avgCheck),
        revenue: groups[3].revenue,
        bevShare: Math.min(0.45, bevRatio * 1.2),
      },
    ];

    return rawRows.map((r) => {
      const bevRevenue = Math.round(r.revenue * r.bevShare);
      const foodRevenue = Math.max(0, Math.round(r.revenue) - bevRevenue);
      return {
        ...r,
        foodRevenue,
        bevRevenue,
      };
    });
  }, [propertyRestaurants, selectedProperty.id, fnbStatic, propMetrics]);

  const filteredOutlets = useMemo(() => {
    if (outletFilter === 'all') return propertyOutlets;
    return propertyOutlets.filter((o) => o.filterGroup === outletFilter);
  }, [propertyOutlets, outletFilter]);

  // Outlet Daypart Performance (Property Level — simple, clear columns matching Global View)
  const daypartRows = useMemo(() => {
    const bevRatio = propMetrics.fnb.bevSharePct / 100;
    return getFnbDayparts(propMetrics, fnbStatic.categoryId).map((d) => {
      const daypartBevFactor =
        d.id === 'breakfast'
          ? 0.35
          : d.id === 'lunch'
            ? 0.75
            : d.id === 'sunset'
              ? 1.65
              : d.id === 'dinner'
                ? 1.15
                : 0.85;
      const effectiveBevShare = Math.min(0.68, Math.max(0.08, bevRatio * daypartBevFactor));
      const bevRevenue = Math.round(d.revenue * effectiveBevShare);
      const foodRevenue = Math.max(0, Math.round(d.revenue) - bevRevenue);
      const avgCheck = d.covers > 0 ? Math.round(d.revenue / d.covers) : 0;

      return {
        id: d.id,
        name: d.name,
        window: d.window,
        covers: d.covers,
        sharePct: d.sharePct,
        revenue: d.revenue,
        foodRevenue,
        bevRevenue,
        avgCheck,
      };
    });
  }, [propMetrics, fnbStatic.categoryId]);

  // Property Operational Signals (clean executive language matching Global F&B View)
  const propertySignals = useMemo(() => {
    const suffix = FNB_PERIOD_SUFFIX[horizon];
    const leadOutlet = propertyOutlets[0]?.outletName || 'Signature Dining';
    const secondOutlet = propertyOutlets[1]?.outletName || 'Sunset Bar & Lounge';
    const captureGap = Math.max(2, Math.round(78 - propMetrics.fnb.captureRatePct));
    const captureOpportunity = Math.round(propMetrics.fnbRevenue * 0.065);
    const dinnerUpsell = Math.round(propMetrics.fnbRevenue * 0.048);
    const bevGap = Math.round(propMetrics.fnbRevenue * 0.035);
    const eventPipeline = Math.round(propMetrics.fnbRevenue * 0.052);

    const signals = [
      {
        id: 'prop-sig-1',
        type: (propMetrics.fnb.captureRatePct < 70 ? 'risk' : 'opportunity') as 'risk' | 'opportunity',
        title:
          propMetrics.fnb.captureRatePct < 70
            ? `In-House Dinner Capture Below Target (${fmtPct(propMetrics.fnb.captureRatePct, 0)})`
            : `Strong In-House Dining Capture (${fmtPct(propMetrics.fnb.captureRatePct, 0)} of Guests)`,
        sub: `${leadOutlet} · Concierge pre-arrival dining reservations`,
        exposure:
          propMetrics.fnb.captureRatePct < 70
            ? `-${captureGap} pts vs Target`
            : `+${fmtUsd(captureOpportunity)} ${suffix}`,
      },
      {
        id: 'prop-sig-2',
        type: 'opportunity' as const,
        title: `Peak Dinner Seating Demand at ${leadOutlet}`,
        sub: `19:30–21:30 window at ${fmtPct(Math.min(96, propMetrics.occupancyPct + 14), 0)} table fill · Second seating uplift`,
        exposure: `+${fmtUsd(dinnerUpsell)} ${suffix}`,
      },
      {
        id: 'prop-sig-3',
        type: (propMetrics.fnb.bevSharePct < 27 ? 'risk' : 'opportunity') as 'risk' | 'opportunity',
        title: `Wine Pairing & Beverage Share (${fmtPct(propMetrics.fnb.bevSharePct, 0)} of F&B Revenue)`,
        sub: `${secondOutlet} · Sommelier flight & sunset aperitif attachment`,
        exposure:
          propMetrics.fnb.bevSharePct < 27
            ? `${fmtUsd(bevGap)} ${suffix}`
            : `+${fmtUsd(bevGap)} ${suffix}`,
      },
      {
        id: 'prop-sig-4',
        type: 'opportunity' as const,
        title: `Private Dining & In-Villa Experience Demand`,
        sub: `${fmtInt(propertyOutlets[2]?.covers ?? 0)} In-Villa covers & ${propertyGroupEvents.events.length} contracted group events`,
        exposure: `+${fmtUsd(eventPipeline)} ${suffix}`,
      },
    ];

    return {
      signals,
      pipelineValue: captureOpportunity + dinnerUpsell + eventPipeline,
    };
  }, [horizon, propertyOutlets, propMetrics, propertyGroupEvents.events.length]);

  // Top Menu & Beverage Leaders at this Property / Venue
  const propertyMenuLeaders = useMemo(() => {
    const propItems = FNB_MENU_ITEMS.filter((item) => item.propertyId === selectedProperty.id);
    const basePool = propItems.length >= 6 ? propItems : [...propItems, ...FNB_MENU_ITEMS.slice(0, 8)];
    const filtered =
      menuFilter === 'all'
        ? basePool
        : menuFilter === 'beverages'
          ? basePool.filter((i) => i.category === 'beverages')
          : basePool.filter((i) => i.category !== 'beverages');

    const list = (filtered.length > 0 ? filtered : basePool).slice(0, 6);
    const leadVenue = propertyOutlets[0]?.outletName || 'Signature Dining';
    const barVenue = propertyOutlets[1]?.outletName || 'Sunset Lounge';

    return list.map((item, idx) => {
      const orders = Math.max(14, Math.round((propMetrics.fnb.covers / 16) * (1 - idx * 0.12)));
      const revenue = orders * item.price;
      const venueName = item.category === 'beverages' ? barVenue : leadVenue;
      const catLabel =
        item.category === 'mains'
          ? 'Signature Main'
          : item.category === 'starters'
            ? 'Appetizer & Crudo'
            : item.category === 'desserts'
              ? 'Pastry & Dessert'
              : 'Wine & Craft Beverage';

      return {
        id: `${item.id}-${idx}`,
        name: item.name,
        venueName,
        catLabel,
        price: item.price,
        orders,
        revenue,
      };
    });
  }, [selectedProperty.id, menuFilter, propMetrics.fnb.covers, propertyOutlets]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 bg-white text-[10px]">
      {/* ───────────────────────── TOP EXECUTIVE HEADER ───────────────────────── */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              F&amp;B Dashboard Property View
            </h1>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{PERIOD_DEFS[horizon].periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Active Resort: <strong className="font-semibold text-zinc-900">{selectedProperty.name}</strong> ({selectedProperty.location} · {propMetrics.rooms} Keys · {propMetrics.fnb.outlets} Operating Outlets)
            </span>
          </div>

          {/* Right Controls: Time Horizon (Yesterday | MTD | YTD) + POS + Export */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
              {PERIOD_ORDER.filter((pid) => pid !== 'forward').map((id) => {
                const t = PERIOD_DEFS[id];
                const active = horizon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setHorizon(id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
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
      </div>

      {/* ───────────────────────── PROPERTY SELECTOR BAR ───────────────────────── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 pb-1">
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
                  {fnbStatic.categoryName}
                </span>
                <AltArrowDown
                  size={15}
                  className={`text-zinc-400 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <span className="text-zinc-500 text-[9.5px] tracking-wider uppercase font-semibold mt-1">
                {selectedProperty.location} · {fnbStatic.cuisineLead}
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
                            {prop.location} · {fmtUsd(pM.fnbRevenue)} {FNB_PERIOD_SUFFIX[horizon]}
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
                <span className="text-[9px] text-zinc-500 font-semibold">Property View</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────── MAIN CONTENT GRID ───────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* 5 HEADLINE METRICS (Identical to Global F&B View, scoped to Selected Property) */}
        <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {activeHeadlineKpis.map((kpi) => (
            <div
              key={kpi.id}
              onClick={() =>
                openDrawer({
                  type: 'FNB_DETAIL',
                  title: `${selectedProperty.name} — ${kpi.label}`,
                  data: {
                    key: 'FNB_HEADLINE_KPI',
                    kpiId: kpi.id,
                    horizon,
                    propertyId: selectedProperty.id,
                    propertyIds: propIds,
                  },
                })
              }
              className={CARD_CLASS}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                  {kpi.label}
                </span>
                <span
                  className={`inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                    kpi.vsLyPos
                      ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                      : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                  }`}
                >
                  {kpi.vsLy}
                </span>
              </div>

              <div className="text-[20px] xl:text-[22px] font-normal text-zinc-900 leading-tight my-1.5 tabular-nums">
                {kpi.value}
              </div>

              <div className="flex items-center gap-1 flex-nowrap">
                <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                  {kpi.vsBudget}
                </span>
                <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                  {kpi.vsForecast}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 1 (4-4-4): F&B Revenue by Revenue Centre | Outlet Daypart Performance | Operational Signals & Opportunities */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 1. F&B REVENUE BY REVENUE CENTRE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — F&B Revenue by Revenue Centre`,
                data: {
                  key: 'FNB_REVENUE_CENTRE_SCORECARD',
                  centre: 'Fine & Specialty Dining',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  F&amp;B REVENUE BY REVENUE CENTRE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  {selectedProperty.name} F&amp;B revenue split across 6 operating centres
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex items-center gap-3.5 flex-1">
              {/* Pure SVG Vector Donut */}
              <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
                <svg
                  width={donutSize}
                  height={donutSize}
                  viewBox={`0 0 ${donutSize} ${donutSize}`}
                  className="transform -rotate-90"
                >
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth={donutStroke}
                  />
                  {donutSegments.map((seg) => {
                    const isHovered = hoveredCentre === seg.id;
                    const isDimmed = hoveredCentre !== null && !isHovered;
                    return (
                      <circle
                        key={seg.id}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHovered ? donutStroke + 2 : donutStroke}
                        strokeDasharray={`${Math.max(0, seg.dash - 1.5)} ${donutCircumference}`}
                        strokeDashoffset={seg.offset}
                        className="transition-all duration-300"
                        style={{ opacity: isDimmed ? 0.35 : 1 }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-bold text-zinc-900 leading-none">
                    {fmtUsd(propMetrics.fnbRevenue)}
                  </span>
                  <span className="text-[7.5px] text-zinc-400 font-medium mt-0.5">Property F&amp;B</span>
                </div>
              </div>

              {/* Right Table */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between gap-1.5 pb-1 px-1 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                  <span>Revenue Centre</span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span>Share %</span>
                    <span className="w-16 text-right">F&amp;B Revenue</span>
                  </div>
                </div>
                {centres.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCentre(c.id)}
                    onMouseLeave={() => setHoveredCentre(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDrawer({
                        type: 'FNB_DETAIL',
                        title: `${selectedProperty.name} — ${c.name}`,
                        data: {
                          key: 'FNB_REVENUE_CENTRE_SCORECARD',
                          centre: c.name,
                          horizon,
                          propertyId: selectedProperty.id,
                          propertyIds: propIds,
                        },
                      });
                    }}
                    className="flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-zinc-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-medium text-zinc-700 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[9.5px] text-zinc-400 tabular-nums">{fmtPct(c.sharePct, 0)}</span>
                      <span className="text-[10px] font-medium text-zinc-900 w-16 text-right tabular-nums">
                        {fmtUsd(c.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. OUTLET & DAYPART PERFORMANCE (Property Level from Screenshot) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Service Daypart Performance`,
                data: {
                  key: 'FNB_DAYPART_RHYTHM',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  OUTLET PERFORMANCE BY DAYPART
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Service hours revenue, food vs beverage split &amp; avg. check
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-4">Service Daypart</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
                <span className="col-span-2 text-right">Food</span>
                <span className="col-span-2 text-right">Bev</span>
                <span className="col-span-2 text-right">Avg. Check</span>
              </div>

              {daypartRows.map((d) => (
                <div key={d.id} className="flex flex-col gap-1">
                  <div className="grid grid-cols-12 items-center tabular-nums">
                    <div className="col-span-4 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-700 truncate block">
                        {d.name}
                      </span>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(d.revenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(d.foodRevenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(d.bevRevenue)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(d.avgCheck)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${Math.min(100, d.sharePct * 1.9)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. OPERATIONAL SIGNALS & OPPORTUNITIES */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Operational Signals & Opportunities`,
                data: {
                  key: 'FNB_HEADLINE_KPI',
                  kpiId: 'capture',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  OPERATIONAL SIGNALS &amp; OPPORTUNITIES
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Property highlights &amp; +{fmtUsd(propertySignals.pipelineValue)} revenue opportunity
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              {propertySignals.signals.map((sig) => {
                const isRisk = sig.type === 'risk';
                return (
                  <div
                    key={sig.id}
                    className="py-1.5 px-1 rounded-lg hover:bg-zinc-200/40 transition-colors flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[9px] mt-0.5 ${
                          isRisk
                            ? 'bg-[#fff1f2] text-[#800020]'
                            : 'bg-[#ecfdf5] text-[#14532d]'
                        }`}
                      >
                        {isRisk ? '!' : '↑'}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[9.5px] font-bold text-zinc-900 truncate">{sig.title}</div>
                        <div className="text-[8.5px] text-zinc-500 truncate">{sig.sub}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        isRisk
                          ? 'bg-[#fff1f2] text-[#800020]'
                          : 'bg-[#ecfdf5] text-[#14532d]'
                      }`}
                    >
                      {sig.exposure}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 2 (6-6): Property Restaurants & Bars Performance | Forward Demand & Outlook */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 4. PROPERTY RESTAURANTS & BARS PERFORMANCE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Restaurants & Bars Performance`,
                data: {
                  key: 'FNB_OUTLET_LEADERBOARD',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  PROPERTY RESTAURANTS &amp; BARS PERFORMANCE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  On-property dining venues, food &amp; beverage split, covers &amp; avg. check
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-zinc-100 p-0.5 rounded-lg"
                >
                  {(
                    [
                      { id: 'all', label: 'All Venues' },
                      { id: 'restaurant', label: 'Restaurants' },
                      { id: 'bar_villa', label: 'In-Villa & Events' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOutletFilter(tab.id)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        outletFilter === tab.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>See details</span> <RoundAltArrowRight size={10} />
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-4">Outlet &amp; Concept</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-1 text-right">Covers</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
                <span className="col-span-1 text-right">Food</span>
                <span className="col-span-1 text-right">Bev</span>
                <span className="col-span-1 text-right">Check</span>
              </div>

              {filteredOutlets.map((out) => (
                <div
                  key={out.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawer({
                      type: 'FNB_DETAIL',
                      title: `${out.outletName} — ${selectedProperty.name}`,
                      data: {
                        key: 'FNB_OUTLET_LEADERBOARD',
                        outletId: out.id,
                        horizon,
                        propertyId: selectedProperty.id,
                        propertyIds: propIds,
                      },
                    });
                  }}
                  className="grid grid-cols-12 items-center py-2 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors tabular-nums"
                >
                  <div className="col-span-4 min-w-0 pr-1">
                    <div className="text-[10px] font-medium text-zinc-800 truncate">{out.outletName}</div>
                    <div className="text-[8px] text-zinc-400 truncate">{out.concept}</div>
                  </div>
                  <span className="col-span-2 text-[9px] text-zinc-500 truncate pr-1">{out.typeLabel}</span>
                  <span className="col-span-1 text-[10px] text-zinc-600 text-right">{fmtInt(out.covers)}</span>
                  <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtUsd(out.revenue)}
                  </span>
                  <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                    {fmtUsd(out.foodRevenue)}
                  </span>
                  <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                    {fmtUsd(out.bevRevenue)}
                  </span>
                  <span className="col-span-1 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtUsdFull(out.avgCheck)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. FORWARD DEMAND & OUTLOOK (Property Level from Screenshot) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Forward F&B Demand & OTB Outlook (${forwardWindow}D)`,
                data: {
                  key: 'FNB_HEADLINE_KPI',
                  kpiId: 'forward',
                  horizon: 'forward',
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  FORWARD DEMAND &amp; OUTLOOK
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Upcoming dining reservations OTB, expected covers &amp; seat capacity load
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-zinc-100 p-0.5 rounded-lg"
                >
                  {([7, 30, 90] as FnbForwardWindow[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setForwardWindow(w)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        forwardWindow === w
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {w}D
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>See details</span> <RoundAltArrowRight size={10} />
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {/* Top 4-KPI Summary Strip */}
              <div className="grid grid-cols-4 gap-2 pb-2 border-b border-zinc-100 tabular-nums">
                <div>
                  <div className="text-[8.5px] text-zinc-400">Expected F&amp;B Covers</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtInt(forwardOutlook.expectedCovers)}
                  </div>
                  <div className="text-[8px] text-zinc-400">
                    {fmtPct(forwardOutlook.forecastCapPct, 0)} of Seat Cap
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Confirmed OTB Covers</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtInt(forwardOutlook.otbCovers)}
                  </div>
                  <div className="text-[8px] text-[#14532d] font-medium">
                    +{forwardOutlook.paceVsLyPct.toFixed(1)}% Pace vs LY
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Confirmed OTB F&amp;B Rev.</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtUsd(forwardOutlook.otbFnbRevenue)}
                  </div>
                  <div className="text-[8px] text-zinc-400">
                    Est. {fmtUsd(forwardOutlook.forecastFnbRevenue)}
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">In-Villa Orders Est.</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtInt(forwardOutlook.villaOrders)}
                  </div>
                  <div className="text-[8px] text-zinc-400">
                    {fmtPct(forwardOutlook.villaSharePct, 0)} of Total Covers
                  </div>
                </div>
              </div>

              {/* Forward Horizon Buckets */}
              <div className="flex-1 flex flex-col justify-between gap-1.5">
                <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                  <span className="col-span-3">Horizon Window</span>
                  <span className="col-span-3">Capacity Load</span>
                  <span className="col-span-2 text-right">Confirmed OTB</span>
                  <span className="col-span-2 text-right">Expected Covers</span>
                  <span className="col-span-2 text-right">Seat Load</span>
                </div>

                {forwardOutlook.buckets.map((b) => (
                  <div
                    key={b.label}
                    className="grid grid-cols-12 items-center py-1 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                  >
                    <div className="col-span-3 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-800">{b.label}</span>
                      <span className="text-[8px] text-zinc-400 ml-1.5">({b.days}d)</span>
                    </div>
                    <div className="col-span-3 pr-2">
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-zinc-900"
                          style={{ width: `${Math.min(100, b.otbPct)}%` }}
                        />
                        <div
                          className="h-full bg-zinc-300"
                          style={{ width: `${Math.min(100 - b.otbPct, b.walkPct)}%` }}
                        />
                      </div>
                    </div>
                    <span className="col-span-2 text-[10px] text-zinc-700 text-right">
                      {fmtInt(b.otbCovers)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtInt(b.forecastCovers)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-[#14532d] text-right">
                      {fmtPct(b.loadPct, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3 (6-6): Top Menu & Beverage Leaders (Property/Venue) | Guest Spend & Origin Market / Group Events */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 6. TOP MENU & BEVERAGE LEADERS (Property / Venue Level from Screenshot) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: `${selectedProperty.name} — Signature Menu & Beverage Leaders`,
                data: {
                  key: 'FNB_MENU_ENGINEERING',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  TOP MENU &amp; BEVERAGE LEADERS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Best-selling signature dishes &amp; sommelier selections at {selectedProperty.name}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-zinc-100 p-0.5 rounded-lg"
                >
                  {(
                    [
                      { id: 'all', label: 'All Items' },
                      { id: 'food', label: 'Signature Dishes' },
                      { id: 'beverages', label: 'Wine & Beverage' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMenuFilter(tab.id)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        menuFilter === tab.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>See details</span> <RoundAltArrowRight size={10} />
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-5">Item &amp; Venue</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-1 text-right">Price</span>
                <span className="col-span-2 text-right">Orders</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
              </div>

              {propertyMenuLeaders.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                >
                  <div className="col-span-5 min-w-0 pr-1.5">
                    <div className="text-[10px] font-medium text-zinc-800 truncate">{item.name}</div>
                    <div className="text-[8px] text-zinc-400 truncate">{item.venueName}</div>
                  </div>
                  <span className="col-span-2 text-[9px] text-zinc-500 truncate pr-1">{item.catLabel}</span>
                  <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                    {fmtUsdFull(item.price)}
                  </span>
                  <span className="col-span-2 text-[10px] text-zinc-700 text-right">
                    {fmtInt(item.orders)}
                  </span>
                  <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtUsd(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. GUEST SPEND & ORIGIN MARKET MIX / PRIVATE EVENTS (Matches Global View 100%) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title:
                  guestPanelTab === 'origins'
                    ? `${selectedProperty.name} — Guest Spend & Origin Market Mix`
                    : `${selectedProperty.name} — Private Dining, Weddings & Buyouts`,
                data: {
                  key: guestPanelTab === 'origins' ? 'FNB_DEMAND_CAPTURE' : 'FNB_BIG_GROUP_EVENTS',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  {guestPanelTab === 'origins'
                    ? 'GUEST SPEND & ORIGIN MARKET MIX'
                    : 'BIG GROUP EVENTS & WEDDINGS'}
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  {guestPanelTab === 'origins'
                    ? 'Origin market F&B revenue, food & beverage split, spend / GN, capture & avg. check'
                    : 'Contracted weddings, private buyouts & gala dinners at this resort'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-zinc-100 p-0.5 rounded-lg"
                >
                  {(
                    [
                      { id: 'origins', label: 'Origin Market Mix' },
                      { id: 'events', label: 'Events & Weddings' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGuestPanelTab(tab.id)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        guestPanelTab === tab.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>See details</span> <RoundAltArrowRight size={10} />
                </span>
              </div>
            </div>

            {guestPanelTab === 'origins' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                  <span className="col-span-3">Origin Market</span>
                  <span className="col-span-2 text-right">F&amp;B Rev.</span>
                  <span className="col-span-1 text-right">Food</span>
                  <span className="col-span-1 text-right">Bev</span>
                  <span className="col-span-2 text-right">Spend / GN</span>
                  <span className="col-span-1 text-right">Capture</span>
                  <span className="col-span-2 text-right">Avg. Check</span>
                </div>
                {origins.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-12 items-center py-1.5 text-[10px] border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                  >
                    <div className="col-span-3 min-w-0 pr-1">
                      <div className="font-medium text-zinc-800 truncate">{r.name}</div>
                      <div className="text-[8px] text-zinc-400 truncate">
                        {fmtPct(r.guestSharePct, 0)} of Guest Nights
                      </div>
                    </div>
                    <span className="col-span-2 text-right font-medium text-zinc-900">
                      {fmtUsd(r.revenue)}
                    </span>
                    <span className="col-span-1 text-right text-zinc-600">{fmtUsd(r.foodRevenue)}</span>
                    <span className="col-span-1 text-right text-zinc-600">{fmtUsd(r.bevRevenue)}</span>
                    <span className="col-span-2 text-right font-medium text-zinc-900">
                      {fmtUsdFull(r.spendPerGuestNight)}
                    </span>
                    <span className="col-span-1 text-right text-[#14532d] font-medium">
                      {fmtPct(r.capturePct, 0)}
                    </span>
                    <span className="col-span-2 text-right font-medium text-zinc-900">
                      {fmtUsdFull(r.avgCheck)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between gap-2">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-zinc-100 tabular-nums">
                  <div>
                    <div className="text-[8.5px] text-zinc-400">Scheduled Events</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {propertyGroupEvents.events.length} Events
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-zinc-400">Total Event Guests</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {fmtInt(propertyGroupEvents.totalPax)} Pax
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-zinc-400">Contracted Event F&amp;B</div>
                    <div className="text-xs font-bold text-[#14532d]">
                      {fmtUsd(propertyGroupEvents.totalRevenue)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                    <span className="col-span-5">Event &amp; Dining Note</span>
                    <span className="col-span-2">Type · Date</span>
                    <span className="col-span-1 text-right">Pax</span>
                    <span className="col-span-2 text-right">F&amp;B Rev.</span>
                    <span className="col-span-2 text-right">Status</span>
                  </div>

                  {propertyGroupEvents.events.slice(0, 5).map((evt) => {
                    const needsAction =
                      evt.readinessStatus === 'Tasting Due' || evt.readinessStatus === 'VIP Prep';
                    return (
                      <div
                        key={evt.id}
                        className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                      >
                        <div className="col-span-5 min-w-0 pr-1.5">
                          <div className="text-[10px] font-medium text-zinc-800 truncate">
                            {evt.eventName}
                          </div>
                          <div className="text-[8px] text-zinc-400 truncate">{evt.attentionNote}</div>
                        </div>
                        <div className="col-span-2 min-w-0 pr-1">
                          <div className="text-[9px] font-medium text-zinc-700 truncate">
                            {evt.eventType}
                          </div>
                          <div className="text-[8px] text-zinc-400">{evt.dateWindow}</div>
                        </div>
                        <span className="col-span-1 text-[10px] text-zinc-700 text-right">
                          {evt.pax}
                        </span>
                        <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                          {fmtUsd(evt.revenue)}
                        </span>
                        <div className="col-span-2 flex justify-end">
                          <span
                            className={`text-[8px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${
                              needsAction
                                ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                                : 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                            }`}
                          >
                            {evt.readinessStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName="Export Report"
      />
    </div>
  );
}
