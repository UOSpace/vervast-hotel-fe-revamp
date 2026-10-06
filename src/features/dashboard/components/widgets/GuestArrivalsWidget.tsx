import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { getDashboardComputedData } from '../../../../data/pms';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import { RoundAltArrowRight } from '@solar-icons/react';

export function GuestArrivalsWidget() {
  const { openDrawer } = useDashboardDrawer();
  const arrivals = getDashboardComputedData().vvipArrivals;

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
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">VVIP Arrivals</h3>
            <p className="text-[10px] text-zinc-500 font-medium">TODAY ({arrivals.length} GUESTS)</p>
          </div>
        </InfoTooltip>

        <button
          onClick={handleOpenList}
          className="text-[9.5px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
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
              className="flex items-center justify-between py-1 hover:bg-zinc-100/80 px-1.5 rounded-md transition-all cursor-pointer"
            >
              <div className="truncate pr-2">
                <p className="text-[10px] font-medium text-zinc-900 truncate">{guest.name}</p>
                <p className="text-[9px] text-zinc-500 truncate">
                  <span className="font-semibold text-emerald-700">{guest.property}</span> · {guest.time}
                </p>
              </div>
              {guest.vip && (
                <span className="text-[7.5px] border border-zinc-800 text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold shrink-0">
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
