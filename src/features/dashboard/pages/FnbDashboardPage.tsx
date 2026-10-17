import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AltArrowDown } from '@solar-icons/react';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
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
  FNB_BAR_TRADING_HOURS,
  FNB_GUEST_EXPERIENCE,
  FNB_SERVICE_SIGNALS,
  diningGuestNights,
  fnbChecks,
  getFnbCentres,
  getFnbCuisines,
  getFnbDemandSources,
  getFnbForwardOutlook,
  getFnbHeaderContext,
  getFnbHeadlineKpis,
  getFnbOperationalSignals,
  getFnbOrigins,
  getFnbPenetrationRows,
  getFnbResortRanking,
  getFnbSignatureDishes,
} from '@/data/portfolio/fnbMix';
import type { FnbForwardWindow } from '@/data/portfolio/fnbMix';

/* ───────────────────────── DESIGN SYSTEM CONSTANTS ───────────────────────── */

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */

export function FnbDashboardPage() {
  const navigate = useNavigate();
  const { openDrawer } = useDashboardDrawer();

  // Filter States
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [cuisineLens, setCuisineLens] = useState<'revenue' | 'demand'>('revenue');
  const [forwardWindow, setForwardWindow] = useState<FnbForwardWindow>(30);
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);
  const [showDevModal, setShowDevModal] = useState(false);

  const m = getPortfolioMetrics(PORTFOLIO_PROPERTY_IDS, horizon);
  const activeHeadlineKpis = getFnbHeadlineKpis(PORTFOLIO_PROPERTY_IDS, horizon);
  const centres = getFnbCentres(m);
  const cuisines = getFnbCuisines(m);
  const demandSources = getFnbDemandSources(m);
  const penetrationRows = getFnbPenetrationRows(m);
  const resortRanking = getFnbResortRanking(PORTFOLIO_PROPERTY_IDS, horizon);
  const forwardOutlook = getFnbForwardOutlook(PORTFOLIO_PROPERTY_IDS, forwardWindow);
  const origins = getFnbOrigins(m);
  const signatureDishes = getFnbSignatureDishes(m);
  const { signals: operationalSignals, pipelineValue } = getFnbOperationalSignals(PORTFOLIO_PROPERTY_IDS, horizon);

  const diningGn = diningGuestNights(m);
  const checks = fnbChecks(m);

  // Demand source split grouped into A La Carte + Private/In-Villa, Meal-Plan, External
  const alacarteRev =
    (demandSources.find((d) => d.id === 'alacarte')?.revenue ?? 0) +
    (demandSources.find((d) => d.id === 'private')?.revenue ?? 0) +
    (demandSources.find((d) => d.id === 'inVilla')?.revenue ?? 0);
  const mealplanRev = demandSources.find((d) => d.id === 'mealplan')?.revenue ?? 0;
  const externalRev = demandSources.find((d) => d.id === 'external')?.revenue ?? 0;
  const totalFnbRev = m.fnbRevenue || 1;
  const alacartePct = Math.round((alacarteRev / totalFnbRev) * 100);
  const mealplanPct = Math.round((mealplanRev / totalFnbRev) * 100);
  const externalPct = Math.max(0, 100 - alacartePct - mealplanPct);

  const barsCentre = centres.find((c) => c.id === 'bars');
  const barTxPerHr = Math.max(1, Math.round((barsCentre?.covers ?? 0) / Math.max(1, m.days * FNB_BAR_TRADING_HOURS)));

  // Pure SVG Donut Geometry (size=110, strokeWidth=14 per AGENTS.md)
  const donutSize = 110;
  const donutStroke = 14;
  const donutRadius = (donutSize - donutStroke) / 2; // 48
  const donutCircumference = 2 * Math.PI * donutRadius;

  let cumulativePct = 0;
  const donutSegments = centres.map((c) => {
    const dash = (c.sharePct / 100) * donutCircumference;
    const offset = -(cumulativePct / 100) * donutCircumference;
    cumulativePct += c.sharePct;
    return { ...c, dash, offset };
  });

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 bg-white text-[10px]">
      {/* ───────────────────────── TOP EXECUTIVE HEADER ───────────────────────── */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 border-b border-zinc-200/80 pb-3 animate-card-enter">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Welcome To SOSEI FNB Dashboard
            </h1>
            <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2 mt-1">
              <span>
                As of: <strong className="font-semibold text-zinc-900">{PERIOD_DEFS[horizon].periodLabel}</strong>
              </span>
              <span>·</span>
              <span className="text-zinc-600 font-medium">
                Resort Context: {getFnbHeaderContext(PORTFOLIO_PROPERTY_IDS, horizon)}
              </span>
            </div>
          </div>

          {/* Right Controls: Time Horizon (Today | MTD | YTD | Forward Business) + Export */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Time Horizon Filter Pills */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg">
              {PERIOD_ORDER.map((id) => {
                const t = PERIOD_DEFS[id];
                const active = horizon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setHorizon(id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
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

      {/* Animated Tab View Container */}
      <div className="flex flex-col gap-4">
        {/* 5 HEADLINE METRICS (Module 1: Global F&B Snapshot — Borderless & Transparent) */}
        <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {activeHeadlineKpis.map((kpi) => (
            <div
              key={kpi.id}
              onClick={() =>
                openDrawer({
                  type: 'FNB_DETAIL',
                  title: kpi.label,
                  data: { key: 'FNB_HEADLINE_KPI', kpiId: kpi.id, horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                })
              }
              className={CARD_CLASS}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 leading-tight">
                  {kpi.label}
                </span>
              </div>

              <div className="my-2">
                <div className="text-[22px] font-normal text-zinc-900 leading-tight">{kpi.value}</div>
                <div className="text-[9px] text-zinc-400 font-normal mt-0.5">{kpi.context}</div>
              </div>

              <div className="flex flex-wrap items-center gap-1 pt-1.5">
                <span
                  className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded ${
                    kpi.vsLyPos
                      ? 'bg-[#ecfdf5] text-[#14532d]'
                      : 'bg-[#fff1f2] text-[#800020]'
                  }`}
                >
                  {kpi.vsLy}
                </span>
                <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                  {kpi.vsTarget}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 1 (4-4-4): Module 2 (Revenue Centres) | AI Cuisine Category | Modules 3 & 5 (Demand Conversion & Capture) */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* MODULE 2: F&B REVENUE BY REVENUE CENTRE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'F&B Revenue by Revenue Centre — 6 Revenue Centres',
                data: { key: 'FNB_REVENUE_CENTRE_SCORECARD', centre: 'Fine & Specialty Dining', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  F&amp;B REVENUE BY REVENUE CENTRE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Portfolio contribution across 6 operating revenue centres
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                {fmtCompactInt(m.fnb.covers)} Covers
              </span>
            </div>

            <div className="flex items-center gap-3.5 flex-1">
              {/* Pure SVG Vector Donut */}
              <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
                <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth={donutStroke}
                  />
                  {donutSegments.map((seg) => {
                    const isHovered = hoveredCentre === seg.id;
                    const isDimmed = hoveredCentre !== null && !isHovered;
                    return (
                      <circle
                        key={seg.id}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHovered ? donutStroke + 2 : donutStroke}
                        strokeDasharray={`${Math.max(0, seg.dash - 1.5)} ${donutCircumference}`}
                        strokeDashoffset={seg.offset}
                        className="transition-all duration-300"
                        style={{ opacity: isDimmed ? 0.35 : 1 }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-bold text-zinc-900 leading-none">{fmtUsd(m.fnbRevenue)}</span>
                  <span className="text-[7.5px] text-zinc-400 font-medium mt-0.5">Total F&amp;B</span>
                </div>
              </div>

              {/* Right Table */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
                {centres.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCentre(c.id)}
                    onMouseLeave={() => setHoveredCentre(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDrawer({
                        type: 'FNB_DETAIL',
                        title: `${c.name} — Category Scorecard`,
                        data: { key: 'FNB_REVENUE_CENTRE_SCORECARD', centre: c.name, horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                      });
                    }}
                    className="flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-zinc-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-medium text-zinc-700 truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9.5px] text-zinc-400">{fmtPct(c.sharePct, 0)}</span>
                      <span className="text-[10px] font-medium text-zinc-900 w-12 text-right">{fmtUsd(c.revenue)}</span>
                      <span className="text-[9px] font-medium text-[#14532d] w-11 text-right">{fmtSignedPct(c.growthPct)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>Click any centre to open its commercial scorecard</span>
              <span className="text-zinc-700 font-medium">Scorecards →</span>
            </div>
          </div>

          {/* AI CUISINE CATEGORY & CONCEPT INTELLIGENCE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Global Restaurant Cuisine & Concept Intelligence (AI Categorized)',
                data: { key: 'FNB_AI_CUISINE_CATEGORY', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  RESTAURANT CATEGORY BY CUISINE (AI)
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Global culinary concept performance across {m.fnb.outlets} outlets
                </p>
              </div>

              {/* Pill Toggle: Revenue | Check & Bev */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-zinc-100 p-0.5 rounded-lg shrink-0"
              >
                {(['revenue', 'demand'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCuisineLens(mode)}
                    className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                      cuisineLens === mode
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {mode === 'revenue' ? 'Revenue' : 'Check & Bev'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1">
                <span className="col-span-6">Cuisine Category</span>
                <span className="col-span-2 text-right">{cuisineLens === 'revenue' ? 'Share' : 'Check'}</span>
                <span className="col-span-2 text-right">{cuisineLens === 'revenue' ? 'Revenue' : 'Bev %'}</span>
                <span className="col-span-2 text-right">Trend</span>
              </div>

              {cuisines.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-6 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-700 truncate block">{item.name}</span>
                    </div>
                    <span className="col-span-2 text-[10px] text-zinc-500 text-right">
                      {cuisineLens === 'revenue' ? fmtPct(item.sharePct, 0) : fmtUsdFull(item.avgCheck)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {cuisineLens === 'revenue' ? fmtUsd(item.revenue) : fmtPct(item.bevSharePct, 0)}
                    </span>
                    <span className="col-span-2 text-[9.5px] font-medium text-[#14532d] text-right">
                      {fmtSignedPct(item.growthPct)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${Math.min(100, item.sharePct * 3)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>
                Total Cuisine Revenue: <strong className="text-zinc-800">{fmtUsd(m.fnbRevenue)}</strong> · Avg Check{' '}
                <strong className="text-zinc-800">{fmtUsdFull(m.fnb.avgCheck)}</strong>
              </span>
            </div>
          </div>

          {/* MODULES 3 & 5: DEMAND CONVERSION, CAPTURE & PENETRATION */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Resort Demand Conversion, Guest Capture & Meal-Plan Split',
                data: { key: 'FNB_DEMAND_CAPTURE', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  DEMAND CONVERSION &amp; CAPTURE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  In-house guest participation vs meal-plan &amp; à la carte spend
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                {fmtPct(m.fnb.captureRatePct)} Capture
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {/* Revenue Source Split + Visual Stacked Bar */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-zinc-100">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[8.5px] text-zinc-400">À La Carte Paid</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {alacartePct}% ({fmtUsd(alacarteRev)})
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-zinc-400">Meal-Plan Alloc</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {mealplanPct}% ({fmtUsd(mealplanRev)})
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-zinc-400">External Diners</div>
                    <div className="text-xs font-bold text-zinc-900">
                      {externalPct}% ({fmtUsd(externalRev)})
                    </div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-zinc-900" style={{ width: `${alacartePct}%` }} />
                  <div className="h-full bg-zinc-500" style={{ width: `${mealplanPct}%` }} />
                  <div className="h-full bg-zinc-300" style={{ width: `${externalPct}%` }} />
                </div>
              </div>

              {/* 5 Evenly Distributed Penetration Rows */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                {penetrationRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9.5px]">
                      <span className="text-zinc-700 font-medium truncate">{row.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[8.5px] text-zinc-400">{row.sub}</span>
                        <span className="font-bold text-zinc-900">{row.value}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>
                {fmtCompactInt(diningGn)} Dining Guest-Nights of {fmtCompactInt(m.guestNights)}
              </span>
              <span className="text-zinc-700 font-medium">View Split →</span>
            </div>
          </div>
        </div>

        {/* ROW 2 (4-4-4): Module 4 (Commercial Ranking) | Module 7 (Outlet Productivity) | Module 10 (Forward Demand) */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* MODULE 4: COMMERCIAL PERFORMANCE RANKING */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Commercial Performance Ranking — All 10 Comparable Resorts',
                data: { key: 'FNB_HEADLINE_KPI', kpiId: 'revenue', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  COMMERCIAL PERFORMANCE RANKING
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Resort F&amp;B LFL growth, spend per guest &amp; capture rate
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dashboard/fnb/property');
                }}
                className="text-[9px] font-medium text-zinc-600 hover:text-zinc-900 underline cursor-pointer"
              >
                Property View →
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1">
                <span className="col-span-5">Resort Property</span>
                <span className="col-span-2 text-right">Rev</span>
                <span className="col-span-2 text-right">LFL</span>
                <span className="col-span-3 text-right">Spend / Cap</span>
              </div>

              {resortRanking.slice(0, 6).map((prop) => {
                const dotColor =
                  prop.status === 'above_plan'
                    ? 'bg-[#14532d]'
                    : prop.status === 'attention'
                      ? 'bg-[#800020]'
                      : 'bg-zinc-500';
                const isNeg = prop.lflPct < 0;
                return (
                  <div
                    key={prop.propertyId}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/fnb/property?id=${prop.propertyId}`);
                    }}
                    className="grid grid-cols-12 items-center py-1 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors"
                  >
                    <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-zinc-800 truncate">{prop.name}</div>
                        <div className="text-[8px] text-zinc-400 truncate">{prop.categoryName}</div>
                      </div>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(prop.revenue)}
                    </span>
                    <span
                      className={`col-span-2 text-[9.5px] font-medium text-right ${
                        isNeg ? 'text-[#800020]' : 'text-[#14532d]'
                      }`}
                    >
                      {fmtSignedPct(prop.lflPct)}
                    </span>
                    <span className="col-span-3 text-[9.5px] font-medium text-zinc-700 text-right">
                      {fmtUsdFull(prop.spendPerGuestNight)} · <span className="text-zinc-500">{fmtPct(prop.capturePct, 0)}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>Click a resort to open its Daily F&amp;B Command Center</span>
              <span className="text-zinc-700 font-medium">All 9 Resorts →</span>
            </div>
          </div>

          {/* MODULE 7: OUTLET PRODUCTIVITY & DAYPART MATRIX */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Global Outlet Productivity & Service Window Benchmarks',
                data: { key: 'FNB_REVENUE_CENTRE_SCORECARD', centre: 'Fine & Specialty Dining', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  OUTLET PRODUCTIVITY &amp; DAYPARTS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  RevPASH, table turns, room-service orders/hr &amp; bar throughput
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {/* Top 4-KPI Strip */}
              <div className="grid grid-cols-4 gap-1.5 pb-2 border-b border-zinc-100">
                <div>
                  <InfoTooltip text="RevPASH = Revenue Per Available Seat Hour: F&B revenue divided by (seats x operating hours). Measures how productively seating capacity is monetised.">
                    <div className="text-[8px] text-zinc-400 cursor-help">RevPASH</div>
                  </InfoTooltip>
                  <div className="text-[10.5px] font-bold text-zinc-900">${m.fnb.revpash.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Seat Turn</div>
                  <div className="text-[10.5px] font-bold text-zinc-900">
                    {m.fnb.seatTurn.toFixed(2)}x · {fmtUsdFull(m.fnb.avgCheck)}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">In-Villa SLA</div>
                  <div className="text-[10.5px] font-bold text-[#14532d]">
                    {FNB_SERVICE_SIGNALS.villaSlaMinutes}m Avg
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Bar Tx / Hr</div>
                  <div className="text-[10.5px] font-bold text-zinc-900">{barTxPerHr} / Hr</div>
                </div>
              </div>

              {/* 6-Row Daypart Heatmap Matrix distributed evenly */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="grid grid-cols-[105px_1fr_1fr_1fr_1fr_1fr] gap-1 text-[8.5px] text-zinc-400 font-medium pb-0.5">
                  <span>Concept Type</span>
                  <span className="text-center">Bfast</span>
                  <span className="text-center">Lunch</span>
                  <span className="text-center">Sunset</span>
                  <span className="text-center">Dinner</span>
                  <span className="text-center">Late</span>
                </div>

                {[
                  { name: 'Specialty / Fine', heat: [1, 2, 3, 5, 3] },
                  { name: 'All-Day / Buffet', heat: [5, 4, 2, 4, 1] },
                  { name: 'Bars & Lounges', heat: [1, 2, 5, 4, 4] },
                  { name: 'Pool & Beach', heat: [1, 5, 4, 2, 1] },
                  { name: 'In-Villa Dining', heat: [4, 2, 3, 5, 4] },
                  { name: 'Banquet & Events', heat: [2, 3, 4, 5, 2] },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-[105px_1fr_1fr_1fr_1fr_1fr] gap-1 items-center">
                    <div className="truncate">
                      <span className="text-[9.5px] font-medium text-zinc-700">{row.name}</span>
                    </div>
                    {row.heat.map((v, i) => {
                      const bg =
                        v === 1
                          ? 'bg-zinc-100 text-zinc-400'
                          : v === 2
                            ? 'bg-zinc-200 text-zinc-600'
                            : v === 3
                              ? 'bg-zinc-400 text-white'
                              : v === 4
                                ? 'bg-zinc-700 text-white'
                                : 'bg-zinc-900 text-white';
                      return (
                        <div
                          key={i}
                          className={`h-5 rounded-[3px] ${bg} flex items-center justify-center text-[8px] font-medium`}
                        >
                          {v * 20}%
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>Peak Load: Dinner 7:00–9:30 PM ({fmtInt(m.fnb.seats)} Portfolio Seats)</span>
              <span className="text-zinc-700 font-medium">Benchmarks →</span>
            </div>
          </div>

          {/* MODULE 10: FORWARD DEMAND & TRADING OUTLOOK (7D / 30D / 90D) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Forward F&B Demand & Trading Outlook (Next 7 / 30 / 90 Days)',
                data: { key: 'FNB_HEADLINE_KPI', kpiId: 'forward', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  FORWARD DEMAND &amp; OUTLOOK
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Committed dining OTB &amp; forecast vs seat capacity
                </p>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-zinc-100 p-0.5 rounded-lg shrink-0"
              >
                {([7, 30, 90] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setForwardWindow(w)}
                    className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                      forwardWindow === w
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {w}D
                  </button>
                ))}
              </div>
            </div>

            {/* Left (52% Metrics) + Right (48% Vertical Stacked Bars) matching ForwardBusinessWidget */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 gap-3 flex-1 items-stretch">
                {/* Left: 5 Core Forward F&B Metrics */}
                <div className="col-span-6 flex flex-col justify-between py-0.5 pr-2 border-r border-zinc-100">
                  <div>
                    <div className="text-[8.5px] text-zinc-400 uppercase tracking-wider">
                      Expected F&amp;B Covers
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-sm font-bold text-zinc-900 leading-none">
                        {fmtInt(forwardOutlook.expectedCovers)}
                      </span>
                      <span className="text-[8.5px] font-medium px-1 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                        {fmtSignedPct(forwardOutlook.paceVsLyPct)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[8.5px] text-zinc-400 uppercase tracking-wider">
                      Resort Occ Forecast
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {fmtPct(forwardOutlook.forecastOccPct)}
                      </span>
                      <span className="text-[8.5px] font-medium text-[#14532d]">
                        {fmtPct(forwardOutlook.otbOccPct)} OTB
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[8.5px] text-zinc-400 uppercase tracking-wider">
                      Confirmed Dining OTB
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {fmtInt(forwardOutlook.otbCovers)}
                      </span>
                      <span className="text-[8.5px] font-medium text-zinc-500">
                        {fmtPct(forwardOutlook.otbCapPct, 0)} Cap
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[8.5px] text-zinc-400 uppercase tracking-wider">
                      Private Dining &amp; Events
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {fmtInt(forwardOutlook.events)} Evts
                      </span>
                      <span className="text-[8.5px] font-medium text-[#14532d]">
                        {fmtUsd(forwardOutlook.eventRevenue)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[8.5px] text-zinc-400 uppercase tracking-wider">
                      In-Villa Orders Est
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-bold text-zinc-900 leading-none">
                        {fmtInt(forwardOutlook.villaOrders)}
                      </span>
                      <span className="text-[8.5px] font-medium text-[#14532d]">
                        {fmtPct(forwardOutlook.villaSharePct, 0)} Share
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 3 Vertical Stacked Bars by Horizon Bucket */}
                <div className="col-span-6 flex flex-col justify-between py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-400">
                      Capacity Load
                    </span>
                    <div className="flex items-center gap-1.5 text-[7.5px] text-zinc-400">
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-xs bg-zinc-900 inline-block" /> OTB
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-xs bg-zinc-300 inline-block" /> Walk
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 flex-1 items-end pt-2 pb-1">
                    {forwardOutlook.buckets.map((b) => (
                      <div key={b.label} className="flex flex-col items-center h-full justify-end">
                        <div className="w-full h-24 bg-zinc-100 rounded-md overflow-hidden flex flex-col justify-end p-0.5">
                          <div
                            className="w-full bg-zinc-300 rounded-t-xs transition-all duration-300"
                            style={{ height: `${Math.min(100, b.walkPct)}%` }}
                          />
                          <div
                            className="w-full bg-zinc-900 rounded-b-xs transition-all duration-300"
                            style={{ height: `${Math.min(100, b.otbPct)}%` }}
                          />
                        </div>
                        <div className="mt-1 text-center">
                          <div className="text-[9px] font-bold text-zinc-800 leading-tight">{b.label}</div>
                          <div className="text-[8px] text-zinc-400 leading-tight">{fmtCompactInt(b.forecastCovers)}</div>
                          <span className="mt-0.5 inline-block text-[7.5px] font-semibold px-1 py-0.2 rounded bg-[#ecfdf5] text-[#14532d]">
                            {fmtPct(b.loadPct, 0)} Cap
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
                <span>
                  {fmtInt(forwardOutlook.expectedGuestNights)} Guest Nights Est · {fmtUsd(forwardOutlook.otbFnbRevenue)} F&amp;B OTB
                </span>
                <span className="text-zinc-700 font-medium">Outlook →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3 (4-4-4): Module 6 (Guest Spend & Origin Mix) | Modules 8 & 9 (Guest Experience & Menu Performance) | Modules 11 & 12 (Global Signals & Opportunity Tracker) */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* MODULE 6: GUEST SPEND & ORIGIN MIX */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Guest Spend & Origin Market Mix — Covers vs Unique Guests vs Transactions',
                data: { key: 'FNB_DEMAND_CAPTURE', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  GUEST SPEND &amp; ORIGIN MARKET MIX
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Distinguishing covers, dining guest-nights &amp; POS transactions
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                3 Denominators
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              {/* 3 Denominators Strip */}
              <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-zinc-100">
                <div>
                  <div className="text-[8px] text-zinc-400">Covers ({fmtCompactInt(m.fnb.covers)})</div>
                  <div className="text-[11px] font-bold text-zinc-900">${m.fnb.avgCheck.toFixed(0)} / Cvr</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Guest Nights ({fmtCompactInt(m.guestNights)})</div>
                  <div className="text-[11px] font-bold text-zinc-900">${m.fnb.spendPerGuestNight.toFixed(0)} / GN</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Checks ({fmtCompactInt(checks)})</div>
                  <div className="text-[11px] font-bold text-zinc-900">
                    ${checks > 0 ? Math.round(m.fnbRevenue / checks) : 0} / Tx
                  </div>
                </div>
              </div>

              {/* Origin Nationality Spend Table */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="grid grid-cols-12 text-[9px] font-medium text-zinc-400 pb-0.5">
                  <span className="col-span-6">Origin Market</span>
                  <span className="col-span-3 text-right">Capture</span>
                  <span className="col-span-3 text-right">Spend/GN</span>
                </div>
                {origins.map((r) => (
                  <div key={r.id} className="grid grid-cols-12 items-center py-1 text-[9.5px] border-b border-zinc-100/60 last:border-b-0">
                    <span className="col-span-6 font-medium text-zinc-700 truncate">{r.name}</span>
                    <span className="col-span-3 text-right text-[#14532d] font-medium">{fmtPct(r.capturePct)}</span>
                    <span className="col-span-3 text-right font-bold text-zinc-900">{fmtUsdFull(r.spendPerGuestNight)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>Click to inspect stay-stage &amp; origin spend behavior</span>
              <span className="text-zinc-700 font-medium">Details →</span>
            </div>
          </div>

          {/* MODULES 8 & 9: GUEST EXPERIENCE & MENU / SIGNATURE PERFORMANCE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'F&B Guest Experience, Reputation & Signature Menu Performance',
                data: { key: 'FNB_GUEST_EXPERIENCE', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  GUEST REPUTATION &amp; MENU LEADERS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Dining CSAT, recovery SLA, best-selling dishes &amp; beverage attach
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                {FNB_GUEST_EXPERIENCE.csat.toFixed(2)} / 5.0 CSAT
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2.5">
              <div className="grid grid-cols-3 gap-1.5 pb-2 border-b border-zinc-100">
                <div>
                  <div className="text-[8px] text-zinc-400">Complaint Rate</div>
                  <div className="text-[11px] font-bold text-[#14532d]">
                    {fmtPct(FNB_GUEST_EXPERIENCE.complaintRatePct)} (-0.3 pts)
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Recovery SLA</div>
                  <div className="text-[11px] font-bold text-zinc-900">
                    {FNB_GUEST_EXPERIENCE.recoveryMinutes}m ({fmtPct(FNB_GUEST_EXPERIENCE.recoverySlaPct, 0)})
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-400">Bev Share</div>
                  <div className="text-[11px] font-bold text-zinc-900">{fmtPct(m.fnb.bevSharePct)} Global</div>
                </div>
              </div>

              {/* Top Contribution Dishes & Signature Experiences */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="grid grid-cols-12 text-[9px] font-medium text-zinc-400 pb-0.5">
                  <span className="col-span-7">Top Signature Dish / Experience</span>
                  <span className="col-span-2 text-right">Margin</span>
                  <span className="col-span-3 text-right">Orders</span>
                </div>
                {signatureDishes.map((d) => (
                  <div key={d.name} className="grid grid-cols-12 items-center py-1 text-[9.5px] border-b border-zinc-100/60 last:border-b-0">
                    <span className="col-span-7 font-medium text-zinc-700 truncate">{d.short}</span>
                    <span className="col-span-2 text-right text-[#14532d] font-medium">{d.marginPct}%</span>
                    <span className="col-span-3 text-right font-bold text-zinc-900">{fmtInt(d.orders)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>Recurring theme: 8:00 PM prime dinner waitlist pressure</span>
              <span className="text-zinc-700 font-medium">Reputation →</span>
            </div>
          </div>

          {/* MODULES 11 & 12: GLOBAL OPERATIONAL SIGNALS & COMMERCIAL OPPORTUNITY TRACKER */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Global Operational Signals & Commercial Opportunity Tracker',
                data: { key: 'FNB_HEADLINE_KPI', kpiId: 'capture', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  OPERATIONAL SIGNALS &amp; OPPORTUNITIES
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Actionable exceptions &amp; +{fmtUsd(pipelineValue)} revenue opportunity pipeline
                </p>
              </div>
              <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d]">
                +{fmtUsd(pipelineValue)} Pipe
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              {operationalSignals.map((sig) => {
                const isRisk = sig.type === 'risk';
                return (
                  <div
                    key={sig.id}
                    className="py-1.5 px-1 rounded-lg hover:bg-zinc-200/40 transition-colors flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[9px] mt-0.5 ${
                          isRisk
                            ? 'bg-[#fff1f2] text-[#800020]'
                            : 'bg-[#ecfdf5] text-[#14532d]'
                        }`}
                      >
                        {isRisk ? '!' : '↑'}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[9.5px] font-bold text-zinc-900 truncate">{sig.title}</div>
                        <div className="text-[8.5px] text-zinc-500 truncate">{sig.confidence} · {sig.owner}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        isRisk
                          ? 'bg-[#fff1f2] text-[#800020]'
                          : 'bg-[#ecfdf5] text-[#14532d]'
                      }`}
                    >
                      {sig.exposure}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-zinc-400">
              <span>4 Active Initiatives · Accountable Regional Leaders Assigned</span>
            </div>
          </div>
        </div>
      </div>

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
