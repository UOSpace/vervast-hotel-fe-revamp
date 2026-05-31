import { SharedDonutChart } from './SharedDonutChart';

export function ResortChannelStatsWidget({ channelData, channelTable, totalRnights }: { channelData: any[], channelTable: any[], totalRnights: string }) {
  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col gap-3 backdrop-blur-sm animate-card-enter" style={{ animationDelay: '0.5s' }}>
      <div className="uppercase tracking-widest text-[9px] font-bold text-[#4a3c31]">Channel Distribution Stats</div>
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
            <th className="text-right pb-1">Revenue (USD)</th>
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
