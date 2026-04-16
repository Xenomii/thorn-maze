import type { TileDef } from '../types';

interface Props {
  tiles: TileDef[];
  onChoose: (id: string) => void;
  onSkip: () => void;
}

export function TutorModal({ tiles, onChoose, onSkip }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: '#0f1a0f',
          border: '2px solid #6aa84f',
          borderRadius: 10,
          padding: '28px 32px',
          width: 420,
          boxShadow: '0 0 40px rgba(106,168,79,0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            color: '#9ccc65',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
            textAlign: 'center',
          }}
        >
          Encounter Complete
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: '#c4a87a', lineHeight: 1.5 }}>
          Choose a named place to tutor to the top of the deck.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
          {tiles.map((tile) => (
            <button key={tile.id} onClick={() => onChoose(tile.id)} style={itemBtn}>
              {tile.name}
            </button>
          ))}
        </div>
        <button onClick={onSkip} style={skipBtn}>
          Skip
        </button>
      </div>
    </div>
  );
}

const itemBtn: React.CSSProperties = {
  padding: '10px 12px',
  background: '#132013',
  border: '1px solid #6aa84f',
  borderRadius: 4,
  color: '#c4a87a',
  fontSize: 14,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const skipBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#1a1a1a',
  border: '1px solid #555',
  borderRadius: 4,
  color: '#9ca3af',
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  alignSelf: 'center',
};
