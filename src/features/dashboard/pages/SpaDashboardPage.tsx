import { useState, useMemo } from 'react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { AltArrowDown } from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import { PERIOD_DEFS, PERIOD_ORDER, fmtUsd, fmtUsdFull, fmtInt, fmtPct, fmtSignedPct, type PeriodId } from '@/data/portfolio';
import { getSpaDashboardData } from '@/data/portfolio/spaMix';
import type { RegionId } from '@/constants/regions';

const geoUrl = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

const CATEGORY_DONUT_COLORS = [
  '#0f172a',
  '#334155',
  '#475569',
  '#64748b',
  '#94a3b8',
  '#cbd5e1',
];

const REGION_MAP_COORDS: Record<RegionId, { coordinates: [number, number]; labelPos: string }> = {
  europe: { coordinates: [10, 48], labelPos: 'left-[48%] top-[14%]' },
  'middle-east': { coordinates: [50, 25], labelPos: 'left-[55%] top-[54%]' },
  'asia-pacific': { coordinates: [112, -4], labelPos: 'right-[4%] top-[36%]' },
  america: { coordinates: [-84, 14], labelPos: 'left-[4%] top-[36%]' },
  africa: { coordinates: [32, 24], labelPos: 'left-[33%] top-[56%]' },
};

export function SpaDashboardPage() {
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [regionLens, setRegionLens] = useState<'revenue' | 'treatments' | 'growth'>('revenue');
  const [categoryLens, setCategoryLens] = useState<'revenue' | 'treatments'>('revenue');
  const [treatmentLens, setTreatmentLens] = useState<'treatments' | 'revenue'>('treatments');
  const [hoveredCatIdx, setHoveredCatIdx] = useState<number | null>(null);
  const [hoveredExpIdx, setHoveredExpIdx] = useState<number | null>(null);
  const { openDrawer } = useDashboardDrawer();
  const [showDevModal, setShowDevModal] = useState(false);
  const [devFeatureName, setDevFeatureName] = useState<string | undefined>(undefined);

  const openDevModal = (name?: string) => {
    setDevFeatureName(name);
    setShowDevModal(true);
  };

  const spa = useMemo(() => getSpaDashboardData(undefined, horizon), [horizon]);

  const topTreatments = useMemo(() => {
    const slice = spa.treatmentsRanked.slice(0, 5);
    const maxCount = Math.max(1, ...slice.map((t) => t.treatments));
    const maxRev = Math.max(1, ...slice.map((t) => t.revenue));
    return slice.map((t) => ({
      name: t.name,
      treatments: t.treatments,
      countDisplay: fmtInt(t.treatments),
      revenue: t.revenue,
      revenueDisplay: fmtUsd(t.revenue),
      barPct:
        treatmentLens === 'treatments'
          ? Math.round((t.treatments / maxCount) * 100)
          : Math.round((t.revenue / maxRev) * 100),
    }));
  }, [spa.treatmentsRanked, treatmentLens]);

  const categoryDonutItems = useMemo(() => {
    const source =
      categoryLens === 'revenue'
        ? [...spa.categories].sort((a, b) => b.revenue - a.revenue)
        : [...spa.categories].filter((c) => c.kind === 'service').sort((a, b) => b.treatments - a.treatments);
    const total =
      source.reduce((acc, c) => acc + (categoryLens === 'revenue' ? c.revenue : c.treatments), 0) || 1;
    return source.map((c, idx) => {
      const rawVal = categoryLens === 'revenue' ? c.revenue : c.treatments;
      const share = Math.round((rawVal / total) * 100);
      return {
        id: c.id,
        name: c.name,
        rawVal,
        share,
        displayVal: categoryLens === 'revenue' ? fmtUsd(c.revenue) : fmtInt(c.treatments),
        color: CATEGORY_DONUT_COLORS[idx % CATEGORY_DONUT_COLORS.length],
      };
    });
  }, [spa.categories, categoryLens]);

  const performanceByProperty = useMemo(
    () =>
      [...spa.properties]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((p) => ({
          propertyId: p.propertyId,
          property: p.name,
          img: p.img,
          treatments: fmtInt(p.treatments),
          revenue: fmtUsd(p.revenue),
          utilisationPct: Math.round(p.utilisationPct),
          avgTreatment: fmtUsdFull(p.avgTreatment),
        })),
    [spa.properties]
  );

  const facilityUtilization = useMemo(
    () =>
      spa.areas.map((a) => ({
        id: a.id,
        name: a.name,
        pct: Math.round(a.utilisationPct),
      })),
    [spa.areas]
  );

  const retailTopSellers = useMemo(
    () =>
      spa.retail.products.slice(0, 4).map((r) => ({
        name: r.name,
        revenue: fmtUsd(r.revenue),
      })),
    [spa.retail.products]
  );

  const kpiCards = useMemo(
    () => [
      {
        label: 'Total Treatments',
        value: fmtInt(spa.treatments),
        vsLy: `${spa.vsLyTreatmentsPct >= 0 ? '↑' : '↓'} ${Math.abs(Math.round(spa.vsLyTreatmentsPct))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetTreatmentsPct)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastTreatmentsPct)} vs Forecast`,
        positive: spa.vsLyTreatmentsPct >= 0,
        key: 'TOTAL_TREATMENTS',
      },
      {
        label: 'Wellness Revenue',
        value: fmtUsd(spa.revenue),
        vsLy: `${spa.vsLyPct >= 0 ? '↑' : '↓'} ${Math.abs(Math.round(spa.vsLyPct))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetPct)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastPct)} vs Forecast`,
        positive: spa.vsLyPct >= 0,
        key: 'TREATMENT_REVENUE',
      },
      {
        label: 'Avg. Revenue / Treatment',
        value: fmtUsdFull(spa.avgRevenuePerTreatment),
        vsLy: `${spa.vsLyAvgTreatmentPct >= 0 ? '↑' : '↓'} ${Math.max(1, Math.abs(Math.round(spa.vsLyAvgTreatmentPct)))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetAvgTreatmentPct)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastAvgTreatmentPct)} vs Forecast`,
        positive: spa.vsLyAvgTreatmentPct >= 0,
        key: 'AVERAGE_REVENUE',
      },
      {
        label: 'Spa Utilization',
        value: fmtPct(spa.utilisationPct, 0),
        vsLy: `${spa.vsLyUtilisationPts >= 0 ? '↑' : '↓'} ${Math.max(1, Math.abs(Math.round(spa.vsLyUtilisationPts)))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetUtilisationPts)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastUtilisationPts)} vs Forecast`,
        positive: spa.vsLyUtilisationPts >= 0,
        key: 'SPA_UTILIZATION',
      },
      {
        label: 'Total Therapist Hours',
        value: fmtInt(spa.hours),
        vsLy: `${spa.vsLyHoursPct >= 0 ? '↑' : '↓'} ${Math.abs(Math.round(spa.vsLyHoursPct))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetHoursPct)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastHoursPct)} vs Forecast`,
        positive: spa.vsLyHoursPct >= 0,
        key: 'THERAPIST_HOURS',
      },
      {
        label: 'Retail Revenue',
        value: fmtUsd(spa.retail.revenue),
        vsLy: `${spa.vsLyRetailPct >= 0 ? '↑' : '↓'} ${Math.abs(Math.round(spa.vsLyRetailPct))}% vs LY`,
        vsBudget: `${fmtSignedPct(spa.vsBudgetRetailPct)} vs Budget`,
        vsForecast: `${fmtSignedPct(spa.vsForecastRetailPct)} vs Forecast`,
        positive: spa.vsLyRetailPct >= 0,
        key: 'RETAIL_REVENUE',
      },
    ],
    [spa]
  );

  const totalCatDonut = categoryDonutItems.reduce((a, b) => a + b.rawVal, 0) || 1;
  let catAccumulated = 0;

  return (
    <div className="w-full h-full flex flex-col gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">

      {/* Header Widget */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">Sanctuary Wellness</p>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">Welcome to SOSEI Sanctuary Dashboard</h1>
          </div>
          <HeaderClockDisplay />
        </div>

        {/* Period Selector & Export */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <p className="text-[10px] text-zinc-600 font-normal">
            As of <strong className="font-semibold text-zinc-900">{spa.periodLabel}</strong>
            <span className="mx-1.5 text-zinc-300">·</span>
            <span>
              Spa <strong className="font-semibold text-zinc-900">{fmtUsd(spa.spaPillarRevenue)}</strong> + Wellness{' '}
              <strong className="font-semibold text-zinc-900">{fmtUsd(spa.wellnessRevenue)}</strong> ={' '}
              <strong className="font-semibold text-zinc-900">{fmtUsd(spa.revenue)} Total</strong>
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
              {PERIOD_ORDER.filter((pid) => pid !== 'forward').map((id) => {
                const active = horizon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setHorizon(id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                      active ? 'bg-zinc-900 text-white shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {PERIOD_DEFS[id].label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => openDevModal('Export Report')}
              className="h-8.5 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3.5 font-medium flex items-center gap-2 bg-white transition-all shadow-xs cursor-pointer"
            >
              <AltArrowDown size={14} className="rotate-180 text-zinc-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* LAYER 1: 6 KPI Summary Box Cards (each lg:col-span-2) */}
      <div className="grid grid-cols-12 gap-4 items-stretch -mx-3">
        {kpiCards.map((kpi, idx) => (
          <div
            key={kpi.label}
            onClick={() =>
              openDrawer({
                type: 'SPA_DETAIL',
                title: kpi.label,
                data: { key: kpi.key, value: kpi.value, horizon, period: horizon },
              })
            }
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

      {/* LAYER 2: Property Performance (4 cols) + Wellness Revenue by Region (4 cols) + Wellness Revenue by Category (4 cols) */}
      <div className="grid grid-cols-12 gap-4 items-stretch -mx-3">
        {/* Card 1: Property Performance (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Property Performance',
              data: { key: 'PERFORMANCE_BY_PROPERTY', view: 'Property Mix', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[235px] justify-between"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex justify-between items-center mb-2.5 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Property Performance</h3>
            <InfoTooltip text="Treatments completed, spa & wellness revenue, facility utilization, and average ticket by property." />
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5">
            <div className="grid grid-cols-[30%_15%_23%_18%_14%] pb-1.5 border-b border-zinc-100 text-[9px] font-medium text-zinc-400 items-center">
              <div>Property</div>
              <div className="text-right">Treatments</div>
              <div className="text-right whitespace-nowrap">Wellness Revenue</div>
              <div className="text-right pr-1">Utilization</div>
              <div className="text-right">Rev / Treat.</div>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1 gap-1.5">
              {performanceByProperty.map((item) => (
                <div
                  key={item.propertyId}
                  className="grid grid-cols-[30%_15%_23%_18%_14%] items-center text-[9.5px]"
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.property}
                        className="w-5 h-4 rounded-[3px] object-cover border border-zinc-200/70 shrink-0 grayscale-[20%]"
                      />
                    ) : (
                      <div className="w-5 h-4 rounded-[3px] bg-zinc-200 shrink-0" />
                    )}
                    <span className="text-zinc-800 font-medium truncate">{item.property}</span>
                  </div>
                  <div className="text-right text-zinc-600 tabular-nums">{item.treatments}</div>
                  <div className="text-right font-semibold text-zinc-900 tabular-nums">{item.revenue}</div>
                  <div className="flex items-center justify-end gap-1 pr-1">
                    <span className="text-[9px] font-medium text-zinc-700 tabular-nums w-6 text-right">
                      {item.utilisationPct}%
                    </span>
                    <div className="w-8 h-1.5 bg-zinc-100 rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full bg-zinc-800 rounded-full"
                        style={{ width: `${Math.min(100, item.utilisationPct)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-zinc-700 font-medium tabular-nums">{item.avgTreatment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Wellness Revenue by Region (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Wellness Revenue by Region',
              data: { key: 'WELLNESS_REVENUE_BY_REGION', view: 'Regional Mix', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[235px] justify-between"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0 gap-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 whitespace-nowrap">
              Wellness Revenue by Region
            </h3>
            <div
              className="flex items-center bg-zinc-100 p-0.5 rounded-md shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {(['revenue', 'treatments', 'growth'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRegionLens(tab)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    regionLens === tab
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {tab === 'revenue' ? 'Wellness Revenue' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* World Map with Regional Callouts */}
          <div className="relative flex-1 w-full rounded-lg bg-white overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 52, center: [15, 22] }}
              width={380}
              height={175}
              className="w-full h-full pointer-events-none"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#ebecee"
                      stroke="#d4d4d8"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {spa.regions.map((reg) => {
                const cfg = REGION_MAP_COORDS[reg.id];
                if (!cfg) return null;
                return (
                  <Marker key={reg.id} coordinates={cfg.coordinates}>
                    <circle r={5.5} fill="#18181b" fillOpacity={0.18} />
                    <circle r={3} fill="#18181b" stroke="#ffffff" strokeWidth={1} />
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Floating Regional Callouts */}
            {spa.regions.map((reg) => {
              const cfg = REGION_MAP_COORDS[reg.id];
              if (!cfg) return null;
              const positive = reg.vsLyPct >= 0;
              const yoyLabel = `${positive ? '↑' : '↓'} ${Math.abs(Math.round(reg.vsLyPct))}% vs LY`;
              const primaryText =
                regionLens === 'revenue'
                  ? fmtUsd(reg.revenue)
                  : regionLens === 'treatments'
                  ? fmtInt(reg.treatments)
                  : fmtUsd(reg.revenue);
              return (
                <div
                  key={reg.id}
                  className={`absolute ${cfg.labelPos} bg-white/95 backdrop-blur-xs border border-zinc-200/80 rounded-md px-1.5 py-0.5 shadow-2xs pointer-events-none flex flex-col leading-tight`}
                >
                  <span className="text-[7.5px] font-medium text-zinc-500">{reg.name}</span>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-[9px] font-bold text-zinc-900 tabular-nums">{primaryText}</span>
                    <span
                      className={`text-[7.5px] font-semibold tabular-nums ${
                        positive ? 'text-[#14532d]' : 'text-[#800020]'
                      }`}
                    >
                      {yoyLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Wellness Revenue by Category (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Wellness Revenue by Category',
              data: { key: 'REVENUE_BY_CATEGORY', view: 'Revenue Mix', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[235px] justify-between"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0 gap-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 whitespace-nowrap">
              Wellness Revenue by Category
            </h3>
            <div
              className="flex items-center bg-zinc-100 p-0.5 rounded-md shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {(['revenue', 'treatments'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCategoryLens(tab)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    categoryLens === tab
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {tab === 'revenue' ? 'Wellness Revenue' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between gap-3 py-1">
            {/* Pure SVG Vector Donut Chart (size=110, strokeWidth=14 per AGENTS.md) */}
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: 110, height: 110 }}>
              <svg width={110} height={110} viewBox="0 0 110 110" className="transform -rotate-90">
                {categoryDonutItems.map((item, index) => {
                  const r = (110 - 14) / 2;
                  const c = 2 * Math.PI * r;
                  const strokeLength = (item.rawVal / totalCatDonut) * c;
                  const strokeOffset = -(catAccumulated / totalCatDonut) * c;
                  catAccumulated += item.rawVal;
                  const isHovered = hoveredCatIdx === index;

                  return (
                    <circle
                      key={item.id}
                      cx={55}
                      cy={55}
                      r={r}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={isHovered ? 16 : 14}
                      strokeDasharray={`${Math.max(0, strokeLength - 1.4)} ${c}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-300"
                      style={{
                        opacity: hoveredCatIdx === null || isHovered ? 1 : 0.45,
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                <span className="text-[13px] font-bold text-zinc-900 leading-none tabular-nums">
                  {categoryLens === 'revenue' ? fmtUsd(spa.revenue) : fmtInt(spa.treatments)}
                </span>
                <span className="text-[7px] text-zinc-500 font-medium mt-0.5 leading-tight">
                  {categoryLens === 'revenue' ? 'Wellness Revenue' : 'Treatments'}
                </span>
                <span className="text-[7.5px] font-semibold text-[#14532d] mt-0.5">
                  ↑ {Math.abs(Math.round(categoryLens === 'revenue' ? spa.vsLyPct : spa.vsLyTreatmentsPct))}% vs LY
                </span>
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="flex flex-col justify-between flex-1 min-w-0 gap-1">
              <div className="flex items-center justify-between text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100 px-1">
                <span>Category</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-right">
                    {categoryLens === 'revenue' ? 'Wellness Rev.' : 'Treatments'}
                  </span>
                  <span className="w-7 text-right">Share</span>
                </div>
              </div>
              {categoryDonutItems.map((item, idx) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCatIdx(idx)}
                  onMouseLeave={() => setHoveredCatIdx(null)}
                  className="flex items-center justify-between text-[9.5px] py-0.5 rounded px-1 hover:bg-zinc-100/80 transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-zinc-700 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1 tabular-nums">
                    <span className="text-zinc-500 text-[8.5px]">{item.displayVal}</span>
                    <span className="font-bold text-zinc-900 w-7 text-right">{item.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Utilization Trend (4 cols) + Top Treatments (4 cols) + Facility Utilization (4 cols) */}
      <div className="grid grid-cols-12 gap-4 items-stretch -mx-3">
        {/* Card 1: Utilization Trend (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Utilization Trend',
              data: { key: 'UTILIZATION_OVER_TIME', view: 'Trend Chart', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.35s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Utilization Trend</h3>
            <div className="flex items-center gap-2.5 text-[8.5px] text-zinc-500">
              <span className="flex items-center gap-1 font-medium text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-zinc-900 inline-block" />
                This Year
              </span>
              <span className="flex items-center gap-1 font-medium text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
                Last Year
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-white font-bold text-[8.5px] tabular-nums">
                {fmtPct(spa.utilisationPct, 0)}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-[145px] pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spa.monthlyTrend} margin={{ top: 8, right: 8, left: -26, bottom: -5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis
                  domain={[20, 100]}
                  stroke="#a1a1aa"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  ticks={[20, 40, 60, 80, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value}%`,
                    name === 'thisYear' ? 'This Year' : 'Last Year',
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e4e4e7',
                    fontSize: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  stroke="#a1a1aa"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={{ r: 2, fill: '#a1a1aa' }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#18181b' }}
                  activeDot={{ r: 4.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Top Treatments (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Top Treatments',
              data: { key: 'TOP_TREATMENTS_DETAIL', view: 'Treatments', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0 gap-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 truncate">
              Top Treatments
            </h3>
            <div
              className="flex items-center bg-zinc-100 p-0.5 rounded-md shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {(['treatments', 'revenue'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTreatmentLens(tab)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    treatmentLens === tab
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {tab === 'revenue' ? 'Wellness Revenue' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 py-0.5 gap-1.5">
            <div className="grid grid-cols-[52%_26%_22%] items-center text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100 gap-1">
              <span>Treatment</span>
              <span>Volume Mix</span>
              <span className="text-right whitespace-nowrap">
                {treatmentLens === 'treatments' ? 'Treatments' : 'Wellness Rev.'}
              </span>
            </div>
            {topTreatments.map((t) => (
              <div key={t.name} className="grid grid-cols-[52%_26%_22%] items-center text-[10px] gap-1">
                <span className="text-zinc-700 font-medium truncate pr-1">{t.name}</span>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-800 rounded-full transition-all duration-300"
                    style={{ width: `${t.barPct}%` }}
                  />
                </div>
                <span className="font-bold text-zinc-900 text-right tabular-nums">
                  {treatmentLens === 'treatments' ? t.countDisplay : t.revenueDisplay}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Facility Utilization (4 cols = exact width of 2 KPI cards above) */}
        <div
          onClick={() =>
            openDrawer({
              type: 'SPA_DETAIL',
              title: 'Facility Utilization',
              data: { key: 'SPA_UTILIZATION', view: 'Area Breakdown', horizon, period: horizon },
            })
          }
          className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.45s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              Facility Utilization
            </h3>
            <InfoTooltip text="Capacity utilization across functional wellness and treatment zones." />
          </div>

          <div className="flex flex-col justify-between flex-1 py-0.5 gap-1.5">
            <div className="flex items-center justify-between text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
              <span className="w-34">Facility Zone</span>
              <span className="flex-1 mx-2">Capacity Load</span>
              <span className="w-12 text-right">Utilization</span>
            </div>
            {facilityUtilization.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-700 font-medium w-34 truncate">{item.name}</span>
                <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-800 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  />
                </div>
                <span className="font-bold text-zinc-900 w-12 text-right tabular-nums">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYER 4: Existing Row — 4 Cards (3 cols each) */}
      <div className="grid grid-cols-12 gap-4 items-stretch -mx-3">
        {/* Card 1: Guest Wellness Insights (3 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Guest Wellness Insights', data: { key: 'GUEST_WELLNESS_INSIGHTS', view: 'Insights', horizon, period: horizon } })}
          className="col-span-12 md:col-span-6 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex justify-between items-center mb-3 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Guest Wellness Insights</h3>
            <InfoTooltip text="Behavioral correlations and booking tendencies." />
          </div>

          <div className="flex flex-col justify-between flex-1 py-1 gap-2 text-[10px]">
            <div className="border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0">
              <p className="text-zinc-600 leading-snug">
                Spa &amp; wellness guests represent <strong className="text-zinc-900 font-semibold">{fmtPct(spa.attachmentPct, 0)}</strong> of resort stays ({fmtInt(spa.spaGuests)} guests).
              </p>
            </div>
            <div className="border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0">
              <p className="text-zinc-600 leading-snug">
                Guests staying <strong className="text-zinc-900 font-semibold">3+ nights</strong> are <strong className="text-zinc-900 font-semibold">2.3x</strong> more likely to book multiple spa rituals.
              </p>
            </div>
            <div className="border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0">
              <p className="text-zinc-600 leading-snug">
                Peak hours (<strong className="text-zinc-900 font-semibold">{spa.heatmap.peakBlockWindow}</strong>) generate <strong className="text-zinc-900 font-semibold">{fmtPct(spa.heatmap.peakBlockSharePct, 0)}</strong> of daily treatment volume.
              </p>
            </div>
            <div>
              <p className="text-zinc-600 leading-snug">
                Forward 90-day OTB spa revenue stands at <strong className="text-zinc-900 font-semibold">{fmtUsd(spa.forwardCoverage.otbRevenue)}</strong> ({fmtPct(spa.forwardCoverage.coveragePct, 0)} of forecast).
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Membership & Packages (3 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Membership & Packages', data: { key: 'MEMBERSHIP_REPORT', view: 'Packages', horizon, period: horizon } })}
          className="col-span-12 md:col-span-6 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.55s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Membership &amp; Packages</h3>
            <InfoTooltip text="Wellness subscriptions and course package sales." />
          </div>

          <div className="flex flex-col justify-between flex-1 py-0.5 gap-2">
            <div className="flex justify-between items-center text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
              <span>Metric</span>
              <span>Value</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Active Members</span>
              <span className="font-bold text-zinc-900 tabular-nums">{fmtInt(spa.packages.activeMembers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Packages Sold</span>
              <span className="font-bold text-zinc-900 tabular-nums">{fmtInt(spa.packages.sold)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Package Revenue</span>
              <span className="font-bold text-zinc-900 tabular-nums">{fmtUsd(spa.packages.revenue)}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Retail Top Sellers (3 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Retail Top Sellers', data: { key: 'RETAIL_REVENUE', view: 'Retail', horizon, period: horizon } })}
          className="col-span-12 md:col-span-6 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Retail Top Sellers</h3>
            <InfoTooltip text="Highest grossing take-home wellness products." />
          </div>

          <div className="flex flex-col justify-between flex-1 py-0.5 gap-1.5">
            <div className="flex justify-between items-center text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
              <span>Product</span>
              <span>Retail Revenue</span>
            </div>
            {retailTopSellers.map(item => (
              <div key={item.name} className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-700 font-medium truncate pr-1">{item.name}</span>
                <span className="font-bold text-zinc-900 shrink-0 tabular-nums">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Wellness Experience Index (3 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Wellness Experience Index', data: { key: 'WELLNESS_EXPERIENCE_INDEX', view: 'Satisfaction', horizon, period: horizon } })}
          className="col-span-12 md:col-span-6 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[215px] justify-between"
          style={{ animationDelay: '0.65s' }}
        >
          <div className="flex justify-between items-center mb-2 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Wellness Experience Index</h3>
            <InfoTooltip text="Average guest satisfaction rating across all treatments." />
          </div>

          <div className="flex-1 flex items-center justify-between gap-2.5 py-1">
            {/* Pure SVG Vector Donut Chart (size=110, strokeWidth=14 — matching all other donut charts) */}
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: 110, height: 110 }}>
              <svg width={110} height={110} viewBox="0 0 110 110" className="transform -rotate-90">
                {(() => {
                  const totalExp = spa.experience.subs.reduce((acc, s) => acc + s.value, 0) || 1;
                  let expAccum = 0;
                  return spa.experience.subs.map((sub, index) => {
                    const r = (110 - 14) / 2;
                    const c = 2 * Math.PI * r;
                    const strokeLength = (sub.value / totalExp) * c;
                    const strokeOffset = -(expAccum / totalExp) * c;
                    expAccum += sub.value;
                    const isHovered = hoveredExpIdx === index;
                    const color = CATEGORY_DONUT_COLORS[index % CATEGORY_DONUT_COLORS.length];

                    return (
                      <circle
                        key={sub.id}
                        cx={55}
                        cy={55}
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={isHovered ? 16 : 14}
                        strokeDasharray={`${Math.max(0, strokeLength - 1.4)} ${c}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-300"
                        style={{
                          opacity: hoveredExpIdx === null || isHovered ? 1 : 0.45,
                        }}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                <span className="text-[13px] font-bold text-zinc-900 leading-none tabular-nums">
                  {spa.experience.score.toFixed(1)} <span className="text-[9px] font-medium text-zinc-400">/ 5</span>
                </span>
                <span className="text-[7px] text-zinc-500 font-medium mt-0.5 leading-tight">
                  Experience Index
                </span>
                <span className="text-[7.5px] font-semibold text-[#14532d] mt-0.5">
                  ↑ 2% vs LY
                </span>
              </div>
            </div>

            {/* Sub-ratings with color dots & hover synchronization */}
            <div className="flex flex-col justify-between flex-1 min-w-0 gap-1 text-[9.5px]">
              <div className="flex items-center justify-between text-[9px] font-medium text-zinc-400 pb-1 border-b border-zinc-100 px-1">
                <span>Dimension</span>
                <span className="text-right">Score</span>
              </div>
              {spa.experience.subs.map((sub, idx) => {
                const color = CATEGORY_DONUT_COLORS[idx % CATEGORY_DONUT_COLORS.length];
                return (
                  <div
                    key={sub.id}
                    onMouseEnter={() => setHoveredExpIdx(idx)}
                    onMouseLeave={() => setHoveredExpIdx(null)}
                    className="flex items-center justify-between py-0.5 rounded px-1 hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-zinc-700 font-medium truncate">{sub.label}</span>
                    </div>
                    <span className="font-bold text-zinc-900 shrink-0 ml-1 tabular-nums">
                      {sub.value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Under Development Modal */}
      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName={devFeatureName}
      />

    </div>
  );
}
