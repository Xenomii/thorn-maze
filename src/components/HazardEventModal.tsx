import type { HazardEvent } from '../data/hazardEvents';

interface Props {
  event: HazardEvent;
  onDismiss: () => void;
}

export function HazardEventModal({ event, onDismiss }: Props) {
  return (
    <div
      onClick={onDismiss}
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
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0f1a0f',
          border: '2px solid #8B3a3a',
          borderRadius: 10,
          padding: '32px 40px',
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(139,58,58,0.5)',
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
            color: '#e74c3c',
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

        <button
          onClick={onDismiss}
          style={{
            marginTop: 8,
            padding: '8px 24px',
            background: '#1a0f0f',
            border: '1px solid #8B3a3a',
            borderRadius: 4,
            color: '#c4a87a',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
          }}
        >
          Press On
        </button>
      </div>
    </div>
  );
}
