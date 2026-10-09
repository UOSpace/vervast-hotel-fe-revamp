import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  simulatedMarketSegmentData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

export function MarketSegmentDrawerContent() {
  const { config } = useDashboardDrawer();
  const defaultData = simulatedMarketSegmentData;
  const customData = Array.isArray(config?.data) ? config.data : null;

  let totalRevenue = defaultData.totalRevenue;
  let items: any[] = defaultData.items;
  let heroLeisure = { label: 'Leisure (55%)', sub: '$65M · ↑ +14% vs LY' };
  let heroBusiness = { label: 'Business (25%)', sub: '$30M · ↑ +8% vs LY' };
  let heroSocial = { label: 'Social (10%)', sub: '$11M · ↑ +10% vs LY' };
  let heroTopYield = { label: 'MICE ($1,720)', sub: '$9M · ↑ +12% vs LY Pace' };

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
        label: `Leisure (${leisure.rnights || '55%'})`,
        sub: `${leisure.revenue || '$1.64M'} · ADR ${leisure.adr || '$2,465'}`,
      };
    }
    if (business) {
      heroBusiness = {
        label: `Business (${business.rnights || '25%'})`,
        sub: `${business.revenue || '$0.88M'} · ADR ${business.adr || '$2,921'}`,
      };
    }
    if (social) {
      heroSocial = {
        label: `Social (${social.rnights || '10%'})`,
        sub: `${social.revenue || '$0.22M'} · ADR ${social.adr || '$1,822'}`,
      };
    }

    // Find highest ADR segment
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
        label: `${topAdrItem.segment} (${topAdrItem.adr})`,
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
            Market Segment Mix (What kind of demand are we attracting?)
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-segment volume, pricing yield, and booking behavior across all 12 luxury sanctuaries.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Demand Bookings
          </div>
          <div className="text-lg font-bold text-zinc-900">{totalRevenue}</div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Core Leisure Driver
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{heroLeisure.label}</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">{heroLeisure.sub}</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Corporate & Business
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{heroBusiness.label}</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">{heroBusiness.sub}</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Social & Gatherings
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{heroSocial.label}</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">{heroSocial.sub}</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Top Yield Segment
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{heroTopYield.label}</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">{heroTopYield.sub}</div>
        </div>
      </div>

      {/* Market Segment Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Segment Performance & Risk Profiles
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
              {customData && (
                <tr className="bg-zinc-50/80 font-bold border-t border-zinc-200">
                  <td className="py-3 px-4 font-bold text-zinc-900">Total</td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">100%</td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">
                    {customData.find((r: any) => r.segment?.toLowerCase() === 'total' || r.isTotal)?.adr || '$2,500'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">{totalRevenue}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">+11% YoY</td>
                  <td className="py-3 px-4 text-zinc-700">Category Aggregate Demand</td>
                  <td className="py-3 px-4 text-right text-zinc-700">38d Avg</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Balanced
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Segment Matrix */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Property-Level Segment Mix (12 Sanctuaries)
          </h5>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Single Source of Truth cross-referenced with simulated PMS live property records
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
              {simulatedPropertiesData.map((prop) => {
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
