import type { PlacedTile, SlotPosition } from '../types';
import { RING_SLOTS, GRID_ROWS, GRID_COLS } from '../data/ringLayout';
import { getTileDef } from '../data/tiles';
import { TileDisplay } from './TileDisplay';

const SLOT_SIZE = 88;
const TILE_SIZE = 80;

interface Props {
  placedTiles: PlacedTile[];
  validSlots: SlotPosition[];
  onSlotClick: (row: number, col: number) => void;
}

export function MazeBoard({ placedTiles, validSlots, onSlotClick }: Props) {
  const placed = (r: number, c: number) => placedTiles.find((p) => p.slotRow === r && p.slotCol === c);
  const isValid = (r: number, c: number) => validSlots.some((s) => s.row === r && s.col === c);
  const zone = (r: number, c: number) => RING_SLOTS.find((s) => s.row === r && s.col === c)?.zone;

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
          return (
            <div key={key} onClick={() => v && onSlotClick(row, col)} style={cellStyle}>
              <div
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  border: v ? '2px dashed #ffd700' : `1px dashed ${z === 'center' ? '#8B7355' : '#2d5a27'}`,
                  borderRadius: 4,
                  cursor: v ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: v ? '#ffd700' : '#2d5a2780',
                  background: v ? 'rgba(255,215,0,0.06)' : 'transparent',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                {z === 'center' ? '🏘️' : v ? '✦' : ''}
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
