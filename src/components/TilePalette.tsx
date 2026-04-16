import type { TileDef } from '../types';
import { getTileDef } from '../data/tiles';
import { TileDisplay } from './TileDisplay';

interface Props {
  handTileIds: string[];
  deckSize: number;
  sharedPoolIds: string[];
  selectedTileId: string | null;
  selectedRotation: number;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onDiscard: (id: string) => void;
}

export function TilePalette({
  handTileIds,
  deckSize,
  selectedTileId,
  selectedRotation,
  onSelect,
  onDeselect,
  onRotateCW,
  onRotateCCW,
  onDiscard,
  sharedPoolIds,
}: Props) {
  const hand = handTileIds.map((id) => getTileDef(id)).filter((t): t is TileDef => !!t);
  const shared = sharedPoolIds.map((id) => getTileDef(id)).filter((t): t is TileDef => !!t);

  const named = hand.filter((t) => t.isNamed);
  const unnamed = hand.filter((t) => !t.isNamed && !t.isVillage);
  const village = hand.find((t) => t.isVillage);
  const selDef = selectedTileId ? getTileDef(selectedTileId) : null;

  const toggle = (id: string) => (selectedTileId === id ? onDeselect() : onSelect(id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0, color: '#c4a87a', fontSize: 14 }}>
          Your Hand ({hand.length})
        </h3>
        <span style={{ fontSize: 11, color: '#6b6375' }}>Deck: {deckSize}</span>
      </div>

      {/* selected tile preview + rotation */}
      {selDef && (
        <div style={{
          background: '#1a2f1a',
          padding: 8,
          borderRadius: 6,
          border: '1px solid #ffd700',
        }}>
          <div style={{ fontSize: 11, color: '#ffd700', marginBottom: 4 }}>Selected:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TileDisplay tileDef={selDef} rotation={selectedRotation} size={80} showName />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Btn onClick={onRotateCCW}>↺</Btn>
              <Btn onClick={onRotateCW}>↻</Btn>
              <Btn onClick={onDeselect} color="#e74c3c">✕</Btn>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>
              {selectedRotation}° · Click a ✦ slot to place
            </div>
            <button
              onClick={() => onDiscard(selDef.id)}
              title="Discard — costs 1 move"
              style={{
                padding: '2px 8px',
                border: '1px solid #8B3a3a',
                borderRadius: 4,
                background: '#1a0f0f',
                color: '#e74c3c',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ♻ Discard −1⧺
            </button>
          </div>
        </div>
      )}

      {/* named tiles in hand */}
      {named.length > 0 && (
        <Section label={`Named (${named.length})`} color="#ffd700">
        {named.map((t) => (
            <TileDisplay
              key={t.id}
              tileDef={t}
              size={72}
              isSelected={selectedTileId === t.id}
              onClick={() => toggle(t.id)}
              showName
            />
          ))}
        </Section>
      )}

      {/* unnamed tiles in hand */}
      {unnamed.length > 0 && (
        <Section label={`Maze (${unnamed.length})`} color="#9ca3af">
        {unnamed.map((t) => (
            <TileDisplay
              key={t.id}
              tileDef={t}
              size={72}
              isSelected={selectedTileId === t.id}
              onClick={() => toggle(t.id)}
              showName
            />
          ))}
        </Section>
      )}

      {/* village tile in hand */}
      {village && (
        <Section label="Village (last)" color="#8B7355">
          <TileDisplay
            tileDef={village}
            size={72}
            isSelected={selectedTileId === village.id}
            onClick={() => toggle(village.id)}
            showName
          />
        </Section>
      )}

      {hand.length === 0 && (
        <div style={{ fontSize: 11, color: '#6b6375', fontStyle: 'italic' }}>
          {deckSize > 0 ? 'Waiting for draw…' : 'No tiles remaining.'}
        </div>
      )}

      {/* shared pool — visible to all players */}
      {shared.length > 0 && (
        <div style={{
          marginTop: 4,
          padding: '8px 6px',
          background: '#0f1f0f',
          border: '1px solid #c4a87a',
          borderRadius: 6,
        }}>
          <div style={{ fontSize: 11, color: '#c4a87a', marginBottom: 6 }}>Available to All</div>
          {shared.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TileDisplay
                tileDef={t}
                size={72}
                isSelected={selectedTileId === t.id}
                onClick={() => toggle(t.id)}
                showName
              />
              <div style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.4 }}>
                Place at center once a path connects from the entrance.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- small helpers ---- */

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{children}</div>
    </div>
  );
}

function Btn({ onClick, children, color }: { onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        border: '1px solid #2d5a27',
        borderRadius: 4,
        background: '#1a2f1a',
        color: color ?? '#c4a87a',
        fontSize: 16,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}
