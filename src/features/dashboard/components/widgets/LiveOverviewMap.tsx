import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import mapData from '../../../../data/mapData.json';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export function LiveOverviewMap() {
  const alpineHub = mapData.find(d => d.id === 'alpine')?.coordinates || [8.2275, 46.8182];

  return (
    <div className="w-full h-full relative flex flex-col">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-2">Live Overview</h3>
      <div className="flex-1 relative bg-transparent overflow-hidden">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }} width={800} height={400} style={{ width: '100%', height: '100%' }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e5d8cb"
                  stroke="#d4c4b7"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#c0ae9f' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          
          {/* Draw connecting lines from Alpine Hub */}
          {mapData.filter(d => d.id !== 'alpine').map((location) => (
            <Line
              key={`line-${location.id}`}
              from={alpineHub as [number, number]}
              to={location.coordinates as [number, number]}
              stroke="#BA9468"
              strokeWidth={1}
              strokeLinecap="round"
              className="opacity-50"
            />
          ))}

          {/* Draw markers and labels */}
          {mapData.map(({ id, name, city, coordinates, labelOffset }) => (
            <Marker key={id} coordinates={coordinates as [number, number]}>
              <circle r={3} fill="#BA9468" />
              <circle r={10} fill="#BA9468" className="opacity-20 animate-ping" />
              
              <foreignObject x={labelOffset[0]} y={labelOffset[1]} width={130} height={40}>
                <div className="bg-[#FAF5F0] rounded shadow-sm border border-[#E3D1C1] px-2 py-1 w-max">
                  <div className="text-[8px] font-bold text-[#4a3c31] leading-none mb-0.5">{name}</div>
                  <div className="text-[8px] text-[#7d6b5e] leading-none">{city}</div>
                </div>
              </foreignObject>
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 bg-[#EFE7D5]/80 backdrop-blur-sm border border-[#d4c4b7] rounded-lg">
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BA9468]"></span>
              <span className="text-[#4a3c31]">High Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#829C64]"></span>
              <span className="text-[#4a3c31]">Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#477684]"></span>
              <span className="text-[#4a3c31]">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#71558C]"></span>
              <span className="text-[#4a3c31]">Limited Operations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
