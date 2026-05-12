/**
 * 8 shimmer sweep directions, deterministically picked per card so the
 * same slug always animates the same way (no flicker between renders) but
 * neighbouring cards in a grid get visually different glints.
 */
const DIRECTIONS = ['lr', 'rl', 'td', 'bt', 'd1', 'd2', 'd3', 'd4'] as const;

export function pickShineDirection(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return `ec-shine-${DIRECTIONS[Math.abs(h) % DIRECTIONS.length]}`;
}
