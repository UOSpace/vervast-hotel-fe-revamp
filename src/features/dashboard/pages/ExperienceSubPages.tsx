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
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import {
  getPortfolioMetrics,
  getPropertyMetrics,
  splitByShares,
  PERIOD_DEFS,
  PERIOD_ORDER,
  fmtInt,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import {
  buildExperienceKpis,
  getExperienceCategoryRows,
  getExperienceForwardWindow,
  getExperienceHeadlineKpis,
  getExperienceModelRows,
  getExperiencePeakLoadWindows,
  getUncapturedRevenue,
  PROPERTY_EXPERIENCE_DESCRIPTORS,
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
    id: 'sosei-courchevel',
    name: 'SOSEI Courchevel',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Courchevel, France',
    signatureExperiences: 'Trois Vallées Heli-Ski · Alpine Breathwork',
    leadPillar: 'Alpine Adventure & Movement',
    status: 'above_plan',
  },
  {
    id: 'sosei-niseko',
    name: 'SOSEI Niseko',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Niseko, Japan',
    signatureExperiences: 'Hokkaido Backcountry Cat-Ski · Onsen Sound Bath',
    leadPillar: 'Backcountry Powder & Thermal Recovery',
    status: 'above_plan',
  },
  {
    id: 'sosei-aspen',
    name: 'SOSEI Aspen',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'america',
    regionName: 'America',
    location: 'Aspen, United States',
    signatureExperiences: 'Elk Mountains Snowcat Summit · High-Altitude Pilates',
    leadPillar: 'Mountain Performance & Wellness',
    status: 'on_plan',
  },
  {
    id: 'sosei-amalfi',
    name: 'SOSEI Amalfi',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Amalfi, Italy',
    signatureExperiences: 'Capri Private Riva Yacht · Lemon Grove Botanical Walk',
    leadPillar: 'Mediterranean Yachting & Heritage',
    status: 'on_plan',
  },
  {
    id: 'sosei-los-cabos',
    name: 'SOSEI Los Cabos',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'america',
    regionName: 'America',
    location: 'Los Cabos, Mexico',
    signatureExperiences: 'Sea of Cortez Whale Yacht · Baja Dune Horseback',
    leadPillar: 'Coastal Nature & Marine Charter',
    status: 'above_plan',
  },
  {
    id: 'sosei-muscat',
    name: 'SOSEI Muscat',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'middle-east',
    regionName: 'Middle East',
    location: 'Muscat, Oman',
    signatureExperiences: 'Daymaniyat Coral Reef Dive · Sunset Dhow Sailing',
    leadPillar: 'Arabian Sea Sailing & Marine',
    status: 'above_plan',
  },
  {
    id: 'sosei-sumba',
    name: 'SOSEI Sumba',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Sumba, Indonesia',
    signatureExperiences: 'Nihiwatu Reef Surf Safari · Sumbanese Stallion Ride',
    leadPillar: 'Ocean Surf & Equestrian Heritage',
    status: 'above_plan',
  },
  {
    id: 'sosei-seychelles',
    name: 'SOSEI Seychelles',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'africa',
    regionName: 'Africa',
    location: 'Mahé, Seychelles',
    signatureExperiences: 'Outer Island Catamaran Hopping · Giant Tortoise Sanctuary',
    leadPillar: 'Indian Ocean Marine & Conservation',
    status: 'above_plan',
  },
  {
    id: 'sosei-geneva',
    name: 'SOSEI Geneva',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Geneva, Switzerland',
    signatureExperiences: 'Private Horology Atelier Tour · Lake Léman Classic Riva',
    leadPillar: 'Haute Horlogerie & Lake Sailing',
    status: 'above_plan',
  },
  {
    id: 'sosei-marrakech',
    name: 'SOSEI Marrakech',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    regionId: 'africa',
    regionName: 'Africa',
    location: 'Marrakech, Morocco',
    signatureExperiences: 'Agafay Desert Astronomy Camp · Medina Artisan Curation',
    leadPillar: 'Cultural Craft & Desert Discovery',
    status: 'attention',
  },
  {
    id: 'sosei-patagonia',
    name: 'SOSEI Patagonia',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    regionId: 'america',
    regionName: 'America',
    location: 'Torres del Paine, Chile',
    signatureExperiences: 'Grey Glacier Ice Trek · Puma Tracking & Gaucho Ride',
    leadPillar: 'Wilderness Expedition & Conservation',
    status: 'above_plan',
  },
  {
    id: 'sosei-serengeti',
    name: 'SOSEI Serengeti',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    regionId: 'africa',
    regionName: 'Africa',
    location: 'Serengeti, Tanzania',
    signatureExperiences: 'Dawn Hot-Air Balloon Safari · Great Migration Bush Walk',
    leadPillar: 'Wildlife Safari & Conservation',
    status: 'above_plan',
  },
  {
    id: 'sosei-kyoto',
    name: 'SOSEI Kyoto',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Kyoto, Japan',
    signatureExperiences: 'Arashiyama Zen Temple Meditation · Private Chado Ceremony',
    leadPillar: 'Mindfulness, Tea & Forest Bathing',
    status: 'above_plan',
  },
  {
    id: 'sosei-alula',
    name: 'SOSEI AlUla',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    regionId: 'middle-east',
    regionName: 'Middle East',
    location: 'AlUla, Saudi Arabia',
    signatureExperiences: 'Hegra Nabataean Stargazing · Canyon Sound Healing',
    leadPillar: 'Desert Longevity & Astronomy',
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
 * 100% Synchronized Master Experiences Dataset across all 14 SOSEI Resorts (derived from @/data/portfolio)
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
      <div className="w-full flex flex-col gap-3 animate-fade-in">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Experiences Dashboard Property Categories
            </h1>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Collection Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalPrograms} Programs)
            </span>
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
      <div className="w-full flex flex-col gap-3 animate-fade-in">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Experiences Dashboard Regional
            </h1>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Regional Filter: <strong className="font-semibold text-zinc-900">{selectionTitle}</strong> ({analytics.activeProps.length} Resorts · {analytics.totalPrograms} Programs)
            </span>
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

interface PropertyScheduleTemplate {
  time: string;
  title: string;
  pillar: string;
  format: 'Private Charter' | 'Paid Guided' | 'Complimentary';
  isPeakSlot: boolean;
  revShare: number;
  attShare: number;
  loadBoost: number;
  price: number;
}

const CATEGORY_SCHEDULE_TEMPLATES: Record<HotelCategoryId, PropertyScheduleTemplate[]> = {
  ski: [
    { time: '07:30 – 08:30', title: 'Alpine Breathwork & Ski Mobility', pillar: 'Après-Ski & Recovery', format: 'Complimentary', isPeakSlot: false, revShare: 0, attShare: 16, loadBoost: -4, price: 0 },
    { time: '08:45 – 12:30', title: 'First-Tracks Private UIAGM Ski Guiding', pillar: 'Private Ski Guiding', format: 'Paid Guided', isPeakSlot: true, revShare: 32, attShare: 28, loadBoost: 11.4, price: 680 },
    { time: '09:30 – 13:30', title: 'Glacier Heli-Ski & Backcountry Cat-Ski', pillar: 'Heli-Ski & Cat-Ski', format: 'Private Charter', isPeakSlot: true, revShare: 44, attShare: 18, loadBoost: 12.8, price: 1450 },
    { time: '14:00 – 16:30', title: 'Glacier Ice Walk & Snowmobile Trek', pillar: 'Glacier & Snow Adventure', format: 'Paid Guided', isPeakSlot: false, revShare: 16, attShare: 22, loadBoost: 3.5, price: 420 },
    { time: '17:00 – 19:00', title: 'Thermal Onsen & Cryo Recovery Session', pillar: 'Après-Ski & Recovery', format: 'Paid Guided', isPeakSlot: true, revShare: 8, attShare: 16, loadBoost: 8.2, price: 260 },
  ],
  'beach-resort': [
    { time: '07:00 – 08:15', title: 'Oceanfront Sunrise Cliff Yoga', pillar: 'Sunrise Cliff Yoga', format: 'Complimentary', isPeakSlot: false, revShare: 0, attShare: 16, loadBoost: -3, price: 0 },
    { time: '08:30 – 12:00', title: 'Two-Tank Reef Scuba Dive & Snorkel Sail', pillar: 'Diving & Reef Snorkeling', format: 'Paid Guided', isPeakSlot: true, revShare: 28, attShare: 28, loadBoost: 10.6, price: 480 },
    { time: '10:00 – 14:30', title: 'Outer Reef Surf Safari & Sea Kayak', pillar: 'Surf & Ocean Sports', format: 'Paid Guided', isPeakSlot: false, revShare: 18, attShare: 22, loadBoost: 4.2, price: 390 },
    { time: '15:30 – 18:30', title: 'Private Riva Yacht / Sunset Dhow Charter', pillar: 'Private Yacht Charter', format: 'Private Charter', isPeakSlot: true, revShare: 42, attShare: 18, loadBoost: 12.5, price: 1350 },
    { time: '16:30 – 18:30', title: 'Sunset Beach Horseback & Coastal Walk', pillar: 'Coastal Expeditions', format: 'Paid Guided', isPeakSlot: true, revShare: 12, attShare: 16, loadBoost: 9.1, price: 340 },
  ],
  nature: [
    { time: '06:00 – 09:30', title: 'Dawn Hot-Air Balloon & Big-Five Drive', pillar: 'Aerial & Wildlife Safari', format: 'Private Charter', isPeakSlot: true, revShare: 44, attShare: 24, loadBoost: 12.6, price: 1150 },
    { time: '07:00 – 11:30', title: 'Puma Tracking & Wilderness Ridge Trek', pillar: 'Wilderness Trekking', format: 'Paid Guided', isPeakSlot: true, revShare: 28, attShare: 28, loadBoost: 10.4, price: 620 },
    { time: '13:30 – 16:30', title: 'Glacier Fjord Kayak & Conservation Lab', pillar: 'Glacier & Conservation', format: 'Paid Guided', isPeakSlot: false, revShare: 16, attShare: 20, loadBoost: 3.2, price: 440 },
    { time: '16:30 – 18:30', title: 'Kopje Sundowner & Bush Walk', pillar: 'Wildlife Safari', format: 'Complimentary', isPeakSlot: true, revShare: 0, attShare: 16, loadBoost: 8.5, price: 0 },
    { time: '20:00 – 21:30', title: 'Southern Cross Stargazing & Telemetry', pillar: 'Night Astronomy', format: 'Paid Guided', isPeakSlot: false, revShare: 12, attShare: 12, loadBoost: 2.1, price: 310 },
  ],
  urban: [
    { time: '07:30 – 08:30', title: 'Rooftop Mobility & Courtyard Meditation', pillar: 'Rooftop Mindful Studio', format: 'Complimentary', isPeakSlot: false, revShare: 0, attShare: 16, loadBoost: -4, price: 0 },
    { time: '09:30 – 12:30', title: 'Private Historian Heritage & Palace Walk', pillar: 'Heritage & Art Walks', format: 'Paid Guided', isPeakSlot: true, revShare: 20, attShare: 26, loadBoost: 8.8, price: 420 },
    { time: '13:30 – 16:30', title: 'Closed-Door Haute Horlogerie Atelier Tour', pillar: 'Private Atelier Tours', format: 'Private Charter', isPeakSlot: true, revShare: 42, attShare: 20, loadBoost: 11.8, price: 1120 },
    { time: '15:00 – 17:30', title: 'Chocolatier & Perfumery Masterclass', pillar: 'Artisan Masterclasses', format: 'Paid Guided', isPeakSlot: false, revShare: 14, attShare: 22, loadBoost: 3.4, price: 360 },
    { time: '17:00 – 19:30', title: 'Lake Riva Sunset Cruise / Atlas Heli-Flight', pillar: 'Lake & Aviation Charter', format: 'Private Charter', isPeakSlot: true, revShare: 24, attShare: 16, loadBoost: 10.2, price: 980 },
  ],
  wellness: [
    { time: '06:30 – 08:30', title: 'Dawn Zen Temple Meditation & Bamboo Walk', pillar: 'Zen & Nature Walk', format: 'Complimentary', isPeakSlot: true, revShare: 0, attShare: 24, loadBoost: 9.4, price: 0 },
    { time: '09:30 – 12:00', title: 'Private Uji Tea Master & Sanctuary Ritual', pillar: 'Tea & Heritage Rituals', format: 'Private Charter', isPeakSlot: true, revShare: 38, attShare: 20, loadBoost: 11.2, price: 680 },
    { time: '14:00 – 16:30', title: 'Kintsugi, Ikebana & Botanical Alchemy Lab', pillar: 'Botanical & Artisan', format: 'Paid Guided', isPeakSlot: false, revShare: 22, attShare: 20, loadBoost: 3.8, price: 380 },
    { time: '17:00 – 18:30', title: 'Twilight Canyon Acoustic Sound Bath', pillar: 'Zen & Sound Healing', format: 'Paid Guided', isPeakSlot: true, revShare: 16, attShare: 20, loadBoost: 8.9, price: 320 },
    { time: '19:30 – 21:30', title: 'Private Astronomer Stargazing Deck', pillar: 'Astronomy & Night Walk', format: 'Private Charter', isPeakSlot: true, revShare: 24, attShare: 16, loadBoost: 10.5, price: 740 },
  ],
};

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
  const [forwardWindow, setForwardWindow] = useState<7 | 30 | 90>(30);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'peak' | 'private'>('all');
  const [programFilter, setProgramFilter] = useState<'all' | 'private' | 'guided'>('all');
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

  const propIds = useMemo(() => [selectedProperty.id], [selectedProperty.id]);
  const propMetrics = useMemo(
    () => getPropertyMetrics(selectedProperty.id, horizon),
    [selectedProperty.id, horizon]
  );
  const propDesc = useMemo(
    () =>
      PROPERTY_EXPERIENCE_DESCRIPTORS[selectedProperty.id] ?? {
        signatureFocus: 'Signature Guided Experiences',
        peakSlotLabel: '09:00 Morning Peak',
      },
    [selectedProperty.id]
  );

  // 5 Headline Summary Statistics (shared KPI summary structure)
  const activeHeadlineKpis = useMemo(
    () => getExperienceHeadlineKpis(propIds, horizon),
    [propIds, horizon]
  );

  // Property Peak Load Windows (exclusive to Property View)
  const peakWindows = useMemo(() => getExperiencePeakLoadWindows(propMetrics), [propMetrics]);

  // Property Daily Schedule & Peak Load Roster (tailored to selectedProperty.categoryId)
  const scheduleRows = useMemo(() => {
    const templates =
      CATEGORY_SCHEDULE_TEMPLATES[selectedProperty.categoryId] ?? CATEGORY_SCHEDULE_TEMPLATES['beach-resort'];
    const revSplits = splitByShares(
      propMetrics.experienceRevenue,
      templates.map((t, idx) => ({ id: String(idx), name: t.title, share: Math.max(1, t.revShare) }))
    );
    const attSplits = splitByShares(
      propMetrics.experiences.attendances,
      templates.map((t, idx) => ({ id: String(idx), name: t.title, share: t.attShare }))
    );

    return templates.map((t, idx) => {
      const revenue = t.format === 'Complimentary' ? 0 : revSplits[idx].value;
      const booked = attSplits[idx].value;
      const peakLoadPct = Math.min(99, Math.max(68, propMetrics.experiences.capacityUtilPct + t.loadBoost));
      const capacity = Math.max(booked, Math.round(booked / (peakLoadPct / 100)));
      const statusLabel =
        peakLoadPct >= 92 ? 'Peak Full' : peakLoadPct >= 84 ? 'High Load' : 'Open Slots';
      return {
        id: `${selectedProperty.id}-sched-${idx}`,
        time: t.time,
        title: t.title,
        pillar: t.pillar,
        format: t.format,
        isPeakSlot: t.isPeakSlot,
        booked,
        capacity,
        peakLoadPct,
        revenue,
        price: t.price,
        statusLabel,
      };
    });
  }, [selectedProperty.id, selectedProperty.categoryId, propMetrics]);

  const filteredScheduleRows = useMemo(() => {
    if (scheduleFilter === 'peak') return scheduleRows.filter((r) => r.isPeakSlot);
    if (scheduleFilter === 'private') return scheduleRows.filter((r) => r.format !== 'Complimentary');
    return scheduleRows;
  }, [scheduleRows, scheduleFilter]);

  // Forward Scheduling & Demand Outlook (7D / 30D / 90D)
  const forwardOutlook = useMemo(() => {
    const fw = getExperienceForwardWindow(propIds, forwardWindow);
    const bucketDefs =
      forwardWindow === 7
        ? [
            { label: 'D1–D2', days: 2, share: 32, otbBoost: 6 },
            { label: 'D3–D5', days: 3, share: 42, otbBoost: 1 },
            { label: 'D6–D7', days: 2, share: 26, otbBoost: -4 },
          ]
        : forwardWindow === 30
          ? [
              { label: 'Wk 1–2', days: 14, share: 48, otbBoost: 8 },
              { label: 'Wk 3', days: 7, share: 26, otbBoost: 0 },
              { label: 'Wk 4+', days: 9, share: 26, otbBoost: -6 },
            ]
          : [
              { label: 'D1–D30', days: 30, share: 42, otbBoost: 9 },
              { label: 'D31–D60', days: 30, share: 33, otbBoost: 0 },
              { label: 'D61–D90', days: 30, share: 25, otbBoost: -7 },
            ];

    const otbSplits = splitByShares(
      fw.otbAttendances,
      bucketDefs.map((b) => ({ id: b.label, name: b.label, share: b.share }))
    );
    const expSplits = splitByShares(
      fw.expectedAttendances,
      bucketDefs.map((b) => ({ id: b.label, name: b.label, share: b.share }))
    );
    const capSplits = splitByShares(
      fw.forecastCapacity,
      bucketDefs.map((b) => ({ id: b.label, name: b.label, share: b.share }))
    );

    const buckets = bucketDefs.map((b, i) => {
      const otb = otbSplits[i].value;
      const expected = expSplits[i].value;
      const cap = Math.max(1, capSplits[i].value);
      const otbPct = Math.min(100, (otb / cap) * 100);
      const loadPct = Math.min(99, Math.max(otbPct, (expected / cap) * 100));
      return {
        label: b.label,
        days: b.days,
        otbAttendances: otb,
        expectedAttendances: expected,
        otbPct,
        walkInPct: Math.max(0, loadPct - otbPct),
        loadPct,
      };
    });

    return {
      ...fw,
      waitlist: propMetrics.experiences.unmetDemand,
      uncapturedRev: getUncapturedRevenue(propMetrics),
      buckets,
    };
  }, [propIds, forwardWindow, propMetrics]);

  // Property Operational Signals (Revenue, Peak Load & Scheduling Focus)
  const propertySignals = useMemo(() => {
    const suffix = horizon === 'today' ? 'Yesterday' : horizon.toUpperCase();
    const uncaptured = getUncapturedRevenue(propMetrics);
    const s1Rev = Math.round(uncaptured * 0.42);
    const s2Rev = Math.round(uncaptured * 0.31);
    const s3Rev = Math.round(uncaptured * 0.27);
    const topSlot = scheduleRows.find((r) => r.isPeakSlot && r.format === 'Private Charter') ?? scheduleRows[1];
    const secondSlot = scheduleRows.find((r) => r.isPeakSlot && r !== topSlot) ?? scheduleRows[2];

    return {
      pipelineValue: s1Rev + s2Rev + s3Rev,
      signals: [
        {
          id: 'psig-1',
          type: 'risk' as const,
          title: `Peak Slot At ${fmtPct(topSlot.peakLoadPct, 0)} Load — ${topSlot.title}`,
          sub: `${topSlot.time} window · ${fmtInt(propMetrics.experiences.unmetDemand)} guests waitlisted for peak departure`,
          exposure: `${fmtUsd(s1Rev)} ${suffix}`,
        },
        {
          id: 'psig-2',
          type: 'opportunity' as const,
          title: `Add Relief Departure — ${secondSlot.title}`,
          sub: `Staggering second guide/charter slot at ${secondSlot.time.split('–')[0].trim()} captures overflow demand`,
          exposure: `+${fmtUsd(s2Rev)} ${suffix}`,
        },
        {
          id: 'psig-3',
          type: 'opportunity' as const,
          title: `Pre-Arrival Concierge Itinerary Conversion (${fmtPct(propMetrics.experiences.participationRatePct, 0)})`,
          sub: `Bundling ${propDesc.signatureFocus.split('&')[0].trim()} at 14-day pre-arrival touchpoint`,
          exposure: `+${fmtUsd(s3Rev)} ${suffix}`,
        },
        {
          id: 'psig-4',
          type: (propMetrics.experiences.readinessPct < 95 ? 'risk' : 'opportunity') as 'risk' | 'opportunity',
          title: `Guide & Charter Schedule Readiness (${fmtPct(propMetrics.experiences.readinessPct, 1)})`,
          sub: `${fmtInt(propMetrics.experiences.sessions)} scheduled sessions · Certified specialists & equipment verified`,
          exposure: propMetrics.experiences.readinessPct < 95 ? 'Watchlist' : '100% Ready',
        },
      ],
    };
  }, [horizon, propMetrics, scheduleRows, propDesc]);

  // Property Signature Activities & Pricing Table
  const propertyPrograms = useMemo(() => {
    const base = scheduleRows.map((r, i) => ({
      id: `prog-${i}`,
      name: r.title,
      window: r.time,
      pillar: r.pillar,
      format: r.format,
      price: r.price,
      attendances: r.booked,
      peakLoadPct: r.peakLoadPct,
      revenue: r.revenue,
    }));
    if (programFilter === 'private') return base.filter((p) => p.format === 'Private Charter');
    if (programFilter === 'guided') return base.filter((p) => p.format !== 'Private Charter');
    return base;
  }, [scheduleRows, programFilter]);

  // Property Scheduled Private Charters & VIP Group Bookings
  const propertyCharters = useMemo(() => {
    const privateRows = scheduleRows.filter((r) => r.format !== 'Complimentary');
    const scalePax = horizon === 'today' ? 0.3 : horizon === 'ytd' ? 6 : 1;
    const totalPoolRev = Math.round(propMetrics.experienceRevenue * 0.42);
    const shares = [34, 26, 22, 18];
    const revSplits = splitByShares(
      totalPoolRev,
      shares.map((s, idx) => ({ id: String(idx), name: String(idx), share: s }))
    );

    const dateWindows = ['Oct 23 · 09:00', 'Oct 25 · 16:00', 'Oct 28 · 09:30', 'Nov 1 · 15:30'];
    const statuses = ['Peak Slot Locked', 'Guide Assigned', 'Charter Confirmed', 'Waitlist Priority'] as const;

    const list = shares.map((_, idx) => {
      const src = privateRows[idx % privateRows.length] ?? scheduleRows[0];
      const pax = Math.max(2, Math.round((6 + idx * 2) * scalePax));
      return {
        id: `${selectedProperty.id}-chr-${idx}`,
        title: src.title,
        pillar: src.pillar,
        dateWindow: dateWindows[idx],
        pax,
        revenue: revSplits[idx].value,
        status: statuses[idx],
      };
    });

    return {
      list,
      totalRev: list.reduce((a, c) => a + c.revenue, 0),
      totalPax: list.reduce((a, c) => a + c.pax, 0),
    };
  }, [scheduleRows, horizon, propMetrics.experienceRevenue, selectedProperty.id]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 bg-white text-[10px]">
      {/* ───────────────────────── TOP EXECUTIVE HEADER ───────────────────────── */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Experiences Dashboard Property View
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
              Active Resort: <strong className="font-semibold text-zinc-900">{selectedProperty.name}</strong> ({selectedProperty.location} · {propMetrics.rooms} Keys · {propMetrics.experiences.programs} Active Programs)
            </span>
          </div>

          {/* Right Controls: Time Horizon (Yesterday | MTD | YTD) + Export */}
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
                {selectedProperty.categoryName}
              </span>
              <AltArrowDown
                size={15}
                className={`text-zinc-400 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
            <span className="text-zinc-500 text-[9.5px] tracking-wider uppercase font-semibold mt-1">
              {selectedProperty.location} · {propDesc.signatureFocus}
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
                        {prop.location} · {fmtUsd(pM.experienceRevenue)} Exp. Rev.
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
              })}
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

      {/* ───────────────────────── MAIN CONTENT GRID ───────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* 5 HEADLINE SUMMARY STATISTICS (Shared KPI Structure) */}
        <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {activeHeadlineKpis.map((kpi) => (
            <div
              key={kpi.id}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: `${selectedProperty.name} — ${kpi.label}`,
                  data: {
                    key: 'EXP_HEADLINE_KPI',
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

        {/* ROW 1 (4-4-4 — EXCLUSIVE PROPERTY LEVEL): Peak Load by Time Window | Daily Session Schedule Roster | Peak Load & Scheduling Signals */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 1. PEAK LOAD & REVENUE BY TIME WINDOW */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Peak Load & Revenue by Time Window`,
                data: {
                  key: 'EXP_UNMET_DEMAND',
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
                  PEAK LOAD &amp; REVENUE BY TIME WINDOW
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Operating schedule windows, revenue yield, peak load &amp; avg. spend
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-5">Schedule Window</span>
                <span className="col-span-2 text-right">Exp. Rev.</span>
                <span className="col-span-2 text-right">Pax</span>
                <span className="col-span-1 text-right">Load</span>
                <span className="col-span-2 text-right">Avg. Spend</span>
              </div>

              {peakWindows.map((w) => (
                <div key={w.id} className="flex flex-col gap-1">
                  <div className="grid grid-cols-12 items-center tabular-nums">
                    <div className="col-span-5 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-800 truncate block">
                        {w.windowLabel}
                      </span>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(w.revenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtInt(w.attendances)}
                    </span>
                    <span className="col-span-1 text-[9.5px] font-medium text-[#14532d] text-right">
                      {fmtPct(w.peakLoadPct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(w.avgSpend)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${Math.min(100, w.peakLoadPct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. DAILY SESSION SCHEDULE & PEAK LOAD ROSTER */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Daily Session Schedule & Peak Load Roster`,
                data: {
                  key: 'EXP_READINESS_SAFETY',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  DAILY SESSION SCHEDULE &amp; ROSTER
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Scheduled time slots, booked vs capacity &amp; peak load %
                </p>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-zinc-100 p-0.5 rounded-lg shrink-0"
              >
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'peak', label: 'Peak' },
                    { id: 'private', label: 'Paid' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setScheduleFilter(tab.id)}
                    className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                      scheduleFilter === tab.id
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-6">Time Slot &amp; Activity</span>
                <span className="col-span-2 text-right">Booked</span>
                <span className="col-span-2 text-right">Load</span>
                <span className="col-span-2 text-right">Exp. Rev.</span>
              </div>

              {filteredScheduleRows.slice(0, 5).map((row) => {
                const isPeakFull = row.peakLoadPct >= 90;
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 items-center py-1 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors tabular-nums"
                  >
                    <div className="col-span-6 min-w-0 pr-1">
                      <div className="text-[10px] font-medium text-zinc-800 truncate">{row.title}</div>
                      <div className="text-[8px] text-zinc-400 truncate">
                        {row.time} · {row.format}
                      </div>
                    </div>
                    <span className="col-span-2 text-[9.5px] text-zinc-700 text-right">
                      {fmtInt(row.booked)}/{fmtInt(row.capacity)}
                    </span>
                    <span
                      className={`col-span-2 text-[9.5px] font-medium text-right ${
                        isPeakFull ? 'text-[#800020]' : 'text-[#14532d]'
                      }`}
                    >
                      {fmtPct(row.peakLoadPct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {row.revenue > 0 ? fmtUsd(row.revenue) : 'Comp'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PEAK LOAD & SCHEDULING SIGNALS */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Peak Load & Scheduling Signals`,
                data: {
                  key: 'EXP_UNMET_DEMAND',
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
                  PEAK LOAD &amp; SCHEDULING SIGNALS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Schedule bottlenecks &amp; +{fmtUsd(propertySignals.pipelineValue)} revenue opportunity
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

        {/* ROW 2 (4-4-4 — EXCLUSIVE PROPERTY LEVEL): Property Signature Activities & Pricing | Forward Scheduling & Demand Outlook | Scheduled Private Charters & Buyouts */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 4. PROPERTY SIGNATURE ACTIVITIES & PRICING */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Signature Activities & Commercial Mix`,
                data: {
                  key: 'EXP_COMMERCIAL_MIX',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  PROPERTY SIGNATURE ACTIVITIES &amp; PRICING
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Destination-specific activities at {selectedProperty.name}
                </p>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-zinc-100 p-0.5 rounded-lg shrink-0"
              >
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'private', label: 'Private' },
                    { id: 'guided', label: 'Guided' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProgramFilter(tab.id)}
                    className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                      programFilter === tab.id
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-6">Activity &amp; Pillar</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Load</span>
                <span className="col-span-2 text-right">Exp. Rev.</span>
              </div>

              {propertyPrograms.slice(0, 5).map((prog) => (
                <div
                  key={prog.id}
                  className="grid grid-cols-12 items-center py-1 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                >
                  <div className="col-span-6 min-w-0 pr-1">
                    <div className="text-[10px] font-medium text-zinc-800 truncate">{prog.name}</div>
                    <div className="text-[8px] text-zinc-400 truncate">
                      {prog.pillar} · {fmtInt(prog.attendances)} pax
                    </div>
                  </div>
                  <span className="col-span-2 text-[9.5px] text-zinc-600 text-right">
                    {prog.price > 0 ? fmtUsdFull(prog.price) : 'Comp'}
                  </span>
                  <span className="col-span-2 text-[9.5px] font-medium text-[#14532d] text-right">
                    {fmtPct(prog.peakLoadPct, 0)}
                  </span>
                  <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                    {prog.revenue > 0 ? fmtUsd(prog.revenue) : 'Included'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. FORWARD SCHEDULING & DEMAND OUTLOOK (7D / 30D / 90D) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Forward Scheduling & Demand Outlook (${forwardWindow}D)`,
                data: {
                  key: 'EXP_FORWARD_STAY',
                  horizon,
                  propertyId: selectedProperty.id,
                  propertyIds: propIds,
                },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  FORWARD SCHEDULING &amp; OUTLOOK
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Pre-booked itineraries OTB &amp; schedule capacity load
                </p>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-zinc-100 p-0.5 rounded-lg shrink-0"
              >
                {([7, 30, 90] as const).map((w) => (
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
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-zinc-100 tabular-nums">
                <div>
                  <div className="text-[8.5px] text-zinc-400">Pre-Booked OTB</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtInt(forwardOutlook.otbAttendances)} Pax
                  </div>
                  <div className="text-[8px] text-[#14532d] font-medium">
                    {fmtPct(forwardOutlook.preBookedPct, 0)} Reserved
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">OTB Exp. Rev.</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtUsd(forwardOutlook.otbRevenue)}
                  </div>
                  <div className="text-[8px] text-zinc-400">
                    {fmtPct(forwardOutlook.capacityCommittedPct, 0)} Committed
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Peak Waitlist</div>
                  <div className="text-xs font-bold text-[#800020]">
                    {fmtInt(forwardOutlook.waitlist)} Guests
                  </div>
                  <div className="text-[8px] text-[#14532d] font-medium">
                    +{fmtUsd(forwardOutlook.uncapturedRev)} Opp.
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-1.5">
                <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                  <span className="col-span-4">Horizon</span>
                  <span className="col-span-4">Schedule Load</span>
                  <span className="col-span-2 text-right">OTB Pax</span>
                  <span className="col-span-2 text-right">Load</span>
                </div>

                {forwardOutlook.buckets.map((b) => (
                  <div
                    key={b.label}
                    className="grid grid-cols-12 items-center py-1 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                  >
                    <div className="col-span-4 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-800">{b.label}</span>
                      <span className="text-[8px] text-zinc-400 ml-1">({b.days}d)</span>
                    </div>
                    <div className="col-span-4 pr-2">
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-zinc-900"
                          style={{ width: `${Math.min(100, b.otbPct)}%` }}
                        />
                        <div
                          className="h-full bg-zinc-300"
                          style={{ width: `${Math.min(100 - b.otbPct, b.walkInPct)}%` }}
                        />
                      </div>
                    </div>
                    <span className="col-span-2 text-[10px] text-zinc-700 text-right">
                      {fmtInt(b.otbAttendances)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-[#14532d] text-right">
                      {fmtPct(b.loadPct, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. SCHEDULED PRIVATE CHARTERS & BUYOUTS */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: `${selectedProperty.name} — Scheduled Private Charters & Bespoke Bookings`,
                data: {
                  key: 'EXP_FORWARD_STAY',
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
                  SCHEDULED PRIVATE CHARTERS &amp; BUYOUTS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Upcoming high-ticket private charters &amp; specialist bookings
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-zinc-100 tabular-nums">
                <div>
                  <div className="text-[8.5px] text-zinc-400">Charters</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {propertyCharters.list.length} Bookings
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Charter Guests</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {fmtInt(propertyCharters.totalPax)} Pax
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Charter Rev.</div>
                  <div className="text-xs font-bold text-[#14532d]">
                    {fmtUsd(propertyCharters.totalRev)}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                  <span className="col-span-5">Charter &amp; Slot</span>
                  <span className="col-span-2 text-right">Pax</span>
                  <span className="col-span-2 text-right">Rev.</span>
                  <span className="col-span-3 text-right">Status</span>
                </div>

                {propertyCharters.list.map((chr) => {
                  const isWait = chr.status === 'Waitlist Priority';
                  return (
                    <div
                      key={chr.id}
                      className="grid grid-cols-12 items-center py-1 border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                    >
                      <div className="col-span-5 min-w-0 pr-1">
                        <div className="text-[10px] font-medium text-zinc-800 truncate">{chr.title}</div>
                        <div className="text-[8px] text-zinc-400 truncate">{chr.dateWindow}</div>
                      </div>
                      <span className="col-span-2 text-[10px] text-zinc-700 text-right">{chr.pax}</span>
                      <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                        {fmtUsd(chr.revenue)}
                      </span>
                      <div className="col-span-3 flex justify-end">
                        <span
                          className={`text-[7.5px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${
                            isWait
                              ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                              : 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                          }`}
                        >
                          {chr.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
