import { User } from '@solar-icons/react';
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

export function GuestArrivalsWidget() {
  const arrivals = dashboardData.guestArrivals.filter(guest => guest.vip);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">
            VVIP Arrivals <span className="text-[#947b66] font-normal lowercase">Today</span>
          </h3>
          <InfoTooltip text="Real-time ETA and special request itinerary tracker for today's arriving VVIP guests." />
        </div>
        <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] shrink-0">View all →</button>
      </div>

      <div className="flex-1 flex flex-col space-y-3">
        {arrivals.map((guest, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
              <User size={16} />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-[#4a3c31] flex items-center space-x-2">
                  <span>{guest.name}</span>
                  {guest.vip && (
                    <span className="text-[8px] border border-[#a65e52] text-[#a65e52] bg-[#a65e52]/5 px-1 rounded uppercase tracking-wide font-bold">VVIP</span>
                  )}
                </p>
                <p className="text-[9px] text-[#7d6b5e]">{guest.property} | {guest.time}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#657454]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
