import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function OccupancyByRoomTypeWidget() {
  const { openDrawer } = useDashboardDrawer();
  const data = [
    { type: 'Mountain Pavilion', occ: 72, occupied: 54, available: 75 },
    { type: 'Alpine Suite', occ: 68, occupied: 41, available: 60 },
    { type: 'Panorama Suite', occ: 65, occupied: 26, available: 40 },
    { type: 'White Villa', occ: 59, occupied: 23, available: 39 },
    { type: 'Wellness Villa', occ: 78, occupied: 14, available: 18 },
  ];

  const totals = { occ: 68, occupied: 158, available: 232 };

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ type: 'METRIC', title: 'Occupancy by Room Type', data: `${totals.occ}%` })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Occupancy by Room Type</h3>
        <InfoTooltip text="Detailed room type occupancy count and percentage breakdown." />
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className="grid grid-cols-[38%_32%_15%_15%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
          <div>Room Type</div>
          <div>Occupancy</div>
          <div className="text-right">Occupied</div>
          <div className="text-right">Total</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.type} className="grid grid-cols-[38%_32%_15%_15%] items-center text-[10px]">
              <div className="text-zinc-700 font-medium truncate pr-1">{row.type}</div>
              <div className="flex items-center gap-2 pr-2">
                <span className="w-6 text-right font-medium text-zinc-900 text-[9.5px]">{row.occ}%</span>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${row.occ}%` }} />
                </div>
              </div>
              <div className="text-right font-medium text-zinc-900">{row.occupied}</div>
              <div className="text-right text-zinc-400">{row.available}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[38%_32%_15%_15%] items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0">
          <div className="font-bold text-zinc-900">Total</div>
          <div className="flex items-center gap-2 pr-2">
            <span className="w-6 text-right font-bold text-zinc-900 text-[9.5px]">{totals.occ}%</span>
            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${totals.occ}%` }} />
            </div>
          </div>
          <div className="text-right font-bold text-zinc-900">{totals.occupied}</div>
          <div className="text-right text-zinc-400 font-medium">{totals.available}</div>
        </div>
      </div>
    </div>
  );
}

