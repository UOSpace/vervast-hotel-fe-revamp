import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AltArrowDown, RoundAltArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { HeaderClockDisplay } from '../components/widgets/DashboardHeaderWidget';
import {
  PERIOD_DEFS,
  PERIOD_ORDER,
  PORTFOLIO_PROPERTY_IDS,
  fmtInt,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
} from '@/data/portfolio';
import type { PeriodId } from '@/data/portfolio';
import {
  getFnbBigGroupEvents,
  getFnbCentres,
  getFnbCuisines,
  getFnbHeadlineKpis,
  getFnbOperationalSignals,
  getFnbOrigins,
  getFnbPortfolioOutlets,
  getFnbResortRanking,
} from '@/data/portfolio/fnbMix';
import type { FnbOutletGroupFilter } from '@/data/portfolio/fnbMix';

/* ───────────────────────── DESIGN SYSTEM CONSTANTS ───────────────────────── */

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */

export function FnbDashboardPage() {
  const navigate = useNavigate();
  const { openDrawer } = useDashboardDrawer();

  // Filter States
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [outletGroup, setOutletGroup] = useState<FnbOutletGroupFilter>('all');
  const [hoveredCentre, setHoveredCentre] = useState<string | null>(null);
  const [showDevModal, setShowDevModal] = useState(false);

  const m = getPortfolioMetrics(PORTFOLIO_PROPERTY_IDS, horizon);
  const activeHeadlineKpis = getFnbHeadlineKpis(PORTFOLIO_PROPERTY_IDS, horizon);
  const centres = getFnbCentres(m);
  const cuisines = getFnbCuisines(m);
  const resortRanking = getFnbResortRanking(PORTFOLIO_PROPERTY_IDS, horizon);
  const origins = getFnbOrigins(m);
  const portfolioOutlets = getFnbPortfolioOutlets(PORTFOLIO_PROPERTY_IDS, horizon);
  const bigGroupEvents = getFnbBigGroupEvents(PORTFOLIO_PROPERTY_IDS, horizon);
  const { signals: operationalSignals, pipelineValue } = getFnbOperationalSignals(PORTFOLIO_PROPERTY_IDS, horizon);

  const filteredOutlets =
    outletGroup === 'restaurant'
      ? portfolioOutlets.filter((o) => o.outletType === 'restaurant')
      : outletGroup === 'bar'
        ? portfolioOutlets.filter((o) => o.outletType === 'bar')
        : portfolioOutlets;

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
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
        <div className="w-full border-b border-zinc-200/80 pb-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">
              Welcome To SOSEI F&amp;B Dashboard
            </h1>
          </div>
          <HeaderClockDisplay />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div className="text-[9.5px] text-zinc-500 font-normal flex flex-wrap items-center gap-2">
            <span className="text-zinc-900 font-medium">
              As of: <strong className="font-semibold text-zinc-900">{PERIOD_DEFS[horizon].periodLabel}</strong>
            </span>
          </div>

          {/* Right Controls: Time Horizon (Today | MTD | YTD) + Export */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Time Horizon Filter Pills */}
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
        {/* 5 HEADLINE METRICS (Module 1: Global F&B Snapshot) */}
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
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                  {kpi.label}
                </span>
                <span
                  className={`inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                    kpi.vsLyPos
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
                <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                  {kpi.vsBudget}
                </span>
                <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                  {kpi.vsForecast}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 1 (4-4-4): F&B Revenue by Revenue Centre | Restaurant Category by Cuisine | Operational Signals & Opportunities */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* F&B REVENUE BY REVENUE CENTRE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'F&B Revenue by Revenue Centre — Whole Portfolio Split',
                data: { key: 'FNB_REVENUE_CENTRE_SCORECARD', centre: 'Fine & Specialty Dining', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  F&amp;B REVENUE BY REVENUE CENTRE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Whole portfolio F&amp;B revenue split across 6 operating centres
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
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
                  <span className="text-[7.5px] text-zinc-400 font-medium mt-0.5">Portfolio F&amp;B</span>
                </div>
              </div>

              {/* Right Table */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between gap-1.5 pb-1 px-1 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                  <span>Revenue Centre</span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span>Share %</span>
                    <span className="w-16 text-right">F&amp;B Revenue</span>
                  </div>
                </div>
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
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[9.5px] text-zinc-400 tabular-nums">{fmtPct(c.sharePct, 0)}</span>
                      <span className="text-[10px] font-medium text-zinc-900 w-16 text-right tabular-nums">{fmtUsd(c.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESTAURANT CATEGORY BY CUISINE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Global Restaurant Cuisine & Concept Intelligence',
                data: { key: 'FNB_AI_CUISINE_CATEGORY', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-4 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  RESTAURANT CATEGORY BY CUISINE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Portfolio cuisine revenue, food vs beverage split &amp; avg. check
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-4">Cuisine Category</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
                <span className="col-span-2 text-right">Food</span>
                <span className="col-span-2 text-right">Bev</span>
                <span className="col-span-2 text-right">Avg. Check</span>
              </div>

              {cuisines.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="grid grid-cols-12 items-center tabular-nums">
                    <div className="col-span-4 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-700 truncate block">{item.name}</span>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(item.revenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(item.foodRevenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(item.bevRevenue)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(item.avgCheck)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${Math.min(100, item.sharePct * 3)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPERATIONAL SIGNALS & OPPORTUNITIES */}
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
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  OPERATIONAL SIGNALS &amp; OPPORTUNITIES
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Portfolio-level exceptions &amp; +{fmtUsd(pipelineValue)} commercial opportunity pipeline
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
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
          </div>
        </div>

        {/* ROW 2 (6-6): Commercial Performance Ranking | Guest Spend & Origin Market Mix (Unified Matrix) */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* COMMERCIAL PERFORMANCE RANKING */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Commercial Performance Ranking — All Comparable Resorts',
                data: { key: 'FNB_HEADLINE_KPI', kpiId: 'revenue', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  COMMERCIAL PERFORMANCE RANKING
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Resort F&amp;B revenue, food &amp; beverage split, spend / GN, capture &amp; avg. check
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-3">Resort Property</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
                <span className="col-span-1 text-right">Food</span>
                <span className="col-span-1 text-right">Bev</span>
                <span className="col-span-2 text-right">Spend / GN</span>
                <span className="col-span-1 text-right">Capture</span>
                <span className="col-span-2 text-right">Avg. Check</span>
              </div>

              {resortRanking.slice(0, 6).map((prop) => {
                const dotColor =
                  prop.status === 'above_plan'
                    ? 'bg-[#14532d]'
                    : prop.status === 'attention'
                      ? 'bg-[#800020]'
                      : 'bg-zinc-500';
                return (
                  <div
                    key={prop.propertyId}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/fnb/property?id=${prop.propertyId}`);
                    }}
                    className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors tabular-nums"
                  >
                    <div className="col-span-3 flex items-center gap-1.5 min-w-0 pr-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-zinc-800 truncate">{prop.name}</div>
                        <div className="text-[8px] text-zinc-400 truncate">{prop.categoryName}</div>
                      </div>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(prop.revenue)}
                    </span>
                    <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(prop.foodRevenue)}
                    </span>
                    <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                      {fmtUsd(prop.bevRevenue)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(prop.spendPerGuestNight)}
                    </span>
                    <span className="col-span-1 text-[9.5px] font-medium text-[#14532d] text-right">
                      {fmtPct(prop.capturePct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(prop.avgCheck)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GUEST SPEND & ORIGIN MARKET MIX */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Guest Spend & Origin Market Mix — Commercial Matrix',
                data: { key: 'FNB_DEMAND_CAPTURE', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  GUEST SPEND &amp; ORIGIN MARKET MIX
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Origin market F&amp;B revenue, food &amp; beverage split, spend / GN, capture &amp; avg. check
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-3">Origin Market</span>
                <span className="col-span-2 text-right">F&amp;B Rev.</span>
                <span className="col-span-1 text-right">Food</span>
                <span className="col-span-1 text-right">Bev</span>
                <span className="col-span-2 text-right">Spend / GN</span>
                <span className="col-span-1 text-right">Capture</span>
                <span className="col-span-2 text-right">Avg. Check</span>
              </div>
              {origins.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-12 items-center py-1.5 text-[10px] border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                >
                  <div className="col-span-3 min-w-0 pr-1">
                    <div className="font-medium text-zinc-800 truncate">{r.name}</div>
                    <div className="text-[8px] text-zinc-400 truncate">{fmtPct(r.guestSharePct, 0)} of Guest Nights</div>
                  </div>
                  <span className="col-span-2 text-right font-medium text-zinc-900">{fmtUsd(r.revenue)}</span>
                  <span className="col-span-1 text-right text-zinc-600">{fmtUsd(r.foodRevenue)}</span>
                  <span className="col-span-1 text-right text-zinc-600">{fmtUsd(r.bevRevenue)}</span>
                  <span className="col-span-2 text-right font-medium text-zinc-900">{fmtUsdFull(r.spendPerGuestNight)}</span>
                  <span className="col-span-1 text-right text-[#14532d] font-medium">{fmtPct(r.capturePct, 0)}</span>
                  <span className="col-span-2 text-right font-medium text-zinc-900">{fmtUsdFull(r.avgCheck)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3 (6-6): All Restaurants & Bars Performance (Grouped by Type / Property) | Big Group Events & Weddings */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* ALL RESTAURANTS & BARS PERFORMANCE */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'All Restaurants & Bars Performance — Portfolio Outlet Directory',
                data: { key: 'FNB_PORTFOLIO_OUTLETS', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  ALL RESTAURANTS &amp; BARS PERFORMANCE
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Top F&amp;B outlets grouped by type or property — ranked by F&amp;B revenue
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center bg-zinc-100 p-0.5 rounded-lg"
                >
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'restaurant', label: 'Restaurants' },
                      { id: 'bar', label: 'Bars & Lounges' },
                      { id: 'property', label: 'By Property' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOutletGroup(tab.id)}
                      className={`px-2 py-0.5 rounded-md text-[8.5px] font-medium transition-all cursor-pointer ${
                        outletGroup === tab.id
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>See details</span> <RoundAltArrowRight size={10} />
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              {outletGroup === 'property' ? (
                <>
                  <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                    <span className="col-span-3">Resort Property</span>
                    <span className="col-span-3">Lead Outlet</span>
                    <span className="col-span-2 text-right">F&amp;B Rev.</span>
                    <span className="col-span-1 text-right">Food</span>
                    <span className="col-span-1 text-right">Bev</span>
                    <span className="col-span-2 text-right">Spend / GN</span>
                  </div>
                  {resortRanking.slice(0, 6).map((prop) => {
                    const topOutlet =
                      portfolioOutlets.find((o) => o.propertyId === prop.propertyId)?.outletName ?? 'Signature Dining';
                    return (
                      <div
                        key={prop.propertyId}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/fnb/property?id=${prop.propertyId}`);
                        }}
                        className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors tabular-nums"
                      >
                        <div className="col-span-3 min-w-0 pr-1">
                          <div className="text-[10px] font-medium text-zinc-800 truncate">{prop.name}</div>
                          <div className="text-[8px] text-zinc-400 truncate">{prop.categoryName}</div>
                        </div>
                        <span className="col-span-3 text-[9.5px] text-zinc-600 truncate pr-1">{topOutlet}</span>
                        <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                          {fmtUsd(prop.revenue)}
                        </span>
                        <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                          {fmtUsd(prop.foodRevenue)}
                        </span>
                        <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                          {fmtUsd(prop.bevRevenue)}
                        </span>
                        <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                          {fmtUsdFull(prop.spendPerGuestNight)}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                    <span className="col-span-4">Outlet &amp; Resort</span>
                    <span className="col-span-2">Category</span>
                    <span className="col-span-2 text-right">F&amp;B Rev.</span>
                    <span className="col-span-1 text-right">Food</span>
                    <span className="col-span-1 text-right">Bev</span>
                    <span className="col-span-2 text-right">Avg. Check</span>
                  </div>
                  {filteredOutlets.slice(0, 6).map((out) => (
                    <div
                      key={out.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/fnb/property?id=${out.propertyId}`);
                      }}
                      className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors tabular-nums"
                    >
                      <div className="col-span-4 min-w-0 pr-1">
                        <div className="text-[10px] font-medium text-zinc-800 truncate">{out.outletName}</div>
                        <div className="text-[8px] text-zinc-400 truncate">{out.propertyName}</div>
                      </div>
                      <span className="col-span-2 text-[9px] text-zinc-500 truncate pr-1">{out.typeLabel}</span>
                      <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                        {fmtUsd(out.revenue)}
                      </span>
                      <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                        {fmtUsd(out.foodRevenue)}
                      </span>
                      <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                        {fmtUsd(out.bevRevenue)}
                      </span>
                      <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                        {fmtUsdFull(out.avgCheck)}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* BIG GROUP EVENTS & WEDDINGS */}
          <div
            onClick={() =>
              openDrawer({
                type: 'FNB_DETAIL',
                title: 'Big Group Events, Weddings & Private Buyouts — F&B Readiness Radar',
                data: { key: 'FNB_BIG_GROUP_EVENTS', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  BIG GROUP EVENTS &amp; WEDDINGS
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  High-impact weddings, buyouts &amp; galas requiring F&amp;B operational attention
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2">
              {/* Top Summary Strip */}
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-zinc-100">
                <div>
                  <div className="text-[8.5px] text-zinc-400">Major Group Events</div>
                  <div className="text-xs font-bold text-zinc-900">
                    {bigGroupEvents.events.length} Flagship Events
                  </div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Total Event Guests</div>
                  <div className="text-xs font-bold text-zinc-900">{fmtInt(bigGroupEvents.totalPax)} Pax</div>
                </div>
                <div>
                  <div className="text-[8.5px] text-zinc-400">Contracted Event F&amp;B</div>
                  <div className="text-xs font-bold text-[#14532d]">{fmtUsd(bigGroupEvents.totalRevenue)}</div>
                </div>
              </div>

              {/* Events Table */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                  <span className="col-span-5">Event &amp; F&amp;B Attention</span>
                  <span className="col-span-2">Type · Date</span>
                  <span className="col-span-1 text-right">Pax</span>
                  <span className="col-span-2 text-right">F&amp;B Rev.</span>
                  <span className="col-span-2 text-right">Status</span>
                </div>

                {bigGroupEvents.events.slice(0, 5).map((evt) => {
                  const needsAction = evt.readinessStatus === 'Tasting Due' || evt.readinessStatus === 'VIP Prep';
                  return (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer({
                          type: 'FNB_DETAIL',
                          title: `${evt.eventName} — ${evt.propertyName}`,
                          data: { key: 'FNB_BIG_GROUP_EVENTS', eventId: evt.id, horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
                        });
                      }}
                      className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-100/60 last:border-b-0 hover:bg-zinc-200/40 rounded px-1 -mx-1 transition-colors"
                    >
                      <div className="col-span-5 min-w-0 pr-1.5">
                        <div className="text-[10px] font-medium text-zinc-800 truncate">
                          {evt.eventName} · <span className="text-zinc-500">{evt.propertyName}</span>
                        </div>
                        <div className="text-[8px] text-zinc-400 truncate">{evt.attentionNote}</div>
                      </div>
                      <div className="col-span-2 min-w-0 pr-1">
                        <div className="text-[9px] font-medium text-zinc-700 truncate">{evt.eventType}</div>
                        <div className="text-[8px] text-zinc-400">{evt.dateWindow}</div>
                      </div>
                      <span className="col-span-1 text-[10px] text-zinc-700 text-right">{evt.pax}</span>
                      <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                        {fmtUsd(evt.revenue)}
                      </span>
                      <div className="col-span-2 flex justify-end">
                        <span
                          className={`text-[8px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${
                            needsAction
                              ? 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                              : 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                          }`}
                        >
                          {evt.readinessStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </div>
  );
}
