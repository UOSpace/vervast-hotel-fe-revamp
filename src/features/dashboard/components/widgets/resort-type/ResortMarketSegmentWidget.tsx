import { SharedDonutChart } from './SharedDonutChart';

export function ResortMarketSegmentWidget({ segmentData, segmentTable, totalRnights }: { segmentData: any[], segmentTable: any[], totalRnights: string }) {
  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col gap-3 backdrop-blur-sm animate-card-enter" style={{ animationDelay: '0.45s' }}>
      <div className="uppercase tracking-widest text-[9px] font-bold text-[#4a3c31]">Market Segment Stats</div>
      <div className="flex items-center gap-6 px-2 py-2">
        <SharedDonutChart data={segmentData} total={totalRnights} />
        <div className="space-y-1.5 flex-1">
          {segmentData.map(s => (
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
            <th className="text-left pb-1">Segment</th>
            <th className="text-right pb-1">% Rnights</th>
            <th className="text-right pb-1">ADR (USD)</th>
            <th className="text-right pb-1">Revenue (USD)</th>
          </tr>
        </thead>
        <tbody>
          {segmentTable.map((row, idx) => (
            <tr key={row.segment} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === segmentTable.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
              <td className="py-1">{row.segment}</td>
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
