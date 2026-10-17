import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
  AltArrowDown,
  Magnifer,
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
import { getPortfolioMetrics, getPropertyMetrics, PERIOD_DEFS, type PeriodId } from '@/data/portfolio';

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
    id: 'sosei-maldives',
    name: 'SOSEI MALDIVES',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'North Malé Atoll, Maldives',
    signatureExperiences: 'Manta Ray Free-Dive · Sunset Private Catamaran',
    leadPillar: 'Water & Marine / Kids Lagoon',
    status: 'above_plan',
  },
  {
    id: 'sosei-costa-rica',
    name: 'SOSEI COSTA RICA',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    regionId: 'america',
    regionName: 'America',
    location: 'Papagayo, Costa Rica',
    signatureExperiences: 'Canopy Night Wildlife Walk · Pacific Outrigger',
    leadPillar: 'Nature & Adventure / Family',
    status: 'above_plan',
  },
  {
    id: 'sosei-switzerland',
    name: 'SOSEI SWITZERLAND',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Zermatt, Switzerland',
    signatureExperiences: 'Matterhorn Heli-Glacier Trek · Alpine Breathwork',
    leadPillar: 'Alpine Adventure & Movement',
    status: 'above_plan',
  },
  {
    id: 'sosei-bali',
    name: 'SOSEI BALI',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Uluwatu, Bali, Indonesia',
    signatureExperiences: 'Uluwatu Cliff Sunrise Yoga · Melukat Water Blessing',
    leadPillar: 'Yoga, Mindfulness & Culture',
    status: 'above_plan',
  },
  {
    id: 'sosei-canada',
    name: 'SOSEI CANADA',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    regionId: 'america',
    regionName: 'America',
    location: 'Whistler, Canada',
    signatureExperiences: 'Backcountry Powder Guide · Cedar Forest Foraging',
    leadPillar: 'Mountain & Family Discovery',
    status: 'above_plan',
  },
  {
    id: 'sosei-japan',
    name: 'SOSEI JAPAN',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Kyoto, Japan',
    signatureExperiences: 'Arashiyama Zen Zazen · Kintsugi & Tea Immersion',
    leadPillar: 'Culture, Zen & Botanical',
    status: 'on_plan',
  },
  {
    id: 'sosei-oman',
    name: 'SOSEI OMAN',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    regionId: 'middle-east',
    regionName: 'Middle East',
    location: 'Jebel Akhdar, Oman',
    signatureExperiences: 'Jebel Akhdar Via Ferrata · Canyon Stargazing',
    leadPillar: 'Canyon Adventure & Astronomy',
    status: 'on_plan',
  },
  {
    id: 'sosei-tokyo',
    name: 'SOSEI TOKYO',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    regionId: 'asia-pacific',
    regionName: 'Asia Pacific',
    location: 'Tokyo, Japan',
    signatureExperiences: 'Private Toyosu Tuna Auction · Edo Swordsmith Visit',
    leadPillar: 'Urban Cultural & Movement',
    status: 'on_plan',
  },
  {
    id: 'sosei-barcelona',
    name: 'SOSEI BARCELONA',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    regionId: 'europe',
    regionName: 'Europe',
    location: 'Barcelona, Spain',
    signatureExperiences: 'Private Architect Sail · Gothic Quarter Art Walk',
    leadPillar: 'Med Sailing & Architecture',
    status: 'on_plan',
  },
  {
    id: 'sosei-egypt',
    name: 'SOSEI EGYPT',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    regionId: 'africa',
    regionName: 'Africa',
    location: 'Siwa Oasis, Egypt',
    signatureExperiences: 'Siwa Salt Lake Float · Desert Astronomy Expedition',
    leadPillar: 'Desert Discovery & Mindful',
    status: 'attention',
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
        : [
            { region: 'Asia Pacific', weight: 36.5, capOffset: 1.8 },
            { region: 'Europe', weight: 25.5, capOffset: -1.2 },
            { region: 'America', weight: 19.0, capOffset: 2.4 },
            { region: 'Middle East', weight: 11.5, capOffset: 4.1 },
            { region: 'Africa', weight: 7.5, capOffset: -4.6 },
          ].map((g) => ({
            region: g.region,
            shareNum: g.weight,
            partShare: `${g.weight.toFixed(1)}%`,
            capture: `${Math.min(96, Math.max(35, avgParticipation + g.capOffset)).toFixed(1)}%`,
            revenue: fmtMoney(totalPaidRev * (g.weight / 100)),
            isTotal: false,
          }));

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

    const categoryShares = [
      { name: 'Water & Marine', share: 24, color: '#0f172a', util: '88.4%' },
      { name: 'Yoga & Meditation', share: 21, color: '#334155', util: '86.2%' },
      { name: 'Nature & Adventure', share: 20, color: '#64748b', util: '83.5%' },
      { name: 'Culture & Workshops', share: 19, color: '#94a3b8', util: '79.6%' },
      { name: "Kids' Club & Family", share: 16, color: '#cbd5e1', util: '82.4%' },
    ];

    const categoryTable = [
      ...categoryShares.map((c) => ({
        category: c.name,
        share: `${c.share}%`,
        util: c.util,
        attendees: fmtCount(totalParticipants * (c.share / 100)),
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

    const commercialMix = [
      { name: 'Complimentary Stay-Enrich', share: avgCompShare, color: '#0f172a', yield: '4.91 CSAT' },
      { name: 'Paid Private & Bespoke', share: Math.round((100 - avgCompShare) * 0.42), color: '#334155', yield: fmtMoney(totalPaidRev * 0.46) },
      { name: 'Paid Group Guided', share: Math.round((100 - avgCompShare) * 0.30), color: '#64748b', yield: fmtMoney(totalPaidRev * 0.26) },
      { name: 'External Partner Trips', share: Math.round((100 - avgCompShare) * 0.16), color: '#94a3b8', yield: fmtMoney(totalPaidRev * 0.20) },
      { name: 'Package & Upgrades', share: Math.max(2, 100 - avgCompShare - Math.round((100 - avgCompShare) * 0.88)), color: '#cbd5e1', yield: fmtMoney(totalPaidRev * 0.08) },
    ];

    return {
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

  const kpis = [
    {
      id: 'participation',
      label: 'GUEST PARTICIPATION RATE',
      tooltip: 'Unique eligible in-house guests participating in ≥1 activity ÷ eligible in-house guests.',
      value: `${analytics.avgParticipation}%`,
      vsLy: '+5.4 pts vs LY',
      sub1: `${fmtCount(analytics.totalParticipants)} Attendees`,
      sub2: '1.92 Act / Stay',
    },
    {
      id: 'utilization',
      label: 'CAPACITY UTILIZATION',
      tooltip: 'Actual attendees ÷ available participant capacity for delivered sessions.',
      value: `${analytics.avgCapUtil}%`,
      vsLy: '+4.2 pts vs LY',
      sub1: `${analytics.totalSessions.toLocaleString()} Sessions`,
      sub2: `${analytics.totalPrograms} Programs`,
    },
    {
      id: 'fulfillment',
      label: 'DEMAND FULFILLMENT',
      tooltip: 'Bookings accommodated ÷ total valid demand including waitlists and turnaways.',
      value: `${analytics.avgFulfillment}%`,
      vsLy: '+3.1 pts vs LY',
      sub1: `${analytics.totalWaitlist} Waitlisted`,
      sub2: '3.8% No-Show',
    },
    {
      id: 'quality',
      label: 'EXPERIENCE QUALITY',
      tooltip: 'Guest satisfaction score, repeat participation rate, and service quality.',
      value: `${analytics.avgQuality}%`,
      vsLy: '+1.4 pts vs LY',
      sub1: '4.88 / 5.0 CSAT',
      sub2: '41.2% Repeat',
    },
    {
      id: 'readiness',
      label: 'STAFF & SESSION READINESS',
      tooltip: 'Sessions deliverable with certified instructors, equipment, and safe conditions.',
      value: `${analytics.avgReadiness}%`,
      vsLy: '+1.8 pts vs LY',
      sub1: '99.4% Cert Staff',
      sub2: '0 Severe Incidents',
    },
    {
      id: 'contribution',
      label: 'PORTFOLIO CONTRIBUTION',
      tooltip: 'Paid commercial experience revenue alongside complimentary stay-enriching participation.',
      value: fmtMoney(analytics.totalPaidRev),
      vsLy: `${analytics.avgLflGrowth >= 0 ? '+' : ''}${analytics.avgLflGrowth}% vs LY`,
      sub1: `${analytics.avgCompShare}% Comp / ${100 - analytics.avgCompShare}% Paid`,
      sub2: '+1.4d Stay Uplift',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ───────────────── 5 CORE PERFORMANCE METRICS ───────────────── */}
      <ExperienceKpiRow kpis={kpis} drawerTitleSuffix={selectionTitle} />

      {/* ───────────────── ROW 1: 3-COLUMN ANALYTICS (GEO MAP | CATEGORY MIX | PAID VS COMPLIMENTARY MIX) ───────────────── */}
      <div className="-mx-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Widget 1: Geo Footprint & Participation Stats */}
        <div
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'EXPERIENCE_DETAIL',
              title: `Geographic Experience Participation — ${selectionTitle}`,
              data: { key: 'EXP_HEADLINE_KPI', kpiId: 'participation' },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                {mode === 'regional' ? 'Regional Experience Footprint' : 'Participant Origin Market Stats'}
              </span>
              <InfoTooltip text="Distribution of experience participants, eligible guest capture rate, and paid experience revenue across SOSEI's 5 global regions." />
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400">See details →</span>
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
              data: { key: 'EXP_PORTFOLIO_TAXONOMY' },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                Activity Category Mix
              </span>
              <InfoTooltip text="Participant share and capacity utilization across Water & Marine, Yoga & Meditation, Nature, Culture, and Kids & Family." />
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400">See details →</span>
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
              data: { key: 'EXP_COMMERCIAL_STAY_IMPACT' },
            })
          }
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900">
                Paid vs Complimentary Mix
              </span>
              <InfoTooltip text="Balancing complimentary stay-enriching participation with paid private bespoke experiences, guided adventures, and partner excursions." />
            </div>
            <span className="text-[9.5px] font-medium text-zinc-400">See details →</span>
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
                      {fmtCount(analytics.totalParticipants * (row.share / 100))}
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
              Period: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
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
              Period: <strong className="font-semibold text-zinc-900">{analytics.horizonMeta.periodLabel}</strong>
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

  const expRecord = useMemo(() => {
    const desc =
      EXPERIENCE_STATIC_DESCRIPTORS.find((p) => p.id === selectedProperty.id) ||
      EXPERIENCE_STATIC_DESCRIPTORS[0];
    return buildExperiencePropertyRecord(desc, horizon);
  }, [selectedProperty.id, horizon]);

  const baseHorizonMeta = HORIZON_TABS.find((t) => t.id === horizon) || HORIZON_TABS[1];
  const horizonMeta = { ...baseHorizonMeta, factor: 1 };
  const factor = 1;

  const totalPaidRev = expRecord.mtdPaidRev * factor;
  const totalParticipants = Math.round(expRecord.mtdParticipants * factor);
  const totalSessions = Math.round(expRecord.mtdSessions * factor);
  const totalWaitlist = Math.round(expRecord.mtdWaitlist * factor);

  const staffCapacityMatrix = useMemo(() => {
    const sigs = expRecord.signatureExperiences.split('·').map((s) => s.trim());
    return [
      {
        activity: `06:30 Sunrise Yoga & Pranayama (${selectedProperty.name.replace('SOSEI ', '')})`,
        category: 'Yoga & Meditation',
        commercial: 'Complimentary',
        demand: '14 Booked',
        capacity: '16 Places',
        reqStaff: '1 RYT-500 Instructor',
        availStaff: '1 Assigned',
        state: 'Ready',
        diagnosis: 'Healthy Fill (87.5%) · Pavilion Mats Sanitized',
        tone: 'pos',
      },
      {
        activity: `09:00 ${sigs[0] || 'Signature Guided Expedition'}`,
        category: expRecord.leadPillar.split('/')[0].trim(),
        commercial: 'Paid ($240/pax)',
        demand: '12 Booked + 5 Waitlist',
        capacity: '12 Places',
        reqStaff: '2 Certified Guides + 1 Safety',
        availStaff: '3 Assigned (Full Crew)',
        state: 'Capacity Constrained',
        diagnosis: 'Turnaway Alert: 5 Guests Waitlisted → Add 14:30 afternoon departure',
        tone: 'warn',
      },
      {
        activity: "10:00 Kids' Club Nature & Craft Discovery (Ages 4–12)",
        category: "Kids' Club",
        commercial: 'Complimentary',
        demand: '14 Checked In (18 Reg)',
        capacity: '18 Places',
        reqStaff: '1:5 Ratio (3 Certified Staff)',
        availStaff: '3 Assigned (Pediatric First-Aid)',
        state: 'Ready (Ratio Verified)',
        diagnosis: '1:4.6 Active Supervision Ratio · Guardian Pickup PIN Locked',
        tone: 'pos',
      },
      {
        activity: `16:00 ${sigs[1] || 'Private Bespoke Charter'}`,
        category: 'Signature & Bespoke',
        commercial: 'Paid Private ($1,850)',
        demand: '4 Pax (VIP Suite)',
        capacity: '6 Places',
        reqStaff: '1 Lead Master + 1 Host',
        availStaff: '1 Lead Assigned · 1 Host Reallocating',
        state: 'At Risk (Staffing)',
        diagnosis: 'Operationally Constrained: Reassign Experience Host by 14:00',
        tone: 'neg',
      },
      {
        activity: '17:30 Sunset Sound Healing & Breathwork',
        category: 'Yoga & Meditation',
        commercial: 'Complimentary',
        demand: '3 Booked',
        capacity: '12 Places',
        reqStaff: '1 Mindfulness Facilitator',
        availStaff: '1 Assigned',
        state: 'Low Demand',
        diagnosis: 'Low Demand (25% Fill): Do NOT add staff; prompt Concierge invitation',
        tone: 'neutral',
      },
    ];
  }, [expRecord, selectedProperty.name]);

  const kpis = [
    {
      id: 'participation',
      label: 'GUEST PARTICIPATION RATE',
      value: `${expRecord.participationRate}%`,
      vsLy: '+5.2 pts vs LY',
      sub1: `${fmtCount(totalParticipants)} Attendees`,
      sub2: `${expRecord.rooms} Keys`,
    },
    {
      id: 'utilization',
      label: 'CAPACITY UTILIZATION',
      value: `${expRecord.capacityUtil}%`,
      vsLy: '+4.0 pts vs LY',
      sub1: `${totalSessions} Sessions`,
      sub2: `${expRecord.programsCount} Programs`,
    },
    {
      id: 'fulfillment',
      label: 'DEMAND FULFILLMENT',
      value: `${expRecord.demandFulfillment}%`,
      vsLy: '+2.8 pts vs LY',
      sub1: `${totalWaitlist} Waitlisted`,
      sub2: '3.6% No-Show',
    },
    {
      id: 'quality',
      label: 'EXPERIENCE QUALITY',
      value: `${expRecord.qualityScore}%`,
      vsLy: '+1.5 pts vs LY',
      sub1: '4.90 / 5.0 CSAT',
      sub2: '42% Repeat',
    },
    {
      id: 'readiness',
      label: 'STAFF & SESSION READINESS',
      value: `${expRecord.readinessScore}%`,
      vsLy: '+1.7 pts vs LY',
      sub1: '100% Cert Staff',
      sub2: '0 Incidents',
    },
    {
      id: 'contribution',
      label: 'PORTFOLIO CONTRIBUTION',
      value: fmtMoney(totalPaidRev),
      vsLy: `${expRecord.lflGrowth >= 0 ? '+' : ''}${expRecord.lflGrowth}% vs LY`,
      sub1: `${expRecord.compSharePct}% Comp / ${100 - expRecord.compSharePct}% Paid`,
      sub2: '+1.4d Stay Uplift',
    },
  ];

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
              Period: <strong className="font-semibold text-zinc-900">{horizonMeta.periodLabel}</strong>
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
                const pRec = MASTER_EXPERIENCE_PROPERTIES.find((m) => m.id === prop.id);
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
                        {prop.location} · {pRec ? `${pRec.participationRate}% Part.` : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ExperienceKpiRow kpis={kpis} drawerTitleSuffix={selectedProperty.name} />

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
            {expRecord.programsCount} Active Programs · Go/No-Go Verified
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
                data: { key: 'EXP_KIDS_CLUB_CONTROL' },
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
                { label: 'Registered', val: '18', sub: 'Age Verified' },
                { label: 'Checked In', val: '14', sub: 'On-Site Now' },
                { label: 'Staff Assigned', val: '3', sub: '1:4.6 Ratio' },
                { label: 'Collection Pending', val: '2', sub: 'PIN Locked' },
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
          <div className={CARD_CLASS}>
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
                  desc: '97.4% equipment ready; O2 kit, VHF radio, mats, and marine gear pre-checked.',
                  badge: '97.4% Ready',
                },
                {
                  title: 'Weather & Sea-State Authority',
                  desc: 'Outdoor & marine sessions cleared; indoor cultural studio pre-staged as backup.',
                  badge: 'All Clear',
                },
                {
                  title: 'Tomorrow Arrival & Commercial Handover',
                  desc: '8 arriving families pre-booked; 3 waitlisted couples flagged for private charter upgrade.',
                  badge: '+$4,350 Opp',
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
