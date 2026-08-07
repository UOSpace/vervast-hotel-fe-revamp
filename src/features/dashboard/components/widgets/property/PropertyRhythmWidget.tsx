import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function PropertyRhythmWidget() {
  const { openDrawer } = useDashboardDrawer();
  // Generate dummy curve data
  const generateCurve = (peak1: number, peak2: number, base: number) => {
    return Array.from({ length: 24 }).map((_, i) => {
      // Create a smooth dual-peak curve using Gaussian functions
      const val1 = peak1 * Math.exp(-Math.pow(i - 10, 2) / 10); // Morning peak
      const val2 = peak2 * Math.exp(-Math.pow(i - 18, 2) / 12); // Evening peak
      const noise = Math.random() * 5;
      return { time: i, value: base + val1 + val2 + noise };
    });
  };

  const categories = [
    { name: 'Arrivals', data: generateCurve(20, 60, 5), color: '#a3b5b1' },
    { name: 'Spa Demand', data: generateCurve(40, 50, 10), color: '#82a39d' },
    { name: 'F&B Demand', data: generateCurve(30, 80, 15), color: '#578279' },
    { name: 'Housekeeping Load', data: generateCurve(90, 20, 20), color: '#36635a' },
    { name: 'Departures', data: generateCurve(80, 10, 5), color: '#1a4038' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.5s' }}
      onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Property Rhythm' })}
    >
      <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e] mb-2 flex items-center justify-between">
        <span>PROPERTY RHYTHM</span>
        <InfoTooltip text="Sanctuary activity flow comparing arrivals, departures, F&B, spa, and housekeeping peak loads throughout the day." />
      </div>

      <div className="flex-1 flex flex-col relative pt-4">
        {/* X-Axis Labels (Top) */}
        <div className="flex justify-between px-24 text-[8px] font-bold text-[#7d6b5e] absolute top-0 left-0 right-0 z-10">
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>12 AM</span>
        </div>

        {/* Ridgeline Plot (Overlapping Area Charts) */}
        <div className="flex flex-col flex-1 justify-between mt-2">
          {categories.map((cat, idx) => (
            <div key={cat.name} className={`relative h-[35px] ${idx !== 0 ? '-mt-4' : ''}`}>
              <div className="absolute left-0 bottom-2 text-[9px] font-bold text-[#4a3c31] w-24 z-20">
                {cat.name}
              </div>
              <div className="absolute inset-0 left-24 z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cat.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`color-${idx}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#e5d8cb" stopOpacity={0.8} />
                        <stop offset="50%" stopColor={cat.color} stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#1a4038" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin - 10', 'dataMax + 20']} hide />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4a3c31"
                      strokeWidth={1}
                      fill={`url(#color-${idx})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Baseline */}
              <div className="absolute bottom-0 left-24 right-0 border-b border-[#d4c4b7] z-0" />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 pt-2 text-[8px] text-[#4a3c31]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#e5d8cb]"></div> Low</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#82a39d]"></div> Moderate</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#36635a]"></div> High</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#1a4038]"></div> Very High</div>
        </div>
      </div>
    </div>
  );
}
