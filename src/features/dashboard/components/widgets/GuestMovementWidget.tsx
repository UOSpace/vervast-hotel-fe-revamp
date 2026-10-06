import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { getDashboardComputedData } from '../../../../data/pms';

export function GuestMovementWidget() {
  const computed = getDashboardComputedData();
  const data = computed.guestMovementChart;
  const legend = computed.guestMovement;

  const zincPalette = {
    alpine: '#18181b',  // zinc-900
    ocean: '#3f3f46',   // zinc-700
    city: '#52525b',    // zinc-600
    forest: '#71717a',  // zinc-500
    desert: '#a1a1aa',  // zinc-400
    country: '#d4d4d8', // zinc-300
  };

  const legendWithPaletteColors = legend.map((item) => {
    const key = item.category as keyof typeof zincPalette;
    return {
      ...item,
      color: zincPalette[key] || item.color,
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <InfoTooltip text="Historical overview of checked in & in-house guests across SOSEI properties over the past 7 days.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Number Of Guests</h3>
            <p className="text-[10px] text-zinc-500 font-medium">7-DAYS OVERVIEW</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-between mt-1">
        <div className="w-full flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -4, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.6} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8.5, fill: '#71717a' }} dy={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8.5, fill: '#71717a' }} domain={[0, 3500]} width={28} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="country" stackId="a" name="Countryside" fill={zincPalette.country} barSize={16} isAnimationActive={false} />
              <Bar dataKey="desert" stackId="a" name="Desert" fill={zincPalette.desert} barSize={16} isAnimationActive={false} />
              <Bar dataKey="forest" stackId="a" name="Forest" fill={zincPalette.forest} barSize={16} isAnimationActive={false} />
              <Bar dataKey="city" stackId="a" name="City" fill={zincPalette.city} barSize={16} isAnimationActive={false} />
              <Bar dataKey="ocean" stackId="a" name="Ocean" fill={zincPalette.ocean} barSize={16} isAnimationActive={false} />
              <Bar dataKey="alpine" stackId="a" name="Alpine" fill={zincPalette.alpine} radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-x-3 gap-y-1 pt-2 border-t border-zinc-100 mt-2">
          {legendWithPaletteColors.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9.5px]">
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-zinc-700 font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
