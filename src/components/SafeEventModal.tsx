import type { SafeEvent } from '../data/hazardEvents';

interface Props {
  event: SafeEvent;
  onChoose: (benefit: 'move' | 'hazard') => void;
}

export function SafeEventModal({ event, onChoose }: Props) {
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
          border: '2px solid #2ecc71',
          borderRadius: 10,
          padding: '32px 40px',
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(46,204,113,0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1 }}>{event.icon}</div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            color: '#2ecc71',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
          }}
        >
          {event.title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: '#c4a87a',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          {event.message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          <button onClick={() => onChoose('move')} style={btn}>
            +1 Move
          </button>
          <button onClick={() => onChoose('hazard')} style={btn}>
            -1 Hazard
          </button>
        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#132013',
  border: '1px solid #2ecc71',
  borderRadius: 4,
  color: '#c4a87a',
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'Georgia, serif',
  letterSpacing: 1,
};
