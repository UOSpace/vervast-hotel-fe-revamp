import { InfoTooltip } from '../../../common/components/InfoTooltip';
import dashboardData from '../../../../data/dashboardData.json';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import { RoundAltArrowRight } from '@solar-icons/react';

export function GuestArrivalsWidget() {
  const { openDrawer } = useDashboardDrawer();
  const arrivals = dashboardData.guestArrivals;

  const handleOpenList = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDrawer({
      type: 'GUEST_ARRIVALS',
      title: 'VVIP Arrivals List',
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Header with See Full List trigger */}
      <div className="flex justify-between items-end mb-2 shrink-0">
        <InfoTooltip text="Real-time ETA and special request itinerary tracker for today's arriving VVIP guests.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#374151] cursor-help">VVIP Arrivals</h3>
            <p className="text-[10px] text-[#6B7280]">TODAY ({arrivals.length} GUESTS)</p>
          </div>
        </InfoTooltip>

        <button
          onClick={handleOpenList}
          className="text-[9px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
        >
          See list <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Clean Static List Container */}
      <div className="flex-1 flex flex-col justify-around py-0.5">
        {arrivals.slice(0, 5).map((guest: any, i: number) => (
          <div key={guest.id || i} className="flex flex-col">
            <div
              onClick={handleOpenList}
              className="flex items-center justify-between py-0.5 hover:bg-gray-200/50 px-1 rounded transition-all cursor-pointer"
            >
              <div className="truncate pr-2">
                <p className="text-[10px] font-medium text-[#374151] truncate">{guest.name}</p>
                <p className="text-[9px] text-[#6B7280] truncate">
                  <span className="font-semibold text-emerald-700">{guest.property}</span> · {guest.time}
                </p>
              </div>
              {guest.vip && (
                <span className="text-[7px] border border-[#1F1D1C] text-[#1F1D1C] bg-[#1F1D1C]/5 px-1.5 py-0.5 rounded uppercase tracking-wide font-bold shrink-0">
                  VVIP
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
