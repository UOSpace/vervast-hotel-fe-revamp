import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function OccupancyByRoomTypeWidget({ 
  propertyId = 'sosei-nocturne',
  propertyName,
}: { 
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();

  const propertyRoomMap: Record<string, { occ: number; total: number; types: Array<{ type: string; occ: number; available: number }> }> = {
    'sosei-nocturne': {
      occ: 76, total: 95,
      types: [
        { type: 'Mountain Chalet', occ: 80, available: 30 },
        { type: 'Alpine Signature Suite', occ: 76, available: 25 },
        { type: 'Panorama Matterhorn Suite', occ: 75, available: 20 },
        { type: 'Glacier Wellness Villa', occ: 70, available: 20 },
      ]
    },
    'sosei-aurora': {
      occ: 74, total: 75,
      types: [
        { type: 'Glass Igloo Suite', occ: 82, available: 25 },
        { type: 'Aurora Panorama Chalet', occ: 75, available: 20 },
        { type: 'Arctic Pine Lodge', occ: 70, available: 15 },
        { type: 'Thermal Spa Cabin', occ: 67, available: 15 },
      ]
    },
    'sosei-hearth': {
      occ: 66, total: 60,
      types: [
        { type: 'Tuscan Heritage Villa', occ: 72, available: 20 },
        { type: 'Vineyard Terrace Suite', occ: 67, available: 15 },
        { type: 'Olive Grove Cottage', occ: 63, available: 15 },
        { type: 'Historic Farmhouse Suite', occ: 60, available: 10 },
      ]
    },
    'sosei-pastoral': {
      occ: 64, total: 54,
      types: [
        { type: 'Provencal Bastide Suite', occ: 70, available: 18 },
        { type: 'Lavender Field Villa', occ: 65, available: 14 },
        { type: 'Country Estate Room', occ: 62, available: 12 },
        { type: 'Garden Pavilion', occ: 58, available: 10 },
      ]
    },
    'sosei-verper': {
      occ: 73, total: 120,
      types: [
        { type: 'Manhattan Skyline Penthouse', occ: 78, available: 30 },
        { type: 'Upper East Luxury Suite', occ: 74, available: 35 },
        { type: 'Metropolitan Executive Room', occ: 72, available: 35 },
        { type: 'Central Park Studio', occ: 67, available: 20 },
      ]
    },
    'sosei-elan': {
      occ: 71, total: 88,
      types: [
        { type: 'Beverly Hills Presidential Villa', occ: 76, available: 20 },
        { type: 'Modernist Canyon Suite', occ: 72, available: 28 },
        { type: 'Wilshire Skyline Room', occ: 70, available: 25 },
        { type: 'Garden Terrace Studio', occ: 65, available: 15 },
      ]
    },
    'sosei-marea': {
      occ: 82, total: 68,
      types: [
        { type: 'Overwater Sunset Villa', occ: 88, available: 24 },
        { type: 'Lagoon Sanctuary Pool Suite', occ: 82, available: 20 },
        { type: 'Oceanfront Beach Pavilion', occ: 80, available: 14 },
        { type: 'Private Atoll Residence', occ: 75, available: 10 },
      ]
    },
    'sosei-pelagia': {
      occ: 80, total: 82,
      types: [
        { type: 'Cliffside Ocean Villa', occ: 85, available: 28 },
        { type: 'Coral Reef Suite', occ: 81, available: 24 },
        { type: 'Tropical Garden Pavilion', occ: 78, available: 18 },
        { type: 'Sanctuary Pool Residence', occ: 73, available: 12 },
      ]
    },
    'sosei-sylvan': {
      occ: 70, total: 46,
      types: [
        { type: 'Kyoto Bamboo Sanctuary', occ: 75, available: 14 },
        { type: 'Zen Garden Tatami Suite', occ: 72, available: 12 },
        { type: 'Forest Sylvan Pavilion', occ: 68, available: 10 },
        { type: 'Onsen Heritage Villa', occ: 65, available: 10 },
      ]
    },
    'sosei-verdant': {
      occ: 68, total: 48,
      types: [
        { type: 'Canopy Rainforest Suite', occ: 74, available: 15 },
        { type: 'Misty Peak Mountain Villa', occ: 70, available: 13 },
        { type: 'Verdant Treehouse Haven', occ: 66, available: 11 },
        { type: 'Organic Valley Pavilion', occ: 62, available: 9 },
      ]
    },
    'sosei-mirage': {
      occ: 71, total: 68,
      types: [
        { type: 'Dunes Oasis Tent Suite', occ: 77, available: 22 },
        { type: 'Siwa Palm Heritage Villa', occ: 72, available: 18 },
        { type: 'Desert Starlight Pavilion', occ: 69, available: 16 },
        { type: 'Mineral Spring Sanctuary', occ: 64, available: 12 },
      ]
    },
    'sosei-solstice': {
      occ: 69, total: 69,
      types: [
        { type: 'Wahiba Sands Royal Suite', occ: 75, available: 23 },
        { type: 'Bedouin Luxury Pavilion', occ: 70, available: 18 },
        { type: 'Desert Canyon Retreat', occ: 67, available: 15 },
        { type: 'Oasis Wellness Chalet', occ: 62, available: 13 },
      ]
    },
  };

  const propInfo = propertyRoomMap[propertyId] ?? propertyRoomMap['sosei-nocturne'];
  const totalOccupied = Math.round(propInfo.total * (propInfo.occ / 100));

  const data = propInfo.types.map(t => ({
    type: t.type,
    occ: t.occ,
    occupied: Math.round(t.available * (t.occ / 100)),
    available: t.available,
  }));

  const totals = { occ: propInfo.occ, occupied: totalOccupied, available: propInfo.total };

  const activePropName = propertyName || 'SOSEI Nocturne';

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

