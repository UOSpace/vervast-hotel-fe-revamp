import { InfoTooltip } from '../../../common/components/InfoTooltip';

export interface RoomTierItem {
  tier: string;
  category: string;
  occupancy: string;
  percentage: number;
  adr: string;
}

export const roomTierOccupancyData: RoomTierItem[] = [
  {
    tier: 'Presidential & Royal Villas',
    category: 'Ultra Luxury Tier',
    occupancy: '92.00%',
    percentage: 92.0,
    adr: '$3,450',
  },
  {
    tier: 'Horizon Overwater Suites',
    category: 'Signature Suite Tier',
    occupancy: '86.50%',
    percentage: 86.5,
    adr: '$2,250',
  },
  {
    tier: 'Signature Alpine Chalets',
    category: 'Premium Chalet Tier',
    occupancy: '81.20%',
    percentage: 81.2,
    adr: '$1,850',
  },
  {
    tier: 'Ocean & Beachfront Villas',
    category: 'Oceanfront Tier',
    occupancy: '78.40%',
    percentage: 78.4,
    adr: '$1,420',
  },
  {
    tier: 'Garden & Forest Pavilions',
    category: 'Sanctuary Pavilion Tier',
    occupancy: '74.00%',
    percentage: 74.0,
    adr: '$1,180',
  },
];

const zincShades = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'];

export function RoomTierOccupancyWidget() {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-2">
        <InfoTooltip text="Occupancy performance breakdown across room categories, premium suites, and private villas.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              Room Tier Occupancy
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">SUITE & VILLA PERFORMANCE</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-around py-1 space-y-3.5">
        {roomTierOccupancyData.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-700 font-medium truncate">{item.tier}</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="text-[9.5px] text-zinc-500 font-medium">({item.adr})</span>
                <span className="text-zinc-900 font-semibold text-[10px]">{item.occupancy}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: zincShades[i % zincShades.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
