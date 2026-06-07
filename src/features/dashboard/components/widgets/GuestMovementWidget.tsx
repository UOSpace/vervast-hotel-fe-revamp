import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import dashboardData from '../../../../data/dashboardData.json';

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
  );
}

export function GuestMovementWidget() {
  const data = dashboardData.guestMovementChart;
  const legend = dashboardData.guestMovement;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Number Of Guests</h3>
            <p className="text-[10px] text-[#7d6b5e]">7-DAYS OVERVIEW</p>
          </div>
          <InfoTooltip text="Historical overview of checked in & in-house guest across SOSEI properties over the past 7 days." />
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-1/2 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#7d6b5e' }} dy={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#7d6b5e' }} domain={['dataMin - 100', 'dataMax + 100']} width={35} />
              <Line type="natural" dataKey="alpine" stroke="#947b66" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="natural" dataKey="ocean" stroke="#657454" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="natural" dataKey="city" stroke="#586981" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="natural" dataKey="forest" stroke="#8b6b7a" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="natural" dataKey="desert" stroke="#a65e52" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="natural" dataKey="country" stroke="#d4c4b7" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 pl-4 flex flex-col justify-center space-y-1.5">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-[#4a3c31]">{item.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#4a3c31] font-semibold">{item.current}</span>
                <span className={`w-8 text-right ${item.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
