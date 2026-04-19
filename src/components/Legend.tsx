import { useState } from 'react';

const ENTRIES = [
  {
    icon: '👹',
    label: 'Monster',
    effect: 'Costs 1 move. Triggers a monster encounter event. +2 hazard.',
    color: '#e74c3c',
  },
  {
    icon: '⌧',
    label: 'Trap',
    effect: 'Costs 1 move. Triggers a trap event. +2 hazard.',
    color: '#f39c12',
  },
  {
    icon: '▼',
    label: 'Encounter',
    effect: 'Costs 1 move. Search the deck for a named tile — it goes to the top. +1 hazard.',
    color: '#9b59b6',
  },
  {
    icon: '❗',
    label: 'Ambush',
    effect: 'Costs 1 move. Triggers an ambush event. +2 hazard.',
    color: '#e67e22',
  },
  {
    icon: '🌿',
    label: 'Safe Passage',
    effect: 'No symbol. Costs 1 move. Choose a bonus: +1 Move restored or −1 Hazard reduced.',
    color: '#2ecc71',
  },
];

export function Legend() {
  const [open, setOpen] = useState(true);

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
          border: '1px solid #2d5a27',
          borderRadius: 4,
          color: '#9ca3af',
          fontSize: 12,
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span>Tile Symbol Guide</span>
        <span style={{ fontSize: 10 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: 4,
            background: '#0f1a0f',
            border: '1px solid #2d5a27',
            borderRadius: 4,
            padding: '8px 6px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {ENTRIES.map((e) => (
            <div key={e.label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: e.color, lineHeight: 1.2 }}>
                  {e.label}
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.4, marginTop: 2 }}>
                  {e.effect}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
