import type { VenueData, SeatStatus } from '@/types/venue';

/**
 * Generates a venue JSON file with a realistic arena layout.
 * The arena has a central stage area surrounded by curved seating sections.
 */
export function generateVenueData(): VenueData {
  const WIDTH = 1024;
  const HEIGHT = 768;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;

  const statuses: SeatStatus[] = ['available', 'available', 'available', 'available', 'reserved', 'sold', 'held'];
  const getRandomStatus = (): SeatStatus => statuses[Math.floor(Math.random() * statuses.length)];

  const sections: VenueData['sections'] = [];

  // Create sections arranged in a horseshoe around the stage
  const sectionConfigs = [
    { id: 'A', label: 'Lower Bowl A', startAngle: -150, endAngle: -90, innerR: 140, outerR: 220, rows: 6, seatsPerRow: 24, tier: 1 },
    { id: 'B', label: 'Lower Bowl B', startAngle: -90, endAngle: -30, innerR: 140, outerR: 220, rows: 6, seatsPerRow: 24, tier: 1 },
    { id: 'C', label: 'Lower Bowl C', startAngle: 30, endAngle: 90, innerR: 140, outerR: 220, rows: 6, seatsPerRow: 24, tier: 1 },
    { id: 'D', label: 'Lower Bowl D', startAngle: 90, endAngle: 150, innerR: 140, outerR: 220, rows: 6, seatsPerRow: 24, tier: 1 },
    { id: 'E', label: 'Mid Bowl E', startAngle: -160, endAngle: -80, innerR: 230, outerR: 300, rows: 6, seatsPerRow: 30, tier: 2 },
    { id: 'F', label: 'Mid Bowl F', startAngle: -80, endAngle: -20, innerR: 230, outerR: 300, rows: 6, seatsPerRow: 30, tier: 2 },
    { id: 'G', label: 'Mid Bowl G', startAngle: 20, endAngle: 80, innerR: 230, outerR: 300, rows: 6, seatsPerRow: 30, tier: 3 },
    { id: 'H', label: 'Mid Bowl H', startAngle: 80, endAngle: 160, innerR: 230, outerR: 300, rows: 6, seatsPerRow: 30, tier: 3 },
    { id: 'J', label: 'Upper Bowl J', startAngle: -170, endAngle: -90, innerR: 310, outerR: 370, rows: 5, seatsPerRow: 35, tier: 4 },
    { id: 'K', label: 'Upper Bowl K', startAngle: -90, endAngle: -10, innerR: 310, outerR: 370, rows: 5, seatsPerRow: 35, tier: 4 },
    { id: 'L', label: 'Upper Bowl L', startAngle: 10, endAngle: 90, innerR: 310, outerR: 370, rows: 5, seatsPerRow: 35, tier: 5 },
    { id: 'M', label: 'Upper Bowl M', startAngle: 90, endAngle: 170, innerR: 310, outerR: 370, rows: 5, seatsPerRow: 35, tier: 5 },
  ];

  for (const cfg of sectionConfigs) {
    const rows: VenueData['sections'][0]['rows'] = [];
    for (let r = 0; r < cfg.rows; r++) {
      const radius = cfg.innerR + (cfg.outerR - cfg.innerR) * (r / (cfg.rows - 1 || 1));
      const seats: VenueData['sections'][0]['rows'][0]['seats'] = [];
      for (let s = 0; s < cfg.seatsPerRow; s++) {
        const angle = cfg.startAngle + (cfg.endAngle - cfg.startAngle) * (s / (cfg.seatsPerRow - 1 || 1));
        const rad = (angle * Math.PI) / 180;
        const x = Math.round(CENTER_X + radius * Math.cos(rad));
        const y = Math.round(CENTER_Y + radius * Math.sin(rad));
        seats.push({
          id: `${cfg.id}-${r + 1}-${String(s + 1).padStart(2, '0')}`,
          col: s + 1,
          x,
          y,
          priceTier: cfg.tier,
          status: getRandomStatus(),
        });
      }
      rows.push({ index: r + 1, seats });
    }
    sections.push({
      id: cfg.id,
      label: cfg.label,
      transform: { x: 0, y: 0, scale: 1 },
      rows,
    });
  }

  return {
    venueId: 'arena-01',
    name: 'Metropolis Arena',
    map: { width: WIDTH, height: HEIGHT },
    sections,
  };
}
