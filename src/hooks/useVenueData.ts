import { useState, useEffect, useCallback, useMemo } from 'react';
import type { VenueData, Seat } from '@/types/venue';
import { MAX_SELECTED_SEATS } from '@/types/venue';
import { generateVenueData } from '@/utils/generateVenue';

const STORAGE_KEY = 'seating-map-selection';

function loadSelection(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      return new Set(ids);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveSelection(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useVenueData() {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(loadSelection);
  const [focusedSeatId, setFocusedSeatId] = useState<string | null>(null);

  useEffect(() => {
    // Generate venue data (deterministic seed could be used for consistency)
    const data = generateVenueData();
    setVenue(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    saveSelection(selectedIds);
  }, [selectedIds]);

  // Build a fast lookup map for seats
  const seatMap = useMemo(() => {
    if (!venue) return new Map<string, Seat>();
    const map = new Map<string, Seat>();
    for (const section of venue.sections) {
      for (const row of section.rows) {
        for (const seat of row.seats) {
          map.set(seat.id, seat);
        }
      }
    }
    return map;
  }, [venue]);

  const toggleSeat = useCallback((seatId: string) => {
    const seat = seatMap.get(seatId);
    if (!seat || seat.status !== 'available') return;

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else if (next.size < MAX_SELECTED_SEATS) {
        next.add(seatId);
      }
      return next;
    });
  }, [seatMap]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedSeats = useMemo(() => {
    return [...selectedIds].map(id => seatMap.get(id)).filter(Boolean) as Seat[];
  }, [selectedIds, seatMap]);

  return {
    venue,
    loading,
    selectedIds,
    selectedSeats,
    focusedSeatId,
    setFocusedSeatId,
    toggleSeat,
    clearSelection,
    seatMap,
  };
}
