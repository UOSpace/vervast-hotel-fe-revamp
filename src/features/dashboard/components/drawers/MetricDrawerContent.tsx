import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

import {
  getCategoryPerformance,
  simulatedCategoryPerformance,
  type PropertyPerformanceCategory,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtPct,
  fmtSignedPts,
  fmtSignedPct,
  fmtSignedUsd,
  type PeriodId,
} from '@/data/portfolio';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';
export type PropertyPerformanceItem = PropertyPerformanceCategory;
export const accuratePropertiesData: PropertyPerformanceCategory[] = simulatedCategoryPerformance;

const fmtDeltaUsdWithPct = (abs: number, pct: number, cmp: string) =>
  `${fmtSignedUsd(abs)} vs ${cmp} (${fmtSignedPct(pct)})`;

interface MetricDrawerContentProps {
  config: {
    title: string;
    data?: any;
  };
  theme?: string;
}

const PILLAR_COLORS = ['#0f172a', '#334155', '#64748b', '#cbd5e1'];
const PILLAR_NAMES: Record<string, string> = { Rooms: 'Rooms', 'F&B': 'F&B', Spa: 'Spa', Act: 'Activities' };

/** Parses "Rooms $118M · F&B $22M · ..." into pillar entries; returns null for other formats. */
function parsePillars(text: string): { name: string; value: string; amount: number }[] | null {
  if (!/^Rooms \$/.test(text)) return null;
  const items = text.split(' · ').map((part) => {
    const idx = part.lastIndexOf(' ');
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    const num = parseFloat(value.replace(/[$,]/g, ''));
    const mult = /B$/.test(value) ? 1e9 : /M$/.test(value) ? 1e6 : /K$/.test(value) ? 1e3 : 1;
    return { name: PILLAR_NAMES[key] ?? key, value, amount: (isNaN(num) ? 0 : num) * mult };
  });
  return items.length > 1 && items.every((i) => i.amount > 0) ? items : null;
}

export function MetricDrawerContent({ config, theme }: MetricDrawerContentProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const initialHorizon: TimeHorizon =
    (config.data && typeof config.data === 'object' && (config.data.horizon || config.data.period)) || 'mtd';
  const [horizon, setHorizon] = useState<TimeHorizon>(initialHorizon);

  useEffect(() => {
    const nextH = config.data && typeof config.data === 'object' && (config.data.horizon || config.data.period);
    if (nextH === 'today' || nextH === 'mtd' || nextH === 'ytd') {
      setHorizon(nextH);
    }
  }, [config.data?.horizon, config.data?.period]);

  const t = config.title.toUpperCase();
  const propName = config.data?.propertyName;

  const isOcc = t.includes('OCCUPANCY');
  const isAdr = t.includes('ADR');
  const isRevPar = t.includes('REVPAR');
  const isTotalHotelRev = t.includes('TOTAL HOTEL REVENUE') || t.includes('TOTAL REVENUE');
  const isRoomRev = t.includes('ROOM REVENUE') || (!isTotalHotelRev && t.includes('REVENUE'));
  const isLos = t.includes('STAY') || t.includes('LOS') || t.includes('LENGTH');
  const isRev = isTotalHotelRev || isRoomRev;

  const periodId: PeriodId = horizon;
  const periodDef = PERIOD_DEFS[periodId];
  const activePeriodLabel = periodDef.periodLabel;
  const pm = getPortfolioMetrics(undefined, periodId);
  const categories = getCategoryPerformance(periodId);
  const topCatByAdr = [...categories].sort((a, b) => b.adrNum - a.adrNum)[0] || categories[0];

  const getMetricConfig = () => {
    if (isOcc) {
      const targetOcc = Math.round((pm.occupancyPct - pm.vsBudget.occupancyPts) * 10) / 10;
      const heroVal = fmtPct(pm.occupancyPct, 1);
      const heroTr = `${fmtSignedPts(pm.vsLy.occupancyPts)} vs LY`;
      const targetVal = fmtPct(targetOcc, 1);
      const varTxt = `${fmtSignedPts(pm.vsBudget.occupancyPts)} vs Budget · ${fmtSignedPts(pm.vsForecast.occupancyPts)} vs Forecast`;
      const ctxVal =
        horizon === 'today'
          ? `${pm.roomsSold.toLocaleString()} / ${pm.availableRoomNights.toLocaleString()} Rooms`
          : `${Math.round(pm.roomsSold / pm.days).toLocaleString()} / ${pm.rooms.toLocaleString()} Avg Rooms (${pm.roomsSold.toLocaleString()} RN)`;

      if (horizon === 'today') {
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Real-time realized occupancy vs budget and forecast across luxury sanctuaries (Today Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Rooms Occupied Today',
          contextValue: ctxVal,
          yAxisSuffix: '%',
          chartTitle: "Today's Intraday Occupancy Progression",
          chartData: [
            { date: '08:00', value: Math.round((pm.occupancyPct - 8.4) * 10) / 10, target: targetOcc },
            { date: '10:00', value: Math.round((pm.occupancyPct - 5.6) * 10) / 10, target: targetOcc },
            { date: '12:00', value: Math.round((pm.occupancyPct - 3.3) * 10) / 10, target: targetOcc },
            { date: '14:00', value: Math.round((pm.occupancyPct - 1.7) * 10) / 10, target: targetOcc },
            { date: '16:00', value: Math.round((pm.occupancyPct - 0.6) * 10) / 10, target: targetOcc },
            { date: '18:00', value: pm.occupancyPct, target: targetOcc },
            { date: '20:00', value: Math.round((pm.occupancyPct + 0.2) * 10) / 10, target: targetOcc },
            { date: '22:00', value: pm.occupancyPct, target: targetOcc },
          ],
          targetLine: targetOcc,
          drivers: [
            `Today occupancy reached ${heroVal}, outperforming LY by ${fmtSignedPts(pm.vsLy.occupancyPts)} and budget by ${fmtSignedPts(pm.vsBudget.occupancyPts)}.`,
            'Early check-ins across SOSEI Ski and SOSEI Beach Resort accelerated midday room utilization.',
            'Minimal same-day cancellations (<0.8%) recorded across all 10 luxury properties.',
            'Corporate retreat buyouts in SOSEI Urban lifted city sanctuary occupancy today.',
          ],
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Cumulative realized occupancy vs budget and forecast across luxury sanctuaries (YTD Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Average Rooms Occupied (YTD)',
          contextValue: ctxVal,
          yAxisSuffix: '%',
          chartTitle: 'Monthly Occupancy Cadence (Jan – Oct)',
          chartData: [
            { date: 'Jan', value: 73.2, target: targetOcc },
            { date: 'Feb', value: 76.4, target: targetOcc },
            { date: 'Mar', value: 77.8, target: targetOcc },
            { date: 'Apr', value: 74.1, target: targetOcc },
            { date: 'May', value: 73.5, target: targetOcc },
            { date: 'Jun', value: 75.8, target: targetOcc },
            { date: 'Jul', value: 78.2, target: targetOcc },
            { date: 'Aug', value: 79.0, target: targetOcc },
            { date: 'Sep', value: 75.1, target: targetOcc },
            { date: 'Oct', value: pm.occupancyPct, target: targetOcc },
          ],
          targetLine: targetOcc,
          drivers: [
            `Cumulative YTD occupancy maintained at ${heroVal}, ${fmtSignedPts(pm.vsLy.occupancyPts)} higher than the same period last year.`,
            'Consistent peak summer yields and early winter bookings sustained steady momentum across quarters.',
            'Direct bookings via SOSEI Concierge accounted for 44% of cumulative room nights.',
            'Group and luxury consortia commitments locked in high baseline occupancies across all 5 collections.',
          ],
        };
      } else {
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Daily realized occupancy vs budget and forecast across luxury sanctuaries (MTD Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Rooms Occupied MTD',
          contextValue: ctxVal,
          yAxisSuffix: '%',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Oct 04', value: 71.8, target: targetOcc },
            { date: 'Oct 05', value: 72.4, target: targetOcc },
            { date: 'Oct 06', value: 73.1, target: targetOcc },
            { date: 'Oct 07', value: 74.5, target: targetOcc },
            { date: 'Oct 08', value: 77.4, target: targetOcc },
            { date: 'Oct 09', value: 78.8, target: targetOcc },
            { date: 'Oct 10', value: 76.2, target: targetOcc },
            { date: 'Oct 11', value: 73.5, target: targetOcc },
            { date: 'Oct 12', value: 72.9, target: targetOcc },
            { date: 'Oct 13', value: 73.8, target: targetOcc },
            { date: 'Oct 14', value: 74.9, target: targetOcc },
            { date: 'Oct 15', value: 77.1, target: targetOcc },
            { date: 'Oct 16', value: 78.0, target: targetOcc },
            { date: 'Oct 17', value: pm.occupancyPct, target: targetOcc },
          ],
          targetLine: targetOcc,
          drivers: [
            `Strong leisure demand across all 5 collections driving ${heroVal} portfolio occupancy.`,
            `Occupancy outperforming LY by ${fmtSignedPts(pm.vsLy.occupancyPts)}, budget by ${fmtSignedPts(pm.vsBudget.occupancyPts)}, and forecast by ${fmtSignedPts(pm.vsForecast.occupancyPts)}.`,
            'Direct bookings via SOSEI Privilege Concierge accounted for 42% of total room nights with minimal cancellations.',
            'Corporate retreat buyouts in SOSEI Urban lifted midweek room occupancy by 12%.',
          ],
        };
      }
    } else if (isAdr) {
      const targetAdr = Math.round(pm.adr - pm.vsBudget.adrAbs);
      const heroVal = fmtUsd(pm.adr);
      const heroTr = fmtDeltaUsdWithPct(pm.vsLy.adrAbs, pm.vsLy.adrPct, 'LY');
      const targetVal = fmtUsd(targetAdr);
      const varTxt = `${fmtDeltaUsdWithPct(pm.vsBudget.adrAbs, pm.vsBudget.adrPct, 'Budget')} · ${fmtDeltaUsdWithPct(pm.vsForecast.adrAbs, pm.vsForecast.adrPct, 'Forecast')}`;
      const ctxVal = `${topCatByAdr.name} (${topCatByAdr.adr})`;

      if (horizon === 'today') {
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Realized daily rate yield vs budget and forecast across luxury room tiers (Today Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Top Performing Today',
          contextValue: ctxVal,
          yAxisSuffix: '',
          chartTitle: "Today's Room Tier Realized ADR Cadence",
          chartData: [
            { date: '08:00', value: pm.adr - 45, target: targetAdr },
            { date: '10:00', value: pm.adr - 20, target: targetAdr },
            { date: '12:00', value: pm.adr - 5, target: targetAdr },
            { date: '14:00', value: pm.adr + 10, target: targetAdr },
            { date: '16:00', value: pm.adr + 15, target: targetAdr },
            { date: '18:00', value: pm.adr + 5, target: targetAdr },
            { date: '20:00', value: pm.adr, target: targetAdr },
            { date: '22:00', value: pm.adr, target: targetAdr },
          ],
          targetLine: targetAdr,
          drivers: [
            `ADR for active stays today reached ${heroVal}, up ${heroTr} and ${fmtDeltaUsdWithPct(pm.vsBudget.adrAbs, pm.vsBudget.adrPct, 'Budget')}.`,
            'High-tier villa check-ins in Switzerland and Maldives secured nightly rates above $2,400.',
            'Dynamic rate adjustments captured strong last-minute autumn getaway demand.',
            'Direct booking rate integrity protected pricing power without third-party discounting.',
          ],
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Cumulative realized daily rate yield vs budget and forecast across luxury room tiers (YTD Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Top Performing Collection',
          contextValue: ctxVal,
          yAxisSuffix: '',
          chartTitle: 'Monthly ADR Cadence (Jan – Oct)',
          chartData: [
            { date: 'Jan', value: pm.adr + 40, target: targetAdr },
            { date: 'Feb', value: pm.adr + 55, target: targetAdr },
            { date: 'Mar', value: pm.adr + 20, target: targetAdr },
            { date: 'Apr', value: pm.adr - 30, target: targetAdr },
            { date: 'May', value: pm.adr - 45, target: targetAdr },
            { date: 'Jun', value: pm.adr - 15, target: targetAdr },
            { date: 'Jul', value: pm.adr + 30, target: targetAdr },
            { date: 'Aug', value: pm.adr + 45, target: targetAdr },
            { date: 'Sep', value: pm.adr - 5, target: targetAdr },
            { date: 'Oct', value: pm.adr, target: targetAdr },
          ],
          targetLine: targetAdr,
          drivers: [
            `Cumulative YTD ADR expanded to ${heroVal}, delivering ${heroTr} sustainable premium pricing.`,
            'Consistent suite and villa upsells delivered premium yield across all 10 sanctuaries.',
            'Presidential and Mountain Chalet bookings contributed disproportionate ADR expansion.',
            'Rate yield management strategy protected minimum nightly thresholds across seasons.',
          ],
        };
      } else {
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Realized daily rate yield vs budget and forecast across luxury room tiers (MTD Actuals)',
          heroValue: heroVal,
          heroTrend: heroTr,
          heroTrendUp: true,
          targetValue: targetVal,
          varianceText: varTxt,
          contextLabel: 'Top Performing Collection',
          contextValue: ctxVal,
          yAxisSuffix: '',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Oct 04', value: pm.adr - 30, target: targetAdr },
            { date: 'Oct 05', value: pm.adr - 15, target: targetAdr },
            { date: 'Oct 06', value: pm.adr - 5, target: targetAdr },
            { date: 'Oct 07', value: pm.adr + 10, target: targetAdr },
            { date: 'Oct 08', value: pm.adr + 55, target: targetAdr },
            { date: 'Oct 09', value: pm.adr + 75, target: targetAdr },
            { date: 'Oct 10', value: pm.adr + 40, target: targetAdr },
            { date: 'Oct 11', value: pm.adr - 10, target: targetAdr },
            { date: 'Oct 12', value: pm.adr - 20, target: targetAdr },
            { date: 'Oct 13', value: pm.adr - 5, target: targetAdr },
            { date: 'Oct 14', value: pm.adr + 15, target: targetAdr },
            { date: 'Oct 15', value: pm.adr + 60, target: targetAdr },
            { date: 'Oct 16', value: pm.adr + 75, target: targetAdr },
            { date: 'Oct 17', value: pm.adr, target: targetAdr },
          ],
          targetLine: targetAdr,
          drivers: [
            `ADR expanded to ${heroVal} MTD, delivering a ${heroTr} rate increase across destinations.`,
            `Outperforming budget benchmark by ${fmtDeltaUsdWithPct(pm.vsBudget.adrAbs, pm.vsBudget.adrPct, 'Budget')} driven by suite yields.`,
            'Presidential and Royal Villa upgrades maintained an average nightly rate of $2,450+ across destinations.',
            'Direct booking rate integrity ensured zero OTA discounting across luxury sanctuaries.',
          ],
        };
      }
    } else if (isRevPar) {
      const targetRevpar = Math.round(pm.revpar - pm.vsBudget.revparAbs);
      const heroVal = fmtUsd(pm.revpar);
      const heroTr = fmtDeltaUsdWithPct(pm.vsLy.revparAbs, pm.vsLy.revparPct, 'LY');
      const targetVal = fmtUsd(targetRevpar);
      const varTxt = `${fmtDeltaUsdWithPct(pm.vsBudget.revparAbs, pm.vsBudget.revparPct, 'Budget')} · ${fmtDeltaUsdWithPct(pm.vsForecast.revparAbs, pm.vsForecast.revparPct, 'Forecast')}`;
      const trevpar = Math.round(pm.trevpar);
      const ctxVal = `${fmtUsd(trevpar)} (Total Rev/Room)`;

      return {
        title: 'Revenue Per Available Room (RevPAR) Performance',
        subtitle: `Yield efficiency benchmark combining occupancy volume and ADR pricing power (${periodDef.label} Actuals)`,
        heroValue: heroVal,
        heroTrend: heroTr,
        heroTrendUp: true,
        targetValue: targetVal,
        varianceText: varTxt,
        contextLabel: `${periodDef.label} Portfolio TRevPAR`,
        contextValue: ctxVal,
        yAxisSuffix: '',
        chartTitle:
          horizon === 'today'
            ? "Today's Intraday RevPAR Cadence"
            : horizon === 'ytd'
            ? 'Monthly RevPAR Cadence (Jan – Oct)'
            : 'Past 14 Days Realized Daily Trend vs Target',
        chartData: [
          { date: 'P1', value: pm.revpar - 48, target: targetRevpar },
          { date: 'P2', value: pm.revpar - 28, target: targetRevpar },
          { date: 'P3', value: pm.revpar - 12, target: targetRevpar },
          { date: 'P4', value: pm.revpar + 15, target: targetRevpar },
          { date: 'P5', value: pm.revpar + 65, target: targetRevpar },
          { date: 'P6', value: pm.revpar + 82, target: targetRevpar },
          { date: 'P7', value: pm.revpar + 35, target: targetRevpar },
          { date: 'Current', value: pm.revpar, target: targetRevpar },
        ],
        targetLine: targetRevpar,
        drivers: [
          `RevPAR reached ${heroVal} (${periodDef.label}), up ${heroTr} and ${fmtDeltaUsdWithPct(pm.vsBudget.revparAbs, pm.vsBudget.revparPct, 'Budget')}.`,
          `Balanced yield expansion achieved through healthy occupancy (${fmtPct(pm.occupancyPct, 1)}) and ADR (${fmtUsd(pm.adr)}).`,
          `${topCatByAdr.name} led yield with ${topCatByAdr.revpar} RevPAR across destinations.`,
          'Minimum stay restrictions on weekends preserved pricing power and eliminated single-night vacancy drag.',
        ],
      };
    } else if (isTotalHotelRev) {
      const targetRev = pm.totalRevenue - pm.vsBudget.totalRevenueAbs;
      const targetRevM = Math.round((targetRev / 1_000_000) * 100) / 100;
      const actualRevM = Math.round((pm.totalRevenue / 1_000_000) * 100) / 100;
      const heroVal = `${fmtUsd(pm.totalRevenue)} ${periodDef.label}`;
      const heroTr = `${fmtSignedPct(pm.vsLy.totalRevenuePct)} vs LY`;
      const targetVal = `${fmtUsd(targetRev)} Target`;
      const varTxt = `${fmtDeltaUsdWithPct(pm.vsBudget.totalRevenueAbs, pm.vsBudget.totalRevenuePct, 'Budget')} · ${fmtDeltaUsdWithPct(pm.vsForecast.totalRevenueAbs, pm.vsForecast.totalRevenuePct, 'Forecast')}`;
      const ctxVal = `Rooms ${fmtUsd(pm.roomRevenue)} · F&B ${fmtUsd(pm.fnbRevenue)} · Spa ${fmtUsd(pm.spaRevenue)} · Act ${fmtUsd(pm.experienceRevenue)}`;

      return {
        title: 'Total Hotel Revenue (5 Hospitality Pillars)',
        subtitle: `Total hotel business revenue across all 5 hospitality pillars (${periodDef.label} Actuals)`,
        heroValue: heroVal,
        heroTrend: heroTr,
        heroTrendUp: true,
        targetValue: targetVal,
        varianceText: varTxt,
        contextLabel: `5 Hospitality Pillars (${periodDef.label})`,
        contextValue: ctxVal,
        yAxisSuffix: 'M',
        chartTitle: `Total Hotel Revenue Progression (${periodDef.label} in $M)`,
        chartData: [
          { date: 'T-6', value: Math.round(actualRevM * 0.91 * 100) / 100, target: targetRevM },
          { date: 'T-5', value: Math.round(actualRevM * 0.94 * 100) / 100, target: targetRevM },
          { date: 'T-4', value: Math.round(actualRevM * 0.96 * 100) / 100, target: targetRevM },
          { date: 'T-3', value: Math.round(actualRevM * 0.98 * 100) / 100, target: targetRevM },
          { date: 'T-2', value: Math.round(actualRevM * 1.03 * 100) / 100, target: targetRevM },
          { date: 'T-1', value: Math.round(actualRevM * 1.01 * 100) / 100, target: targetRevM },
          { date: 'Now', value: actualRevM, target: targetRevM },
        ],
        targetLine: targetRevM,
        drivers: [
          `Total hotel business revenue generated ${fmtUsd(pm.totalRevenue)} (${periodDef.label}), outperforming LY (${fmtSignedPct(pm.vsLy.totalRevenuePct)}) and budget (${fmtSignedPct(pm.vsBudget.totalRevenuePct)}).`,
          `Rooms revenue anchored total performance with ${fmtUsd(pm.roomRevenue)} recognized across active stays.`,
          `Food & Beverage generated ${fmtUsd(pm.fnbRevenue)} across Michelin-starred dining and private banqueting.`,
          `Spa & Wellness (${fmtUsd(pm.spaRevenue)}) and Activities & Packages (${fmtUsd(pm.experienceRevenue)}) contributed high-margin ancillary revenue.`,
        ],
      };
    } else if (isRoomRev) {
      const targetRev = pm.roomRevenue - pm.vsBudget.roomRevenueAbs;
      const targetRevM = Math.round((targetRev / 1_000_000) * 100) / 100;
      const actualRevM = Math.round((pm.roomRevenue / 1_000_000) * 100) / 100;
      const heroVal = `${fmtUsd(pm.roomRevenue)} ${periodDef.label}`;
      const heroTr = fmtDeltaUsdWithPct(pm.vsLy.roomRevenueAbs, pm.vsLy.roomRevenuePct, 'LY');
      const targetVal = `${fmtUsd(targetRev)} Target`;
      const varTxt = `${fmtDeltaUsdWithPct(pm.vsBudget.roomRevenueAbs, pm.vsBudget.roomRevenuePct, 'Budget')} · ${fmtDeltaUsdWithPct(pm.vsForecast.roomRevenueAbs, pm.vsForecast.roomRevenuePct, 'Forecast')}`;
      const roomsShare = pm.totalRevenue > 0 ? (pm.roomRevenue / pm.totalRevenue) * 100 : 77.6;

      return {
        title: 'Room Revenue Performance',
        subtitle: `Realized room revenue generation (${periodDef.label} Actuals)`,
        heroValue: heroVal,
        heroTrend: heroTr,
        heroTrendUp: true,
        targetValue: targetVal,
        varianceText: varTxt,
        contextLabel: 'Share of Hotel Revenue',
        contextValue: `${fmtPct(roomsShare, 1)} of Total Hotel Business`,
        yAxisSuffix: 'M',
        chartTitle: `Room Revenue Cadence (${periodDef.label} in $M)`,
        chartData: [
          { date: 'T-6', value: Math.round(actualRevM * 0.91 * 100) / 100, target: targetRevM },
          { date: 'T-5', value: Math.round(actualRevM * 0.94 * 100) / 100, target: targetRevM },
          { date: 'T-4', value: Math.round(actualRevM * 0.96 * 100) / 100, target: targetRevM },
          { date: 'T-3', value: Math.round(actualRevM * 0.98 * 100) / 100, target: targetRevM },
          { date: 'T-2', value: Math.round(actualRevM * 1.03 * 100) / 100, target: targetRevM },
          { date: 'T-1', value: Math.round(actualRevM * 1.01 * 100) / 100, target: targetRevM },
          { date: 'Now', value: actualRevM, target: targetRevM },
        ],
        targetLine: targetRevM,
        drivers: [
          `Room Revenue reached ${fmtUsd(pm.roomRevenue)} (${periodDef.label}), delivering ${heroTr} and ${fmtDeltaUsdWithPct(pm.vsBudget.roomRevenueAbs, pm.vsBudget.roomRevenuePct, 'Budget')}.`,
          `Average Daily Rate (${fmtUsd(pm.adr)}) and ${fmtPct(pm.occupancyPct, 1)} occupancy drove strong top-line room yields across all collections.`,
          'SOSEI Ski and SOSEI Beach Resort generated the highest collection room revenue shares.',
          'Strong booking pace for upcoming dates projected to sustain revenue momentum.',
        ],
      };
    } else if (isLos) {
      const baseLos = horizon === 'today' ? '4.4 Nights' : horizon === 'ytd' ? '4.1 Nights' : '4.2 Nights';
      const losVal = propName && config.data?.los ? `${config.data.los} Nights` : baseLos;
      return {
        title: propName ? `${propName} — Average Length of Stay` : 'Average Length of Stay (ALOS) Performance',
        subtitle: propName
          ? `Realized guest length of stay across leisure and retreat stays at ${propName}`
          : `Average guest duration across destinations and stay portfolios (${periodDef.label} Actuals)`,
        heroValue: losVal,
        heroTrend: '+0.3 Nights vs LY',
        heroTrendUp: true,
        targetValue: '3.8 Nights',
        varianceText: '+0.4 Nights vs Target Benchmark',
        contextLabel: 'Top Segment by Stay',
        contextValue: 'Leisure & Retreats (5.2 Nights)',
        yAxisSuffix: ' N',
        chartTitle: `Length of Stay Cadence (${periodDef.label})`,
        chartData: [
          { date: 'Oct 11', value: 3.9, target: 3.8 },
          { date: 'Oct 12', value: 4.0, target: 3.8 },
          { date: 'Oct 13', value: 4.1, target: 3.8 },
          { date: 'Oct 14', value: 4.3, target: 3.8 },
          { date: 'Oct 15', value: 4.5, target: 3.8 },
          { date: 'Oct 16', value: 4.4, target: 3.8 },
          { date: 'Oct 17', value: 4.2, target: 3.8 },
        ],
        targetLine: 3.8,
        drivers: [
          'Strong leisure and wellness retreat bookings generating average stay lengths exceeding 4.5 nights.',
          'Direct bookings through private butler concierge yield 5.2 nights average length of stay.',
          'Zero early departures recorded across multi-bedroom villas and private mountain chalets.',
        ],
      };
    } else {
      const guests = pm.avgDailyInHouseGuests;
      return {
        title: 'Total In-House Guests & Activity Volume',
        subtitle: `Guest headcount and volume across active properties (${periodDef.label} Actuals)`,
        heroValue: `${guests.toLocaleString()} Guests`,
        heroTrend: '+12.0% YoY',
        heroTrendUp: true,
        targetValue: `${Math.round(guests * 0.92).toLocaleString()} Budgeted`,
        varianceText: `+${Math.round(guests * 0.08).toLocaleString()} Guests Above Expectation`,
        contextLabel: 'Occupied Room Nights',
        contextValue: `${pm.roomsSold.toLocaleString()} Room Nights`,
        yAxisSuffix: '',
        chartTitle: 'Guest Volume Trend vs Target',
        chartData: [
          { date: 'T-5', value: Math.round(guests * 0.94), target: Math.round(guests * 0.92) },
          { date: 'T-4', value: Math.round(guests * 0.96), target: Math.round(guests * 0.92) },
          { date: 'T-3', value: Math.round(guests * 0.98), target: Math.round(guests * 0.92) },
          { date: 'T-2', value: Math.round(guests * 1.03), target: Math.round(guests * 0.92) },
          { date: 'T-1', value: Math.round(guests * 1.01), target: Math.round(guests * 0.92) },
          { date: 'Now', value: guests, target: Math.round(guests * 0.92) },
        ],
        targetLine: Math.round(guests * 0.92),
        drivers: [
          'High repeat guest ratio (38%) returning for autumn seasonal retreats.',
          'Average length of stay increased to 4.2 nights across all sanctuaries.',
          'Strong multi-generational family bookings during the autumn window.',
          'VIP arrivals scheduled include high-net-worth delegations across all 5 collections.',
        ],
      };
    }
  };

  const m = getMetricConfig();

  // Dynamically compute collection table rows from portfolio engine for active horizon
  const dynamicPropertiesData = categories.map((cat) => ({
    ...cat,
    revenue:
      isRoomRev && !isTotalHotelRev
        ? fmtUsd(cat.metrics.roomRevenue)
        : fmtUsd(cat.metrics.totalRevenue),
    children: cat.children.map((ch) => ({
      ...ch,
      revenue:
        isRoomRev && !isTotalHotelRev
          ? fmtUsd(ch.metrics.roomRevenue)
          : fmtUsd(ch.metrics.totalRevenue),
    })),
  }));

  const footerSummary = {
    occ: fmtPct(pm.occupancyPct, 1),
    adr: fmtUsd(pm.adr),
    revenue:
      isRoomRev && !isTotalHotelRev
        ? fmtUsd(pm.roomRevenue)
        : fmtUsd(pm.totalRevenue),
    revpar: fmtUsd(pm.revpar),
  };

  const pillars = parsePillars(m.contextValue);
  const pillarTotal = pillars ? pillars.reduce((s, p) => s + p.amount, 0) : 1;

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Filter Bar: Subtitle & Period + Horizon Filter Tabs (Today | MTD | YTD) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500 font-normal">{m.subtitle}</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Active Period: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activePeriodLabel}</span>
          </p>
        </div>

        {/* Executive Time Horizon Tabs: Today | MTD | YTD */}
        <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg shrink-0">
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
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {h === 'today' ? 'Today' : h.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Realized Performance</span>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.heroValue}</div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
              ↑ {m.heroTrend}
            </span>
          </div>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Budget Benchmark</span>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.targetValue}</div>
            <div className="mt-1 flex flex-col gap-0.5">
              {String(m.varianceText).split(' · ').map((v) => (
                <span key={v} className="text-[10px] text-emerald-700 font-medium block">{v}</span>
              ))}
            </div>
          </div>
        </div>
        {pillars ? (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{m.contextLabel}</span>
            <div>
              <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
                {pillars.map((p, i) => (
                  <div key={p.name} style={{ width: `${(p.amount / pillarTotal) * 100}%`, backgroundColor: PILLAR_COLORS[i] }} />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {pillars.map((p, i) => (
                  <div key={p.name} className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PILLAR_COLORS[i] }} />
                      <span className="text-[9px] text-zinc-500 font-medium truncate">{p.name}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">{p.value}</div>
                    <div className="text-[9px] text-zinc-400">{((p.amount / pillarTotal) * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{m.contextLabel}</span>
            <div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.contextValue}</div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Portfolio Operational Status</span>
            </div>
          </div>
        )}
      </div>

      {/* Realized Cadence / Trend Chart with ReferenceLine for Target */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {m.chartTitle}
          </span>
          <div className="flex items-center gap-3 text-[9.5px]">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <span className="w-2.5 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              <span>Actual Realized</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-400" />
              <span>Target ({m.targetValue})</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="metricDrawerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                tickFormatter={(v: number) => (isRev ? `$${v}M` : isOcc ? `${v}%` : `$${v}`)}
                width={45}
              />
              <Tooltip
                formatter={(val: any) => [
                  isRev ? `$${Number(val).toFixed(2)}M` : isOcc ? `${val}%` : `$${Number(val).toLocaleString()}`,
                  'Actual',
                ]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#fafafa' : '#09090b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <ReferenceLine y={m.targetLine} stroke="#a1a1aa" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme === 'dark' ? '#fafafa' : '#18181b'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#metricDrawerGradient)"
                dot={{ r: 3, fill: theme === 'dark' ? '#fafafa' : '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table: If property context, show Property Room Tiers. If global, show Collection League */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {propName
              ? `${propName} — Room Tier Inventory & Yield (${periodDef.label} Actuals)`
              : `Property Collection Breakdown (${periodDef.label} Actuals)`}
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            {propName ? 'Room categories and realized yields' : 'Click collection row to expand individual sanctuaries'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {propName ? (
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Room Category</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap text-right">Inventory</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Revenue ({periodDef.label})
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Presidential / Mountain Chalet', keys: '30 Keys', occ: `${Math.min(95, parseInt(config.data?.occ || '76') + 4)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.18).toLocaleString()}`, rev: horizon === 'today' ? '$3.8K' : horizon === 'ytd' ? '$3.8M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.4) / 1000)}K`, status: 'Peak Demand' },
                  { type: 'Signature Sanctuary Suite', keys: '25 Keys', occ: `${config.data?.occ || '76'}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.04).toLocaleString()}`, rev: horizon === 'today' ? '$2.9K' : horizon === 'ytd' ? '$2.9M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.3) / 1000)}K`, status: 'High Yield' },
                  { type: 'Panoramic View Suite', keys: '20 Keys', occ: `${Math.max(50, parseInt(config.data?.occ || '76') - 2)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.92).toLocaleString()}`, rev: horizon === 'today' ? '$1.8K' : horizon === 'ytd' ? '$1.8M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.19) / 1000)}K`, status: 'On Plan' },
                  { type: 'Glacier / Deluxe Pavilion', keys: '20 Keys', occ: `${Math.max(45, parseInt(config.data?.occ || '76') - 6)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.81).toLocaleString()}`, rev: horizon === 'today' ? '$1.1K' : horizon === 'ytd' ? '$1.1M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.11) / 1000)}K`, status: 'Stable' },
                ].map((tier, idx) => (
                  <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.type}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-500 whitespace-nowrap">{tier.keys}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.occ}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.adr}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.rev}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {tier.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                  <td className="py-3 px-3 text-right text-zinc-500">95 Keys</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">{config.data?.occ || '76'}%</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{config.data?.adr || '$2,700'}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                    {horizon === 'today' ? '$9.6K' : horizon === 'ytd' ? '$9.6M' : config.data?.rev || '$1.15M'}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Optimal</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Collection</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    {isRoomRev && !isTotalHotelRev ? 'Room Revenue' : 'Total Revenue'} ({periodDef.label})
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {dynamicPropertiesData.map((prop) => {
                  const isExpanded = !!expandedRows[prop.id];
                  return (
                    <React.Fragment key={prop.id}>
                      <tr
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedRows((prev) => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                      >
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                          {isExpanded ? (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {prop.name}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {prop.status}
                          </span>
                        </td>
                      </tr>
                      {isExpanded &&
                        prop.children.map((child, cIdx) => (
                          <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                            <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                            <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                            <td className="py-2 px-3 text-right text-[9.5px] text-zinc-400 whitespace-nowrap">Sanctuary Node</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                  <td className="py-3 px-3 text-zinc-500">Global Portfolio (10 Sanctuaries)</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">{footerSummary.occ}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.adr}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revenue}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revpar}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Above Target</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Actionable Key Drivers & Operational Notes */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="font-bold text-[10px] uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">Key Operational Drivers</div>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4">
          {m.drivers.map((driver, idx) => (
            <li key={idx} className="leading-relaxed">{driver}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
