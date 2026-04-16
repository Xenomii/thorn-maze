import { useReducer, useCallback } from 'react';
import type { GameState, PlacedTile, Player, LogEntry } from '../types';
import { NAMED_TILES, UNNAMED_TILES, VILLAGE_TILE, getTileDef } from '../data/tiles';

const HAND_SIZE = 3;
const MOVE_LIMIT = 20;
export const HAZARD_CAP = 15;
export const NAMED_TILES_REQUIRED = 5;

// ---- actions ---------------------------------------------------------------

type Action =
  | { type: 'SELECT_TILE'; tileId: string }
  | { type: 'DESELECT_TILE' }
  | { type: 'ROTATE'; direction: 'cw' | 'ccw' }
  | { type: 'PLACE_TILE'; row: number; col: number }
  | { type: 'DISCARD_TILE'; tileId: string }
  | { type: 'APPLY_SAFE_BENEFIT'; benefit: 'move' | 'hazard' }
  | { type: 'TUTOR_TILE'; tileId: string }
  | { type: 'PASS_TURN' }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'SET_PLAYERS'; players: Player[] };

// ---- defaults --------------------------------------------------------------

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Player 1', color: '#e74c3c' },
  { id: '2', name: 'Player 2', color: '#3498db' },
  { id: '3', name: 'Player 3', color: '#2ecc71' },
  { id: '4', name: 'Player 4', color: '#f39c12' },
];

// ---- utilities -------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- initial state ---------------------------------------------------------

function createInitialState(): GameState {
  const initialPlaced: PlacedTile[] = [
    { defId: 'jungle', rotation: 0, slotRow: 6, slotCol: 3 },
    { defId: 'entrance', rotation: 0, slotRow: 5, slotCol: 3 },
  ];

  // Village tile is held back — it enters the deck only once all named tiles are placed
  const allIds = shuffle([
    ...NAMED_TILES.map((t) => t.id),
    ...UNNAMED_TILES.map((t) => t.id),
  ]);

  // Deal HAND_SIZE cards to each player in round-robin order
  const hands: string[][] = DEFAULT_PLAYERS.map(() => []);
  let deckStart = 0;
  for (let h = 0; h < HAND_SIZE; h++) {
    for (let p = 0; p < DEFAULT_PLAYERS.length; p++) {
      if (deckStart < allIds.length) {
        hands[p].push(allIds[deckStart++]);
      }
    }
  }
  const deck = allIds.slice(deckStart);

  return {
    placedTiles: initialPlaced,
    remainingTileIds: allIds,
    deck,
    hands,
    selectedTileId: null,
    selectedRotation: 0,
    players: DEFAULT_PLAYERS,
    currentPlayerIndex: 0,
    log: [{ message: 'The maze awaits… enter if you dare.', timestamp: Date.now() }],
    phase: 'playing',
    movesRemaining: MOVE_LIMIT,
    hazardCount: 0,
    consecutivePasses: 0,
  };
}

// ---- reducer ---------------------------------------------------------------

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SELECT_TILE':
      if (state.phase !== 'playing') return state;
      return { ...state, selectedTileId: action.tileId, selectedRotation: 0 };

    case 'DESELECT_TILE':
      return { ...state, selectedTileId: null, selectedRotation: 0 };

    case 'ROTATE': {
      const delta = action.direction === 'cw' ? 90 : -90;
      return {
        ...state,
        selectedRotation: ((state.selectedRotation + delta) % 360 + 360) % 360,
      };
    }

    case 'PLACE_TILE': {
      if (!state.selectedTileId) return state;

      const newPlaced: PlacedTile = {
        defId: state.selectedTileId,
        rotation: state.selectedRotation,
        slotRow: action.row,
        slotCol: action.col,
      };

      const tileDef = getTileDef(state.selectedTileId);
      const player = state.players[state.currentPlayerIndex];

      // Remove tile from current player's hand
      const updatedHand = state.hands[state.currentPlayerIndex].filter(
        (id) => id !== state.selectedTileId,
      );

      // Draw a replacement from the deck
      let newDeck = state.deck;
      let drawMsg = '';
      if (newDeck.length > 0) {
        const drawn = newDeck[0];
        newDeck = newDeck.slice(1);
        updatedHand.push(drawn);
        drawMsg = ` → drew ${getTileDef(drawn)?.name ?? drawn}`;
      }

      // Check if placing this tile completes the named-tile requirement, unlocking the village
      const allPlacedIds = new Set([...state.placedTiles.map((p) => p.defId), state.selectedTileId]);
      const placedNamedCount = [...allPlacedIds].filter((id) => getTileDef(id)?.isNamed).length;
      const allNamedPlaced = placedNamedCount >= NAMED_TILES_REQUIRED;
      const villageAlreadyInPlay = state.remainingTileIds.includes(VILLAGE_TILE.id);
      const unlockVillage = allNamedPlaced && !villageAlreadyInPlay && !tileDef?.isVillage;
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

      // Deal Village directly into the next player's hand on unlock so it's immediately available
      const newHands = state.hands.map((h, i) => {
        if (i === state.currentPlayerIndex) return updatedHand;
        if (i === nextPlayerIndex && unlockVillage) return [...h, VILLAGE_TILE.id];
        return h;
      });

      // Hazard tiles (any symbols) are free to place but push the hazard meter
      const isHazardTile = (tileDef?.symbols.length ?? 0) > 0;
      const newMovesRemaining = isHazardTile ? state.movesRemaining : state.movesRemaining - 1;
      const newHazardCount = isHazardTile ? state.hazardCount + 1 : state.hazardCount;

      const isVillage = tileDef?.isVillage ?? false;
      const newPhase = isVillage
        ? 'complete'
        : newHazardCount >= HAZARD_CAP
        ? 'failed'
        : newMovesRemaining <= 0
        ? 'failed'
        : state.phase;

      const unlockMsg = unlockVillage ? ' — Village unlocked!' : '';
      const hazardMsg =
        isHazardTile && newHazardCount >= HAZARD_CAP ? ' — Maze overrun by danger!' : '';
      const newLog: LogEntry = {
        message: `${player.name} placed "${tileDef?.name ?? state.selectedTileId}"${drawMsg}${unlockMsg}${hazardMsg}`,
        timestamp: Date.now(),
      };

      return {
        ...state,
        placedTiles: [...state.placedTiles, newPlaced],
        remainingTileIds: unlockVillage
          ? [...state.remainingTileIds.filter((id) => id !== state.selectedTileId), VILLAGE_TILE.id]
          : state.remainingTileIds.filter((id) => id !== state.selectedTileId),
        deck: newDeck,
        hands: newHands,
        selectedTileId: null,
        selectedRotation: 0,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        log: [newLog, ...state.log],
        phase: newPhase,
        movesRemaining: newMovesRemaining,
        hazardCount: newHazardCount,
        consecutivePasses: 0,
      };
    }

    case 'DISCARD_TILE': {
      const tileDef = getTileDef(action.tileId);
      const player = state.players[state.currentPlayerIndex];

      // Remove tile from hand
      const updatedHand = state.hands[state.currentPlayerIndex].filter(
        (id) => id !== action.tileId,
      );

      // Draw from existing deck first (so discarded tile isn't immediately re-drawn)
      let newDeck = state.deck;
      let drawMsg = '';
      if (newDeck.length > 0) {
        const drawn = newDeck[0];
        newDeck = newDeck.slice(1);
        updatedHand.push(drawn);
        drawMsg = ` → drew ${getTileDef(drawn)?.name ?? drawn}`;
      }

      // Discarded tile goes to bottom of deck
      newDeck = [...newDeck, action.tileId];

      const newHands = state.hands.map((h, i) =>
        i === state.currentPlayerIndex ? updatedHand : h,
      );

      const newMovesRemaining = state.movesRemaining - 1;
      const newPhase = newMovesRemaining <= 0 ? 'failed' : state.phase;

      const newLog: LogEntry = {
        message: `${player.name} discarded "${tileDef?.name ?? action.tileId}"${drawMsg} — −1 move`,
        timestamp: Date.now(),
      };

      return {
        ...state,
        deck: newDeck,
        hands: newHands,
        selectedTileId: null,
        selectedRotation: 0,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        log: [newLog, ...state.log],
        phase: newPhase,
        movesRemaining: newMovesRemaining,
      };
    }

    case 'APPLY_SAFE_BENEFIT': {
      const newLog: LogEntry = {
        message:
          action.benefit === 'move'
            ? 'Safe passage — +1 move restored!'
            : 'Fortified ground — hazard eased by 1!',
        timestamp: Date.now(),
      };
      return {
        ...state,
        movesRemaining:
          action.benefit === 'move' ? state.movesRemaining + 1 : state.movesRemaining,
        hazardCount:
          action.benefit === 'hazard' ? Math.max(0, state.hazardCount - 1) : state.hazardCount,
        log: [newLog, ...state.log],
      };
    }

    case 'TUTOR_TILE': {
      const newDeck = [action.tileId, ...state.deck.filter((id) => id !== action.tileId)];
      const newLog: LogEntry = {
        message: `Encounter: "${getTileDef(action.tileId)?.name}" drawn to top of deck.`,
        timestamp: Date.now(),
      };
      return { ...state, deck: newDeck, log: [newLog, ...state.log] };
    }

    case 'PASS_TURN': {
      const player = state.players[state.currentPlayerIndex];
      const newPasses = state.consecutivePasses + 1;
      const allStuck = newPasses >= state.players.length;
      return {
        ...state,
        selectedTileId: null,
        selectedRotation: 0,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        consecutivePasses: newPasses,
        phase: allStuck ? 'failed' : state.phase,
        log: [{
          message: allStuck
            ? 'The Grungs have heard you stumbling through the maze. They emerge from every passage, surrounding the party. There is no escape.'
            : `${player.name} has no valid placements — turn passed.`,
          timestamp: Date.now(),
        }, ...state.log],
      };
    }

    case 'UNDO': {
      if (state.placedTiles.length <= 2) return state;
      const last = state.placedTiles[state.placedTiles.length - 1];
      const prevIndex =
        (state.currentPlayerIndex - 1 + state.players.length) % state.players.length;

      // Give the tile back to the previous player.
      // If their hand is at HAND_SIZE (meaning they drew after placing), swap out
      // the most-recently-drawn tile (last element) back onto the deck.
      const prevHand = state.hands[prevIndex];
      let restoredHand: string[];
      let newDeck = state.deck;
      if (prevHand.length >= HAND_SIZE) {
        const drawnBack = prevHand[prevHand.length - 1];
        restoredHand = [...prevHand.slice(0, -1), last.defId];
        newDeck = [drawnBack, ...state.deck];
      } else {
        restoredHand = [...prevHand, last.defId];
      }

      const newHands = state.hands.map((h, i) => (i === prevIndex ? restoredHand : h));

      const lastDef = getTileDef(last.defId);
      const undoWasHazard = (lastDef?.symbols.length ?? 0) > 0;

      return {
        ...state,
        placedTiles: state.placedTiles.slice(0, -1),
        remainingTileIds: [...state.remainingTileIds, last.defId],
        deck: newDeck,
        hands: newHands,
        selectedTileId: null,
        selectedRotation: 0,
        currentPlayerIndex: prevIndex,
        log: [{ message: 'Last placement undone.', timestamp: Date.now() }, ...state.log],
        phase: 'playing',
        movesRemaining: undoWasHazard ? state.movesRemaining : state.movesRemaining + 1,
        hazardCount: undoWasHazard ? state.hazardCount - 1 : state.hazardCount,
      };
    }

    case 'RESET':
      return createInitialState();

    case 'SET_PLAYERS':
      return { ...state, players: action.players };

    default:
      return state;
  }
}

// ---- hook ------------------------------------------------------------------

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  return {
    state,
    selectTile: useCallback((id: string) => dispatch({ type: 'SELECT_TILE', tileId: id }), []),
    deselectTile: useCallback(() => dispatch({ type: 'DESELECT_TILE' }), []),
    rotateCW: useCallback(() => dispatch({ type: 'ROTATE', direction: 'cw' }), []),
    rotateCCW: useCallback(() => dispatch({ type: 'ROTATE', direction: 'ccw' }), []),
    placeTile: useCallback(
      (row: number, col: number) => dispatch({ type: 'PLACE_TILE', row, col }),
      [],
    ),
    discardTile: useCallback((id: string) => dispatch({ type: 'DISCARD_TILE', tileId: id }), []),
    applySafeBenefit: useCallback(
      (benefit: 'move' | 'hazard') => dispatch({ type: 'APPLY_SAFE_BENEFIT', benefit }),
      [],
    ),
    tutorTile: useCallback((id: string) => dispatch({ type: 'TUTOR_TILE', tileId: id }), []),
    passTurn: useCallback(() => dispatch({ type: 'PASS_TURN' }), []),
    undo: useCallback(() => dispatch({ type: 'UNDO' }), []),
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
    setPlayers: useCallback((p: Player[]) => dispatch({ type: 'SET_PLAYERS', players: p }), []),
  };
}
