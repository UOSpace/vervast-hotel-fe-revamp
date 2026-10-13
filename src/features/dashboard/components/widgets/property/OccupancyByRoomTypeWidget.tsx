import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';

export function OccupancyByRoomTypeWidget({ 
  propertyId: rawPropertyId = 'sosei-barcelona',
  propertyName,
}: { 
  propertyId?: string;
  propertyName?: string;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const propertyRoomMap: Record<string, { occ: number; total: number; types: Array<{ type: string; occ: number; available: number }> }> = {
    'sosei-barcelona': {
      occ: 78, total: 110,
      types: [
        { type: 'Catalan Penthouse Suite', occ: 84, available: 25 },
        { type: 'Passeig Deluxe Room', occ: 79, available: 35 },
        { type: 'Mediterranean Terrace Suite', occ: 76, available: 30 },
        { type: 'Gothic Quarter Studio', occ: 72, available: 20 },
      ]
    },
    'sosei-tokyo': {
      occ: 81, total: 95,
      types: [
        { type: 'Imperial Skyline Suite', occ: 88, available: 25 },
        { type: 'Ginza Panorama Room', occ: 82, available: 30 },
        { type: 'Zen Garden Executive Suite', occ: 78, available: 25 },
        { type: 'Metropolitan Studio', occ: 74, available: 15 },
      ]
    },
    'sosei-bali': {
      occ: 80, total: 82,
      types: [
        { type: 'Cliffside Ocean Villa', occ: 85, available: 28 },
        { type: 'Coral Reef Suite', occ: 81, available: 24 },
        { type: 'Tropical Garden Pavilion', occ: 78, available: 18 },
        { type: 'Sanctuary Pool Residence', occ: 73, available: 12 },
      ]
    },
    'sosei-maldives': {
      occ: 82, total: 68,
      types: [
        { type: 'Overwater Sunset Villa', occ: 88, available: 24 },
        { type: 'Lagoon Sanctuary Pool Suite', occ: 82, available: 20 },
        { type: 'Oceanfront Beach Pavilion', occ: 80, available: 14 },
        { type: 'Private Atoll Residence', occ: 75, available: 10 },
      ]
    },
    'sosei-switzerland': {
      occ: 76, total: 72,
      types: [
        { type: 'Matterhorn Chalet Suite', occ: 82, available: 22 },
        { type: 'Alpine Signature Suite', occ: 77, available: 20 },
        { type: 'Panorama Glacial Room', occ: 74, available: 16 },
        { type: 'Thermal Spa Cabin', occ: 70, available: 14 },
      ]
    },
    'sosei-canada': {
      occ: 74, total: 84,
      types: [
        { type: 'Whistler Alpine Lodge', occ: 80, available: 26 },
        { type: 'Glacier Panorama Suite', occ: 75, available: 24 },
        { type: 'Cedar Mountain Room', occ: 72, available: 20 },
        { type: 'Nordic Spa Cabin', occ: 67, available: 14 },
      ]
    },
    'sosei-costa-rica': {
      occ: 68, total: 54,
      types: [
        { type: 'Canopy Rainforest Suite', occ: 74, available: 18 },
        { type: 'Misty Peak Mountain Villa', occ: 70, available: 14 },
        { type: 'Verdant Treehouse Haven', occ: 66, available: 12 },
        { type: 'Pacific Vista Pavilion', occ: 60, available: 10 },
      ]
    },
    'sosei-japan': {
      occ: 72, total: 58,
      types: [
        { type: 'Hakone Forest Tatami Suite', occ: 78, available: 18 },
        { type: 'Onsen Heritage Villa', occ: 74, available: 16 },
        { type: 'Bamboo Sanctuary Room', occ: 70, available: 14 },
        { type: 'Zen Mountain Pavilion', occ: 65, available: 10 },
      ]
    },
    'sosei-oman': {
      occ: 71, total: 85,
      types: [
        { type: 'Wahiba Sands Royal Suite', occ: 76, available: 26 },
        { type: 'Bedouin Luxury Pavilion', occ: 72, available: 24 },
        { type: 'Desert Canyon Retreat', occ: 68, available: 20 },
        { type: 'Oasis Wellness Chalet', occ: 64, available: 15 },
      ]
    },
    'sosei-egypt': {
      occ: 70, total: 72,
      types: [
        { type: 'Nile Starlight Pavilion', occ: 76, available: 22 },
        { type: 'Pharaonic Heritage Suite', occ: 72, available: 20 },
        { type: 'Dunes Oasis Tent Suite', occ: 68, available: 16 },
        { type: 'Mineral Spring Sanctuary', occ: 62, available: 14 },
      ]
    },
  };

  const propInfo = propertyRoomMap[propertyId] ?? propertyRoomMap['sosei-barcelona'];
  const totalOccupied = Math.round(propInfo.total * (propInfo.occ / 100));

  const data = propInfo.types.map(t => ({
    type: t.type,
    occ: t.occ,
    occupied: Math.round(t.available * (t.occ / 100)),
    available: t.available,
  }));

  const totals = { occ: propInfo.occ, occupied: totalOccupied, available: propInfo.total };

  const activePropName = propertyName || 'SOSEI Barcelona';

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ 
        type: 'ROOM_TIER_OCCUPANCY', 
        title: `Room Tier Occupancy — ${activePropName}`, 
        data: { propertyId, propertyName: activePropName, types: propInfo.types, totals, data } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Occupancy by Room Type</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ROOM_TIER_OCCUPANCY',
                title: `Room Tier Occupancy — ${activePropName}`,
                data: { propertyId, propertyName: activePropName, types: propInfo.types, totals, data }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="Detailed room type occupancy count and percentage breakdown." />
        </div>
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

