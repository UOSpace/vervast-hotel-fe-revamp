import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import dashboardData from '../../../../data/dashboardData.json';

export function GuestMovementWidget() {
  const data = dashboardData.guestMovementChart;
  const legend = dashboardData.guestMovement;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="flex justify-between w-full">
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
              <div className="leading-[0]">
                <span className="inline-block w-2 h-2 rounded-full align-[-1px]" style={{ backgroundColor: item.color }}></span>
                <span className="text-[#4a3c31] ml-1.5">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#4a3c31] font-semibold">{item.current}</span>
                <span className={`w-8 text-right flex items-center ${item.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
