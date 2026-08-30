import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { SharedDonutChart } from './SharedDonutChart';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function ResortMarketSegmentWidget({ segmentData, segmentTable, totalRnights }: { segmentData: any[], segmentTable: any[], totalRnights: string }) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <div
      className="rounded-[12px] p-5 flex flex-col justify-between gap-3 bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter h-full"
      style={{ animationDelay: '0.45s' }}
      onClick={() => openDrawer({ type: 'MARKET_SEGMENT', title: 'Market Segment Stats', data: segmentTable })}
    >
      <div className="uppercase tracking-widest text-[9px] font-bold text-[#4a3c31] flex items-center justify-between pb-2 border-b border-[#d4c4b7]/40 mb-1">
        <span>Market Segment Stats</span>
        <InfoTooltip text="Customer segment breakdown showing leisure, business, social, and MICE groups." />
      </div>
      <div className="flex items-center gap-6 px-2 py-1 h-[120px]">
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
      <div className="mt-auto pt-2">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[8.5px] font-bold text-[#4a3c31] border-b border-[#d4c4b7]">
              <th className="text-left pb-2.5 pt-1 pr-1.5 w-[30%] truncate">Segment</th>
              <th className="text-right pb-2.5 pt-1 px-1.5 w-[18%] truncate">% Rnights</th>
              <th className="text-right pb-2.5 pt-1 px-1.5 w-[22%] truncate">ADR (USD)</th>
              <th className="text-right pb-2.5 pt-1 pl-1.5 w-[30%] truncate">Room Revenue (USD)</th>
            </tr>
          </thead>
          <tbody>
            {segmentTable.map((row, idx) => (
              <tr key={row.segment} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === segmentTable.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
                <td className="py-2.5 pr-1.5 truncate">{row.segment}</td>
                <td className="text-right py-2.5 px-1.5 truncate">{row.rnights}</td>
                <td className="text-right py-2.5 px-1.5 truncate">{row.adr}</td>
                <td className="text-right py-2.5 pl-1.5 truncate">{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
