import { useState } from 'react';
import { useVenueData } from '@/hooks/useVenueData';
import { SeatingSvg } from '@/components/seating/SeatingSvg';
import { SeatDetails } from '@/components/seating/SeatDetails';
import { SelectionSummary } from '@/components/seating/SelectionSummary';
import { Legend } from '@/components/seating/Legend';
import { Button } from '@/components/ui/button';
import { Flame, Map } from 'lucide-react';

const Index = () => {
  const {
    venue,
    loading,
    selectedIds,
    selectedSeats,
    focusedSeatId,
    setFocusedSeatId,
    toggleSeat,
    clearSelection,
    seatMap,
  } = useVenueData();

  const [heatmapMode, setHeatmapMode] = useState(false);
  const focusedSeat = focusedSeatId ? seatMap.get(focusedSeatId) ?? null : null;

  if (loading || !venue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading venue…</p>
        </div>
      </div>
    );
  }

  const totalSeats = venue.sections.reduce(
    (sum, s) => sum + s.rows.reduce((rs, r) => rs + r.seats.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">{venue.name}</h1>
            <p className="text-xs text-muted-foreground">{totalSeats.toLocaleString()} seats</p>
          </div>
          <Button
            variant={heatmapMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setHeatmapMode(m => !m)}
            className="gap-1.5"
          >
            {heatmapMode ? <Map size={14} /> : <Flame size={14} />}
            {heatmapMode ? 'Status View' : 'Heat Map'}
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Map area */}
        <div className="flex-1 flex flex-col p-3 md:p-4 min-h-0">
          <div className="flex-1 rounded-xl bg-card border border-border overflow-hidden relative">
            <SeatingSvg
              venue={venue}
              selectedIds={selectedIds}
              focusedSeatId={focusedSeatId}
              heatmapMode={heatmapMode}
              onSeatClick={toggleSeat}
              onSeatFocus={setFocusedSeatId}
            />
          </div>
          <div className="mt-3">
            <Legend heatmapMode={heatmapMode} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 p-3 md:p-4 space-y-3 lg:border-l border-border">
          <SeatDetails seat={focusedSeat} venue={venue} />
          <SelectionSummary
            selectedSeats={selectedSeats}
            onClear={clearSelection}
            onRemoveSeat={toggleSeat}
          />
        </aside>
      </main>
    </div>
  );
};

export default Index;
