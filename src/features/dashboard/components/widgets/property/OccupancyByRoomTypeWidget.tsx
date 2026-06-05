import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

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
      className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ type: 'METRIC', title: 'Occupancy by Room Type', data: `${totals.occ}%` })}
    >
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4 flex items-center justify-between">
        <span>OCCUPANCY BY ROOM TYPE</span>
        <InfoTooltip text="Detailed room type occupancy count and percentage breakdown." />
      </div>

      <div className="flex flex-col text-xs text-[#4a3c31]">
        {/* Header */}
        <div className="grid grid-cols-[35%_35%_15%_15%] mb-2 pb-2 border-b border-[#d4c4b7]/50 font-bold">
          <div>Room Type</div>
          <div>Occupancy</div>
          <div className="text-right">Occupied</div>
          <div className="text-right">Available</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2">
          {data.map((row) => (
            <div key={row.type} className="grid grid-cols-[35%_35%_15%_15%] items-center">
              <div>{row.type}</div>
              <div className="flex items-center gap-2">
                <span className="w-6 text-right">{row.occ}%</span>
                <div className="flex-1 h-1.5 bg-[#e5d8cb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2a564f] rounded-full" style={{ width: `${row.occ}%` }} />
                </div>
              </div>
              <div className="text-right">{row.occupied}</div>
              <div className="text-right">{row.available}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[35%_35%_15%_15%] items-center mt-3 pt-2 border-t border-[#d4c4b7]/50 font-bold">
          <div>Total</div>
          <div className="flex items-center gap-2">
            <span className="w-6 text-right">{totals.occ}%</span>
            <div className="flex-1 h-1.5 bg-[#e5d8cb] rounded-full overflow-hidden">
              <div className="h-full bg-[#2a564f] rounded-full" style={{ width: `${totals.occ}%` }} />
            </div>
          </div>
          <div className="text-right">{totals.occupied}</div>
          <div className="text-right">{totals.available}</div>
        </div>
      </div>
    </div>
  );
}
