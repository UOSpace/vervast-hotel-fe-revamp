import { useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { simulatedPropertiesData, type SimulatedPropertyMapItem } from '../../services/propertySimulation';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Subtle status indicators as requested:
// - performing above plan (emerald)
// - on plan (neutral zinc)
// - attention (rose/amber)
const statusConfig: Record<string, { dotColor: string; badgeBg: string; badgeText: string; label: string }> = {
  above_plan: {
    dotColor: '#14532d', // deep dark green / hijau tua
    badgeBg: '#ecfdf5',
    badgeText: '#14532d',
    label: 'Performing above plan',
  },
  on_plan: {
    dotColor: '#71717a', // clean neutral zinc
    badgeBg: '#f4f4f5',
    badgeText: '#52525b',
    label: 'On plan',
  },
  attention: {
    dotColor: '#800020', // deep maroon
    badgeBg: '#fff1f2',
    badgeText: '#800020',
    label: 'Attention',
  },
};

export function LiveOverviewMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ coordinates: [18, 25] as [number, number], zoom: 1.35 });
  const [hoveredData, setHoveredData] = useState<{
    item: SimulatedPropertyMapItem;
    x: number;
    y: number;
  } | null>(null);

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
    setHoveredData(null);
  };

  const handleZoomIn = () => {
    setHoveredData(null);
    setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.3, 8) }));
  };

  const handleZoomOut = () => {
    setHoveredData(null);
    setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.3, 0.6) }));
  };

  const handleReset = () => {
    setHoveredData(null);
    setPosition({ coordinates: [18, 25], zoom: 1.35 });
  };

  // Popover positioning calculations
  const CARD_WIDTH = 250;
  const CARD_HEIGHT = 115;
  let top = 0;
  let left = 0;
  let isFlipDown = false;
  let arrowLeft = 125;

  if (hoveredData && containerRef.current) {
    const containerWidth = containerRef.current.clientWidth;
    // Flip downward if marker is in the upper part of the widget
    isFlipDown = hoveredData.y < 130;

    if (isFlipDown) {
      top = hoveredData.y + 12;
    } else {
      top = hoveredData.y - CARD_HEIGHT - 12;
    }

    // Centered horizontally over the pin
    left = hoveredData.x - CARD_WIDTH / 2;

    // Boundary clamping to ensure card stays framed
    if (left < 8) {
      left = 8;
    } else if (left + CARD_WIDTH > containerWidth - 8) {
      left = containerWidth - CARD_WIDTH - 8;
    }

    // Precise pointer arrow targeting the pin
    arrowLeft = Math.max(16, Math.min(CARD_WIDTH - 16, hoveredData.x - left));
  }

  return (
    <div ref={containerRef} className="w-full h-full relative flex flex-col select-none">
      <div className="flex-1 relative overflow-hidden rounded-md bg-white">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 110, center: [18, 25] }}
          width={850}
          height={360}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
          onMouseLeave={() => setHoveredData(null)}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            minZoom={0.6}
            maxZoom={8}
          >
          <defs>
            {/* Country subtle shadow */}
            <filter id="countryShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.06" />
            </filter>

            {/* Radial gradient dots per status */}
            {Object.entries(statusConfig).map(([statusKey, cfg]) => (
              <radialGradient key={statusKey} id={`dotGradient-${statusKey}`} cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor={cfg.dotColor} stopOpacity={0.9} />
                <stop offset="40%" stopColor={cfg.dotColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={cfg.dotColor} stopOpacity={0} />
              </radialGradient>
            ))}
          </defs>

          {/* Clean monochrome country polygons */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#ebecee"
                  stroke="#d4d4d8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', filter: 'url(#countryShadow)', pointerEvents: 'none' },
                    hover: { outline: 'none', filter: 'url(#countryShadow)', pointerEvents: 'none' },
                    pressed: { outline: 'none', pointerEvents: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Markers — subtle dots that don't overwhelm the map */}
          {simulatedPropertiesData.map((item) => {
            const { id, coordinates, status } = item;
            const cfg = statusConfig[status] || statusConfig.on_plan;
            const isHovered = hoveredData?.item.id === id;

            return (
              <Marker key={id} coordinates={coordinates as [number, number]}>
                <g
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                      setHoveredData({
                        item,
                        x: rect.left + rect.width / 2 - containerRect.left,
                        y: rect.top + rect.height / 2 - containerRect.top,
                      });
                    }
                  }}
                  style={{ transform: `scale(${1 / position.zoom})`, transformOrigin: '0px 0px' }}
                >
                  {/* Subtle outer glow */}
                  <circle r={isHovered ? 18 : 10} fill={`url(#dotGradient-${status})`} className="transition-all duration-200" />
                  {/* Outer ring */}
                  <circle r={isHovered ? 6 : 4} fill="none" stroke={cfg.dotColor} strokeWidth={1} opacity={0.6} />
                  {/* Inner solid dot */}
                  <circle r={isHovered ? 4.5 : 2.5} fill={cfg.dotColor} stroke="#ffffff" strokeWidth={1} className="transition-all duration-200" />
                </g>
              </Marker>
            );
          })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Subtle Map Status Legend at top-left */}
        <div
          className={`absolute top-2 left-2 px-2.5 py-1.5 rounded-md flex items-center gap-3 backdrop-blur-xs transition-opacity duration-200 z-10 ${
            hoveredData ? 'opacity-30 pointer-events-none' : 'opacity-90'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e4e4e7',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14532d]" />
            <span className="text-[8px] text-zinc-600 font-medium">Above Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span className="text-[8px] text-zinc-600 font-medium">On Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
            <span className="text-[8px] text-zinc-600 font-medium">Attention</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-0.5">
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e4e4e7',
            }}
            title="Zoom In"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e4e4e7',
            }}
            title="Zoom Out"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e4e4e7',
            }}
            title="Reset View"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Luxury Popover Overlay - Placed outside overflow-hidden with high z-index */}
      {hoveredData && (
        <div
          className="absolute pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: `${CARD_WIDTH}px`,
          }}
        >
          <div
            className="relative rounded-[12px] p-3 text-left bg-white/98 border border-zinc-200 shadow-xl shadow-black/10"
          >
            {/* Header: Property Name + Grouping & Status */}
            <div className="flex items-start justify-between gap-1.5 pb-1.5 border-b border-zinc-100">
              <div>
                <div className="text-[13px] font-bold text-zinc-900 leading-tight tracking-wide uppercase">
                  {hoveredData.item.name}
                </div>
                <div className="text-[9.5px] font-medium text-zinc-500 mt-0.5">
                  {hoveredData.item.grouping} · {hoveredData.item.city} · <span className="font-semibold text-zinc-700">{hoveredData.item.totalRooms} Keys</span>
                </div>
              </div>
              {/* Subtle status dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: (statusConfig[hoveredData.item.status] || statusConfig.on_plan).dotColor,
                  flexShrink: 0,
                  marginTop: '3px',
                }}
                title={(statusConfig[hoveredData.item.status] || statusConfig.on_plan).label}
              />
            </div>

            {/* Calculated PMS Metrics */}
            <div className="mt-1.5 space-y-1 text-[10.5px]">
              <div className="flex justify-between items-center text-zinc-500">
                <span>Occupancy</span>
                <span className="font-bold text-zinc-900">
                  {hoveredData.item.occupancyFormatted}{' '}
                  <span className="text-[9px] font-medium text-zinc-400">
                    ({hoveredData.item.occupiedRooms}/{hoveredData.item.totalRooms} keys)
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span>ADR / RevPAR</span>
                <span className="font-bold text-zinc-900">
                  {hoveredData.item.adrFormatted}{' '}
                  <span className="text-[9px] font-medium text-zinc-400">
                    / {hoveredData.item.revparFormatted}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span>Revenue (MTD)</span>
                <span className="font-bold text-zinc-900">
                  {hoveredData.item.revenueFormatted}
                </span>
              </div>
            </div>

            {/* Subtle status text indicator & period at bottom */}
            <div className="mt-2 pt-1.5 border-t border-zinc-100 flex items-center justify-between">
              <span
                style={{
                  fontSize: '8.5px',
                  fontWeight: 600,
                  backgroundColor: (statusConfig[hoveredData.item.status] || statusConfig.on_plan).badgeBg,
                  color: (statusConfig[hoveredData.item.status] || statusConfig.on_plan).badgeText,
                  padding: '1.5px 6px',
                  borderRadius: '9999px',
                }}
              >
                {(statusConfig[hoveredData.item.status] || statusConfig.on_plan).label}
              </span>

              <span className="text-[9px] font-medium text-zinc-400">
                Month to Date
              </span>
            </div>

            {/* Arrow Pointer positioned exactly towards marker center */}
            {isFlipDown ? (
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: `${arrowLeft}px`,
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '12px',
                  height: '12px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  borderLeft: '1px solid #e4e4e7',
                  borderTop: '1px solid #e4e4e7',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: `${arrowLeft}px`,
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '12px',
                  height: '12px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  borderRight: '1px solid #e4e4e7',
                  borderBottom: '1px solid #e4e4e7',
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
