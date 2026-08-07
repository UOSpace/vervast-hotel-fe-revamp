import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import dashboardData from '../../../../data/dashboardData.json';

export function GuestMovementWidget() {
  const data = dashboardData.guestMovementChart;
  const legend = dashboardData.guestMovement;

  const wabiSabiPalette = {
    alpine: '#1F1D1C',  // Deep Kuro Charcoal (~12% L)
    ocean: '#3D3A38',   // Dark Slate Gray (~23% L)
    city: '#5E5A56',    // Medium Taupe Gray (~36% L)
    forest: '#857E78',  // Warm Ash Gray (~52% L)
    desert: '#B2A9A0',  // Light Sand Gray (~70% L)
    country: '#DDD5CC', // Very Light Parchment Gray (~87% L)
  };

  const legendWithPaletteColors = legend.map((item, index) => {
    const colorKeys = [
      wabiSabiPalette.alpine,
      wabiSabiPalette.ocean,
      wabiSabiPalette.city,
      wabiSabiPalette.forest,
      wabiSabiPalette.desert,
      wabiSabiPalette.country,
    ];
    return {
      ...item,
      name: item.name.replace(/^SOSEI\s+/, ''),
      color: colorKeys[index] || item.color,
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <InfoTooltip text="Historical overview of checked in & in-house guest across SOSEI properties over the past 7 days.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] cursor-help">Number Of Guests</h3>
            <p className="text-[10px] text-[#7d6b5e]">7-DAYS OVERVIEW</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-between mt-1">
        <div className="w-full flex-1 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -4, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#7d6b5e' }} dy={10} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#7d6b5e' }} domain={[0, 3500]} width={26} />
              <Tooltip contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '6px', fontSize: '10px' }} />
              <Bar dataKey="country" stackId="a" name="Countryside" fill={wabiSabiPalette.country} barSize={16} isAnimationActive={false} />
              <Bar dataKey="desert" stackId="a" name="Desert" fill={wabiSabiPalette.desert} barSize={16} isAnimationActive={false} />
              <Bar dataKey="forest" stackId="a" name="Forest" fill={wabiSabiPalette.forest} barSize={16} isAnimationActive={false} />
              <Bar dataKey="city" stackId="a" name="City" fill={wabiSabiPalette.city} barSize={16} isAnimationActive={false} />
              <Bar dataKey="ocean" stackId="a" name="Ocean" fill={wabiSabiPalette.ocean} barSize={16} isAnimationActive={false} />
              <Bar dataKey="alpine" stackId="a" name="Alpine" fill={wabiSabiPalette.alpine} radius={[3, 3, 0, 0]} barSize={16} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-x-3 gap-y-1 pt-2 border-t border-[#d4c4b7]/30 mt-2">
          {legendWithPaletteColors.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9px]">
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-[#4a3c31]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
