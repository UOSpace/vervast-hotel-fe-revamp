import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import { resolvePropertyId } from '@/constants/categories';
import {
  getPropertyMetrics,
  fmtUsd,
  fmtUsdFull,
  fmtInt,
  PERIOD_DEFS,
  type PeriodId,
} from '@/data/portfolio';
import {
  buildRoomTiers,
  buildDepartmentOutlets,
  getPropertyGuestActivity,
  getPropertyHourlyTimeline,
  getPropertyEvents,
  getPropertyGuestSatisfaction,
  fmtTrendArrow,
} from '@/data/portfolio/hospitalitySubMix';

// ── 1. Property Today's Activity Drawer ─────────────────────────────────────
export function PropertyActivityDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const activity = getPropertyGuestActivity(propertyId);
  const todayMetrics = getPropertyMetrics(propertyId, 'today');

  const arrivals = data?.arrivals ?? activity.arrivals;
  const deps = data?.deps ?? activity.departures;
  const inhouse = data?.inhouse ?? activity.inHouse;
  const vip = data?.vip ?? activity.vip;
  const propName = data?.propertyName || todayMetrics.name;
  const location = data?.location || todayMetrics.location;
  const occupiedKeys = Math.round(activity.keysOccupied);

  const arrivalList = [
    { name: 'Lord & Lady Harrington', suite: 'Signature Penthouse 12', time: '14:30', vip: 'Ultra VIP', butler: 'Jean-Paul', notes: 'Private luxury transfer, vintage Krug in suite' },
    { name: 'Ambassador Philippe Chen', suite: 'Signature Suite 402', time: '15:15', vip: 'Diplomatic', butler: 'Marc', notes: 'High-security discreet entrance, diplomatic escort' },
    { name: 'Dr. & Mrs. Kenji Sato', suite: 'Reserve Villa 204', time: '16:00', vip: 'Privilege Member', butler: 'Sophie', notes: 'Anniversary celebration, custom thermal bath' },
    { name: 'Countess Beatrix Von Berg', suite: 'Panorama Suite 308', time: '17:30', vip: 'VVIP Returning', butler: 'Jean-Paul', notes: 'Gluten-free bespoke menu, private view terrace' },
    { name: 'Mr. David Sterling', suite: 'Estate Pavilion 08', time: '18:15', vip: 'Executive Member', butler: 'Marc', notes: 'Private sommelier tasting scheduled at 19:00' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{propName}</h4>
          <p className="text-[10px] text-zinc-500">{location} · Real-time operational guest manifest for today</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          All Guest Services Active
        </span>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Scheduled Arrivals</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{arrivals} Guests</div>
          <span className="text-[9.5px] text-zinc-400 mt-0.5 block">{activity.pendingCheckIn} Pending Check-in</span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Departures</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{deps} Guests</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">{activity.cleared} Completed Cleared</span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Total In-House</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{inhouse} Guests</div>
          <span className="text-[9.5px] text-zinc-400 mt-0.5 block">Occupying {occupiedKeys} / {todayMetrics.rooms} Keys</span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">VIP & VVIP Roster</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{vip} VIPs</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">100% Butler Assigned</span>
        </div>
      </div>

      {/* Arrivals Schedule Table */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Today's Key Arrivals & Butler Assignments
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Guest Name</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Suite Assigned</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">ETA</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Tier</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Butler</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Special Notes</th>
              </tr>
            </thead>
            <tbody>
              {arrivalList.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</td>
                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400 font-medium">{item.suite}</td>
                  <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100 font-bold">{item.time}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {item.vip}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 font-medium">{item.butler}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 2. Property Rhythm & Peak Load Schedule Drawer ──────────────────────────
export function PropertyRhythmDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const todayMetrics = getPropertyMetrics(propertyId, 'today');
  const propName = data?.propertyName || todayMetrics.name;
  const period: PeriodId = data?.period || 'mtd';
  const hourlyTimeline = getPropertyHourlyTimeline(propertyId, period);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{propName}</h4>
          <p className="text-[10px] text-zinc-500">Department operational capacity load and peak hours schedule</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          All Department Operations Normal
        </span>
      </div>

      {/* 24-Hour Schedule & Capacity Load Breakdown */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Daily Operational Windows &amp; Capacity Breakdown (Active Demand ÷ Total Capacity)
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Peak Window</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Department / Activity</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Active Demand</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Total Capacity</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Capacity Load</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 pl-5">Staff Deployed</th>
                <th className="py-2.5 px-3 text-center font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Operating Status</th>
              </tr>
            </thead>
            <tbody>
              {hourlyTimeline.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{item.time}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{item.dept}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {item.activeDemand} <span className="text-[10px] font-normal text-zinc-400">{item.unitLabel}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {item.totalCapacity} <span className="text-[10px] font-normal text-zinc-400">Max</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <span>{item.load}%</span>
                      <div className="w-14 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${item.load >= 90 ? 'bg-zinc-900' : item.load >= 80 ? 'bg-zinc-700' : 'bg-zinc-500'}`}
                          style={{ width: `${item.load}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[10.5px] pl-5 whitespace-nowrap">{item.staff}</td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                      item.load >= 90
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : item.load >= 80
                        ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeframe Utilization Breakdown Table (6 AM – 9 PM) */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Utilization Load by Timeframe (6 AM – 9 PM)
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Department / Activity</th>
                {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map((tf) => (
                  <th key={tf} className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">
                    {tf}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Peak Load</th>
              </tr>
            </thead>
            <tbody>
              {hourlyTimeline.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{item.dept}</td>
                  {item.timeframeLoads.map((slotPct, sIdx) => (
                    <td
                      key={sIdx}
                      className={`py-2.5 px-3 text-right tabular-nums whitespace-nowrap ${
                        slotPct >= 88
                          ? 'font-bold text-zinc-900 dark:text-zinc-100'
                          : slotPct >= 72
                          ? 'font-semibold text-zinc-700 dark:text-zinc-300'
                          : 'text-zinc-500'
                      }`}
                    >
                      {slotPct}%
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 tabular-nums whitespace-nowrap">
                    {item.load}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3. Property Room Type Performance Drawer ─────────────────────────────────
export function PropertyRoomTierDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const initialPeriod: 'today' | 'mtd' | 'ytd' =
    data?.period === 'today' || data?.period === 'mtd' || data?.period === 'ytd'
      ? data.period
      : 'mtd';
  const [horizon, setHorizon] = useState<'today' | 'mtd' | 'ytd'>(initialPeriod);

  const m = getPropertyMetrics(propertyId, horizon);
  const propName = data?.propertyName || m.name;

  const tiers = buildRoomTiers(m);
  const totalRoomRev = m.roomRevenue || 1;

  const rows = tiers.map((t) => {
    const revparNum = t.availableRn > 0 ? t.revenue / t.availableRn : 0;
    const revSharePct = Math.round((t.revenue / totalRoomRev) * 100);
    return {
      type: t.name,
      occ: t.occPct.toFixed(1),
      occupied: Math.round(t.occupiedRn / Math.max(1, m.days)),
      available: t.keys,
      adrNum: t.adr,
      adr: fmtUsdFull(t.adr),
      revparNum,
      revpar: fmtUsdFull(revparNum),
      revNum: t.revenue,
      rev: fmtUsd(t.revenue),
      revSharePct,
    };
  });

  const totals = {
    occ: m.occupancyPct.toFixed(1),
    occupied: rows.reduce((sum, r) => sum + r.occupied, 0),
    available: m.rooms,
  };

  const topRevTier = rows.reduce((best, cur) => (cur.revNum > best.revNum ? cur : best), rows[0]);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {propName} · <span className="font-normal text-zinc-500">{m.location}</span>
          </h4>
          <p className="text-[10px] text-zinc-900 mt-0.5">
            Room type revenue contribution, RevPAR, ADR, and occupancy performance · As of:{' '}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {PERIOD_DEFS[horizon].periodLabel}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg">
            {(['today', 'mtd', 'ytd'] as const).map((h) => {
              const isActive = horizon === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Room Revenue: {fmtUsd(m.roomRevenue)}
          </span>
        </div>
      </div>

      {/* 4 Summary Cards ordered: Occupancy, ADR, RevPAR, Revenue (Revenue Focus) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Occupancy</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{totals.occ}%</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            ↑ +{m.vsLy.occupancyPts.toFixed(1)} pts vs LY · {totals.occupied}/{totals.available} Keys
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">ADR (USD)</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsdFull(m.adr)}</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            {fmtTrendArrow(m.vsLy.adrPct)} vs LY · Top {topRevTier.adr}
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">RevPAR (USD)</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsdFull(m.revpar)}</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            {fmtTrendArrow(m.vsLy.revparPct)} vs LY · Yield per Key
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-700">
          <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Room Revenue</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsd(m.roomRevenue)}</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block truncate">
            {fmtTrendArrow(m.vsLy.roomRevenuePct)} vs LY · Lead: {topRevTier.type} ({topRevTier.rev})
          </span>
        </div>
      </div>

      {/* Room Type Performance & Revenue Breakdown Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Room Type Performance &amp; Revenue Breakdown
          </h5>
          <span className="text-[10px] text-zinc-400">Ordered by Revenue Contribution</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Room Type</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Keys (Occ / Total)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Occupancy</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">ADR (USD)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">RevPAR (USD)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200">Revenue (USD)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">% Rev Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.type}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{row.occupied}</span> / {row.available}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200">{row.occ}%</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200">{row.adr}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200">{row.revpar}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center justify-end gap-2">
                      <span>{row.revSharePct}%</span>
                      <div className="w-14 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" style={{ width: `${row.revSharePct}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                <td className="py-3 px-3 text-right text-zinc-800 dark:text-zinc-200">
                  {totals.occupied} / {totals.available}
                </td>
                <td className="py-3 px-3 text-right text-emerald-700">{totals.occ}%</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtUsdFull(m.adr)}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtUsdFull(m.revpar)}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtUsd(m.roomRevenue)}</td>
                <td className="py-3 px-3 text-right text-emerald-700">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 4. Property Department Revenue Drawer ────────────────────────────────────
export function PropertyDepartmentRevenueDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const period: PeriodId = data?.period || 'mtd';
  const m = getPropertyMetrics(propertyId, period);
  const propName = data?.propertyName || m.name;

  const totalRev = m.totalRevenue || 1;
  const roomRev = m.roomRevenue;
  const fnbRev = m.fnbRevenue;
  const spaRev = m.spaRevenue;
  const otherRev = m.experienceRevenue;

  const outletRows = buildDepartmentOutlets(m);
  const deptTrendPct = (dept: string): number => {
    if (dept === 'Rooms') return m.vsLy.roomRevenuePct;
    if (dept === 'F&B') return m.vsLy.fnbRevenuePct;
    if (dept.includes('Spa')) return m.vsLy.spaRevenuePct;
    return m.vsLy.experienceRevenuePct;
  };
  const deptDetail = (dept: string): string => {
    if (dept === 'Rooms') return `${Math.round(m.roomsSold / Math.max(1, m.days))} rooms occupied daily at ${fmtUsdFull(m.adr)} ADR`;
    if (dept === 'F&B') return `Fine dining & lounge covers averaging ${fmtUsdFull(m.fnb.avgCheck)} per check`;
    if (dept.includes('Spa')) return `Bespoke thermal recovery & holistic treatments averaging ${fmtUsdFull(m.spa.avgTreatmentUsd)}`;
    return `Curated destination expeditions & private guest activities`;
  };

  const outlets = outletRows.map((o) => ({
    dept: o.dept,
    outlet: o.outlet,
    rev: fmtUsdFull(o.value),
    share: `${Math.round((o.value / totalRev) * 100)}%`,
    trend: fmtTrendArrow(deptTrendPct(o.dept)),
    detail: deptDetail(o.dept),
  }));

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{propName}</h4>
          <p className="text-[10px] text-zinc-500">Comprehensive departmental revenue breakdown and outlet contributions</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Total Hotel Revenue: {fmtUsd(m.totalRevenue)}
        </span>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Rooms Revenue</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsd(roomRev)}</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">
            {Math.round((roomRev / totalRev) * 100)}% Share · {fmtTrendArrow(m.vsLy.roomRevenuePct)}
          </span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">F&B Fine Dining</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsd(fnbRev)}</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">
            {Math.round((fnbRev / totalRev) * 100)}% Share · {fmtTrendArrow(m.vsLy.fnbRevenuePct)}
          </span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Spa & Wellness</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsd(spaRev)}</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">
            {Math.round((spaRev / totalRev) * 100)}% Share · {fmtTrendArrow(m.vsLy.spaRevenuePct)}
          </span>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Activities & Experiences</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtUsd(otherRev)}</div>
          <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 block">
            {Math.round((otherRev / totalRev) * 100)}% Share · {fmtTrendArrow(m.vsLy.experienceRevenuePct)}
          </span>
        </div>
      </div>

      {/* Outlets Table */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Outlet Performance & Ancillary Drivers
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Department</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Primary Outlet / Service</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Revenue (USD)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">% Share</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Growth</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 pl-4">Operational Insight</th>
              </tr>
            </thead>
            <tbody>
              {outlets.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.dept}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-700 dark:text-zinc-300">{item.outlet}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{item.rev}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500 font-medium">{item.share}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">{item.trend}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 pl-4">{item.detail}</td>
                </tr>
              ))}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100" colSpan={2}>Total Property Generated Revenue</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtUsdFull(m.totalRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-700">100%</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">{fmtTrendArrow(m.vsLy.totalRevenuePct)}</td>
                <td className="py-3 px-3 text-[10px] text-zinc-400 pl-4">All revenue lines exceeding budget benchmark</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 5. Property Upcoming Events & Buyouts Drawer (Ma & Wabi-Sabi Edition) ─────
export function PropertyUpcomingEventsDrawerContent({ data }: { data: any }) {
  const navigate = useNavigate();
  const { closeDrawer } = useDashboardDrawer();
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'lead'>('all');

  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const todayMetrics = getPropertyMetrics(propertyId, 'today');
  const propName = data?.propertyName || todayMetrics.name;
  const rawEvents = getPropertyEvents(propertyId);
  const events = (data?.events?.length >= rawEvents.length ? data.events : rawEvents).map((ev: any) => ({
    ...ev,
    revenue: ev.revenue ?? fmtUsdFull(ev.revenueUsd ?? 0),
    targetType: ev.targetType ?? 'lead',
    targetId: ev.targetId ?? 'LD-001',
    stage: ev.stage ?? 'Confirmed OTB',
    client: ev.client ?? 'Private Account',
    keysBlocked: ev.keysBlocked ?? 12,
    venue: ev.venue ?? 'Private Wing & Pavilion',
  }));

  const filteredEvents = events.filter((ev: any) =>
    filterType === 'all' ? true : ev.targetType === filterType
  );

  const totalRevenueUsd = events.reduce((acc: number, e: any) => acc + (e.revenueUsd || 0), 0);
  const confirmedCount = events.filter((e: any) => e.targetType === 'booking' || e.stage === 'Confirmed OTB' || e.stage === 'Definite').length;
  const activeLeadsCount = events.filter((e: any) => e.targetType === 'lead').length;
  const totalKeysBlocked = events.reduce((acc: number, e: any) => acc + (e.keysBlocked || 0), 0);

  const handleNavigate = (ev: any) => {
    closeDrawer();
    if (ev.targetType === 'booking') {
      navigate(`/dashboard/reservations/bookings/${ev.targetId}`);
    } else {
      navigate(`/dashboard/reservations/leads/${ev.targetId}`);
    }
  };

  const getStageBadgeClass = (stage: string) => {
    if (stage === 'Confirmed OTB' || stage === 'Definite') {
      return 'bg-[#ecfdf5] text-[#14532d] border-[#bbf7d0]/80';
    }
    if (stage === 'Verbal Definite') {
      return 'bg-zinc-900 text-white border-zinc-900';
    }
    if (stage === 'Tentative') {
      return 'bg-zinc-100 text-zinc-700 border-zinc-200/80';
    }
    return 'bg-white text-zinc-500 border-zinc-200/80';
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-900 dark:text-zinc-100 pb-6">
      {/* Header — Ma Breathing Space */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-zinc-200/70 dark:border-zinc-800">
        <div>
          <h4 className="text-base font-serif tracking-wide text-zinc-900 dark:text-zinc-100">
            {propName} · <span className="text-zinc-500 font-sans text-xs font-normal">{todayMetrics.location}</span>
          </h4>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 self-start sm:self-auto">
          {[
            { id: 'all', label: `All (${events.length})` },
            { id: 'booking', label: `Bookings (${events.filter((e: any) => e.targetType === 'booking').length})` },
            { id: 'lead', label: `Leads (${activeLeadsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as 'all' | 'booking' | 'lead')}
              className={`px-3 py-1 text-[10px] tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wabi-Sabi Minimalist Summary Strip (Hairline Divided) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-zinc-200/70 dark:border-zinc-800 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/60 dark:divide-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
        <div className="py-4 px-4 first:pl-2">
          <span className="text-[9.5px] uppercase tracking-widest text-zinc-400 font-normal block">
            Total Event Value
          </span>
          <div className="text-[22px] font-normal text-zinc-900 dark:text-zinc-100 leading-tight mt-1.5">
            {fmtUsd(totalRevenueUsd)}
          </div>
          <span className="text-[9.5px] text-[#14532d] font-medium mt-1 block">
            Contracted &amp; Pipeline
          </span>
        </div>

        <div className="py-4 px-4">
          <span className="text-[9.5px] uppercase tracking-widest text-zinc-400 font-normal block">
            Confirmed &amp; Definite
          </span>
          <div className="text-[22px] font-normal text-zinc-900 dark:text-zinc-100 leading-tight mt-1.5">
            {confirmedCount} <span className="text-xs text-zinc-400 font-normal">/ {events.length}</span>
          </div>
          <span className="text-[9.5px] text-zinc-500 font-normal mt-1 block">
            Guaranteed Buyouts
          </span>
        </div>

        <div className="py-4 px-4">
          <span className="text-[9.5px] uppercase tracking-widest text-zinc-400 font-normal block">
            Active Event Leads
          </span>
          <div className="text-[22px] font-normal text-zinc-900 dark:text-zinc-100 leading-tight mt-1.5">
            {activeLeadsCount}
          </div>
          <span className="text-[9.5px] text-zinc-500 font-normal mt-1 block">
            Direct to Sales Pipeline
          </span>
        </div>

        <div className="py-4 px-4 last:pr-2">
          <span className="text-[9.5px] uppercase tracking-widest text-zinc-400 font-normal block">
            Inventory Committed
          </span>
          <div className="text-[22px] font-normal text-zinc-900 dark:text-zinc-100 leading-tight mt-1.5">
            {totalKeysBlocked} <span className="text-xs text-zinc-400 font-normal">Keys</span>
          </div>
          <span className="text-[9.5px] text-zinc-500 font-normal mt-1 block">
            Across {events.length} Gatherings
          </span>
        </div>
      </div>

      {/* Ma & Wabi-Sabi Ledger List — Clickable to Leads / Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Schedule of Retreats, Buyouts &amp; Pipeline Leads
          </h5>
          <span className="text-[9.5px] text-zinc-400 italic font-serif">
            Select any record to open its live Booking or Lead dossier
          </span>
        </div>

        <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800 border-t border-b border-zinc-200/70 dark:border-zinc-800">
          {filteredEvents.map((ev: any, idx: number) => (
            <div
              key={`${ev.targetId}-${idx}`}
              onClick={() => handleNavigate(ev)}
              className="group py-4 px-3 -mx-3 transition-all duration-300 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left: Index + Date & Title + Metadata */}
              <div className="flex items-start gap-4 min-w-0">
                <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600 pt-1 select-none w-5 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-medium tracking-wide text-zinc-900 dark:text-zinc-200">
                      {ev.date}
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-[9.5px] uppercase tracking-widest text-zinc-500 font-medium">
                      {ev.category}
                    </span>
                    <span
                      className={`text-[8.5px] font-medium px-2 py-0.5 rounded border ${getStageBadgeClass(ev.stage)}`}
                    >
                      {ev.stage}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700">
                      {ev.targetType === 'booking' ? 'Booking' : 'Lead'} · {ev.targetId}
                    </span>
                  </div>

                  <h4 className="text-sm font-serif text-zinc-900 dark:text-zinc-100 group-hover:translate-x-0.5 transition-transform">
                    {ev.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                    <span>
                      Client: <strong className="font-medium text-zinc-800 dark:text-zinc-200">{ev.client}</strong>
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span>
                      Sanctuary: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{ev.venue}</strong>
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span>
                      Allocation: <strong className="font-medium text-zinc-700 dark:text-zinc-300">{ev.keysBlocked} Keys · {ev.attendees} Guests</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Valuation & Subtle Action Link */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pl-9 sm:pl-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-800/60">
                <div className="text-base font-normal text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {ev.revenue}
                </div>
                <div className="flex items-center gap-1 text-[9.5px] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors mt-0.5 font-medium">
                  <span>Open {ev.targetType === 'booking' ? 'Booking' : 'Lead'}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 6. Property Guest Satisfaction & Sentiment Drawer ────────────────────────
export function PropertyGuestSatisfactionDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const initialPeriod: 'today' | 'mtd' | 'ytd' =
    data?.period === 'today' || data?.period === 'mtd' || data?.period === 'ytd'
      ? data.period
      : 'mtd';
  const [horizon, setHorizon] = useState<'today' | 'mtd' | 'ytd'>(initialPeriod);

  const m = getPropertyMetrics(propertyId, horizon);
  const sat = getPropertyGuestSatisfaction(propertyId, horizon);
  const propName = data?.propertyName || m.name;

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Bar: Property + As of Date (H-1) + Horizon Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {propName} · <span className="font-normal text-zinc-500">{m.location}</span>
          </h4>
          <p className="text-[10px] text-zinc-900 mt-0.5">
            Verified reputation &amp; guest sentiment across TripAdvisor, Google, Booking.com &amp; Post-Stay Surveys · As of:{' '}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {PERIOD_DEFS[horizon].periodLabel}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg">
            {(['today', 'mtd', 'ytd'] as const).map((h) => {
              const isActive = horizon === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {sat.score.toFixed(1)} / 5.0 Overall
          </span>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Overall Guest Rating</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{sat.score.toFixed(1)} / 5.0</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            {sat.distribution[0].value}% 5-Star Verified Ratings
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Cleanliness &amp; Hygiene</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{sat.cleanlinessScore.toFixed(1)} / 5.0</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            #1 Rated Pillar · {sat.pillars[0]?.positivePct ?? 98}% Positive
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Verified Reviews</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{fmtInt(sat.totalReviews)} Reviews</div>
          <span className="text-[9.5px] text-zinc-500 font-medium mt-0.5 block">
            62% Post-Stay Capture ({fmtInt(m.stays)} Stays)
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Net Promoter &amp; Rank</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">+{sat.nps} NPS</div>
          <span className="text-[9.5px] text-emerald-700 font-semibold mt-0.5 block">
            TripAdvisor #1 in {m.location.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Section 1: Satisfaction Breakdown by Hospitality Pillar (incl. Cleanliness) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Satisfaction Breakdown by Rating Criteria (TripAdvisor &amp; Global Luxury Standard)
          </h5>
          <span className="text-[10px] text-zinc-400">Normalized 5.0 Scale</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Rating Criteria</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Score</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Verified Mentions</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Positive Sentiment</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 pl-4">Key Guest Feedback Highlight</th>
              </tr>
            </thead>
            <tbody>
              {sat.pillars.map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{row.pillar}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{row.scoreLabel}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{fmtInt(row.mentions)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <span>{row.positivePct}%</span>
                      <div className="w-14 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" style={{ width: `${row.positivePct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 pl-4">{row.highlight}</td>
                </tr>
              ))}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Overall Weighted Property Score</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{sat.score.toFixed(1)} / 5.0</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(sat.totalReviews)}</td>
                <td className="py-3 px-3 text-right text-emerald-700">
                  {sat.distribution[0].value + sat.distribution[1].value}%
                </td>
                <td className="py-3 px-3 text-[10px] text-zinc-500 font-normal pl-4">
                  Exceeding luxury hospitality standard across all 6 inspection pillars
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Ratings by Review Platform (TripAdvisor, Google Reviews, Booking.com, etc.) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Reputation by Review Source (TripAdvisor, Google, Booking.com, Forbes &amp; Direct)
          </h5>
          <span className="text-[10px] text-zinc-400">100% Verified Stays</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Platform / Review Source</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Native Score</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Normalized (5.0)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Reviews</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">% Share</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Mgmt Response</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 pl-4">Standing &amp; Accolade</th>
              </tr>
            </thead>
            <tbody>
              {sat.platforms.map((plat, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{plat.platform}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{plat.nativeRating}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{plat.normalizedScore}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{fmtInt(plat.reviews)}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500 font-medium whitespace-nowrap">{plat.sharePct}%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-medium whitespace-nowrap">{plat.responseRate}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 pl-4">{plat.accolade}</td>
                </tr>
              ))}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Consolidated Reputation</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{sat.score.toFixed(1)} / 5.0</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{sat.score.toFixed(1)} / 5.0</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(sat.totalReviews)}</td>
                <td className="py-3 px-3 text-right text-zinc-700 dark:text-zinc-300">100%</td>
                <td className="py-3 px-3 text-right text-emerald-700">99.8%</td>
                <td className="py-3 px-3 text-[10px] text-zinc-500 font-normal pl-4">
                  Consolidated across public OTA/review platforms and verified PMS surveys
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Recent Verified Guest Reviews */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Recent Verified Guest Reviews &amp; Cleanliness Audits
          </h5>
          <span className="text-[10px] text-zinc-400">Latest Verified Stays</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sat.recentReviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                      {rev.platform}
                    </span>
                    <span className="text-[10px] text-zinc-400">{rev.dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-zinc-500">
                      Cleanliness: <strong className="text-zinc-900 dark:text-zinc-100">{rev.cleanlinessScore}</strong>
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60">
                      {rev.overallScore}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{rev.title}</div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{rev.guest}</span>
                <span>{rev.suite}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

