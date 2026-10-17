import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  getMarketSegmentData,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  splitByShares,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  fmtSignedPct,
  fmtSignedPts,
  type PeriodId,
} from '@/data/portfolio';

const SEGMENT_OCC_OFFSET: Record<string, number> = {
  leisure: 2.4,
  business: -1.8,
  social: -4.2,
  mice: -3.5,
  others: -6.8,
};

interface MarketSegmentDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function MarketSegmentDrawerContent(props: MarketSegmentDrawerContentProps) {
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
  const defaultData = getMarketSegmentData(period);
  const pm = getPortfolioMetrics(undefined, period);
  const customData = Array.isArray(config?.data) ? config.data : null;

  let totalRevenueDisplay = defaultData.totalRevenue;
  let totalAdrDisplay = fmtUsd(pm.adr);

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
      value: fmtUsd(pm.adr),
      vsBudget: `${fmtSignedPct(pm.vsBudget.adrPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(pm.vsForecast.adrPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(pm.vsLy.adrPct)} vs LY`,
    },
    {
      label: 'RevPAR',
      value: fmtUsd(pm.revpar),
      vsBudget: `${fmtSignedPct(pm.vsBudget.revparPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(pm.vsForecast.revparPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(pm.vsLy.revparPct)} vs LY`,
    },
    {
      label: 'Room Revenue',
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
    if (customData && customData.length > 0) {
      const totalRow = customData.find(
        (r: any) => r.segment?.toLowerCase() === 'total' || r.isTotal
      );
      const activeRows = customData.filter(
        (r: any) => r !== totalRow && r.segment?.toLowerCase() !== 'total'
      );
      if (totalRow?.revenue) totalRevenueDisplay = totalRow.revenue;
      if (totalRow?.adr) totalAdrDisplay = totalRow.adr;

      return activeRows.map((r: any, idx: number) => {
        const defMatch =
          defaultData.items.find(
            (d) => d.segment.toLowerCase() === (r.segment || '').toLowerCase()
          ) || defaultData.items[idx] || defaultData.items[0];
        const adrNum =
          parseInt((r.adr || '').replace(/[^0-9]/g, ''), 10) || defMatch.adrUsd;
        const occPct = Math.min(
          98,
          Math.max(40, pm.occupancyPct + (SEGMENT_OCC_OFFSET[defMatch.id] ?? 0))
        );
        const revparUsd = Math.round(adrNum * (occPct / 100));
        const splitRevs = splitByShares(defMatch.revenueUsd, propShares);

        return {
          id: `custom-seg-${idx}`,
          segment: r.segment,
          location: 'All 9 Properties',
          occupancy: fmtPct(occPct, 1),
          adr: r.adr || defMatch.adrFormatted,
          revpar: fmtUsdFull(revparUsd),
          revenue: r.revenue || defMatch.revenueFormatted,
          children: pm.properties.map((p, pIdx) => {
            const childAdr = Math.round(p.adr * (adrNum / Math.max(1, pm.adr)));
            const childRevpar = Math.round(childAdr * (p.occupancyPct / 100));
            return {
              id: p.propertyId,
              name: p.name,
              location: p.location,
              occupancy: fmtPct(p.occupancyPct, 1),
              adr: fmtUsdFull(childAdr),
              revpar: fmtUsdFull(childRevpar),
              revenue: fmtUsd(splitRevs[pIdx]?.value ?? 0),
            };
          }),
        };
      });
    }

    return defaultData.items.map((item) => {
      const occPct = Math.min(
        98,
        Math.max(40, pm.occupancyPct + (SEGMENT_OCC_OFFSET[item.id] ?? 0))
      );
      const revparUsd = Math.round(item.adrUsd * (occPct / 100));
      const splitRevs = splitByShares(item.revenueUsd, propShares);
      const adrRatio = pm.adr > 0 ? item.adrUsd / pm.adr : 1;

      return {
        id: item.id,
        segment: item.segment,
        location: 'All 9 Properties',
        occupancy: fmtPct(occPct, 1),
        adr: item.adrFormatted,
        revpar: fmtUsdFull(revparUsd),
        revenue: item.revenueFormatted,
        children: pm.properties.map((p, pIdx) => {
          const childAdr = Math.round(p.adr * adrRatio);
          const childRevpar = Math.round(childAdr * (p.occupancyPct / 100));
          return {
            id: p.propertyId,
            name: p.name,
            location: p.location,
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
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-800">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!customData && (
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
          )}
        </div>
      </div>

      {/* Top 4 Summary KPI Cards: Occupancy, ADR, RevPAR, Room Revenue */}
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
            <div className="text-xl font-bold text-zinc-900 my-1.5">
              {card.value}
            </div>
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

      {/* Market Segment Breakdown Table with Expandable Properties */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            Market Segment Performance ({periodDef.label})
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            Click segment row to expand individual properties
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-xs text-zinc-800 border-separate border-spacing-0">
            <thead className="bg-zinc-50/90">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Market Segment
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Location
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Occupancy
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  ADR (USD)
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  RevPAR (USD)
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Room Revenue ({periodDef.label})
                </th>
              </tr>
            </thead>
            <tbody>
              {rowsToRender.map((row) => {
                const isExpanded = !!expandedRows[row.id];
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedRows((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
                      }
                    >
                      <td className="py-3 px-3 font-semibold text-zinc-900 flex items-center gap-1.5 whitespace-nowrap">
                        {isExpanded ? (
                          <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                        ) : (
                          <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                        )}
                        {row.segment}
                      </td>
                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">{row.location}</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {row.occupancy}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {row.adr}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-zinc-900 whitespace-nowrap">
                        {row.revpar}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 whitespace-nowrap">
                        {row.revenue}
                      </td>
                    </tr>
                    {isExpanded &&
                      row.children.map((child) => (
                        <tr
                          key={`${row.id}-${child.id}`}
                          className="border-b border-zinc-100/60 bg-zinc-50/40 text-zinc-600"
                        >
                          <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 whitespace-nowrap">
                            {child.name}
                          </td>
                          <td className="py-2.5 px-3 text-[10px] text-zinc-400 whitespace-nowrap">
                            {child.location}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {child.occupancy}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {child.adr}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {child.revpar}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap">
                            {child.revenue}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {/* Total Row */}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-3 px-3 text-zinc-900">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">{pm.propertyCount} Properties Worldwide</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">
                  {fmtPct(pm.occupancyPct, 1)}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 font-bold">
                  {totalAdrDisplay}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 font-bold">
                  {fmtUsd(pm.revpar)}
                </td>
                <td className="py-3 px-3 text-right text-zinc-900 font-bold">
                  {totalRevenueDisplay}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
