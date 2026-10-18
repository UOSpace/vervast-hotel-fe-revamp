import React, { useState, useMemo } from 'react';
import { AreaChart, Area, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RoundAltArrowDown, RoundAltArrowRight } from '@solar-icons/react';
import {
  getBookingPaceData,
  getSimulatedPropertiesData,
  type BookingPaceWindow,
} from '../../services/propertySimulation';
import { MASTER_CATEGORIES } from '@/constants/categories';
import { getForwardBusiness, getForwardDateRange } from '@/data/portfolio/hospitalityMix';
import { fmtUsd, fmtUsdFull, fmtPct, fmtSignedPct, PERIOD_DEFS } from '@/data/portfolio';

const PACE_WINDOWS: { id: BookingPaceWindow; label: string; cadenceLabel: string }[] = [
  { id: 7, label: '7D', cadenceLabel: 'Daily Cadence' },
  { id: 14, label: '14D', cadenceLabel: '2-Day Cadence' },
  { id: 30, label: '30D', cadenceLabel: 'Weekly Cadence (Week 1–4)' },
  { id: 90, label: '90D', cadenceLabel: 'Bi-Weekly Cadence' },
];

interface BookingPaceDrawerContentProps {
  theme?: string;
  config?: {
    title?: string;
    data?: any;
  };
}

export function BookingPaceDrawerContent({ theme, config }: BookingPaceDrawerContentProps) {
  const propertyIds: string[] | undefined = config?.data?.propertyIds;
  const [windowDays, setWindowDays] = useState<BookingPaceWindow>(config?.data?.windowDays || 90);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { series, summary } = getBookingPaceData(propertyIds, windowDays);
  const properties = getSimulatedPropertiesData('mtd', propertyIds);
  const portfolioFb = getForwardBusiness(propertyIds, windowDays);
  const horizonDateRange = getForwardDateRange(1, windowDays);
  const currentWindowMeta = PACE_WINDOWS.find((w) => w.id === windowDays) || PACE_WINDOWS[3];

  const categoryGroups = useMemo(() => {
    return MASTER_CATEGORIES.map((cat) => {
      const catPropIds = propertyIds
        ? cat.propertyIds.filter((id) => propertyIds.includes(id))
        : cat.propertyIds;
      const catFb = getForwardBusiness(catPropIds, windowDays);
      const props = properties.filter((p) => catPropIds.includes(p.id));
      const rows = props.map((p) => {
        const pFb = getForwardBusiness([p.id], windowDays);
        const revparUsd =
          pFb.window.availableRoomNights > 0
            ? pFb.window.otbRoomRevenue / pFb.window.availableRoomNights
            : 0;
        return {
          prop: p,
          rn: pFb.window.otbRoomsSold,
          occPct: pFb.window.otbOccupancyPct,
          adrUsd: pFb.window.adr,
          revparUsd,
          revUsd: pFb.otbRevenue,
          paceVsLyPct: pFb.paceVsLyPct,
        };
      });

      const catRevparUsd =
        catFb.window.availableRoomNights > 0
          ? catFb.window.otbRoomRevenue / catFb.window.availableRoomNights
          : 0;

      return {
        id: cat.id,
        name: cat.name,
        location: props.map((p) => p.city).join(' · '),
        rn: catFb.window.otbRoomsSold,
        occPct: catFb.window.otbOccupancyPct,
        adrUsd: catFb.window.adr,
        revparUsd: catRevparUsd,
        revUsd: catFb.otbRevenue,
        paceVsLyPct: catFb.paceVsLyPct,
        rows,
      };
    }).filter((g) => g.rows.length > 0);
  }, [propertyIds, windowDays, properties]);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Header & Horizon Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <p className="text-[11px] text-zinc-900 font-medium">
          As of: {PERIOD_DEFS.mtd.periodLabel} · Forward Window:{' '}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {horizonDateRange} ({windowDays} Days)
          </span>
        </p>

        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/80 dark:border-zinc-700 self-start sm:self-auto shrink-0">
          {PACE_WINDOWS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setWindowDays(h.id)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                windowDays === h.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Hero Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Pace vs LY</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.paceVsLy}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.paceVsBudget}
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Room Nights OTB ({windowDays}D)</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.roomNightsOtb}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.roomNightsTrend} vs LY
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Revenue OTB ({windowDays}D)</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.revenueOtb}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.revenueTrend} vs LY
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Velocity Pickups</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.pickup7d} (7d)</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.pickup30d} past 30 days
          </span>
        </div>
      </div>

      {/* Pacing Chart with Explicit Timeframe Header & Interval Breakdown */}
      <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Booking Velocity Curve — Next {windowDays} Days
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9.5px] font-semibold border border-zinc-200/80 dark:border-zinc-700">
                {horizonDateRange} · {currentWindowMeta.cadenceLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[9.5px]">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              <span className="w-2.5 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              <span>This Year OTB ({summary.roomNightsOtb} RN)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 whitespace-nowrap">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-400" />
              <span>Same Point Last Year (STLY)</span>
            </div>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 18, left: -8, bottom: 5 }}>
              <defs>
                <linearGradient id="drawerPaceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis
                dataKey="month"
                interval={0}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9.5, fill: '#52525b', fontWeight: 500 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#a1a1aa' }}
                tickFormatter={(v) => (v === 0 ? '0' : v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v))}
                width={38}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#fafafa' : '#09090b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                labelFormatter={(_label, payload) => {
                  const pt = payload?.[0]?.payload;
                  return pt ? `${pt.month} (${pt.days} ${pt.days === 1 ? 'Day' : 'Days'}: ${pt.range})` : String(_label);
                }}
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString()} room nights`,
                  name === 'thisYear' ? 'This Year OTB' : 'Last Year STLY',
                ]}
              />
              <Area
                type="monotone"
                dataKey="thisYear"
                stroke={theme === 'dark' ? '#fafafa' : '#18181b'}
                strokeWidth={2}
                fill="url(#drawerPaceGradient)"
                dot={{ r: 3.5, fill: theme === 'dark' ? '#fafafa' : '#18181b', stroke: '#fff', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke="#a1a1aa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#a1a1aa' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Timeframe Interval Breakdown Strip */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {series.map((pt) => {
            const pacePct = pt.lastYear > 0 ? ((pt.thisYear - pt.lastYear) / pt.lastYear) * 100 : 0;
            return (
              <div
                key={pt.month}
                className="px-2.5 py-2 rounded-lg bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
              >
                <div className="text-[9.5px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  {pt.month}
                </div>
                <div className="text-[8.5px] text-zinc-400 truncate">
                  {pt.range}
                </div>
                <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {pt.thisYear.toLocaleString()} RN
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5 text-[8.5px]">
                  <span className="text-zinc-400">LY: {pt.lastYear.toLocaleString()}</span>
                  <span className={pacePct >= 0 ? 'text-[#14532d] font-semibold' : 'text-[#800020] font-semibold'}>
                    {pacePct >= 0 ? '↑' : '↓'} {fmtSignedPct(pacePct)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Categories Booking Pace Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Property Categories Booking Pace Breakdown ({windowDays}D · {horizonDateRange})
          </h5>
          <span className="text-[9.5px] text-zinc-400">
            Click categories row to expand individual properties
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full min-w-[740px] text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-400 bg-zinc-50/90 dark:bg-zinc-800/90">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Categories</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Room Nights OTB</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy OTB</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Revenue OTB</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Pace vs LY</th>
              </tr>
            </thead>
            <tbody>
              {categoryGroups.map((g) => {
                const isExpanded = !!expandedRows[g.id];
                return (
                  <React.Fragment key={g.id}>
                    <tr
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [g.id]: !prev[g.id],
                        }))
                      }
                    >
                      <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          {isExpanded ? (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {g.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {g.location}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {g.rn.toLocaleString()} RN
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-700 font-semibold border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {fmtPct(g.occPct, 1)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {fmtUsdFull(g.adrUsd)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {fmtUsdFull(g.revparUsd)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        {fmtUsd(g.revUsd)}
                      </td>
                      <td className="py-3 px-3 text-right border-b border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                            g.paceVsLyPct >= 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                        >
                          {g.paceVsLyPct >= 0 ? '↑' : '↓'} {fmtSignedPct(g.paceVsLyPct)}
                        </span>
                      </td>
                    </tr>
                    {isExpanded &&
                      g.rows.map(({ prop, rn, occPct, adrUsd, revparUsd, revUsd, paceVsLyPct }) => (
                        <tr
                          key={prop.id}
                          className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400"
                        >
                          <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            <span className="text-zinc-300 mr-1.5">└</span>
                            {prop.name}
                          </td>
                          <td className="py-2.5 px-3 text-[10px] text-zinc-400 border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {prop.city}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {rn.toLocaleString()} RN
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-emerald-700 font-medium border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {fmtPct(occPct, 1)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {fmtUsdFull(adrUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {fmtUsdFull(revparUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            {fmtUsd(revUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10px] border-b border-zinc-100/60 dark:border-zinc-800/60 whitespace-nowrap">
                            <span className={pacePctColor(paceVsLyPct)}>
                              {paceVsLyPct >= 0 ? '↑' : '↓'} {fmtSignedPct(paceVsLyPct)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">{properties.length} Properties · 5 Categories</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                  {portfolioFb.window.otbRoomsSold.toLocaleString()} RN
                </td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">
                  {fmtPct(portfolioFb.window.otbOccupancyPct, 1)}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                  {fmtUsdFull(portfolioFb.window.adr)}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                  {fmtUsdFull(
                    portfolioFb.window.availableRoomNights > 0
                      ? portfolioFb.window.otbRoomRevenue / portfolioFb.window.availableRoomNights
                      : 0
                  )}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                  {fmtUsd(portfolioFb.otbRevenue)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">
                  ↑ {fmtSignedPct(portfolioFb.paceVsLyPct)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function pacePctColor(val: number): string {
  return val >= 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium';
}
