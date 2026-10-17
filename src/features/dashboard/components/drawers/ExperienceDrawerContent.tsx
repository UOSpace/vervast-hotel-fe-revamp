import {
  PERIOD_DEFS,
  PORTFOLIO_PROPERTY_IDS,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
  getPropertyMetricsList,
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
  getExperienceRegionRows,
  getExperienceSegmentRows,
  getExperienceStaffing,
  getExperienceStayContribution,
  getKidsClubControl,
  getUncapturedRevenue,
} from '@/data/portfolio/experienceMix';

interface ExperienceDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function ExperienceDrawerContent({ config }: ExperienceDrawerContentProps) {
  const detailKey = typeof config.data === 'string' ? config.data : config.data?.key || '';
  const payload = typeof config.data === 'object' && config.data !== null ? config.data : {};

  const horizon: PeriodId = payload.horizon || payload.period || 'mtd';
  const propertyIds: readonly string[] =
    payload.propertyIds && payload.propertyIds.length > 0
      ? payload.propertyIds
      : payload.propertyId
        ? [payload.propertyId]
        : PORTFOLIO_PROPERTY_IDS;

  const ids = [...propertyIds];
  const m = getPortfolioMetrics(ids, horizon);
  const e = m.experiences;
  const periodMeta = PERIOD_DEFS[horizon];
  const kpis = buildExperienceKpis(m, horizon);
  const propertyList = getPropertyMetricsList(ids, horizon);
  const categoryRows = getExperienceCategoryRows(m);
  const modelRows = getExperienceModelRows(m);
  const segmentRows = getExperienceSegmentRows(m);
  const cohortSplit = getExperienceCohortSplit(m);
  const bottlenecks = getExperienceBottlenecks(ids, horizon, 8);
  const uncapturedRev = getUncapturedRevenue(m);
  const staffing = getExperienceStaffing(m);
  const kidsControl = getKidsClubControl(ids, horizon);
  const forwardWindows = getExperienceForwardOutlook(ids);
  const stayContribution = getExperienceStayContribution(m);
  const regionRows = getExperienceRegionRows(m);

  const scopeLabel =
    m.propertyCount === 1
      ? `${m.properties[0].name} (${fmtInt(e.programs)} active programs)`
      : `all ${m.propertyCount} SOSEI resorts (${fmtInt(e.programs)} active programs)`;

  /* ───────────────────────── 1. 6 HEADLINE METRICS & PROPERTY BENCHMARK ───────────────────────── */
  if (detailKey === 'EXP_HEADLINE_KPI') {
    const kpiId = payload.kpiId || 'participation';

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Resort Activities &amp; Experiences performance across {scopeLabel} (excluding Spa treatments) ·{' '}
              <strong className="text-zinc-900">{periodMeta.periodLabel}</strong>.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtInt(e.programs)} Active Programs · {fmtInt(e.sessions)} Sessions · {fmtInt(e.attendances)} Attendances
          </span>
        </div>

        {/* 6 Headline Summary Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {kpis.map((box) => (
            <div
              key={box.id}
              className={`p-3 rounded-xl border ${
                kpiId === box.id ? 'border-zinc-900 bg-zinc-100/80' : 'border-zinc-200/80 bg-zinc-50/40'
              }`}
            >
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{box.label}</div>
              <div className="text-base font-bold text-zinc-900 mt-1">{box.value}</div>
              <div
                className={`text-[9px] font-medium mt-0.5 ${
                  box.vsLyPos ? 'text-[#14532d]' : 'text-[#800020]'
                }`}
              >
                {box.sub1} · {box.sub2}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Distinction Callout */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              Capacity Utilization ({fmtPct(e.capacityUtilPct)}) vs Demand Fulfillment ({fmtPct(e.demandFulfillmentPct)})
            </div>
            <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
              <strong>Capacity Utilization</strong> measures actual attendances ({fmtInt(e.attendances)}) against places offered ({fmtInt(e.capacityOffered)}) across {fmtInt(e.sessions)} delivered sessions.{' '}
              <strong>Demand Fulfillment</strong> accounts for {fmtInt(e.unmetDemand)} valid guest requests waitlisted or turned away out of {fmtInt(e.validDemand)} total demand.
            </p>
          </div>
        </div>

        {/* All Resorts Benchmark Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Attendances</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Participation</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Cap Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Fulfillment</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Quality</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Readiness</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Revenue</th>
              </tr>
            </thead>
            <tbody>
              {propertyList.map((p) => (
                <tr key={p.propertyId} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{p.name}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{p.categoryName}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(p.experiences.sessions)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtInt(p.experiences.attendances)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-semibold text-[#14532d] text-right">
                    {fmtPct(p.experiences.participationRatePct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtPct(p.experiences.capacityUtilPct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">
                    {fmtPct(p.experiences.demandFulfillmentPct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtPct(p.experiences.qualityPct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">
                    {fmtPct(p.experiences.readinessPct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {fmtUsd(p.experienceRevenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]">
                  Total ({m.propertyCount} {m.propertyCount === 1 ? 'Resort' : 'Resorts'})
                </td>
                <td className="py-2.5 px-3 text-[10px] text-zinc-500">{fmtInt(e.programs)} Programs</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.sessions)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.attendances)}</td>
                <td className="py-2.5 px-3 text-[10px] text-[#14532d] text-right">
                  {fmtPct(e.participationRatePct)}
                </td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(e.capacityUtilPct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(e.demandFulfillmentPct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(e.qualityPct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(e.readinessPct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.experienceRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 2. CATEGORY MIX & ACTIVITY TAXONOMY ───────────────────────── */
  if (detailKey === 'EXP_CATEGORY_MIX' || detailKey === 'EXP_PORTFOLIO_TAXONOMY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Standardized SOSEI Activity Taxonomy &amp; Category Mix across {scopeLabel} ({periodMeta.periodLabel}).
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtInt(e.attendances)} Attendances · {fmtUsd(m.experienceRevenue)} Paid Revenue
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Primary Category</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Signature Examples</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Audience</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Commercial Model</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Attendances</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Cap Util</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Revenue</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.map((row, idx) => (
                <tr key={row.id} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">
                    {idx + 1}. {row.name} ({row.sharePct}%)
                  </td>
                  <td className="py-2 px-3 text-[10px] text-zinc-600">{row.examples}</td>
                  <td className="py-2 px-3 text-[10px] text-zinc-600">{row.audience}</td>
                  <td className="py-2 px-3 text-[10px] text-zinc-700">{row.model}</td>
                  <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtInt(row.attendances)}
                  </td>
                  <td className="py-2 px-3 text-[10px] font-semibold text-[#14532d] text-right">
                    {fmtPct(row.utilPct)}
                  </td>
                  <td className="py-2 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2 px-3 text-[10px]" colSpan={4}>
                  Total Activity Portfolio ({fmtInt(e.sessions)} Sessions)
                </td>
                <td className="py-2 px-3 text-[10px] text-right">{fmtInt(e.attendances)}</td>
                <td className="py-2 px-3 text-[10px] text-[#14532d] text-right">{fmtPct(e.capacityUtilPct)}</td>
                <td className="py-2 px-3 text-[10px] text-right">{fmtUsd(m.experienceRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 3. GUEST PARTICIPATION & SEGMENT CAPTURE ───────────────────────── */
  if (detailKey === 'EXP_PARTICIPATION_CAPTURE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Guest participation conversion, repeat multi-day engagement, and regional origin performance ({periodMeta.periodLabel}).
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtPct(e.participationRatePct)} Participation · {fmtInt(e.uniqueParticipants)} of {fmtInt(e.eligibleGuests)} Eligible Stays
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">UNIQUE PARTICIPANTS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(e.uniqueParticipants)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              {fmtPct(e.participationRatePct)} of {fmtInt(e.eligibleGuests)} Eligible
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">FIRST-TIME COHORT</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(cohortSplit.firstTimeParticipants)}</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">
              {fmtPct(cohortSplit.firstTimeSharePct)} of Active Participants
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">REPEAT MULTI-ACTIVITY</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(cohortSplit.repeatParticipants)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              {fmtPct(cohortSplit.repeatSharePct)} Repeat · {e.activitiesPerStay.toFixed(2)} Act / Stay
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Guest Segment</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Lead Preferences</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Eligible Stays</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Participants</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capture %</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Attendances</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Act / Stay</th>
              </tr>
            </thead>
            <tbody>
              {segmentRows.map((s) => (
                <tr key={s.id} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{s.name}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{s.pref}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(s.eligible)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtInt(s.participants)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-semibold text-[#14532d] text-right">
                    {fmtPct(s.partRatePct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {fmtInt(s.attendances)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">
                    {s.activitiesPerStay.toFixed(2)}x
                  </td>
                </tr>
              ))}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]" colSpan={2}>
                  Total Eligible Guest Segments
                </td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.eligibleGuests)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.uniqueParticipants)}</td>
                <td className="py-2.5 px-3 text-[10px] text-[#14532d] text-right">{fmtPct(e.participationRatePct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.attendances)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{e.activitiesPerStay.toFixed(2)}x</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regional Footprint Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Region</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Resorts</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Attendances</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Share</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Participation</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Revenue</th>
              </tr>
            </thead>
            <tbody>
              {regionRows
                .filter((r) => r.properties > 0)
                .map((r) => (
                  <tr key={r.regionId} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">{r.region}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{r.properties}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtInt(r.attendances)}
                    </td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">
                      {fmtPct(r.attendanceSharePct)}
                    </td>
                    <td className="py-2 px-3 text-[10px] font-semibold text-[#14532d] text-right">
                      {fmtPct(r.participationPct)}
                    </td>
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsd(r.revenue)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 4. CAPACITY CONSTRAINTS & UNMET DEMAND ───────────────────────── */
  if (detailKey === 'EXP_UNMET_DEMAND') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Capacity-constrained programs, waitlist turnaways, and estimated uncaptured revenue across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80">
            {fmtInt(e.unmetDemand)} Waitlisted · {fmtUsd(uncapturedRev)} Uncaptured Paid Revenue
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">VALID DEMAND</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(e.validDemand)}</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">Total Guest Requests</div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">FULFILLED ATTENDANCES</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(e.attendances)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              {fmtPct(e.demandFulfillmentPct)} Fulfillment
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">UNMET / WAITLISTED</div>
            <div className="text-base font-bold text-[#800020] mt-1">{fmtInt(e.unmetDemand)}</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">
              {fmtPct(EXPERIENCE_NO_SHOW_PCT)} No-Show Rate
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">EST. UNCAPTURED REV</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(uncapturedRev)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              At {fmtUsdFull(e.revenuePerPaidParticipant)} / Paid Guest
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Constrained Program</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Cap Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Fulfillment</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Waitlisted</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Recommended Operational Action</th>
              </tr>
            </thead>
            <tbody>
              {bottlenecks.map((b) => (
                <tr key={`${b.propertyId}-${b.activity}`} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{b.activity}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-600">{b.propertyName}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtPct(b.utilPct)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtPct(b.fulfillPct)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-[#800020] text-right">
                    {fmtInt(b.waitlist)} Guests
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-[#14532d]">{b.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 5. COMMERCIAL MIX & STAY CONTRIBUTION ───────────────────────── */
  if (
    detailKey === 'EXP_COMMERCIAL_MIX' ||
    detailKey === 'EXP_COMMERCIAL_STAY_IMPACT' ||
    detailKey === 'EXP_FORWARD_STAY'
  ) {
    const csat = ((e.qualityPct / 100) * 5).toFixed(2);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Commercial vs complimentary role mix, forward pre-booked pipeline, and stay-length association across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtUsd(m.experienceRevenue)} Paid Revenue ({fmtSignedPct(m.vsLy.experienceRevenuePct)} vs LY)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Paid &amp; Bespoke Revenue</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{fmtUsd(m.experienceRevenue)}</div>
            <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">
              {fmtSignedPct(m.vsLy.experienceRevenuePct)} vs LY · {fmtUsdFull(e.revenuePerPaidParticipant)} / Paid Guest
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Complimentary Enrichment</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">
              {fmtInt(e.complimentaryAttendances)} Attendances
            </div>
            <div className="text-[9.5px] text-zinc-600 font-medium mt-0.5">
              {fmtPct(e.compSharePct, 0)} of Total Volume · {csat}/5 CSAT
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Stay Contribution (2+ Act.)</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">
              +{stayContribution.stayUpliftNights.toFixed(1)} Nights ALOS
            </div>
            <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">
              +{stayContribution.npsUpliftPts.toFixed(1)} pts Resort NPS Association
            </div>
          </div>
        </div>

        {/* Commercial Model Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Commercial Model</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Strategic Role</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Attendances</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Vol</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Yield / Guest</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Revenue</th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.name}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{row.role}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(row.sessions)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtInt(row.attendances)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">
                    {fmtPct(row.attendanceSharePct, 0)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-[#14532d] text-right">
                    {row.isComplimentary ? `${csat} CSAT` : fmtUsdFull(row.perGuest)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {row.isComplimentary ? '$0 (Stay Value)' : `${fmtUsd(row.revenue)} (${fmtPct(row.revenueSharePct, 0)})`}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]" colSpan={2}>
                  Total Commercial &amp; Complimentary Portfolio
                </td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.sessions)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(e.attendances)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">100%</td>
                <td className="py-2.5 px-3 text-[10px] text-[#14532d] text-right">
                  {fmtUsdFull(e.revenuePerPaidParticipant)} / Paid
                </td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.experienceRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Forward 7D / 30D / 90D + Stay Contribution Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Forward Horizon</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">OTB Attendances</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Expected</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Rev OTB</th>
                </tr>
              </thead>
              <tbody>
                {forwardWindows.map((fw) => (
                  <tr key={fw.windowDays} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">Next {fw.windowDays} Days</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtInt(fw.otbAttendances)} ({fmtPct(fw.preBookedPct, 0)})
                    </td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">
                      {fmtInt(fw.expectedAttendances)}
                    </td>
                    <td className="py-2 px-3 text-[10px] font-bold text-[#14532d] text-right">
                      {fmtUsd(fw.otbRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">In-House Cohort</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Stays</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Stay</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">NPS / Repeat</th>
                </tr>
              </thead>
              <tbody>
                {stayContribution.cohorts.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">{c.label}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{fmtInt(c.stays)}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {c.avgStayNights.toFixed(1)}N
                    </td>
                    <td className="py-2 px-3 text-[10px] font-semibold text-[#14532d] text-right">
                      {c.nps.toFixed(1)} · {c.repeatPct}%
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

  /* ───────────────────────── 6. STAFFING, SAFETY & WEATHER READINESS ───────────────────────── */
  if (detailKey === 'EXP_READINESS_SAFETY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Certified guide coverage, marine/mountain Go/No-Go compliance, and weather dynamic substitution across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtPct(e.readinessPct)} Readiness · {fmtInt(staffing.certifiedGuides)} / {fmtInt(staffing.activeGuides)} Certified Guides
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">VERIFIED SESSIONS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(staffing.verifiedSessions)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">100% Go/No-Go Sign-Off</div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">CERTIFIED GUIDES</div>
            <div className="text-base font-bold text-zinc-900 mt-1">
              {fmtInt(staffing.certifiedGuides)} / {fmtInt(staffing.activeGuides)}
            </div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              {fmtPct(staffing.certCoveragePct)} Qualification Coverage
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">WEATHER PIVOTED</div>
            <div className="text-base font-bold text-zinc-900 mt-1">
              {fmtInt(staffing.weatherPivoted)} / {fmtInt(staffing.weatherImpacted)}
            </div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              {fmtPct(staffing.weatherRetainedPct)} Guest Retention
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">AT-RISK SESSIONS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(staffing.sessionsAtRisk)}</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">
              {fmtInt(staffing.nearMisses)} Minor Near-Misses Closed
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 7. KIDS' CLUB DAILY CONTROL VIEW (SECTION 4C) ───────────────────────── */
  if (detailKey === 'EXP_KIDS_CLUB_CONTROL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Dedicated child-safety &amp; supervision control workflow across {scopeLabel} ({periodMeta.periodLabel}). Individual child PII restricted to authorized Kids&apos; Club supervisors.
            </p>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            1:{kidsControl.effectiveRatio.toFixed(1)} Active Ratio (Max 1:{KIDS_CLUB_POLICY_MAX_RATIO})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'REGISTERED CHILDREN', val: fmtInt(kidsControl.registered), sub: 'Age Eligibility Verified' },
            { label: 'CHECKED IN (ACTIVE)', val: fmtInt(kidsControl.checkedIn), sub: 'Across 3 Age Bands' },
            {
              label: 'CERTIFIED STAFF ASSIGNED',
              val: fmtInt(kidsControl.staffAssigned),
              sub: `1:${kidsControl.effectiveRatio.toFixed(1)} Effective Ratio`,
            },
            {
              label: 'COLLECTION PENDING',
              val: fmtInt(kidsControl.collectionPending),
              sub: 'Authorized Guardian PIN',
            },
          ].map((k) => (
            <div key={k.label} className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{k.label}</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{k.val}</div>
              <div className="text-[9px] text-[#14532d] font-medium mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            5 Mandatory Child Safety &amp; Operational Control Points
          </h4>
          {[
            {
              step: '1. Registration & Age Eligibility Confirmed',
              status: `Verified (${fmtInt(kidsControl.registered)}/${fmtInt(kidsControl.registered)})`,
              desc: 'All registered children mapped to property-defined age bands (0–3 Toddler with Guardian, 4–7 Explorers, 8–12 Navigators).',
            },
            {
              step: '2. Authorized Drop-Off & Collection Arrangements',
              status: `${fmtInt(kidsControl.collectionPending)} Pending PIN`,
              desc: 'Named parent/guardian pickup list locked at check-in; no child released without matching guardian verification.',
            },
            {
              step: '3. Staff-to-Child Supervision Ratios Verified',
              status: `Compliant (${fmtInt(kidsControl.staffAssigned)} Certified Staff)`,
              desc: 'Pediatric First-Aid & Water-Safety certified supervisors assigned according to youngest age band present.',
            },
            {
              step: '4. Transition & End-of-Session Headcount Reconciliation',
              status: `${fmtInt(kidsControl.checkedIn)} Active Logged`,
              desc: 'Mandatory digital headcount logged when moving between indoor studio, garden trail, and shallow lagoon.',
            },
            {
              step: '5. Restricted-Access Allergy & Care Protocols',
              status: `${fmtInt(kidsControl.careFlags)} Care Flags Active`,
              desc: 'Allergy and medical notes surfaced strictly on supervisor handhelds without exposing sensitive child PII on global boards.',
            },
          ].map((c) => (
            <div
              key={c.step}
              className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-bold text-zinc-900">{c.step}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{c.desc}</div>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] shrink-0 self-start sm:self-center">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ───────────────────────── DEFAULT / COMMERCIAL & STAY CONTRIBUTION ───────────────────────── */
  const defaultCsat = ((e.qualityPct / 100) * 5).toFixed(2);
  return (
    <div className="space-y-5 animate-fade-in text-zinc-900">
      <div className="pb-3 border-b border-zinc-200">
        <p className="text-xs text-zinc-500">
          SOSEI Global Resort Activities &amp; Experiences Intelligence — Commercial Contribution, Guest Participation &amp; Operational Readiness ({periodMeta.periodLabel}).
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Paid &amp; Bespoke Revenue</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">{fmtUsd(m.experienceRevenue)}</div>
          <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">
            {fmtSignedPct(m.vsLy.experienceRevenuePct)} vs LY · {fmtUsdFull(e.revenuePerPaidParticipant)} / Paid Guest
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Complimentary Enrichment</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">
            {fmtInt(e.complimentaryAttendances)} Attendances
          </div>
          <div className="text-[9.5px] text-zinc-600 font-medium mt-0.5">
            {fmtPct(e.compSharePct, 0)} of Total Volume · {defaultCsat}/5 CSAT
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Stay Contribution (2+ Act.)</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">
            +{stayContribution.stayUpliftNights.toFixed(1)} Nights ALOS
          </div>
          <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">
            +{stayContribution.npsUpliftPts.toFixed(1)} pts Resort NPS Association
          </div>
        </div>
      </div>
    </div>
  );
}
