export type Direction = 'N' | 'E' | 'S' | 'W';

export const OPPOSITE: Record<Direction, Direction> = {
  N: 'S',
  S: 'N',
  E: 'W',
  W: 'E',
};

export const ALL_DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];

export type TileSymbol = 'monster' | 'trap' | 'encounter' | 'ambush';

export interface TileDef {
  id: string;
  name: string;
  exits: Direction[];
  symbols: TileSymbol[];
  isNamed: boolean;
  isVillage?: boolean;
  isEntrance?: boolean;
  isJungle?: boolean;
  isDungeonHeart?: boolean;
  isExit?: boolean;
}

export interface PlacedTile {
  defId: string;
  rotation: number; // 0, 90, 180, 270
  slotRow: number;
  slotCol: number;
}

export type SlotZone = 'outermost' | 'outer' | 'inner' | 'center' | 'entrance' | 'jungle';

export interface SlotPosition {
  row: number;
  col: number;
  zone: SlotZone;
}

export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface LogEntry {
  message: string;
  timestamp: number;
}

export interface GameState {
  placedTiles: PlacedTile[];
  remainingTileIds: string[];
  deck: string[];
  hands: string[][];
  selectedTileId: string | null;
  selectedRotation: number;
  players: Player[];
  currentPlayerIndex: number;
  log: LogEntry[];
  phase: 'setup' | 'playing' | 'complete' | 'failed';
  movesRemaining: number;
  hazardCount: number;
  consecutivePasses: number;
  sharedPool: string[];
  gameMode: 'enter' | 'escape';
}

/** Return the exits of a tile after applying rotation (clockwise degrees). */
export function getRotatedExits(exits: Direction[], rotation: number): Direction[] {
  const order: Direction[] = ['N', 'E', 'S', 'W'];
  const steps = (((rotation / 90) % 4) + 4) % 4;
  return exits.map((dir) => {
    const idx = order.indexOf(dir);
    return order[(idx + steps) % 4];
  });
}
