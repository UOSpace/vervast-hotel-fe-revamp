import { resolvePropertyId } from '@/constants/categories';
import {
  getPropertyMetrics,
  fmtUsd,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import {
  buildRoomTiers,
  buildDepartmentOutlets,
  getPropertyGuestActivity,
  getPropertyHourlyTimeline,
  getPropertyEvents,
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
  const hourlyTimeline = getPropertyHourlyTimeline(propertyId);

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

      {/* Explanatory Banner */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
        <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Understanding Capacity Load (%)
        </div>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          <strong>Capacity Load</strong> mengukur persentase beban kapasitas utilitas fasilitas atau staf yang sedang digunakan terhadap kapasitas maksimal departemen pada jam operasional tertentu. Angka di atas 85% menunjukkan jam sibuk (*Peak Load*) yang membutuhkan siaga staf penuh.
        </p>
      </div>

      {/* 24-Hour Schedule Breakdown */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Daily Operational Windows & Capacity Distribution
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Time Window</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Department / Outlet</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Capacity Load</th>
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 pl-6">Staff Deployed</th>
                <th className="py-2.5 px-3 text-center font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Operating Status</th>
              </tr>
            </thead>
            <tbody>
              {hourlyTimeline.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{item.time}</td>
                  <td className="py-2.5 px-3 font-medium text-zinc-700 dark:text-zinc-300">{item.dept}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center justify-end gap-2">
                      <span>{item.load}%</span>
                      <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${item.load >= 90 ? 'bg-zinc-900' : item.load >= 80 ? 'bg-zinc-700' : 'bg-zinc-500'}`}
                          style={{ width: `${item.load}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[10.5px] pl-6">{item.staff}</td>
                  <td className="py-2.5 px-3 text-center">
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
    </div>
  );
}

// ── 3. Property Room Tier Occupancy Drawer ───────────────────────────────────
export function PropertyRoomTierDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const period: PeriodId = data?.period || 'mtd';
  const m = getPropertyMetrics(propertyId, period);
  const propName = data?.propertyName || m.name;

  const tiers = buildRoomTiers(m);
  const paceStr = fmtTrendArrow(m.vsLy.roomRevenuePct);

  const rows = tiers.map((t) => ({
    type: t.name,
    occ: Math.round(t.occPct),
    occupied: Math.round(t.occupiedRn / Math.max(1, m.days)),
    available: t.keys,
    adrNum: t.adr,
    adr: fmtUsdFull(t.adr),
    rev: fmtUsd(t.revenue),
    pacing: paceStr,
  }));

  const totals = {
    occ: Math.round(m.occupancyPct),
    occupied: rows.reduce((sum, r) => sum + r.occupied, 0),
    available: m.rooms,
  };

  const topTier = rows.reduce((best, cur) => (cur.adrNum > best.adrNum ? cur : best), rows[0]);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{propName}</h4>
          <p className="text-[10px] text-zinc-500">Detailed room tier and suite inventory occupancy breakdown</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Average {totals.occ}% Occupied
        </span>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Total Occupancy</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.occupancyPct.toFixed(1)}%</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">↑ +{m.vsLy.occupancyPts.toFixed(1)} pts vs LY</span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Keys Occupied</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{totals.occupied} / {totals.available} Keys</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">{Math.max(0, totals.available - totals.occupied)} Keys Available Tonight</span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Top Performing Tier</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 leading-tight">{topTier.adr}</div>
          <div className="text-[11px] font-normal text-zinc-600 dark:text-zinc-400 mt-0.5">{topTier.type}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">{topTier.occ}% Occupancy · ADR</span>
        </div>
      </div>

      {/* Room Tiers Table */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-2">
          Room Tier Performance & Inventory Breakdown
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="bg-zinc-50/80 dark:bg-zinc-800/80">
              <tr className="text-zinc-400">
                <th className="py-2.5 px-3 text-left font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Room Category</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Occupancy</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Occupied Keys</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Total Keys</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">ADR (USD)</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Revenue</th>
                <th className="py-2.5 px-3 text-right font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Pace</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.type}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.occ}%</td>
                  <td className="py-2.5 px-3 text-right text-zinc-800 dark:text-zinc-200 font-medium">{row.occupied}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-400">{row.available}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{row.adr}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">{row.pacing}</td>
                </tr>
              ))}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                <td className="py-3 px-3 text-right text-emerald-700">{totals.occ}%</td>
                <td className="py-3 px-3 text-right">{totals.occupied}</td>
                <td className="py-3 px-3 text-right">{totals.available}</td>
                <td className="py-3 px-3 text-right">{fmtUsdFull(m.adr)}</td>
                <td className="py-3 px-3 text-right">{fmtUsd(m.roomRevenue)}</td>
                <td className="py-3 px-3 text-right text-emerald-700">{paceStr}</td>
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

// ── 5. Property Upcoming Events Drawer ───────────────────────────────────────
export function PropertyUpcomingEventsDrawerContent({ data }: { data: any }) {
  const propertyId = resolvePropertyId(data?.propertyId || 'sosei-barcelona');
  const todayMetrics = getPropertyMetrics(propertyId, 'today');
  const propName = data?.propertyName || todayMetrics.name;
  const events = (data?.events || getPropertyEvents(propertyId)).map((ev: any) => ({
    ...ev,
    revenue: ev.revenue ?? fmtUsdFull(ev.revenueUsd ?? 0),
  }));

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{propName}</h4>
          <p className="text-[10px] text-zinc-500">Upcoming curated retreats, private buyouts, and guest events</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
          {events.length} Confirmed Events
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((ev: any, idx: number) => (
          <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {ev.category}
                </span>
                <span className="text-[10px] text-zinc-500">{ev.date}</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">{ev.title}</h4>
              <p className="text-[10.5px] text-zinc-500 mt-0.5">
                Expected attendees: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{ev.attendees} Guests</strong> · Dedicated concierge team assigned
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ev.revenue}</div>
              <span className="text-[9.5px] text-emerald-700 font-semibold">Contracted OTB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
