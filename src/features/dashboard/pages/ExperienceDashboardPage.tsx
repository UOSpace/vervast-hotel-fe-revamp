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
  getExperienceCategoryRows,
  getExperienceCollectionSummary,
  getExperienceHeadlineKpis,
  getExperienceResortRanking,
  getExperienceSegmentRows,
} from '@/data/portfolio/experienceMix';

/* ───────────────────────── DESIGN SYSTEM CONSTANTS ───────────────────────── */

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */

export function ExperienceDashboardPage() {
  const navigate = useNavigate();
  const { openDrawer } = useDashboardDrawer();

  // Filter States
  const [horizon, setHorizon] = useState<PeriodId>('mtd');
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [showDevModal, setShowDevModal] = useState(false);

  const m = getPortfolioMetrics(PORTFOLIO_PROPERTY_IDS, horizon);
  const activeHeadlineKpis = getExperienceHeadlineKpis(PORTFOLIO_PROPERTY_IDS, horizon);
  const categoryRows = getExperienceCategoryRows(m);
  const collectionRows = getExperienceCollectionSummary(horizon);
  const resortRanking = getExperienceResortRanking(PORTFOLIO_PROPERTY_IDS, horizon);
  const segmentRows = getExperienceSegmentRows(m);

  // Pure SVG Donut Geometry (size=110, strokeWidth=14 per AGENTS.md)
  const donutSize = 110;
  const donutStroke = 14;
  const donutRadius = (donutSize - donutStroke) / 2; // 48
  const donutCircumference = 2 * Math.PI * donutRadius;

  let cumulativePct = 0;
  const donutSegments = categoryRows.map((c) => {
    const share = c.revenueSharePct;
    const dash = (share / 100) * donutCircumference;
    const offset = -(cumulativePct / 100) * donutCircumference;
    cumulativePct += share;
    return { ...c, share, dash, offset };
  });

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 bg-white text-[10px]">
      {/* ───────────────────────── TOP EXECUTIVE HEADER ───────────────────────── */}
      <div className="shrink-0 flex flex-col gap-3 pt-4 lg:pt-6 animate-card-enter">
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
              As of: <strong className="font-semibold text-zinc-900">{PERIOD_DEFS[horizon].periodLabel}</strong>
            </span>
            <span className="text-zinc-300">·</span>
            <span>
              Global Portfolio View (Untuk detail operasional jadwal, jam puncak &amp; daftar aktivitas per resort, klik baris resort menuju{' '}
              <button
                type="button"
                onClick={() => navigate('/dashboard/experience/property')}
                className="text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-600 cursor-pointer"
              >
                Property View
              </button>
              )
            </span>
          </div>

          {/* Right Controls: Time Horizon (Yesterday | MTD | YTD) + Export */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
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

      {/* ───────────────────────── MAIN CONTENT GRID ───────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* 5 HEADLINE SUMMARY STATISTICS (Shared KPI Summary Structure) */}
        <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {activeHeadlineKpis.map((kpi) => (
            <div
              key={kpi.id}
              onClick={() =>
                openDrawer({
                  type: 'EXPERIENCE_DETAIL',
                  title: kpi.label,
                  data: {
                    key: 'EXP_HEADLINE_KPI',
                    kpiId: kpi.id,
                    horizon,
                    propertyIds: PORTFOLIO_PROPERTY_IDS,
                  },
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

        {/* ROW 1 (6-6): Portfolio Experience Revenue by Category | Activities & Revenue by Resort Collection */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 1. EXPERIENCE REVENUE BY CATEGORY (Portfolio Macro Pillar Mix) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: 'Experience Revenue & Peak Load by Activity Category',
                data: { key: 'EXP_CATEGORY_MIX', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  EXPERIENCE REVENUE BY CATEGORY
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Global portfolio experience revenue split across 6 macro activity pillars
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex items-center gap-5 flex-1">
              {/* Pure SVG Vector Donut */}
              <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
                <svg
                  width={donutSize}
                  height={donutSize}
                  viewBox={`0 0 ${donutSize} ${donutSize}`}
                  className="transform -rotate-90"
                >
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth={donutStroke}
                  />
                  {donutSegments.map((seg) => {
                    const isHovered = hoveredCat === seg.id;
                    const isDimmed = hoveredCat !== null && !isHovered;
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
                  <span className="text-xs font-bold text-zinc-900 leading-none">
                    {fmtUsd(m.experienceRevenue)}
                  </span>
                  <span className="text-[7.5px] text-zinc-400 font-medium mt-0.5">Portfolio Exp.</span>
                </div>
              </div>

              {/* Right Table */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                <div className="grid grid-cols-12 pb-1 px-1 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400">
                  <span className="col-span-6">Activity Pillar</span>
                  <span className="col-span-2 text-right">Share</span>
                  <span className="col-span-2 text-right">Peak Load</span>
                  <span className="col-span-2 text-right">Exp. Rev.</span>
                </div>
                {donutSegments.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCat(c.id)}
                    onMouseLeave={() => setHoveredCat(null)}
                    className="grid grid-cols-12 items-center py-0.5 px-1 rounded hover:bg-zinc-200/50 transition-colors tabular-nums"
                  >
                    <div className="col-span-6 flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-medium text-zinc-700 truncate">{c.name}</span>
                    </div>
                    <span className="col-span-2 text-[9.5px] text-zinc-500 text-right">
                      {fmtPct(c.revenueSharePct, 0)}
                    </span>
                    <span className="col-span-2 text-[9.5px] text-[#14532d] font-medium text-right">
                      {fmtPct(c.utilPct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(c.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. ACTIVITIES BY RESORT COLLECTION (Macro Comparison across 5 Collections) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: 'Experience Revenue & Peak Load by Resort Collection',
                data: { key: 'EXP_COMMERCIAL_MIX', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-6 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  ACTIVITIES BY RESORT COLLECTION
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Collection-specific activities, revenue, peak load &amp; avg. spend across 5 resort types
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-1.5">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-5">Collection &amp; Logical Activities</span>
                <span className="col-span-2 text-right">Exp. Rev.</span>
                <span className="col-span-2 text-right">Paid Pax</span>
                <span className="col-span-1 text-right">Load</span>
                <span className="col-span-2 text-right">Avg. Spend</span>
              </div>

              {collectionRows.map((col) => (
                <div key={col.categoryId} className="flex flex-col gap-1">
                  <div className="grid grid-cols-12 items-center tabular-nums">
                    <div className="col-span-5 min-w-0 pr-1">
                      <span className="text-[10px] font-medium text-zinc-800 truncate block">
                        {col.name}
                      </span>
                      <span className="text-[8px] text-zinc-400 truncate block">
                        {col.signatureActivities}
                      </span>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(col.revenue)}
                    </span>
                    <span className="col-span-2 text-[10px] text-zinc-600 text-right">
                      {fmtInt(col.paidAttendances)}
                    </span>
                    <span className="col-span-1 text-[9.5px] font-medium text-[#14532d] text-right">
                      {fmtPct(col.peakLoadPct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(col.avgSpend)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full"
                      style={{ width: `${Math.min(100, col.peakLoadPct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2 (7-5): Commercial Performance Ranking (All Resorts) | Portfolio Guest Segment Participation */}
        <div className="-mx-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 3. COMMERCIAL PERFORMANCE RANKING (Portfolio Resort Comparison) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: 'Commercial Performance Ranking — All SOSEI Resorts',
                data: { key: 'EXP_HEADLINE_KPI', kpiId: 'contribution', horizon, propertyIds: PORTFOLIO_PROPERTY_IDS },
              })
            }
            className={`lg:col-span-7 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  COMMERCIAL PERFORMANCE RANKING
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Resort signature activities, paid revenue, peak load, participation &amp; avg. spend (click row to open Property View)
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-3">Resort Property</span>
                <span className="col-span-3">Signature Activities</span>
                <span className="col-span-2 text-right">Exp. Rev.</span>
                <span className="col-span-1 text-right">Peak Load</span>
                <span className="col-span-1 text-right">Part.</span>
                <span className="col-span-2 text-right">Avg. Spend</span>
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
                      navigate(`/dashboard/experience/property?id=${prop.propertyId}`);
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
                    <div className="col-span-3 min-w-0 pr-1">
                      <div className="text-[9.5px] text-zinc-700 truncate">{prop.signatureFocus}</div>
                      <div className="text-[8px] text-zinc-400 truncate">{prop.peakSlotLabel}</div>
                    </div>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsd(prop.revenue)}
                    </span>
                    <span className="col-span-1 text-[9.5px] font-medium text-[#14532d] text-right">
                      {fmtPct(prop.peakLoadPct, 0)}
                    </span>
                    <span className="col-span-1 text-[10px] text-zinc-600 text-right">
                      {fmtPct(prop.participationPct, 0)}
                    </span>
                    <span className="col-span-2 text-[10px] font-medium text-zinc-900 text-right">
                      {fmtUsdFull(prop.avgSpend)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. GUEST SEGMENT PARTICIPATION & SPEND (Portfolio Guest Profile Mix) */}
          <div
            onClick={() =>
              openDrawer({
                type: 'EXPERIENCE_DETAIL',
                title: 'Guest Participation & Spend by Guest Segment',
                data: {
                  key: 'EXP_PARTICIPATION_CAPTURE',
                  horizon,
                  propertyIds: PORTFOLIO_PROPERTY_IDS,
                },
              })
            }
            className={`lg:col-span-5 ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4">
                  GUEST SEGMENT PARTICIPATION &amp; SPEND
                </h3>
                <p className="text-[9px] text-zinc-400 font-normal">
                  Portfolio guest conversion, activity frequency &amp; preferred experiences by segment
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span>See details</span> <RoundAltArrowRight size={10} />
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-12 text-[9.5px] font-medium text-zinc-400 pb-1 border-b border-zinc-100">
                <span className="col-span-5">Guest Segment</span>
                <span className="col-span-2 text-right">Eligible</span>
                <span className="col-span-2 text-right">Participants</span>
                <span className="col-span-2 text-right">Capture</span>
                <span className="col-span-1 text-right">Freq.</span>
              </div>
              {segmentRows.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-12 items-center py-2 text-[10px] border-b border-zinc-100/60 last:border-b-0 tabular-nums"
                >
                  <div className="col-span-5 min-w-0 pr-1">
                    <div className="font-medium text-zinc-800 truncate">{s.name}</div>
                    <div className="text-[8px] text-zinc-400 truncate">{s.pref}</div>
                  </div>
                  <span className="col-span-2 text-right text-zinc-600">{fmtInt(s.eligible)}</span>
                  <span className="col-span-2 text-right font-medium text-zinc-900">
                    {fmtInt(s.participants)}
                  </span>
                  <span className="col-span-2 text-right font-medium text-[#14532d]">
                    {fmtPct(s.partRatePct, 0)}
                  </span>
                  <span className="col-span-1 text-right font-medium text-zinc-900">
                    {s.activitiesPerStay.toFixed(1)}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName="Export Report"
      />
    </div>
  );
}
