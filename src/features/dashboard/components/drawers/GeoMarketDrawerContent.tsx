import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  simulatedGeoMarketData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

const regionalMeta: Record<string, { feederCountries: string[]; keyHubs: string; vsLy: string }> = {
  'Asia Pacific': {
    feederCountries: ['Japan', 'Singapore', 'Australia', 'China'],
    keyHubs: 'HND, NRT, SIN, SYD',
    vsLy: '↑ +16%',
  },
  'Europe': {
    feederCountries: ['United Kingdom', 'Switzerland', 'Germany', 'France'],
    keyHubs: 'LHR, ZRH, CDG, FRA',
    vsLy: '↑ +12%',
  },
  'America': {
    feederCountries: ['United States', 'Canada', 'Brazil', 'Mexico'],
    keyHubs: 'JFK, SFO, LAX, MIA',
    vsLy: '↑ +8%',
  },
  'Middle East': {
    feederCountries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
    keyHubs: 'DXB, DOH, RUH',
    vsLy: '↑ +9%',
  },
  'Africa': {
    feederCountries: ['South Africa', 'Nigeria', 'Kenya', 'Morocco'],
    keyHubs: 'JNB, CPT, NBO',
    vsLy: '↑ +5%',
  },
};

export function GeoMarketDrawerContent() {
  const { config } = useDashboardDrawer();
  const data = simulatedGeoMarketData;
  const customData: any[] | null = Array.isArray(config?.data) && config.data.length > 0 ? config.data : null;

  const totalRow = customData ? (customData.find((r: any) => r.isTotal || r.region === 'Total') || customData[customData.length - 1]) : null;
  const activeItems = customData ? customData.filter((r: any) => !r.isTotal && r.region !== 'Total') : null;

  const totalRevenueDisplay = totalRow?.revenue || data.totalRevenue;

  // Derive dynamic hero metrics if customData is present
  const volumeLeader = activeItems ? activeItems[0] : null;
  const highestAdr = activeItems ? [...activeItems].sort((a, b) => {
    const valA = parseFloat(a.adr.replace(/[^0-9.]/g, '')) || 0;
    const valB = parseFloat(b.adr.replace(/[^0-9.]/g, '')) || 0;
    return valB - valA;
  })[0] : null;

  const revenueAnchor = activeItems ? [...activeItems].sort((a, b) => {
    const valA = parseFloat(a.revenue.replace(/[^0-9.]/g, '')) || 0;
    const valB = parseFloat(b.revenue.replace(/[^0-9.]/g, '')) || 0;
    return valB - valA;
  })[0] : null;

  const emergingMarket = activeItems ? activeItems[activeItems.length - 1] : null;

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
            Cross-continental guest origin breakdown across all luxury destinations.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Room Revenue MTD
          </div>
          <div className="text-lg font-bold text-zinc-900">{totalRevenueDisplay}</div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Volume Leader
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {volumeLeader ? `${volumeLeader.region} (${volumeLeader.rnights})` : 'Asia Pacific (35%)'}
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {volumeLeader ? `${volumeLeader.revenue} · Rank 1 Share` : '↑ +16% vs LY'}
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest Yield ADR
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {highestAdr ? highestAdr.region : 'Middle East'}
          </div>
          <div className="text-[10px] font-medium text-zinc-600 mt-0.5">
            {highestAdr ? `${highestAdr.adr} ADR · Peak Rate` : '$1,650 ADR (↑ +9%)'}
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Revenue Anchor
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {revenueAnchor ? `${revenueAnchor.region} (${revenueAnchor.revenue})` : 'Asia Pacific ($41M)'}
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {revenueAnchor ? `${revenueAnchor.rnights} Room Nights` : '35% Room Nights'}
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Emerging Feeder
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {emergingMarket ? `${emergingMarket.region} (${emergingMarket.revenue})` : '$24M Rev (America)'}
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {emergingMarket ? `${emergingMarket.rnights} Feeder Share` : 'Africa: $7M · 8% RN'}
          </div>
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
              {activeItems
                ? activeItems.map((item: any) => {
                    const meta = regionalMeta[item.region] || {
                      feederCountries: ['International feeders'],
                      keyHubs: 'Global aviation hubs',
                      vsLy: '↑ +10%',
                    };
                    return (
                      <tr key={item.region} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-900">{item.region}</td>
                        <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.rnights}</td>
                        <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.adr}</td>
                        <td className="py-3 px-4 text-right font-bold text-zinc-900">{item.revenue}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-700">{meta.vsLy}</td>
                        <td className="py-3 px-4 text-zinc-600">{meta.feederCountries.join(', ')}</td>
                        <td className="py-3 px-4 text-zinc-500 text-[11px]">{meta.keyHubs}</td>
                      </tr>
                    );
                  })
                : data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900">{item.market}</td>
                      <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.roomNightsFormatted}</td>
                      <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.adrFormatted}</td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-900">{item.revenueFormatted}</td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-700">{item.vsLyFormatted}</td>
                      <td className="py-3 px-4 text-zinc-600">{item.feederCountries.join(', ')}</td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">{item.keyHubs}</td>
                    </tr>
                  ))}

              {/* Total Row */}
              <tr className="bg-zinc-50 font-bold border-t border-zinc-200">
                <td className="py-3 px-4 text-zinc-900">Total Portfolio</td>
                <td className="py-3 px-4 text-right text-zinc-900">{totalRow ? totalRow.rnights : '100%'}</td>
                <td className="py-3 px-4 text-right text-zinc-900">{totalRow ? totalRow.adr : '$1,420'}</td>
                <td className="py-3 px-4 text-right text-zinc-900">{totalRevenueDisplay}</td>
                <td className="py-3 px-4 text-right text-emerald-700">↑ +14%</td>
                <td className="py-3 px-4 text-zinc-600 text-[11px]" colSpan={2}>
                  Realized Geographical Contribution
                </td>
              </tr>
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
                    ? { name: 'Asia Pacific', share: '52%' }
                    : prop.grouping === 'Desert'
                    ? { name: 'Middle East', share: '44%' }
                    : { name: 'America', share: '38%' };

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
