import { useState, useMemo } from 'react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  Bag,
  Heart,
  Settings,
  UsersGroupTwoRounded,
  Star,
  AltArrowDown
} from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { PERIOD_DEFS, PERIOD_ORDER, fmtUsd, fmtUsdFull, fmtInt, fmtPct, type PeriodId } from '@/data/portfolio';
import { getSpaDashboardData } from '@/data/portfolio/spaMix';

const AREA_COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa'];

export function SpaDashboardPage() {
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const { openDrawer } = useDashboardDrawer();
  const [showDevModal, setShowDevModal] = useState(false);
  const [devFeatureName, setDevFeatureName] = useState<string | undefined>(undefined);

  const openDevModal = (name?: string) => {
    setDevFeatureName(name);
    setShowDevModal(true);
  };

  const spa = useMemo(() => getSpaDashboardData(undefined, horizon), [horizon]);

  const utilizationOverTime = spa.trend;
  const utilizationByArea = useMemo(
    () =>
      spa.areas.map((a, idx) => ({
        name: a.name,
        value: Math.round(a.utilisationPct),
        color: AREA_COLORS[idx % AREA_COLORS.length],
      })),
    [spa.areas]
  );

  const scheduleOverview = useMemo(
    () =>
      spa.pipeline.rows.map((r) => ({
        name: r.name,
        value: r.value,
        total: Math.max(1, spa.pipeline.total),
      })),
    [spa.pipeline]
  );

  const topTreatments = useMemo(
    () =>
      spa.treatmentsRanked.slice(0, 5).map((t) => ({
        name: t.name,
        count: fmtInt(t.treatments),
      })),
    [spa.treatmentsRanked]
  );

  const revenueByCategory = useMemo(
    () =>
      spa.categories.slice(0, 5).map((c) => ({
        name: c.name,
        value: Math.round(c.revenueSharePct),
      })),
    [spa.categories]
  );

  const performanceByProperty = useMemo(
    () =>
      [...spa.properties]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((p) => ({
          property: p.name,
          treatments: fmtInt(p.treatments),
          revenue: fmtUsd(p.revenue),
          share: `${Math.round(p.sharePct)}%`,
        })),
    [spa.properties]
  );

  const upcomingPeakTimes = useMemo(
    () =>
      spa.peaks.map((pk) => ({
        day: pk.dateLabel,
        time: pk.window,
        level: pk.level,
      })),
    [spa.peaks]
  );

  const retailTopSellers = useMemo(
    () =>
      spa.retail.products.slice(0, 4).map((r) => ({
        name: r.name,
        revenue: fmtUsd(r.revenue),
      })),
    [spa.retail.products]
  );

  const heatmapDays = spa.heatmap.days;
  const heatmapTimes = spa.heatmap.blocks.map((b) => b.label);
  const heatmapData = spa.heatmap.cells.map((row) => row.map((c) => c.level));

  const totalAreaValue = utilizationByArea.reduce((acc, curr) => acc + curr.value, 0) || 1;
  let areaAccumulated = 0;

  return (
    <div className="w-full h-full flex flex-col gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">

      {/* Header Widget */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 lg:pt-6 animate-card-enter">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">Sanctuary Wellness</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">Welcome to SOSEI Sanctuary Dashboard</h1>
          <p className="text-[10px] text-zinc-900 font-normal mt-0.5">
            As of: <strong className="font-semibold text-zinc-900">{spa.periodLabel}</strong>
          </p>
        </div>

        {/* Period Selector & Export */}
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

      {/* LAYER 1: KPI Top Bar (5 cols Left + 7 cols Right) */}
      <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
        {/* Left (5 cols): 2 Cards */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3">
          {[
            { label: 'TOTAL TREATMENTS', value: fmtInt(spa.treatments), key: 'TOTAL_TREATMENTS' },
            { label: 'SPA & WELLNESS REVENUE', value: fmtUsd(spa.revenue), key: 'TREATMENT_REVENUE' },
          ].map((kpi, idx) => (
            <div
              key={kpi.label}
              onClick={() => openDrawer({ type: 'SPA_DETAIL', title: kpi.label, data: { key: kpi.key, value: kpi.value, horizon, period: horizon } })}
              className="relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[90px]"
              style={{ animationDelay: `${0.05 + idx * 0.03}s` }}
            >
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                {kpi.label}
              </span>
              <h3 className="text-[22px] font-normal text-zinc-900 leading-none mt-auto">
                {kpi.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Right (7 cols): 4 Cards */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'AVG REVENUE / TREATMENT', value: fmtUsdFull(spa.avgRevenuePerTreatment), key: 'AVERAGE_REVENUE' },
            { label: 'SPA UTILIZATION', value: fmtPct(spa.utilisationPct, 0), key: 'SPA_UTILIZATION' },
            { label: 'TOTAL THERAPIST HOURS', value: fmtInt(spa.hours), key: 'THERAPIST_HOURS' },
            { label: 'RETAIL REVENUE', value: fmtUsd(spa.retail.revenue), key: 'RETAIL_REVENUE' },
          ].map((kpi, idx) => (
            <div
              key={kpi.label}
              onClick={() => openDrawer({ type: 'SPA_DETAIL', title: kpi.label, data: { key: kpi.key, value: kpi.value, horizon, period: horizon } })}
              className="relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[90px]"
              style={{ animationDelay: `${0.1 + idx * 0.03}s` }}
            >
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                {kpi.label}
              </span>
              <h3 className="text-[22px] font-normal text-zinc-900 leading-none mt-auto">
                {kpi.value}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* LAYER 2: Utilization Heatmap (5 cols) + [Utilization Over Time (3.5 cols) & Utilization by Area (3.5 cols) in 7 cols] */}
      <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
        {/* Left: Utilization by Time of Day Heatmap (5 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization by Time of Day', data: { key: 'UTILIZATION_BY_TIME', view: 'Heatmap', horizon, period: horizon } })}
          className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex justify-between items-center mb-3 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Utilization by Time</h3>
            <InfoTooltip text="Peak booking heat across operating hours." />
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5">
            {/* Column labels */}
            <div className="grid grid-cols-[24px_repeat(6,1fr)] gap-1 text-[7.5px] text-zinc-400 text-center font-medium">
              <span>Day</span>
              {heatmapTimes.map(t => <span key={t}>{t}</span>)}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-0.5 my-auto">
              {heatmapDays.map((day, dIdx) => (
                <div key={day} className="grid grid-cols-[24px_repeat(6,1fr)] gap-1 items-center">
                  <span className="text-[8px] font-medium text-zinc-500">{day}</span>
                  {heatmapData[dIdx].map((val, tIdx) => {
                    const getBg = (v: number) => {
                      if (v === 1) return 'bg-zinc-100';
                      if (v === 2) return 'bg-zinc-200';
                      if (v === 3) return 'bg-zinc-400';
                      if (v === 4) return 'bg-zinc-600';
                      return 'bg-zinc-900';
                    };
                    const allCells = spa.heatmap.cells.flat();
                    const avgShare = allCells.reduce((a, c) => a + c.sharePct, 0) / Math.max(1, allCells.length);
                    const cellShare = spa.heatmap.cells[dIdx][tIdx].sharePct;
                    const utilPct = Math.min(99, Math.round(avgShare > 0 ? (spa.utilisationPct * cellShare) / avgShare : 0));
                    return (
                      <div
                        key={tIdx}
                        className={`h-4 rounded-[3px] flex items-center justify-center text-[8px] leading-none font-medium tabular-nums ${getBg(val)} ${val >= 3 ? 'text-white' : 'text-zinc-700'} transition-colors`}
                      >
                        {utilPct}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center text-[7.5px] text-zinc-400 mt-1 px-0.5">
              <span>Low Utilization</span>
              <div className="flex gap-0.5 items-center">
                <span className="w-2 h-1 rounded-xs bg-zinc-100" />
                <span className="w-2 h-1 rounded-xs bg-zinc-300" />
                <span className="w-2 h-1 rounded-xs bg-zinc-600" />
                <span className="w-2 h-1 rounded-xs bg-zinc-900" />
              </div>
              <span>High Utilization</span>
            </div>
          </div>
        </div>

        {/* Right (7 cols container): 2 Cards */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sub-card 1: Utilization Over Time (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization Over Time', data: { key: 'UTILIZATION_OVER_TIME', view: 'Trend Chart', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.25s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Utilization Over Time</h3>
              <span className="text-[9px] font-medium text-zinc-400">
                {PERIOD_DEFS[horizon].label}: {fmtPct(spa.utilisationPct, 0)}
              </span>
            </div>

            <div className="flex-1 w-full h-[140px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={utilizationOverTime} margin={{ top: 8, right: 10, left: -28, bottom: -5 }}>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} ticks={[0, 20, 40, 60, 80, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', fontSize: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} dot={{ r: 3, fill: '#18181b' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sub-card 2: Utilization by Area (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization by Area', data: { key: 'SPA_UTILIZATION', view: 'Area Breakdown', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Utilization by Area</h3>
              <InfoTooltip text="Capacity load by functional wellness zone." />
            </div>

            <div className="flex-1 flex items-center justify-between py-1 gap-2">
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 88, height: 88 }}>
                <svg width={88} height={88} viewBox="0 0 88 88" className="transform -rotate-90">
                  {utilizationByArea.map((item, index) => {
                    const r = (88 - 11) / 2;
                    const c = 2 * Math.PI * r;
                    const strokeLength = (item.value / totalAreaValue) * c;
                    const strokeOffset = -(areaAccumulated / totalAreaValue) * c;
                    areaAccumulated += item.value;

                    return (
                      <circle
                        key={index}
                        cx={44}
                        cy={44}
                        r={r}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={11}
                        strokeDasharray={`${Math.max(0, strokeLength - 1.2)} ${c}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-sm font-bold text-zinc-900 leading-none">{fmtPct(spa.utilisationPct, 0)}</span>
                  <span className="text-[7.5px] text-zinc-500 font-medium mt-0.5">Overall Util</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                {utilizationByArea.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-600 font-medium truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-zinc-900 ml-1">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Performance by Property Table (5 cols) + [Top Treatments (3.5 cols) & Revenue by Category (3.5 cols) in 7 cols] */}
      <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
        {/* Left: Performance by Property (5 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Performance by Property', data: { key: 'PERFORMANCE_BY_PROPERTY', view: 'Property Mix', horizon, period: horizon } })}
          className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
          style={{ animationDelay: '0.35s' }}
        >
          <div className="flex justify-between items-center mb-3 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Performance by Property</h3>
            <InfoTooltip text="Treatments completed, spa revenue generated, and share by luxury property." />
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5">
            <div className="grid grid-cols-[38%_20%_24%_18%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
              <div>Property</div>
              <div className="text-right">Treatments</div>
              <div className="text-right">Rev</div>
              <div className="text-right">Share</div>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1 gap-1.5">
              {performanceByProperty.map(item => (
                <div key={item.property} className="grid grid-cols-[38%_20%_24%_18%] items-center text-[10px]">
                  <div className="text-zinc-700 font-medium truncate">{item.property}</div>
                  <div className="text-right text-zinc-500 tabular-nums">{item.treatments}</div>
                  <div className="text-right font-medium text-zinc-900 tabular-nums">{item.revenue}</div>
                  <div className="text-right font-medium text-[#14532d] text-[9.5px] tabular-nums">{item.share}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (7 cols container): 2 Cards */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sub-card 1: Top Treatments (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Top Treatments', data: { key: 'TOP_TREATMENTS_DETAIL', view: 'Treatments', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Top Treatments</h3>
              <InfoTooltip text="Most popular therapies by booking volume." />
            </div>

            <div className="flex flex-col justify-between flex-1 py-1 gap-2">
              {topTreatments.map(t => (
                <div key={t.name} className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-700 font-medium truncate pr-1">{t.name}</span>
                  <span className="font-bold text-zinc-900 shrink-0">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-card 2: Revenue by Category (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Revenue by Category', data: { key: 'REVENUE_BY_CATEGORY', view: 'Revenue Mix', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.45s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue by Category</h3>
              <InfoTooltip text="Share of total treatment sales." />
            </div>

            <div className="flex flex-col justify-between flex-1 py-1 gap-2">
              {revenueByCategory.map(item => (
                <div key={item.name} className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-600 w-28 truncate">{item.name}</span>
                  <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="font-bold text-zinc-900 w-8 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 4: Schedule Overview (5 cols) + [Upcoming Peak Times (3.5 cols) & Membership & Packages (3.5 cols) in 7 cols] */}
      <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
        {/* Left: Today's Schedule Overview (5 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Schedule Overview', data: { key: 'SCHEDULE_OVERVIEW', view: 'Appointments', horizon, period: horizon } })}
          className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex justify-between items-center mb-3 h-4 shrink-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Schedule Overview</h3>
            <span className="text-[9px] font-medium text-zinc-400">{PERIOD_DEFS[horizon].label}</span>
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
              <span className="text-zinc-600 font-medium text-[10px]">Total Appointments</span>
              <span className="font-bold text-zinc-900 text-sm">{fmtInt(spa.pipeline.total)}</span>
            </div>

            <div className="flex flex-col gap-2.5 my-auto">
              {scheduleOverview.map(item => (
                <div key={item.name} className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 w-28 truncate">{item.name}</span>
                  <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-zinc-900 w-12 text-right">{fmtInt(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (7 cols container): 2 Cards */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sub-card 1: Upcoming Peak Times (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Upcoming Peak Times', data: { key: 'UPCOMING_PEAK_TIMES', view: 'Forecast', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.55s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Peak Times</h3>
              <InfoTooltip text="Forecasted high-demand appointment windows." />
            </div>

            <div className="flex flex-col justify-between flex-1 py-1 gap-2">
              {upcomingPeakTimes.map(pk => (
                <div key={pk.day} className="flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-900">{pk.day}</div>
                    <div className="text-[9px] text-zinc-400 font-normal">{pk.time}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold tracking-wider ${pk.level === 'HIGH' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                    {pk.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-card 2: Membership & Packages (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Membership & Packages', data: { key: 'MEMBERSHIP_REPORT', view: 'Packages', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Membership & Packages</h3>
              <InfoTooltip text="Wellness subscriptions and course package sales." />
            </div>

            <div className="flex flex-col justify-between flex-1 py-1 gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Active Members</span>
                <span className="font-bold text-zinc-900">{fmtInt(spa.packages.activeMembers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Packages Sold</span>
                <span className="font-bold text-zinc-900">{fmtInt(spa.packages.sold)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Package Revenue</span>
                <span className="font-bold text-zinc-900">{fmtUsd(spa.packages.revenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 5: Guest Insights (5 cols) + [Retail Top Sellers (3.5 cols) & Experience Index (3.5 cols) in 7 cols] */}
      <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
        {/* Left: Guest Wellness Insights (5 cols) */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Guest Wellness Insights', data: { key: 'GUEST_WELLNESS_INSIGHTS', view: 'Insights', horizon, period: horizon } })}
          className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
          style={{ animationDelay: '0.65s' }}
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

        {/* Right (7 cols container): 2 Cards */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sub-card 1: Retail Top Sellers (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Retail Top Sellers', data: { key: 'RETAIL_REVENUE', view: 'Retail', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Retail Top Sellers</h3>
              <InfoTooltip text="Highest grossing take-home wellness products." />
            </div>

            <div className="flex flex-col justify-between flex-1 py-1 gap-2">
              {retailTopSellers.map(item => (
                <div key={item.name} className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-700 font-medium truncate pr-1">{item.name}</span>
                  <span className="font-bold text-zinc-900 shrink-0">{item.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-card 2: Wellness Experience Index (3.5 cols) */}
          <div
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Wellness Experience Index', data: { key: 'WELLNESS_EXPERIENCE_INDEX', view: 'Satisfaction', horizon, period: horizon } })}
            className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[210px] justify-between"
            style={{ animationDelay: '0.75s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Wellness Experience Index</h3>
              <InfoTooltip text="Average guest satisfaction rating across all treatments." />
            </div>

            <div className="flex items-center justify-between flex-1 py-1 gap-3">
              {/* Pure Vector SVG Donut Score Gauge */}
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 68, height: 68 }}>
                <svg width={68} height={68} viewBox="0 0 68 68" className="transform -rotate-90">
                  <circle
                    cx={34}
                    cy={34}
                    r={28}
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth={7}
                  />
                  <circle
                    cx={34}
                    cy={34}
                    r={28}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeDasharray={`${(spa.experience.score / 5) * (2 * Math.PI * 28)} ${2 * Math.PI * 28}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-zinc-900 leading-none">{spa.experience.score.toFixed(1)}</span>
                  <span className="text-[8px] text-zinc-400 font-medium mt-0.5">/ 5</span>
                </div>
              </div>

              {/* Sub-ratings */}
              <div className="flex flex-col gap-1.5 flex-1 text-[9.5px]">
                {spa.experience.subs.map((sub) => (
                  <div key={sub.id} className="flex justify-between">
                    <span className="text-zinc-500 truncate">{sub.label}</span>
                    <span className="font-bold text-zinc-900">{sub.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 6: 5 Bottom Action / Guiding Principle Cards (5 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-card-enter -mx-3" style={{ animationDelay: '0.8s' }}>
        {[
          { label: 'Optimize utilization.', icon: Settings },
          { label: 'Maximize therapist performance.', icon: UsersGroupTwoRounded },
          { label: 'Enhance guest wellbeing.', icon: Heart },
          { label: 'Drive retail & membership growth.', icon: Bag },
          { label: 'Deliver exceptional experiences.', icon: Star },
        ].map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200/80 bg-white/60 p-3 flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                <Icon size={13} className="text-zinc-600" />
              </div>
              <span className="text-[10px] font-medium text-zinc-700 truncate">{pill.label}</span>
            </div>
          );
        })}
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
