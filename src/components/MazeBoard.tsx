import type { PlacedTile, SlotPosition } from '../types';
import { RING_SLOTS, GRID_ROWS, GRID_COLS, getSlot } from '../data/ringLayout';
import { getTileDef } from '../data/tiles';
import { TileDisplay } from './TileDisplay';

const SLOT_SIZE = 88;
const TILE_SIZE = 80;

// Slots in the inner ring that directly border the center
const CENTER_SLOT = RING_SLOTS.find((s) => s.zone === 'center')!;
const INNER_ADJACENT = [
  getSlot(CENTER_SLOT.row - 1, CENTER_SLOT.col),
  getSlot(CENTER_SLOT.row + 1, CENTER_SLOT.col),
  getSlot(CENTER_SLOT.row, CENTER_SLOT.col - 1),
  getSlot(CENTER_SLOT.row, CENTER_SLOT.col + 1),
].filter(Boolean) as SlotPosition[];

interface Props {
  placedTiles: PlacedTile[];
  validSlots: SlotPosition[];
  onSlotClick: (row: number, col: number) => void;
  centerLocked: boolean;
}

export function MazeBoard({ placedTiles, validSlots, onSlotClick, centerLocked }: Props) {
  const placed = (r: number, c: number) => placedTiles.find((p) => p.slotRow === r && p.slotCol === c);
  const isValid = (r: number, c: number) => validSlots.some((s) => s.row === r && s.col === c);
  const zone = (r: number, c: number) => RING_SLOTS.find((s) => s.row === r && s.col === c)?.zone;
  const isInnerAdjacent = (r: number, c: number) =>
    centerLocked && INNER_ADJACENT.some((s) => s.row === r && s.col === c);

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
          const locked = centerLocked && z === 'center';
          const adjLocked = isInnerAdjacent(row, col) && !v;

          let borderStyle = `1px dashed #2d5a27`;
          if (v) borderStyle = '2px dashed #ffd700';
          else if (locked) borderStyle = '1px solid #8B3a3a';
          else if (z === 'center') borderStyle = '1px dashed #8B7355';
          else if (adjLocked) borderStyle = '1px dashed #7a3a20';

          let bgStyle = 'transparent';
          if (v) bgStyle = 'rgba(255,215,0,0.06)';
          else if (locked) bgStyle = 'rgba(139,58,58,0.12)';
          else if (adjLocked) bgStyle = 'rgba(122,58,32,0.08)';

          let icon = '';
          if (z === 'center') icon = locked ? '🔒' : '🏘️';
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
                  color: v ? '#ffd700' : locked ? '#8B3a3a' : '#2d5a2780',
                  background: bgStyle,
                  transition: 'border-color 0.2s, background 0.2s',
                  opacity: adjLocked ? 0.7 : 1,
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
