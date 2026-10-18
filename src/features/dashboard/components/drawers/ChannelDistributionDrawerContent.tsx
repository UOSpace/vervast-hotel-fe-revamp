import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import { resolvePropertyId } from '@/constants/categories';
import {
  getPortfolioMetrics,
  getPropertyMetrics,
  PERIOD_DEFS,
  splitByShares,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  fmtSignedPct,
  fmtSignedPts,
  type PeriodId,
} from '@/data/portfolio';
import { splitMarkets, type MarketDef } from '@/data/portfolio/hospitalityMix';
import {
  getPropertyBookingChannelDefs,
  buildRoomMix,
} from '@/data/portfolio/hospitalitySubMix';

const CHANNEL_DEFS: MarketDef[] = [
  { id: 'direct', name: 'Direct', rnShare: 38, adrIndex: 1.05, yoyOffsetPts: 1.4 },
  { id: 'ota', name: 'OTA', rnShare: 22, adrIndex: 0.88, yoyOffsetPts: -4.2 },
  { id: 'consortia', name: 'Consortia', rnShare: 18, adrIndex: 1.08, yoyOffsetPts: 0.4 },
  { id: 'own-web', name: 'Own Web', rnShare: 12, adrIndex: 1.02, yoyOffsetPts: 3.6 },
  { id: 'others', name: 'Others', rnShare: 10, adrIndex: 0.78, yoyOffsetPts: -6.0 },
];

const CHANNEL_OCC_OFFSETS: Record<string, number> = {
  Direct: 6.2,
  OTA: -2.4,
  Consortia: 3.1,
  'Own Web': 4.8,
  Others: -5.2,
};

interface ChannelDistributionDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function ChannelDistributionDrawerContent(
  props: ChannelDistributionDrawerContentProps
) {
  const drawerCtx = useDashboardDrawer();
  const config = props.config ?? drawerCtx.config;

  const initialPeriod: PeriodId =
    (config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon)) ||
    'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextPeriod =
      config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon);
    if (nextPeriod === 'today' || nextPeriod === 'mtd' || nextPeriod === 'ytd') {
      setPeriod(nextPeriod);
    }
  }, [config?.data]);

  const periodDef = PERIOD_DEFS[period];

  // Detect if opened for a single property
  const rawPropertyId =
    (config?.data && !Array.isArray(config.data) && config.data.propertyId) || null;
  const isSingleProperty = Boolean(rawPropertyId);
  const propertyId = rawPropertyId ? resolvePropertyId(rawPropertyId) : null;

  const pm = propertyId
    ? getPortfolioMetrics([propertyId], period)
    : getPortfolioMetrics(undefined, period);

  const customArray: any[] | null = Array.isArray(config?.data)
    ? config.data
    : Array.isArray(config?.data?.rows)
    ? config.data.rows
    : null;

  const summaryCards = [
    {
      label: 'Occupancy',
      value: fmtPct(pm.occupancyPct, 1),
      vsBudget: `${fmtSignedPts(pm.vsBudget.occupancyPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(pm.vsForecast.occupancyPts)} vs Forecast`,
      vsLy: `${fmtSignedPts(pm.vsLy.occupancyPts)} vs LY`,
    },
    {
      label: 'ADR',
      value: fmtUsdFull(pm.adr),
      vsBudget: `${fmtSignedPct(pm.vsBudget.adrPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(pm.vsForecast.adrPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(pm.vsLy.adrPct)} vs LY`,
    },
    {
      label: 'RevPAR',
      value: fmtUsdFull(pm.revpar),
      vsBudget: `${fmtSignedPct(pm.vsBudget.revparPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(pm.vsForecast.revparPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(pm.vsLy.revparPct)} vs LY`,
    },
    {
      label: 'Revenue',
      value: fmtUsd(pm.roomRevenue),
      vsBudget: `${fmtSignedPct(pm.vsBudget.roomRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(pm.vsForecast.roomRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(pm.vsLy.roomRevenuePct)} vs LY`,
    },
  ];

  const propShares = pm.properties.map((p) => ({
    id: p.propertyId,
    name: p.name,
    share: pm.roomRevenue > 0 ? (p.roomRevenue / pm.roomRevenue) * 100 : 10,
  }));

  const rowsToRender = (() => {
    if (propertyId) {
      const propMetrics = getPropertyMetrics(propertyId, period);
      const defs = getPropertyBookingChannelDefs(propertyId, period);
      const mix = buildRoomMix(defs, propMetrics.roomsSold, propMetrics.roomRevenue);
      return mix.map((r, idx) => {
        const occOffset = CHANNEL_OCC_OFFSETS[r.name] ?? 0;
        const occPct = Math.min(98, Math.max(40, propMetrics.occupancyPct + occOffset));
        const revparUsd = Math.round(r.adr * (occPct / 100));
        return {
          id: `prop-ch-${idx}`,
          channel: r.name,
          occupancy: fmtPct(occPct, 1),
          adr: fmtUsdFull(r.adr),
          revpar: fmtUsdFull(revparUsd),
          revenue: fmtUsd(r.revenue),
          children: [] as any[],
        };
      });
    }

    if (customArray && customArray.length > 0) {
      const items = customArray.filter(
        (r: any) => !r.isTotal && r.channel?.toLowerCase() !== 'total'
      );
      return items.map((r: any, idx: number) => {
        const occOffset = CHANNEL_OCC_OFFSETS[r.channel] ?? 0;
        const occPct = Math.min(98, Math.max(40, pm.occupancyPct + occOffset));
        const adrNum = parseInt((r.adr || '').replace(/[^0-9]/g, ''), 10) || Math.round(pm.adr);
        const revparUsd = Math.round(adrNum * (occPct / 100));
        return {
          id: `custom-ch-${idx}`,
          channel: r.channel,
          occupancy: r.occupancy || fmtPct(occPct, 1),
          adr: r.adr || fmtUsdFull(adrNum),
          revpar: r.revpar || fmtUsdFull(revparUsd),
          revenue: r.revenue,
          children: [] as any[],
        };
      });
    }

    const splitRows = splitMarkets(pm, CHANNEL_DEFS);
    return splitRows.map((r) => {
      const occOffset = CHANNEL_OCC_OFFSETS[r.def.name] ?? 0;
      const occPct = Math.min(98, Math.max(40, pm.occupancyPct + occOffset));
      const revparUsd = Math.round(r.adr * (occPct / 100));
      const splitRevs = splitByShares(r.roomRevenue, propShares);
      const adrRatio = pm.adr > 0 ? r.adr / pm.adr : 1;

      return {
        id: r.def.id,
        channel: r.def.name,
        occupancy: fmtPct(occPct, 1),
        adr: fmtUsdFull(r.adr),
        revpar: fmtUsdFull(revparUsd),
        revenue: fmtUsd(r.roomRevenue),
        children: pm.properties.map((p, pIdx) => {
          const childAdr = Math.round(p.adr * adrRatio);
          const childRevpar = Math.round(childAdr * (p.occupancyPct / 100));
          return {
            id: p.propertyId,
            name: p.name,
            occupancy: fmtPct(p.occupancyPct, 1),
            adr: fmtUsdFull(childAdr),
            revpar: fmtUsdFull(childRevpar),
            revenue: fmtUsd(splitRevs[pIdx]?.value ?? 0),
          };
        }),
      };
    });
  })();

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <p className="text-[10px] text-zinc-900 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-900">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="inline-flex items-center p-0.5 bg-zinc-200/70 rounded-lg shrink-0">
            {(['today', 'mtd', 'ytd'] as const).map((h) => {
              const isActive = period === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setPeriod(h)}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                  }`}
                >
                  {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 4 Summary KPI Cards: Occupancy, ADR, RevPAR, Revenue */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium truncate">
                {card.label}
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                ↑ {card.vsLy}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 my-1.5">{card.value}</div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-zinc-600 font-medium bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 whitespace-nowrap">
                {card.vsBudget}
              </span>
              <span className="text-[9px] text-zinc-600 font-medium bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 whitespace-nowrap">
                {card.vsForecast}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Channel Table: Channel, Occupancy, ADR, RevPAR, Revenue */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-xs text-zinc-800 border-separate border-spacing-0">
          <thead className="bg-zinc-50/90">
            <tr className="text-left text-zinc-400">
              <th className="py-2.5 px-4 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                Channel
              </th>
              <th className="py-2.5 px-4 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                Occupancy
              </th>
              <th className="py-2.5 px-4 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                ADR
              </th>
              <th className="py-2.5 px-4 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                RevPAR
              </th>
              <th className="py-2.5 px-4 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsToRender.map((row) => {
              const hasChildren = !isSingleProperty && row.children.length > 0;
              const isExpanded = !!expandedRows[row.id];
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
                      hasChildren ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => {
                      if (hasChildren) {
                        setExpandedRows((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
                      }
                    }}
                  >
                    <td className="py-3 px-4 font-semibold text-zinc-900 flex items-center gap-1.5 whitespace-nowrap">
                      {hasChildren &&
                        (isExpanded ? (
                          <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                        ) : (
                          <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                        ))}
                      {row.channel}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-900 whitespace-nowrap">
                      {row.occupancy}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-900 whitespace-nowrap">
                      {row.adr}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-zinc-900 whitespace-nowrap">
                      {row.revpar}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-900 whitespace-nowrap">
                      {row.revenue}
                    </td>
                  </tr>
                  {hasChildren &&
                    isExpanded &&
                    row.children.map((child: any) => (
                      <tr
                        key={`${row.id}-${child.id}`}
                        className="border-b border-zinc-100/60 bg-zinc-50/40 text-zinc-600"
                      >
                        <td className="py-2.5 px-4 pl-9 text-[10.5px] font-medium text-zinc-700 whitespace-nowrap">
                          {child.name}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[10.5px] whitespace-nowrap">
                          {child.occupancy}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[10.5px] whitespace-nowrap">
                          {child.adr}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[10.5px] whitespace-nowrap">
                          {child.revpar}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap">
                          {child.revenue}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}

            {/* Total Row */}
            <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
              <td className="py-3 px-4 text-zinc-900">Total</td>
              <td className="py-3 px-4 text-right text-emerald-700 font-bold">
                {fmtPct(pm.occupancyPct, 1)}
              </td>
              <td className="py-3 px-4 text-right text-zinc-900 font-bold">
                {fmtUsdFull(pm.adr)}
              </td>
              <td className="py-3 px-4 text-right text-zinc-900 font-bold">
                {fmtUsdFull(pm.revpar)}
              </td>
              <td className="py-3 px-4 text-right text-zinc-900 font-bold">
                {fmtUsd(pm.roomRevenue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

