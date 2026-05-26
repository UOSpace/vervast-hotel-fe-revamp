import { User } from '@solar-icons/react';
import dashboardData from '../../../../data/dashboardData.json';

export function GuestArrivalsWidget() {
  const arrivals = dashboardData.guestArrivals;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">
          Guest Arrivals <span className="text-[#947b66] font-normal lowercase">Today</span>
        </h3>
        <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31]">View all →</button>
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
                    <span className="text-[8px] border border-[#947b66] text-[#947b66] px-1 rounded uppercase tracking-wide">VIP</span>
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
