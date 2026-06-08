import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { User } from '@solar-icons/react';
import dashboardData from '../../../../data/dashboardData.json';

export function GuestArrivalsWidget() {
  const arrivals = dashboardData.guestArrivals.filter(guest => guest.vip);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] mb-0">
          VVIP Arrivals <span className="text-[#947b66] font-normal lowercase">Today</span>
        </h3>
        <InfoTooltip text="Real-time ETA and special request itinerary tracker for today's arriving VVIP guests." />
      </div>

      <div className="flex-1 flex flex-col space-y-1.5">
        {arrivals.map((guest, i) => (
          <div key={i} className="flex items-center space-x-3 border border-[#d4c4b7]/50 rounded-lg p-1.5 hover:border-[#C8A050]/50 hover:bg-[#f3eae1]/50 transition-all cursor-pointer">
            <div className="w-7 h-7 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
              <User size={14} />
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

      <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] underline cursor-pointer self-start mt-2">
        View all →
      </button>
    </div>
  );
}
