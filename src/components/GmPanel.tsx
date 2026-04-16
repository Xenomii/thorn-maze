import { useState } from 'react';

interface Props {
  hazardCount: number;
  hazardCap: number;
  movesRemaining: number;
  onAdjustHazard: (delta: number) => void;
  onAdjustMoves: (delta: number) => void;
}

const DELTAS = [-2, -1, +1, +2];

export function GmPanel({ hazardCount, hazardCap, movesRemaining, onAdjustHazard, onAdjustMoves }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: '100%', marginTop: 4 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: '1px solid #3a3a2a',
          borderRadius: 4,
          color: '#6b6375',
          fontSize: 12,
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span>⚙ GM Controls</span>
        <span style={{ fontSize: 10 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: 4,
            background: '#0a0f0a',
            border: '1px solid #3a3a2a',
            borderRadius: 4,
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 10, color: '#4a4a3a', marginBottom: 2 }}>
            Adjust counters based on table outcomes.
          </div>

          <Row
            label="☠ Hazard"
            value={`${hazardCount} / ${hazardCap}`}
            valueColor={hazardCount >= hazardCap - 2 ? '#e74c3c' : '#9ca3af'}
            onDelta={onAdjustHazard}
          />

          <Row
            label="⏳ Moves"
            value={String(movesRemaining)}
            valueColor={movesRemaining <= 3 ? '#e74c3c' : '#9ca3af'}
            onDelta={onAdjustMoves}
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
  onDelta,
}: {
  label: string;
  value: string;
  valueColor: string;
  onDelta: (d: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#6b6375' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: valueColor }}>{value}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {DELTAS.map((d) => (
          <button
            key={d}
            onClick={() => onDelta(d)}
            style={{
              flex: 1,
              padding: '3px 0',
              background: '#0f1a0f',
              border: `1px solid ${d < 0 ? '#5a2a2a' : '#2a4a2a'}`,
              borderRadius: 3,
              color: d < 0 ? '#e74c3c' : '#2ecc71',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>
    </div>
  );
}
