interface Props {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
  phase: string;
  movesRemaining: number;
  hazardCount: number;
  hazardCap: number;
}

export function GameControls({ onUndo, onReset, canUndo, phase, movesRemaining, hazardCount, hazardCap }: Props) {
  const movesColor =
    movesRemaining <= 5 ? '#e74c3c' : movesRemaining <= 10 ? '#f39c12' : '#c4a87a';
  const hazardColor =
    hazardCount >= hazardCap - 2 ? '#e74c3c' : hazardCount >= hazardCap - 5 ? '#f39c12' : '#9ca3af';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#0f1a0f',
        borderBottom: '1px solid #2d5a27',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 18, color: '#c4a87a', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
        🌿 Thorn Maze of Dungrunglung
      </h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {phase === 'playing' && (
          <>
            <span style={{ fontSize: 13, color: hazardColor, fontVariantNumeric: 'tabular-nums' }}>
              ☠ {hazardCount}/{hazardCap} hazard
            </span>
            <span style={{ fontSize: 13, color: movesColor, fontVariantNumeric: 'tabular-nums' }}>
              ⏳ {movesRemaining} move{movesRemaining !== 1 ? 's' : ''} left
            </span>
          </>
        )}
        {phase === 'complete' && (
          <span style={{ color: '#2ecc71', fontSize: 14 }}>✓ Village reached!</span>
        )}
        {phase === 'failed' && (
          <span style={{ color: '#e74c3c', fontSize: 14 }}>✗ Maze lost!</span>
        )}
        <button onClick={onUndo} disabled={!canUndo} style={btn}>↩ Undo</button>
        <button
          onClick={() => { if (confirm('Reset the entire maze?')) onReset(); }}
          style={btn}
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '4px 12px',
  border: '1px solid #2d5a27',
  borderRadius: 4,
  background: '#1a2f1a',
  color: '#c4a87a',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
