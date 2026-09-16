# MONSTERBOUND: Legends of Aurelia

An original, browser-based 2D monster-collecting RPG built with **Phaser 3** and **Vite**. Every
creature, character, location, move, item, and piece of art/audio in this project is original -
none of it uses Pokémon or any other copyrighted franchise's names, sprites, maps, music, or story.
It is *inspired by* the classic top-down monster-RPG genre, nothing more.

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Controls](#controls)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Build Instructions](#build-instructions)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [How to Add Monsters](#how-to-add-monsters)
- [How to Add Maps](#how-to-add-maps)
- [How to Add Moves](#how-to-add-moves)
- [How to Add Quests / Trainers](#how-to-add-quests--trainers)
- [What's Implemented vs. What's a Stub](#whats-implemented-vs-whats-a-stub)
- [Credits](#credits)
- [Copyright / Licensing Note](#copyright--licensing-note)

## Features

- ✅ Data-driven **129 original monster species** across 60 two-stage evolution lines + 3 starters
  + 3 legendaries, spanning **12 original elemental types** with a full type-effectiveness chart.
- ✅ **102 original moves** (typed attacks, status/buff/debuff moves, generic moves, signature moves).
- ✅ Full **turn-based battle system**: Fight/Monsters/Bag/Run(or Capture), accuracy, critical hits,
  6 status effects, stat stages, switching, wild + trainer + gym battles, XP and leveling, evolution.
- ✅ **Capture system** with 4 capsule tiers and an HP/rarity/status-aware catch formula.
- ✅ **8 Gym/Boss Leaders**, an original rival (Corin) with 6 story encounters, and an original
  villain organization (**The Eclipse Order**) with grunts, commanders, a scientist, and a director.
- ✅ Grid-based overworld movement, collision, NPC dialogue (typewriter + branching choices),
  quests (main/side/hidden), shops, healing centers, inventory, and a Monster Archive (Pokédex-like).
- ✅ Save/Load via `localStorage`, with corruption-safe fallbacks.
- ✅ **100% procedurally generated art and audio** - no binary asset files. Sprites are built at
  runtime from Phaser `Graphics` primitives; every sound effect and music loop is synthesized with
  the Web Audio API. This keeps the repository tiny and guarantees there is no third-party IP inside it.
- ✅ Debug mode (`F1`) with heal-party / add-money / toggle-encounters hooks, disabled by default.
- ✅ Error handling for missing/corrupted save data and unknown IDs.

## Screenshots

This is a code-generated project without shipped binary screenshots. Run `npm run dev` and open the
browser to see the title screen, overworld, and battle UI live - everything renders from code.

## Controls

| Action | Key |
|---|---|
| Move | `WASD` or Arrow Keys |
| Run | Hold `Space` |
| Interact / Confirm / Advance text | `Z` or `Enter` |
| Menu / Back / Cancel | `X` or `Esc` |
| Debug Mode | `F1` |

Gamepad support was scoped out of this pass to keep the core loop solid - see "What's a Stub" below
for how to add it.

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

This starts Vite's dev server and opens the game in your default browser (usually
`http://localhost:5173`).

## Build Instructions

```bash
npm run build
```

Outputs a production build to `dist/`. Preview it with `npm run preview`.

## Architecture

The project follows a clean, **data-driven** separation between content and engine:

- **`data/`** - pure data (monsters, moves, items, trainers, quests, maps, story). No game logic
  lives here. This is intentionally the layer you'll edit most when expanding the game.
- **`systems/`** - stateless or singleton engine logic (battle math, capture math, evolution rules,
  inventory, quests, save/load, procedural sprite/audio generation). `BattleSystem` in particular is
  UI-agnostic: it returns a log of events that `BattleScene` animates, so the same engine drives wild,
  trainer, gym, and rival battles.
- **`entities/`** - runtime objects: `Player`, `NPC`, `Monster` (a *species + level + state* instance,
  distinct from the static species data in `data/monsters.js`).
- **`scenes/`** - Phaser scenes: Boot → Preload → Title → World (overworld) → Battle (launched as an
  overlay on top of World) → Menu (also an overlay).
- **`ui/`** - reusable UI widgets, currently the `DialogueBox` (typewriter text + branching choices)
  used by both the overworld and battle scenes.

## Folder Structure

```
monsterbound/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src/
    ├── main.js
    ├── scenes/
    │   ├── BootScene.js
    │   ├── PreloadScene.js
    │   ├── TitleScene.js
    │   ├── WorldScene.js
    │   ├── BattleScene.js
    │   └── MenuScene.js
    ├── entities/
    │   ├── Player.js
    │   ├── NPC.js
    │   └── Monster.js
    ├── systems/
    │   ├── GameState.js
    │   ├── BattleSystem.js
    │   ├── CaptureSystem.js
    │   ├── EvolutionSystem.js
    │   ├── QuestSystem.js
    │   ├── SaveSystem.js
    │   ├── InventorySystem.js
    │   ├── SpriteGenerator.js
    │   ├── AudioSystem.js
    │   └── AudioSystemInstance.js
    ├── data/
    │   ├── types.js
    │   ├── monsters.js
    │   ├── moves.js
    │   ├── items.js
    │   ├── trainers.js
    │   ├── quests.js
    │   ├── maps.js
    │   └── story.js
    └── ui/
        └── DialogueBox.js
```

## How to Add Monsters

Monster #130+ requires **no changes to battle/UI code.** Two options:

1. **Add to an existing generated line's pattern** by editing `NAME_ROOTS` in `src/data/monsters.js`
   - each type has 5 two-stage lines; add a 6th pair like `['Newmon', 'Newmonex']` and the generator
   loop will automatically build both stages with computed stats, a learnset, rarity, and habitat.
2. **Hand-author a one-off** (like the 3 legendaries) by pushing a plain object onto `MONSTERS` with
   the same shape: `{ id, name, type: [...], rarity, description, habitat, category, base: {hp,
   attack, defense, speed, specialAttack, specialDefense}, captureRate, xpToLevel, abilities,
   learnset, evolvesTo?, evolvesAtLevel?, evolvesFrom? }`.

Sprites need no work - `SpriteGenerator.ensureMonsterTexture(species)` procedurally builds a shape
colored by the monster's primary type the first time it's battled.

## How to Add Maps

Maps live in `src/data/maps.js` as plain grid data - no tile editor required:

```js
my_new_map: {
  id: 'my_new_map', name: 'My New Map',
  layout: grid([
    '####...####',
    '#....D....#',
    // '.' walkable, ':' tall grass (encounters), '#'/'B'/'~' solid,
    // 'D' door/warp tile, 'H' healing center, 'S' shop, 'G' gym entrance
  ]),
  spawn: { x: 5, y: 1 },
  npcs: [ /* see existing maps for the NPC def shape */ ],
  warps: [ { x: 5, y: 0, toMap: 'other_map', toX: 5, toY: 10 } ],
  encounterTable: [ { speciesName: 'Zephyl', weight: 30, levelRange: [3,5] } ],
  encounterRate: 0.12
}
```

Then add the key to `MAPS` and reference it from a `warps` entry on a neighboring map. `data/story.js`
tracks which chapters/regions are implemented (`true`/`'partial'`/`false`) - update it as you add
regions so the Menu's World Map tab and your own planning stay in sync. The remaining regions listed
in the original design spec (Ironhold City interior, Mountain Pass, Sunridge City, Golden Desert,
Oasis Town, Ancient Ruins, Coastal City, Island Region, Volcanic Region, Skyridge City, Final Region,
Championship) are stubbed as chapter entries in `story.js` with `implemented: false` and are the
natural next maps to build using this same data structure.

## How to Add Moves

Add an entry to `GENERIC_MOVES` or `SIGNATURE_MOVES` in `src/data/moves.js`, or add a 7th template to
`TEMPLATES` to generate a new move for all 12 types at once. IDs are assigned automatically.

## How to Add Quests / Trainers

- **Quests**: add an object to `QUESTS` in `src/data/quests.js` (id, type, chapter, name, description,
  steps, reward). Trigger it from an NPC definition in `maps.js` via `questId`, and call
  `QuestSystem.start(...)` / `QuestSystem.complete(...)` from `WorldScene` where appropriate.
- **Trainers**: generic trainers are generated from a class + level range + species pool via
  `generateGenericTrainer()` in `src/data/trainers.js` - just reference it from an NPC's
  `trainerBattle` field in `maps.js`. Gym Leaders are hand-authored in `GYM_LEADERS` (party, dialogue,
  badge, reward) - add gym9+ the same way and wire a `G`-legend tile plus a gym id lookup in
  `WorldScene._legend()` / `enterGym()`.

## What's Implemented vs. What's a Stub

This build prioritizes a **genuinely playable, fully wired vertical slice** over a wide but broken
surface, per the project brief. Implemented end-to-end:

- Prologue → Chapter 2 story arc: Starting Village (starter choice, rival intro) → Greenmeadow Route
  (wild encounters, a Ranger trainer battle) → Lumina City (shop, healing center, Flame Gym battle
  and badge) → Whisperwood Forest (quest NPC, Eclipse Order grunt battle, wild encounters) →
  Riverdale Town (shop, healing center, Tide Gym entrance) → Mist Cave (wild encounters, a locked-door
  hidden quest hook).
- All core systems (battle, capture, evolution, inventory, quests, save/load, dialogue, menus) are
  fully functional, not mocked.
- All 129 monsters, 102 moves, 8 gym leaders, the rival arc, and the Eclipse Order are fully defined
  in data and battle-ready even though only some of them appear on the currently built maps.

Explicitly **not yet built** (by design, to keep everything above honest and working rather than
padding out broken content - see `data/story.js` for the authoritative list): the remaining ~14
routes/regions from Ironhold City onward, the 20-40 hour full campaign pacing, day/night cycle,
world-map screen beyond a simple discovered/undiscovered list, gamepad input, and post-game content.
Every one of these hooks directly into the data-driven systems already built (a new map is a new
entry in `maps.js`; a new gym is a new entry in `GYM_LEADERS`; new post-game trainers are
`generateGenericTrainer()` calls) - there is no architecture left to invent, only content to add.

## Credits

Designed and implemented as an original work for this project. All names, creatures, locations, and
story elements are original creations, not derived from any existing media property.

## Copyright / Licensing Note

This project intentionally contains **no** copyrighted third-party assets: no Pokémon/Nintendo/Game
Freak names, sprites, tilesets, music, or text of any kind. All visuals are generated at runtime from
geometric primitives; all audio is synthesized with the Web Audio API. The code itself is provided
under the MIT license (see `package.json`).
