import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from 'react-simple-maps';
import mapData from '../../../../data/mapData.json';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const ALPINE_COORDS: [number, number] = [8.2275, 46.8182];

const statusColors: Record<string, string> = {
  high: '#C8A050',
  moderate: '#829C64',
  low: '#477684',
  limited: '#71558C',
};

export function LiveOverviewMap() {
  const [position, setPosition] = useState({ coordinates: [15, 20] as [number, number], zoom: 1 });

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
          projectionConfig={{ scale: 115, center: [15, 20] }}
          width={880}
          height={385}
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
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#8a7060" floodOpacity="0.3" />
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

          {/* Flat country polygons — no highlight */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d9cabb"
                  stroke="#c8b9a8"
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

          {/* Connection lines from Alpine hub */}
          {mapData
            .filter(d => d.id !== 'alpine')
            .map((location) => (
              <Line
                key={`line-${location.id}`}
                from={ALPINE_COORDS}
                to={location.coordinates as [number, number]}
                stroke="#C8A050"
                strokeWidth={1.1}
                strokeLinecap="round"
                style={{ opacity: 0.65 }}
              />
            ))}

          {/* Markers — radial gradient dot + label */}
          {mapData.map(({ id, name, city, coordinates, labelOffset, status, revenue }) => {
            const markerColor = statusColors[status] || statusColors.high;
            return (
              <Marker key={id} coordinates={coordinates as [number, number]}>
                {/* Outer radial gradient glow */}
                <circle r={14} fill={`url(#dotGradient-${status})`} />
                {/* Inner solid dot */}
                <circle r={3.5} fill={markerColor} stroke="#fff" strokeWidth={1} />

                {/* Label pill */}
                <foreignObject
                  x={labelOffset[0]}
                  y={labelOffset[1]}
                  width={150}
                  height={38}
                  style={{ overflow: 'visible' }}
                >
                  <div style={{
                    background: 'rgba(255,252,248,0.96)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    width: 'max-content',
                    boxShadow: '0 1px 6px rgba(100,80,60,0.18)',
                    border: '1px solid rgba(200,180,160,0.4)',
                  }}>
                    <div style={{ fontSize: '7.5px', fontWeight: 700, color: '#4a3c31', lineHeight: 1.2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{name}</div>
                    <div className="flex justify-between items-center gap-2 mt-0.5" style={{ fontSize: '7.5px', lineHeight: 1.2 }}>
                      <span style={{ color: '#9B8272' }}>{city}</span>
                      <span style={{ color: '#a65e52', fontWeight: 700 }}>{revenue}</span>
                    </div>
                  </div>
                </foreignObject>
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
              background: 'rgba(240,232,220,0.88)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(200,180,160,0.4)',
              color: '#4a3c31',
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
              background: 'rgba(240,232,220,0.88)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(200,180,160,0.4)',
              color: '#4a3c31',
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
              background: 'rgba(240,232,220,0.88)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(200,180,160,0.4)',
              color: '#4a3c31',
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

        {/* Legend */}
        <div className="absolute bottom-3 left-3 px-3 py-2.5 rounded-lg" style={{
          background: 'rgba(240,232,220,0.82)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(200,180,160,0.35)',
        }}>
          <div className="space-y-1.5">
            {[
              { label: 'High Revenue (≥ $4.0M)', color: '#C8A050' },
              { label: 'Moderate Revenue ($2.0M - $3.9M)', color: '#829C64' },
              { label: 'Low Revenue ($1.0M - $1.9M)', color: '#477684' },
              { label: 'Underperforming (< $1.0M)', color: '#71558C' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[9px] text-[#4a3c31]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
