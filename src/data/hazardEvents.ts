import type { TileSymbol } from '../types';

export interface HazardEvent {
  symbol: TileSymbol;
  icon: string;
  title: string;
  message: string;
}

const EVENTS: Record<TileSymbol, { icon: string; title: string; messages: string[] }> = {
  monster: {
    icon: '👹',
    title: 'Monster Encounter!',
    messages: [
      'A fearsome beast crashes through the wall, claws raking the stone!',
      'Eyes gleam from the darkness — something ancient hungers.',
      'A guttural roar shakes dust from the ceiling. It has found you.',
    ],
  },
  trap: {
    icon: '⌧',
    title: 'Trap Triggered!',
    messages: [
      'Click. A pressure plate sinks beneath your foot — too late to stop it.',
      'Razor-edged darts shoot from hidden slits in the walls!',
      'The ground crumbles away. A pit yawns open beneath you.',
    ],
  },
  encounter: {
    icon: '▼',
    title: 'Strange Encounter!',
    messages: [
      'Glowing runes pulse on the walls. Something stirs in response.',
      'A cloaked figure watches silently from the far end of the passage.',
      'An eerie silence falls. The torches dim. Something is here with you.',
    ],
  },
  ambush: {
    icon: '❗',
    title: 'Ambush!',
    messages: [
      'Surprise! A horde of enemies ambush you from the shadows!',
      'They were waiting — you walked right into their trap!',
      'Blades flash from every direction at once. There is nowhere to run.',
    ],
  },
};

export function getHazardEvent(symbol: TileSymbol): HazardEvent {
  const entry = EVENTS[symbol];
  const message = entry.messages[Math.floor(Math.random() * entry.messages.length)];
  return { symbol, icon: entry.icon, title: entry.title, message };
}

// ---- Safe tile events -------------------------------------------------------

export type SafeBenefit = 'move' | 'hazard';

const SAFE_EVENTS: Record<SafeBenefit, { icon: string; title: string; messages: string[] }> = {
  move: {
    icon: '🌿',
    title: 'Safe Passage!',
    messages: [
      'Well-worn stonework guides your steps. The path is clear.',
      'A fortunate route — no dangers lurk here. Your footing is sure.',
      'Solid ground beneath you. A moment of calm amid the maze.',
    ],
  },
  hazard: {
    icon: '🛡️',
    title: 'Fortified Ground!',
    messages: [
      'Thick walls and clear sight lines ease the tension of the maze.',
      'A quiet corner. Something in the air feels less threatening here.',
      'Reinforced passage — the maze feels briefly less hostile.',
    ],
  },
};

export interface SafeEvent {
  benefit: SafeBenefit;
  icon: string;
  title: string;
  message: string;
}

export function getSafeEvent(benefit: SafeBenefit): SafeEvent {
  const entry = SAFE_EVENTS[benefit];
  const message = entry.messages[Math.floor(Math.random() * entry.messages.length)];
  return { benefit, icon: entry.icon, title: entry.title, message };
}
