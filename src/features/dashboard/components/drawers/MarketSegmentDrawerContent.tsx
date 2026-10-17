import { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  getMarketSegmentData,
  getSimulatedPropertiesData,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';

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

  useEffect(() => {
    const nextPeriod =
      config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon);
    if (nextPeriod === 'today' || nextPeriod === 'mtd' || nextPeriod === 'ytd') {
      setPeriod(nextPeriod);
    }
  }, [config?.data]);

  const periodDef = PERIOD_DEFS[period];
  const defaultData = getMarketSegmentData(period);
  const propertiesData = getSimulatedPropertiesData(period);
  const pm = getPortfolioMetrics(undefined, period);
  const customData = Array.isArray(config?.data) ? config.data : null;

  let totalRevenue = defaultData.totalRevenue;
  let items: any[] = defaultData.items;

  const defLeisure = defaultData.items.find((i) => i.segment.toLowerCase().includes('leisure')) || defaultData.items[0];
  const defBusiness = defaultData.items.find((i) => i.segment.toLowerCase().includes('business')) || defaultData.items[1];
  const defSocial = defaultData.items.find((i) => i.segment.toLowerCase().includes('social')) || defaultData.items[2];
  const defTopYield = [...defaultData.items].sort((a, b) => b.adrUsd - a.adrUsd)[0] || defaultData.items[0];

  let heroLeisure = {
    value: defLeisure.roomNightsFormatted,
    name: defLeisure.segment,
    sub: `${defLeisure.revenueFormatted} · ${defLeisure.vsLyFormatted}`,
  };
  let heroBusiness = {
    value: defBusiness.roomNightsFormatted,
    name: defBusiness.segment,
    sub: `${defBusiness.revenueFormatted} · ${defBusiness.vsLyFormatted}`,
  };
  let heroSocial = {
    value: defSocial.roomNightsFormatted,
    name: defSocial.segment,
    sub: `${defSocial.revenueFormatted} · ${defSocial.vsLyFormatted}`,
  };
  let heroTopYield = {
    value: defTopYield.adrFormatted,
    name: defTopYield.segment,
    sub: `${defTopYield.revenueFormatted} · ${defTopYield.vsLyFormatted}`,
  };

  if (customData) {
    const totalRow = customData.find(
      (r: any) => r.segment?.toLowerCase() === 'total' || r.isTotal
    );
    const activeRows = customData.filter(
      (r: any) => r !== totalRow && r.segment?.toLowerCase() !== 'total'
    );

    if (totalRow?.revenue) {
      totalRevenue = totalRow.revenue;
    }

    const leisure = activeRows.find((r: any) =>
      r.segment?.toLowerCase().includes('leisure')
    );
    const business = activeRows.find((r: any) =>
      r.segment?.toLowerCase().includes('business')
    );
    const social = activeRows.find((r: any) =>
      r.segment?.toLowerCase().includes('social')
    );

    if (leisure) {
      heroLeisure = {
        value: leisure.rnights || '55%',
        name: 'Leisure',
        sub: `${leisure.revenue || '$1.64M'} · ADR ${leisure.adr || '$2,465'}`,
      };
    }
    if (business) {
      heroBusiness = {
        value: business.rnights || '25%',
        name: 'Business',
        sub: `${business.revenue || '$0.88M'} · ADR ${business.adr || '$2,921'}`,
      };
    }
    if (social) {
      heroSocial = {
        value: social.rnights || '10%',
        name: 'Social',
        sub: `${social.revenue || '$0.22M'} · ADR ${social.adr || '$1,822'}`,
      };
    }

    let topAdrItem = activeRows[0];
    let maxAdrVal = 0;
    activeRows.forEach((r: any) => {
      const val = parseInt((r.adr || '').replace(/[^0-9]/g, ''), 10) || 0;
      if (val > maxAdrVal) {
        maxAdrVal = val;
        topAdrItem = r;
      }
    });

    if (topAdrItem) {
      heroTopYield = {
        value: topAdrItem.adr,
        name: topAdrItem.segment,
        sub: `${topAdrItem.revenue} · ${topAdrItem.rnights} Volume`,
      };
    }

    const strategicProfiles: Record<
      string,
      { desc: string; lead: number; risk: 'Low' | 'Medium' | 'High' }
    > = {
      Leisure: { desc: 'High length-of-stay, high spa & F&B capture', lead: 45, risk: 'Low' },
      Business: { desc: 'Short lead times, corporate preferred rates', lead: 14, risk: 'Medium' },
      Social: { desc: 'Weekend & celebratory demand, buyout potential', lead: 60, risk: 'Low' },
      MICE: { desc: 'Multi-room group contracts with banquet guarantee', lead: 90, risk: 'Low' },
      Others: { desc: 'Contracted luxury wholesale & reserve allotments', lead: 21, risk: 'Medium' },
    };

    items = activeRows.map((r: any, idx: number) => {
      const profile =
        strategicProfiles[r.segment] || {
          desc: 'Specialized niche market demand',
          lead: 30,
          risk: 'Medium' as const,
        };
      return {
        id: `custom-seg-${idx}`,
        segment: r.segment,
        roomNightsPct: parseFloat(r.rnights) || 0,
        roomNightsFormatted: r.rnights,
        adrUsd: parseInt((r.adr || '').replace(/[^0-9]/g, ''), 10) || 0,
        adrFormatted: r.adr,
        revenueUsdMillions: parseFloat((r.revenue || '').replace(/[^0-9.]/g, '')) || 0,
        revenueFormatted: r.revenue,
        vsLyPct: 12,
        vsLyFormatted: '+12% Pace',
        isPositive: true,
        description: profile.desc,
        avgLeadTimeDays: profile.lead,
        cancellationRisk: profile.risk,
      };
    });
  }

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Demand Segmentation Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live PMS Segment Mix
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Market Segment Mix ({periodDef.label})
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-segment volume, pricing yield, and booking behavior across all 10 luxury sanctuaries ·{' '}
            <span className="font-semibold text-zinc-700">{periodDef.periodLabel}</span>
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
                    {h === 'today' ? 'Today' : h.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Room Revenue ({periodDef.label})
            </div>
            <div className="text-lg font-bold text-zinc-900">{totalRevenue}</div>
          </div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: 'Core Leisure Driver', hero: heroLeisure },
          { title: 'Corporate & Business', hero: heroBusiness },
          { title: 'Social & Gatherings', hero: heroSocial },
          { title: 'Top Yield Segment', hero: heroTopYield },
        ].map(({ title, hero }) => (
          <div
            key={title}
            className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3"
          >
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {title}
            </span>
            <div>
              <div className="text-xl font-bold text-zinc-900 leading-tight">{hero.value}</div>
              <div className="text-[11px] font-normal text-zinc-600 mt-0.5">{hero.name}</div>
              <div className="text-[10px] font-medium text-emerald-700 mt-1">{hero.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Segment Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Segment Performance &amp; Risk Profiles ({periodDef.label})
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Volume allocation, ADR yield, lead times, and cancellation sensitivity by guest profile
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Market Segment</th>
                <th className="py-2.5 px-4 text-right">Room Nights Share</th>
                <th className="py-2.5 px-4 text-right">ADR (USD)</th>
                <th className="py-2.5 px-4 text-right">Revenue (USD)</th>
                <th className="py-2.5 px-4 text-right">YoY Pace</th>
                <th className="py-2.5 px-4">Strategic Profile</th>
                <th className="py-2.5 px-4 text-right">Lead Time</th>
                <th className="py-2.5 px-4 text-center">Cancel Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900">{item.segment}</td>
                  <td className="py-3 px-4 text-right font-medium text-zinc-700">
                    {item.roomNightsFormatted}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-zinc-700">
                    {item.adrFormatted}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">
                    {item.revenueFormatted}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      item.isPositive ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.vsLyFormatted}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{item.description}</td>
                  <td className="py-3 px-4 text-right text-zinc-500 font-medium">
                    {item.avgLeadTimeDays}d
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                        item.cancellationRisk === 'Low'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.cancellationRisk === 'High'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.cancellationRisk}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-zinc-50/80 font-bold border-t border-zinc-200">
                <td className="py-3 px-4 font-bold text-zinc-900">Total Portfolio</td>
                <td className="py-3 px-4 text-right font-bold text-zinc-900">100%</td>
                <td className="py-3 px-4 text-right font-bold text-zinc-900">
                  {customData
                    ? customData.find(
                        (r: any) => r.segment?.toLowerCase() === 'total' || r.isTotal
                      )?.adr || fmtUsd(pm.adr)
                    : fmtUsd(pm.adr)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-zinc-900">{totalRevenue}</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">
                  ↑ {fmtSignedPct(pm.vsLy.roomRevenuePct)}
                </td>
                <td className="py-3 px-4 text-zinc-700">Portfolio Aggregate Demand</td>
                <td className="py-3 px-4 text-right text-zinc-700">38d Avg</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    Balanced
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Segment Matrix */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Property-Level Segment Mix (10 Sanctuaries — {periodDef.label})
          </h5>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Single Source of Truth cross-referenced with live PMS property records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Property</th>
                <th className="py-2.5 px-4">Cluster</th>
                <th className="py-2.5 px-4 text-right">Occupancy</th>
                <th className="py-2.5 px-4 text-right">Top Segment</th>
                <th className="py-2.5 px-4 text-right">Top Segment Share</th>
                <th className="py-2.5 px-4 text-right">Secondary Segment</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {propertiesData.map((prop) => {
                const segmentMix =
                  prop.grouping === 'City'
                    ? { top: 'Business', topShare: '42%', secondary: 'MICE (28%)' }
                    : prop.grouping === 'Forest'
                    ? { top: 'Social', topShare: '38%', secondary: 'Leisure (34%)' }
                    : prop.grouping === 'Alpine'
                    ? { top: 'Leisure', topShare: '58%', secondary: 'Social (22%)' }
                    : prop.grouping === 'Desert'
                    ? { top: 'MICE', topShare: '36%', secondary: 'Leisure (32%)' }
                    : { top: 'Leisure', topShare: '62%', secondary: 'Social (18%)' };

                return (
                  <tr key={prop.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-zinc-900">{prop.name}</td>
                    <td className="py-2.5 px-4 text-zinc-500">{prop.grouping}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-700">
                      {prop.occupancyFormatted}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-zinc-900">
                      {segmentMix.top}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-600">
                      {segmentMix.topShare}
                    </td>
                    <td className="py-2.5 px-4 text-right text-zinc-500">
                      {segmentMix.secondary}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                          prop.status === 'above_plan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prop.status === 'attention'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {prop.status === 'above_plan'
                          ? 'Above Plan'
                          : prop.status === 'attention'
                          ? 'Attention'
                          : 'On Plan'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
