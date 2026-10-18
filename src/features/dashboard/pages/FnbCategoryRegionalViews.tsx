import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { AltArrowDown, RoundAltArrowRight, UsersGroupTwoRounded } from '@solar-icons/react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { RegionalPickerWidget } from '../components/widgets/regional/RegionalPickerWidget';
import {
  MASTER_CATEGORIES,
  resolveCategoryId,
  formatCategorySelectionTitle,
  type HotelCategoryId,
} from '@/constants/categories';
import {
  MASTER_REGIONS,
  resolveRegionId,
  formatRegionSelectionTitle,
  type RegionId,
} from '@/constants/regions';
import { IN_HOUSE_FNB_GUESTS } from '@/features/fnb/data/fnbMenuData';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { getPortfolioMetrics, getPropertyMetrics, PERIOD_DEFS, type PeriodId } from '@/data/portfolio';
import { FNB_PROPERTY_STATIC } from '@/data/portfolio/fnbMix';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

type TimeHorizon = PeriodId;

const _mtdPortfolioFnbRev = getPortfolioMetrics(undefined, 'mtd').fnbRevenue || 1;

const HORIZON_TABS: { id: TimeHorizon; label: string; factor: number; periodLabel: string }[] = [
  {
    id: 'today',
    label: 'Today',
    factor: getPortfolioMetrics(undefined, 'today').fnbRevenue / _mtdPortfolioFnbRev,
    periodLabel: PERIOD_DEFS.today.periodLabel,
  },
  {
    id: 'mtd',
    label: 'MTD',
    factor: 1,
    periodLabel: PERIOD_DEFS.mtd.periodLabel,
  },
  {
    id: 'ytd',
    label: 'YTD',
    factor: getPortfolioMetrics(undefined, 'ytd').fnbRevenue / _mtdPortfolioFnbRev,
    periodLabel: PERIOD_DEFS.ytd.periodLabel,
  },
  {
    id: 'forward',
    label: 'Forward Business',
    factor: getPortfolioMetrics(undefined, 'forward').fnbRevenue / _mtdPortfolioFnbRev,
    periodLabel: PERIOD_DEFS.forward.periodLabel,
  },
];

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

export interface MasterFnbPropertyRecord {
  id: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  regionId: RegionId;
  regionName: string;
  location: string;
  rooms: number;
  outletsCount: number;
  signatureOutlets: string;
  mtdFnbRev: number;       // USD in MTD (or active period when mapped)
  mtdCovers: number;       // Covers in MTD (or active period when mapped)
  captureRate: number;     // %
  avgCheck: number;        // USD
  spendPerGuest: number;   // USD
  revpash: number;         // USD
  seatTurn: number;        // x
  bevShare: number;        // %
  lflGrowth: number;       // % YoY
  status: 'above_plan' | 'on_plan' | 'attention';
  cuisineLead: string;
}

function buildFnbPropertyRecord(staticProp: (typeof FNB_PROPERTY_STATIC)[number], period: PeriodId): MasterFnbPropertyRecord {
  const m = getPropertyMetrics(staticProp.id, period);
  return {
    id: staticProp.id,
    name: staticProp.name,
    categoryId: staticProp.categoryId,
    categoryName: staticProp.categoryName,
    regionId: staticProp.regionId,
    regionName: staticProp.regionName,
    location: staticProp.location,
    rooms: m.rooms,
    outletsCount: m.fnb.outlets,
    signatureOutlets: staticProp.signatureOutlets,
    mtdFnbRev: m.fnbRevenue,
    mtdCovers: m.fnb.covers,
    captureRate: Number(m.fnb.captureRatePct.toFixed(1)),
    avgCheck: Math.round(m.fnb.avgCheck),
    spendPerGuest: Math.round(m.fnb.spendPerGuestNight),
    revpash: Number(m.fnb.revpash.toFixed(2)),
    seatTurn: Number(m.fnb.seatTurn.toFixed(2)),
    bevShare: Number(m.fnb.bevSharePct.toFixed(1)),
    lflGrowth: Number(m.vsLy.fnbRevenuePct.toFixed(1)),
    status: staticProp.status,
    cuisineLead: staticProp.cuisineLead,
  };
}

/**
 * 100% Synchronized Master F&B Property Dataset across all 10 SOSEI Resorts (derived from @/data/portfolio)
 */
export const MASTER_FNB_PROPERTIES: MasterFnbPropertyRecord[] = FNB_PROPERTY_STATIC.map((s) =>
  buildFnbPropertyRecord(s, 'mtd')
);

const getRegionForCountry = (name: string) => {
  const n = name.toLowerCase();
  if (
    [
      'united states of america', 'canada', 'mexico', 'brazil', 'argentina', 'colombia',
      'peru', 'venezuela', 'chile', 'guatemala', 'ecuador', 'bolivia', 'cuba', 'haiti',
      'dominican rep.', 'honduras', 'paraguay', 'nicaragua', 'el salvador', 'costa rica',
      'panama', 'uruguay', 'jamaica', 'puerto rico', 'greenland',
    ].includes(n)
  )
    return 'America';
  if (
    [
      'saudi arabia', 'iran', 'turkey', 'iraq', 'yemen', 'syria', 'united arab emirates',
      'israel', 'jordan', 'lebanon', 'oman', 'kuwait', 'qatar', 'bahrain', 'palestine',
    ].includes(n)
  )
    return 'Middle East';
  if (
    [
      'germany', 'united kingdom', 'france', 'italy', 'spain', 'ukraine',
      'poland', 'romania', 'netherlands', 'belgium', 'czechia', 'greece', 'portugal',
      'sweden', 'hungary', 'belarus', 'austria', 'serbia', 'switzerland', 'bulgaria',
      'denmark', 'finland', 'slovakia', 'norway', 'ireland', 'croatia', 'moldova',
      'bosnia and herz.', 'albania', 'lithuania', 'north macedonia', 'slovenia',
      'latvia', 'estonia', 'montenegro', 'luxembourg', 'iceland',
    ].includes(n)
  )
    return 'Europe';
  if (
    [
      'nigeria', 'ethiopia', 'egypt', 'dem. rep. congo', 'tanzania', 'south africa',
      'kenya', 'uganda', 'algeria', 'sudan', 'morocco', 'angola', 'mozambique', 'ghana',
      'madagascar', 'cameroon', "côte d'ivoire", 'niger', 'burkina faso', 'mali',
      'malawi', 'zambia', 'senegal', 'chad', 'somalia', 'zimbabwe', 'guinea', 'rwanda',
      'benin', 'burundi', 'tunisia', 'south sudan', 'togo', 'sierra leone', 'libya',
      'congo', 'liberia', 'central african rep.', 'mauritania', 'eritrea', 'namibia',
      'gambia', 'botswana', 'gabon', 'lesotho', 'guinea-bissau', 'eq. guinea',
      'mauritius', 'eswatini', 'djibouti', 'comoros',
    ].includes(n)
  )
    return 'Africa';
  if (
    [
      'china', 'india', 'indonesia', 'pakistan', 'bangladesh', 'japan', 'philippines',
      'vietnam', 'thailand', 'myanmar', 'south korea', 'afghanistan', 'uzbekistan',
      'malaysia', 'nepal', 'north korea', 'sri lanka', 'kazakhstan', 'cambodia',
      'azerbaijan', 'tajikistan', 'laos', 'kyrgyzstan', 'turkmenistan', 'singapore',
      'georgia', 'mongolia', 'armenia', 'timor-leste', 'cyprus', 'bhutan', 'maldives',
      'brunei', 'australia', 'papua new guinea', 'new zealand', 'fiji', 'solomon is.',
      'vanuatu', 'new caledonia', 'taiwan',
    ].includes(n)
  )
    return 'Asia Pacific';
  return 'Unknown';
};

const COLOR_PALETTE = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000).toLocaleString()}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

const fmtCount = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
};

/**
 * Pure SVG Donut Chart (size=110, strokeWidth=14 per AGENTS.md Section 5)
 */
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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = data.map((d) => {
    const dash = (d.value / 100) * circumference;
    const offset = -(cumulative / 100) * circumference;
    cumulative += d.value;
    return { ...d, dash, offset };
  });

  return (
    <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg) => (
          <circle
            key={seg.name}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference}`}
            strokeDashoffset={seg.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[11px] font-bold text-zinc-900 leading-none">{centerValue}</span>
        <span className="text-[7.5px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}

/**
 * Shared Analytics Engine for both F&B Categories View and F&B Regional View
 */
function useFnbFilteredAnalytics(
  filteredProps: MasterFnbPropertyRecord[],
  horizon: TimeHorizon,
  mode: 'categories' | 'regional'
) {
  const baseMeta = HORIZON_TABS.find((h) => h.id === horizon) || HORIZON_TABS[1];
  const horizonMeta = useMemo(() => ({ ...baseMeta, factor: 1 }), [baseMeta]);
  const factor = 1;

  return useMemo(() => {
    const baseProps = filteredProps.length > 0 ? filteredProps : MASTER_FNB_PROPERTIES;
    const ids = baseProps.map((p) => p.id);
    const activeProps = baseProps.map((p) => {
      const staticDef = FNB_PROPERTY_STATIC.find((s) => s.id === p.id) || FNB_PROPERTY_STATIC[0];
      return buildFnbPropertyRecord(staticDef, horizon);
    });
    const m = getPortfolioMetrics(ids, horizon);

    const totalRooms = m.rooms;
    const totalOutlets = m.fnb.outlets;
    const totalFnbRev = m.fnbRevenue;
    const totalCovers = m.fnb.covers;

    const avgCapture = Number(m.fnb.captureRatePct.toFixed(1));
    const avgCheck = Math.round(m.fnb.avgCheck);
    const avgSpendGuest = Math.round(m.fnb.spendPerGuestNight);
    const avgRevpash = Number(m.fnb.revpash.toFixed(2));
    const avgSeatTurn = Number(m.fnb.seatTurn.toFixed(2));
    const avgBevShare = Number(m.fnb.bevSharePct.toFixed(1));
    const avgLfl = Number(m.vsLy.fnbRevenuePct.toFixed(1));

    // Revenue Centre Breakdown (Fine 37.3%, All-Day 20.9%, Bars 15.5%, In-Villa 11.8%, Events & Pool 14.5%)
    const centreShares = [
      { name: 'Fine & Specialty', share: 37.3, checkFactor: 1.24, color: '#0f172a' },
      { name: 'All-Day & Buffet', share: 20.9, checkFactor: 0.76, color: '#334155' },
      { name: 'Bars & Lounges', share: 15.5, checkFactor: 0.88, color: '#64748b' },
      { name: 'Events & Private', share: 14.5, checkFactor: 1.42, color: '#94a3b8' },
      { name: 'In-Villa & Pool', share: 11.8, checkFactor: 0.84, color: '#cbd5e1' },
    ];

    const centreTable = centreShares.map((c) => {
      const rev = totalFnbRev * (c.share / 100);
      const check = Math.round(avgCheck * c.checkFactor);
      return {
        centre: c.name,
        share: `${c.share.toFixed(1)}%`,
        avgCheck: `$${check}`,
        revenue: fmtMoney(rev),
        isTotal: false,
      };
    });
    centreTable.push({
      centre: 'Total',
      share: '100%',
      avgCheck: `$${avgCheck}`,
      revenue: fmtMoney(totalFnbRev),
      isTotal: true,
    });

    // Dining Demand Source / Meal-Plan Split
    const demandSources = [
      { name: 'À La Carte In-House', share: 46.0, checkFactor: 1.12, color: '#0f172a' },
      { name: 'Meal-Plan Package', share: 24.0, checkFactor: 0.86, color: '#334155' },
      { name: 'Private & Bespoke', share: 12.0, checkFactor: 1.54, color: '#64748b' },
      { name: 'External / Walk-In', share: 10.0, checkFactor: 1.05, color: '#94a3b8' },
      { name: 'In-Villa / Room Svc', share: 8.0, checkFactor: 0.78, color: '#cbd5e1' },
    ];

    const demandTable = demandSources.map((d) => {
      const rev = totalFnbRev * (d.share / 100);
      const check = Math.round(avgCheck * d.checkFactor);
      return {
        source: d.name,
        share: `${d.share.toFixed(1)}%`,
        avgCheck: `$${check}`,
        revenue: fmtMoney(rev),
        isTotal: false,
      };
    });
    demandTable.push({
      source: 'Total',
      share: '100%',
      avgCheck: `$${avgCheck}`,
      revenue: fmtMoney(totalFnbRev),
      isTotal: true,
    });

    // Origin / Regional Market Breakdown
    const regionShares =
      mode === 'regional'
        ? MASTER_REGIONS.filter((r) => activeProps.some((p) => p.regionId === r.id)).map((r) => {
            const regProps = activeProps.filter((p) => p.regionId === r.id);
            const regRev = regProps.reduce((s, p) => s + p.mtdFnbRev * factor, 0);
            const regCovers = regProps.reduce((s, p) => s + p.mtdCovers * factor, 0);
            const regCap =
              regProps.reduce((s, p) => s + p.captureRate * p.mtdFnbRev, 0) /
              (regProps.reduce((s, p) => s + p.mtdFnbRev, 0) || 1);
            const regCheck = Math.round(
              regProps.reduce((s, p) => s + p.avgCheck * p.mtdFnbRev, 0) /
                (regProps.reduce((s, p) => s + p.mtdFnbRev, 0) || 1)
            );
            return {
              region: r.name,
              shareNum: totalCovers > 0 ? Number(((regCovers / totalCovers) * 100).toFixed(1)) : 0,
              coversShare: totalCovers > 0 ? `${((regCovers / totalCovers) * 100).toFixed(1)}%` : '0.0%',
              capture: `${regCap.toFixed(1)}%`,
              avgCheck: `$${regCheck}`,
              revenue: fmtMoney(regRev),
              isTotal: false,
            };
          })
        : [
            { region: 'Asia Pacific', weight: 36.5, cap: '74.2%', checkFactor: 1.04 },
            { region: 'Europe', weight: 25.5, cap: '71.8%', checkFactor: 1.08 },
            { region: 'America', weight: 19.0, cap: '75.4%', checkFactor: 0.96 },
            { region: 'Middle East', weight: 11.5, cap: '82.6%', checkFactor: 1.14 },
            { region: 'Africa', weight: 7.5, cap: '61.4%', checkFactor: 0.82 },
          ].map((g) => ({
            region: g.region,
            shareNum: g.weight,
            coversShare: `${g.weight.toFixed(1)}%`,
            capture: g.cap,
            avgCheck: `$${Math.round(avgCheck * g.checkFactor)}`,
            revenue: fmtMoney(totalFnbRev * (g.weight / 100)),
            isTotal: false,
          }));

    const geoTable = [
      ...regionShares,
      {
        region: 'Total',
        shareNum: 100,
        coversShare: '100%',
        capture: `${avgCapture}%`,
        avgCheck: `$${avgCheck}`,
        revenue: fmtMoney(totalFnbRev),
        isTotal: true,
      },
    ];

    return {
      horizon,
      propertyIds: ids,
      activeProps,
      totalRooms,
      totalOutlets,
      totalFnbRev,
      totalCovers,
      avgCapture,
      avgCheck,
      avgSpendGuest,
      avgRevpash,
      avgSeatTurn,
      avgBevShare,
      avgLfl,
      centreShares,
      centreTable,
      demandSources,
      demandTable,
      geoTable,
      horizonMeta,
    };
  }, [filteredProps, factor, mode, horizonMeta, horizon]);
}

/**
 * Shared Body Layout for both /dashboard/fnb/categories and /dashboard/fnb/regional
 */
function FnbAnalyticsBody({
  analytics,
  selectionTitle,
  mode,
}: {
  analytics: ReturnType<typeof useFnbFilteredAnalytics>;
  selectionTitle: string;
  mode: 'categories' | 'regional';
}) {
  const { openDrawer } = useDashboardDrawer();
  const navigate = useNavigate();

  // Choropleth region colors sorted by share
  const sortedRegions = [...analytics.geoTable]
    .filter((r) => !r.isTotal && r.shareNum > 0)
    .sort((a, b) => b.shareNum - a.shareNum)
    .map((r) => r.region);

  const regionColors: Record<string, string> = { Unknown: '#e4e4e7' };
  sortedRegions.forEach((reg, idx) => {
    regionColors[reg] = COLOR_PALETTE[idx] || COLOR_PALETTE[COLOR_PALETTE.length - 1];
  });

  const heroBreakdown = [
    { label: 'Specialty', val: fmtMoney(analytics.totalFnbRev * 0.373), pct: '37.3%' },
    { label: 'All-Day', val: fmtMoney(analytics.totalFnbRev * 0.209), pct: '20.9%' },
    { label: 'Bars', val: fmtMoney(analytics.totalFnbRev * 0.155), pct: '15.5%' },
    { label: 'Events/IVD', val: fmtMoney(analytics.totalFnbRev * 0.263), pct: '26.3%' },
  ];

  const isPosLfl = analytics.avgLfl >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ───────────────── 5 F&B KPI CARDS ROW (Hero 2-col + 4 Core F&B KPIs) ───────────────── */}
      <div className="-mx-4 grid grid-cols-2 lg:grid-cols-6 gap-2.5 items-stretch">
        {/* Card 1 (Hero 2-col): TOTAL F&B REVENUE */}
        <div
          className={`col-span-2 ${CARD_CLASS}`}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Total F&B Revenue — ${selectionTitle}`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'revenue',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <InfoTooltip text="Total F&B revenue across Fine Dining, All-Day Dining, Bars, Pool/Beach, In-Villa Dining, and Banquets for the selected filter.">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  TOTAL F&amp;B REVENUE
                </span>
              </InfoTooltip>
              <span className="text-[8.5px] font-semibold px-1.5 py-0.2 rounded-full bg-zinc-200/70 text-zinc-700 shrink-0">
                {analytics.totalOutlets} Outlets
              </span>
            </div>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                isPosLfl
                  ? 'bg-[#ecfdf5] text-[#14532d]'
                  : 'bg-[#fff1f2] text-[#800020]'
              }`}
            >
              {isPosLfl ? '+' : ''}
              {analytics.avgLfl}% vs LY
            </span>
          </div>

          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              {fmtMoney(analytics.totalFnbRev)}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                +4.6% vs Budget
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                {fmtCount(analytics.totalCovers)} Covers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-200/60">
            {heroBreakdown.map((item) => (
              <div key={item.label} className="min-w-0">
                <div className="text-[8.5px] text-zinc-400 truncate">{item.label}</div>
                <div className="text-[11px] font-medium text-zinc-900 leading-tight">{item.val}</div>
                <div className="text-[8px] text-zinc-400">{item.pct}</div>
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
              title: `In-House Guest Capture Rate — ${selectionTitle}`,
              data: {
                key: 'FNB_DEMAND_CAPTURE',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Percentage of in-house resort guests dining at property F&B outlets at least once per day.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                GUEST CAPTURE
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +4.2 pts vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              {analytics.avgCapture}%
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              Breakfast 94.2% · Dinner {Math.max(42, Math.round(analytics.avgCapture - 5.6))}%
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +2.3 pts vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              {analytics.totalRooms} Keys
            </span>
          </div>
        </div>

        {/* Card 3: AVG CHECK & SPEND / GUEST */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Average Check & Spend per Guest — ${selectionTitle}`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'spend',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Average POS check value and daily F&B spend per occupied resort guest.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                AVG CHECK (USD)
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +$14 vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              ${analytics.avgCheck}
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              ${analytics.avgSpendGuest} Daily Spend / Guest
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +$8 vs Budget
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +8.2% YoY
            </span>
          </div>
        </div>

        {/* Card 4: REVPASH & SEAT TURN */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Outlet Productivity & RevPASH — ${selectionTitle}`,
              data: {
                key: 'FNB_REVENUE_CENTRE_SCORECARD',
                centre: 'Fine & Specialty Dining',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Revenue Per Available Seat Hour (RevPASH) and average dining table turnover.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                REVPASH (USD)
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +9.4% vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              ${analytics.avgRevpash.toFixed(2)}
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              {analytics.avgSeatTurn}x Avg Table Turn
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +$3.40 vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              IVD 23.4m SLA
            </span>
          </div>
        </div>

        {/* Card 5: BEVERAGE & WINE SHARE */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Beverage, Mixology & Sommelier Performance — ${selectionTitle}`,
              data: {
                key: 'FNB_HEADLINE_KPI',
                kpiId: 'beverage',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text="Beverage & Wine revenue share of total F&B revenue and sommelier wine pairing attachment.">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                BEVERAGE SHARE
              </span>
            </InfoTooltip>
            <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d]">
              +2.6 pts vs LY
            </span>
          </div>
          <div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">
              {analytics.avgBevShare}%
            </div>
            <div className="text-[9px] text-zinc-400 font-normal">
              {fmtMoney(analytics.totalFnbRev * (analytics.avgBevShare / 100))} Bev &amp; Wine Rev
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              +1.4 pts vs Plan
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              43.8% Attach
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 1: 3-COLUMN ANALYTICS BREAKDOWN (Geo Map | Revenue Centre Mix | Demand Source Mix) ───────────────── */}
      <div className="-mx-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* WIDGET 1: GEO ORIGIN & DINER MARKET STATS */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `F&B Geographic Origin & Regional Market Stats — ${selectionTitle}`,
              data: {
                key: 'FNB_DEMAND_CAPTURE',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="Geographic distribution of F&B covers, guest capture rate, average check, and F&B revenue across global regions.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  {mode === 'regional' ? 'Regional F&B Footprint' : 'Diner Origin Market Stats'}
                </span>
              </InfoTooltip>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>See details</span> <RoundAltArrowRight size={10} />
            </span>
          </div>

          <div className="w-full flex justify-center items-center py-1 h-[120px] overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 98, center: [15, 20] }}
              width={400}
              height={200}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const reg = getRegionForCountry(geo.properties.name);
                    const isActiveRegion = Boolean(regionColors[reg]);
                    const fillColor = regionColors[reg] || regionColors['Unknown'];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#d4d4d8"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: isActiveRegion ? '#0f172a' : fillColor },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          <div className="mt-auto pt-2">
            <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                  <th className="text-left pb-2 pt-1 pr-1 w-[32%] truncate font-medium">Region</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[20%] truncate font-medium">% Covers</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[22%] truncate font-medium">Capture</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[26%] truncate font-medium">F&amp;B Rev</th>
                </tr>
              </thead>
              <tbody>
                {analytics.geoTable.map((row) => (
                  <tr
                    key={row.region}
                    className={`text-[10px] border-b border-zinc-100 ${
                      row.isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'
                    }`}
                  >
                    <td className="py-2 pr-1 truncate">{row.region}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.coversShare}</td>
                    <td className="text-right py-2 px-1 truncate text-[#14532d] font-medium">{row.capture}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WIDGET 2: REVENUE CENTRE MIX STATS */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Revenue Centre Breakdown — ${selectionTitle}`,
              data: {
                key: 'FNB_REVENUE_CENTRE_SCORECARD',
                centre: 'Fine & Specialty Dining',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="F&B revenue and average check contribution across Specialty Dining, All-Day Dining, Bars, Private Events, and In-Villa Dining.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  Revenue Centre Mix
                </span>
              </InfoTooltip>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>See details</span> <RoundAltArrowRight size={10} />
            </span>
          </div>

          <div className="flex items-center gap-5 px-1 py-1 h-[120px]">
            <PureSvgFnbDonut
              data={analytics.centreShares.map((c) => ({ name: c.name, value: c.share, color: c.color }))}
              centerValue={fmtCount(analytics.totalCovers)}
              centerLabel="Covers"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              {analytics.centreShares.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-[9.5px] text-zinc-700 font-medium truncate">{c.name}</span>
                  </div>
                  <span className="text-[9.5px] text-zinc-500 font-medium shrink-0">{c.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                  <th className="text-left pb-2 pt-1 pr-1 w-[34%] truncate font-medium">Revenue Centre</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">% Share</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[22%] truncate font-medium">Avg Check</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[26%] truncate font-medium">F&amp;B Rev</th>
                </tr>
              </thead>
              <tbody>
                {analytics.centreTable.map((row) => (
                  <tr
                    key={row.centre}
                    className={`text-[10px] border-b border-zinc-100 ${
                      row.isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'
                    }`}
                  >
                    <td className="py-2 pr-1 truncate">{row.centre}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.share}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.avgCheck}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WIDGET 3: DEMAND SOURCE & MEAL-PLAN DISTRIBUTION */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'FNB_DETAIL',
              title: `Dining Channel & Meal-Plan Split — ${selectionTitle}`,
              data: {
                key: 'FNB_DEMAND_CAPTURE',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="Distribution of F&B revenue between Paid À La Carte in-house guests, Meal-Plan allocations, Private Dining, External guests, and In-Villa Service.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  Dining Source &amp; Channel Mix
                </span>
              </InfoTooltip>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>See details</span> <RoundAltArrowRight size={10} />
            </span>
          </div>

          <div className="flex items-center gap-5 px-1 py-1 h-[120px]">
            <PureSvgFnbDonut
              data={analytics.demandSources.map((d) => ({ name: d.name, value: d.share, color: d.color }))}
              centerValue={fmtMoney(analytics.totalFnbRev)}
              centerLabel="F&B Rev"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              {analytics.demandSources.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[9.5px] text-zinc-700 font-medium truncate">{d.name}</span>
                  </div>
                  <span className="text-[9.5px] text-zinc-500 font-medium shrink-0">{d.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                  <th className="text-left pb-2 pt-1 pr-1 w-[34%] truncate font-medium">Dining Source</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">% Share</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[22%] truncate font-medium">Avg Check</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[26%] truncate font-medium">F&amp;B Rev</th>
                </tr>
              </thead>
              <tbody>
                {analytics.demandTable.map((row) => (
                  <tr
                    key={row.source}
                    className={`text-[10px] border-b border-zinc-100 ${
                      row.isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'
                    }`}
                  >
                    <td className="py-2 pr-1 truncate">{row.source}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.share}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.avgCheck}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 2: PROPERTY-LEVEL F&B BENCHMARK TABLE FOR SELECTED FILTER ───────────────── */}
      <div
        className={`-mx-4 ${CARD_CLASS}`}
        onClick={() =>
          openDrawer({
            type: 'FNB_DETAIL',
            title: `Resort F&B Performance Benchmark — ${selectionTitle}`,
            data: {
              key: 'FNB_HEADLINE_KPI',
              kpiId: 'revenue',
              horizon: analytics.horizon,
              propertyIds: analytics.propertyIds,
            },
          })
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 mb-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              RESORT F&amp;B PERFORMANCE BENCHMARK ({selectionTitle.toUpperCase()})
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
              Property-by-property culinary revenue, covers, guest capture, average check, RevPASH &amp; LFL growth
            </p>
          </div>
          <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 self-start sm:self-auto">
            {analytics.activeProps.length} Active {analytics.activeProps.length === 1 ? 'Resort' : 'Resorts'} · {analytics.totalOutlets} Outlets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                <th className="text-left py-2 pr-2 font-medium">Resort Property</th>
                <th className="text-left py-2 px-2 font-medium">Collection &amp; Region</th>
                <th className="text-left py-2 px-2 font-medium">Signature Outlets &amp; Cuisine Lead</th>
                <th className="text-right py-2 px-2 font-medium">Covers</th>
                <th className="text-right py-2 px-2 font-medium">Capture</th>
                <th className="text-right py-2 px-2 font-medium">Avg Check</th>
                <th className="text-right py-2 px-2 font-medium">RevPASH</th>
                <th className="text-right py-2 px-2 font-medium">Bev Share</th>
                <th className="text-right py-2 px-2 font-medium">F&amp;B Revenue</th>
                <th className="text-right py-2 pl-2 font-medium">LFL YoY</th>
              </tr>
            </thead>
            <tbody>
              {analytics.activeProps.map((prop) => {
                const dotColor =
                  prop.status === 'above_plan'
                    ? 'bg-[#14532d]'
                    : prop.status === 'attention'
                      ? 'bg-[#800020]'
                      : 'bg-zinc-500';
                const propRev = prop.mtdFnbRev * analytics.horizonMeta.factor;
                const propCovers = Math.round(prop.mtdCovers * analytics.horizonMeta.factor);
                const isNeg = prop.lflGrowth < 0;

                return (
                  <tr
                    key={prop.id}
                    onClick={() => navigate(`/dashboard/fnb/property?id=${prop.id}`)}
                    className="text-[10px] border-b border-zinc-100 hover:bg-zinc-200/40 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                        <div>
                          <div className="font-bold text-zinc-900">{prop.name}</div>
                          <div className="text-[8.5px] text-zinc-400">{prop.location} · {prop.rooms} Keys</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-medium text-zinc-800">{prop.categoryName}</div>
                      <div className="text-[8.5px] text-zinc-400">{prop.regionName}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-medium text-zinc-700 truncate max-w-[230px]">{prop.signatureOutlets}</div>
                      <div className="text-[8.5px] text-zinc-400">{prop.cuisineLead} · {prop.outletsCount} Venues</div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-800">
                      {propCovers.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-[#14532d]">
                      {prop.captureRate}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-900">
                      ${prop.avgCheck}
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-800">
                      ${prop.revpash.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-700">
                      {prop.bevShare}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-zinc-900">
                      {fmtMoney(propRev)}
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <span
                        className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded ${
                          isNeg
                            ? 'bg-[#fff1f2] text-[#800020]'
                            : 'bg-[#ecfdf5] text-[#14532d]'
                        }`}
                      >
                        {isNeg ? '' : '+'}
                        {prop.lflGrowth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────── ROW 3: COLLAPSIBLE IN-HOUSE GUESTS DIRECTORY (HIDE / SHOW) ───────────────── */}
      <CollapsibleInHouseGuestsSection activePropertyIds={analytics.activeProps.map((p) => p.id)} selectionTitle={selectionTitle} />
    </div>
  );
}

function CollapsibleInHouseGuestsSection({
  activePropertyIds,
  selectionTitle,
}: {
  activePropertyIds: string[];
  selectionTitle: string;
}) {
  const [showInHouseGuests, setShowInHouseGuests] = useState<boolean>(true);

  const filteredGuests = useMemo(
    () => IN_HOUSE_FNB_GUESTS.filter((g) => activePropertyIds.includes(g.propertyId)),
    [activePropertyIds]
  );

  return (
    <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 animate-card-enter">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              IN-HOUSE GUESTS DINING &amp; DIETARY DIRECTORY ({selectionTitle.toUpperCase()})
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
              Registered in-house VIP guests, suite/villa numbers, party size &amp; critical allergen profiles
            </p>
          </div>
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
            {filteredGuests.length}
          </span>
          <AltArrowDown
            size={11}
            className={`transition-transform duration-200 ${showInHouseGuests ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {showInHouseGuests && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-3 animate-fade-in">
          {filteredGuests.map((guest) => {
            const hasAllergies = guest.allergies.length > 0;
            return (
              <div
                key={guest.id}
                className="p-3 rounded-[10px] border border-zinc-200/70 bg-zinc-50/40 hover:bg-zinc-100/60 transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-[10.5px] font-bold text-zinc-900 truncate">{guest.name}</span>
                    <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-700 shrink-0">
                      {guest.partySize} Pax
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-0.5 truncate">
                    {guest.property} · {guest.room}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-zinc-100">
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
                    <span className="text-[8px] text-[#14532d] font-medium">No registered allergies</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * 1. /dashboard/fnb/categories — F&B Property Categories View (5 SOSEI Luxury Collections)
 */
export function FnbCategoriesView() {
  const [activeResorts, setActiveResorts] = useState<string[]>(MASTER_CATEGORIES.map((c) => c.id));
  const [horizon, setHorizon] = useState<TimeHorizon>('mtd');
  const [showDevModal, setShowDevModal] = useState(false);

  const canonicalCategories = useMemo(
    () => (activeResorts.length > 0 ? activeResorts.map(resolveCategoryId) : ['urban']),
    [activeResorts]
  );

  const selectionTitle = useMemo(
    () => formatCategorySelectionTitle(canonicalCategories),
    [canonicalCategories]
  );

  const filteredProps = useMemo(
    () => MASTER_FNB_PROPERTIES.filter((p) => canonicalCategories.includes(p.categoryId)),
    [canonicalCategories]
  );

  const analytics = useFnbFilteredAnalytics(filteredProps, horizon, 'categories');

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      {/* Top Executive Header */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            F&amp;B Dashboard Property Categories
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Collection Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalOutlets} F&amp;B Outlets)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canonicalCategories.length < MASTER_CATEGORIES.length && (
            <button
              type="button"
              onClick={() => setActiveResorts(MASTER_CATEGORIES.map((c) => c.id))}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 text-[9.5px] font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
            >
              All 5 Collections
            </button>
          )}

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
            onClick={() => setShowDevModal(true)}
            className="h-7 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3 font-medium flex items-center gap-1.5 bg-white transition-all shadow-2xs cursor-pointer"
          >
            <AltArrowDown size={13} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 5 Luxury Collections Picker Gallery */}
      <div className="w-full pb-2 pt-0.5">
        <ResortPickerWidget activeResorts={activeResorts} setActiveResorts={setActiveResorts} />
      </div>

      {/* Shared F&B Analytics Body */}
      <FnbAnalyticsBody analytics={analytics} selectionTitle={selectionTitle} mode="categories" />

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}

/**
 * 2. /dashboard/fnb/regional — F&B Regional View (5 Global Regions)
 */
export function FnbRegionalView() {
  const [activeRegions, setActiveRegions] = useState<string[]>(MASTER_REGIONS.map((r) => r.id));
  const [horizon, setHorizon] = useState<TimeHorizon>('mtd');
  const [showDevModal, setShowDevModal] = useState(false);

  const canonicalRegions = useMemo(
    () => (activeRegions.length > 0 ? activeRegions.map(resolveRegionId) : ['asia-pacific']),
    [activeRegions]
  );

  const selectionTitle = useMemo(
    () => formatRegionSelectionTitle(canonicalRegions),
    [canonicalRegions]
  );

  const filteredProps = useMemo(
    () => MASTER_FNB_PROPERTIES.filter((p) => canonicalRegions.includes(p.regionId)),
    [canonicalRegions]
  );

  const analytics = useFnbFilteredAnalytics(filteredProps, horizon, 'regional');

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      {/* Top Executive Header */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            F&amp;B Dashboard Regional
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Regional Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalOutlets} F&amp;B Outlets)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canonicalRegions.length < MASTER_REGIONS.length && (
            <button
              type="button"
              onClick={() => setActiveRegions(MASTER_REGIONS.map((r) => r.id))}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 text-[9.5px] font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
            >
              All 5 Regions
            </button>
          )}

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
            onClick={() => setShowDevModal(true)}
            className="h-7 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3 font-medium flex items-center gap-1.5 bg-white transition-all shadow-2xs cursor-pointer"
          >
            <AltArrowDown size={13} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 5 Global Regions Picker Gallery */}
      <div className="w-full pb-2 pt-0.5">
        <RegionalPickerWidget activeRegions={activeRegions} setActiveRegions={setActiveRegions} />
      </div>

      {/* Shared F&B Analytics Body */}
      <FnbAnalyticsBody analytics={analytics} selectionTitle={selectionTitle} mode="regional" />

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
