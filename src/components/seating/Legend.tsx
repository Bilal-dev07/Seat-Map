import { memo } from 'react';
import { PRICE_TIER_COLORS, PRICE_TIERS } from '@/types/venue';

interface LegendProps {
  heatmapMode: boolean;
}

function LegendInner({ heatmapMode }: LegendProps) {
  if (heatmapMode) {
    return (
      <div className="flex flex-wrap gap-3 items-center text-xs">
        {Object.entries(PRICE_TIER_COLORS).map(([tier, color]) => (
          <div key={tier} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full inline-block border border-border"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">
              Tier {tier} (${PRICE_TIERS[Number(tier)]})
            </span>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Available', cssVar: '--seat-available' },
    { label: 'Reserved', cssVar: '--seat-reserved' },
    { label: 'Sold', cssVar: '--seat-sold' },
    { label: 'Held', cssVar: '--seat-held' },
    { label: 'Selected', cssVar: '--seat-selected' },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center text-xs">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block border border-border"
            style={{ backgroundColor: `hsl(var(${item.cssVar}))` }}
          />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export const Legend = memo(LegendInner);
