import { useState, useRef, useEffect } from 'react';
import { useGameState, HAZARD_CAP, NAMED_TILES_REQUIRED } from './hooks/useGameState';
import { getTileDef } from './data/tiles';
import { getValidPlacements } from './utils/placementRules';
import { MazeBoard } from './components/MazeBoard';
import { TilePalette } from './components/TilePalette';
import { TurnTracker } from './components/TurnTracker';
import { GameControls } from './components/GameControls';
import { HazardEventModal } from './components/HazardEventModal';
import { GameEndModal } from './components/GameEndModal';
import { SafeEventModal } from './components/SafeEventModal';
import { TutorModal } from './components/TutorModal';
import { getHazardEvent, getSafeEvent } from './data/hazardEvents';
import type { Player, TileDef } from './types';

function App() {
  const {
    state,
    selectTile,
    deselectTile,
    rotateCW,
    rotateCCW,
    placeTile,
    discardTile,
    applySafeBenefit,
    tutorTile,
    passTurn,
    undo,
    reset,
    setPlayers,
  } = useGameState();

  const canCurrentPlayerPlace =
    state.phase === 'playing' &&
    state.hands[state.currentPlayerIndex].some((tileId) =>
      [0, 90, 180, 270].some(
        (r) => getValidPlacements(tileId, r, state.placedTiles, NAMED_TILES_REQUIRED).length > 0,
      ),
    );

  const [activeEvent, setActiveEvent] = useState<ReturnType<typeof getHazardEvent> | null>(null);
  const [activeSafeEvent, setActiveSafeEvent] = useState<ReturnType<typeof getSafeEvent> | null>(null);
  const [tutorOptions, setTutorOptions] = useState<TileDef[] | null>(null);
  const prevPlacedLengthRef = useRef(2);

  // Auto-pass when the current player has no valid placements.
  // Consecutive passes across all players triggers the failure condition in the reducer.
  useEffect(() => {
    if (state.phase !== 'playing') return;
    if (canCurrentPlayerPlace) return;
    if (state.hands[state.currentPlayerIndex].length === 0) return;
    const timer = setTimeout(passTurn, 600);
    return () => clearTimeout(timer);
  }, [state.currentPlayerIndex, state.phase, canCurrentPlayerPlace]);

  // Trigger events after each new tile placement
  useEffect(() => {
    const newLen = state.placedTiles.length;
    if (newLen <= prevPlacedLengthRef.current) {
      prevPlacedLengthRef.current = newLen;
      return;
    }
    prevPlacedLengthRef.current = newLen;

    const last = state.placedTiles[newLen - 1];
    const def = getTileDef(last.defId);
    if (!def || def.isVillage || def.isEntrance || def.isJungle) return;

    if (def.symbols.length === 0) {
      // Safe tile — player picks a benefit
      const benefit = Math.random() < 0.5 ? 'move' : 'hazard';
      setActiveSafeEvent(getSafeEvent(benefit as 'move' | 'hazard'));
    } else if (def.symbols.includes('encounter')) {
      // Encounter — tutor if named tiles remain in deck
      const namedInDeck = state.deck
        .map((id) => getTileDef(id))
        .filter((d): d is TileDef => !!d?.isNamed);
      if (namedInDeck.length > 0) {
        setTutorOptions(namedInDeck);
      } else {
        const sym = def.symbols.find((s) => s !== 'encounter') ?? def.symbols[0];
        setActiveEvent(getHazardEvent(sym));
      }
    } else {
      const sym = def.symbols[Math.floor(Math.random() * def.symbols.length)];
      setActiveEvent(getHazardEvent(sym));
    }
  }, [state.placedTiles.length]);

  const validSlots =
    state.selectedTileId && state.phase === 'playing'
      ? getValidPlacements(state.selectedTileId, state.selectedRotation, state.placedTiles, NAMED_TILES_REQUIRED)
      : [];

  const handleSlotClick = (row: number, col: number) => {
    if (state.phase !== 'playing') return;
    if (state.selectedTileId && validSlots.some((s) => s.row === row && s.col === col)) {
      placeTile(row, col);
    }
  };

  const handlePlayerName = (i: number, name: string) => {
    const updated: Player[] = state.players.map((p, idx) => (idx === i ? { ...p, name } : p));
    setPlayers(updated);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0a1f0a',
        color: '#c4a87a',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {(state.phase === 'complete' || state.phase === 'failed') && (
        <GameEndModal
          phase={state.phase}
          failureReason={state.log[0]?.message ?? 'The maze could not be completed.'}
          onReset={reset}
        />
      )}
      {activeEvent && (
        <HazardEventModal event={activeEvent} onDismiss={() => setActiveEvent(null)} />
      )}
      {activeSafeEvent && (
        <SafeEventModal
          event={activeSafeEvent}
          onChoose={(benefit) => { applySafeBenefit(benefit); setActiveSafeEvent(null); }}
        />
      )}
      {tutorOptions && (
        <TutorModal
          tiles={tutorOptions}
          onChoose={(id) => { tutorTile(id); setTutorOptions(null); }}
          onSkip={() => setTutorOptions(null)}
        />
      )}
        <GameControls
          onUndo={undo}
          onReset={reset}
          canUndo={state.placedTiles.length > 2}
          phase={state.phase}
          movesRemaining={state.movesRemaining}
          hazardCount={state.hazardCount}
          hazardCap={HAZARD_CAP}
        />

      <div style={{ display: 'flex', flex: 1, gap: 16, padding: 16, overflow: 'hidden' }}>
        {/* Left: palette */}
        <div style={{ overflowY: 'auto', flexShrink: 0 }}>
          <TilePalette
            handTileIds={state.hands[state.currentPlayerIndex]}
            deckSize={state.deck.length}
            selectedTileId={state.selectedTileId}
            selectedRotation={state.selectedRotation}
            onSelect={selectTile}
            onDeselect={deselectTile}
            onRotateCW={rotateCW}
            onRotateCCW={rotateCCW}
            onDiscard={discardTile}
          />
        </div>

        {/* Center: board */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          <MazeBoard placedTiles={state.placedTiles} validSlots={validSlots} onSlotClick={handleSlotClick} />
        </div>

        {/* Right: turn tracker */}
        <div style={{ flexShrink: 0 }}>
          <TurnTracker
            players={state.players}
            currentPlayerIndex={state.currentPlayerIndex}
            log={state.log}
            phase={state.phase}
            onUpdatePlayerName={handlePlayerName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
