import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

function getTooltipText(label: string) {
  const l = label.toUpperCase();
  if (l.includes('OCCUPANCY')) return "Percentage of occupied rooms relative to total available rooms.";
  if (l.includes('REVENUE')) return "Total generated revenue from rooms, food and beverage, and other departments today.";
  if (l.includes('REVPAR')) return "Revenue Per Available Room, calculated as Occupancy rate multiplied by Average Daily Rate.";
  if (l.includes('ADR')) return "Average Daily Rate, representing the average rental income per occupied room today.";
  if (l.includes('NIGHTS')) return "Total number of room nights booked during the selected period.";
  if (l.includes('STAY') || l.includes('LOS')) return "The average number of nights guests stay at the property.";
  return "Key performance indicator metrics.";
}

export function ResortKPIWidget({ kpis }: { kpis: any[] }) {
  const { openDrawer } = useDashboardDrawer();
  const occ = kpis[0];
  const rev = kpis[1];
  const revpar = kpis[2];
  const adr = kpis[3];
  const nights = kpis[4];

  const renderCard = (kpi: any, idx: number) => {
    if (!kpi) return null;
    return (
      <div
        key={kpi.label}
        className="h-full rounded-[12px] p-3 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all cursor-pointer animate-card-enter"
        style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
        onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <InfoTooltip text={getTooltipText(kpi.label)}>
            <p className="text-[10px] font-normal tracking-wider uppercase text-[#4a3c31] whitespace-nowrap truncate cursor-help">
              {kpi.label}
            </p>
          </InfoTooltip>
        </div>

        <h3 className="text-[22px] font-normal text-[#4a3c31] my-1">
          {kpi.value}
        </h3>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
      {/* Col 1: OCCUPANCY & Room Revenue */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {renderCard(occ, 0)}
        {renderCard(rev, 1)}
      </div>

      {/* Col 2: RevPAR & ADR */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {renderCard(revpar, 2)}
        {renderCard(adr, 3)}
      </div>

      {/* Col 3: TOTAL ROOM NIGHTS */}
      <div className="w-full h-full">
        {renderCard(nights, 4)}
      </div>
    </div>
  );
}

