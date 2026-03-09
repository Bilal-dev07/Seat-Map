import { describe, it, expect } from 'vitest';
import { generateVenueData } from '@/utils/generateVenue';

describe('generateVenueData', () => {
  const venue = generateVenueData();

  it('returns a valid venue with correct structure', () => {
    expect(venue.venueId).toBe('arena-01');
    expect(venue.name).toBe('Metropolis Arena');
    expect(venue.map.width).toBe(1024);
    expect(venue.map.height).toBe(768);
    expect(venue.sections.length).toBeGreaterThan(0);
  });

  it('generates sections with rows and seats', () => {
    for (const section of venue.sections) {
      expect(section.id).toBeTruthy();
      expect(section.label).toBeTruthy();
      expect(section.rows.length).toBeGreaterThan(0);
      for (const row of section.rows) {
        expect(row.seats.length).toBeGreaterThan(0);
        for (const seat of row.seats) {
          expect(seat.id).toMatch(/^[A-Z]-\d+-\d+$/);
          expect(seat.x).toBeGreaterThan(0);
          expect(seat.y).toBeGreaterThan(0);
          expect(['available', 'reserved', 'sold', 'held']).toContain(seat.status);
          expect(seat.priceTier).toBeGreaterThanOrEqual(1);
          expect(seat.priceTier).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it('generates unique seat IDs', () => {
    const ids = new Set<string>();
    for (const section of venue.sections) {
      for (const row of section.rows) {
        for (const seat of row.seats) {
          expect(ids.has(seat.id)).toBe(false);
          ids.add(seat.id);
        }
      }
    }
  });

  it('places seats within the map bounds', () => {
    for (const section of venue.sections) {
      for (const row of section.rows) {
        for (const seat of row.seats) {
          expect(seat.x).toBeGreaterThanOrEqual(0);
          expect(seat.x).toBeLessThanOrEqual(venue.map.width);
          expect(seat.y).toBeGreaterThanOrEqual(0);
          expect(seat.y).toBeLessThanOrEqual(venue.map.height);
        }
      }
    }
  });
});
