import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { PERIOD_DEFS, type PeriodId } from '@/data/portfolio';
import {
  getPortfolioComparisonData,
  type PortfolioComparisonItem,
} from '../../services/propertySimulation';

interface PortfolioComparisonWidgetProps {
  period?: PeriodId;
  onChangePeriod?: (p: 'today' | 'mtd' | 'ytd') => void;
  onOpenDetails?: () => void;
  onSelectProperty?: (item: PortfolioComparisonItem) => void;
}

export function PortfolioComparisonWidget({
  period = 'mtd',
  onChangePeriod,
  onOpenDetails,
  onSelectProperty,
}: PortfolioComparisonWidgetProps) {
  const navigate = useNavigate();
  const data = getPortfolioComparisonData(period);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleRowClick = (item: PortfolioComparisonItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.children && item.children.length > 0) {
      setExpandedRows((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
      return;
    }
    if (onSelectProperty) {
      onSelectProperty(item);
    } else if (item.propertyRoute) {
      navigate(item.propertyRoute);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            {data.title}
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {data.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {onChangePeriod && (
            <div className="inline-flex items-center p-0.5 bg-zinc-200/60 rounded-md shrink-0">
              {(['today', 'mtd', 'ytd'] as const).map((h) => {
                const isActive = period === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onChangePeriod(h)}
                    title={PERIOD_DEFS[h].periodLabel}
                    className={`px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails && onOpenDetails();
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            See details <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll Safety */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[760px] text-xs text-zinc-800 border-separate border-spacing-0">
          <thead>
            <tr className="text-zinc-400 border-b border-zinc-100">
              <th className="py-1.5 px-2 text-left font-medium text-[9.5px]">Property Categories</th>
              <th className="py-1.5 px-2 text-left font-medium text-[9.5px]">Location</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Occupancy</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">ADR (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">RevPAR (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Room Revenue (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Total Revenue (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">vs LY</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">vs Budget</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const isExpanded = !!expandedRows[item.id];
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              return (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={(e) => handleRowClick(item, e)}
                    className={`transition-colors cursor-pointer group hover:bg-zinc-100/70 ${
                      isExpanded
                        ? 'bg-zinc-50/80'
                        : idx % 2 === 0
                        ? 'bg-transparent'
                        : 'bg-zinc-50/40'
                    }`}
                  >
                    {/* Property Category Name */}
                    <td className="py-2 px-2 text-left font-bold text-[10.5px] text-zinc-900 group-hover:text-zinc-700 whitespace-nowrap border-b border-zinc-100/80">
                      <div className="flex items-center gap-1.5">
                        {hasChildren && (
                          <span className="text-zinc-400">
                            {isExpanded ? (
                              <RoundAltArrowDown size={13} />
                            ) : (
                              <RoundAltArrowRight size={13} />
                            )}
                          </span>
                        )}
                        <span>{item.property}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-2 px-2 text-left text-[10px] text-zinc-500 whitespace-nowrap border-b border-zinc-100/80">
                      {item.location}
                    </td>

                    {/* Occupancy */}
                    <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                      {item.occupancy}
                    </td>

                    {/* ADR */}
                    <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                      {item.adrFormatted}
                    </td>

                    {/* RevPAR */}
                    <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                      {item.revparFormatted}
                    </td>

                    {/* Room Revenue */}
                    <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                      {item.roomRevenueFormatted}
                    </td>

                    {/* Total Revenue */}
                    <td className="py-2 px-2 text-right text-[10.5px] font-bold text-zinc-900 whitespace-nowrap border-b border-zinc-100/80">
                      {item.totalRevenueFormatted}
                    </td>

                    {/* vs LY */}
                    <td className="py-2 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                          item.growthVsLyNum > 0
                            ? 'text-[#14532d]'
                            : item.growthVsLyNum < 0
                            ? 'text-[#800020]'
                            : 'text-zinc-500'
                        }`}
                      >
                        <span>{item.growthVsLyNum > 0 ? '↑' : item.growthVsLyNum < 0 ? '↓' : '—'}</span>
                        {item.growthVsLy}
                      </span>
                    </td>

                    {/* vs Budget */}
                    <td className="py-2 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                          item.vsBudgetNum > 0
                            ? 'text-[#14532d]'
                            : item.vsBudgetNum < 0
                            ? 'text-[#800020]'
                            : 'text-zinc-500'
                        }`}
                      >
                        <span>{item.vsBudgetNum > 0 ? '↑' : item.vsBudgetNum < 0 ? '↓' : '—'}</span>
                        {item.vsBudget}
                      </span>
                    </td>
                  </tr>

                  {isExpanded &&
                    item.children?.map((child) => (
                      <tr
                        key={`${item.id}-${child.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (child.propertyRoute) navigate(child.propertyRoute);
                        }}
                        className="bg-zinc-50/40 hover:bg-zinc-100/50 transition-colors cursor-pointer text-[10px]"
                      >
                        <td className="py-1.5 pl-7 pr-2 text-left font-medium text-zinc-700 whitespace-nowrap border-b border-zinc-100/80">
                          <span className="text-zinc-300 mr-1.5">└</span>
                          {child.property}
                        </td>
                        <td className="py-1.5 px-2 text-left text-zinc-400 whitespace-nowrap border-b border-zinc-100/80">
                          {child.location}
                        </td>
                        <td className="py-1.5 px-2 text-right text-zinc-600 whitespace-nowrap border-b border-zinc-100/80">
                          {child.occupancy}
                        </td>
                        <td className="py-1.5 px-2 text-right text-zinc-600 whitespace-nowrap border-b border-zinc-100/80">
                          {child.adrFormatted}
                        </td>
                        <td className="py-1.5 px-2 text-right text-zinc-600 whitespace-nowrap border-b border-zinc-100/80">
                          {child.revparFormatted}
                        </td>
                        <td className="py-1.5 px-2 text-right text-zinc-600 whitespace-nowrap border-b border-zinc-100/80">
                          {child.roomRevenueFormatted}
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                          {child.totalRevenueFormatted}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                          <span
                            className={`inline-flex items-center gap-0.5 text-[9px] font-medium ${
                              child.growthVsLyNum > 0
                                ? 'text-[#14532d]'
                                : child.growthVsLyNum < 0
                                ? 'text-[#800020]'
                                : 'text-zinc-500'
                            }`}
                          >
                            <span>{child.growthVsLyNum > 0 ? '↑' : child.growthVsLyNum < 0 ? '↓' : '—'}</span>
                            {child.growthVsLy}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                          <span
                            className={`inline-flex items-center gap-0.5 text-[9px] font-medium ${
                              child.vsBudgetNum > 0
                                ? 'text-[#14532d]'
                                : child.vsBudgetNum < 0
                                ? 'text-[#800020]'
                                : 'text-zinc-500'
                            }`}
                          >
                            <span>{child.vsBudgetNum > 0 ? '↑' : child.vsBudgetNum < 0 ? '↓' : '—'}</span>
                            {child.vsBudget}
                          </span>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
