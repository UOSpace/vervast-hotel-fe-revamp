import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AltArrowDown,
  UsersGroupTwoRounded,
} from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { ExperienceKpiRow } from '../components/widgets/experience/ExperienceKpiRow';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import { IN_HOUSE_FNB_GUESTS } from '@/features/fnb/data/fnbMenuData';
import {
  PERIOD_DEFS,
  PERIOD_ORDER,
  PORTFOLIO_PROPERTY_IDS,
  fmtCompactInt,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
} from '@/data/portfolio';
import type { PeriodId } from '@/data/portfolio';
import {
  EXPERIENCE_NO_SHOW_PCT,
  KIDS_CLUB_POLICY_MAX_RATIO,
  buildExperienceKpis,
  getExperienceBottlenecks,
  getExperienceCategoryRows,
  getExperienceCohortSplit,
  getExperienceForwardOutlook,
  getExperienceModelRows,
  getExperiencePropertyRecord,
  getExperienceSegmentRows,
  getExperienceStaffing,
  getExperienceStayContribution,
  getKidsClubControl,
  getOutdoorSharePct,
  getUncapturedRevenue,
} from '@/data/portfolio/experienceMix';

/* ───────────────────────── DESIGN SYSTEM CONSTANTS ───────────────────────── */

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

/* ───────────────────────── PURE SVG VECTOR DONUT (AGENTS.MD RULE 5) ───────────────────────── */

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

/* ───────────────────────── MAIN EXPERIENCE DASHBOARD PAGE ───────────────────────── */

export function ExperienceDashboardPage() {
  const navigate = useNavigate();
  const { openDrawer } = useDashboardDrawer();

  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [showInHouseGuests, setShowInHouseGuests] = useState<boolean>(true);
  const [showDevModal, setShowDevModal] = useState(false);

  const horizonMeta = PERIOD_DEFS[horizon];
  const m = getPortfolioMetrics(PORTFOLIO_PROPERTY_IDS, horizon);
  const headlineKpis = buildExperienceKpis(m, horizon);

  /* ───────────────────────── GLOBAL PORTFOLIO VIEW ───────────────────────── */
  const renderGlobalView = () => {
    const categoryRows = getExperienceCategoryRows(m);
    const categoryDonutData = categoryRows.map((c) => ({
      name: c.name,
      value: c.sharePct,
      color: c.color,
      part: fmtInt(c.attendances),
      util: fmtPct(c.utilPct),
      model: c.model,
    }));

    const outdoorShare = getOutdoorSharePct();
    const indoorShare = 100 - outdoorShare;
    const cohortSplit = getExperienceCohortSplit(m);
    const segmentRows = getExperienceSegmentRows(m);
    const bottlenecks = getExperienceBottlenecks(PORTFOLIO_PROPERTY_IDS, horizon, 4);
    const uncapturedRev = getUncapturedRevenue(m);
    const modelRows = getExperienceModelRows(m);
    const staffing = getExperienceStaffing(m);
    const kidsToday = getKidsClubControl(PORTFOLIO_PROPERTY_IDS, horizon);
    const forwardWindows = getExperienceForwardOutlook(PORTFOLIO_PROPERTY_IDS);
    const stayContribution = getExperienceStayContribution(m);
    const propertyRecords = PORTFOLIO_PROPERTY_IDS.map((id) => getExperiencePropertyRecord(id, horizon));

    const csat = ((m.experiences.qualityPct / 100) * 5).toFixed(2);
    const fwd90 = forwardWindows.find((w) => w.windowDays === 90) ?? forwardWindows[2];

    return (
      <div className="flex flex-col gap-4">
        {/* ───────────────── ROW 1: PORTFOLIO MIX (4) | GUEST PARTICIPATION & ORIGIN (4) | CAPACITY VS FULFILLMENT (4) ───────────────── */}
        <div className="-mx-4 grid grid-cols-12 gap-4 items-stretch">
          {/* Card 1: Activity Portfolio Mix & Taxonomy — Donut placed at top per user request */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Global Activity Portfolio Mix & 14-Category Taxonomy',
                  data: { key: 'EXP_CATEGORY_MIX', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    ACTIVITY PORTFOLIO MIX &amp; TAXONOMY
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    {fmtInt(m.experiences.programs)} active programs across 14 standardized categories (excludes Spa)
                  </p>
                </div>
                <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 shrink-0">
                  {fmtInt(m.experiences.attendances)} Attendees
                </span>
              </div>

              {/* Donut Chart Centered at Top + Summary Metrics */}
              <div className="flex items-center justify-center gap-5 py-2 my-1 bg-zinc-50/70 rounded-lg border border-zinc-100 px-3">
                <PureSvgDonut
                  data={categoryDonutData}
                  centerValue={fmtCompactInt(m.experiences.attendances)}
                  centerLabel="Attendees"
                />
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-zinc-400 font-semibold">Delivered Sessions</div>
                    <div className="text-[13px] font-bold text-zinc-900 leading-tight">
                      {fmtInt(m.experiences.sessions)} <span className="text-[9px] font-medium text-zinc-500">Sessions</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-zinc-400 font-semibold">Paid Experience Rev</div>
                    <div className="text-[13px] font-bold text-zinc-900 leading-tight">
                      {fmtUsd(m.experienceRevenue)}{' '}
                      <span className="text-[8.5px] font-semibold text-[#14532d]">
                        {fmtSignedPct(m.vsLy.experienceRevenuePct)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-zinc-400 font-semibold">Comp vs Paid Mix</div>
                    <div className="text-[10px] font-semibold text-zinc-700 leading-tight">
                      {fmtPct(m.experiences.compSharePct, 0)} Comp · {fmtPct(100 - m.experiences.compSharePct, 0)} Paid
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-Width Category Breakdown Table Below Donut */}
              <div className="flex-1 flex flex-col justify-between gap-1 py-1">
                <div className="flex items-center justify-between text-[9px] font-medium text-zinc-400 border-b border-zinc-200/80 pb-1">
                  <span>Category</span>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-right">Attendees</span>
                    <span className="w-8 text-right">Mix</span>
                    <span className="w-11 text-right">Cap Util</span>
                  </div>
                </div>
                {categoryDonutData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-2 py-0.5 border-b border-zinc-100/80 last:border-b-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-[9.5px] text-zinc-700 font-medium truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9.5px] text-zinc-600 font-medium w-12 text-right">{c.part}</span>
                      <span className="text-[9.5px] text-zinc-900 font-semibold w-8 text-right">{c.value}%</span>
                      <span className="text-[9.5px] text-[#14532d] font-medium w-11 text-right">{c.util}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>Environment: {outdoorShare}% Outdoor/Marine · {indoorShare}% Studio/Cultural</span>
                <span className="font-semibold text-zinc-900">14 Taxonomy Classes →</span>
              </div>
            </div>
          </div>

          {/* Card 2: Guest Participation, Segment Eligibility & Origin Mix */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Guest Participation, Segment Capture & Regional Origin Mix',
                  data: { key: 'EXP_PARTICIPATION_CAPTURE', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    GUEST PARTICIPATION &amp; SEGMENT CAPTURE
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    Eligible guest conversion &amp; repeat uptake by guest segment
                  </p>
                </div>
                <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                  {fmtPct(m.experiences.participationRatePct)} Eligible Capture
                </span>
              </div>

              {/* 3 Cohort Split */}
              <div className="grid grid-cols-3 gap-2 my-1">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">Activities / Stay</div>
                  <div className="text-[13px] font-bold text-zinc-900 mt-0.5">{m.experiences.activitiesPerStay.toFixed(2)}x</div>
                  <div className="text-[8px] text-[#14532d] font-medium">{fmtInt(m.experiences.attendances)} Total Pax</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">First-Time Guests</div>
                  <div className="text-[13px] font-bold text-zinc-900 mt-0.5">{fmtPct(cohortSplit.firstTimeSharePct)}</div>
                  <div className="text-[8px] text-zinc-500 font-medium">{fmtInt(cohortSplit.firstTimeParticipants)} Unique</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">Repeat Multi-Day</div>
                  <div className="text-[13px] font-bold text-zinc-900 mt-0.5">{fmtPct(cohortSplit.repeatSharePct)}</div>
                  <div className="text-[8px] text-[#14532d] font-medium">{fmtInt(cohortSplit.repeatParticipants)} Unique</div>
                </div>
              </div>

              {/* Guest Cohort Eligibility Table */}
              <div className="my-1.5 flex-1 flex flex-col justify-between">
                <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Participation by Eligible Guest Segment ({fmtInt(m.experiences.eligibleGuests)} Eligible)
                </div>
                <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="text-[9px] font-medium text-zinc-400 border-b border-zinc-200/80">
                      <th className="text-left py-1 pr-1 w-[44%] font-medium">Guest Segment</th>
                      <th className="text-right py-1 px-1 w-[26%] font-medium">Capture</th>
                      <th className="text-right py-1 pl-1 w-[30%] font-medium">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentRows.map((s) => (
                      <tr key={s.id} className="text-[9.5px] border-b border-zinc-100 text-zinc-700">
                        <td className="py-1.5 pr-1 truncate font-medium text-zinc-900">{s.name}</td>
                        <td className="py-1.5 px-1 text-right font-semibold text-[#14532d]">{fmtPct(s.partRatePct)}</td>
                        <td className="py-1.5 pl-1 text-right font-medium text-zinc-800">{s.activitiesPerStay.toFixed(2)} Act/Stay</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>Unique Participants: {fmtInt(m.experiences.uniqueParticipants)} of {fmtInt(m.experiences.eligibleGuests)}</span>
                <span className="font-semibold text-zinc-900">Segment Breakdown →</span>
              </div>
            </div>
          </div>

          {/* Card 3: Capacity Utilization vs Demand Fulfillment */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Capacity Utilization vs Demand Fulfillment & Waitlist Bottlenecks',
                  data: { key: 'EXP_UNMET_DEMAND', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    CAPACITY CONSTRAINTS &amp; UNMET DEMAND
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    Programs where demand exceeds offered capacity &amp; recommended fixes
                  </p>
                </div>
                <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#fff1f2] text-[#800020]">
                  {fmtInt(m.experiences.unmetDemand)} Waitlisted
                </span>
              </div>

              {/* Waitlist & Turnaway Bottlenecks */}
              <div className="flex-1 flex flex-col justify-between gap-1.5 my-1.5">
                <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-400">
                  Top Capacity-Constrained Programs (High Turnaways)
                </div>
                {bottlenecks.map((b) => (
                  <div
                    key={`${b.propertyId}-${b.activity}`}
                    className="p-2 rounded-lg bg-zinc-50/70 border border-zinc-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-bold text-zinc-900 truncate">
                        {b.activity} ({b.propertyName.replace('SOSEI ', '')})
                      </div>
                      <div className="text-[8px] text-zinc-500 truncate mt-0.5">
                        Util {fmtPct(b.utilPct)} · Fulfillment {fmtPct(b.fulfillPct)} · Fix: <strong className="text-zinc-700">{b.fix}</strong>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#fff1f2] text-[#800020] shrink-0">
                      {fmtInt(b.waitlist)} Guests
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>No-Show Rate: {fmtPct(EXPERIENCE_NO_SHOW_PCT)} (-0.9 pts vs LY)</span>
                <span className="font-semibold text-zinc-900">Est. Uncaptured Rev: {fmtUsd(uncapturedRev)} →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────── ROW 2: COMMERCIAL MIX (4) | STAFFING, SAFETY & WEATHER (4) | FORWARD OUTLOOK & STAY CONTRIBUTION (4) ───────────────── */}
        <div className="-mx-4 grid grid-cols-12 gap-4 items-stretch">
          {/* Card 4: Experience Revenue & Commercial vs Complimentary Mix */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Experience Commercial Mix — Paid Revenue vs Complimentary Stay Enrichment',
                  data: { key: 'EXP_COMMERCIAL_MIX', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    EXPERIENCE REVENUE &amp; COMMERCIAL MIX
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    Balancing direct commercial revenue with complimentary stay-enrichment
                  </p>
                </div>
                <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                  {fmtUsd(m.experienceRevenue)} Paid Rev ({fmtSignedPct(m.vsLy.experienceRevenuePct)})
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-1.5 my-1.5">
                {modelRows.map((row) => (
                  <div
                    key={row.id}
                    className="p-2 rounded-lg bg-zinc-50/70 border border-zinc-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-bold text-zinc-900 truncate">{row.name}</div>
                      <div className="text-[8px] text-zinc-500 truncate mt-0.5">
                        {fmtInt(row.sessions)} Sessions ({fmtPct(row.attendanceSharePct, 0)}) · {fmtInt(row.attendances)} Guests · {row.role}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9.5px] font-bold text-zinc-900">
                        {row.isComplimentary ? '$0 (Stay Value)' : `${fmtUsd(row.revenue)} (${fmtPct(row.revenueSharePct, 0)})`}
                      </div>
                      <div className="text-[8px] text-[#14532d] font-medium">
                        {row.isComplimentary ? `${csat} CSAT` : `${fmtUsdFull(row.perGuest)} / Guest`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>Avg Paid Yield: {fmtUsdFull(m.experiences.revenuePerPaidParticipant)} / Paid Participant</span>
                <span className="font-semibold text-zinc-900">View Commercial Matrix →</span>
              </div>
            </div>
          </div>

          {/* Card 5: Staffing, Certification, Safety & Weather Intelligence */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Staffing Qualifications, Safety Compliance & Weather Intelligence',
                  data: { key: 'EXP_READINESS_SAFETY', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    STAFFING, SAFETY &amp; WEATHER READINESS
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    Certified instructor coverage, equipment checklists &amp; weather alternatives
                  </p>
                </div>
                <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                  0 Severe Incidents
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-1.5 my-1.5">
                {[
                  {
                    title: 'Marine & High-Angle Safety Checklist Compliance',
                    sub: '100% pre-departure Go/No-Go sign-off across diving, sailing, via ferrata & heli-ski',
                    badge: `${fmtInt(staffing.verifiedSessions)} / ${fmtInt(staffing.sessions)} Verified`,
                    meta: '100% Sign-Off',
                    tone: 'pos',
                  },
                  {
                    title: 'Instructor & Guide Certification Coverage',
                    sub: `${fmtInt(staffing.certifiedGuides)} certified specialists active (PADI, RYT-500, UIAGM Mountain & Wilderness First-Aid)`,
                    badge: `${fmtPct(staffing.certCoveragePct)} Coverage`,
                    meta: `${fmtInt(staffing.certifiedGuides)} / ${fmtInt(staffing.activeGuides)} Active`,
                    tone: 'pos',
                  },
                  {
                    title: "Child Protection & Supervision Ratios (Kids' Club)",
                    sub: `1:${kidsToday.effectiveRatio.toFixed(1)} active ratio vs 1:${KIDS_CLUB_POLICY_MAX_RATIO} policy max · Dual-factor guardian pickup PIN verified`,
                    badge: '5 / 5 Controls Met',
                    meta: '0 Ratios Breached',
                    tone: 'pos',
                  },
                  {
                    title: 'Weather & Sea-State Dynamic Substitution',
                    sub: `${fmtInt(staffing.weatherImpacted)} swell/rain-impacted outdoor sessions pivoted to Indoor Artisan & Sound Healing`,
                    badge: `${fmtPct(staffing.weatherRetainedPct)} Retained`,
                    meta: `${fmtInt(staffing.weatherPivoted)} / ${fmtInt(staffing.weatherImpacted)} Pivoted`,
                    tone: 'pos',
                  },
                  {
                    title: 'Qualification & Equipment Constraints Watchlist',
                    sub:
                      staffing.watchlist.length > 0
                        ? `${staffing.watchlist.map((w) => `${w.name} (${fmtPct(w.readinessPct)})`).join(' · ')} & ${fmtInt(staffing.sessionsAtRisk)} sessions monitored`
                        : 'All 14 above 95% readiness target',
                    badge: `${staffing.watchlist.length} Watchlist`,
                    meta: `${fmtInt(staffing.sessionsAtRisk)} At-Risk`,
                    tone: staffing.watchlist.length > 0 ? 'warn' : 'pos',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-2 rounded-lg bg-zinc-50/70 border border-zinc-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-bold text-zinc-900 truncate">{item.title}</div>
                      <div className="text-[8px] text-zinc-500 truncate mt-0.5">{item.sub}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block text-[8px] font-semibold px-1.5 py-0.2 rounded ${
                          item.tone === 'pos'
                            ? 'bg-[#ecfdf5] text-[#14532d]'
                            : 'bg-[#fff1f2] text-[#800020]'
                        }`}
                      >
                        {item.badge}
                      </span>
                      <div className="text-[8px] text-zinc-400 font-medium mt-0.5">{item.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>Near-Miss Log: {fmtInt(staffing.nearMisses)} Minor (100% Closed &lt; 24h)</span>
                <span className="font-semibold text-zinc-900">Safety Audit Log →</span>
              </div>
            </div>
          </div>

          {/* Card 6: Forward Experience Outlook (7D/30D/90D) & Stay Contribution */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div
              className={CARD_CLASS}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: 'Forward Experience Outlook (7–90 Days) & Stay Contribution Analysis',
                  data: { key: 'EXP_FORWARD_STAY', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                    FORWARD OUTLOOK &amp; STAY CONTRIBUTION
                  </h3>
                  <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                    7D / 30D / 90D forward demand &amp; correlation with overall stay value
                  </p>
                </div>
                <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
                  {fmtPct(fwd90.preBookedPct)} Pre-Booked (90D)
                </span>
              </div>

              {/* Forward 7D / 30D / 90D Strip */}
              <div className="grid grid-cols-3 gap-2 my-1">
                {forwardWindows.map((fw) => (
                  <div key={fw.windowDays} className="p-2 rounded-lg bg-zinc-50 border border-zinc-200/60">
                    <div className="text-[8px] uppercase tracking-wider text-zinc-400">Next {fw.windowDays} Days</div>
                    <div className="text-[13px] font-bold text-zinc-900 mt-0.5">{fmtInt(fw.otbAttendances)} OTB</div>
                    <div className="text-[8px] text-[#14532d] font-medium">
                      {fmtUsd(fw.otbRevenue)} Paid OTB
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Contribution to the Stay (Module 14) */}
              <div className="flex-1 flex flex-col justify-between my-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-400">
                    Experience Contribution to the Stay (Avg {stayContribution.avgStayNights.toFixed(1)}N)
                  </span>
                  <span className="text-[8px] text-zinc-400 italic">Association vs Causation</span>
                </div>
                <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr className="text-[9px] font-medium text-zinc-400 border-b border-zinc-200/80">
                      <th className="text-left py-1 pr-1 w-[42%] font-medium">In-House Cohort</th>
                      <th className="text-right py-1 px-1 w-[20%] font-medium">Avg Stay</th>
                      <th className="text-right py-1 px-1 w-[19%] font-medium">Resort NPS</th>
                      <th className="text-right py-1 pl-1 w-[19%] font-medium">Repeat %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stayContribution.cohorts.map((c) => (
                      <tr key={c.id} className="text-[9.5px] border-b border-zinc-100 text-zinc-700">
                        <td className="py-1.5 pr-1 truncate font-medium text-zinc-900">{c.label}</td>
                        <td className="py-1.5 px-1 text-right font-medium text-zinc-800">{c.avgStayNights.toFixed(1)} Nights</td>
                        <td className="py-1.5 px-1 text-right font-semibold text-[#14532d]">{c.nps.toFixed(1)}</td>
                        <td className="py-1.5 pl-1 text-right font-bold text-zinc-900">{c.repeatPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[8.5px] text-zinc-500">
                <span>2+ Activity Stay Uplift: +{stayContribution.stayUpliftNights.toFixed(1)} Nights · +{stayContribution.npsUpliftPts.toFixed(1)} NPS</span>
                <span className="font-semibold text-zinc-900">Forward Roster Plan →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────── ROW 3: 9-PROPERTY BENCHMARK TABLE ───────────────── */}
        <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 animate-card-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80 mb-3">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                PORTFOLIO RESORT ACTIVITIES &amp; EXPERIENCES BENCHMARK (ALL 9 SOSEI RESORTS)
              </h3>
              <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                Participation, capacity utilization, demand fulfillment, quality &amp; paid revenue by resort ({horizonMeta.periodLabel})
              </p>
            </div>
            <span className="text-[8.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
              14 · {fmtInt(m.experiences.programs)} Programs · {fmtInt(m.experiences.sessions)} Sessions · {fmtUsd(m.experienceRevenue)} Paid Rev
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
                  <th className="text-left py-2 pr-2 font-medium">Resort Property</th>
                  <th className="text-right py-2 px-2 font-medium">Attendees</th>
                  <th className="text-right py-2 px-2 font-medium">Participation</th>
                  <th className="text-right py-2 px-2 font-medium">Cap Util</th>
                  <th className="text-right py-2 px-2 font-medium">Fulfillment</th>
                  <th className="text-right py-2 px-2 font-medium">Quality</th>
                  <th className="text-right py-2 px-2 font-medium">Paid Rev</th>
                  <th className="text-right py-2 pl-2 font-medium">LFL YoY</th>
                </tr>
              </thead>
              <tbody>
                {propertyRecords.map((prop) => {
                  const dotColor =
                    prop.status === 'above_plan'
                      ? 'bg-[#14532d]'
                      : prop.status === 'attention'
                        ? 'bg-[#800020]'
                        : 'bg-zinc-500';
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
                            <div className="text-[8.5px] text-zinc-400">{prop.regionName} · {prop.categoryName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-medium text-zinc-800">{fmtInt(prop.attendances)}</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-[#14532d]">{fmtPct(prop.participationRate)}</td>
                      <td className="py-2.5 px-2 text-right font-medium text-zinc-900">{fmtPct(prop.capacityUtil)}</td>
                      <td className="py-2.5 px-2 text-right font-medium text-zinc-800">{fmtPct(prop.demandFulfillment)}</td>
                      <td className="py-2.5 px-2 text-right font-medium text-zinc-900">{fmtPct(prop.quality)}</td>
                      <td className="py-2.5 px-2 text-right">
                        <div className="font-bold text-zinc-900">{fmtUsd(prop.paidRev)}</div>
                        <div className="text-[8px] text-zinc-400">
                          {fmtPct(prop.compSharePct, 0)} Comp / {fmtPct(100 - prop.compSharePct, 0)} Paid
                        </div>
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <span
                          className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded ${
                            isNeg ? 'bg-[#fff1f2] text-[#800020]' : 'bg-[#ecfdf5] text-[#14532d]'
                          }`}
                        >
                          {fmtSignedPct(prop.lflGrowth)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ───────────────── ROW 4: COLLAPSIBLE IN-HOUSE GUESTS EXPERIENCE & ELIGIBILITY DIRECTORY ───────────────── */}
        <div className="-mx-4 rounded-[12px] p-4 flex flex-col transition-all duration-300 animate-card-enter">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200/80">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                IN-HOUSE GUESTS EXPERIENCE &amp; ELIGIBILITY DIRECTORY (PORTFOLIO VIP ROSTER)
              </h3>
              <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                Active in-house VIP suites, party size, activity eligibility &amp; health/safety briefing notes
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
                {IN_HOUSE_FNB_GUESTS.length}
              </span>
              <AltArrowDown
                size={11}
                className={`transition-transform duration-200 ${showInHouseGuests ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showInHouseGuests && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-3 animate-fade-in">
              {IN_HOUSE_FNB_GUESTS.slice(0, 8).map((guest) => (
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
                      {guest.partySize > 2 ? 'Family & Private Eligible' : 'Adult & Bespoke Eligible'}
                    </span>
                    <span className="text-zinc-400">Waiver Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 pt-4 lg:pt-6 bg-white text-[10px]">
      {/* ───────────────── EXECUTIVE HEADER ───────────────── */}
      <div className="w-full flex flex-col gap-3 animate-fade-in">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Welcome To SOSEI Experiences Dashboard
            </h1>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{horizonMeta.periodLabel}</strong>
            </span>
            <span>·</span>
            <span>
              Scope:{' '}
              <strong className="font-semibold text-zinc-900">
                10 SOSEI Resorts · {fmtInt(m.experiences.programs)} Resort Programs · {fmtPct(m.occupancyPct)} Occ
              </strong>{' '}
              (Excludes Spa Operations)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Time Horizon Pill Filter (Today | MTD | YTD | Forward Business) */}
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

      {/* ───────────────── 5 CORE PERFORMANCE METRICS ───────────────── */}
      <ExperienceKpiRow
        kpis={headlineKpis}
        drawerTitleSuffix="SOSEI Experiences Intelligence"
        period={horizon}
        propertyIds={PORTFOLIO_PROPERTY_IDS}
      />

      {/* ───────────────── GLOBAL CONTENT BODY ───────────────── */}
      <div key={horizon} className="flex-1 flex flex-col gap-4">
        {renderGlobalView()}
      </div>

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
