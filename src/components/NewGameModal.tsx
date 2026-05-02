interface Props {
  currentMode: 'enter' | 'escape';
  onSelect: (mode: 'enter' | 'escape') => void;
  onCancel: () => void;
}

export function NewGameModal({ currentMode, onSelect, onCancel }: Props) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0f1a0f',
          border: '2px solid #2d5a27',
          borderRadius: 10,
          padding: '32px 40px',
          maxWidth: 400,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, color: '#c4a87a', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
          New Game
        </h2>

        {/* Restart current mode */}
        <button onClick={() => onSelect(currentMode)} style={resetBtn}>
          <span style={{ fontSize: 18 }}>🔄</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              Restart — {currentMode === 'enter' ? 'Enter the Maze' : 'Escape the Maze'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Play the same mode again with a fresh board.</div>
          </div>
        </button>

        <div style={{ fontSize: 11, color: '#4a4a3a' }}>— or switch mode —</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => onSelect('enter')} style={enterBtn}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Enter the Maze</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Build a path from the jungle entrance to Dungrunglung Village at the center.</div>
            </div>
          </button>

          <button onClick={() => onSelect('escape')} style={escapeBtn}>
            <span style={{ fontSize: 22 }}>💀</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Escape the Maze</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Trapped in the Dungeon Heart — build outward and find the exit before the maze claims you.</div>
            </div>
          </button>
        </div>

        <button
          onClick={onCancel}
          style={{
            alignSelf: 'center',
            padding: '4px 16px',
            background: 'transparent',
            border: '1px solid #3a3a2a',
            borderRadius: 4,
            color: '#6b6375',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const baseBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '12px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  fontFamily: 'Georgia, serif',
  fontSize: 14,
  textAlign: 'left',
};

const resetBtn: React.CSSProperties = {
  ...baseBtn,
  background: '#1a1a0f',
  border: '1px solid #6b6330',
  color: '#c4a87a',
};

const enterBtn: React.CSSProperties = {
  ...baseBtn,
  background: '#0f2a0f',
  border: '1px solid #2d5a27',
  color: '#c4a87a',
};

const escapeBtn: React.CSSProperties = {
  ...baseBtn,
  background: '#2a0f0f',
  border: '1px solid #5a2a2a',
  color: '#c4a87a',
};
