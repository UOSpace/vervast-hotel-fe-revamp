import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function PropertyRhythmWidget() {
  const { openDrawer } = useDashboardDrawer();

  const rhythmData = [
    { department: 'Arrivals & Check-in', peak: '2:00 PM – 4:00 PM', load: 85, status: 'High Volume' },
    { department: 'F&B & Fine Dining', peak: '7:00 PM – 9:30 PM', load: 92, status: 'Peak Load' },
    { department: 'Spa & Wellness Sanctuary', peak: '3:00 PM – 6:00 PM', load: 75, status: 'Active' },
    { department: 'Housekeeping & Turn-down', peak: '10:00 AM – 1:00 PM', load: 90, status: 'High Volume' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Property Rhythm' })}
    >
      <div className="flex justify-between items-center mb-3 h-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Property Rhythm & Peak Loads</h3>
        <InfoTooltip text="Operational activity flow and peak load schedules across key hotel departments." />
      </div>

      <div className="flex flex-col justify-between flex-1 py-1 gap-2.5">
        {rhythmData.map((item) => (
          <div key={item.department} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline text-[10px]">
              <span className="font-bold text-zinc-900 leading-tight">{item.department}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-normal">Peak: <strong className="text-zinc-700 font-medium">{item.peak}</strong></span>
                <span className="text-[9.5px] font-bold text-zinc-900 w-8 text-right">{item.load}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  item.load >= 90 ? 'bg-zinc-900' : item.load >= 80 ? 'bg-zinc-700' : 'bg-zinc-500'
                }`} 
                style={{ width: `${item.load}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-100 text-[9px] text-zinc-500 font-medium mt-1">
        <span>Current Status: <strong className="text-emerald-700 font-medium">All Operations Normal</strong></span>
        <span className="text-zinc-400">Next Peak: F&B Dining (7:00 PM)</span>
      </div>
    </div>
  );
}



