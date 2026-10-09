import {
  simulatedMarketSegmentData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

export function MarketSegmentDrawerContent() {
  const data = simulatedMarketSegmentData;

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
          <div className="text-lg font-bold text-zinc-900">{data.totalRevenue}</div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Core Leisure Driver
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Leisure (45%)</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">$52M · ↑ +14% vs LY</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Top Yield Segment
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Wellness ($1,760)</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">↑ +19% vs LY Pace</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Leadership & MICE
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Group ($19M)</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">$1,580 ADR · ↑ +9%</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Watch Item: Corporate
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Corporate ($31M)</div>
          <div className="text-[10px] font-medium text-rose-600 mt-0.5">↓ -7% Softening</div>
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
              {data.items.map((item) => (
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
                    ? { top: 'Corporate', topShare: '42%', secondary: 'Group / MICE (28%)' }
                    : prop.grouping === 'Forest'
                    ? { top: 'Wellness', topShare: '48%', secondary: 'Leisure (34%)' }
                    : prop.grouping === 'Alpine'
                    ? { top: 'Leisure', topShare: '58%', secondary: 'Wellness (22%)' }
                    : prop.grouping === 'Desert'
                    ? { top: 'Group / MICE', topShare: '36%', secondary: 'Leisure (32%)' }
                    : { top: 'Leisure', topShare: '62%', secondary: 'Wellness (18%)' };

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
