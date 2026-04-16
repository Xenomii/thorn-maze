import { type Direction, OPPOSITE, ALL_DIRECTIONS, type PlacedTile, type SlotPosition, getRotatedExits } from '../types';
import { getTileDef } from '../data/tiles';
import { getSlot, RING_SLOTS } from '../data/ringLayout';

// ---- helpers ---------------------------------------------------------------

function adjacentCoords(row: number, col: number, dir: Direction): [number, number] {
  switch (dir) {
    case 'N': return [row - 1, col];
    case 'S': return [row + 1, col];
    case 'E': return [row, col + 1];
    case 'W': return [row, col - 1];
  }
}

function placedAt(row: number, col: number, placed: PlacedTile[]): PlacedTile | undefined {
  return placed.find((p) => p.slotRow === row && p.slotCol === col);
}

// ---- individual checks -----------------------------------------------------

/**
 * The new tile must share at least one matched exit with an already-placed
 * neighbour, and must NOT have an exit pointing at a neighbour that lacks the
 * reciprocal exit (and vice-versa).
 */
export function checkConnectivity(
  row: number,
  col: number,
  defId: string,
  rotation: number,
  placed: PlacedTile[],
): boolean {
  const def = getTileDef(defId);
  if (!def) return false;

  const exits = getRotatedExits(def.exits, rotation);
  let connected = false;

  for (const dir of ALL_DIRECTIONS) {
    const [ar, ac] = adjacentCoords(row, col, dir);
    const neighbour = placedAt(ar, ac, placed);
    if (!neighbour) continue;

    const nDef = getTileDef(neighbour.defId);
    if (!nDef) continue;
    const nExits = getRotatedExits(nDef.exits, neighbour.rotation);

    const weOpen = exits.includes(dir);
    const theyOpen = nExits.includes(OPPOSITE[dir]);

    if (weOpen && theyOpen) {
      connected = true;
    } else if (weOpen !== theyOpen) {
      // Mismatch – one side open, other closed
      return false;
    }
  }

  return connected;
}

/** Named tiles must not be orthogonally adjacent to another named tile. */
export function checkNamedSeparation(
  row: number,
  col: number,
  defId: string,
  placed: PlacedTile[],
): boolean {
  const def = getTileDef(defId);
  if (!def?.isNamed) return true;

  for (const dir of ALL_DIRECTIONS) {
    const [ar, ac] = adjacentCoords(row, col, dir);
    const neighbour = placedAt(ar, ac, placed);
    if (neighbour) {
      const nDef = getTileDef(neighbour.defId);
      if (nDef?.isNamed) return false;
    }
  }
  return true;
}

/** Village can only be placed once N required named tiles are on the board. */
export function checkVillageLast(
  defId: string,
  placed: PlacedTile[],
  namedRequired: number,
): boolean {
  const def = getTileDef(defId);
  if (!def?.isVillage) return true;

  const placedNamedCount = placed.filter((p) => getTileDef(p.defId)?.isNamed).length;
  return placedNamedCount >= namedRequired;
}

/** Only the Village tile may occupy the center slot (and only after N named tiles). */
export function checkCenterRestriction(
  row: number,
  col: number,
  defId: string,
  placed: PlacedTile[],
  namedRequired: number,
): boolean {
  const slot = getSlot(row, col);
  if (!slot) return false;

  const def = getTileDef(defId);

  if (slot.zone === 'center') {
    return !!def?.isVillage && checkVillageLast(defId, placed, namedRequired);
  }

  // Village MUST go in center — and we already handled center above
  if (def?.isVillage) return false;

  return true;
}

/**
 * Until N required named tiles are placed, no tile may open a path into the
 * center slot (prevents early access to the village destination).
 */
export function checkNoEarlyCenter(
  row: number,
  col: number,
  defId: string,
  rotation: number,
  placed: PlacedTile[],
  namedRequired: number,
): boolean {
  const def = getTileDef(defId);
  if (!def || def.isVillage) return true;

  const exits = getRotatedExits(def.exits, rotation);

  for (const dir of exits) {
    const [ar, ac] = adjacentCoords(row, col, dir);
    const adjSlot = getSlot(ar, ac);
    if (adjSlot?.zone === 'center') {
      const placedNamedCount = placed.filter((p) => getTileDef(p.defId)?.isNamed).length;
      if (placedNamedCount < namedRequired) return false;
    }
  }
  return true;
}

/**
 * BFS from the entrance through connected tile exits.
 * Returns true if a reachable tile has an exit pointing directly into the
 * center slot — i.e. there is a genuine path from the entrance to the village.
 */
function hasRouteToCenter(placed: PlacedTile[]): boolean {
  const centerSlot = RING_SLOTS.find((s) => s.zone === 'center');
  if (!centerSlot) return false;

  const entrance = placed.find((p) => getTileDef(p.defId)?.isEntrance);
  if (!entrance) return false;

  const visited = new Set<string>();
  const queue: [number, number][] = [[entrance.slotRow, entrance.slotCol]];
  visited.add(`${entrance.slotRow},${entrance.slotCol}`);

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    const tile = placedAt(row, col, placed);
    if (!tile) continue;

    const def = getTileDef(tile.defId);
    if (!def) continue;
    const exits = getRotatedExits(def.exits, tile.rotation);

    for (const dir of exits) {
      const [nr, nc] = adjacentCoords(row, col, dir);

      // An exit into the center slot means there is a connected route
      if (nr === centerSlot.row && nc === centerSlot.col) return true;

      const key = `${nr},${nc}`;
      if (visited.has(key)) continue;

      const neighbor = placedAt(nr, nc, placed);
      if (!neighbor) continue;

      const nDef = getTileDef(neighbor.defId);
      if (!nDef) continue;
      const nExits = getRotatedExits(nDef.exits, neighbor.rotation);

      if (nExits.includes(OPPOSITE[dir])) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }

  return false;
}

// ---- main entry point ------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function canPlaceTile(
  row: number,
  col: number,
  defId: string,
  rotation: number,
  placed: PlacedTile[],
  namedRequired: number,
): ValidationResult {
  const slot = getSlot(row, col);
  if (!slot) return { valid: false, reason: 'Not a valid slot' };

  if (placed.some((p) => p.slotRow === row && p.slotCol === col)) {
    return { valid: false, reason: 'Slot already occupied' };
  }

  if (!checkCenterRestriction(row, col, defId, placed, namedRequired)) {
    return { valid: false, reason: `Only the Village tile may go in the center (after ${namedRequired} named tiles)` };
  }

  const def = getTileDef(defId);
  if (def?.isVillage) {
    // Skip normal connectivity (closed-wall neighbours cause false mismatches),
    // but require a genuine connected route from the entrance to the center.
    if (!hasRouteToCenter(placed)) {
      return { valid: false, reason: 'No connected route from the entrance to the center yet' };
    }
  } else if (!checkConnectivity(row, col, defId, rotation, placed)) {
    return { valid: false, reason: 'Tile paths must connect to an existing tile' };
  }

  if (!checkNamedSeparation(row, col, defId, placed)) {
    return { valid: false, reason: 'Named tiles must be separated by at least one unnamed tile' };
  }

  if (!checkVillageLast(defId, placed, namedRequired)) {
    return { valid: false, reason: `Place ${namedRequired} named tiles before the Village` };
  }

  if (!checkNoEarlyCenter(row, col, defId, rotation, placed, namedRequired)) {
    return { valid: false, reason: 'Cannot open a path to the center until enough named tiles are placed' };
  }

  return { valid: true };
}

/** Return every slot where the given tile + rotation can legally be placed. */
export function getValidPlacements(
  defId: string,
  rotation: number,
  placed: PlacedTile[],
  namedRequired: number,
): SlotPosition[] {
  return RING_SLOTS.filter((slot) =>
    canPlaceTile(slot.row, slot.col, defId, rotation, placed, namedRequired).valid,
  );
}
