import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DownloadMinimalistic,
  AltArrowDown,
  Magnifer,
  Buildings2,
  ClockCircle,
  UsersGroupTwoRounded,
  CloseCircle,
} from '@solar-icons/react';
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import { MASTER_PROPERTIES, resolvePropertyId } from '@/constants/categories';
import {
  getSpaDashboardData,
  type SpaTreatmentRow,
} from '@/data/portfolio/spaMix';
import { type PeriodId } from '@/data/portfolio';

/* ─── Luxury Monochrome Palette (AGENTS.md §1) ─── */
const DONUT_COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

type TimeHorizon = 'Yesterday' | 'MTD' | 'YTD';

const HORIZON_TO_PERIOD: Record<TimeHorizon, PeriodId> = {
  Yesterday: 'today',
  MTD: 'mtd',
  YTD: 'ytd',
};

/* ─── Formatting Helpers ─── */
function fmtCurrency(v: number): string {
  if (!Number.isFinite(v)) return '$0';
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${Math.round(abs).toLocaleString('en-US')}`;
}

function fmtWholeUsd(v: number): string {
  if (!Number.isFinite(v)) return '$0';
  const sign = v < 0 ? '-' : '';
  return `${sign}$${Math.round(Math.abs(v)).toLocaleString('en-US')}`;
}

function fmtNumber(v: number): string {
  if (!Number.isFinite(v)) return '0';
  return Math.round(v).toLocaleString('en-US');
}

function fmtPct(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return '0%';
  return `${v.toFixed(digits)}%`;
}

function fmtSignedPct(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return '0.0%';
  return `${v >= 0 ? '+' : ''}${v.toFixed(digits)}%`;
}

function fmtSignedPts(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return '0.0 pts';
  return `${v >= 0 ? '+' : ''}${v.toFixed(digits)} pts`;
}

/* ─── Heatmap Cell Styling (Luxury Monochrome Scale) ─── */
function heatCellClass(level: 1 | 2 | 3 | 4 | 5, isSelected: boolean): string {
  const ring = isSelected ? 'ring-2 ring-zinc-900 ring-offset-1' : '';
  switch (level) {
    case 5:
      return `bg-zinc-900 text-white font-semibold ${ring}`;
    case 4:
      return `bg-zinc-700 text-white font-medium ${ring}`;
    case 3:
      return `bg-zinc-400 text-zinc-950 font-medium ${ring}`;
    case 2:
      return `bg-zinc-200 text-zinc-800 ${ring}`;
    default:
      return `bg-zinc-100 text-zinc-500 ${ring}`;
  }
}

export function SanctuaryPropertyDashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const propIdParam = searchParams.get('id') || searchParams.get('property');
  const selectedProperty = useMemo(() => {
    if (propIdParam) {
      const canonicalId = resolvePropertyId(propIdParam);
      const found = MASTER_PROPERTIES.find(
        (p) => p.id === canonicalId || p.id === propIdParam,
      );
      if (found) return found;
    }
    return MASTER_PROPERTIES[0];
  }, [propIdParam]);

  const [horizon, setHorizon] = useState<TimeHorizon>('MTD');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Card-level interactive states */
  const [hoveredAreaIdx, setHoveredAreaIdx] = useState<number | null>(null);
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number | null>(null);
  const [categoryLens, setCategoryLens] = useState<'revenue' | 'treatments'>('revenue');
  const [treatmentSort, setTreatmentSort] = useState<'treatments' | 'revenue'>('treatments');
  const [trendMode, setTrendMode] = useState<'7d' | 'ytd'>('7d');
  const [selectedHeatCell, setSelectedHeatCell] = useState<{
    dayIdx: number;
    blockIdx: number;
  } | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<
    | null
    | 'utilization'
    | 'schedule'
    | 'categories'
    | 'treatments'
    | 'packages'
    | 'retail'
    | 'experience'
  >(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const periodId: PeriodId = HORIZON_TO_PERIOD[horizon];

  /* Single source of truth scoped to [selectedProperty.id] */
  const spa = useMemo(
    () => getSpaDashboardData([selectedProperty.id], periodId),
    [selectedProperty.id, periodId],
  );

  const filteredProperties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MASTER_PROPERTIES;
    return MASTER_PROPERTIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleSelectProperty = (id: string) => {
    setSearchParams({ id });
    setDropdownOpen(false);
    setSearchQuery('');
  };

  /* ─── 6 Headline KPI Cards (Scoped to Property, matching SpaDashboardPage) ─── */
  const headlineKpis = useMemo(
    () => [
      {
        label: 'TOTAL TREATMENTS',
        value: fmtNumber(spa.treatments),
        vsLy: `${fmtSignedPct(spa.vsLyTreatmentsPct)} vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetTreatmentsPct)} vs Bud`,
        vsForecast: `${fmtSignedPct(spa.vsForecastTreatmentsPct)} vs Fcst`,
        positive: spa.vsLyTreatmentsPct >= 0,
      },
      {
        label: 'WELLNESS REVENUE',
        value: fmtCurrency(spa.revenue),
        vsLy: `${fmtSignedPct(spa.vsLyPct)} vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetPct)} vs Bud`,
        vsForecast: `${fmtSignedPct(spa.vsForecastPct)} vs Fcst`,
        positive: spa.vsLyPct >= 0,
      },
      {
        label: 'AVG. REVENUE / TREATMENT',
        value: fmtWholeUsd(spa.avgRevenuePerTreatment),
        vsLy: `${fmtSignedPct(spa.vsLyAvgTreatmentPct)} vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetAvgTreatmentPct)} vs Bud`,
        vsForecast: `${fmtSignedPct(spa.vsForecastAvgTreatmentPct)} vs Fcst`,
        positive: spa.vsLyAvgTreatmentPct >= 0,
      },
      {
        label: 'SPA UTILIZATION',
        value: fmtPct(spa.utilisationPct),
        vsLy: `${fmtSignedPts(spa.vsLyUtilisationPts)} vs LY`,
        vsBudget: `${fmtSignedPts(spa.vsBudgetUtilisationPts)} vs Bud`,
        vsForecast: `${fmtSignedPts(spa.vsForecastUtilisationPts)} vs Fcst`,
        positive: spa.vsLyUtilisationPts >= 0,
      },
      {
        label: 'TOTAL THERAPIST HOURS',
        value: `${fmtNumber(spa.hours)} hrs`,
        vsLy: `${fmtSignedPct(spa.vsLyHoursPct)} vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetHoursPct)} vs Bud`,
        vsForecast: `${fmtSignedPct(spa.vsForecastHoursPct)} vs Fcst`,
        positive: spa.vsLyHoursPct >= 0,
      },
      {
        label: 'RETAIL REVENUE',
        value: fmtCurrency(spa.retail.revenue),
        vsLy: `${fmtSignedPct(spa.vsLyRetailPct)} vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetRetailPct)} vs Bud`,
        vsForecast: `${fmtSignedPct(spa.vsForecastRetailPct)} vs Fcst`,
        positive: spa.vsLyRetailPct >= 0,
      },
    ],
    [spa],
  );

  /* ─── Sorted Top Treatments ─── */
  const topTreatments = useMemo(() => {
    const copy = [...spa.treatmentsRanked];
    if (treatmentSort === 'revenue') {
      copy.sort((a, b) => b.revenue - a.revenue);
    } else {
      copy.sort((a, b) => b.treatments - a.treatments);
    }
    return copy.slice(0, 5);
  }, [spa.treatmentsRanked, treatmentSort]);

  /* ─── Category Rows for Revenue / Treatments Donut ─── */
  const displayedCategories = useMemo(() => {
    if (categoryLens === 'treatments') {
      return spa.categories.filter((c) => c.kind === 'service');
    }
    return spa.categories;
  }, [spa.categories, categoryLens]);

  /* ─── Trend Data for Utilization Over Time ─── */
  const utilizationTrendData = useMemo(() => {
    if (trendMode === 'ytd') {
      return spa.monthlyTrend.map((d) => ({
        name: d.name,
        thisYear: d.thisYear,
        lastYear: d.lastYear,
      }));
    }
    return spa.trend.map((d) => ({
      name: d.name,
      thisYear: d.value,
      lastYear: d.lyValue,
    }));
  }, [spa.trend, spa.monthlyTrend, trendMode]);

  /* ─── Export CSV ─── */
  const handleExportCsv = () => {
    const rows = [
      ['Sanctuary Property Report', selectedProperty.name, `Horizon: ${horizon}`, spa.periodLabel],
      [],
      ['KPI', 'Value'],
      ['Total Treatments', String(spa.treatments)],
      ['Wellness Revenue', fmtCurrency(spa.revenue)],
      ['Avg Revenue / Treatment', fmtWholeUsd(spa.avgRevenuePerTreatment)],
      ['Spa Utilization', fmtPct(spa.utilisationPct)],
      ['Total Therapist Hours', `${fmtNumber(spa.hours)} hrs`],
      ['Retail Revenue', fmtCurrency(spa.retail.revenue)],
      [],
      ['Area Utilization', 'Utilised Hours', 'Capacity Hours', 'Utilization %'],
      ...spa.areas.map((a) => [
        a.name,
        String(a.utilisedHours),
        String(a.capacityHours),
        fmtPct(a.utilisationPct),
      ]),
      [],
      ['Category', 'Treatments', 'Revenue', 'Share %'],
      ...spa.categories.map((c) => [
        c.name,
        String(c.treatments),
        fmtCurrency(c.revenue),
        fmtPct(c.revenueSharePct),
      ]),
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute(
      'download',
      `Sanctuary_${selectedProperty.name.replace(/\s+/g, '_')}_${horizon}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ─── Pure SVG Donut Geometry (AGENTS.md §5: size=110, strokeWidth=14) ─── */
  const donutSize = 110;
  const donutStroke = 14;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const totalAreaUtilHours = useMemo(
    () => spa.areas.reduce((sum, a) => sum + a.utilisedHours, 0),
    [spa.areas],
  );

  /* Active heatmap cell details */
  const activeHeatDetail = useMemo(() => {
    if (!selectedHeatCell) return null;
    const { dayIdx, blockIdx } = selectedHeatCell;
    const cell = spa.heatmap.cells[dayIdx]?.[blockIdx];
    const dayName = spa.heatmap.days[dayIdx];
    const block = spa.heatmap.blocks[blockIdx];
    if (!cell || !dayName || !block) return null;
    return { dayName, block, cell };
  }, [selectedHeatCell, spa.heatmap]);

  return (
    <div className="flex flex-col gap-4 w-full pb-10">
      {/* ─── HEADER BAR ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[20px] font-normal tracking-tight text-zinc-900 leading-none">
              Sanctuary Property View
            </h1>

            {/* Property Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-medium shadow-sm hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Buildings2 className="w-3.5 h-3.5 text-zinc-300" />
                <span>{selectedProperty.name}</span>
                <span className="text-[9.5px] text-zinc-400 font-normal">
                  · {selectedProperty.categoryName}
                </span>
                <AltArrowDown
                  className={`w-3 h-3 text-zinc-300 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-[12px] bg-white border border-zinc-200 shadow-xl z-50 p-2 animate-card-enter">
                  <div className="relative mb-2">
                    <Magnifer className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sanctuary property..."
                      className="w-full pl-8 pr-3 py-1.5 text-[10.5px] bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 text-zinc-900"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
                    {filteredProperties.map((prop) => {
                      const isSelected = prop.id === selectedProperty.id;
                      return (
                        <button
                          key={prop.id}
                          type="button"
                          onClick={() => handleSelectProperty(prop.id)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-900 text-white'
                              : 'hover:bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10.5px] font-medium truncate">
                              {prop.name}
                            </span>
                            <span
                              className={`text-[9px] truncate ${
                                isSelected ? 'text-zinc-300' : 'text-zinc-400'
                              }`}
                            >
                              {prop.country} · {prop.categoryName}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                              isSelected
                                ? 'bg-white/15 text-white'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {prop.rooms} keys
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <HeaderClockDisplay />
          </div>

          <p className="text-[10px] text-zinc-500 font-medium">
            Period: {spa.periodLabel} · {selectedProperty.country} ({selectedProperty.region}) ·{' '}
            {spa.therapists} Rostered Therapists ·{' '}
            <button
              type="button"
              onClick={() => navigate('/dashboard/spa')}
              className="text-zinc-900 underline underline-offset-2 hover:text-zinc-600 cursor-pointer"
            >
              Back to Global Sanctuary View
            </button>
          </p>
        </div>

        {/* Right Controls: Horizon Filter + Export */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="inline-flex items-center bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/80">
            {(['Yesterday', 'MTD', 'YTD'] as TimeHorizon[]).map((tab) => {
              const active = horizon === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setHorizon(tab)}
                  className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[10px] font-medium text-zinc-800 transition-colors cursor-pointer"
          >
            <DownloadMinimalistic className="w-3.5 h-3.5 text-zinc-700" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ─── ROW 1: 6 HEADLINE KPI CARDS (Matching Global Sanctuary View) ─── */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        {headlineKpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            onClick={() => setActiveDrawer('utilization')}
            className="col-span-6 sm:col-span-4 lg:col-span-2 relative rounded-[12px] p-3.5 flex flex-col justify-between transition-all duration-300 bg-zinc-50/50 border border-zinc-100 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full"
            style={{ animationDelay: `${0.04 + idx * 0.03}s` }}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                {kpi.label}
              </span>
              <span
                className={`inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                  kpi.positive
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
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {kpi.vsBudget}
              </span>
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {kpi.vsForecast}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ROW 2: PROPERTY-LEVEL UTILIZATION & PEAK LOAD (3 CARDS 4-4-4 FROM ANNOTATED SCREENSHOT) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* CARD 1: UTILIZATION BY TIME (7 Days × 6 Time Slots Heatmap) */}
        <div
          onClick={() => setActiveDrawer('utilization')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                UTILIZATION BY TIME
              </h2>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                Peak: {spa.heatmap.peakBlockWindow}
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Weekly treatment demand density across time slots ({selectedProperty.name})
            </p>
          </div>

          <div
            className="flex-1 flex flex-col justify-between gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Column Headers: 6 AM .. 9 PM */}
            <div className="grid grid-cols-7 gap-1 items-center">
              <div className="text-[8.5px] font-medium text-zinc-400">Day</div>
              {spa.heatmap.blocks.map((b) => (
                <div
                  key={b.label}
                  className="text-[8.5px] font-medium text-zinc-400 text-center"
                >
                  {b.label}
                </div>
              ))}
            </div>

            {/* 7 Day Rows × 6 Time Slot Cells */}
            <div className="flex flex-col gap-1">
              {spa.heatmap.days.map((dayName, dIdx) => (
                <div key={dayName} className="grid grid-cols-7 gap-1 items-center">
                  <span className="text-[9.5px] font-medium text-zinc-600">{dayName}</span>
                  {spa.heatmap.cells[dIdx].map((cell, bIdx) => {
                    const isSelected =
                      selectedHeatCell?.dayIdx === dIdx &&
                      selectedHeatCell?.blockIdx === bIdx;
                    return (
                      <button
                        key={`${dayName}-${bIdx}`}
                        type="button"
                        onClick={() =>
                          setSelectedHeatCell(
                            isSelected ? null : { dayIdx: dIdx, blockIdx: bIdx },
                          )
                        }
                        title={`${dayName} · ${spa.heatmap.blocks[bIdx].window}: ~${cell.treatmentsPerWeek} treatments/wk (${cell.sharePct.toFixed(1)}% weekly share)`}
                        className={`h-6 rounded-[5px] text-[8.5px] flex items-center justify-center transition-all cursor-pointer ${heatCellClass(
                          cell.level,
                          isSelected,
                        )}`}
                      >
                        {cell.treatmentsPerWeek}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Legend + Selected Slot Detail */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
              {activeHeatDetail ? (
                <span className="text-[9px] font-medium text-zinc-800 truncate">
                  {activeHeatDetail.dayName} ({activeHeatDetail.block.window}):{' '}
                  <strong>{activeHeatDetail.cell.treatmentsPerWeek} treatments/wk</strong> (
                  {activeHeatDetail.cell.sharePct.toFixed(1)}% share)
                </span>
              ) : (
                <span className="text-[9px] text-zinc-500">
                  Peak block <strong>{spa.heatmap.peakBlockWindow}</strong> drives{' '}
                  <strong>{spa.heatmap.peakBlockSharePct}%</strong> of treatments
                </span>
              )}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[8px] text-zinc-400">Low</span>
                <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 border border-zinc-200" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-200" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-400" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-900" />
                <span className="text-[8px] text-zinc-500 font-medium">Peak</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: UTILIZATION OVER TIME (Line Chart vs STLY) */}
        <div
          onClick={() => setActiveDrawer('utilization')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                UTILIZATION OVER TIME
              </h2>
              <div
                className="inline-flex items-center bg-zinc-100 p-0.5 rounded-md border border-zinc-200/70"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setTrendMode('7d')}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-medium transition-colors cursor-pointer ${
                    trendMode === '7d'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setTrendMode('ytd')}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-medium transition-colors cursor-pointer ${
                    trendMode === 'ytd'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Monthly YTD
                </button>
              </div>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-2">
              Billable treatment hours vs available therapist capacity (%)
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="h-[155px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={utilizationTrendData}
                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="spaPropUtilFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#71717a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 9, fill: '#71717a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e4e4e7',
                      borderRadius: '8px',
                      fontSize: '10px',
                      padding: '6px 10px',
                    }}
                    formatter={(val, key) => [
                      `${Number(val ?? 0).toFixed(1)}%`,
                      key === 'thisYear' ? 'This Year' : 'Last Year',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="lastYear"
                    stroke="#a1a1aa"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="thisYear"
                    stroke="#18181b"
                    strokeWidth={2}
                    fill="url(#spaPropUtilFill)"
                    dot={{ r: 2.5, fill: '#18181b' }}
                    activeDot={{ r: 4, fill: '#18181b' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-zinc-100 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[8.5px] text-zinc-400">Current Util.</div>
                <div className="text-[11px] font-medium text-zinc-900">
                  {fmtPct(spa.utilisationPct)}{' '}
                  <span className="text-[9px] text-[#14532d]">
                    ({fmtSignedPts(spa.vsLyUtilisationPts)})
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[8.5px] text-zinc-400">Billable / Cap.</div>
                <div className="text-[11px] font-medium text-zinc-900">
                  {fmtNumber(spa.hours)} / {fmtNumber(spa.capacityHours)}h
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8.5px] text-zinc-400">Therapist Roster</div>
                <div className="text-[11px] font-medium text-zinc-900">
                  {spa.therapists} Specialists
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: UTILIZATION BY AREA (Pure SVG Vector Donut + 5 Facility Zones) */}
        <div
          onClick={() => setActiveDrawer('utilization')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                UTILIZATION BY AREA
              </h2>
              <span className="text-[9px] text-zinc-400 font-normal">
                {spa.areas.length} Sanctuary Zones
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Room & thermal facility load across sanctuary zones
            </p>
          </div>

          <div className="flex-1 flex items-center gap-4 justify-between">
            {/* Pure SVG Donut (size=110, strokeWidth=14) */}
            <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="-rotate-90">
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                  fill="transparent"
                  stroke="#f4f4f5"
                  strokeWidth={donutStroke}
                />
                {(() => {
                  let acc = 0;
                  return spa.areas.map((area, idx) => {
                    const share =
                      totalAreaUtilHours > 0 ? area.utilisedHours / totalAreaUtilHours : 0;
                    const dash = share * donutCircumference;
                    const offset = -acc * donutCircumference;
                    acc += share;
                    const isHovered = hoveredAreaIdx === idx;
                    return (
                      <circle
                        key={area.id}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="transparent"
                        stroke={DONUT_COLORS[idx % DONUT_COLORS.length]}
                        strokeWidth={isHovered ? donutStroke + 2 : donutStroke}
                        strokeDasharray={`${dash} ${donutCircumference}`}
                        strokeDashoffset={offset}
                        className="transition-all duration-200"
                        opacity={hoveredAreaIdx === null || isHovered ? 1 : 0.35}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                <span className="text-[14px] font-normal text-zinc-900 leading-none">
                  {hoveredAreaIdx !== null
                    ? `${Math.round(spa.areas[hoveredAreaIdx].utilisationPct)}%`
                    : `${Math.round(spa.utilisationPct)}%`}
                </span>
                <span className="text-[7.5px] font-medium uppercase tracking-wider text-zinc-400 mt-1 truncate max-w-[76px]">
                  {hoveredAreaIdx !== null
                    ? spa.areas[hoveredAreaIdx].name
                    : 'OVERALL UTIL.'}
                </span>
              </div>
            </div>

            {/* Area Breakdown Table */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-6">Area Zone</span>
                <span className="col-span-3 text-right">Hours</span>
                <span className="col-span-3 text-right">Util.</span>
              </div>
              {spa.areas.map((area, idx) => {
                const isPeak = area.utilisationPct >= 85;
                return (
                  <div
                    key={area.id}
                    onMouseEnter={() => setHoveredAreaIdx(idx)}
                    onMouseLeave={() => setHoveredAreaIdx(null)}
                    className="grid grid-cols-12 items-center text-[10px] py-0.5 rounded hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="col-span-6 flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-zinc-700 truncate">
                        {area.name}
                      </span>
                    </div>
                    <span className="col-span-3 text-right text-[9.5px] text-zinc-500">
                      {fmtNumber(area.utilisedHours)}h
                    </span>
                    <span
                      className={`col-span-3 text-right font-medium ${
                        isPeak ? 'text-[#800020]' : 'text-zinc-900'
                      }`}
                    >
                      {Math.round(area.utilisationPct)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-500">
            <span>Highest Load Zone</span>
            <span className="font-medium text-zinc-900">
              {
                [...spa.areas].sort((a, b) => b.utilisationPct - a.utilisationPct)[0]
                  ?.name
              }{' '}
              (
              {Math.round(
                [...spa.areas].sort((a, b) => b.utilisationPct - a.utilisationPct)[0]
                  ?.utilisationPct ?? 0,
              )}
              %)
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: PROPERTY SCHEDULING, UPCOMING PEAK TIMES & REVENUE BY CATEGORY (3 CARDS 4-4-4) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* CARD 4: SCHEDULE OVERVIEW (Marked "PROPERTY" in Screenshot Row 3) */}
        <div
          onClick={() => setActiveDrawer('schedule')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                SCHEDULE OVERVIEW
              </h2>
              <span className="text-[9.5px] font-medium text-zinc-900">
                {fmtNumber(spa.pipeline.total)}{' '}
                <span className="text-zinc-400 font-normal">Total Appointments</span>
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Appointment pipeline status & in-house guest capture
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-2.5">
              {spa.pipeline.rows.map((row, idx) => {
                const pct =
                  spa.pipeline.total > 0
                    ? (row.value / spa.pipeline.total) * 100
                    : 0;
                const isCancelled = row.id === 'cancelled';
                const barColors = [
                  'bg-zinc-900',
                  'bg-zinc-700',
                  'bg-zinc-500',
                  'bg-[#800020]',
                ];
                return (
                  <div key={row.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium text-zinc-700">{row.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isCancelled ? 'text-[#800020]' : 'text-zinc-900'
                          }`}
                        >
                          {fmtNumber(row.value)}
                        </span>
                        <span className="text-[9px] text-zinc-400 w-9 text-right">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          barColors[idx % barColors.length]
                        }`}
                        style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Scheduling Metrics Strip */}
            <div className="pt-2.5 border-t border-zinc-100 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[8.5px] text-zinc-400">In-House Capture</div>
                <div className="text-[10.5px] font-medium text-zinc-900">
                  {spa.attachmentPct.toFixed(1)}% of Stays
                </div>
              </div>
              <div>
                <div className="text-[8.5px] text-zinc-400">Rev / Room Night</div>
                <div className="text-[10.5px] font-medium text-zinc-900">
                  {fmtWholeUsd(spa.revenuePerRoomNight)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8.5px] text-zinc-400">90D OTB Coverage</div>
                <div className="text-[10.5px] font-medium text-[#14532d]">
                  {Math.round(spa.forwardCoverage.coveragePct)}% (
                  {fmtCurrency(spa.forwardCoverage.otbRevenue)})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: UPCOMING PEAK TIMES (Marked "PROPERTY" in Screenshot Row 3) */}
        <div
          onClick={() => setActiveDrawer('schedule')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                UPCOMING PEAK TIMES
              </h2>
              <span className="text-[9px] text-zinc-400 font-normal">
                Next 4 Days Forecast
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Forward peak treatment windows & therapist staffing load
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-2">
              {spa.peaks.map((peak) => {
                const badgeClass =
                  peak.level === 'HIGH'
                    ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                    : peak.level === 'MEDIUM'
                    ? 'bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                    : 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80';
                return (
                  <div
                    key={`${peak.dateLabel}-${peak.window}`}
                    className="p-2 rounded-lg bg-white border border-zinc-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-zinc-900">
                          {peak.dateLabel}
                        </span>
                        <span className="text-[9px] text-zinc-400">·</span>
                        <span className="text-[9.5px] font-medium text-zinc-600">
                          {peak.window}
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">
                        Pre-booked: {Math.round(peak.preBookedPct)}% · Staffing:{' '}
                        <span className="text-zinc-700 font-medium">
                          {peak.therapistsRequired}/{peak.roster} therapists
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-[10.5px] font-medium text-zinc-900">
                          {Math.round(peak.projectedUtilisationPct)}%
                        </div>
                        <div className="text-[8px] text-zinc-400">Proj. Util</div>
                      </div>
                      <span
                        className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded ${badgeClass}`}
                      >
                        {peak.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-500">
              <span>90-Day Forecast Sanctuary Revenue</span>
              <span className="font-medium text-zinc-900">
                {fmtCurrency(spa.forwardCoverage.forecastRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 6: REVENUE BY CATEGORY (Pure SVG Donut + Category Mix) */}
        <div
          onClick={() => setActiveDrawer('categories')}
          className="lg:col-span-4 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                REVENUE BY CATEGORY
              </h2>
              <div
                className="inline-flex items-center bg-zinc-100 p-0.5 rounded-md border border-zinc-200/70"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setCategoryLens('revenue')}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-medium transition-colors cursor-pointer ${
                    categoryLens === 'revenue'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Wellness Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryLens('treatments')}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-medium transition-colors cursor-pointer ${
                    categoryLens === 'treatments'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Treatments
                </button>
              </div>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Sanctuary discipline breakdown at {selectedProperty.name}
            </p>
          </div>

          <div className="flex-1 flex items-center gap-4 justify-between">
            {/* Pure SVG Donut (size=110, strokeWidth=14) */}
            <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="-rotate-90">
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                  fill="transparent"
                  stroke="#f4f4f5"
                  strokeWidth={donutStroke}
                />
                {(() => {
                  let acc = 0;
                  const totalVal = displayedCategories.reduce(
                    (sum, c) =>
                      sum + (categoryLens === 'revenue' ? c.revenue : c.treatments),
                    0,
                  );
                  return displayedCategories.map((cat, idx) => {
                    const val =
                      categoryLens === 'revenue' ? cat.revenue : cat.treatments;
                    const share = totalVal > 0 ? val / totalVal : 0;
                    const dash = share * donutCircumference;
                    const offset = -acc * donutCircumference;
                    acc += share;
                    const isHovered = hoveredCategoryIdx === idx;
                    return (
                      <circle
                        key={cat.id}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="transparent"
                        stroke={DONUT_COLORS[idx % DONUT_COLORS.length]}
                        strokeWidth={isHovered ? donutStroke + 2 : donutStroke}
                        strokeDasharray={`${dash} ${donutCircumference}`}
                        strokeDashoffset={offset}
                        className="transition-all duration-200"
                        opacity={hoveredCategoryIdx === null || isHovered ? 1 : 0.35}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                <span className="text-[13px] font-normal text-zinc-900 leading-none">
                  {hoveredCategoryIdx !== null && displayedCategories[hoveredCategoryIdx]
                    ? categoryLens === 'revenue'
                      ? fmtCurrency(displayedCategories[hoveredCategoryIdx].revenue)
                      : fmtNumber(displayedCategories[hoveredCategoryIdx].treatments)
                    : categoryLens === 'revenue'
                    ? fmtCurrency(spa.revenue)
                    : fmtNumber(spa.treatments)}
                </span>
                <span className="text-[7.5px] font-medium uppercase tracking-wider text-zinc-400 mt-1 truncate max-w-[76px]">
                  {hoveredCategoryIdx !== null && displayedCategories[hoveredCategoryIdx]
                    ? displayedCategories[hoveredCategoryIdx].name
                    : categoryLens === 'revenue'
                    ? 'Total Rev'
                    : 'Treatments'}
                </span>
              </div>
            </div>

            {/* Category Table */}
            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-6">Category</span>
                <span className="col-span-3 text-right">
                  {categoryLens === 'revenue' ? 'Revenue' : 'Volume'}
                </span>
                <span className="col-span-3 text-right">% Share</span>
              </div>
              {displayedCategories.map((cat, idx) => {
                const totalVal = displayedCategories.reduce(
                  (s, c) =>
                    s + (categoryLens === 'revenue' ? c.revenue : c.treatments),
                  0,
                );
                const val = categoryLens === 'revenue' ? cat.revenue : cat.treatments;
                const sharePct = totalVal > 0 ? (val / totalVal) * 100 : 0;
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredCategoryIdx(idx)}
                    onMouseLeave={() => setHoveredCategoryIdx(null)}
                    className="grid grid-cols-12 items-center text-[10px] py-0.5 rounded hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="col-span-6 flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-zinc-700 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="col-span-3 text-right font-medium text-zinc-900">
                      {categoryLens === 'revenue'
                        ? fmtCurrency(cat.revenue)
                        : fmtNumber(cat.treatments)}
                    </span>
                    <span className="col-span-3 text-right text-[9.5px] text-zinc-500">
                      {Math.round(sharePct)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-500">
            <span>Spa Pillar vs Medical Wellness</span>
            <span className="font-medium text-zinc-900">
              {fmtCurrency(spa.spaPillarRevenue)} Spa · {fmtCurrency(spa.wellnessRevenue)} Medical
            </span>
          </div>
        </div>
      </div>

      {/* ─── ROW 4: TOP TREATMENTS, PACKAGES, RETAIL & GUEST EXPERIENCE INDEX (4 CARDS 3-3-3-3) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
        {/* CARD 7: TOP TREATMENTS */}
        <div
          onClick={() => setActiveDrawer('treatments')}
          className="lg:col-span-3 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                TOP TREATMENTS
              </h2>
              <div
                className="inline-flex items-center bg-zinc-100 p-0.5 rounded-md border border-zinc-200/70"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setTreatmentSort('treatments')}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-medium cursor-pointer ${
                    treatmentSort === 'treatments'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600'
                  }`}
                >
                  Volume
                </button>
                <button
                  type="button"
                  onClick={() => setTreatmentSort('revenue')}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-medium cursor-pointer ${
                    treatmentSort === 'revenue'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600'
                  }`}
                >
                  Revenue
                </button>
              </div>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Signature rituals ranked by property demand
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2">
            {topTreatments.map((t, idx) => {
              const maxVal =
                treatmentSort === 'revenue'
                  ? topTreatments[0]?.revenue || 1
                  : topTreatments[0]?.treatments || 1;
              const val = treatmentSort === 'revenue' ? t.revenue : t.treatments;
              const pct = (val / maxVal) * 100;
              return (
                <div key={t.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-4 h-4 rounded bg-zinc-200/80 text-zinc-800 text-[8.5px] font-semibold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-zinc-800 truncate">
                        {t.name}
                      </span>
                    </div>
                    <span className="font-medium text-zinc-900 shrink-0">
                      {treatmentSort === 'revenue'
                        ? fmtCurrency(t.revenue)
                        : fmtNumber(t.treatments)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 8: MEMBERSHIP & PACKAGES */}
        <div
          onClick={() => setActiveDrawer('packages')}
          className="lg:col-span-3 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                MEMBERSHIP & PACKAGES
              </h2>
              <span className="text-[9px] text-zinc-400">Multi-Day & Retreats</span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Curated sanctuary programs & active members
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="grid grid-cols-3 gap-1.5 bg-white p-2 rounded-lg border border-zinc-100">
              <div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-400">
                  Active Members
                </div>
                <div className="text-[13px] font-normal text-zinc-900 mt-0.5">
                  {fmtNumber(spa.packages.activeMembers)}
                </div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-400">
                  Packages Sold
                </div>
                <div className="text-[13px] font-normal text-zinc-900 mt-0.5">
                  {fmtNumber(spa.packages.sold)}
                </div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-wider text-zinc-400">
                  Pkg Revenue
                </div>
                <div className="text-[13px] font-normal text-zinc-900 mt-0.5">
                  {fmtCurrency(spa.packages.revenue)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {spa.packages.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between text-[10px] py-0.5 border-b border-zinc-100/80 last:border-none"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-zinc-700 truncate">
                      {tier.name}
                    </span>
                    <span className="text-[8.5px] text-zinc-400">
                      {fmtNumber(tier.sold)} sold · {fmtWholeUsd(tier.price)}
                    </span>
                  </div>
                  <span className="font-medium text-zinc-900 shrink-0">
                    {fmtCurrency(tier.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 9: RETAIL TOP SELLERS */}
        <div
          onClick={() => setActiveDrawer('retail')}
          className="lg:col-span-3 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                RETAIL TOP SELLERS
              </h2>
              <span className="text-[9px] text-zinc-400">
                {fmtNumber(spa.retail.units)} Units
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Apothecary & take-home botanical formulations
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1.5">
              {spa.retail.products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between text-[10px] py-0.5 border-b border-zinc-100/80 last:border-none"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-zinc-700 truncate">
                      {prod.name}
                    </span>
                    <span className="text-[8.5px] text-zinc-400">
                      {fmtNumber(prod.units)} units · {fmtWholeUsd(prod.unitPrice)}
                    </span>
                  </div>
                  <span className="font-medium text-zinc-900 shrink-0">
                    {fmtCurrency(prod.revenue)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[9.5px]">
              <span className="text-zinc-500 font-medium">Total Retail Revenue</span>
              <span className="font-semibold text-zinc-900">
                {fmtCurrency(spa.retail.revenue)} ({spa.retail.sharePct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* CARD 10: WELLNESS EXPERIENCE INDEX (Pure SVG Donut + 4 Dimensions) */}
        <div
          onClick={() => setActiveDrawer('experience')}
          className="lg:col-span-3 relative rounded-[12px] p-4 flex flex-col bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
        >
          <div>
            <div className="flex items-center justify-between h-4 mb-1">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                WELLNESS EXPERIENCE INDEX
              </h2>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                Verified Post-Ritual
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-500 font-medium mb-3">
              Guest sentiment across 4 sanctuary touchpoints
            </p>
          </div>

          <div className="flex-1 flex items-center gap-3 justify-between">
            {/* Pure SVG Donut (size=110, strokeWidth=14) */}
            <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="-rotate-90">
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                  fill="transparent"
                  stroke="#f4f4f5"
                  strokeWidth={donutStroke}
                />
                <circle
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                  fill="transparent"
                  stroke="#0f172a"
                  strokeWidth={donutStroke}
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (spa.experience.score / 5) * donutCircumference
                  } ${donutCircumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[16px] font-normal text-zinc-900 leading-none">
                  {spa.experience.score.toFixed(2)}
                </span>
                <span className="text-[8px] font-medium uppercase tracking-wider text-zinc-400 mt-1">
                  OUT OF 5.0
                </span>
              </div>
            </div>

            {/* 4 Sub-Dimensions */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {spa.experience.subs.map((sub) => (
                <div key={sub.id} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="font-medium text-zinc-700 truncate">
                      {sub.label}
                    </span>
                    <span className="font-semibold text-zinc-900">
                      {sub.value.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${(sub.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-500">
            <span>Repeat Sanctuary Guests</span>
            <span className="font-medium text-zinc-900">
              {fmtNumber(spa.spaGuests)} Guests ({spa.attachmentPct.toFixed(1)}% Capture)
            </span>
          </div>
        </div>
      </div>

      {/* ─── INTERACTIVE PROPERTY DRILLDOWN SLIDE-OVER DRAWER ─── */}
      {activeDrawer !== null && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-[2px] animate-fade-in"
          onClick={() => setActiveDrawer(null)}
        >
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-zinc-900">
                  {activeDrawer === 'utilization'
                    ? `${selectedProperty.name} — Utilization & Facility Capacity`
                    : activeDrawer === 'schedule'
                    ? `${selectedProperty.name} — Schedule & Peak Staffing Roster`
                    : activeDrawer === 'categories'
                    ? `${selectedProperty.name} — Sanctuary Category Breakdown`
                    : activeDrawer === 'treatments'
                    ? `${selectedProperty.name} — Complete Treatment Ledger`
                    : activeDrawer === 'packages'
                    ? `${selectedProperty.name} — Membership & Retreat Packages`
                    : activeDrawer === 'retail'
                    ? `${selectedProperty.name} — Apothecary & Retail Performance`
                    : `${selectedProperty.name} — Guest Experience Quality`}
                </h2>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Period: {spa.periodLabel} · {selectedProperty.country} ({selectedProperty.categoryName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <CloseCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
              {/* Summary Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Wellness Revenue
                  </div>
                  <div className="text-[18px] font-normal text-zinc-900 mt-1">
                    {fmtCurrency(spa.revenue)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Total Treatments
                  </div>
                  <div className="text-[18px] font-normal text-zinc-900 mt-1">
                    {fmtNumber(spa.treatments)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Spa Utilization
                  </div>
                  <div className="text-[18px] font-normal text-zinc-900 mt-1">
                    {fmtPct(spa.utilisationPct)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Therapist Roster
                  </div>
                  <div className="text-[18px] font-normal text-zinc-900 mt-1">
                    {spa.therapists} Specialists
                  </div>
                </div>
              </div>

              {activeDrawer === 'utilization' && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    SANCTUARY FACILITY ZONE CAPACITY & LOAD
                  </h3>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[9.5px] font-medium text-zinc-400">
                          <th className="py-2.5 px-3">Facility Zone</th>
                          <th className="py-2.5 px-3 text-right">Daily Cap (hrs)</th>
                          <th className="py-2.5 px-3 text-right">Period Cap (hrs)</th>
                          <th className="py-2.5 px-3 text-right">Utilised Hours</th>
                          <th className="py-2.5 px-3 text-right">Utilization %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-[10px]">
                        {spa.areas.map((a) => (
                          <tr key={a.id} className="hover:bg-zinc-50/80">
                            <td className="py-2.5 px-3 font-medium text-zinc-800">
                              {a.name}
                            </td>
                            <td className="py-2.5 px-3 text-right text-zinc-600">
                              {fmtNumber(a.capacityPerDay)} hrs/day
                            </td>
                            <td className="py-2.5 px-3 text-right text-zinc-600">
                              {fmtNumber(a.capacityHours)} hrs
                            </td>
                            <td className="py-2.5 px-3 text-right font-medium text-zinc-900">
                              {fmtNumber(a.utilisedHours)} hrs
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">
                              {fmtPct(a.utilisationPct)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeDrawer === 'schedule' && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    UPCOMING PEAK WINDOWS & THERAPIST ROSTERING
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spa.peaks.map((p) => (
                      <div
                        key={`${p.dateLabel}-${p.window}`}
                        className="p-3.5 rounded-xl border border-zinc-200 bg-white flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-zinc-900">
                            {p.dateLabel}
                          </span>
                          <span
                            className={`text-[8.5px] font-medium px-2 py-0.5 rounded ${
                              p.level === 'HIGH'
                                ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            {p.level} LOAD
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-600 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <ClockCircle className="w-3.5 h-3.5 text-zinc-400" />
                            {p.window}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UsersGroupTwoRounded className="w-3.5 h-3.5 text-zinc-400" />
                            {p.therapistsRequired} / {p.roster} Therapists
                          </span>
                        </div>
                        <div className="text-[9.5px] text-zinc-500">
                          Projected Utilization:{' '}
                          <strong className="text-zinc-900">
                            {Math.round(p.projectedUtilisationPct)}%
                          </strong>{' '}
                          · Pre-Booked OTB:{' '}
                          <strong className="text-zinc-900">
                            {Math.round(p.preBookedPct)}%
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeDrawer === 'categories' ||
                activeDrawer === 'treatments' ||
                activeDrawer === 'packages' ||
                activeDrawer === 'retail' ||
                activeDrawer === 'experience') && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    COMPLETE PROPERTY TREATMENT & RITUAL MENU PERFORMANCE
                  </h3>
                  <div className="border border-zinc-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[9.5px] font-medium text-zinc-400">
                          <th className="py-2.5 px-3">Treatment / Ritual</th>
                          <th className="py-2.5 px-3">Discipline</th>
                          <th className="py-2.5 px-3 text-right">Treatments</th>
                          <th className="py-2.5 px-3 text-right">Avg Ticket</th>
                          <th className="py-2.5 px-3 text-right">Revenue</th>
                          <th className="py-2.5 px-3 text-right">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-[10px]">
                        {spa.treatmentsRanked.map((item: SpaTreatmentRow) => (
                          <tr key={item.id} className="hover:bg-zinc-50/80">
                            <td className="py-2 px-3 font-medium text-zinc-800">
                              {item.name}
                            </td>
                            <td className="py-2 px-3 text-zinc-500">
                              {item.categoryName}
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-700">
                              {fmtNumber(item.treatments)}
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-600">
                              {fmtWholeUsd(item.avgTicket)}
                            </td>
                            <td className="py-2 px-3 text-right font-medium text-zinc-900">
                              {fmtCurrency(item.revenue)}
                            </td>
                            <td className="py-2 px-3 text-right text-[#14532d] font-medium">
                              {item.rating.toFixed(2)} / 5
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

