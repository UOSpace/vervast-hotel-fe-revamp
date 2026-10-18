import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
  AltArrowDown,
  Magnifer,
  RoundAltArrowRight,
  UsersGroupTwoRounded,
} from '@solar-icons/react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { RegionalPickerWidget } from '../components/widgets/regional/RegionalPickerWidget';
import { ExperienceKpiRow } from '../components/widgets/experience/ExperienceKpiRow';
import {
  MASTER_CATEGORIES,
  MASTER_PROPERTIES,
  resolveCategoryId,
  resolvePropertyId,
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
import {
  getPortfolioMetrics,
  getPropertyMetrics,
  splitByShares,
  PERIOD_DEFS,
  type PeriodId,
} from '@/data/portfolio';
import {
  buildExperienceKpis,
  getExperienceCategoryRows,
  getExperienceModelRows,
  getPropertySessionMatrix,
} from '@/data/portfolio/experienceMix';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

type TimeHorizon = PeriodId;

const _mtdExpRev = getPortfolioMetrics(undefined, 'mtd').experienceRevenue || 1;

const HORIZON_TABS: { id: TimeHorizon; label: string; factor: number; periodLabel: string }[] = [
  {
    id: 'today',
    label: 'Today',
    factor: getPortfolioMetrics(undefined, 'today').experienceRevenue / _mtdExpRev,
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
    factor: getPortfolioMetrics(undefined, 'ytd').experienceRevenue / _mtdExpRev,
    periodLabel: PERIOD_DEFS.ytd.periodLabel,
  },
  {
    id: 'forward',
    label: 'Forward Business',
    factor: getPortfolioMetrics(undefined, 'forward').experienceRevenue / _mtdExpRev,
    periodLabel: PERIOD_DEFS.forward.periodLabel,
  },
];

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

export interface MasterExperiencePropertyRecord {
  id: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  regionId: RegionId;
  regionName: string;
  location: string;
  rooms: number;
  programsCount: number;
  signatureExperiences: string;
  leadPillar: string;
  mtdSessions: number;
  mtdParticipants: number;
  mtdCapacity: number;
  mtdWaitlist: number;
  participationRate: number; // %
  capacityUtil: number;      // %
  demandFulfillment: number; // %
  qualityScore: number;      // %
  readinessScore: number;    // %
  mtdPaidRev: number;        // USD
  compSharePct: number;      // % of participants in complimentary sessions
  lflGrowth: number;         // % YoY
  status: 'above_plan' | 'on_plan' | 'attention';
}

const EXPERIENCE_STATIC_DESCRIPTORS: {
  id: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  regionId: RegionId;
  regionName: string;
  location: string;
  signatureExperiences: string;
  leadPillar: string;
  status: 'above_plan' | 'on_plan' | 'attention';
}[] = [
  {
    id: 'sosei-andermatt',
    name: 'SOSEI Andermatt',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Andermatt, Switzerland',
    signatureExperiences: 'Gotthard Glacier Heli-Ski · Alpine Breathwork',
    leadPillar: 'Alpine Adventure & Movement',
    status: 'above_plan',
  },
  {
    id: 'sosei-el-gouna',
    name: 'SOSEI El Gouna',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'africa',
    regionName: 'Africa',
    location: 'El Gouna, Egypt',
    signatureExperiences: 'Red Sea Coral Reef Dive · Desert Lagoon Kitesurf',
    leadPillar: 'Marine & Lagoon Discovery',
    status: 'attention',
  },
  {
    id: 'sosei-auh',
    name: 'SOSEI AUH',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'middle-east',
    regionName: 'Middle East',
    location: 'Abu Dhabi, UAE',
    signatureExperiences: 'Saadiyat Private Dhow Cruise · Turtle Conservation Walk',
    leadPillar: 'Water & Marine / Kids Lagoon',
    status: 'above_plan',
  },
  {
    id: 'sosei-melides',
    name: 'SOSEI Melides',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Melides, Portugal',
    signatureExperiences: 'Alentejo Dune Horseback · Atlantic Surf & Paddle',
    leadPillar: 'Coastal Nature & Equestrian',
    status: 'above_plan',
  },
  {
    id: 'sosei-umbria',
    name: 'SOSEI Umbria',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Umbria, Italy',
    signatureExperiences: 'Private White Truffle Foraging · Vineyard Cycling',
    leadPillar: 'Culinary Heritage & Botanical',
    status: 'on_plan',
  },
  {
    id: 'sosei-tinos',
    name: 'SOSEI Tinos',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Tinos, Greece',
    signatureExperiences: 'Cycladic Marble Sculpting · Aegean Catamaran Hopping',
    leadPillar: 'Aegean Sailing & Artisan Craft',
    status: 'above_plan',
  },
  {
    id: 'sosei-barcelona',
    name: 'SOSEI Barcelona',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Barcelona, Spain',
    signatureExperiences: 'Private Architect Sail · Gothic Quarter Art Walk',
    leadPillar: 'Med Sailing & Architecture',
    status: 'above_plan',
  },
  {
    id: 'sosei-osa',
    name: 'SOSEI OSA',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    regionId: 'america',
    regionName: 'America',
    location: 'Osa, Costa Rica',
    signatureExperiences: 'Corcovado Night Wildlife Walk · Golfo Dulce Outrigger',
    leadPillar: 'Nature & Adventure / Family',
    status: 'above_plan',
  },
  {
    id: 'sosei-bali',
    name: 'SOSEI BALI',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Bali, Indonesia',
    signatureExperiences: 'Uluwatu Cliff Sunrise Yoga · Melukat Water Blessing',
    leadPillar: 'Yoga, Mindfulness & Culture',
    status: 'above_plan',
  },
];

function buildExperiencePropertyRecord(
  desc: (typeof EXPERIENCE_STATIC_DESCRIPTORS)[number],
  period: PeriodId
): MasterExperiencePropertyRecord {
  const m = getPropertyMetrics(desc.id, period);
  const e = m.experiences;
  return {
    ...desc,
    rooms: m.rooms,
    programsCount: e.programs,
    mtdSessions: e.sessions,
    mtdParticipants: e.attendances,
    mtdCapacity: e.capacityOffered,
    mtdWaitlist: e.unmetDemand,
    participationRate: Number(e.participationRatePct.toFixed(1)),
    capacityUtil: Number(e.capacityUtilPct.toFixed(1)),
    demandFulfillment: Number(e.demandFulfillmentPct.toFixed(1)),
    qualityScore: Number(e.qualityPct.toFixed(1)),
    readinessScore: Number(e.readinessPct.toFixed(1)),
    mtdPaidRev: m.experienceRevenue,
    compSharePct: Math.round(e.compSharePct),
    lflGrowth: Number(m.vsLy.experienceRevenuePct.toFixed(1)),
  };
}

/**
 * 100% Synchronized Master Experiences Dataset across all 10 SOSEI Resorts (derived from @/data/portfolio)
 */
export const MASTER_EXPERIENCE_PROPERTIES: MasterExperiencePropertyRecord[] =
  EXPERIENCE_STATIC_DESCRIPTORS.map((d) => buildExperiencePropertyRecord(d, 'mtd'));

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
      'latvia', 'estonia', 'montenegro', 'luxembourg', 'malta', 'iceland',
    ].includes(n)
  )
    return 'Europe';
  if (
    [
      'nigeria', 'ethiopia', 'egypt', 'dem. rep. congo', 'tanzania', 'south africa',
      'kenya', 'uganda', 'algeria', 'sudan', 'morocco', 'angola', 'mozambique',
      'ghana', 'madagascar', 'cameroon', "côte d'ivoire", 'niger', 'burkina faso',
      'mali', 'malawi', 'zambia', 'senegal', 'chad', 'somalia', 'zimbabwe', 'guinea',
      'rwanda', 'benin', 'burundi', 'tunisia', 'south sudan', 'togo', 'sierra leone',
      'libya', 'congo', 'liberia', 'central african rep.', 'mauritania', 'eritrea',
      'namibia', 'gambia', 'botswana', 'gabon', 'lesotho', 'guinea-bissau',
      'eq. guinea', 'mauritius', 'eswatini', 'djibouti', 'comoros', 'w. sahara',
    ].includes(n)
  )
    return 'Africa';
  if (
    [
      'china', 'india', 'indonesia', 'pakistan', 'bangladesh', 'japan', 'philippines',
      'vietnam', 'thailand', 'myanmar', 'south korea', 'afghanistan', 'uzbekistan',
      'malaysia', 'nepal', 'north korea', 'taiwan', 'sri lanka', 'kazakhstan',
      'cambodia', 'tajikistan', 'laos', 'kyrgyzstan', 'turkmenistan', 'singapore',
      'mongolia', 'armenia', 'timor-leste', 'bhutan', 'maldives', 'brunei',
      'australia', 'papua new guinea', 'new zealand', 'fiji', 'solomon is.',
      'vanuatu', 'new caledonia',
    ].includes(n)
  )
    return 'Asia Pacific';
  return 'Unknown';
};

const COLOR_PALETTE = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];

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

function PureSvgDonut({
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

/* ───────────────────────── SHARED ANALYTICS HOOK FOR CATEGORIES & REGIONAL ───────────────────────── */

function useExperienceFilteredAnalytics(
  filteredProps: MasterExperiencePropertyRecord[],
  horizon: TimeHorizon,
  mode: 'categories' | 'regional' = 'regional'
) {
  return useMemo(() => {
    const baseProps = filteredProps.length > 0 ? filteredProps : MASTER_EXPERIENCE_PROPERTIES;
    const ids = baseProps.map((p) => p.id);
    const activeProps = baseProps.map((p) => {
      const desc =
        EXPERIENCE_STATIC_DESCRIPTORS.find((d) => d.id === p.id) || EXPERIENCE_STATIC_DESCRIPTORS[0];
      return buildExperiencePropertyRecord(desc, horizon);
    });
    const baseMeta = HORIZON_TABS.find((h) => h.id === horizon) || HORIZON_TABS[1];
    const horizonMeta = { ...baseMeta, factor: 1 };
    const factor = 1;
    const m = getPortfolioMetrics(ids, horizon);
    const e = m.experiences;
    const kpis = buildExperienceKpis(m, horizon);

    const totalPaidRev = m.experienceRevenue;
    const totalParticipants = e.attendances;
    const totalSessions = e.sessions;
    const totalWaitlist = e.unmetDemand;
    const totalPrograms = e.programs;

    const avgParticipation = Number(e.participationRatePct.toFixed(1));
    const avgCapUtil = Number(e.capacityUtilPct.toFixed(1));
    const avgFulfillment = Number(e.demandFulfillmentPct.toFixed(1));
    const avgQuality = Number(e.qualityPct.toFixed(1));
    const avgReadiness = Number(e.readinessPct.toFixed(1));
    const avgCompShare = Math.round(e.compSharePct);
    const avgLflGrowth = Number(m.vsLy.experienceRevenuePct.toFixed(1));

    const regionOrder: { id: RegionId; name: string }[] = [
      { id: 'asia-pacific', name: 'Asia Pacific' },
      { id: 'europe', name: 'Europe' },
      { id: 'america', name: 'America' },
      { id: 'middle-east', name: 'Middle East' },
      { id: 'africa', name: 'Africa' },
    ];

    const geoRows =
      mode === 'regional'
        ? regionOrder
            .filter((reg) => activeProps.some((p) => p.regionId === reg.id))
            .map((reg) => {
              const regProps = activeProps.filter((p) => p.regionId === reg.id);
              const regPart = regProps.reduce((s, p) => s + p.mtdParticipants * factor, 0);
              const regRev = regProps.reduce((s, p) => s + p.mtdPaidRev * factor, 0);
              const regCapture =
                regProps.length > 0
                  ? Number(
                      (regProps.reduce((s, p) => s + p.participationRate, 0) / regProps.length).toFixed(1)
                    )
                  : 0;
              const sharePct =
                totalParticipants > 0 ? Number(((regPart / totalParticipants) * 100).toFixed(1)) : 0;
              return {
                region: reg.name,
                shareNum: sharePct,
                partShare: `${sharePct.toFixed(1)}%`,
                capture: regProps.length > 0 ? `${regCapture}%` : '—',
                revenue: regProps.length > 0 ? fmtMoney(regRev) : '$0',
                isTotal: false,
              };
            })
        : (() => {
            const weights = [36.5, 25.5, 19.0, 11.5, 7.5];
            const revs = splitByShares(
              totalPaidRev,
              weights.map((w, idx) => ({ id: String(idx), name: String(idx), share: w }))
            );
            return [
              { region: 'Asia Pacific', weight: 36.5, capOffset: 1.8 },
              { region: 'Europe', weight: 25.5, capOffset: -1.2 },
              { region: 'America', weight: 19.0, capOffset: 2.4 },
              { region: 'Middle East', weight: 11.5, capOffset: 4.1 },
              { region: 'Africa', weight: 7.5, capOffset: -4.6 },
            ].map((g, idx) => ({
              region: g.region,
              shareNum: g.weight,
              partShare: `${g.weight.toFixed(1)}%`,
              capture: `${Math.min(96, Math.max(35, avgParticipation + g.capOffset)).toFixed(1)}%`,
              revenue: fmtMoney(revs[idx].value),
              isTotal: false,
            }));
          })();

    const geoTable = [
      ...geoRows,
      {
        region: 'Total',
        shareNum: 100,
        partShare: '100%',
        capture: `${avgParticipation}%`,
        revenue: fmtMoney(totalPaidRev),
        isTotal: true,
      },
    ];

    const catRows = getExperienceCategoryRows(m);
    const categoryShares = catRows.map((c) => ({
      name: c.name,
      share: c.sharePct,
      color: c.color,
      util: `${c.utilPct.toFixed(1)}%`,
      attendances: c.attendances,
    }));

    const categoryTable = [
      ...categoryShares.map((c) => ({
        category: c.name,
        share: `${c.share}%`,
        util: c.util,
        attendees: fmtCount(c.attendances),
        isTotal: false,
      })),
      {
        category: 'Total',
        share: '100%',
        util: `${avgCapUtil}%`,
        attendees: fmtCount(totalParticipants),
        isTotal: true,
      },
    ];

    const modelRows = getExperienceModelRows(m);
    const commercialMix = modelRows.map((row, idx) => ({
      name: row.name,
      share: Math.round(row.attendanceSharePct),
      attendances: row.attendances,
      color: COLOR_PALETTE[idx] || COLOR_PALETTE[COLOR_PALETTE.length - 1],
      yield: row.isComplimentary
        ? `${((m.experiences.qualityPct / 100) * 5).toFixed(2)} CSAT`
        : fmtMoney(row.revenue),
    }));

    return {
      horizon,
      propertyIds: ids,
      kpis,
      activeProps,
      horizonMeta,
      totalPaidRev,
      totalParticipants,
      totalSessions,
      totalWaitlist,
      totalPrograms,
      avgParticipation,
      avgCapUtil,
      avgFulfillment,
      avgQuality,
      avgReadiness,
      avgCompShare,
      avgLflGrowth,
      geoTable,
      categoryShares,
      categoryTable,
      commercialMix,
    };
  }, [filteredProps, horizon, mode]);
}

/* ───────────────────────── SHARED BODY FOR CATEGORIES & REGIONAL VIEWS ───────────────────────── */

function ExperienceAnalyticsBody({
  analytics,
  selectionTitle,
  mode,
}: {
  analytics: ReturnType<typeof useExperienceFilteredAnalytics>;
  selectionTitle: string;
  mode: 'categories' | 'regional';
}) {
  const { openDrawer } = useDashboardDrawer();
  const navigate = useNavigate();

  const sortedRegions = [...analytics.geoTable]
    .filter((r) => !r.isTotal && r.shareNum > 0)
    .sort((a, b) => b.shareNum - a.shareNum)
    .map((r) => r.region);

  const regionColors: Record<string, string> = { Unknown: '#e4e4e7' };
  sortedRegions.forEach((reg, idx) => {
    regionColors[reg] = COLOR_PALETTE[idx] || COLOR_PALETTE[COLOR_PALETTE.length - 1];
  });

  return (
    <div className="flex flex-col gap-4">
      {/* ───────────────── 5 CORE PERFORMANCE METRICS ───────────────── */}
      <ExperienceKpiRow
        kpis={analytics.kpis}
        drawerTitleSuffix={selectionTitle}
        period={analytics.horizon}
        propertyIds={analytics.propertyIds}
      />

      {/* ───────────────── ROW 1: 3-COLUMN ANALYTICS (GEO MAP | CATEGORY MIX | PAID VS COMPLIMENTARY MIX) ───────────────── */}
      <div className="-mx-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Widget 1: Geo Footprint & Participation Stats */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'EXPERIENCE_DETAIL',
              title: `Geographic Experience Participation — ${selectionTitle}`,
              data: {
                key: 'EXP_PARTICIPATION_CAPTURE',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="Distribution of experience participants, eligible guest capture rate, and paid experience revenue across SOSEI's 5 global regions.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  {mode === 'regional' ? 'Regional Experience Footprint' : 'Participant Origin Market Stats'}
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
                  <th className="text-left pb-2 pt-1 pr-1 w-[34%] truncate font-medium">Region</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[20%] truncate font-medium">% Share</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[22%] truncate font-medium">Part. Rate</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[24%] truncate font-medium">Paid Rev</th>
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
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.partShare}</td>
                    <td className="text-right py-2 px-1 truncate text-[#14532d] font-medium">{row.capture}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Widget 2: Activity Category Portfolio Mix */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'EXPERIENCE_DETAIL',
              title: `Activity Portfolio Category Mix — ${selectionTitle}`,
              data: {
                key: 'EXP_CATEGORY_MIX',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="Participant share and capacity utilization across Water & Marine, Yoga & Meditation, Nature, Culture, and Kids & Family.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  Activity Category Mix
                </span>
              </InfoTooltip>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>See details</span> <RoundAltArrowRight size={10} />
            </span>
          </div>

          <div className="flex items-center gap-5 px-1 py-1 h-[120px]">
            <PureSvgDonut
              data={analytics.categoryShares.map((c) => ({ name: c.name, value: c.share, color: c.color }))}
              centerValue={fmtCount(analytics.totalParticipants)}
              centerLabel="Attendees"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              {analytics.categoryShares.map((c) => (
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
                  <th className="text-left pb-2 pt-1 pr-1 w-[38%] truncate font-medium">Category</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">% Mix</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[20%] truncate font-medium">Cap Util</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[24%] truncate font-medium">Attendees</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoryTable.map((row) => (
                  <tr
                    key={row.category}
                    className={`text-[10px] border-b border-zinc-100 ${
                      row.isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'
                    }`}
                  >
                    <td className="py-2 pr-1 truncate">{row.category}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.share}</td>
                    <td className="text-right py-2 px-1 truncate text-[#14532d] font-medium">{row.util}</td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.attendees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Widget 3: Paid vs Complimentary Commercial Role Mix */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'EXPERIENCE_DETAIL',
              title: `Paid vs Complimentary Experience Role Mix — ${selectionTitle}`,
              data: {
                key: 'EXP_COMMERCIAL_MIX',
                horizon: analytics.horizon,
                propertyIds: analytics.propertyIds,
              },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <InfoTooltip text="Balancing complimentary stay-enriching participation with paid private bespoke experiences, guided adventures, and partner excursions.">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                  Paid vs Complimentary Mix
                </span>
              </InfoTooltip>
            </div>
            <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 whitespace-nowrap">
              <span>See details</span> <RoundAltArrowRight size={10} />
            </span>
          </div>

          <div className="flex items-center gap-5 px-1 py-1 h-[120px]">
            <PureSvgDonut
              data={analytics.commercialMix.map((d) => ({ name: d.name, value: d.share, color: d.color }))}
              centerValue={fmtMoney(analytics.totalPaidRev)}
              centerLabel="Paid Rev"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              {analytics.commercialMix.map((d) => (
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
                  <th className="text-left pb-2 pt-1 pr-1 w-[44%] truncate font-medium">Commercial Model</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">% Vol</th>
                  <th className="text-right pb-2 pt-1 px-1 w-[18%] truncate font-medium">Attendees</th>
                  <th className="text-right pb-2 pt-1 pl-1 w-[20%] truncate font-medium">Yield / Role</th>
                </tr>
              </thead>
              <tbody>
                {analytics.commercialMix.map((row) => (
                  <tr key={row.name} className="text-[10px] border-b border-zinc-100 text-zinc-700">
                    <td className="py-2 pr-1 truncate">{row.name}</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.share}%</td>
                    <td className="text-right py-2 px-1 truncate text-zinc-800">
                      {fmtCount(row.attendances)}
                    </td>
                    <td className="text-right py-2 pl-1 truncate text-zinc-900 font-semibold">{row.yield}</td>
                  </tr>
                ))}
                <tr className="text-[10px] font-bold text-zinc-900 border-b-0 pt-2">
                  <td className="py-2 pr-1 truncate">Total Portfolio</td>
                  <td className="text-right py-2 px-1">100%</td>
                  <td className="text-right py-2 px-1">{fmtCount(analytics.totalParticipants)}</td>
                  <td className="text-right py-2 pl-1">{fmtMoney(analytics.totalPaidRev)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ───────────────── ROW 2: PROPERTY-BY-PROPERTY EXPERIENCE BENCHMARK TABLE ───────────────── */}
      <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 animate-card-enter">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 mb-3">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              RESORT ACTIVITIES &amp; EXPERIENCES BENCHMARK ({selectionTitle.toUpperCase()})
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
              Property-by-property participation, capacity utilization, demand fulfillment, quality &amp; paid revenue
            </p>
          </div>
          <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 self-start sm:self-auto">
            {analytics.activeProps.length} Active {analytics.activeProps.length === 1 ? 'Resort' : 'Resorts'} · {analytics.totalPrograms} Programs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                <th className="text-left py-2 pr-2 font-medium">Resort Property</th>
                <th className="text-left py-2 px-2 font-medium">Collection &amp; Region</th>
                <th className="text-right py-2 px-2 font-medium">Part. Rate</th>
                <th className="text-right py-2 px-2 font-medium">Cap Util</th>
                <th className="text-right py-2 px-2 font-medium">Fulfillment</th>
                <th className="text-right py-2 px-2 font-medium">Quality</th>
                <th className="text-right py-2 px-2 font-medium">Paid Rev</th>
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
                const propRev = prop.mtdPaidRev * analytics.horizonMeta.factor;
                const isNeg = prop.lflGrowth < 0;

                return (
                  <tr
                    key={prop.id}
                    onClick={() => navigate(`/dashboard/experience/property?id=${prop.id}`)}
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
                    <td className="py-2.5 px-2 text-right font-semibold text-[#14532d]">
                      {prop.participationRate}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-900">
                      {prop.capacityUtil}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-800">
                      {prop.demandFulfillment}%
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-zinc-900">
                      {prop.qualityScore}%
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <div className="font-bold text-zinc-900">{fmtMoney(propRev)}</div>
                      <div className="text-[8px] text-zinc-400">{prop.compSharePct}% Comp</div>
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <span
                        className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded ${
                          isNeg ? 'bg-[#fff1f2] text-[#800020]' : 'bg-[#ecfdf5] text-[#14532d]'
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

      {/* ───────────────── ROW 3: COLLAPSIBLE IN-HOUSE GUESTS DIRECTORY ───────────────── */}
      <CollapsibleExperienceGuests activePropertyIds={analytics.activeProps.map((p) => p.id)} selectionTitle={selectionTitle} />
    </div>
  );
}

function CollapsibleExperienceGuests({
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
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            IN-HOUSE GUESTS EXPERIENCE &amp; ELIGIBILITY DIRECTORY ({selectionTitle.toUpperCase()})
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            Registered in-house VIP guests, suite/villa numbers, party size &amp; activity eligibility profile
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
          {filteredGuests.slice(0, 8).map((guest) => (
            <div
              key={guest.id}
              className="p-3 rounded-[10px] border border-zinc-200/70 bg-zinc-50/40 hover:bg-zinc-100/60 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[10.5px] font-bold text-zinc-900 truncate">{guest.name}</span>
                  <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-700 shrink-0">
                    {guest.partySize} Pax · {guest.vipTier}
                  </span>
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5 truncate">
                  {guest.property} · {guest.room}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 text-[8.5px]">
                <span className="text-[#14532d] font-medium">
                  {guest.partySize > 2 ? 'Family & Kids Eligible' : 'Adult & Bespoke Eligible'}
                </span>
                <span className="text-zinc-400">Waiver Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── 1. /dashboard/experience/categories ───────────────────────── */

export function ExperienceCategoriesView() {
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
    () => MASTER_EXPERIENCE_PROPERTIES.filter((p) => canonicalCategories.includes(p.categoryId)),
    [canonicalCategories]
  );

  const analytics = useExperienceFilteredAnalytics(filteredProps, horizon, 'categories');

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Experiences Dashboard Property Categories
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span>
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Collection Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalPrograms} Programs)
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

          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
            {HORIZON_TABS.map((t) => {
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

      <div className="w-full pb-2 pt-0.5">
        <ResortPickerWidget activeResorts={activeResorts} setActiveResorts={setActiveResorts} />
      </div>

      <ExperienceAnalyticsBody analytics={analytics} selectionTitle={selectionTitle} mode="categories" />

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}

/* ───────────────────────── 2. /dashboard/experience/regional ───────────────────────── */

export function ExperienceRegionalView() {
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
    () => MASTER_EXPERIENCE_PROPERTIES.filter((p) => canonicalRegions.includes(p.regionId)),
    [canonicalRegions]
  );

  const analytics = useExperienceFilteredAnalytics(filteredProps, horizon, 'regional');

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Experiences Dashboard Regional
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span>
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Regional Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalPrograms} Programs)
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

          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
            {HORIZON_TABS.map((t) => {
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

      <div className="w-full pb-2 pt-0.5">
        <RegionalPickerWidget activeRegions={activeRegions} setActiveRegions={setActiveRegions} />
      </div>

      <ExperienceAnalyticsBody analytics={analytics} selectionTitle={selectionTitle} mode="regional" />

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}

/* ───────────────────────── 3. /dashboard/experience/property ───────────────────────── */

export function ExperiencePropertyDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const propMetrics = useMemo(
    () => getPropertyMetrics(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );

  const expRecord = useMemo(() => {
    const desc =
      EXPERIENCE_STATIC_DESCRIPTORS.find((p) => p.id === selectedProperty.id) ||
      EXPERIENCE_STATIC_DESCRIPTORS[0];
    return buildExperiencePropertyRecord(desc, horizon);
  }, [selectedProperty.id, horizon]);

  const baseHorizonMeta = HORIZON_TABS.find((t) => t.id === horizon) || HORIZON_TABS[1];
  const horizonMeta = { ...baseHorizonMeta, factor: 1 };

  const sessionMatrix = useMemo(
    () => getPropertySessionMatrix(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );

  const staffCapacityMatrix = useMemo(() => {
    const sigFirst = expRecord.signatureExperiences.split('·')[0].trim();
    return sessionMatrix.rows.map((r) => {
      if (r.id === 'yoga') {
        return {
          activity: `${r.time} · Morning Movement & Breathwork`,
          category: 'Wellness & Movement',
          commercial: 'Complimentary',
          demand: `${r.demand.toLocaleString()} Booked / ${r.waitlist.toLocaleString()} Waitlist`,
          capacity: `${r.capacity.toLocaleString()} Slots (${r.fillPct}%)`,
          reqStaff: `${r.staffRequired.toLocaleString()} Certified Guides`,
          availStaff: `${r.staffAssigned.toLocaleString()} On Roster`,
          state: 'Ready / Full',
          diagnosis: 'Fully staffed · Venue & audio pre-checked',
          tone: 'pos' as const,
        };
      }
      if (r.id === 'expedition') {
        return {
          activity: `${r.time} · ${sigFirst}`,
          category: expRecord.leadPillar,
          commercial: `Paid ($${Math.round(sessionMatrix.revenuePerPaid * 1.15)}/pax)`,
          demand: `${r.demand.toLocaleString()} Booked / ${r.waitlist.toLocaleString()} Waitlist`,
          capacity: `${r.capacity.toLocaleString()} Slots (${r.fillPct}%)`,
          reqStaff: `${r.staffRequired.toLocaleString()} Certified Specialists`,
          availStaff: `${r.staffAssigned.toLocaleString()} On Roster`,
          state: 'Capacity Constrained',
          diagnosis:
            r.staffAssigned < r.staffRequired
              ? 'Specialist shortage — deploy standby guide to clear waitlist'
              : 'High demand — add afternoon relief departure',
          tone: 'warn' as const,
        };
      }
      if (r.id === 'kids') {
        return {
          activity: `${r.time} · Young Explorers Discovery`,
          category: "Kids' Club & Family",
          commercial: 'Package Included',
          demand: `${r.demand.toLocaleString()} Booked / ${r.waitlist.toLocaleString()} Waitlist`,
          capacity: `${r.capacity.toLocaleString()} Slots (${r.fillPct}%)`,
          reqStaff: `${r.staffRequired.toLocaleString()} Childcare (1:4 Ratio)`,
          availStaff: `${r.staffAssigned.toLocaleString()} Verified (1:${sessionMatrix.kids.effectiveRatio.toFixed(1)})`,
          state: 'Ready / Compliant',
          diagnosis: `Guardian PIN & allergy flags verified (${sessionMatrix.kids.careFlags} care alerts)`,
          tone: 'pos' as const,
        };
      }
      if (r.id === 'private') {
        return {
          activity: `${r.time} · Private Bespoke Charter / Immersion`,
          category: 'Signature & Bespoke',
          commercial: `Private Buyout ($${Math.round(sessionMatrix.revenuePerPaid * 3.8)})`,
          demand: `${r.demand.toLocaleString()} Booked / ${r.waitlist.toLocaleString()} Waitlist`,
          capacity: `${r.capacity.toLocaleString()} Charters (${r.fillPct}%)`,
          reqStaff: `${r.staffRequired.toLocaleString()} Master Guides + Crew`,
          availStaff: `${r.staffAssigned.toLocaleString()} Assigned`,
          state: r.state === 'at_risk' ? 'Operationally At Risk' : 'Capacity Constrained',
          diagnosis:
            r.state === 'at_risk'
              ? 'Guide relief required at 15:30 — cross-utilize senior facilitator'
              : 'Convert waitlisted couples to sunset private slot',
          tone: (r.state === 'at_risk' ? 'neg' : 'warn') as 'neg' | 'warn',
        };
      }
      return {
        activity: `${r.time} · Twilight Sound Healing & Ritual`,
        category: 'Mindfulness & Holistic',
        commercial: 'Complimentary / Tiered',
        demand: `${r.demand.toLocaleString()} Booked / ${r.waitlist.toLocaleString()} Waitlist`,
        capacity: `${r.capacity.toLocaleString()} Slots (${r.fillPct}%)`,
        reqStaff: `${r.staffRequired.toLocaleString()} Sound Practitioner`,
        availStaff: `${r.staffAssigned.toLocaleString()} Assigned`,
        state: 'Low Demand',
        diagnosis: 'Surplus capacity — trigger 15:00 Butler pre-dinner push',
        tone: 'neutral' as const,
      };
    });
  }, [sessionMatrix, expRecord]);
  const kpis = useMemo(
    () => buildExperienceKpis(propMetrics, horizon),
    [propMetrics, horizon]
  );

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      {/* Top Executive Header */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Experiences Dashboard Property View
          </h1>
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
            <span>
              As of: <strong className="font-semibold text-zinc-900">{horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Active Resort: <strong className="font-semibold text-zinc-900">{selectedProperty.name}</strong> ({selectedProperty.location} · {expRecord.programsCount} Programs)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
            {HORIZON_TABS.map((t) => {
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

      {/* Property Selector Dropdown */}
      <div className="flex items-center gap-3 relative shrink-0 pb-1" ref={dropdownRef}>
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
                {expRecord.categoryName}
              </span>
              <AltArrowDown
                size={15}
                className={`text-zinc-400 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <span className="text-zinc-500 text-[9.5px] tracking-wider uppercase font-semibold mt-1">
              {selectedProperty.location} · {expRecord.signatureExperiences}
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
              {filteredDropdownProps.map((prop) => {
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
                        {prop.location} · {pM.experiences.participationRatePct.toFixed(1)}% Part. · {fmtMoney(pM.experienceRevenue)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ExperienceKpiRow
        kpis={kpis}
        drawerTitleSuffix={selectedProperty.name}
        period={horizon}
        propertyIds={[selectedProperty.id]}
      />

      {/* Section 3A: Staff Availability & Capacity Matrix */}
      <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 animate-card-enter">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 mb-3">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              SECTION 3A — DAILY STAFF AVAILABILITY, QUALIFICATION &amp; CAPACITY MATRIX ({selectedProperty.name})
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
              Distinguishing Ready/Full vs Low Demand vs Capacity Constrained vs Operationally At Risk
            </p>
          </div>
          <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
            {expRecord.programsCount} Active Programs · {sessionMatrix.attendances.toLocaleString()} Booked / {sessionMatrix.capacity.toLocaleString()} Cap
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                <th className="text-left py-2 pr-2 font-medium">Scheduled Session &amp; Category</th>
                <th className="text-left py-2 px-2 font-medium">Model</th>
                <th className="text-left py-2 px-2 font-medium">Demand vs Capacity</th>
                <th className="text-left py-2 px-2 font-medium">Required Staffing</th>
                <th className="text-left py-2 px-2 font-medium">Available Qualified Staff</th>
                <th className="text-left py-2 px-2 font-medium">Operational Status</th>
                <th className="text-left py-2 pl-2 font-medium">Management Action / Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {staffCapacityMatrix.map((row) => (
                <tr key={row.activity} className="text-[9.5px] border-b border-zinc-100 text-zinc-700">
                  <td className="py-2.5 pr-2">
                    <div className="font-bold text-zinc-900">{row.activity}</div>
                    <div className="text-[8px] text-zinc-400">{row.category}</div>
                  </td>
                  <td className="py-2.5 px-2 font-medium">{row.commercial}</td>
                  <td className="py-2.5 px-2">
                    <div className="font-bold text-zinc-900">{row.demand}</div>
                    <div className="text-[8px] text-zinc-400">Cap: {row.capacity}</div>
                  </td>
                  <td className="py-2.5 px-2">{row.reqStaff}</td>
                  <td className="py-2.5 px-2 font-medium text-zinc-900">{row.availStaff}</td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded ${
                        row.tone === 'pos'
                          ? 'bg-[#ecfdf5] text-[#14532d]'
                          : row.tone === 'neg' || row.tone === 'warn'
                            ? 'bg-[#fff1f2] text-[#800020]'
                            : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {row.state}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-[9px] text-zinc-600">{row.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4C: Kids' Club Daily Control View + Session Readiness */}
      <div className="-mx-4 grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 lg:col-span-7 flex flex-col">
          <div
            className={CARD_CLASS}
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `Kids' Club — Daily Control View (${selectedProperty.name})`,
                data: {
                  key: 'EXP_KIDS_CLUB_CONTROL',
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
                  SECTION 4C — KIDS&apos; CLUB DAILY CONTROL VIEW ({selectedProperty.name})
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                  Aggregate child safety &amp; supervision controls; individual child PII restricted to authorized staff
                </p>
              </div>
              <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                5 / 5 Controls Verified
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: 'Registered', val: sessionMatrix.kids.registered.toLocaleString(), sub: 'Age Verified' },
                { label: 'Checked In', val: sessionMatrix.kids.checkedIn.toLocaleString(), sub: 'On-Site Active' },
                {
                  label: 'Staff Assigned',
                  val: sessionMatrix.kids.staffAssigned.toLocaleString(),
                  sub: `1:${sessionMatrix.kids.effectiveRatio.toFixed(1)} Ratio`,
                },
                { label: 'Collection Pending', val: sessionMatrix.kids.collectionPending.toLocaleString(), sub: 'PIN Locked' },
              ].map((k) => (
                <div key={k.label} className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">{k.label}</div>
                  <div className="text-[15px] font-bold text-zinc-900 mt-0.5">{k.val}</div>
                  <div className="text-[8px] text-[#14532d] font-medium">{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              {[
                '1. Registration & Age Eligibility (0–3, 4–7, 8–12) Confirmed',
                '2. Authorized Guardian Drop-Off & Collection PIN Recorded',
                '3. Staff-to-Child Supervision Ratios & First-Aid Verified',
                '4. Transition & Session-Close Attendance Reconciled',
                '5. Restricted-Access Allergy & Care Protocol Active',
              ].map((pt) => (
                <div key={pt} className="p-2 rounded-lg bg-zinc-50/70 border border-zinc-100 flex items-center justify-between">
                  <span className="text-[9.5px] font-medium text-zinc-800">{pt}</span>
                  <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#14532d]">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div
            className={CARD_CLASS}
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `Equipment, Safety & Tomorrow Handover (${selectedProperty.name})`,
                data: {
                  key: 'EXP_READINESS_SAFETY',
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
                  EQUIPMENT, GO/NO-GO &amp; TOMORROW HANDOVER
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                  Physical asset checklist, weather/sea status &amp; next-day shift prep
                </p>
              </div>
              <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
                Go/No-Go: Clear
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              {[
                {
                  title: 'Equipment & Venue Inspection',
                  desc: `${sessionMatrix.readinessPct.toFixed(1)}% equipment ready; O2 kit, VHF radio, mats, and marine gear pre-checked.`,
                  badge: `${sessionMatrix.readinessPct.toFixed(1)}% Ready`,
                },
                {
                  title: 'Weather & Sea-State Authority',
                  desc: 'Outdoor & marine sessions cleared; indoor cultural studio pre-staged as backup.',
                  badge: 'All Clear',
                },
                {
                  title: 'Tomorrow Arrival & Commercial Handover',
                  desc: `${sessionMatrix.familiesArriving} arriving families pre-booked; ${sessionMatrix.waitlistedCouples} waitlisted couples flagged for private charter upgrade.`,
                  badge: `+${fmtMoney(sessionMatrix.upsellOpportunity)} Opp`,
                },
              ].map((item) => (
                <div key={item.title} className="p-2.5 rounded-lg bg-zinc-50/70 border border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold text-zinc-900">{item.title}</span>
                    <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#14532d]">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[8.5px] text-zinc-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible In-House Guests for Selected Property */}
      <CollapsibleExperienceGuests activePropertyIds={[selectedProperty.id]} selectionTitle={selectedProperty.name} />

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
