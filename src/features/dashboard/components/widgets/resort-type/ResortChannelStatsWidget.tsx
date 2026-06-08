import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { SharedDonutChart } from './SharedDonutChart';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function ResortChannelStatsWidget({ channelData, channelTable, totalRnights }: { channelData: any[], channelTable: any[], totalRnights: string }) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <div
      className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col gap-3 bg-[#f3eae1]/0 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer animate-card-enter"
      style={{ animationDelay: '0.5s' }}
      onClick={() => openDrawer({ type: 'CHANNEL_DISTRIBUTION', title: 'Channel Distribution Stats', data: channelTable })}
    >
      <div className="uppercase tracking-widest text-[10px] font-bold text-[#4a3c31] flex items-center justify-between">
        <span>Channel Distribution Stats</span>
        <InfoTooltip text="Booking channel distribution comparing Direct bookings, OTAs, and Travel Agents." />
      </div>
      <div className="flex items-center gap-6 px-2 py-2">
        <SharedDonutChart data={channelData} total={totalRnights} />
        <div className="space-y-1.5 flex-1">
          {channelData.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-[9px] text-[#4a3c31] font-medium">{s.name}</span>
              </div>
              <span className="text-[9px] text-[#7d6b5e]">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <table className="w-full mt-auto" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="text-[8.5px] font-bold text-[#4a3c31] border-b border-[#d4c4b7]">
            <th className="text-left pb-1">Channel</th>
            <th className="text-right pb-1">% Rnights</th>
            <th className="text-right pb-1">ADR (USD)</th>
            <th className="text-right pb-1">Room Revenue (USD)</th>
          </tr>
        </thead>
        <tbody>
          {channelTable.map((row, idx) => (
            <tr key={row.channel} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === channelTable.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
              <td className="py-1">{row.channel}</td>
              <td className="text-right py-1">{row.rnights}</td>
              <td className="text-right py-1">{row.adr}</td>
              <td className="text-right py-1">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
