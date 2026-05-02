import { useState, useRef, useEffect } from 'react';
import { useGameState, HAZARD_CAP, NAMED_TILES_REQUIRED } from './hooks/useGameState';
import { getTileDef } from './data/tiles';
import { getValidPlacements } from './utils/placementRules';
import { MazeBoard } from './components/MazeBoard';
import { TilePalette } from './components/TilePalette';
import { Legend } from './components/Legend';
import { GmPanel } from './components/GmPanel';
import { TurnTracker } from './components/TurnTracker';
import { GameControls } from './components/GameControls';
import { NewGameModal } from './components/NewGameModal';
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
    adjustHazard,
    adjustMoves,
    reset,
    setPlayers,
  } = useGameState();

  const [activeEvent, setActiveEvent] = useState<ReturnType<typeof getHazardEvent> | null>(null);
  const [activeSafeEvent, setActiveSafeEvent] = useState<ReturnType<typeof getSafeEvent> | null>(null);
  const [tutorOptions, setTutorOptions] = useState<TileDef[] | null>(null);
  const [showNewGameModal, setShowNewGameModal] = useState(true);
  const prevPlacedLengthRef = useRef(1);

  const namedPlacedCount = state.placedTiles.filter((p) => getTileDef(p.defId)?.isNamed).length;
  const lockedSlot = namedPlacedCount < NAMED_TILES_REQUIRED
    ? state.gameMode === 'enter' ? { row: 3, col: 3 } : { row: 6, col: 3 }
    : null;

  const validSlots =
    state.selectedTileId && state.phase === 'playing'
      ? getValidPlacements(state.selectedTileId, state.selectedRotation, state.placedTiles, NAMED_TILES_REQUIRED, state.gameMode)
      : [];

  const canCurrentPlayerPlace =
    state.phase === 'playing' &&
    [...state.hands[state.currentPlayerIndex], ...state.sharedPool].some((tileId) =>
      [0, 90, 180, 270].some(
        (r) => getValidPlacements(tileId, r, state.placedTiles, NAMED_TILES_REQUIRED, state.gameMode).length > 0,
      ),
    );

  // Auto-pass when the current player has no valid placements
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
    if (!def || def.isVillage || def.isExit || def.isEntrance || def.isJungle || def.isDungeonHeart) return;

    if (def.symbols.length === 0) {
      const benefit = Math.random() < 0.5 ? 'move' : 'hazard';
      setActiveSafeEvent(getSafeEvent(benefit as 'move' | 'hazard'));
    } else if (def.symbols.includes('encounter')) {
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
      {showNewGameModal && (
        <NewGameModal
          currentMode={state.gameMode}
          onSelect={(mode) => { reset(mode); setShowNewGameModal(false); }}
          onCancel={() => setShowNewGameModal(false)}
        />
      )}
      {(state.phase === 'complete' || state.phase === 'failed') && (
        <GameEndModal
          phase={state.phase}
          failureReason={state.log[0]?.message ?? 'The maze could not be completed.'}
          gameMode={state.gameMode}
          onReset={() => setShowNewGameModal(true)}
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
        onNewGame={() => setShowNewGameModal(true)}
        phase={state.phase}
        movesRemaining={state.movesRemaining}
        hazardCount={state.hazardCount}
        hazardCap={HAZARD_CAP}
      />

      <div style={{ display: 'flex', flex: 1, gap: 16, padding: 16, overflow: 'hidden' }}>
        {/* Left: palette */}
        <div style={{ overflowY: 'auto', flexShrink: 0, width: 300 }}>
          <TilePalette
            handTileIds={state.hands[state.currentPlayerIndex]}
            deckSize={state.deck.length}
            sharedPoolIds={state.sharedPool}
            selectedTileId={state.selectedTileId}
            selectedRotation={state.selectedRotation}
            onSelect={selectTile}
            onDeselect={deselectTile}
            onRotateCW={rotateCW}
            onRotateCCW={rotateCCW}
            onDiscard={discardTile}
          />
          <Legend />
          <GmPanel
            hazardCount={state.hazardCount}
            hazardCap={HAZARD_CAP}
            movesRemaining={state.movesRemaining}
            onAdjustHazard={adjustHazard}
            onAdjustMoves={adjustMoves}
          />
        </div>

        {/* Center: board */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          <MazeBoard
            placedTiles={state.placedTiles}
            validSlots={validSlots}
            onSlotClick={handleSlotClick}
            lockedSlot={lockedSlot}
          />
        </div>

        {/* Right: turn tracker */}
        <div style={{ flexShrink: 0, width: 260 }}>
          <TurnTracker
            players={state.players}
            currentPlayerIndex={state.currentPlayerIndex}
            log={state.log}
            phase={state.phase}
            placedTileDefIds={state.placedTiles.map((p) => p.defId)}
            namedRequired={NAMED_TILES_REQUIRED}
            onUpdatePlayerName={handlePlayerName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
