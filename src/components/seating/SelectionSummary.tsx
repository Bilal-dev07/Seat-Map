import { memo } from 'react';
import type { Seat } from '@/types/venue';
import { PRICE_TIERS, MAX_SELECTED_SEATS } from '@/types/venue';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectionSummaryProps {
  selectedSeats: Seat[];
  onClear: () => void;
  onRemoveSeat: (id: string) => void;
}

function SelectionSummaryInner({ selectedSeats, onClear, onRemoveSeat }: SelectionSummaryProps) {
  const subtotal = selectedSeats.reduce((sum, s) => sum + (PRICE_TIERS[s.priceTier] ?? 0), 0);

  return (
    <div className="p-4 rounded-lg bg-card border border-border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">
          Selected ({selectedSeats.length}/{MAX_SELECTED_SEATS})
        </h3>
        {selectedSeats.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-7 text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      {selectedSeats.length === 0 ? (
        <p className="text-muted-foreground text-sm">No seats selected</p>
      ) : (
        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
          {selectedSeats.map(seat => (
            <li
              key={seat.id}
              className="flex items-center justify-between text-sm bg-secondary/50 rounded-md px-2.5 py-1.5"
            >
              <span className="text-foreground font-mono text-xs">{seat.id}</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">${PRICE_TIERS[seat.priceTier] ?? 0}</span>
                <button
                  onClick={() => onRemoveSeat(seat.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove seat ${seat.id}`}
                >
                  <X size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedSeats.length > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-foreground">Subtotal</span>
          <span className="text-lg font-bold text-primary">${subtotal}</span>
        </div>
      )}
    </div>
  );
}

export const SelectionSummary = memo(SelectionSummaryInner);
