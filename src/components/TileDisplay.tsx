import { type TileDef, type TileSymbol, getRotatedExits } from '../types';

const TILE_PX = 80;
const PATH_W = 24;

const SYMBOL_ICON: Record<TileSymbol, { char: string; label: string }> = {
  monster: { char: '👹', label: 'Monster' },
  trap: { char: '⌧', label: 'Trap' },
  encounter: { char: '▼', label: 'Encounter' },
  ambush: { char: '❗', label: 'Ambush' },
};

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
  const pw = (PATH_W / TILE_PX) * s;

  let bg = '#2d5a27';
  if (tileDef.isJungle) bg = '#4a7a3a';
  if (tileDef.isVillage) bg = '#8B7355';
  if (tileDef.isEntrance) bg = '#3d6b34';

  const path = tileDef.isJungle ? '#7a9a5a' : tileDef.isVillage ? '#c4a87a' : '#8B7355';

  return (
    <div
      onClick={onClick}
      style={{
        width: s,
        height: s,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: isSelected ? '2px solid #ffd700' : '1px solid #1a3a15',
        borderRadius: 4,
        overflow: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect width={s} height={s} fill={bg} />

        {/* centre hub */}
        <rect x={half - pw / 2} y={half - pw / 2} width={pw} height={pw} fill={path} />

        {/* exit corridors */}
        {exits.includes('N') && <rect x={half - pw / 2} y={0} width={pw} height={half} fill={path} />}
        {exits.includes('S') && <rect x={half - pw / 2} y={half} width={pw} height={half} fill={path} />}
        {exits.includes('E') && <rect x={half} y={half - pw / 2} width={half} height={pw} fill={path} />}
        {exits.includes('W') && <rect x={0} y={half - pw / 2} width={half} height={pw} fill={path} />}

        {/* faint 4×4 grid */}
        {[1, 2, 3].map((i) => (
          <g key={i} opacity={0.15}>
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
