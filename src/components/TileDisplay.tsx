import { type TileDef, type TileSymbol, getRotatedExits } from '../types';

const TILE_PX = 80;
const PATH_W = 24;

const SYMBOL_ICON: Record<TileSymbol, { char: string; label: string }> = {
  monster: { char: '\ud83d\udc79', label: 'Monster' },
  trap: { char: '\u232f', label: 'Trap' },
  encounter: { char: '\u25bc', label: 'Encounter' },
  ambush: { char: '\u2757', label: 'Ambush' },
};

// Wall texture patches — normalized coords (0–1) scaled by tile size
const WALL_PATCHES = [
  { cx: 0.14, cy: 0.14, rx: 0.13, ry: 0.09 },
  { cx: 0.82, cy: 0.17, rx: 0.09, ry: 0.12 },
  { cx: 0.16, cy: 0.82, rx: 0.11, ry: 0.08 },
  { cx: 0.80, cy: 0.80, rx: 0.08, ry: 0.11 },
  { cx: 0.50, cy: 0.12, rx: 0.07, ry: 0.09 },
  { cx: 0.12, cy: 0.50, rx: 0.08, ry: 0.07 },
  { cx: 0.88, cy: 0.50, rx: 0.07, ry: 0.08 },
  { cx: 0.50, cy: 0.88, rx: 0.09, ry: 0.07 },
];

interface Props {
  tileDef: TileDef;
  rotation?: number;
  size?: number;
  isSelected?: boolean;
  onClick?: () => void;
  showName?: boolean;
}

export function TileDisplay({
  tileDef,
  rotation = 0,
  size = TILE_PX,
  isSelected = false,
  onClick,
  showName = false,
}: Props) {
  const exits = getRotatedExits(tileDef.exits, rotation);
  const s = size;
  const half = s / 2;
  const pw = (PATH_W / TILE_PX) * s;   // corridor width
  const sw = pw * 0.22;                 // wall-shadow strip beside corridor
  const hw = pw * 0.32;                 // highlight strip down corridor centre

  // ---- colour scheme -------------------------------------------------------
  let wallBase = '#152d12';   // deep jungle wall
  let wallDark = '#0b1e09';   // foliage shadow
  let wallMid  = '#1e3d1a';   // mid-tone patches
  let pathFloor = '#7a5535';  // worn stone
  let pathLight = '#9a7050';  // stone highlight
  let pathShadow = '#4a3020'; // corridor wall shadow

  if (tileDef.isJungle) {
    wallBase = '#2a5a1e'; wallDark = '#193d12'; wallMid = '#356828';
    pathFloor = '#5a8a40'; pathLight = '#72a850'; pathShadow = '#2a4a18';
  }
  if (tileDef.isEntrance) {
    wallBase = '#1c4018'; wallDark = '#112a0e'; wallMid = '#274f22';
  }
  if (tileDef.isVillage) {
    wallBase = '#5a4228'; wallDark = '#3a2a18'; wallMid = '#6e5235';
    pathFloor = '#b08c5c'; pathLight = '#c8a870'; pathShadow = '#6a4c28';
  }
  // --------------------------------------------------------------------------

  const N = exits.includes('N');
  const S = exits.includes('S');
  const E = exits.includes('E');
  const W = exits.includes('W');

  return (
    <div
      onClick={onClick}
      style={{
        width: s,
        height: s,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: isSelected ? '2px solid #ffd700' : `1px solid ${wallDark}`,
        borderRadius: 4,
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>

        {/* === LAYER 1: wall base === */}
        <rect width={s} height={s} fill={wallBase} />

        {/* === LAYER 2: foliage/shadow patches === */}
        {WALL_PATCHES.map((p, i) => (
          <ellipse key={i}
            cx={p.cx * s} cy={p.cy * s}
            rx={p.rx * s} ry={p.ry * s}
            fill={wallDark} opacity={0.55}
          />
        ))}
        {/* lighter mid-tone specks */}
        <ellipse cx={s*0.30} cy={s*0.22} rx={s*0.06} ry={s*0.05} fill={wallMid} opacity={0.4} />
        <ellipse cx={s*0.70} cy={s*0.75} rx={s*0.05} ry={s*0.06} fill={wallMid} opacity={0.4} />
        <ellipse cx={s*0.22} cy={s*0.68} rx={s*0.05} ry={s*0.04} fill={wallMid} opacity={0.35} />
        <ellipse cx={s*0.75} cy={s*0.30} rx={s*0.04} ry={s*0.05} fill={wallMid} opacity={0.35} />

        {/* inner vignette frame */}
        <rect x={0} y={0} width={s} height={s}
          fill="none" stroke={wallDark} strokeWidth={s * 0.06} opacity={0.5} />

        {/* === LAYER 3: corridor wall-shadow strips (drawn wide, floor covers centre) === */}
        {N && <rect x={half - pw/2 - sw} y={0} width={pw + sw*2} height={half + pw/2} fill={pathShadow} />}
        {S && <rect x={half - pw/2 - sw} y={half - pw/2} width={pw + sw*2} height={half + pw/2} fill={pathShadow} />}
        {E && <rect x={half - pw/2} y={half - pw/2 - sw} width={half + pw/2} height={pw + sw*2} fill={pathShadow} />}
        {W && <rect x={0} y={half - pw/2 - sw} width={half + pw/2} height={pw + sw*2} fill={pathShadow} />}
        {/* centre hub shadow */}
        {(N || S || E || W) && (
          <rect x={half - pw/2 - sw} y={half - pw/2 - sw} width={pw + sw*2} height={pw + sw*2} fill={pathShadow} />
        )}

        {/* === LAYER 4: corridor floors === */}
        {N && <rect x={half - pw/2} y={0} width={pw} height={half} fill={pathFloor} />}
        {S && <rect x={half - pw/2} y={half} width={pw} height={half} fill={pathFloor} />}
        {E && <rect x={half} y={half - pw/2} width={half} height={pw} fill={pathFloor} />}
        {W && <rect x={0} y={half - pw/2} width={half} height={pw} fill={pathFloor} />}
        {/* centre hub */}
        {(N || S || E || W) && (
          <rect x={half - pw/2} y={half - pw/2} width={pw} height={pw} fill={pathFloor} />
        )}

        {/* === LAYER 5: corridor highlight (central lighter stripe) === */}
        {N && <rect x={half - hw/2} y={0} width={hw} height={half} fill={pathLight} opacity={0.45} />}
        {S && <rect x={half - hw/2} y={half} width={hw} height={half} fill={pathLight} opacity={0.45} />}
        {E && <rect x={half} y={half - hw/2} width={half} height={hw} fill={pathLight} opacity={0.45} />}
        {W && <rect x={0} y={half - hw/2} width={half} height={hw} fill={pathLight} opacity={0.45} />}
        {/* centre hub highlight */}
        {(N || S || E || W) && (
          <rect x={half - hw/2} y={half - hw/2} width={hw} height={hw} fill={pathLight} opacity={0.45} />
        )}

        {/* === LAYER 6: named tile — gold corner accent marks === */}
        {tileDef.isNamed && (() => {
          const m = Math.max(3, s * 0.06); // mark length
          const o = Math.max(2, s * 0.04); // offset from edge
          const corners = [
            // top-left
            [[o, o], [o + m, o]], [[o, o], [o, o + m]],
            // top-right
            [[s - o, o], [s - o - m, o]], [[s - o, o], [s - o, o + m]],
            // bottom-left
            [[o, s - o], [o + m, s - o]], [[o, s - o], [o, s - o - m]],
            // bottom-right
            [[s - o, s - o], [s - o - m, s - o]], [[s - o, s - o], [s - o, s - o - m]],
          ] as [[number, number], [number, number]][];
          return (
            <g stroke="#c4a87a" strokeWidth={Math.max(1, s * 0.025)} opacity={0.85}>
              {corners.map(([[x1, y1], [x2, y2]], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
          );
        })()}

        {/* === LAYER 7: village — warm glow overlay + border === */}
        {tileDef.isVillage && (
          <>
            <rect x={s*0.25} y={s*0.25} width={s*0.5} height={s*0.5} fill="#c4a87a" opacity={0.12} />
            <rect x={1} y={1} width={s-2} height={s-2} fill="none" stroke="#c4a87a" strokeWidth={2} opacity={0.6} />
          </>
        )}

        {/* === LAYER 8: subtle stone-slab grid === */}
        {[1, 2, 3].map((i) => (
          <g key={i} opacity={0.08}>
            <line x1={0} y1={(s * i) / 4} x2={s} y2={(s * i) / 4} stroke="#000" strokeWidth={0.5} />
            <line x1={(s * i) / 4} y1={0} x2={(s * i) / 4} y2={s} stroke="#000" strokeWidth={0.5} />
          </g>
        ))}

      </svg>

      {/* symbols */}
      {tileDef.symbols.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            display: 'flex',
            gap: 1,
            fontSize: Math.max(10, s * 0.15),
            lineHeight: 1,
          }}
        >
          {tileDef.symbols.map((sym, i) => (
            <span key={i} title={SYMBOL_ICON[sym].label}>
              {SYMBOL_ICON[sym].char}
            </span>
          ))}
        </div>
      )}

      {/* tile label */}
      {showName && (tileDef.isNamed || tileDef.isVillage || tileDef.isEntrance || tileDef.isJungle) && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            fontSize: Math.max(7, s * 0.1),
            color: '#ffd700',
            textShadow: '0 0 3px #000, 0 0 6px #000',
            lineHeight: 1.15,
            pointerEvents: 'none',
            fontWeight: 600,
          }}
        >
          {tileDef.name}
        </div>
      )}
    </div>
  );
}
