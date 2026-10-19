import {
  PERIOD_DEFS,
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
  FNB_COST_PROFILE,
  FNB_GUEST_EXPERIENCE,
  FNB_PERIOD_SUFFIX,
  FNB_SERVICE_SIGNALS,
  diningGuestNights,
  fnbChecks,
  getFnbBigGroupEvents,
  getFnbCapacity,
  getFnbCentres,
  getFnbCuisines,
  getFnbDayparts,
  getFnbDemandSources,
  getFnbForwardOutlook,
  getFnbHeaderContext,
  getFnbHeadlineKpis,
  getFnbOperationalSignals,
  getFnbOrigins,
  getFnbOutletGroups,
  getFnbPenetrationRows,
  getFnbPortfolioOutlets,
  getFnbResortRanking,
  getFnbSignatureDishes,
} from '@/data/portfolio/fnbMix';

interface FnbDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

const CENTRE_INSIGHTS: Record<string, string> = {
  fine: 'Separates weak demand from limited seating across prime dinner sittings.',
  allday: 'Ties breakfast & buffet demand directly to resort occupancy and meal-plan entitlements.',
  bars: 'Captures sunset golden-hour footfall and post-dinner cellar spillover.',
  inVilla: 'Segmented by suite/villa tier, stay stage, and dispatch SLA window.',
  pool: 'Monitors post-excursion poolside & beach club attachment (1:00–4:00 PM).',
  banquet: 'High-margin bespoke celebrations and contracted group dining.',
};

export function FnbDrawerContent({ config }: FnbDrawerContentProps) {
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
  const periodMeta = PERIOD_DEFS[horizon];
  const suffix = FNB_PERIOD_SUFFIX[horizon];
  const headlineKpis = getFnbHeadlineKpis(ids, horizon);
  const resortRanking = getFnbResortRanking(ids, horizon);
  const centres = getFnbCentres(m);
  const cuisines = getFnbCuisines(m);
  const demandSources = getFnbDemandSources(m);
  const penetrationRows = getFnbPenetrationRows(m);
  const origins = getFnbOrigins(m);
  const signatureDishes = getFnbSignatureDishes(m);
  const singleCategory = m.properties.length === 1 ? m.properties[0].categoryId : undefined;
  const dayparts = getFnbDayparts(m, singleCategory);
  const outletGroups = getFnbOutletGroups(m);
  const capacity = getFnbCapacity(m);
  const diningGn = diningGuestNights(m);
  const checks = fnbChecks(m);
  const { signals: operationalSignals, pipelineValue } = getFnbOperationalSignals(ids, horizon);

  const scopeLabel =
    m.propertyCount === 1
      ? `${m.properties[0].name} (${m.fnb.outlets} operating F&B outlets)`
      : `${m.propertyCount} SOSEI luxury resorts (${m.fnb.outlets} operating F&B outlets)`;

  /* ───────────────────────── 1. HEADLINE KPIs & PORTFOLIO SNAPSHOT ───────────────────────── */
  if (detailKey === 'FNB_HEADLINE_KPI') {
    const rawKpiId = payload.kpiId || 'revenue';
    const kpiId =
      rawKpiId === 'total_fnb_rev'
        ? 'revenue'
        : rawKpiId === 'capture_rate'
          ? 'capture'
          : rawKpiId === 'avg_check'
            ? 'spend'
            : rawKpiId === 'revpash'
              ? 'forward'
              : rawKpiId === 'beverage'
                ? 'experience'
                : rawKpiId;

    const totalRevpor = m.roomsSold > 0 ? m.fnbRevenue / m.roomsSold : 0;
    const totalCsat = (m.experiences.qualityPct / 100) * 5;

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Commercial &amp; operational F&amp;B performance across {scopeLabel} ·{' '}
              <strong className="text-zinc-900">{periodMeta.periodLabel}</strong>.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {getFnbHeaderContext(ids, horizon)}
          </span>
        </div>

        {/* 5 Headline Summary Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {headlineKpis.map((box) => (
            <div
              key={box.id}
              className={`p-3 rounded-xl border ${
                kpiId === box.id ? 'border-zinc-900 bg-zinc-100/80' : 'border-zinc-200/80 bg-zinc-50/40'
              }`}
            >
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{box.boxLabel}</div>
              <div className="text-base font-bold text-zinc-900 mt-1">{box.value}</div>
              <div
                className={`text-[9px] font-medium mt-0.5 ${
                  box.vsLyPos ? 'text-[#14532d]' : 'text-[#800020]'
                }`}
              >
                {box.boxSub}
              </div>
            </div>
          ))}
        </div>

        {/* Resorts Commercial & Operational Ranking */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">SOSEI Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">LFL Growth</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">RevPOR</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Spend / Guest</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capture Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Seat Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">CSAT</th>
              </tr>
            </thead>
            <tbody>
              {resortRanking.map((row) => {
                const pos = row.lflPct >= 0;
                return (
                  <tr
                    key={row.propertyId}
                    className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900">{row.name}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">{row.categoryName}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(row.revenue)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-[9.5px] font-medium text-right ${
                        pos ? 'text-[#14532d]' : 'text-[#800020]'
                      }`}
                    >
                      {fmtSignedPct(row.lflPct)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtUsdFull(row.revpor)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(row.spendPerGuestNight)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">
                      {fmtPct(row.capturePct)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">
                      {fmtPct(row.seatLoadPct, 0)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {row.csat.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]">
                  Total ({m.propertyCount} {m.propertyCount === 1 ? 'Resort' : 'Resorts'})
                </td>
                <td className="py-2.5 px-3 text-[10px] text-zinc-500">{m.fnb.outlets} Outlets</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)}</td>
                <td
                  className={`py-2.5 px-3 text-[9.5px] text-right ${
                    m.vsLy.fnbRevenuePct >= 0 ? 'text-[#14532d]' : 'text-[#800020]'
                  }`}
                >
                  {fmtSignedPct(m.vsLy.fnbRevenuePct)}
                </td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsdFull(totalRevpor)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsdFull(m.fnb.spendPerGuestNight)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(m.fnb.captureRatePct)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(capacity.loadPct, 0)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{totalCsat.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 2. REVENUE CENTRE SCORECARDS (6 CENTRES) ───────────────────────── */
  if (detailKey === 'FNB_REVENUE_CENTRE_SCORECARD') {
    const selectedCentre = payload.centre || 'Fine & Specialty Dining';
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Revenue-centre performance across {scopeLabel} ·{' '}
              <strong className="text-zinc-900">{periodMeta.periodLabel}</strong>.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-zinc-900 text-white">
            Active Focus: {selectedCentre}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">TOTAL F&amp;B REVENUE</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(m.fnbRevenue)}</div>
            <div className="text-[9px] font-medium text-[#14532d] mt-0.5">
              {fmtSignedPct(m.vsLy.fnbRevenuePct)} vs LY
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">TOTAL COVERS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(m.fnb.covers)}</div>
            <div className="text-[9px] font-medium text-zinc-600 mt-0.5">
              {fmtPct(capacity.loadPct)} of {fmtInt(capacity.capacityCovers)} Cap
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">AVERAGE CHECK</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsdFull(m.fnb.avgCheck)}</div>
            <div className="text-[9px] font-medium text-zinc-600 mt-0.5">
              {fmtPct(m.fnb.bevSharePct)} Beverage Share
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">REVPASH &amp; TURN</div>
            <div className="text-base font-bold text-zinc-900 mt-1">${m.fnb.revpash.toFixed(2)}</div>
            <div className="text-[9px] font-medium text-[#14532d] mt-0.5">
              {m.fnb.seatTurn.toFixed(2)}x Seat Turn
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Revenue Centre</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue ({suffix})</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">YoY Growth</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Executive Insight</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((row) => {
                const isSelected = row.name === selectedCentre;
                const pos = row.growthPct >= 0;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-zinc-200/60 last:border-0 transition-colors ${
                      isSelected ? 'bg-zinc-100/80' : 'hover:bg-zinc-100/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.name}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">{fmtPct(row.sharePct, 1)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">
                      {fmtInt(row.covers)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(row.avgCheck)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsd(row.revenue)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-[9.5px] font-medium text-right ${
                        pos ? 'text-[#14532d]' : 'text-[#800020]'
                      }`}
                    >
                      {fmtSignedPct(row.growthPct)}
                    </td>
                    <td className="py-2.5 px-3 text-[9.5px] text-zinc-500">
                      {CENTRE_INSIGHTS[row.id] ?? 'Core resort dining revenue centre.'}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]">Total F&amp;B Revenue Centres</td>
                <td className="py-2.5 px-3 text-[10px] text-right">100.0%</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(m.fnb.covers)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsdFull(m.fnb.avgCheck)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)}</td>
                <td
                  className={`py-2.5 px-3 text-[9.5px] text-right ${
                    m.vsLy.fnbRevenuePct >= 0 ? 'text-[#14532d]' : 'text-[#800020]'
                  }`}
                >
                  {fmtSignedPct(m.vsLy.fnbRevenuePct)}
                </td>
                <td className="py-2.5 px-3 text-[9.5px] font-normal text-zinc-500">
                  Reconciled to headline F&amp;B total
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 3. AI CUISINE CATEGORY & MENU ENGINEERING ───────────────────────── */
  if (detailKey === 'FNB_AI_CUISINE_CATEGORY' || detailKey === 'FNB_CUISINE_ANALYTICS') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              AI-classified restaurant cuisine concepts ({m.fnb.outlets} operating outlets) &amp; signature dish contribution across {scopeLabel}.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtUsd(m.fnbRevenue)} Total Revenue · {periodMeta.periodLabel}
          </span>
        </div>

        {/* AI Cuisine Category Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Cuisine Category (AI Tagged)</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Outlets</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers ({suffix})</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Bev Attach</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Gross Margin</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue ({suffix})</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {cuisines.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.name}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 text-right">{row.outlets}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">
                    {fmtInt(row.covers)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtUsdFull(row.avgCheck)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">
                    {fmtPct(row.bevSharePct, 0)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">
                    {fmtPct(row.marginPct, 1)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {fmtUsd(row.revenue)} ({fmtPct(row.sharePct, 0)})
                  </td>
                  <td
                    className={`py-2.5 px-3 text-[9.5px] font-medium text-right ${
                      row.growthPct >= 0 ? 'text-[#14532d]' : 'text-[#800020]'
                    }`}
                  >
                    {fmtSignedPct(row.growthPct)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                <td className="py-2.5 px-3 text-[10px]">Total Cuisine Portfolio</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{m.fnb.outlets}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(m.fnb.covers)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsdFull(m.fnb.avgCheck)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtPct(m.fnb.bevSharePct, 0)}</td>
                <td className="py-2.5 px-3 text-[10px] text-right">74.6%</td>
                <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)} (100%)</td>
                <td
                  className={`py-2.5 px-3 text-[9.5px] text-right ${
                    m.vsLy.fnbRevenuePct >= 0 ? 'text-[#14532d]' : 'text-[#800020]'
                  }`}
                >
                  {fmtSignedPct(m.vsLy.fnbRevenuePct)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Menu & Signature Dish Performance */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            GLOBAL SIGNATURE DISHES &amp; EXPERIENCE CONTRIBUTION LEADERS ({suffix.toUpperCase()})
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Signature Dish / Experience</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Cuisine Category</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Orders ({suffix})</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Menu Price</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Dish Revenue</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Contribution %</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Pairing Attach</th>
                </tr>
              </thead>
              <tbody>
                {signatureDishes.map((d) => (
                  <tr key={d.name} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900">{d.name}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-500">{d.cat}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(d.orders)}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">${d.price}</td>
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsd(d.orders * d.price)}
                    </td>
                    <td className="py-2 px-3 text-[10px] font-medium text-[#14532d] text-right">{d.marginPct}%</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{d.pair}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 4. DEMAND CONVERSION, CAPTURE & GUEST SPEND MIX ───────────────────────── */
  if (detailKey === 'FNB_DEMAND_CAPTURE') {
    const coversPerGn = m.guestNights > 0 ? m.fnb.covers / m.guestNights : 0;
    const avgCheckPerTx = checks > 0 ? m.fnbRevenue / checks : 0;
    const coversPerCheck = checks > 0 ? m.fnb.covers / checks : 0;

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Distinguishing Covers ({fmtInt(m.fnb.covers)}), Dining Guest-Nights ({fmtInt(diningGn)}), and POS Checks ({fmtInt(checks)}) across Meal-Plan vs À La Carte demand.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {fmtInt(m.guestNights)} In-House Guest Nights ({suffix})
          </span>
        </div>

        {/* 3 Denominator Distinction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">1. TOTAL COVERS SERVED</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{fmtInt(m.fnb.covers)} Covers</div>
            <div className="text-[9.5px] text-zinc-600 mt-0.5">
              Avg Check per Cover: <strong>{fmtUsdFull(m.fnb.avgCheck)}</strong> · {coversPerGn.toFixed(2)} Covers / Guest-Night
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">2. DINING GUEST-NIGHTS</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">
              {fmtInt(diningGn)} ({fmtPct(m.fnb.captureRatePct)} Capture)
            </div>
            <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">
              Spend per In-House Guest-Night: <strong>{fmtUsdFull(m.fnb.spendPerGuestNight)}</strong>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">3. POS CHECK TRANSACTIONS</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{fmtInt(checks)} Checks</div>
            <div className="text-[9.5px] text-zinc-600 mt-0.5">
              Avg Check Size: <strong>{fmtUsdFull(avgCheckPerTx)}</strong> ({coversPerCheck.toFixed(2)} Covers / Check)
            </div>
          </div>
        </div>

        {/* Demand Source Split Table */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            DINING DEMAND SOURCE &amp; MEAL-PLAN SPLIT ({suffix.toUpperCase()})
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Demand Source</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Rev Share</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {demandSources.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">{d.name}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{fmtPct(d.sharePct, 0)}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(d.covers)}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(d.avgCheck)}
                    </td>
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsd(d.revenue)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                  <td className="py-2 px-3 text-[10px]">Total F&amp;B Demand</td>
                  <td className="py-2 px-3 text-[10px] text-right">100%</td>
                  <td className="py-2 px-3 text-[10px] text-right">{fmtInt(m.fnb.covers)}</td>
                  <td className="py-2 px-3 text-[10px] text-right">{fmtUsdFull(m.fnb.avgCheck)}</td>
                  <td className="py-2 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest Spend by Origin Market & Stay Profile */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            GUEST F&amp;B SPEND &amp; CAPTURE BY ORIGIN MARKET / NATIONALITY
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Origin Market</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Guest Nights</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Capture %</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Spend / Guest-Night</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Top Concept &amp; Purchasing Behavior</th>
                </tr>
              </thead>
              <tbody>
                {origins.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">
                      {row.name} ({fmtPct(row.guestSharePct, 0)})
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">{fmtInt(row.guestNights)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-[#14532d] text-right">
                      {fmtPct(row.capturePct)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(row.covers)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsdFull(row.spendPerGuestNight)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                      {fmtUsd(row.revenue)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">{row.behaviour}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                  <td className="py-2.5 px-3 text-[10px]">Total Portfolio (100%)</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(m.guestNights)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-[#14532d] text-right">{fmtPct(m.fnb.captureRatePct)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(m.fnb.covers)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsdFull(m.fnb.spendPerGuestNight)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-normal text-zinc-500">
                    {penetrationRows[0]?.label}: {penetrationRows[0]?.value}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 5. OUTLET PRODUCTIVITY & DAYPART SERVICE RHYTHM ───────────────────────── */
  if (detailKey === 'FNB_OUTLET_PRODUCTIVITY' || detailKey === 'FNB_OUTLET_DAYPART') {
    const groupLabels: Record<string, string> = {
      signature: 'Signature & Fine Dining Venues',
      allday: 'All-Day Terrace, Bars & Pool Lounges',
      ivd: 'In-Villa & Suite Private Dining',
      banquet: 'Private Cellar, Banqueting & Events',
    };

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Outlet seat productivity, RevPASH, table turnover, and daypart SLA across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtInt(m.fnb.seats)} Seats · ${m.fnb.revpash.toFixed(2)} RevPASH · {m.fnb.seatTurn.toFixed(2)}x Turn
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">F&amp;B REVENUE ({suffix})</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(m.fnbRevenue)}</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">{fmtInt(m.fnb.covers)} Covers Served</div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">REVPASH</div>
            <div className="text-base font-bold text-zinc-900 mt-1">${m.fnb.revpash.toFixed(2)}</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">{fmtInt(m.fnb.seats)} Portfolio Seats</div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">SEAT TURNOVER</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{m.fnb.seatTurn.toFixed(2)}x</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">{fmtPct(capacity.loadPct)} Capacity Load</div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">IN-VILLA DELIVERY SLA</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{FNB_SERVICE_SIGNALS.villaSlaMinutes}m Avg</div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">
              {fmtPct(100 - FNB_SERVICE_SIGNALS.villaSlaBreachPct)} Within 30m Promise
            </div>
          </div>
        </div>

        {/* Daypart Table */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            DAYPART SERVICE RHYTHM &amp; KITCHEN SLA ({suffix.toUpperCase()})
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Service Daypart</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Service Window</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Rev Share</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">RevPASH</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Kitchen SLA</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {dayparts.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{d.name}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">{d.window}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">{d.sharePct}%</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">{fmtInt(d.covers)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      ${d.revpash.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-[#14532d] font-medium text-right">{d.sla}</td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">{fmtUsd(d.revenue)}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-300 bg-zinc-100/70 font-bold text-zinc-900">
                  <td className="py-2.5 px-3 text-[10px]">Total All Dayparts</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">24-Hour Operation</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">100%</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtInt(m.fnb.covers)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">${m.fnb.revpash.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-[10px] text-[#14532d] text-right">95.2% On-Time</td>
                  <td className="py-2.5 px-3 text-[10px] text-right">{fmtUsd(m.fnbRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Outlet Trading Groups */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            OPERATING VENUE GROUPS ({suffix.toUpperCase()})
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Venue Group</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Share</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">RevPASH</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Status</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {outletGroups.map((g) => (
                  <tr key={g.id} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">{groupLabels[g.id] ?? g.id}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{fmtPct(g.sharePct, 0)}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(g.covers)}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(g.avgCheck)}
                    </td>
                    <td className="py-2 px-3 text-[10px] text-zinc-700 text-right">${g.revpash.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[10px] text-[#14532d] font-medium text-right">{g.status}</td>
                    <td className="py-2 px-3 text-[10px] font-bold text-zinc-900 text-right">{fmtUsd(g.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 6. FORWARD OUTLOOK (7D / 30D / 90D) ───────────────────────── */
  if (detailKey === 'FNB_FORWARD_OUTLOOK') {
    const fwWindows = ([7, 30, 90] as const).map((w) => getFnbForwardOutlook(ids, w));
    const fw30 = fwWindows[1];

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Forward F&amp;B demand, pre-reserved OTB covers, and banquet/event pipeline across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {fmtSignedPct(fw30.paceVsLyPct)} Booking Pace vs STLY
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Forward Horizon</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Confirmed Covers OTB</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Forecast Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Seat Capacity</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue OTB</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Forecast F&amp;B Rev</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Private Events</th>
              </tr>
            </thead>
            <tbody>
              {fwWindows.map((fw) => (
                <tr key={fw.windowDays} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">Next {fw.windowDays} Days</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">
                    {fmtInt(fw.otbCovers)} ({fmtPct(fw.otbCapPct, 0)} Cap)
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">
                    {fmtInt(fw.expectedCovers)} ({fmtPct(fw.forecastCapPct, 0)} Cap)
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 text-right">{fmtInt(fw.capacityCovers)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-[#14532d] text-right">
                    {fmtUsd(fw.otbFnbRevenue)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">
                    {fmtUsd(fw.forecastFnbRevenue)}
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">
                    {fmtInt(fw.events)} Evts ({fmtUsd(fw.eventRevenue)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 7. OPERATIONAL SIGNALS & ACTION TRACKER ───────────────────────── */
  if (detailKey === 'FNB_OPERATIONAL_SIGNAL' || detailKey === 'FNB_ACTION_SIGNAL') {
    const statusKey = m.properties.length === 1 ? m.properties[0].status : 'above_plan';
    const costProfile = FNB_COST_PROFILE.byStatus[statusKey];

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Operational exceptions, COGS discipline, and commercial opportunity pipeline across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            +{fmtUsd(pipelineValue)} Revenue Opportunity Pipeline ({suffix})
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">FOOD COST %</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{costProfile.foodPct}%</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              Target {FNB_COST_PROFILE.targetFoodPct}.0%
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">BEVERAGE COST %</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{costProfile.bevPct}%</div>
            <div className="text-[9px] text-[#14532d] font-medium mt-0.5">
              Target {FNB_COST_PROFILE.targetBevPct}.0% · {fmtUsd(m.fnb.bevRevenue)} Bev Rev
            </div>
          </div>
          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">PRIME COST RATIO</div>
            <div className="text-base font-bold text-zinc-900 mt-1">
              {(costProfile.foodPct + FNB_COST_PROFILE.labourPct).toFixed(1)}%
            </div>
            <div className="text-[9px] text-zinc-600 font-medium mt-0.5">
              Blended COGS + {FNB_COST_PROFILE.labourPct}% Culinary Labor
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {operationalSignals.map((sig) => {
            const isRisk = sig.type === 'risk';
            return (
              <div
                key={sig.id}
                className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900">{sig.title}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{sig.detail}</div>
                  <div className="text-[9px] text-zinc-400 mt-1">
                    {sig.confidence} · Accountable: <strong className="text-zinc-700">{sig.owner}</strong>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded shrink-0 self-start sm:self-center ${
                    isRisk ? 'bg-[#fff1f2] text-[#800020]' : 'bg-[#ecfdf5] text-[#14532d]'
                  }`}
                >
                  {sig.exposure}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ───────────────────────── 8. GUEST EXPERIENCE & REPUTATION (MODULE 8) ───────────────────────── */
  if (detailKey === 'FNB_GUEST_EXPERIENCE') {
    const centreById = (id: string) => centres.find((c) => c.id === id);
    const reputationRows = [
      {
        p: 'Fine Dining & Omakase Dinner',
        covers: centreById('fine')?.covers ?? 0,
        rev: centreById('fine')?.revenue ?? 0,
        csat: '4.92 / 5.0',
        comp: '0.4%',
        rec: '8 mins (Table-side)',
        theme: 'Praise for sommelier pairing; minor waitlist friction for 8 PM prime slots',
      },
      {
        p: 'Breakfast & All-Day Buffet',
        covers: centreById('allday')?.covers ?? 0,
        rev: centreById('allday')?.revenue ?? 0,
        csat: '4.78 / 5.0',
        comp: '1.1%',
        rec: '11 mins',
        theme: '9:00 AM barista coffee wait during weekend checkout peaks',
      },
      {
        p: 'Sunset Bars & Beach Clubs',
        covers: (centreById('bars')?.covers ?? 0) + (centreById('pool')?.covers ?? 0),
        rev: (centreById('bars')?.revenue ?? 0) + (centreById('pool')?.revenue ?? 0),
        csat: '4.86 / 5.0',
        comp: '0.6%',
        rec: '9 mins',
        theme: 'High acclaim for botanical elixirs; sunbed shade requests at peak sun',
      },
      {
        p: 'In-Villa & Room Service',
        covers: centreById('inVilla')?.covers ?? 0,
        rev: centreById('inVilla')?.revenue ?? 0,
        csat: '4.71 / 5.0',
        comp: '1.8%',
        rec: `${FNB_SERVICE_SIGNALS.villaSlaMinutes}m Avg (Butler)`,
        theme: 'Delivery SLA >30m during peak buggy windows at cliffside & jetty resorts',
      },
      {
        p: 'Private Destination Dining & Events',
        covers: centreById('banquet')?.covers ?? 0,
        rev: centreById('banquet')?.revenue ?? 0,
        csat: '4.96 / 5.0',
        comp: '0.2%',
        rec: '6 mins',
        theme: 'Highest NPS (+91) across portfolio; strong repeat celebration demand',
      },
    ];

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Connecting commercial F&amp;B performance ({fmtUsd(m.fnbRevenue)}) to dining quality, complaint themes, and service recovery speed across {scopeLabel}.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {FNB_GUEST_EXPERIENCE.csat.toFixed(2)} / 5.0 Portfolio CSAT · {fmtPct(FNB_GUEST_EXPERIENCE.complaintRatePct)} Complaint Rate
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Meal Period / Concept</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers ({suffix})</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue ({suffix})</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">CSAT Score</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Complaint Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Recovery Time</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Primary Recurring Feedback Theme</th>
              </tr>
            </thead>
            <tbody>
              {reputationRows.map((r, i) => (
                <tr key={i} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{r.p}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(r.covers)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{fmtUsd(r.rev)}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-[#14532d] text-right">{r.csat}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{r.comp}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{r.rec}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{r.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 9. ALL RESTAURANTS & BARS PERFORMANCE ───────────────────────── */
  if (detailKey === 'FNB_PORTFOLIO_OUTLETS') {
    const outlets = getFnbPortfolioOutlets(ids, horizon);
    const restaurants = outlets.filter((o) => o.outletType === 'restaurant');
    const bars = outlets.filter((o) => o.outletType === 'bar');
    const restRev = restaurants.reduce((a, o) => a + o.revenue, 0);
    const barRev = bars.reduce((a, o) => a + o.revenue, 0);

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Portfolio restaurant, bar &amp; beach club ranking across {scopeLabel} ·{' '}
            <strong className="text-zinc-900">{periodMeta.periodLabel}</strong>.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {outlets.length} Signature Outlets Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">TOTAL PORTFOLIO F&amp;B</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(m.fnbRevenue)}</div>
            <div className="text-[10px] text-[#14532d] mt-0.5">{fmtSignedPct(m.vsLy.fnbRevenuePct)} vs LY</div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">SIGNATURE RESTAURANTS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(restRev)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{restaurants.length} Fine &amp; All-Day Dining Venues</div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">BARS, LOUNGES &amp; BEACH CLUBS</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(barRev)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{bars.length} Beverage &amp; Sunset Venues</div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Outlet Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Venue Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">vs LY</th>
              </tr>
            </thead>
            <tbody>
              {outlets.map((o) => {
                const pos = o.vsLyPct >= 0;
                return (
                  <tr key={o.id} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors">
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900">{o.outletName}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600">{o.propertyName}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">{o.typeLabel}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(o.covers)}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-900 text-right">{fmtUsdFull(o.avgCheck)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{fmtUsd(o.revenue)}</td>
                    <td
                      className={`py-2.5 px-3 text-[9.5px] font-medium text-right ${
                        pos ? 'text-[#14532d]' : 'text-[#800020]'
                      }`}
                    >
                      {fmtSignedPct(o.vsLyPct)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 10. BIG GROUP EVENTS & WEDDINGS RADAR ───────────────────────── */
  if (detailKey === 'FNB_BIG_GROUP_EVENTS') {
    const groupData = getFnbBigGroupEvents(ids, horizon);

    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            High-impact weddings, private resort buyouts &amp; gala dinners requiring executive F&amp;B oversight ·{' '}
            <strong className="text-zinc-900">{periodMeta.periodLabel}</strong>.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            {groupData.events.length} Flagship Group Events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">CONTRACTED EVENT F&amp;B REVENUE</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtUsd(groupData.totalRevenue)}</div>
            <div className="text-[10px] text-[#14532d] mt-0.5">Banqueting, buyouts &amp; bespoke menus</div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">TOTAL EVENT ATTENDEES</div>
            <div className="text-base font-bold text-zinc-900 mt-1">{fmtInt(groupData.totalPax)} Pax</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Across {groupData.events.length} contracted group events</div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">AVG F&amp;B SPEND PER EVENT GUEST</div>
            <div className="text-base font-bold text-zinc-900 mt-1">
              {fmtUsdFull(groupData.totalPax > 0 ? groupData.totalRevenue / groupData.totalPax : 0)}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Includes gala tasting &amp; cellar pairing</div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Event Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Type · Date</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Guests</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Spend / Pax</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Operational Attention Note</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {groupData.events.map((evt) => {
                const needsAction = evt.readinessStatus === 'Tasting Due' || evt.readinessStatus === 'VIP Prep';
                return (
                  <tr key={evt.id} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors">
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900">{evt.eventName}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600">{evt.propertyName}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">
                      {evt.eventType} · {evt.dateWindow}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtInt(evt.pax)}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{fmtUsdFull(evt.spendPerPax)}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{fmtUsd(evt.revenue)}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600">{evt.attentionNote}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`text-[8.5px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          needsAction
                            ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                            : 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                        }`}
                      >
                        {evt.readinessStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── DEFAULT FALLBACK (ENGINE-DERIVED) ───────────────────────── */
  return (
    <div className="space-y-4 animate-fade-in text-zinc-900">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
        <p className="text-xs text-zinc-500">
          Executive commercial &amp; operational intelligence drill-down for{' '}
          <span className="font-semibold text-zinc-900">{config.title || 'F&B Portfolio'}</span> ({periodMeta.periodLabel}).
        </p>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
          {getFnbHeaderContext(ids, horizon)}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">F&amp;B REVENUE ({suffix})</div>
          <div className="text-base font-semibold text-zinc-900 mt-1">{fmtUsd(m.fnbRevenue)}</div>
          <div className="text-[10px] text-[#14532d] mt-0.5">
            {fmtSignedPct(m.vsLy.fnbRevenuePct)} vs LY · {fmtCompactInt(m.fnb.covers)} Covers
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">COMMERCIAL IMPACT</div>
          <div className="text-base font-semibold text-[#14532d] mt-1">+{fmtUsd(pipelineValue)} Opportunity</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Identified via capture &amp; capacity optimization</div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">GUEST CAPTURE &amp; CHECK</div>
          <div className="text-base font-semibold text-zinc-900 mt-1">
            {fmtPct(m.fnb.captureRatePct)} · {fmtUsdFull(m.fnb.avgCheck)}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            {fmtUsdFull(m.fnb.spendPerGuestNight)} Spend / In-House Guest-Night
          </div>
        </div>
      </div>
    </div>
  );
}
