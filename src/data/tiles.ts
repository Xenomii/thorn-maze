import type { TileDef } from '../types';

// ---------------------------------------------------------------------------
// Named tiles (must all be placed before the Village tile)
// ---------------------------------------------------------------------------

export const NAMED_TILES: TileDef[] = [
  {
    id: 'shrine-of-nangnang',
    name: 'Shrine of Nangnang',
    exits: ['N', 'E', 'S'],
    symbols: ['monster', 'encounter'],
    isNamed: true,
  },
  {
    id: 'river-crossing',
    name: 'River Crossing',
    exits: ['N', 'S'],
    symbols: ['trap'],
    isNamed: true,
  },
  {
    id: 'mushroom-grove',
    name: 'Mushroom Grove',
    exits: ['N', 'E'],
    symbols: ['encounter'],
    isNamed: true,
  },
  {
    id: 'spider-nest',
    name: 'Spider Nest',
    exits: ['S'],
    symbols: ['monster', 'trap'],
    isNamed: true,
  },
  {
    id: 'crumbling-bridge',
    name: 'Crumbling Bridge',
    exits: ['E', 'W'],
    symbols: ['trap', 'ambush'],
    isNamed: true,
  },
  {
    id: 'ancient-altar',
    name: 'Ancient Altar',
    exits: ['N', 'W', 'S'],
    symbols: ['encounter', 'ambush'],
    isNamed: true,
  },
  {
    id: 'poison-garden',
    name: 'Poison Garden',
    exits: ['S', 'W'],
    symbols: ['monster', 'trap'],
    isNamed: true,
  },
];

// ---------------------------------------------------------------------------
// Unnamed maze tiles
// ---------------------------------------------------------------------------

export const UNNAMED_TILES: TileDef[] = [
  // Straights
  { id: 'straight-1', name: 'Corridor', exits: ['N', 'S'], symbols: [], isNamed: false },
  { id: 'straight-2', name: 'Corridor', exits: ['N', 'S'], symbols: ['monster'], isNamed: false },
  { id: 'straight-3', name: 'Corridor', exits: ['E', 'W'], symbols: ['trap'], isNamed: false },
  // Corners
  { id: 'corner-1', name: 'Bend', exits: ['N', 'E'], symbols: [], isNamed: false },
  { id: 'corner-2', name: 'Bend', exits: ['N', 'E'], symbols: ['encounter'], isNamed: false },
  { id: 'corner-3', name: 'Bend', exits: ['S', 'W'], symbols: ['monster'], isNamed: false },
  // T-intersections
  { id: 't-int-1', name: 'T-Junction', exits: ['N', 'E', 'S'], symbols: [], isNamed: false },
  { id: 't-int-2', name: 'T-Junction', exits: ['N', 'W', 'S'], symbols: ['encounter'], isNamed: false },
  { id: 't-int-3', name: 'T-Junction', exits: ['E', 'W', 'S'], symbols: ['trap'], isNamed: false },
  // 4-way intersections
  { id: '4way-1', name: 'Crossroads', exits: ['N', 'E', 'S', 'W'], symbols: [], isNamed: false },
  {
    id: '4way-2',
    name: 'Crossroads',
    exits: ['N', 'E', 'S', 'W'],
    symbols: ['monster', 'encounter'],
    isNamed: false,
  },
  // Dead ends
  { id: 'dead-1', name: 'Dead End', exits: ['S'], symbols: ['trap'], isNamed: false },
  { id: 'dead-2', name: 'Dead End', exits: ['N'], symbols: [], isNamed: false },
  // Additional straights
  { id: 'straight-4', name: 'Corridor', exits: ['N', 'S'], symbols: ['encounter'], isNamed: false },
  { id: 'straight-5', name: 'Corridor', exits: ['E', 'W'], symbols: [], isNamed: false },
  { id: 'straight-6', name: 'Corridor', exits: ['E', 'W'], symbols: ['ambush'], isNamed: false },
  // Additional corners
  { id: 'corner-4', name: 'Bend', exits: ['S', 'E'], symbols: ['trap'], isNamed: false },
  { id: 'corner-5', name: 'Bend', exits: ['N', 'W'], symbols: [], isNamed: false },
  { id: 'corner-6', name: 'Bend', exits: ['S', 'W'], symbols: ['encounter'], isNamed: false },
  // Additional T-junctions
  { id: 't-int-4', name: 'T-Junction', exits: ['N', 'E', 'W'], symbols: [], isNamed: false },
  { id: 't-int-5', name: 'T-Junction', exits: ['N', 'E', 'S'], symbols: ['monster'], isNamed: false },
  { id: 't-int-6', name: 'T-Junction', exits: ['E', 'W', 'S'], symbols: ['ambush'], isNamed: false },
  // Additional 4-way
  { id: '4way-3', name: 'Crossroads', exits: ['N', 'E', 'S', 'W'], symbols: ['trap'], isNamed: false },
  // Additional dead ends
  { id: 'dead-3', name: 'Dead End', exits: ['E'], symbols: ['monster'], isNamed: false },
  { id: 'dead-4', name: 'Dead End', exits: ['W'], symbols: [], isNamed: false },
  { id: 'dead-5', name: 'Dead End', exits: ['N'], symbols: ['ambush'], isNamed: false },
  { id: 'dead-6', name: 'Dead End', exits: ['S'], symbols: [], isNamed: false },
];

// ---------------------------------------------------------------------------
// Special tiles
// ---------------------------------------------------------------------------

export const VILLAGE_TILE: TileDef = {
  id: 'village',
  name: 'Dungrunglung Village',
  exits: ['N', 'E', 'S', 'W'],
  symbols: [],
  isNamed: false,
  isVillage: true,
};

export const ENTRANCE_TILE: TileDef = {
  id: 'entrance',
  name: 'Maze Entrance',
  exits: ['N', 'E', 'S', 'W'],
  symbols: [],
  isNamed: false,
  isEntrance: true,
};

export const JUNGLE_TILE: TileDef = {
  id: 'jungle',
  name: 'Zombie-Infested Jungle',
  exits: ['N', 'E', 'S', 'W'],
  symbols: [],
  isNamed: false,
  isJungle: true,
};

// ---------------------------------------------------------------------------
// Aggregate
// ---------------------------------------------------------------------------

export const ALL_TILES: TileDef[] = [
  JUNGLE_TILE,
  ENTRANCE_TILE,
  ...NAMED_TILES,
  ...UNNAMED_TILES,
  VILLAGE_TILE,
];

export function getTileDef(id: string): TileDef | undefined {
  return ALL_TILES.find((t) => t.id === id);
}
