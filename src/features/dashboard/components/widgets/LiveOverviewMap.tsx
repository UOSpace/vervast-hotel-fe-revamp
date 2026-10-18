import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { fmtUsd, type PeriodId } from '@/data/portfolio';
import { getSimulatedPropertiesData, type SimulatedPropertyMapItem } from '../../services/propertySimulation';
import { getUserLocationAndTimezone } from './DashboardHeaderWidget';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

/**
 * Slight visual coordinate offsets at low zoom levels so closely-clustered pins
 * across Europe & Mediterranean never overlap or steal hover events.
 */
const CLOSE_PIN_OFFSETS: Record<string, [number, number]> = {
  'sosei-andermatt': [0.8, 1.4],
  'sosei-umbria': [1.6, -0.6],
  'sosei-barcelona': [-0.8, 0.5],
  'sosei-melides': [-1.4, -0.8],
  'sosei-tinos': [1.2, -0.8],
};

function getDisplayCoordinates(id: string, coords: [number, number], zoom: number): [number, number] {
  const offset = CLOSE_PIN_OFFSETS[id];
  if (!offset) return coords;
  // Smoothly reduce visual offset as user zooms in
  const factor = Math.max(0.15, Math.min(1, 1.35 / zoom));
  return [coords[0] + offset[0] * factor, coords[1] + offset[1] * factor];
}

export function LiveOverviewMap({ period = 'mtd' }: { period?: PeriodId }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ coordinates: [18, 25] as [number, number], zoom: 1.35 });
  const [hoveredInfo, setHoveredInfo] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const propertiesData = getSimulatedPropertiesData(period);
  const hoveredItem = hoveredInfo
    ? propertiesData.find((p) => p.id === hoveredInfo.id) ?? null
    : null;

  // Render hovered marker last in SVG so it always sits on top of adjacent pins
  const orderedProperties = hoveredInfo
    ? [
        ...propertiesData.filter((p) => p.id !== hoveredInfo.id),
        ...propertiesData.filter((p) => p.id === hoveredInfo.id),
      ]
    : propertiesData;

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
    setHoveredInfo(null);
  };

  const handleZoomIn = () => {
    setHoveredInfo(null);
    setPosition((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.3, 8) }));
  };

  const handleZoomOut = () => {
    setHoveredInfo(null);
    setPosition((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 1.3, 0.6) }));
  };

  const handleReset = () => {
    setHoveredInfo(null);
    setPosition({ coordinates: [18, 25], zoom: 1.35 });
  };

  const updateHoveredFromEvent = (item: SimulatedPropertyMapItem, target: SVGGElement) => {
    const anchor = target.querySelector('[data-pin-anchor]') ?? target;
    const rect = anchor.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setHoveredInfo({
        id: item.id,
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      });
    }
  };

  // Popover positioning calculations
  const CARD_WIDTH = 284;
  const PIN_OFFSET = 15;
  let top = 0;
  let left = 0;
  let isFlipDown = false;
  let arrowLeft = 142;

  if (hoveredInfo && hoveredItem && containerRef.current) {
    const containerWidth = containerRef.current.clientWidth;
    // Flip downward if marker is in the upper half of the widget
    isFlipDown = hoveredInfo.y < 155;

    if (isFlipDown) {
      top = hoveredInfo.y + PIN_OFFSET;
    } else {
      top = hoveredInfo.y - PIN_OFFSET;
    }

    // Centered horizontally over the pin
    left = hoveredInfo.x - CARD_WIDTH / 2;

    // Boundary clamping to ensure card stays framed
    if (left < 8) {
      left = 8;
    } else if (left + CARD_WIDTH > containerWidth - 8) {
      left = containerWidth - CARD_WIDTH - 8;
    }

    // Precise pointer arrow targeting the pin
    arrowLeft = Math.max(16, Math.min(CARD_WIDTH - 16, hoveredInfo.x - left));
  }

  const { lastUpdatedLabel } = getUserLocationAndTimezone();

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const mapDateBadgeLabel = `As of ${yesterdayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex flex-col select-none"
      onMouseLeave={() => setHoveredInfo(null)}
    >
      <div className="flex-1 relative overflow-hidden rounded-md bg-white">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 110, center: [18, 25] }}
          width={850}
          height={360}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
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
              {/* Building pin drop shadow */}
              <filter id="pinShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.22" />
              </filter>
              {/* Hover glow */}
              <radialGradient id="pinHoverGlow" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#18181b" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#18181b" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
              </radialGradient>
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

            {/* Luxury Building Icon Markers */}
            {orderedProperties.map((item) => {
              const { id, coordinates } = item;
              const isHovered = hoveredInfo?.id === id;
              const displayCoords = getDisplayCoordinates(id, coordinates as [number, number], position.zoom);

              return (
                <Marker key={id} coordinates={displayCoords}>
                  <g
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/property?id=${id}`);
                    }}
                    onMouseEnter={(e) => updateHoveredFromEvent(item, e.currentTarget)}
                    onMouseMove={(e) => {
                      if (hoveredInfo?.id !== id) {
                        updateHoveredFromEvent(item, e.currentTarget);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredInfo((prev) => (prev?.id === id ? null : prev));
                    }}
                    style={{ transform: `scale(${1 / position.zoom})`, transformOrigin: '0px 0px' }}
                  >
                    {/* Dedicated invisible hit-target circle so every pin is effortless to hover */}
                    <circle data-pin-anchor r={11} fill="transparent" />
                    {/* Subtle hover halo — pointerEvents="none" so it never blocks adjacent pins */}
                    {isHovered && (
                      <circle
                        r={18}
                        fill="url(#pinHoverGlow)"
                        pointerEvents="none"
                      />
                    )}
                    {/* Luxury architectural building badge */}
                    <g
                      filter="url(#pinShadow)"
                      pointerEvents="none"
                      style={{
                        transform: isHovered ? 'scale(1.22)' : 'scale(1)',
                        transition: 'transform 180ms ease-out',
                      }}
                    >
                      <circle
                        r={7.5}
                        fill={isHovered ? '#09090b' : '#27272a'}
                        stroke="#ffffff"
                        strokeWidth={1.3}
                      />
                      {/* Minimalist Hotel / Building Vector Icon centered at (0,0) */}
                      <g transform="translate(-4.5, -4.5)" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        {/* Main tower */}
                        <rect x="2" y="1" width="5" height="7" rx="0.6" fill="#ffffff" stroke="none" />
                        {/* Windows cut-out in dark zinc */}
                        <rect x="3" y="2.1" width="1" height="1" rx="0.2" fill="#18181b" stroke="none" />
                        <rect x="5" y="2.1" width="1" height="1" rx="0.2" fill="#18181b" stroke="none" />
                        <rect x="3" y="3.8" width="1" height="1" rx="0.2" fill="#18181b" stroke="none" />
                        <rect x="5" y="3.8" width="1" height="1" rx="0.2" fill="#18181b" stroke="none" />
                        {/* Entrance door */}
                        <rect x="3.8" y="5.6" width="1.4" height="2.4" rx="0.2" fill="#18181b" stroke="none" />
                        {/* Ground baseline */}
                        <line x1="1" y1="8" x2="8" y2="8" stroke="#ffffff" strokeWidth="0.9" />
                      </g>
                    </g>
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Active Date / Period Badge at top-right */}
        <div
          className={`absolute top-2 right-2 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-opacity duration-200 z-10 pointer-events-none ${
            hoveredItem ? 'opacity-30' : 'opacity-90'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e4e4e7',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
          <span className="text-[8px] text-zinc-700 font-semibold tracking-wide">
            {mapDateBadgeLabel}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-0.5 z-10">
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

      {/* Floating Luxury Popover Overlay - pointer-events-none so it never blocks adjacent pins while hovering */}
      {hoveredItem && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            top: `${top}px`,
            left: `${left}px`,
            width: `${CARD_WIDTH}px`,
            transform: isFlipDown ? 'none' : 'translateY(-100%)',
          }}
        >
          <div className="relative rounded-[12px] p-3 text-left bg-white/98 border border-zinc-200 shadow-xl shadow-black/10 transition-all animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Property Name + Grouping */}
            <div className="flex items-start justify-between gap-1.5 pb-1.5 border-b border-zinc-100">
              <div>
                <div className="text-[13px] font-bold text-zinc-900 leading-tight tracking-wide uppercase flex items-center gap-1">
                  <span>{hoveredItem.name}</span>
                </div>
                <div className="text-[9.5px] font-medium text-zinc-500 mt-0.5">
                  {hoveredItem.grouping} · {hoveredItem.city} · <span className="font-semibold text-zinc-700">{hoveredItem.totalRooms} Keys</span>
                </div>
              </div>
            </div>

            {/* Calculated PMS Metrics: Occupancy (%), ADR, RevPAR, Room Revenue */}
            <div className="mt-1.5 space-y-1 text-[10.5px]">
              <div className="flex justify-between items-center text-zinc-500">
                <span>Occupancy (%)</span>
                <span className="font-bold text-zinc-900">
                  {hoveredItem.occupancyFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span>ADR</span>
                <span className="font-bold text-zinc-900">
                  {hoveredItem.adrFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span>RevPAR</span>
                <span className="font-bold text-zinc-900">
                  {hoveredItem.revparFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500">
                <span>Room Revenue</span>
                <span className="font-bold text-zinc-900">
                  {fmtUsd(hoveredItem.roomRevenueUsd)}
                </span>
              </div>
            </div>

            {/* Last updated at bottom */}
            <div className="mt-2 pt-1.5 border-t border-zinc-100 flex items-center justify-end">
              <span className="text-[8.5px] font-medium text-zinc-400 whitespace-nowrap">
                Last updated: {lastUpdatedLabel}
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
