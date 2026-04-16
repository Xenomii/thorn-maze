import { NAMED_TILES } from '../data/tiles';
import type { Player, LogEntry } from '../types';

interface Props {
  players: Player[];
  currentPlayerIndex: number;
  log: LogEntry[];
  phase: string;
  placedTileDefIds: string[];
  namedRequired: number;
  onUpdatePlayerName: (index: number, name: string) => void;
}

export function TurnTracker({ players, currentPlayerIndex, log, phase, placedTileDefIds, namedRequired, onUpdatePlayerName }: Props) {
  const placedNamedSet = new Set(placedTileDefIds.filter((id) => NAMED_TILES.some((t) => t.id === id)));
  const placedCount = placedNamedSet.size;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <h3 style={{ margin: 0, color: '#c4a87a', fontSize: 14 }}>
        {phase === 'complete'
          ? '🎉 Maze Complete!'
          : phase === 'failed'
          ? '💀 Maze Lost!'
          : 'Turn Order'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {players.map((p, i) => {
          const active = i === currentPlayerIndex;
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                borderRadius: 4,
                background: active ? 'rgba(255,215,0,0.1)' : 'transparent',
                border: active ? '1px solid #ffd700' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: p.color,
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                value={p.name}
                onChange={(e) => onUpdatePlayerName(i, e.target.value)}
                title="Click to rename"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px dashed ${active ? '#ffd70060' : '#9ca3af40'}`,
                  color: active ? '#ffd700' : '#9ca3af',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  width: '100%',
                  outline: 'none',
                  padding: '0 0 1px 0',
                  fontFamily: 'inherit',
                  cursor: 'text',
                }}
              />
              {active && <span style={{ fontSize: 10, color: '#ffd700' }}>◄</span>}
            </div>
          );
        })}
      </div>

      {/* named tile checklist */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>Named Locations</div>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: placedCount >= namedRequired ? '#2ecc71' : '#c4a87a',
          }}>
            {placedCount}/{namedRequired}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAMED_TILES.map((t) => {
            const placed = placedNamedSet.has(t.id);
            return (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 12,
                  color: placed ? '#2ecc71' : '#4a4a4a',
                  flexShrink: 0,
                }}>
                  {placed ? '✓' : '○'}
                </span>
                <span style={{
                  fontSize: 10,
                  color: placed ? '#9ca3af' : '#5a5a5a',
                  textDecoration: placed ? 'line-through' : 'none',
                }}>
                  {t.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* game log */}
      <div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Game Log</div>
        <div
          style={{
            maxHeight: 220,
            overflowY: 'auto',
            fontSize: 11,
            color: '#6b6375',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {log.slice(0, 30).map((entry, i) => (
            <div key={i} style={{ opacity: Math.max(0.3, 1 - i * 0.03) }}>
              {entry.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
