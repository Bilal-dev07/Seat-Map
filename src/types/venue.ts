export type SeatStatus = 'available' | 'reserved' | 'sold' | 'held';

export interface Seat {
  id: string;
  col: number;
  x: number;
  y: number;
  priceTier: number;
  status: SeatStatus;
}

export interface Row {
  index: number;
  seats: Seat[];
}

export interface SectionTransform {
  x: number;
  y: number;
  scale: number;
}

export interface Section {
  id: string;
  label: string;
  transform: SectionTransform;
  rows: Row[];
}

export interface VenueMap {
  width: number;
  height: number;
}

export interface VenueData {
  venueId: string;
  name: string;
  map: VenueMap;
  sections: Section[];
}

export const PRICE_TIERS: Record<number, number> = {
  1: 150,
  2: 120,
  3: 90,
  4: 60,
  5: 40,
};

export const PRICE_TIER_COLORS: Record<number, string> = {
  1: 'hsl(0, 85%, 60%)',
  2: 'hsl(30, 90%, 55%)',
  3: 'hsl(50, 90%, 50%)',
  4: 'hsl(140, 60%, 45%)',
  5: 'hsl(210, 70%, 55%)',
};

export const STATUS_COLORS: Record<SeatStatus, string> = {
  available: 'hsl(var(--seat-available))',
  reserved: 'hsl(var(--seat-reserved))',
  sold: 'hsl(var(--seat-sold))',
  held: 'hsl(var(--seat-held))',
};

export const MAX_SELECTED_SEATS = 8;
