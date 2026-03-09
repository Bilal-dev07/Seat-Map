import { memo, useRef } from 'react';
import type { Seat, VenueData } from '@/types/venue';
import { PRICE_TIERS, PRICE_TIER_COLORS } from '@/types/venue';

interface SeatDetailsProps {
  seat: Seat | null;
  venue: VenueData | null;
}

function findSeatContext(venue: VenueData, seatId: string) {
  for (const section of venue.sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        if (seat.id === seatId) {
          return { section: section.label, sectionId: section.id, row: row.index };
        }
      }
    }
  }
  return null;
}

function SeatDetailsInner({ seat, venue }: SeatDetailsProps) {

  const lastSeatRef = useRef<{ seat: Seat; ctx: ReturnType<typeof findSeatContext>; price: number } | null>(null);

  if (seat && venue) {
    const ctx = findSeatContext(venue, seat.id);
    const price = PRICE_TIERS[seat.priceTier] ?? 0;
    lastSeatRef.current = { seat, ctx, price };
  }

  const data = seat && venue ? lastSeatRef.current : null;
  const isEmpty = !data;

  return (
    <div className="p-4 rounded-lg bg-card border border-border min-h-[140px]">
      <h3 className="font-semibold text-sm text-foreground mb-2">Seat Details</h3>
      {isEmpty ? (
        <p className="text-muted-foreground text-sm text-center py-4">
          Hover or focus on a seat to see details
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Section</span>
          <span className="text-foreground font-medium">{data.ctx?.section ?? '—'}</span>
          <span className="text-muted-foreground">Row</span>
          <span className="text-foreground font-medium">{data.ctx?.row ?? '—'}</span>
          <span className="text-muted-foreground">Seat</span>
          <span className="text-foreground font-medium">{data.seat.col}</span>
          <span className="text-muted-foreground">Price Tier</span>
          <span className="font-medium" style={{ color: PRICE_TIER_COLORS[data.seat.priceTier] }}>
            Tier {data.seat.priceTier}
          </span>
          <span className="text-muted-foreground">Price</span>
          <span className="text-foreground font-bold">${data.price}</span>
          <span className="text-muted-foreground">Status</span>
          <span className="text-foreground font-medium capitalize">{data.seat.status}</span>
        </div>
      )}
    </div>
  );
}

export const SeatDetails = memo(SeatDetailsInner);
