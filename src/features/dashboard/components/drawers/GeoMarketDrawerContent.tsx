import {
  simulatedGeoMarketData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

export function GeoMarketDrawerContent() {
  const data = simulatedGeoMarketData;

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Demand Origin Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Feeder Analytics
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Geo Market Distribution (Where is demand coming from?)
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-continental guest origin breakdown across all 12 luxury sanctuaries.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Room Revenue MTD
          </div>
          <div className="text-lg font-bold text-zinc-900">{data.totalRevenue}</div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Volume Leader
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">APAC (35%)</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">↑ +18% vs LY</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest Yield ADR
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Middle East</div>
          <div className="text-[10px] font-medium text-zinc-600 mt-0.5">$1,520 ADR (↑ +6%)</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Revenue Anchor
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">Europe ($41M)</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">31% Room Nights</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Americas Market
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">$28M Rev</div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">24% RN · $1,240 ADR</div>
        </div>
      </div>

      {/* Regional Feeder Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Continental Feeder Performance
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Room nights share, pricing yield, and total room revenue by geographic source
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Market</th>
                <th className="py-2.5 px-4 text-right">Room Nights Share</th>
                <th className="py-2.5 px-4 text-right">ADR (USD)</th>
                <th className="py-2.5 px-4 text-right">Revenue (USD)</th>
                <th className="py-2.5 px-4 text-right">YoY Pace</th>
                <th className="py-2.5 px-4">Primary Feeder Countries</th>
                <th className="py-2.5 px-4">Key Aviation Gateways</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data.items.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900">{item.market}</td>
                  <td className="py-3 px-4 text-right font-medium text-zinc-700">
                    {item.roomNightsFormatted}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-zinc-700">
                    {item.adrFormatted}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-zinc-900">
                    {item.revenueFormatted}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                    {item.vsLyFormatted}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {item.feederCountries.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 text-[11px]">{item.keyHubs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Feeder Market Contribution Matrix */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Property-Level Feeder Distribution (12 Sanctuaries)
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
                <th className="py-2.5 px-4 text-right">ADR</th>
                <th className="py-2.5 px-4 text-right">Top Feeder Region</th>
                <th className="py-2.5 px-4 text-right">Feeder Share</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {simulatedPropertiesData.map((prop) => {
                // Determine property's primary feeder logically by grouping
                const topFeeder =
                  prop.grouping === 'Alpine' || prop.grouping === 'Countryside'
                    ? { name: 'Europe', share: '46%' }
                    : prop.grouping === 'Ocean' || prop.grouping === 'City'
                    ? { name: 'APAC', share: '52%' }
                    : prop.grouping === 'Desert'
                    ? { name: 'Middle East', share: '44%' }
                    : { name: 'Americas', share: '38%' };

                return (
                  <tr key={prop.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-zinc-900">{prop.name}</td>
                    <td className="py-2.5 px-4 text-zinc-500">{prop.grouping}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-700">
                      {prop.occupancyFormatted}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-700">
                      {prop.adrFormatted}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-900">
                      {topFeeder.name}
                    </td>
                    <td className="py-2.5 px-4 text-right text-zinc-600">
                      {topFeeder.share}
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
