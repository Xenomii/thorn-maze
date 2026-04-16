# 🌿 Thorn Maze of Dungrunglung

A cooperative tile-placement maze-building game for 1–4 players. Work together to build a connected path through the thorn maze and reach Dungrunglung Village before the maze claims you.

**[▶ Play it here](https://xenomii.github.io/thorn-maze/)**

---

## Overview

Players share a shuffled deck and take turns placing maze tiles on the board. Each tile placed extends the maze. The goal is to build a connected route from the **Jungle Entrance** to the **Village** at the center — but time is running out, the maze grows more dangerous with every hazard tile placed, and the Grungs are listening.

---

## The Board

The board is a 7×7 grid of ring zones around a central destination:

```
  . . N N N . .     N = Outermost ring (15 slots)
  . N O O O N .     O = Outer ring     (11 slots)
  N O I I I O N     I = Inner ring      (8 slots)
  N O I [V] I O N   V = Village — center destination
  N O I I I O N
  . N O [E] O N .   E = Entrance (pre-placed)
  . . N [J] N . .   J = Jungle   (pre-placed)
```

The **Entrance** and **Jungle** tiles are placed automatically at the start. All other slots must be filled by players.

---

## Tiles

### Named Tiles (7 total)
Special locations that must be discovered before the Village can be reached. All named tiles carry hazard symbols.

| Tile | Symbols |
|------|---------|
| Shrine of Nangnang | 👹 Monster, ▼ Encounter |
| River Crossing | ⌧ Trap |
| Mushroom Grove | ▼ Encounter |
| Spider Nest | 👹 Monster, ⌧ Trap |
| Crumbling Bridge | ⌧ Trap, ❗ Ambush |
| Ancient Altar | ▼ Encounter, ❗ Ambush |
| Poison Garden | 👹 Monster, ⌧ Trap |

### Unnamed Tiles (27 total)
Maze corridors, bends, junctions, crossroads and dead ends. Some carry hazard symbols, others are safe.

- **Corridors** — straight N/S or E/W passages
- **Bends** — corner turns
- **T-Junctions** — three-way intersections
- **Crossroads** — four-way intersections
- **Dead Ends** — single-exit passages

### Village Tile (1)
The final destination. Placed at the center slot to win the game. Held back from the deck until 5 named tiles have been placed.

---

## Tile Symbols

| Symbol | Icon | Effect when tile is placed |
|--------|------|----------------------------|
| Monster | 👹 | Hazard event fires. Tile costs 0 moves but increments the hazard meter. |
| Trap | ⌧ | Hazard event fires. Same hazard cost as above. |
| Encounter | ▼ | Opens the **Tutor** — search the deck for a named tile and put it on top. |
| Ambush | ❗ | Hazard event fires. Same hazard cost as above. |
| *(none)* | — | **Safe tile** — costs 1 move but triggers a benefit: choose **+1 Move** or **−1 Hazard**. |

---

## Setup

1. All 7 named tiles and 27 unnamed tiles are shuffled into a deck. The Village tile is held aside.
2. Each player is dealt **3 tiles** from the top of the deck (round-robin). Remaining tiles form the draw pile.
3. The Entrance and Jungle tiles are pre-placed at the bottom of the board.
4. The move counter starts at **20**. The hazard meter starts at **0/15**.

---

## Turn Structure

On your turn:

1. **Select** a tile from your hand by clicking it.
2. **Rotate** it clockwise (↻) or counter-clockwise (↺) as needed.
3. **Place** it on a highlighted valid slot on the board.
4. **Draw** one tile from the top of the deck to refill your hand.
5. The turn passes to the next player.

### Alternatively

- **Discard** — Select a tile and click ♻ Discard. The tile goes to the bottom of the deck and you draw a replacement. Costs **1 move**.

---

## Placement Rules

- **Connectivity** — every tile placed must share at least one matching exit with an already-placed neighbour. Exits must align: if your tile opens toward a neighbour, that neighbour must open back.
- **Named separation** — named tiles may not be placed directly adjacent (orthogonally) to another named tile. At least one unnamed tile must separate them.
- **Village restriction** — the Village tile may only be placed at the center slot, and only after 5 named tiles are on the board.
- **Center gating** — no tile may open a path toward the center until 5 named tiles have been placed.
- **Route required** — the Village tile can only be placed if a genuine connected path exists from the Entrance to the center through placed tiles.

---

## Winning

Place the **Village tile** at the center slot. This requires:

1. At least **5 of 7 named tiles** placed on the board.
2. A **connected route** of matching exits leading from the Entrance all the way to the center.
3. The Village tile in the current player's hand (it is automatically dealt when condition 1 is met).

---

## Losing

The game ends in defeat if any of the following occur:

- **Out of moves** — the move counter reaches 0 before the Village is placed.
- **Hazard overrun** — 15 hazard tiles are placed. The maze becomes too dangerous to navigate.
- **Maze sealed** — all players consecutively have no valid placements. The Grungs close in.

---

## The Interface

### Header Bar
- **☠ Hazard meter** — tracks how many hazard tiles have been placed. Turns orange near 10, red near 13. Hits 15 = game over.
- **⏳ Moves remaining** — shared countdown. Turns orange below 10, red below 5.
- **↩ Undo** — reverses the last placement (available after at least one tile has been placed beyond the pre-placed tiles).
- **🔄 New Game** — resets everything.

### Your Hand (left panel)
- Shows the **current player's 3 tiles** only — other players' hands are hidden.
- **Deck counter** shows how many tiles remain to draw.
- Selecting a tile previews it with rotation controls and a discard option.

### Board (center)
- Valid placement slots are highlighted with a **✦** when a tile is selected.
- The center slot shows 🏘️ and becomes targetable once 5 named tiles are placed and a route exists.

### Turn Tracker (right panel)
- Shows turn order and highlights the active player.
- Player names are editable — click to rename.
- Game log records every placement, draw, discard, and event.

---

## Development

```bash
npm install      # install dependencies
npm run dev      # start dev server
npm run build    # production build
```
