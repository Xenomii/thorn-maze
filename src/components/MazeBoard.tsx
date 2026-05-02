import type { PlacedTile, SlotPosition } from '../types';
import { RING_SLOTS, GRID_ROWS, GRID_COLS, getSlot } from '../data/ringLayout';
import { getTileDef } from '../data/tiles';
import { TileDisplay } from './TileDisplay';

const SLOT_SIZE = 88;
const TILE_SIZE = 80;

interface Props {
  placedTiles: PlacedTile[];
  validSlots: SlotPosition[];
  onSlotClick: (row: number, col: number) => void;
  lockedSlot: { row: number; col: number } | null;
}

export function MazeBoard({ placedTiles, validSlots, onSlotClick, lockedSlot }: Props) {
  const placed = (r: number, c: number) => placedTiles.find((p) => p.slotRow === r && p.slotCol === c);
  const isValid = (r: number, c: number) => validSlots.some((s) => s.row === r && s.col === c);
  const zone = (r: number, c: number) => RING_SLOTS.find((s) => s.row === r && s.col === c)?.zone;

  const lockedAdjacents = lockedSlot
    ? [
        getSlot(lockedSlot.row - 1, lockedSlot.col),
        getSlot(lockedSlot.row + 1, lockedSlot.col),
        getSlot(lockedSlot.row, lockedSlot.col - 1),
        getSlot(lockedSlot.row, lockedSlot.col + 1),
      ].filter(Boolean) as SlotPosition[]
    : [];

  const isLockedAdjacent = (r: number, c: number) =>
    lockedAdjacents.some((s) => s.row === r && s.col === c);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, ${SLOT_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${SLOT_SIZE}px)`,
        gap: 0,
        padding: 16,
        background: '#0a1f0a',
        borderRadius: 8,
        border: '2px solid #2d5a27',
      }}
    >
      {Array.from({ length: GRID_ROWS }, (_, row) =>
        Array.from({ length: GRID_COLS }, (_, col) => {
          const z = zone(row, col);
          const p = placed(row, col);
          const v = isValid(row, col);
          const key = `${row}-${col}`;

          // Not part of the ring at all
          if (!z) {
            return <div key={key} style={{ width: SLOT_SIZE, height: SLOT_SIZE }} />;
          }

          // Tile already placed here
          if (p) {
            const def = getTileDef(p.defId);
            if (!def) return <div key={key} />;
            return (
              <div key={key} style={cellStyle}>
                <TileDisplay tileDef={def} rotation={p.rotation} size={TILE_SIZE} showName />
              </div>
            );
          }

          // Empty slot (maybe valid for placement)
          const isGoalSlot = !!lockedSlot && row === lockedSlot.row && col === lockedSlot.col;
          const locked = isGoalSlot;
          const adjLocked = isLockedAdjacent(row, col) && !v;

          let borderStyle = '1px dashed #2d5a27';
          if (v) borderStyle = '2px dashed #ffd700';
          else if (locked) borderStyle = '2px solid #c0392b';
          else if (adjLocked) borderStyle = '2px solid #c0392b';

          let bgStyle = 'transparent';
          if (v) bgStyle = 'rgba(255,215,0,0.06)';
          else if (locked) bgStyle = 'rgba(192,57,43,0.15)';
          else if (adjLocked) bgStyle = 'rgba(192,57,43,0.08)';

          let icon = '';
          if (isGoalSlot) icon = locked ? '🔒' : '🏘️';
          else if (v) icon = '✦';

          return (
            <div key={key} onClick={() => v && onSlotClick(row, col)} style={cellStyle}>
              <div
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  border: borderStyle,
                  borderRadius: 4,
                  cursor: v ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: locked ? 20 : 10,
                  color: v ? '#ffd700' : locked ? '#c0392b' : '#2d5a2780',
                  background: bgStyle,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                {icon}
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  width: SLOT_SIZE,
  height: SLOT_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
