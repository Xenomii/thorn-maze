interface Props {
  phase: 'complete' | 'failed';
  failureReason: string;
  onReset: () => void;
}

const WIN = {
  icon: '🏘️',
  title: 'Village Reached!',
  messages: [
    'Against all odds, the maze yields its secret. Dungrunglung Village stands before you.',
    'The thorns part. The path is clear. You have found the village.',
    'Through monsters, traps, and darkness — you made it.',
  ],
  borderColor: '#2ecc71',
  titleColor: '#2ecc71',
  glowColor: 'rgba(46,204,113,0.35)',
  btnLabel: 'Play Again',
};

const LOSE = {
  icon: '💀',
  title: 'The Maze Claims You',
  borderColor: '#e74c3c',
  titleColor: '#e74c3c',
  glowColor: 'rgba(231,76,60,0.35)',
  btnLabel: 'Try Again',
};

export function GameEndModal({ phase, failureReason, onReset }: Props) {
  const isWin = phase === 'complete';
  const config = isWin ? WIN : LOSE;
  const message = isWin
    ? WIN.messages[Math.floor(Math.random() * WIN.messages.length)]
    : failureReason;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: '#0f1a0f',
          border: `2px solid ${config.borderColor}`,
          borderRadius: 12,
          padding: '40px 48px',
          maxWidth: 420,
          textAlign: 'center',
          boxShadow: `0 0 60px ${config.glowColor}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 72, lineHeight: 1 }}>{config.icon}</div>

        <h2
          style={{
            margin: 0,
            fontSize: 26,
            color: config.titleColor,
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
          }}
        >
          {config.title}
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: '#c4a87a',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          {message}
        </p>

        <button
          onClick={onReset}
          style={{
            marginTop: 4,
            padding: '10px 32px',
            background: '#0f1a0f',
            border: `1px solid ${config.borderColor}`,
            borderRadius: 6,
            color: config.titleColor,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
            alignSelf: 'center',
          }}
        >
          {config.btnLabel}
        </button>
      </div>
    </div>
  );
}
