import type { Player, LogEntry } from '../types';

interface Props {
  players: Player[];
  currentPlayerIndex: number;
  log: LogEntry[];
  phase: string;
  onUpdatePlayerName: (index: number, name: string) => void;
}

export function TurnTracker({ players, currentPlayerIndex, log, phase, onUpdatePlayerName }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 200 }}>
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
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: active ? '#ffd700' : '#9ca3af',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  width: '100%',
                  outline: 'none',
                  padding: 0,
                  fontFamily: 'inherit',
                }}
              />
              {active && <span style={{ fontSize: 10, color: '#ffd700' }}>◄</span>}
            </div>
          );
        })}
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
