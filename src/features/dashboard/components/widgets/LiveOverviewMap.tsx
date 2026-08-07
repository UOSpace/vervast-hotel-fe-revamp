import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import mapData from '../../../../data/mapData.json';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const statusColors: Record<string, string> = {
  high: '#18181b',
  moderate: '#52525b',
  low: '#71717a',
  limited: '#a1a1aa',
};

export function LiveOverviewMap() {
  const [position, setPosition] = useState({ coordinates: [15, 20] as [number, number], zoom: 1 });
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  const handleZoomIn = () => {
    setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }));
  };

  const handleZoomOut = () => {
    setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 0.5) }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [15, 20], zoom: 1 });
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex-1 relative overflow-hidden rounded-md">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 105, center: [15, 20] }}
          width={850}
          height={360}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={0.5}
            maxZoom={8}
          >
          <defs>
            {/* Paper texture */}
            <filter id="paper" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
              <feComponentTransfer in="blend">
                <feFuncR type="linear" slope="0.95" intercept="0.05" />
                <feFuncG type="linear" slope="0.93" intercept="0.04" />
                <feFuncB type="linear" slope="0.90" intercept="0.03" />
              </feComponentTransfer>
            </filter>

            {/* Country shadow */}
            <filter id="countryShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>

            {/* Radial gradient dots per status */}
            {Object.entries(statusColors).map(([status, color]) => (
              <radialGradient key={status} id={`dotGradient-${status}`} cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor={color} stopOpacity="0.95" />
                <stop offset="40%" stopColor={color} stopOpacity="0.60" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Flat country polygons */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e4e4e7"
                  stroke="#d4d4d8"
                  strokeWidth={0.5}
                  filter="url(#paper)"
                  style={{
                    default: { outline: 'none', filter: 'url(#countryShadow)', pointerEvents: 'none' },
                    hover: { outline: 'none', filter: 'url(#countryShadow)', pointerEvents: 'none' },
                    pressed: { outline: 'none', pointerEvents: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Markers — dots always visible, hovered marker rendered last so its popup is ALWAYS on top */}
          {(hoveredMarkerId
            ? [...mapData.filter(m => m.id !== hoveredMarkerId), mapData.find(m => m.id === hoveredMarkerId)!]
            : mapData
          ).map(({ id, name, city, coordinates, status, revenue }) => {
            const markerColor = statusColors[status] || statusColors.high;
            const isHovered = hoveredMarkerId === id;
            return (
              <Marker key={id} coordinates={coordinates as [number, number]}>
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredMarkerId(id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  style={{ transform: `scale(${1 / position.zoom})`, transformOrigin: '0px 0px' }}
                >
                  {/* Outer radial gradient glow */}
                  <circle r={isHovered ? 18 : 14} fill={`url(#dotGradient-${status})`} className="transition-all duration-200" />
                  {/* Pulse beacon effect */}
                  <circle className="map-beacon" fill="none" stroke={markerColor} />
                  {/* Inner solid dot */}
                  <circle r={isHovered ? 5 : 3.5} fill={markerColor} stroke="#fff" strokeWidth={1.5} className="transition-all duration-200" />

                  {/* Label pill - visible only when hovered */}
                  {isHovered && (
                    <foreignObject
                      x={-75}
                      y={-62}
                      width={220}
                      height={65}
                      style={{ overflow: 'visible', pointerEvents: 'none' }}
                    >
                      <div className="relative animate-in fade-in zoom-in-95 duration-150" style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        borderRadius: '10px',
                        padding: '7px 12px',
                        width: 'max-content',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
                        border: '1px solid rgba(228, 228, 231, 0.9)',
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#111827', lineHeight: 1.3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{name}</div>
                        <div className="flex justify-between items-center gap-3 mt-1" style={{ fontSize: '10px', lineHeight: 1.2 }}>
                          <span style={{ color: '#6B7280' }}>{city}</span>
                          <span style={{ color: '#059669', fontWeight: 700 }}>{revenue}</span>
                        </div>
                        {/* Downward pointer arrow pointing to the dot */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-5px',
                          left: '50%',
                          transform: 'translateX(-50%) rotate(45deg)',
                          width: '10px',
                          height: '10px',
                          background: 'rgba(255, 255, 255, 0.98)',
                          borderRight: '1px solid rgba(228, 228, 231, 0.9)',
                          borderBottom: '1px solid rgba(228, 228, 231, 0.9)',
                        }} />
                      </div>
                    </foreignObject>
                  )}
                </g>
              </Marker>
            );
          })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-0.5">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:brightness-95"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(228, 228, 231, 0.6)',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
            title="Zoom In"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:brightness-95"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(228, 228, 231, 0.6)',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
            title="Zoom Out"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:brightness-95"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(228, 228, 231, 0.6)',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
            title="Reset View"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>

        {/* Legend (Commented out per user request) */}
        {/*
        <div className="absolute bottom-3 left-3 px-3 py-2.5 rounded-lg" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(228, 228, 231, 0.6)',
        }}>
          <div className="space-y-1.5">
            {[
               { label: 'High Revenue (≥ $80.0M)', color: '#18181b' },
               { label: 'Moderate Revenue ($40.0M - $79.9M)', color: '#52525b' },
               { label: 'Low Revenue ($20.0M - $39.9M)', color: '#71717a' },
               { label: 'Underperforming (< $20.0M)', color: '#a1a1aa' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[9px] text-[#1a1a1a]">{label}</span>
              </div>
            ))}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
