import { useDashboardDrawer } from '../../context/DashboardDrawerContext';

interface ChannelRow {
  channel: string;
  rnights: string;
  adr: string;
  revenue: string;
  isTotal?: boolean;
}

const defaultChannelData: ChannelRow[] = [
  { channel: 'Direct', rnights: '33.0%', adr: '$1,680', revenue: '$39.0M' },
  { channel: 'OTA', rnights: '28.0%', adr: '$1,220', revenue: '$33.0M' },
  { channel: 'Consortia', rnights: '15.0%', adr: '$1,520', revenue: '$17.7M' },
  { channel: 'Own Web', rnights: '11.0%', adr: '$1,620', revenue: '$13.0M' },
  { channel: 'Others', rnights: '13.0%', adr: '$1,180', revenue: '$15.3M' },
  { channel: 'Total', rnights: '100%', adr: '$1,420', revenue: '$118M', isTotal: true },
];

const channelMeta: Record<string, { yoy: string; fee: string; profile: string }> = {
  'Direct': {
    yoy: '↑ +15%',
    fee: '0% commission',
    profile: 'High-touch private concierge & phone bookings with maximum net profit margin',
  },
  'OTA': {
    yoy: '↑ +6%',
    fee: '15–18% standard fee',
    profile: 'Broad global reach and filler demand via Booking.com & Expedia luxury tiers',
  },
  'Consortia': {
    yoy: '↑ +11%',
    fee: '10% elite amenity fee',
    profile: 'Virtuoso, American Express FHR & luxury travel agency partnerships',
  },
  'Own Web': {
    yoy: '↑ +18%',
    fee: '0% commission',
    profile: 'Official brand portal & proprietary mobile app bookings with direct guest relationship',
  },
  'Others': {
    yoy: '↑ +4%',
    fee: 'Contracted rates',
    profile: 'Specialty wholesale contracts, partner buyouts & seasonal allocations',
  },
};

export function ChannelDistributionDrawerContent() {
  const { config } = useDashboardDrawer();
  const rawData: ChannelRow[] = Array.isArray(config?.data) && config.data.length > 0
    ? config.data
    : defaultChannelData;

  const totalRow = rawData.find(r => r.isTotal || r.channel.toLowerCase() === 'total') || rawData[rawData.length - 1];
  const items = rawData.filter(r => !r.isTotal && r.channel.toLowerCase() !== 'total');

  // Derive logical hero metrics dynamically from items
  const sortedByRevenue = [...items].sort((a, b) => {
    const numA = parseFloat(a.revenue.replace(/[^0-9.]/g, '')) || 0;
    const numB = parseFloat(b.revenue.replace(/[^0-9.]/g, '')) || 0;
    return numB - numA;
  });

  const sortedByAdr = [...items].sort((a, b) => {
    const numA = parseFloat(a.adr.replace(/[^0-9.]/g, '')) || 0;
    const numB = parseFloat(b.adr.replace(/[^0-9.]/g, '')) || 0;
    return numB - numA;
  });

  const volumeLeader = sortedByRevenue[0] || items[0];
  const highestAdr = sortedByAdr[0] || items[0];
  const directWeb = items.find(i => i.channel === 'Own Web') || items[1] || items[0];
  const otaChannel = items.find(i => i.channel === 'OTA') || items[2] || items[0];

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Distribution Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Channel Economics
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Channel Distribution Stats &amp; Revenue Yield
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Booking channel volume, net ADR yield, and commission economics across channels.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Room Revenue MTD
          </div>
          <div className="text-lg font-bold text-zinc-900">{totalRow?.revenue || '$118M'}</div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Top Booking Channel
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {volumeLeader.channel} ({volumeLeader.rnights})
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {volumeLeader.revenue} · 0% Commission
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest ADR Realization
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {highestAdr.channel} ({highestAdr.adr})
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {highestAdr.rnights} Share · Peak Rate
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Proprietary Digital Web
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {directWeb.channel} ({directWeb.rnights})
          </div>
          <div className="text-[10px] font-medium text-emerald-700 mt-0.5">
            {directWeb.revenue} · {directWeb.adr} ADR
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Third-Party OTA Reach
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {otaChannel.channel} ({otaChannel.rnights})
          </div>
          <div className="text-[10px] font-medium text-zinc-600 mt-0.5">
            {otaChannel.revenue} · 15–18% Fee
          </div>
        </div>
      </div>

      {/* Main Channel Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Channel Economics &amp; Pricing Yield Performance
          </h5>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Detailed breakdown of room night contribution, ADR realization, and distribution fees
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Distribution Channel</th>
                <th className="py-2.5 px-4 text-right">Room Nights Share</th>
                <th className="py-2.5 px-4 text-right">ADR (USD)</th>
                <th className="py-2.5 px-4 text-right">Room Revenue</th>
                <th className="py-2.5 px-4 text-right">YoY Pace</th>
                <th className="py-2.5 px-4">Commission &amp; Terms</th>
                <th className="py-2.5 px-4">Channel Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((row) => {
                const meta = channelMeta[row.channel] || {
                  yoy: '↑ +8%',
                  fee: 'Contracted rates',
                  profile: 'General reservation source',
                };

                return (
                  <tr key={row.channel} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900">{row.channel}</td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-700">{row.rnights}</td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-700">{row.adr}</td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-900">{row.revenue}</td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">{meta.yoy}</td>
                    <td className="py-3 px-4 text-zinc-600 font-medium text-[11px]">{meta.fee}</td>
                    <td className="py-3 px-4 text-zinc-500 text-[11px] max-w-[240px] truncate">{meta.profile}</td>
                  </tr>
                );
              })}

              {/* Total Row */}
              {totalRow && (
                <tr className="bg-zinc-50 font-bold border-t border-zinc-200">
                  <td className="py-3 px-4 text-zinc-900">Total Portfolio</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.rnights}</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.adr}</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.revenue}</td>
                  <td className="py-3 px-4 text-right text-emerald-700">↑ +12%</td>
                  <td className="py-3 px-4 text-zinc-600 text-[11px]" colSpan={2}>
                    Net Realized Portfolio Distribution
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
