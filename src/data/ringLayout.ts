import type { SlotPosition } from '../types';

//  Ring layout (tile-grid coordinates):
//
//        0   1   2   3   4   5   6
//   0:   .   .   N   N   N   .   .
//   1:   .   N   O   O   O   N   .
//   2:   N   O   I   I   I   O   N
//   3:   N   O   I   V   I   O   N
//   4:   N   O   I   I   I   O   N
//   5:   .   N   O   O   O   N   .      (now a regular outer ring slot)
//   6:   .   .   N   E   N   .   .      E = entrance (pre-placed)
//
//   N = outermost ring   O = outer ring   I = inner ring

export const RING_SLOTS: SlotPosition[] = [
  // --- Outermost ring ---
  { row: 0, col: 2, zone: 'outermost' },
  { row: 0, col: 3, zone: 'outermost' },
  { row: 0, col: 4, zone: 'outermost' },
  { row: 1, col: 1, zone: 'outermost' },
  { row: 1, col: 5, zone: 'outermost' },
  { row: 2, col: 0, zone: 'outermost' },
  { row: 2, col: 6, zone: 'outermost' },
  { row: 3, col: 0, zone: 'outermost' },
  { row: 3, col: 6, zone: 'outermost' },
  { row: 4, col: 0, zone: 'outermost' },
  { row: 4, col: 6, zone: 'outermost' },
  { row: 5, col: 1, zone: 'outermost' },
  { row: 5, col: 5, zone: 'outermost' },
  { row: 6, col: 2, zone: 'outermost' },
  { row: 6, col: 4, zone: 'outermost' },
  // --- Outer ring ---
  { row: 1, col: 2, zone: 'outer' },
  { row: 1, col: 3, zone: 'outer' },
  { row: 1, col: 4, zone: 'outer' },
  { row: 2, col: 1, zone: 'outer' },
  { row: 2, col: 5, zone: 'outer' },
  { row: 3, col: 1, zone: 'outer' },
  { row: 3, col: 5, zone: 'outer' },
  { row: 4, col: 1, zone: 'outer' },
  { row: 4, col: 5, zone: 'outer' },
  { row: 5, col: 2, zone: 'outer' },
  { row: 5, col: 3, zone: 'outer' },
  { row: 5, col: 4, zone: 'outer' },
  // --- Inner ring ---
  { row: 2, col: 2, zone: 'inner' },
  { row: 2, col: 3, zone: 'inner' },
  { row: 2, col: 4, zone: 'inner' },
  { row: 3, col: 2, zone: 'inner' },
  { row: 3, col: 4, zone: 'inner' },
  { row: 4, col: 2, zone: 'inner' },
  { row: 4, col: 3, zone: 'inner' },
  { row: 4, col: 4, zone: 'inner' },
  // --- Center (Village destination) ---
  { row: 3, col: 3, zone: 'center' },
  // --- Entrance (pre-placed) ---
  { row: 6, col: 3, zone: 'entrance' },
];

export const GRID_ROWS = 7;
export const GRID_COLS = 7;

export function getSlot(row: number, col: number): SlotPosition | undefined {
  return RING_SLOTS.find((s) => s.row === row && s.col === col);
}
