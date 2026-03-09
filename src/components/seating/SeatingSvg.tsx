import { memo, useCallback, useRef, useState } from 'react';
import type { VenueData } from '@/types/venue';
import { PRICE_TIER_COLORS, STATUS_COLORS } from '@/types/venue';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface SeatingSvgProps {
  venue: VenueData;
  selectedIds: Set<string>;
  focusedSeatId: string | null;
  heatmapMode: boolean;
  onSeatClick: (seatId: string) => void;
  onSeatFocus: (seatId: string | null) => void;
}

const SEAT_RADIUS = 4;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.3;

function SeatingSvgInner({
  venue,
  selectedIds,
  focusedSeatId,
  heatmapMode,
  onSeatClick,
  onSeatFocus,
}: SeatingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const handleKeyDown = useCallback(
    (seatId: string, e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSeatClick(seatId);
      }
    },
    [onSeatClick],
  );

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP * 0.5 : ZOOM_STEP * 0.5;
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as SVGElement;

    if (
      target.tagName === 'svg' ||
      target.tagName === 'rect' ||
      e.button === 1
    ) {
      isPanning.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    lastPointer.current = { x: e.clientX, y: e.clientY };

    setPan((p) => ({
      x: p.x + dx,
      y: p.y + dy,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const { width, height } = venue.map;

  const cx = width / 2;
  const cy = height / 2;

  const vbWidth = width / zoom;
  const vbHeight = height / zoom;

  const vbX = (width - vbWidth) / 2 - pan.x / zoom;
  const vbY = (height - vbHeight) / 2 - pan.y / zoom;

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`${vbX} ${vbY} ${vbWidth} ${vbHeight}`}
        className="w-full h-full"
        role="img"
        aria-label={`Seating map for ${venue.name}`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Background rect for panning */}
        <rect x={0} y={0} width={width} height={height} fill="transparent" />

        {/* Stage */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={100}
          ry={60}
          className="fill-primary/10 stroke-primary/30"
          strokeWidth={2}
          strokeDasharray="6 3"
        />

        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary/60 font-semibold select-none pointer-events-none"
          style={{ fontSize: 16 }}
        >
          STAGE
        </text>

        {/* Sections */}
        {venue.sections.map((section) => (
          <g
            key={section.id}
            transform={`translate(${section.transform.x}, ${section.transform.y}) scale(${section.transform.scale})`}
          >
            {section.rows.map((row) =>
              row.seats.map((seat) => {
                const isSelected = selectedIds.has(seat.id);
                const isFocused = focusedSeatId === seat.id;
                const isAvailable = seat.status === 'available';

                let fill: string;

                if (isSelected) {
                  fill = 'hsl(var(--seat-selected))';
                } else if (heatmapMode) {
                  fill = PRICE_TIER_COLORS[seat.priceTier] ?? '#888';
                } else {
                  fill = STATUS_COLORS[seat.status];
                }

                const label = `Section ${section.id}, Row ${row.index}, Seat ${seat.col}, Tier ${seat.priceTier}, ${
                  isSelected ? 'Selected' : seat.status
                }`;

                return (
                  <circle
                    key={seat.id}
                    cx={seat.x}
                    cy={seat.y}
                    r={SEAT_RADIUS}
                    fill={fill}
                    stroke={isFocused ? '#000' : 'none'}
                    strokeWidth={isFocused ? 2 : 0}
                    className="transition-all duration-75 seat-circle"
                    data-status={seat.status}
                    data-selected={isSelected}
                    tabIndex={isAvailable ? 0 : -1}
                    role="button"
                    aria-label={label}
                    aria-pressed={isSelected}
                    onClick={() => onSeatClick(seat.id)}
                    onKeyDown={(e) => handleKeyDown(seat.id, e)}
                    onFocus={() => onSeatFocus(seat.id)}
                    onBlur={() => onSeatFocus(null)}
                    onPointerEnter={() => onSeatFocus(seat.id)}
                    onPointerLeave={() => onSeatFocus(null)}
                  >
                    <title>
                      {`Section ${section.id} • Row ${row.index} • Seat ${seat.col} • Tier ${seat.priceTier}`}
                    </title>
                  </circle>
                );
              }),
            )}
          </g>
        ))}
      </svg>

      {/* Zoom Controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>

        <button
          onClick={handleReset}
          className="w-9 h-9 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Reset zoom"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Zoom Indicator */}
      {zoom !== 1 && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-card/90 border border-border text-xs font-mono">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Tier Legend */}
      {heatmapMode && (
        <div className="absolute bottom-3 left-3 bg-card/95 border border-border rounded-lg shadow-sm p-3 text-xs">
          <div className="font-semibold mb-2">Price Tiers</div>

          <div className="flex flex-col gap-1">
            {Object.entries(PRICE_TIER_COLORS).map(([tier, color]) => (
              <div key={tier} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: color }}
                />
                <span>Tier {tier}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const SeatingSvg = memo(SeatingSvgInner);
