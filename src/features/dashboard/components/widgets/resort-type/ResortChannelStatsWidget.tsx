import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { SharedDonutChart } from './SharedDonutChart';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function ResortChannelStatsWidget({ channelData, channelTable, totalRnights }: { channelData: any[], channelTable: any[], totalRnights: string }) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <div
      className="flex flex-col justify-between gap-1.5 bg-transparent transition-opacity cursor-pointer hover:opacity-85 animate-card-enter"
      style={{ animationDelay: '0.5s' }}
      onClick={() => openDrawer({ type: 'CHANNEL_DISTRIBUTION', title: 'Channel Distribution Stats', data: channelTable })}
    >
      <div className="uppercase tracking-widest text-[9px] font-bold text-[#4a3c31] flex items-center justify-between pb-1.5 border-b border-[#d4c4b7]/40 mb-0">
        <span>Channel Distribution Stats</span>
        <InfoTooltip text="Booking channel distribution comparing Direct bookings, OTAs, and Travel Agents." />
      </div>
      <div className="flex items-center gap-6 px-2 py-0.5 h-[120px]">
        <SharedDonutChart data={channelData} total={totalRnights} />
        <div className="space-y-1 flex-1">
          {channelData.map(c => (
            <div key={c.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-[9px] text-[#4a3c31] font-medium">{c.name}</span>
              </div>
              <span className="text-[9px] text-[#7d6b5e]">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <table className="w-full mt-auto" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr className="text-[8.5px] font-bold text-[#4a3c31] border-b border-[#d4c4b7]">
            <th className="text-left pb-1 w-[30%] truncate">Channel</th>
            <th className="text-right pb-1 w-[18%] truncate">% Rnights</th>
            <th className="text-right pb-1 w-[22%] truncate">ADR (USD)</th>
            <th className="text-right pb-1 w-[30%] truncate">Room Revenue (USD)</th>
          </tr>
        </thead>
        <tbody>
          {channelTable.map((row, idx) => (
            <tr key={row.channel} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === channelTable.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
              <td className="py-1 truncate">{row.channel}</td>
              <td className="text-right py-1 truncate">{row.rnights}</td>
              <td className="text-right py-1 truncate">{row.adr}</td>
              <td className="text-right py-1 truncate">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
