# Coop Co v3 — Data & Game Logic Modernization

**Status:** Design proposal (implementation-ready)
**Applies to:** `src/` (Svelte 5 + SvelteKit 2 + Vite 8, static adapter)
**Inputs reviewed:** `Legacy Code Base/Scripts/data.js`, `Legacy Code Base/Scripts/update.js`, `Legacy Code Base/Scripts/main.js`, plus `ascension.js`, `research.js`, `egghandler.js`, `prestige.js`, `contracts.js`, `automation.js`, `achievements.js`, `Internal/Utilities.js`, `Internal/Cache.js`, `Internal/BreakEternity.js`
**Related documents:** `Legacy Code Base/CODE_REVIEW_REPORT.md` (defects), `Legacy Code Base/systems_proposal.md` (content rebalance), `README.md` (v3 goal)
**Stack facts assumed:** Svelte `5.57.1`, `svelte.config.js` forces runes mode for all non-`node_modules` files, `break_eternity.js@2.1.3` from npm, JS (not TS) with `allowJs: true`, `checkJs: false`, `adapter-static` with a `404.html` fallback.

---

## 0. Purpose

This document specifies how **game data** and **game update logic** are organized in v3. It covers the state model, the tick/time model, the persistence model, and the contract between data and Svelte's display layer. It is the implementation contract between the data layer and the UI layer; anyone building a tab or a system should be able to work from it without reading the legacy code.

It does **not** re-litigate content balance (that is `systems_proposal.md`) and it does not repeat the defect catalogue (that is `CODE_REVIEW_REPORT.md`) except where a legacy defect constrains a design decision here — those are cited inline as `BUG #n`.

---

## 1. Requirement Traceability

| # | Requirement (as requested) | Where it is satisfied | Primary mechanism |
|---|---|---|---|
| R1 | Data must be easy to access by components and tabs that need it for display | §5.2, §9 | `$state` class singleton in `$lib/state/game.svelte.js`; import-and-read, no props drilling, no context ceremony |
| R2 | Data must be easy to update and modify | §5.3, §5.5, §7.3 | Named mutator actions (`buyResearch`, `promoteEgg`, `setSetting`) + a systems registry; components never write state fields directly |
| R3 | Update logic must be global and separate from display logic | §6, §7 | Pure, rune-free, DOM-free modules in `$lib/systems/**`, driven by exactly one global loop |
| R4 | Display logic done with `$state` and `$bindable` | §9 | `$state` for reactive values, `$bindable` for tab-local view state, `$derived` for formatting |
| R5 | Data saved to local storage as previously | §8.1–8.3 | Same key family (`coopCo-Revised`), autosave, plus dirty-flag flushing and a versioned envelope |
| R6 | Export/import via a copyable string or a `.txt` file | §8.5 | `exportToString()` / `exportToFile()` (Blob download) / `importFromString()` / `importFromFile()` (`<input type=file>`) |
| R7 | Per-tick updates; review time since last tick; more efficient than `setInterval`; `diff`-like offline math; tolerate inconsistent time rates | §6 (entire section) | `requestAnimationFrame` + fixed-timestep accumulator, monotonic clock, `dt` context object, capped/validated offline resolution, diagnostics overlay |
| R8 | `+page.svelte` runs the functions that need to run (the update loop) | §10 | `onMount` → `loadGame()` + `createLoop().start()`; the returned teardown → `stop()` + final `saveGame()` |

---

## 2. Assessment of the Current State

### 2.1 Legacy `data.js` (187 lines) — the state, save and bootstrap file

| Concern | Legacy implementation | Problem |
|---|---|---|
| State shape | `getDefaultObject()` returns one flat 60-key blob (`data.js:2-76`) | Single mutable global; no ownership; `Decimal` and `number` and `boolean` and `string` intermingled in one object |
| Save | `localStorage.setItem('coopCo', JSON.stringify(data))` (`data.js:83`) | `JSON.stringify` on `Decimal` relies on its `toJSON()`; the save has no version envelope, no checksum |
| Autosave | `setInterval(save, 30000)` (`data.js:153-155`) | Independent of game time; can fire 2× inside one tick or 0× across a long tick; not flushed on tab close |
| Load | `JSON.parse` + `fixSave()` recursive key copy (`data.js:88-124`) | `fixSave` only *adds* keys; removing/renaming silently orphans data; two different merge semantics exist (see next row) |
| Import | `Object.assign(getDefaultObject(), JSON.parse(atob(str)))` (`data.js:149`) | **Shallow** merge; nested `stats`, `harvesters`, `planetData` replaced wholesale. Different semantics from `fixSave` (BUG #9) |
| Export | `btoa(JSON)` + a cloned `<textarea>` + `document.execCommand('copy')` (`data.js:125-136`) | Deprecated API; no file download; no envelope; trivially corruptible |
| Offline | `diff = (Date.now() - data.time) * data.devSpeed / 1000` computed once in `window.onload` (`data.js:160`) | One-shot, uncapped, full-rate; uses wall clock only; no report shown to the player |
| Bootstrap | `window.onload` (`data.js:156-177`) | Mixes load, welcome notification, tab restore, DOM writes and console timing in one global handler |
| Time field | `data.time = Date.now()` set at the *end* of every loop (`main.js:260`) and reused as the save stamp | One field serving two meanings ("last tick" and "saved at"); the moment of truth for offline time is the last tick, not the last save |
| UI coupling | `load()` writes button text (`data.js:104-107`) | Logic file renders UI |

### 2.2 Legacy `update.js` (112 lines) — display logic, entirely

`update.js` is 112 lines of `DOMCacheGetOrSet(...).textContent/.classList/.style` writes, branched on `data.currentTab` (`update.js:38-111`). Its only "logic" decisions are visibility toggles and affordance coloring. Two structural notes:

- It re-writes every button every frame, whether or not anything changed — the reason the legacy loop does hundreds of DOM writes per 60 ms tick.
- The `currentTab` branch means the display layer must know the shape of every tab's data. Under Svelte this file disappears entirely: tab components are mounted by the page, and each reads only what it renders.

### 2.3 Legacy `main.js` (398 lines) — loop, wiring, and three overlapping responsibilities

- **Global mutable state** at module scope: `let diff = 0` (`main.js:1`) plus ~15 more (`prestige.js:1-6`, `egghandler.js:1-4`, `ascension.js:4-7`) that are recomputed every tick in a fixed but implicit order.
- **`mainLoop()`** (`main.js:188-261`): recompute derived boosts → apply economy → stats → achievements → `updateHTML()` → favicon → stamp `data.time`. Logic and rendering are interleaved in one function, and `updateHTML()` is *also* called from inside purchase loops (`research.js:362`, `research.js:376`).
- **`generateHTMLAndHandlers()`** (`main.js:7-186`): 180 lines of `addEventListener` wiring that duplicates what Svelte templates do declaratively.
- **`setInterval(mainLoop, 60)`** (`main.js:396-398`): fires forever, including in hidden tabs; the browser throttles it to ≥1 s there, so the visible frame rate collapses while the *logic* keeps running in coarse chunks.
- **Economy formulas** use the raw `diff`: `data.money += currentEggValue * soulEggBoost * diff * chickens * layRate` (`main.js:220`), chickens `+ chickenGain * diff/15` (`main.js:209`), harvesters `timeRemaining -= diff` (`ascension.js:765`). Because these are linear in `diff`, changing the tick rate does not change the outcome *for those formulas* — but any future `floor`/`ceil` inside them becomes tick-rate dependent, and the countdown-by-subtraction pattern accumulates float error and mis-handles suspension.

### 2.4 The 10 legacy defects that constrain this design

From `CODE_REVIEW_REPORT.md` §2, the ones that are *data-layer* problems (i.e. this document must fix them by construction, not by discipline):

| Bug | Data-layer consequence | Decision here |
|---|---|---|
| #3 | `achievements: new Array(48)` but 53 definitions (`data.js:25`) — array grows on write; completion % divides by a moving length | `achievements` becomes a keyed set whose keys come from `content/achievements.js`; see §5.1, §5.4 |
| #9 | Import uses shallow `Object.assign` while load uses recursive `fixSave` — two merge semantics | One decoder, one schema walk; see §8.2 |
| #2 | `data.stats.bestKnowleggs = data.prophecyEggs` (`main.js:238`) | New `stats` module; field set from `game.knowlegg` |
| #6/#7 | 20 duplicate `currentEggImg` IDs defeated the DOM cache | Svelte templates emit unique nodes; no `getElementById` at runtime at all |
| #8 | `getActiveArtifactBoost` leaks a stale value across loop iterations (`ascension.js:861-889`) | Boost chain is a single pure function of state, no shared accumulators across iterations |
| #10 | Five hand-written resets with different field lists | Data-driven reset definitions; see §7.5 |
| §6 | Export has no version or checksum; save has no envelope | Versioned envelope + checksum; see §8.1 |
| §4.3 | Counts (`28` research, `6` planets, `24` artifacts, `18` gems, `48` achievements) re-asserted by hand in five files | All counts come from `content/**`; magic numbers become fields |

### 2.5 The current v3 scaffold (where this lands)

```text
src/
  lib/scripts/DataManager.js         ← 13-line stub: DefaultDataObject/Load/Save are empty; key 'coopCo-Revised' chosen
  lib/scripts/{EggManager,EggspeditionsManager,Main,Prestige}.js   ← empty (0 bytes)
  routes/+page.svelte                ← 46-line single-route tab switcher; tabIndex is local $state(-1), not yet wired
  routes/{Egg,Research,Prestige,Contracts,Eggspeditions,Ascension,Achievements,Settings}.svelte  ← empty (0 bytes)
  lib/components/Header.svelte (39 lines, static markup) · Newsticker.svelte (25 lines)
  lib/components/{Accordion,AchievementRenderer,ButtonGroup}.svelte  ← empty (0 bytes)
  +layout.svelte                     ← 11 lines: favicon link + global.scss, no game logic
```

`DataManager.js` is the natural ancestor of the new state layer; its three functions map to §5.1 (`createInitialState`), §8.2 (`loadGame`) and §8.3 (`saveGame`). Because the v3 route is a single page that switches tabs, the update loop genuinely belongs in `+page.svelte` (R8) — see §10 for the caveat if routes ever become real routes.

---

## 3. Design Principles

1. **One state object, one owner.** There is exactly one authoritative state instance, created in one module. Everything else receives it.
2. **Logic is pure, UI is reactive.** Systems take `(state, ctx)` and mutate state. They never touch the DOM, never import a `.svelte` file, never call `save()`. Components render and dispatch actions. Nothing in between.
3. **Display is derived, never stored.** Egg value, boosts, costs, counts, percentages are computed from state at read time (`$derived`) or recomputed once per tick into a `derived` record. They are not saved.
4. **Time is an input, not a global.** Every tick receives `dt`. No module reads the clock.
5. **The save is the schema.** A save is a versioned envelope; the same schema produces defaults, validates input, and decodes import.
6. **Deterministic given `(state, dt sequence, seed)`.** Systems are unit-testable in Node with no browser and no DOM.
7. **Fail loud at the boundary, never mid-tick.** Bad save input is rejected with a readable reason before it can touch live state.

---

## 4. Target Architecture

### 4.1 Layers and dependency direction

```text
┌─────────────────────────────────────────────────────────────────┐
│ UI          src/routes/*.svelte, src/lib/components/*.svelte      │
│             $state · $bindable · $derived · format() · dispatch   │
└───────────────▲──────────────────────────────┬──────────────────┘
                │ reads game.*, d.*           │ calls actions()    │
┌───────────────┴──────────────────────────────▼──────────────────┐
│ STATE       src/lib/state/*                                      │
│   game.svelte.js     the $state singleton + accessors + applyState│
│   schema.js          createInitialState(), SAVE_VERSION, limits   │
│   actions.js         player-facing mutators (buy, promote, …)     │
│   runtime.svelte.js  tickFrame(): the one composed tick entry point│
│   derived.svelte.js  change-gated reactive mirror of the boosts   │
│   selectors.js       pure compound reads for display (pure)       │
│   persistence.svelte.js  serialize/deserialize/save/export/import │
│   ui.svelte.js       view state (tab, buy amount, selection)      │
│   runtime.svelte.js  tickFrame(): loop + offline + console        │
└───────────────▲──────────────────────────────────────────────────┘
                │ imported by (read + mutate)                      │
┌───────────────┴──────────────────────────────────────────────────┐
│ SYSTEMS     src/lib/systems/**            RUNE-FREE · DOM-FREE    │
│   tick.js (runSystems + order) · economy · research · eggs ·       │
│   contracts · planets · ascension · automation · achievements ·   │
│   timers · offline · stats · resets                               │
└───────────────▲──────────────────────────────────────────────────┘
                 │ driven by loop, via state/runtime.svelte.js     │
┌───────────────┴──────────────────────────────────────────────────┐
│ LOOP        src/lib/loop/loop.js   rAF · fixed step · visibility  │
│ CORE        src/lib/core/*  clock.js · rng.js · events.js ·       │
│                            decimal.js · format.js                 │
│ CONTENT     src/lib/content/**  eggs · research · planets ·       │
│                            artifacts · gems · achievements ·      │
│                            contracts · news · balance             │
└─────────────────────────────────────────────────────────────────┘
```

**Dependency rules (enforceable, checked in review):**

- `content/**` and `core/**` import nothing from `state/**`, `systems/**`, `routes/**`.
- `systems/**` may import `core/**` and `content/**` and read/mutate the passed state object. It must not import any `.svelte` file or any `state/game.svelte.js` (it receives state as a parameter — this is what makes it testable).
- `state/**` may import `core/**`, `content/**`, `systems/**`. It is the only place allowed to own the singleton.
- `routes/**` and `components/**` may import `state/**`, `core/format.js`, `content/**`. They may not import `loop/**`.

### 4.2 File tree

```text
src/lib/
  core/
    clock.js                monotonic + wall clock, elapsed resolution, time reports
    rng.js                  seeded PRNG (mulberry32) + helpers
    events.js               typed publish/subscribe bus with a per-tick drain queue
    decimal.js              D(), DEC_ZERO/DEC_ONE, safe add/sub/gt helpers, equality guard
    format.js               format(), formatTime(), formatPrefix(), notate()  (pure)
  content/
    eggs.js research.js planets.js artifacts.js gems.js achievements.js
    contracts.js news.js balance.js          ← all balance numbers live here
  state/
    schema.js               SAVE_VERSION, createInitialState(), LIMITS, field groups
    game.svelte.js          GameState class ($state fields) + singleton + applyState
    derived.svelte.js       change-gated $state mirror of recomputeDerived() → d.soulEggGain, d.eggValue, …
    runtime.svelte.js       tickFrame(game, ctx) + resolveIdle(): the composed entry points (loop, offline, console)
    actions.js              buyResearch, buyEpicResearch, promoteEgg, prestige, ascend, setSetting, …
    selectors.js            pure compound reads for display (progress, statuses, rows)
    ui.svelte.js            view state: activeTab, sub tabs, buy amount, selection, toasts, clockSecond, diag
    persistence.svelte.js   serialize/deserialize/checksum/localStorage/export/import; loadGame() → { report, rng }
    legacy/v2.js            one-time converter for the old `coopCo` flat blob
  systems/
    tick.js                 SYSTEMS registry + order; pure `runSystems(state, ctx)`
    derived.js              recomputeDerived(game) — the whole boost chain as one pure function
    timers.js  economy.js  research.js  eggs.js  contracts.js  planets.js
    ascension.js  automation.js  achievements.js  stats.js  offline.js  resets.js
  loop/
    loop.js                 createLoop(): rAF driver, accumulator, visibility, catch-up budget, diagnostics
```

### 4.3 Why `.svelte.js`

`svelte.config.js` forces runes mode for all non-`node_modules` files, and Svelte 5 compiles `.svelte.js` / `.svelte.ts` modules with rune support. Only files that use runes carry the extension:

- `state/*.svelte.js`, `loop`-adjacent stateful modules → `.svelte.js`
- `core/**`, `content/**`, `systems/**` → plain `.js`, importable by Vitest in Node with no Svelte transform

This split is the single most important structural decision in the document: it makes the entire game logic runnable under `vitest` with zero Svelte involvement. If the project later moves to TypeScript, these become `.svelte.ts` / `.ts` with no other change (the `.tsconfig` already has `allowJs`, and `jsconfig.json` can be renamed without touching source).

---

## 5. The State Layer

### 5.1 The state object

One object, three named regions. Regions exist for readability and for reset definitions (§7.5), not for storage separation.

```js
// src/lib/state/schema.js
export const SAVE_VERSION = 3;              // schema version of the save payload
export const GAME_VERSION  = '3.0.0';      // app version shown in Settings

export function createInitialState() {
  return {
    meta: {
      schemaVersion: SAVE_VERSION,
      savedAt: 0,          // wall-clock ms of the last successful save (offline math input)
      gameTime: 0,         // total GAME seconds elapsed since the save was created (see §6.5)
      seed: (Math.random() * 2 ** 31) | 0,
      lastOfflineReport: null,
    },

    // --- region: playfield (cleared by egg promotion / contract exit / journey) ---
    play: {
      money: D(0), bestRunMoney: D(0), chickens: D(0),
      currentEggId: 'regular',          // string id into content/eggs.js (was magic index `currentEgg`)
      onPlanet: false, currentPlanetId: null,
      contractSlots: [null, null, null],// slot i → { id, state, goal, reward } or null
    },

    // --- region: currencies (persist across playfield resets) ---
    econ: {
      soulEggs: D(0), bestSoulEggs: D(0),
      prophecyEggs: D(0),
      knowlegg: D(0), bestKnowlegg: D(0),
      hasPrestiged: false, hasAscended: false,
    },

    // --- region: progression ---
    prog: {
      unlockedEggIds: ['regular'],        // ids, not booleans in a fixed-length array
      unlockedPlanetIds: [],
      discoveries: 0,
      research: {},                       // { [researchId]: Decimal level }
      epicResearch: {},
      legendaryResearch: {},
      autoActive: { common1: false, common2: false, common3: false, promote: false, epic: false },
      achievements: {},                   // { [achievementId]: true } — key set, no length bug possible
      artifacts: {},                      // { [artifactId]: Decimal count }
      gems: {},                           // { [gemId]: Decimal count }
      activeArtifacts: [null, null, null, null],
      activeGems: new Array(12).fill(null),
      loadoutIndex: 0, loadouts: [ … 3 × { artifactIds:[4], gemIds:[12] } ],
      harvesters: Object.fromEntries(content.planets.map(p => [p.id, { level: 0, endsAtGameTime: 0, running: false }])),
      planetData: {},                     // { [planetId]: { money, chickens, research } }
    },

    stats: { /* see §5.4 */ },
    settings: { /* see §5.4 */ },
    ui: { /* see §5.4 — view state, still saved */ },
  };
}
```

Key moves, each traceable to a legacy problem:

- `data.currentEgg: 0..18` → `currentEggId: 'regular' | 'superfood' | …` (content id). Removes the `currentPlanetIndex === 18` class of bug (BUG #1: a planet index compared against an egg count) and makes content reorderable.
- `research: number[28]` → `research: { [id]: Decimal }`. Removes the "add one research, five resets break" fragility (report §4.3) and makes resets content-driven. Trade-off: a lookup per access instead of an index; mitigated by the single derived recompute (§5.5), not by micro-optimizing.
- `achievements: boolean[48]` → `achievements: { [id]: true }`. BUG #3 becomes structurally impossible; completion % becomes `Object.keys(game.prog.achievements).length / ACHIEVEMENTS.length`.
- `unlockedArtifact[]` + `artifacts[]` (duplicated truth) → derive "unlocked" from `count > 0`, or keep a `discoveredAt` timestamp when a "seen but zero" state is needed. Decision recorded in §12.
- `data.time` (dual meaning) → `meta.savedAt` (wall) + `meta.gameTime` (game seconds) + loop-local monotonic (§6).
- `data.stats.bestEgg: ''` (string) → `stats.bestEggId: 'regular'`, formatted at display time.

### 5.2 How components read data (R1)

**Rule: import the singleton and read it in the template. No props drilling, no store subscriptions, no getters to memorize.**

```svelte
<!-- src/lib/components/Header.svelte -->
<script>
  import { game }      from '$lib/state/game.svelte.js';
  import { d }         from '$lib/state/derived.svelte.js';
  import { format }    from '$lib/core/format.js';
  import { promoteEgg, prestigeGain } from '$lib/state/actions.js';
</script>

<div class="header">
  <img src="/Images/Eggs/{game.play.currentEggId}.png" alt="Current egg" />
  <h2>${format(game.play.money)}</h2>
  <p>Chickens: {format(game.play.chickens)}</p>
  <p>Soul Eggs: {format(game.econ.soulEggs)}</p>
  <button onclick={promoteEgg} disabled={!d.canPromote}>Promote</button>
</div>
```

Because `game` is a `$state` object, `game.play.money` is tracked at the *property* level: a money tick re-renders only the components whose templates read `money`, not the whole page. This is the direct replacement for `update.js`'s full-tree rewrite.

**Access patterns, in priority order:**

1. **Direct read** — `game.play.money` in a template or a `$derived`. Default choice.
2. **Derived read** — `d.soulEggGain`, `d.eggValue`, `d.canAfford(...)`. For anything computed from many fields.
3. **`$derived` local** — `const cost = $derived(computeCost(i))` when the value is display-only and expensive enough to matter.
4. **`$bindable` prop** — for view state the parent owns (§9.2).
5. **Selector helper** — `selectEggProgress(game)` for a component that needs a compound value. Selectors are pure functions of `game`, unit-testable, and the natural place to format.

**Rules that keep this from breaking:**

- **Never destructure the state.** `const { money } = game` snapshots a value and loses reactivity. Always read `game.play.money` at the point of use, or wrap in `$derived`.
- **Never pass a `Decimal` to a child as a prop and expect the parent to observe changes.** Pass the id and let the child read `game`, or pass a `$derived` string.
- **Reactivity rules for `Decimal`.** Svelte's `$state` proxy wraps plain objects and arrays; class instances such as `break_eternity`'s `Decimal` are stored as-is and are *not* deeply proxied. Consequences:
  - `game.play.money.add(x)` (in-place mutation) will **not** notify anything.
  - `game.play.money = game.play.money.add(x)` (assignment) will.
  - Therefore: **always assign; never mutate a `Decimal` in place.** This is the single most important convention in the state layer and it is enforced by a lint rule (§12) and a unit test that fails if a tick produces a state where an object identity was mutated rather than replaced.
  - Cost of assignment: `Decimal` allocation per write. At ~6 numeric writes per tick and 60 ticks/s this is negligible and was already the legacy pattern (`data.money = data.money.add(...)`).

### 5.3 How data is updated (R2)

Three sanctioned entry points, in order of preference:

1. **Actions** (`state/actions.js`) for anything a player or automation can trigger. They validate, mutate, and may emit events:

   ```js
   export function buyResearch(id, amount = ui.buy.common) {
     const def  = RESEARCH[id];
     const lvl  = game.prog.research[id] ?? D(0);
     if (!def || lvl.gte(def.maxLevel)) return false;
     const cost = commonResearchCost(def, lvl, amount);   // shared with the display, from the same function
     if (game.play.money.lt(cost)) return false;
     game.play.money = game.play.money.sub(cost);         // assign, never mutate
     game.prog.research[id] = lvl.add(amount === 'max' ? maxAffordable(def, lvl, cost) : amount);
     events.emit('research:bought', { id, amount });
     markDirty();
     return true;
   }
   ```

2. **Systems** (`systems/**`) for per-tick progression. Same mutation rules, no validation ceremony, but they must not emit UI-only concerns.
3. **`applyState(next)`** for wholesale replacement (load, import, reset). The only code path allowed to write many fields at once.

**Anti-patterns to reject in review:** a component writing `game.play.money = game.play.money.add(1)` inline (that's the legacy Egg tab's `mainButton`, `main.js:15` — it must become an action so it can also emit an event and mark dirty); any `game.x.y = …` outside `actions.js`, `systems/**` or `applyState`.

### 5.4 Field reference (legacy → v3)

| Legacy field (`data.js`) | v3 location | Type | Notes |
|---|---|---|---|
| `money`, `bestRunMoney`, `chickens` | `play.*` | `Decimal` | assign-only |
| `soulEggs`, `bestSoulEggs`, `prophecyEggs`, `knowlegg`, `bestKnowlegg` | `econ.*` | `Decimal` | `bestKnowlegg` is the field legacy wrote from the wrong source (BUG #2) |
| `hasPrestiged`, `hasAscended` | `econ.*` | `bool` | gate flags for tab visibility |
| `currentEgg` (0–18) | `play.currentEggId` | `id string` | content lookup |
| `onPlanet`, `currentPlanetIndex` (0–5) | `play.onPlanet`, `play.currentPlanetId` | `bool`, `id string\|null` | kills BUG #1's index confusion |
| `contracts[3]{id,goal,reward}` | `play.contractSlots[3]` | `ContractState\|null` | one object per slot; `null` = empty |
| `contractActive[3]` | folded into `contractSlots[i].state` | enum | `idle\|active\|complete`; the legacy two-array split could disagree |
| `unlockedContracts`, `generatedContracts` | derived from `unlockedEggIds` / `contractSlots` | — | remove flags that duplicate state |
| `unlockedEgg[18]` | `prog.unlockedEggIds` | `id[]` | id list, not fixed-length bool array |
| `unlockedEgg[3]` gate for Eggspeditions tab | `prog.unlockedEggIds.includes('rocketfuel')` | — | replaces the magic index in `update.js:37` |
| `research[28]`, `epicResearch[11]`, `legendaryResearch[6]` | `prog.*` | `{id: Decimal}` | keyed by content id |
| `autoActive[5]` | `prog.autoActive` | named booleans | `automation.js` `runAuto` switch becomes a registry |
| `planetsDiscovered[6]`, `discoveries` | `prog.unlockedPlanetIds`, `prog.discoveries` | `id[]`, `number` | |
| `planetData[6]{money,chickens,research[28]}` | `prog.planetData` | `{[planeId]: {...}}` | nested research keyed by id |
| `achievements[48]` (53 defs) | `prog.achievements` | `{[id]: true}` | BUG #3 fixed structurally |
| `artifacts[24]`, `gems[18]`, `unlockedArtifact[24]`, `unlockedGem[18]` | `prog.artifacts`, `prog.gems` | `{[id]: Decimal}` | unlock derived from count; see §12 |
| `activeArtifacts[4]`, `activeGems[12]` | `prog.activeArtifacts`, `prog.activeGems` | `(id\|null)[]` | `-1` sentinel → `null` |
| `artifactLoadouts[3]`, `currentLoadout` | `prog.loadouts`, `prog.loadoutIndex` | object, number | |
| `harvesters[6]{level,timeRemaining,running}` | `prog.harvesters` | `{[planeId]: {level, endsAtGameTime, running}}` | countdown → **absolute game-time deadline**, kills `timeRemaining -= diff` drift (`ascension.js:765`) |
| `stats.*` (14 fields) | `stats.*` | mixed | `bestEgg` → `bestEggId`; add `lifetimeEarnings` (needed by `systems_proposal` ID 74) |
| `buyAmounts[3]` (indices into `BUY_AMOUNT_LABELS`) | `ui.buy.{common,epic,legendary}` | `1\|5\|10\|20\|'max'` | actual amounts, not array indices |
| `currentTab`, `currentSubTab[3]` | `ui.activeTab`, `ui.activeSubTab` | `number[]` | restored at boot (§10) |
| `settingsToggles[7]` (magic indices) | `settings.*` named | `bool\|enum` | see below |
| `currentUpdate: 'v2.0.3'` | `meta.schemaVersion` + `GAME_VERSION` | number, string | save format version ≠ app version |
| `devSpeed` | `settings.timeScale` | `number` | 1 = realtime; also multiplies the accumulator (§6.3) |
| `time: Date.now()` | `meta.savedAt`, `meta.gameTime` | `number`, `number` | split meanings |

`settingsToggles` deserves its own note: seven booleans with display-dependent index meanings (`update.js:57-63`, `main.js:146-156`) are the stringly-typed smell. v3 uses named keys, so adding a setting is a one-line change that no consumer has to index around:

```js
settings: {
  notation: 'mixed',                  // 'mixed' | 'sci'   (was settingsToggles[0])
  newsticker: true,                   // was [1]
  contractNotifications: true,        // was [2]
  autoPromoteStopAt: 'enlightenment', // was [3]: a bool whose meaning depended on its index
  prestigeConfirm: true,              // was [4]
  ascensionConfirm: true,            // was [5]
  harvesterNotifications: true,       // was [6]
  offlineCapHours: 12,                // new, §6.5
  offlineRate: 0.5,                   // new, §6.5
  timeScale: 1,                       // was data.devSpeed
}
```

`migrateSettingsToggles(arr)` maps the legacy array for old saves, index by index, once.

### 5.5 Derived state (boosts) — the ~20 legacy globals

The legacy derived values (`eggValueBonus`, `chickenGain`, `layRate`, `soulEggGain`, `soulEggBoost`, `prophecyEggBoost`, `contractRewardBoost`, `contractGoalBoost`, `knowleggBoost`, `harvesterMaxLevel`, `planetBoosts[6]`, `currentEggValue`, `harvesterUpgradeCosts[6]`, research cost arrays) are module-level mutable globals recomputed in an implicit order. v3 replaces them with **one pure function** of the state:

```js
// src/lib/systems/derived.js — pure, no runes, no DOM
export function recomputeDerived(game) {
  const d = {};
  d.eggValue = eggValueFor(game);            // base × research × artifacts × gems × planet boost
  d.eggValueBonus = d.eggValue.div(EGGS[game.play.currentEggId].value);
  d.layRate = ...;                            // replaces egghandler.js:225
  d.chickenGainPerSec = ...;                  // replaces egghandler.js:210 (was /15, /60 by planet)
  d.moneyPerSec = ...;                        // the main.js:220 formula, written once
  d.soulEggGain = ...;                        // replaces prestige.js:8
  d.soulEggBoost = ...; d.prophecyEggBoost = ...; d.knowleggBoost = ...;
  d.contractRewardBoost = ...; d.contractGoalBoost = ...;
  d.planetBoosts = ...; d.harvesterMaxLevel = ...;
  return d;
}
```

Two properties matter:

- **Single source of truth for the formula.** Legacy recomputed research cost in three places that must agree (report §5). Here, `commonResearchCost()` is imported by both `buyResearch()` and the component that renders the cost.
- **Write-back is change-gated**, because this record is read by nearly every component and a blind `Object.assign(d, next)` every tick would re-render the page:

```js
// src/lib/state/derived.svelte.js
let cached = recomputeDerived(game);
export const d = $state({ ...cached });          // reactive surface for components

export function refreshDerived(next = recomputeDerived(game)) {
  for (const k of KEYS) {
    const a = cached[k], b = next[k];
    if (decimalEq(a, b)) continue;                // Decimals compare with .eq, plain numbers with !==
    cached[k] = b; d[k] = b;
  }
}
```

`refreshDerived()` is called once per tick by `state/runtime.svelte.js` **before** the systems run, so systems read the same numbers the UI shows. The default argument is what makes the two call sites safe: `tickFrame` passes the record it already computed for `runSystems`' benefit, while `resolveIdle` (§6.5) recomputes once at the end. `d` is deliberately *not* saved.

**Alternative considered and rejected:** computing `d` as one big `$derived.by(() => recomputeDerived(game))`. It is less code and the compiler memoizes it, but it (a) makes the boost chain depend on Svelte's reactivity for correctness, (b) recomputes when *any* read field changes — including `money`, which changes every tick — and (c) cannot be exercised in a plain Vitest unit test without Svelte. The explicit `recomputeDerived` + change-gated mirror keeps logic testable and render churn bounded.

### 5.6 Selectors (optional, for compound display values)

```js
// src/lib/state/selectors.js — pure functions of (game, d)
export const eggProgress = (game) => { /* { discoverPct, unlockPct, canPromote, requirementLabel } */ };
export const harvesterStatus = (game, d, now) => { /* { label, running, ready, endsAt } */ };
```

Selectors are the documented home for anything that turns raw state into a label, a percentage or a progress bar. They replace `updateEggPage()`'s inline progress math (`update.js:14-22`) and every `update*HoverText` function.

---

## 6. Time & Tick Model (R7)

This section is the largest behavioral change and deserves to be specified precisely.

### 6.1 What "diff" becomes

Legacy:

```js
diff = (Date.now() - data.time) * data.devSpeed / 1000   // main.js:189, seconds
```

v3: `diff` no longer exists as a global. Every system receives it as part of an immutable context:

```js
export const tickFrame = (game, ctx) => { … };   // ctx = Object.freeze({
//   dt,          // game seconds elapsed since the previous tick (fixed step, or offline chunk)
//   realDt,      // real seconds elapsed since the previous tick
//   source,      // 'frame' | 'catchup' | 'idle' | 'offline'
//   nowGame,     // game.meta.gameTime after this tick (added by runSystems itself)
//   nowWall,     // Date.now() at the start of the tick
//   rng,         // seeded PRNG function
//   events,      // event bus (drained after the tick)
// })
```

`dt` is always **game seconds**. `realDt` is always **real seconds**. Keeping both is what allows an honest "you were away for 6h 12m real time, which granted 3h 6m of game progress at 50% offline efficiency" report.

### 6.2 Clock abstraction (`core/clock.js`)

```js
export function createClock({ nowMonotonic = () => performance.now(),
                             nowWall      = () => Date.now() } = {}) {
  let lastTickPerf = nowMonotonic(), lastTickWall = nowWall();
  return {
    nowMonotonic, nowWall,
    /** ms of real time since the last tick, using the monotonic clock. */
    sinceLastTickMs: () => nowMonotonic() - lastTickPerf,
    /** epoch ms that the last tick happened, reconstructed from the monotonic clock. */
    wallAtLastTick: () => lastTickWall + (nowMonotonic() - lastTickPerf),
    markTick() { lastTickPerf = nowMonotonic(); lastTickWall = nowWall(); },
    reset()    { lastTickPerf = nowMonotonic(); lastTickWall = nowWall(); },
  };
}
```

Why two clocks:

- **`performance.now()` (monotonic) for anything inside one page session.** It cannot jump when the OS clock is corrected, when the user edits the date, or across a DST boundary. A `Date.now()`-based `diff` goes negative for one tick when the clock steps back (DST, an NTP correction, a manual change), and the legacy loop would subtract chickens for that tick (`main.js:209`, `main.js:220`).
- **`Date.now()` (wall) only for across-restart math**, because it is the only clock that survives a reload. It is used exactly twice: `meta.savedAt` on save, and elapsed-offline on load.

Both are injectable, so a test can drive the loop with a fake clock and assert exact production totals (`tick(600)` twice vs `tick(1200)` once must agree).

### 6.3 The loop (`loop/loop.js`)

```js
const FIXED_STEP        = 1 / 60;   // logic tick, seconds
const MAX_FRAME         = 0.25;    // a frame longer than this is not simulated at all
const MAX_CATCHUP_STEPS = 15;      // = MAX_FRAME / FIXED_STEP, so a fully clamped frame is still simulated
const IDLE_THRESHOLD    = 2;       // no frames for 2s ⇒ treated as "idle", not as a huge dt

export function createLoop({ game, clock, tick, onIdle, onSecond }) {
  let raf = 0, last = clock.nowMonotonic(), acc = 0, running = false, lastSecondAt = last;
  const live = { lastDt: 0, lastRealDt: 0, steps: 0, droppedMs: 0, sinceLastTickMs: 0, source: 'frame' };

  function frame(t) {
    if (!running) return;
    const rawDt  = (t - last) / 1000;                  // unclamped, for diagnostics
    const realDt = Math.min(rawDt, MAX_FRAME);
    last = t;

    if (rawDt > IDLE_THRESHOLD) {
      // frames stopped (hidden tab, device sleep, debugger pause) → never simulate it in one step
      onIdle({ wallAtLastTick: clock.wallAtLastTick(), rawDt });   // → resolveIdle, full rate (§6.5)
      acc = 0;
      live.source = 'idle';
    } else {
      acc += realDt * game.settings.timeScale;          // timeScale scales step COUNT, never step size
      let steps = 0;
      while (acc >= FIXED_STEP && steps < MAX_CATCHUP_STEPS) { tick({ dt: FIXED_STEP, realDt, source: steps ? 'catchup' : 'frame' }); acc -= FIXED_STEP; steps++; }
      if (acc >= FIXED_STEP) { live.droppedMs = acc * 1000; acc = 0; }   // overloaded: shed, count, continue
      live.steps = steps;
      live.source = steps > 1 ? 'catchup' : 'frame';
    }
    live.lastDt = realDt; live.lastRealDt = rawDt; live.sinceLastTickMs = rawDt * 1000;

    clock.markTick();
    if (t - lastSecondAt >= 1000) { lastSecondAt = t; onSecond(live); }  // 1 Hz: ui clock + dirty-flag autosave (§8.3) + diag
    raf = requestAnimationFrame(frame);
  }
  …
}
```

The loop owns **no** game knowledge: it never writes to `state`, never knows what a system is, and never saves. `tick` is whatever the caller injects (the composed `tickFrame` in production, a bare `runSystems` in a headless benchmark), and the three callbacks keep every side effect — autosave, offline report, diagnostics — in `+page.svelte`, where they can be seen and stubbed. `game` is passed only to read `settings.timeScale` and for the idle path's convenience; a loop that must not scale could take `timeScale: () => 1`.

**Why the diagnostics snapshot is published at 1 Hz:** `live` is a plain object updated every frame (zero reactivity cost), and it is mirrored into a `$state` record **once per second** for the Settings panel. Publishing per frame would re-render the diagnostics table 60×/s for numbers a human cannot read; `clock.sinceLastTickMs()` is still exact on demand for tests and the console. `onSecond` is also where the dirty-flag autosave check belongs (§8.3) — one timer in one place, instead of the legacy's separate 30 s `setInterval` and 60 ms `setInterval`.

Properties this buys, each answering something specific in the request:

| Concern | How it is handled |
|---|---|
| **More efficient than `setInterval`** | `requestAnimationFrame` is synchronized to the compositor and to `vsync`, so no work happens when the page cannot present a frame; `setInterval(60ms)` fires ~1,000 times per minute regardless of frame budget, and the legacy loop did hundreds of DOM writes on every one of them. |
| **Similar `diff` system** | `ctx.dt` is the same quantity as legacy `diff`, just passed explicitly instead of read from a global, and now in a fixed unit (seconds) that systems can rely on. |
| **Review time since last tick** | `ui.diag.sinceLastTickMs` (and `clock.sinceLastTickMs()`) is live state, surfaced in a Diagnostics panel (§6.6) and on `window.__coop.clock`. |
| **Frame spikes / overload** | A frame longer than `MAX_FRAME` (250 ms) is not simulated at all; anything above that is routed to the offline path. Between 16.7 ms and 250 ms the accumulator replays it as up to 15 fixed steps, so no simulated time is lost to a one-off hitch. Beyond the step budget, time is shed and counted in `droppedMs` rather than triggering a spiral of death. |
| **Deterministic production** | Fixed 1/60 step means the same number of additions per second regardless of frame rate, so a 30 fps device produces the same money as a 144 fps device (legacy produced slightly different totals because it integrated in variable chunks — harmless for linear formulas, a real hazard once any `floor` is introduced). |
| **`devSpeed` / time scale** | `acc += realDt * settings.timeScale`: a 1000× dev speed runs more logic steps per frame, not bigger steps, so all formulas keep their meaning. The step cap prevents 1000× from melting the tab; the shed time is reported. |

**Why a fixed step instead of `tick(realDt)` directly?** Three reasons: (1) reproducibility in tests; (2) immunity to a frame spike delivering a 4-second `dt` into a formula that also handles an event on that tick; (3) a single place to enforce the catch-up budget. The cost is that on a 30 Hz display we do 2 ticks per frame, which is cheaper than the legacy alternative (a full-tree DOM rewrite at 16 Hz).

### 6.4 Visibility, suspension and background tabs

```js
// mounted from +page.svelte; the loop's own onIdle (§6.3) covers the case where the
// page was frozen rather than hidden, so this handler is the *fast* path
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { flushSave(); stop(); }
  else { clock.reset(); onIdle({ wallAtLastTick: clock.wallAtLastTick(), rawDt: 0 }); start(); }   // §6.5
});
window.addEventListener('pagehide',     () => { flushSave(); stop(); });
window.addEventListener('freeze',      () => { flushSave(); stop(); });  // page lifecycle API
```

- While hidden, `rAF` does not fire, so nothing needs to be torn down beyond the loop; but the *save* must be flushed, because a hidden tab can be discarded without `pagehide` firing.
- On becoming visible again, elapsed time is resolved by the **wall** clock (§6.5), not by the monotonic clock, because the monotonic clock keeps counting across a freeze — either is defensible; wall clock is chosen so the value matches what the player sees on their phone, and so the two agree with the offline calculation after a reload. `clock.wallAtLastTick()` is captured *before* the flush, so the flushed save's `savedAt` and the reported gap are the same instant.
- `rawDt: 0` is passed because the wall gap is already known; the loop supplies its own measured `rawDt` on the frames that follow. Both paths converge on `resolveIdle` (§6.5), so there is still exactly one grant implementation.
- A background tab on mobile can be frozen for hours with no events at all. `meta.savedAt` plus the load-time calculation is what actually pays out offline progress; the visibility path is just the fast path.

### 6.5 Offline time resolution (`systems/offline.js`)

The legacy behavior is `diff = (Date.now() - data.time) * devSpeed / 1000`, applied once at load, uncapped, at full rate (`data.js:160`). v3 replaces it with an explicit, inspectable, validated resolution:

```js
export function resolveElapsed(rawSeconds, { capHours, rate }) {
  const out = { requested: rawSeconds, seconds: 0, rate, capped: false, hardCapped: false, source: 'offline', rejected: null };
  if (!Number.isFinite(rawSeconds))  { out.rejected = 'non-finite'; return out; }
  if (rawSeconds < 0)                { out.rejected = 'clock-went-backwards'; rawSeconds = 0; }
  if (rawSeconds > HARD_MAX_SECONDS) { out.rejected = 'beyond-hard-max'; rawSeconds = HARD_MAX_SECONDS; out.hardCapped = true; }
  const cap = capHours * 3600;
  out.capped = rawSeconds > cap;
  out.seconds = Math.min(rawSeconds, cap) * rate;
  return out;
}
```

`HARD_MAX_SECONDS` (30 days) is a sanity bound, not a balance knob — beyond it the answer is "your clock is wrong", and granting 30 days of production from one calculation would be an economy break. Defaults are `capHours = settings.offlineCapHours` (12) and `rate = settings.offlineRate` (0.5), per `systems_proposal` §2.2, but the function takes them as numbers so the caller decides. The returned object separates `capped` (soft cap from settings, a normal, expected outcome) from `hardCapped`/`rejected` (abnormal, worth telling the player about), and the report renders all of them, so the behavior is reviewable rather than silent.

**Applying the resolved time.** Pure-linear producers (money, chickens) can be advanced in closed form — `money += moneyPerSec * seconds` — because the rates are constant across the offline window *unless* a discrete event (harvester finished, contract completed, promotion, prestige) happened. Discreteness is why the recommendation is a **coarse simulation**:

```js
export function applyOffline(game, resolved) {
  const CHUNK = 60;                                   // 1 game-minute
  const maxChunks = 24 * 60;                           // 24 h of chunks; beyond that, closed form
  if (resolved.seconds > maxChunks * CHUNK) { …closed-form fast path for the remainder… }
  let remaining = resolved.seconds, elapsed = 0, chunks = 0;
  const report = createOfflineReport();
  while (remaining > 0 && chunks < maxChunks) {
    const dt = Math.min(CHUNK, remaining);
    runSystems(game, { dt, source: 'offline', events, rng });   // same code path as a live tick
    report.absorb(events.drain());
    remaining -= dt; elapsed += dt; chunks++;
  }
  return report;                                        // → meta.lastOfflineReport → OfflineReport modal
}
```

Key property: **the offline path calls the same systems, in the same order, with the same code as a live tick.** There is no second implementation of the economy to drift out of sync. The chunk size (60 s) is chosen so harvesters (5 s × level) and contracts resolve with ≤60 s granularity of error, and so 12 h of offline costs 720 iterations — under a millisecond.

**One entry point for granting elapsed time.** Both the load path and the loop's idle path go through a single runtime function, so "how much time was granted, at what rate" is answered in one place:

```js
// state/runtime.svelte.js
export function resolveIdle(game, { rawSeconds, wallAtLastTick, clock, rng, events, capHours, rate }) {
  const resolved = resolveElapsed(rawSeconds, { capHours, rate });
  if (resolved.seconds === 0) { if (resolved.rejected) events.emit('timeAnomaly', resolved); return null; }

  const report = applyOffline(game, resolved);          // chunked runSystems, 60 s steps
  refreshDerived();
  game.meta.lastSeenWall = wallAtLastTick ?? clock.nowWall();
  game.meta.dirty = true;
  events.emit('timeResolved', resolved);
  return report;                                        // → OfflineReportModal (§9.3)
}
```

**The two callers differ only in their cap and rate** — that is the whole policy surface:

| Caller | `rawSeconds` | `capHours` | `rate` | Why |
|---|---|---|---|---|
| `loadGame()` | `nowWall − meta.savedAt` | `settings.offlineCapHours` (12) | `settings.offlineRate` (0.5) | A closed game: the player is owed offline credit, capped and discounted by design |
| loop `onIdle` (§6.3) | the measured `rawDt` | `HARD_MAX_SECONDS / 3600` (720) | `1` | A live session whose frames stopped (frozen tab, sleep, debugger). Punishing a player at 50% for backgrounding the tab they are playing in would be a bug, not a feature — only the 30-day sanity bound applies |

The report (a modal, per the review's "unified modal manager") shows: real time away, game time granted, rate applied, cap applied, money and chickens gained, harvesters finished, contracts progressed, and any anomalies from `resolveElapsed`.

### 6.6 Inconsistent time rates — the complete list and the handling

| Situation | Detection | Handling |
|---|---|---|
| User/system changes the clock, or DST shift | `wallDelta < 0`, or `wallDelta` diverging from monotonic delta | Intra-session always monotonic → invisible. Across restart: negative → 0 + `rejected: 'clock-went-backwards'`; excessive → hard cap + warning in the report |
| Laptop sleeps / tab frozen with no events | `rawDt > IDLE_THRESHOLD` at the next frame, or the load-time `savedAt` gap | Routed to `resolveIdle`, not simulated in one step — at full rate for an in-session gap, at the settings rate across a restart (§6.5) |
| Hidden tab, throttled timers | `document.hidden` | `rAF` is already paused; explicit stop + save + resume-with-resolution |
| Device is slow / debugger pause / GC hitch | `rawDt > MAX_FRAME` (250 ms), or `steps === MAX_CATCHUP_STEPS` | Frames over 250 ms go to the offline path; sub-250 ms hitches are replayed as fixed steps; anything past the step budget is shed and counted in `droppedMs`, and surfaced in diagnostics |
| `devSpeed` ≠ 1 | `settings.timeScale` | Scales the accumulator (more steps), never the step size; step cap prevents melt-down |
| Frame rate below the fixed step (30 Hz display, 120 Hz display) | none needed | The accumulator absorbs it: 2 steps per 30 Hz frame, fewer at 120 Hz; production totals are identical |
| Player edits `meta.gameTime` via console/import | `applyState` validation | `gameTime` must be finite, non-negative, and within `[savedAt − HARD_MAX, now + 60]`; violations are rejected with a reason, not clamped silently |

**Diagnostics surface (answers "be able to review how much time has passed"):** a Diagnostics section in Settings, reading `ui.diag` and `clock`:

| Field | Meaning |
|---|---|
| `sinceLastTickMs` | Real ms since the previous logic tick (the modern `diff`) |
| `lastDt` / `lastRealDt` | Simulated vs raw frame seconds for the last frame |
| `steps` | Logic steps executed in the last frame (vs the `MAX_CATCHUP_STEPS` budget of 15) |
| `droppedMs` | Simulated time shed due to the step cap in the last frame |
| `source` | `'frame' \| 'catchup' \| 'idle' \| 'offline'` — which path produced the last progress |
| `gameTime` | Total game seconds since the save was created (authoritative timer reference) |
| `savedAt` / `lastSaveAge` | Wall-clock stamp of the last save and its age |
| `offlineReport` | Last offline resolution: requested, granted, rate, cap, anomalies |

Exposed on `window.__coop` in dev builds:

```js
if (dev) window.__coop = { get state() { return game; }, clock, loop, export: exportToString, import: importFromString };
```

### 6.7 Timers: countdown → deadline

Every in-game timer stores an **absolute game-time deadline**, not a remaining amount:

- `harvesters[i].timeRemaining -= diff` (`ascension.js:765`) → `harvesters[i].endsAtGameTime = meta.gameTime + 5 * level`, remaining is `endsAtGameTime - meta.gameTime`.
- Contract progress keeps a `progressGoal` (money threshold) rather than a countdown, so offline resolution is exact.
- Any future timed mechanic (news, buffs) follows the same rule.

Consequence: no drift, correct behavior across suspension, and the display can show `formatTime(endsAtGameTime - game.meta.gameTime)` without writing to state every frame. A separate 1 Hz `ui.clockSecond` counter drives text that genuinely needs to change each second, so a 60 Hz tick does not churn the DOM.

---

## 7. The Systems Layer (R3)

### 7.1 Interface

A system is a plain object with an optional tick. No runes, no DOM, no imports from `state/`.

```js
export default {
  id: 'economy',
  order: 30,                                   // deterministic tick order
  tick(game, ctx) { … },                       // advance production by ctx.dt
  // optional: onEvent(game, ctx, event)        // react to a typed event
  // optional: onAction(game, ctx, action)      // react to a player action
};
```

### 7.2 Tick order

Order is data, not an accident of file order — the legacy loop's order was implicit and one of the review's coupling findings.

| Order | System | Legacy origin | Responsibility |
|---|---|---|---|
| 10 | `timers` | `ascension.js:739-767` | Advance harvester deadlines, fire completion events |
| 20 | `automation` | `automation.js:31-35` | Run enabled automators (research, promotion, epic) |
| 30 | `economy` | `main.js:197-221` | Chickens, money, planet boosts, egg value application |
| 40 | `contracts` | `contracts.js:143` | Progress/expire/complete active contracts |
| 50 | `planets` | `egghandler.js`, `eggspeditions.js` | Planet money accumulation, discovery gating |
| 60 | `ascension` | `ascension.js:412-465` | Harvester yields, knowlegg accrual, reliquary caps |
| 70 | `stats` | `main.js:223-241` | Bests, lifetime earnings, time-in-layer counters |
| 80 | `achievements` | `achievements.js:95-213` | Evaluate declarative triggers, emit unlock events |

`derived` is recomputed once in step 0, before all systems, so every system reads the same boosts the UI just rendered. `contracts` sitting after `automation` is a deliberate change from legacy: automation should not promote eggs in the same tick a contract is about to be awarded.

```js
// src/lib/systems/tick.js — pure: no runes, no reactivity, no DOM
export const SYSTEMS = [timers, automation, economy, contracts, planets, ascension, stats, achievements]
  .sort((a, b) => a.order - b.order);

export function runSystems(game, ctx) {
  game.meta.gameTime += ctx.dt;                   // authoritative game clock (§6.7)
  for (const s of SYSTEMS) s.tick?.(game, ctx);
}
```

```js
// src/lib/state/runtime.svelte.js — the composed entry point. This is the only file where
// runes, the event bus, the dirty flag and the save file all meet: everything below the
// first line is rune-free and DOM-free, which is what makes it testable in Node.
export function tickFrame(game, ctx) {
  refreshDerived(recomputeDerived(game));          // step 0: every system and every component read the same boosts
  runSystems(game, ctx);
  events.drain();                                 // UI reacts after the tick, never mid-mutation
  if (dirtySinceLastFlush()) flushSave();
}
```

The split matters: `runSystems` is pure and callable from a Node test (`runSystems(state, { dt: 1 })`), while `tickFrame` is the single entry point the loop and the dev console go through — `resolveIdle` (§6.5) deliberately bypasses it, because granting 720 offline chunks must not re-refresh derived state or write a save 720 times. Neither `systems/**` nor `loop/**` imports a `.svelte` module; the reactive `refreshDerived` call is isolated in one place.

### 7.3 Events (`core/events.js`)

Systems announce; UI reacts. This is what decouples "achievement unlocked" from the achievement system, and what feeds toasts, the header banner and the offline report.

```js
events.emit('achievement:unlocked', { id: 'hoarder' });
events.on('achievement:unlocked', (e) => toast(`${e.name} unlocked!`));
```

Emissions are queued during a tick and drained at the end, so a system can never trigger a re-render mid-mutation.

### 7.4 Automation (`systems/automation.js`)

The legacy `runAuto` switch (`automation.js:1-29`) becomes a registry keyed by name, which is exactly the idea sketched in the dead code at `automation.js:41-72`:

```js
export const AUTOMATIONS = {
  researchTier1: { label: 'Tier I–V Auto',  when: (g) => !allMaxed(g, 'research', 0, 9),   run: (g) => buyBatch('research', 0, 9) },
  researchTier2: { label: 'Tier VI–X Auto', when: (g) => !allMaxed(g, 'research', 10, 19), run: (g) => buyBatch('research', 10, 19) },
  promote:       { label: 'Promotion Auto',  when: (g) => canAutoPromote(g),             run: () => promoteEgg() },
  researchTier3: { label: 'Tier XI–XIV Auto', when: (g) => !allMaxed(g, 'research', 20, 27), run: (g) => buyBatch('research', 20, 27) },
  epicResearch:  { label: 'Epic Research Auto', when: (g) => !allMaxed(g, 'epic', 0, 5),   run: (g) => buyEpicBatch(0, 5) },
};
```

`autoActive` becomes `{ [name]: boolean }`, removing the index-to-name coupling that the legacy array had with `autoNames`.

### 7.5 Resets (`systems/resets.js`)

Five hand-written reset functions with different field lists (review BUG #10 / §4.3) collapse into declarations:

```js
export const RESETS = {
  promoteEgg:   { erase: ['play.money', 'play.chickens', 'play.bestRunMoney', 'prog.research'] },
  prestige:     { erase: ['play', 'prog.research', 'prog.epicResearch', 'prog.autoActive'] },
  ascend:       { erase: ['play', 'prog.research', 'prog.epicResearch', 'prog.legendaryResearch', 'prog.autoActive'] },
  contractExit: { erase: ['play', 'prog.research'] },
  journey:      { erase: ['play.money', 'play.chickens', 'play.bestRunMoney'] },
};

export function applyReset(game, name) {
  const { erase } = RESETS[name];
  for (const path of erase) erasePath(game, path);      // 'play' = whole region, 'play.money' = one field
}
```

`erasePath` accepts a region (`play` → every field in the region) or a single field path, so a new region cannot be forgotten by a hand-maintained field list — the schema's named regions (§5.1) pay for themselves here. A reset also declares a *scope* for the one thing that is not a field, achievements:

```js
export const ACHIEVEMENT_SCOPE = { promoteEgg: 'run', prestige: 'meta', ascend: 'global', contractExit: 'run', journey: 'global' };
```

so "which achievements survive a prestige" is data, not an `if` inside the reset body. Everything a reset does not erase survives, so the declaration stays short and the tests can snapshot-diff the result.

### 7.6 Why the systems layer is worth the structure

The legacy cost of "changing one formula means 5+ coordinated edits" (report §5) is paid per-system here. `economy.js` contains the money formula and nothing else; `contracts.js` contains contract progress; the Reliquary boost chain is one pure function. All are testable without a browser, which the legacy code structurally could not be (it had no package.json, no test runner, and every function reached for the DOM).

---

## 8. Persistence (R5, R6)

### 8.1 The envelope

The legacy save is a bare `JSON.stringify(data)`. v3 wraps it:

```js
{
  format: 'coopco-save',
  schemaVersion: 3,
  appVersion: '3.0.0',
  savedAt: 1758800000000,
  checksum: 'f1a2c3d4',                 // FNV-1a over the serialized payload
  payload: { … the state object, with Decimals encoded … }
}
```

The checksum catches truncation and hand-editing; the `schemaVersion` drives the migration chain; `savedAt` is the offline-time input; `appVersion` is display-only. This is the report's §6 recommendation implemented.

### 8.2 Serialize / deserialize

`break_eternity`'s `Decimal` implements `toJSON()` returning a string, so `JSON.stringify` already "works" — but a string is ambiguous with a genuinely string field (`stats.bestEgg`), and a `D("1e500")` string must be restored to a `Decimal`, not left a string. Explicit tagging removes the ambiguity:

```js
// src/lib/core/decimal.js
const TAG = '$dec';
export const encodeDecimals = (value) => {
  if (value instanceof Decimal) return { [TAG]: value.toString() };     // safe inside a $state proxy: class instances aren't proxied
  if (Array.isArray(value)) return value.map(encodeDecimals);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encodeDecimals(v)]));
  return value;
};
export const decodeDecimals = (value) => {
  if (Array.isArray(value)) return value.map(decodeDecimals);
  if (value && typeof value === 'object') {
    if (typeof value[TAG] === 'string') return D(value[TAG]);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decodeDecimals(v)]));
  }
  return value;
};
```

Because `$state` does not proxy class instances, `value instanceof Decimal` remains true for values read out of the state proxy — worth pinning with a test so a future Svelte upgrade can't silently break serialization.

**One decoder, used by every entry point** (fixes BUG #9's two-merge-semantics problem):

```js
export function decodeSave(raw) {
  if (!raw || raw.format !== 'coopco-save')          throw new SaveError('not-a-coopco-save');
  if (!Number.isInteger(raw.schemaVersion))          throw new SaveError('bad-version');
  const payload = decodeDecimals(raw.payload);
  if (fnv1a(JSON.stringify(payload)) !== raw.checksum) throw new SaveError('checksum-mismatch');
  const migrated = migrate(payload, raw.schemaVersion);      // §8.4
  return validate(migrated);                                  // §8.2.1
}
```

`loadGame`, `importFromString` and `importFromFile` all funnel through `decodeSave`. There is no second path that can disagree with it.

### 8.2.1 Validation

`validate()` walks the schema and returns a fresh state plus a list of problems; it never throws on a field-level issue, it fills the default and records the issue (so a partially corrupt save still loads, visibly). Checks:

- unknown keys dropped; missing keys defaulted from `createInitialState()`
- every numeric field is a finite, non-negative `Decimal` (`NaN`, `Infinity`, negative money → default)
- ids resolve in `content/**`; an unknown `currentEggId` falls back to `'regular'`
- `activeArtifacts`/`activeGems` contain owned ids only, else `null`
- `prog.achievements` keys ⊆ `ACHIEVEMENTS` ids; unknown keys dropped (this is the BUG #3 family of corruption, handled)
- `meta.gameTime` finite, `≥ 0`, within the sanity window of §6.6
- `settings` values within allowed sets; a bad `offlineCapHours` → default, reported
- fixed-length arrays are rebuilt to content length (`contractSlots` 3, `activeArtifacts` 4, `activeGems` 12, `loadouts` 3), and id-keyed maps are pruned to ids that exist in `content/**`

### 8.3 Saving

- **Key:** `coopCo-Revised` (already chosen in the `DataManager.js` stub; keeps v2's `coopCo` intact for the legacy importer).
- **Dirty flag:** set by any action or system that mutates. Serialization is never performed on a tick that changed nothing — serializing a full state with ~150 Decimal allocations 60×/s would be a measurable regression over the legacy 30 s interval.
- **Flushing:**
  - autosave every `AUTOSAVE_INTERVAL` of *real* time (default 30 s, matching legacy), measured on the loop's 1 Hz `onSecond` callback, not by a second `setInterval` (which would be exactly the thing §6 removes);
  - on `visibilitychange` → hidden, `pagehide`, `freeze`;
  - after prestige, ascension, import, and reset;
  - immediately before a user-visible "Game Saved" notification if a manual save is requested.
- **Ordering guarantee:** `savedAt` is stamped *after* a successful `setItem` so a failed write (quota exceeded) never claims a fresh timestamp.
- **Quota:** wrap `setItem` in try/catch; on failure emit `save:failed` (the UI shows a persistent warning and suggests export).

### 8.4 Migrations

`fixSave`'s recursive key-copy (`data.js:110-124`) is deleted. It could only add keys; renames orphaned data, type changes were partially coerced, and it doubled as the loader for one path and not the other.

```js
export const MIGRATIONS = {
  1: (d) => ({ …d, schemaVersion: 2 }),                       // v1 → v2: add fields with defaults
  2: (d) => migrateToV3(d),                                    // v2 → v3: restructure regions, id-key maps
};
export const migrate = (payload, from) =>
  Object.entries(MIGRATIONS).filter(([v]) => +v >= from).sort((a, b) => a[0] - b[0])
    .reduce((acc, [v, fn]) => fn(acc), payload);
```

The chain is a list of named, testable steps; each one has a fixture in `src/lib/state/__tests__/fixtures/`. A migration that cannot express a transformation is a signal that the schema change needs a converter, not a heuristic.

### 8.5 Export & import (R6)

Four symmetric entry points, two transports:

```js
export function exportToString(): string        // envelope JSON → base64 → wrapped in 76-char lines
export function exportToFile(name?): void      // Blob + URL.createObjectURL → <a download> click
export function importFromString(text): Result // decode + validate + migrate → { ok, state } | { ok: false, reason }
export async function importFromFile(file): Promise<Result>
```

**Export file:** `coop-co-save-v3-2026-09-25-1432.txt`, `text/plain` MIME, content = the wrapped base64 envelope. Downloaded via `Blob`/`createObjectURL` — replacing the legacy `document.execCommand('copy')` textarea hack (`data.js:128-134`), which is deprecated and unavailable in some embedded browsers.

**Line wrapping:** base64 in 76-char lines so the string is pasteable into a chat message, a notepad, or a `.txt` file and survives line-ending normalization. The decoder strips whitespace before `atob`.

**Text format** (self-describing, so an imported file is intelligible years later):

```text
# Coop Co save file
# format: coopco-save  schema: 3  app: 3.0.0  saved: 2026-09-25T14:32:00Z
# (base64 of the JSON envelope, wrapped at 76 columns; copy the whole file or the
#  body without these '#' lines — the importer ignores comments and whitespace)
eyJmb3JtYXQiOiJjb29wY28tc2F2ZSIsInNjaGVtYVVlcnNpb24iOjMsLi4u
eyJwYXlsb2FkIjp7InBsYXkiOnsibW9uZXkiOiJ7IiRkZ2MiOiIxZTIifX19fQ==
```

**Import UI** (Settings, and the reset confirmation): a `<textarea>` for pasted strings *and* a file input (`accept=".txt,text/plain"`) with a drop target. The flow is: parse → validate → show a **diff summary** (what will change: version, age, notable stats) → confirm → `applyState` + flush. Rejections are explicit and human-readable: `"this file was saved by a newer version of the game (schema 4)"`, `"checksum mismatch — the file is truncated or edited"`, `"unknown save format"`. Importing must **not** `location.reload()` (legacy `data.js:151`) — `applyState` swaps the reactive object and the UI updates itself, preserving tab state, scroll position and the current loop.

**Import side effects to get right:** after `applyState`, recompute `derived` immediately (so no component ever renders with a stale boost set), clear the event queue, and recompute any "first load" onboarding flags. A mid-run import that drops `hasPrestiged` must also close any tab whose content no longer exists.

### 8.6 Legacy v2 import (`state/legacy/v2.js`)

One-time, one-directional: read the old `coopCo` key (or a pasted legacy blob), coerce, restructure, and offer it as a normal import. The converter is where the legacy bugs get *corrected rather than copied*:

- `achievements` array 48 → truncate to 48, then explicitly map the five known out-of-range achievements (48–52) onto their ids, since the legacy array grew unpredictably
- `stats.bestKnowleggs` — recompute from `knowlegg`/`bestKnowlegg` rather than inheriting the wrong assignment (BUG #2)
- `currentEgg`/`currentPlanetIndex` → `currentEggId`/`currentPlanetId` via `content` id tables
- indexed arrays → keyed maps
- `settingsToggles[7]` → named `settings`
- `time` → `meta.savedAt` (used to compute the first offline gain) and `meta.gameTime = 0`
- Decimal coercion via `decodeDecimals` (replaces `fixSave`)

The legacy key is left untouched unless the player explicitly chooses "delete legacy save" after importing.

---

## 9. UI Contract (R4)

### 9.1 What display logic is allowed to contain

- `$state` for anything reactive the component owns (hover index, local filter, animation flags, a modal's open state).
- `$derived` / `$derived.by` for values computed from state (`$derived(d.canPromote)`).
- `$bindable` props for view state the parent owns and persists.
- Formatting via `core/format.js` and selectors from `state/selectors.js`.
- Event dispatch to actions.

**What it must never contain:** game rules, cost math, or any `game.*` write that is not routed through an action. `update.js` — the entire file — is deleted; the `data-state` attribute pattern from the report's §12 Phase 2 (`data-state="affordable" | "locked" | "maxed"`) replaces the 78 button-color classes.

### 9.2 `$bindable` and where view state lives

Two distinct kinds of "state a component touches":

**(a) Persisted view state** (tab index, sub-tab, buy amount, selected artifact/loadout, notification position). It is saved, so it lives in `state/ui.svelte.js`, is surfaced to the parent, and is mirrored into a local `$state` so two-way binding stays cheap and explicit:

```js
// state/ui.svelte.js — the view store. Persisted keys are marked; the rest are
// session-only and must never be written to a save file.
export const ui = $state({
  activeTab: 0,                       // persisted
  activeSubTab: { research: 0, ascension: 0, settings: 0 },  // persisted
  buyAmount: 1,                       // persisted: 1 | 10 | 100 | 'max'
  selected: { artifact: null, gem: null, loadout: 0 },       // persisted
  showNewsticker: true,               // persisted
  modal: null,                        // session: the single modal manager's payload
  toasts: [],                         // session
  clockSecond: 0,                     // session: 1 Hz, written only by the loop (§6.3)
  diag: { lastDt: 0, lastRealDt: 0, steps: 0, droppedMs: 0, sinceLastTickMs: 0, source: 'frame' },  // session: 1 Hz
});
```

```svelte
<!-- +page.svelte (fragment) -->
<script>
  import { ui, setTab } from '$lib/state/ui.svelte.js';
  let activeTab = $state(ui.activeTab);              // local reactive mirror
  $effect(() => setTab(activeTab));                  // persist (debounced by ui.svelte.js)
</script>

<ButtonGroup bind:active={activeTab} />
```

```svelte
<!-- ButtonGroup.svelte -->
<script>
  let { active = $bindable(0), tabs = TABS } = $props();
</script>
{#each tabs as tab, i}
  <button class="tab" class:active={i === active} onclick={() => active = i}>{tab.label}</button>
{/each}
```

`$bindable` with a default keeps the component usable unbound (storybook, tests, the offline report), and keeps the *parent* the owner of persistence. The child stays a dumb, testable view.

**(b) Ephemeral view state** (hover target, whether a tooltip is open, an accordion's expanded flag). It stays local, is never bound upward, and is not saved. `Accordion.svelte` and the reliquary/achievement hover text are the examples; the review notes several legacy features are hover-only and should also be focus/click accessible.

**Naming convention:** `$bindable` props are nouns for values (`active`, `selected`, `buyAmount`), callbacks are `on*` verbs (`onchange`, `onconfirm`). Components never call `applyState` directly — that would bypass the dirty flag and the persistence rules.

### 9.3 Component inventory and their data dependencies

| Route / component | Reads | Dispatches |
|---|---|---|
| `Header.svelte` | `play.money`, `play.chickens`, `econ.*`, `d.eggValue`, current egg id | `promoteEgg`, `requestPrestige`, `requestAscend` |
| `Newsticker.svelte` | news content + `events` | `openLink` (external) |
| `ButtonGroup.svelte` | `prog.unlockedEggIds`, `econ.hasPrestiged/hasAscended` | `setTab` |
| `Egg.svelte` | `selectEggProgress(game)`, `play.chickens` | `layEgg` |
| `Research.svelte` | `prog.research`, `selectResearchCosts` | `buyResearch`, `setBuyAmount` |
| `Prestige.svelte` | `prog.epicResearch`, `d.soulEggGain` | `buyEpicResearch`, `requestPrestige` |
| `Contracts.svelte` | `play.contractSlots`, `d.contractGoalBoost` | `startContract`, `exitContract` |
| `Eggspeditions.svelte` | `prog.unlockedPlanetIds`, `prog.planetData`, `d.planetBoosts` | `discoverPlanet`, `journeyToPlanet` |
| `Ascension.svelte` | `prog.legendaryResearch`, `prog.artifacts/gems`, `prog.harvesters`, `d.*` | `buyLegendaryResearch`, `startHarvester`, `selectLoadout` |
| `Achievements.svelte` | `prog.achievements`, `content/achievements` | `selectAchievement` |
| `Settings.svelte` | `settings`, `ui` (incl. `ui.diag`, `ui.clockSecond`), `meta` | `setSetting`, `saveGame`, `exportToFile`, `importFromFile`, `deleteSave` |

This table is the direct replacement for `update.js`'s `data.currentTab` switch: tab components are mounted by `+page.svelte`, so only the mounted tab's reactive reads exist in the graph, and the money text in the header re-renders without touching a single element in the research tab.

### 9.4 Render-frequency discipline

- No component writes to `game` from `$effect` — an effect that both reads and writes the same state loops forever. Effects are for view-state sync (as in §9.2, where the effect reads a *local* `$state` and writes `ui`) and for genuine side effects like the favicon (`$effect(() => favicon.href = …)`), never for state derivation.
- Actions are the only way a component changes state, so `setTab`/`setBuyAmount` are actions too — the effect above is the single sanctioned exception shape, and it writes to the view store, not the game store.
- Countdowns read `ui.clockSecond` (updated once per second by the loop), not the 60 Hz tick.
- `d.*` changes only when the underlying values change (§5.5), so a steady-state tick does not re-render boost consumers.
- The tab component is the only thing re-rendering on money; lists of research rows re-render per row that owns changed cost/affordability.

---

## 10. `+page.svelte` — Boot, Loop, Teardown (R8)

`+page.svelte` is the game's single route and tab host, so it owns everything with a lifetime. It does exactly four things: boot the state, start the loop, react to loop events (toasts, offline report), and tear both down.

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { game }              from '$lib/state/game.svelte.js';
  import { ui, setTab, drainToasts } from '$lib/state/ui.svelte.js';
  import { tickFrame, resolveIdle } from '$lib/state/runtime.svelte.js';
  import { loadGame, saveGame } from '$lib/state/persistence.svelte.js';
  import { createLoop }        from '$lib/loop/loop.js';
  import { createClock }       from '$lib/core/clock.js';
  import { events }            from '$lib/core/events.js';
  import { OfflineReportModal } from '$lib/components/OfflineReportModal.svelte';

  import Header from '$lib/components/Header.svelte';
  import Newsticker from '$lib/components/Newsticker.svelte';
  import ButtonGroup from '$lib/components/ButtonGroup.svelte';
  import Egg from './Egg.svelte';
  /* … one import per tab … */

  let activeTab     = $state(ui.activeTab);
  let offlineReport = $state(null);

  $effect(() => setTab(activeTab));      // persist the tab (debounced inside ui.svelte.js)

  onMount(() => {
    const clock = createClock();
    // parse → migrate → validate → resolve elapsed time (§8, §6.5). loadGame owns the
    // PRNG, because the seed lives in the save: it must exist before offline time can
    // be simulated, and it must be the *loaded* seed, not a fresh default.
    const boot = loadGame({ clock, events });
    if (boot.report) offlineReport = boot.report;        // offline resolution + report (R7)
    const rng  = boot.rng;                               // seeded ⇒ same elapsed time ⇒ same result

    const loop = createLoop({
      game, clock,
      tick: (ctx) => tickFrame(game, { ...ctx, clock, rng, events }),
      onIdle: ({ wallAtLastTick, rawDt }) => {          // frozen tab / sleep: full rate, only HARD_MAX (§6.5)
        const report = resolveIdle(game, { rawSeconds: rawDt, wallAtLastTick, clock, rng, events, capHours: 720, rate: 1 });
        if (report) offlineReport = report;
      },
      onSecond: (live) => { if (game.meta.dirty) saveGame(); ui.diag = { ...live }; ui.clockSecond++; },
    });

    const unsub = events.on('toast', (e) => drainToasts.push(e));
    loop.start();

    return () => { unsub(); loop.stop(); saveGame(); };   // §6.4
  });
</script>

<Header />
{#if ui.showNewsticker}<Newsticker />{/if}
<ButtonGroup bind:active={activeTab} />
{#if offlineReport}<OfflineReportModal report={offlineReport} onclose={() => offlineReport = null} />{/if}
{#if activeTab === 0}<Egg />
{:else if activeTab === 1}<Research />
…
{/if}
```

**SSR / prerender safety — mandatory, because the adapter is `adapter-static`.** SvelteKit prerenders `/` at build time, which *imports and evaluates* `game.svelte.js` and everything it pulls in during `vite build`.

- `game` must be constructible with no browser API: `createInitialState()` uses only `Math.random()` and `D(0)`. **No `localStorage`, no `Date.now()`-derived initial value, no `performance.now()` at module scope.** Wall-clock and save reads happen inside `loadGame()`, called from `onMount`.
- This is why the legacy `data.time = Date.now()` default (`data.js:69`) cannot be reproduced literally: at prerender it would freeze to the build timestamp. `meta.savedAt` starts at `0` and is stamped on first save.
- Guard any remaining browser API with `import { browser } from '$app/environment'` as a backstop, and if a `+page.server`/`+page.ts` load function is ever added, keep the state import out of it.

**If the UI ever becomes real routes** (`/egg`, `/research`, …), the loop must move to `+layout.svelte`, because `+page.svelte` unmounts on navigation and the game would stop ticking. `+page.svelte` may then call `layout`-provided handles through a `setContext('game', …)` context. Keep `+layout.svelte` free of game logic for now; the current single-route tab switcher is the right shape for this design and matches R8.

---

## 11. Legacy → v3 Mapping

| Legacy artifact | Destination | Notes |
|---|---|---|
| `data.js:getDefaultObject()` | `state/schema.js:createInitialState()` | Restructured, id-keyed, versioned |
| `data.js:save/load` | `state/persistence.svelte.js:saveGame/loadGame` | Envelope, checksum, dirty-flag flush, no DOM writes |
| `data.js:fixSave` | **deleted** → `migrate()` + `validate()` | §8.4 |
| `data.js:exportSave/importSave` | `exportToString/File`, `importFromString/File` | Blob download, file input, diff summary, no reload |
| `data.js:window.onload` | `+page.svelte:onMount` | Split: state boot, offline resolution, UI restore, diagnostics |
| `data.js:fullReset/deleteSave` | `actions.js:deleteSave` + Settings confirmation | Export-then-delete preserved, as a single modal |
| `data.js:saveName = 'coopCo'` | `coopCo-Revised` (new) / `coopCo` (legacy read-only) | |
| `data.js` 30 s autosave `setInterval` | dirty-flagged flush scheduled by the loop (§8.3) | Same interval, correct lifecycle |
| `update.js` (all 112 lines) | **deleted** | `$derived` + templates + `data-state` attributes |
| `main.js:mainLoop` | `systems/tick.js:runSystems` + `state/runtime.svelte.js:tickFrame` | Fixed step, explicit ctx, no DOM |
| `main.js:generateHTMLAndHandlers` | `{#each}` / `{#if}` / `onclick` in components | ~180 lines deleted |
| `main.js:changeTab/changeSubTab` | `ui.activeTab` + `{#if}` block in `+page.svelte` | |
| `main.js:createAlert/createPrompt/createConfirmation/closeModal` | one modal manager component + `actions.js` | Report §7: four hand-rolled modals → one |
| `main.js:toggle/toggleBA` | `actions.js:setSetting` / `ui.setBuyAmount` | Named keys, not indices |
| `main.js:updateStats` | `selectors.js:statsRows` + `{#each}` in Settings | |
| `main.js` favicon write | `$effect` in `+layout.svelte` head | |
| `main.js:398 setInterval(60)` | `loop/loop.js` rAF | §6.3 |
| `let diff` (`main.js:1`) | `ctx.dt` | Explicit, testable, per-tick |
| `prestige.js:1-6`, `egghandler.js:1-4`, `ascension.js:4-7` globals | `recomputeDerived(game)` | ~20 globals → 1 pure function |
| `egghandler.js:176/210/225` | `systems/derived.js` | eggValueBonus / intHatch / layRate |
| `research.js:327 updateResearch` | `derived.js` + `selectors` | One cost function shared by UI and purchase |
| `automation.js:runAuto` | `systems/automation.js: AUTOMATIONS` | Named registry (the idea in the legacy dead code) |
| `ascension.js:739-767` harvester timers | `systems/timers.js` | Deadline-based, offline-safe |
| `ascension.js:861-889 getActiveArtifactBoost` | `derived.js` boost chain | BUG #8 (stale accumulator) fixed |
| `contracts.js` | `systems/contracts.js` | Explicit state machine, event-driven completion |
| `achievements.js:95+ checkAchievements` | `systems/achievements.js` | Declarative triggers on the event bus |
| `prestige/ascend/promoteEgg/contractExit/journeyToPlanet` resets | `systems/resets.js` | BUG #10 |
| `Internal/Cache.js` DOM cache | **deleted** | Svelte owns the DOM |
| `Internal/Utilities.js` `format/notate/getTotalCost` | `core/format.js`, `core/decimal.js` | Pure, tested |
| `Internal/BreakEternity.js` (vendored 8k lines) | npm `break_eternity.js` | Already done in `package.json` |
| `newsticker.js` `eval()` | `core/events.js` + content data | Report §3 security item — no `eval` in v3 |

---

## 12. Testing, Performance and Enforcement

### 12.1 Test plan (Vitest is already configured: `pnpm test`)

Because `systems/**` and `core/**` are rune-free, they run in Node unmodified. This is the first time the game's logic is testable at all (report §9).

| Area | Cases |
|---|---|
| `core/clock` | monotonic vs wall divergence; `wallAtLastTick` reconstruction; injected fake clock |
| `loop` | fixed-step equivalence (60 ticks × 1/60 s == 1 tick × 1 s exactly); `MAX_FRAME` routing to the offline path; `MAX_CATCHUP_STEPS` budget and `droppedMs` accounting; a fake `requestAnimationFrame` driving 1000 frames at 30/60/144 Hz producing identical state |
| `offline` | soft cap, rate, `hardCapped`, negative clock, non-finite, `timeScale`; report contents; offline == live-tick production for the same elapsed time; an in-session idle gap grants at rate 1 while a cross-restart gap honors the settings cap/rate |
| `economy` | money/chicken formulas at t=0, t=1 s, t=1 h; planet multipliers; **property test: 60 × (1/60 s) == 1 × 1 s** (this is the property the legacy variable-interval loop could not guarantee once a `floor` entered a formula) |
| `persistence` | round-trip fidelity for a maximal state (all Decimals, empty maps, null slots); checksum detection of truncation; version migration chain v1→v2→v3; `validate` on a hand-corrupted fixture for every check in §8.2.1; `instanceof Decimal` survives the `$state` proxy (component test) |
| `legacy/v2` | the actual v2 fixture produces a valid v3 state; the 48-vs-53 achievement mapping |
| `resets` | each reset erases exactly its declared paths and keeps the rest (snapshot diff) — this is the regression test BUG #10 needs |
| `automation` | each automator's `when` guard and `run` effect; a no-op loop produces no events |
| `achievements` | every trigger fires; 100% completion is reachable (report Phase 4 requirement) |
| `derived` | boost chain equals a hand-computed fixture; change-gating skips identical values |

E2E smoke (Playwright is already a dev dependency): load with a seeded save → click through all tabs → prestige → export to string → reset → import → state matches.

### 12.2 Performance budget

| Metric | Target | Rationale |
|---|---|---|
| Logic tick (`runSystems` + `recomputeDerived`, mid-game save) | < 1 ms | Report §12 Phase 6 budget |
| `recomputeDerived` | < 0.2 ms, and only on change where possible | It is the legacy ~20-function recompute collapsed into one |
| Serialization | < 3 ms, **not on the tick path** | Dirty-flagged (§8.3) |
| Render | no full-tree writes; only the components reading a changed field | Replaces the legacy hundreds-of-writes-per-tick |
| `Date`/clock calls per tick | exactly 2 (`nowMonotonic`, `nowWall`) | Injected, not ambient |

Measurement: a `?profile` flag that logs tick/derive/serialize timings into the Diagnostics panel, and a benchmark test that runs 10,000 ticks on a maximal save and asserts the budget.

### 12.3 Lint rules worth adding

`no-restricted-syntax` for `Decimal.prototype` mutating methods used on a state property (forces assign-don't-mutate, §5.2), an `eslint-plugin-svelte` setup with `runes: true`, and a project convention that files under `systems/` and `core/` may not import from `routes/`, `components/`, or any `.svelte.js` — enforceable as a `no-restricted-imports` rule scoped by path. These make the dependency rules in §4.1 mechanical rather than aspirational.

---

## 13. Implementation Order

Each phase is independently landable and has an exit criterion.

| Phase | Work | Exit criterion |
|---|---|---|
| **1. Foundations** | `core/{decimal,format,clock,rng,events}.js`, `content/` (eggs, research, planets, artifacts, gems, achievements, balance — port the legacy data arrays verbatim, no rebalancing yet) | Pure modules + unit tests green; `pnpm test` runs in Node |
| **2. State** | `schema.js`, `game.svelte.js`, `derived.svelte.js`, `runtime.svelte.js`, `actions.js`, `ui.svelte.js`, `systems/derived.js`, `systems/resets.js` | `createInitialState()` → apply → assert round-trip; reset snapshot tests pass |
| **3. Logic** | `systems/{tick,economy,research,eggs,contracts,planets,ascension,timers,automation,achievements,stats}.js` | Headless simulation reaches the same progression milestones as legacy v2.0.3 (a scripted 24 h simulation, compared against a legacy run) |
| **4. Time** | `core/clock` verification, `loop/loop.js`, `systems/offline.js`, diagnostics overlay | Fixed-step equivalence test passes; offline report renders; tab-hidden/suspend/clock-change cases manually verified in 4 browsers |
| **5. Persistence** | `persistence.svelte.js`, migrations, `legacy/v2.js`, Settings UI for save/export/import | Round-trip + corruption + migration fixtures pass; a real v2 save imports and plays |
| **6. UI** | `+page.svelte` wiring, Header, tabs one by one against the §9.3 inventory; modal manager; toasts | Each tab feature-parity vs legacy; no `getElementById` in `src/`; `update.js` deleted |
| **7. Hardening** | lint rules, perf budget, E2E smoke, changelog, `v3.0.0` | Budgets met in CI; release checklist signed off |

**Deliberate ordering constraint:** do not start Phase 6 before Phase 3 is verified headlessly. The legacy code could only be debugged by playing it in a browser; the point of this architecture is that logic bugs become unit-test failures, and that is lost if the UI is built alongside the logic from day one.

---

## 14. Open Decisions

| # | Decision needed | Recommendation | Impact if deferred |
|---|---|---|---|
| D1 | TypeScript now or later? | Later, with JSDoc types on the public surface of `state/`, `core/`, `systems/` in the meantime | A `.ts` migration becomes a mechanical rename; adopting it mid-feature costs a week |
| D2 | `unlockedArtifact[]`/`unlockedGem[]` — keep, or derive from count? | Derive from count; keep a `discoveredAt` timestamp only if "seen but zero" is a real state | Two sources of truth for the reliquary (§5.4) |
| D3 | Research keyed by id vs index? | Keyed by id (already assumed throughout) | Mixed access patterns and fragile reset definitions |
| D4 | Offline default: 12 h cap at 50%? | Yes, per `systems_proposal` §2.2 — but expose both in Settings, since it is the most-argued setting in idle games | Retuning after launch means a migration |
| D5 | Does `timeScale` (dev speed) affect offline grants? | Gate it behind a dev-only flag and never apply it to offline grants, so a player cannot inflate a save by quitting in dev mode | Save-scumming |
| D6 | Achievements as a keyed set vs array of ids | Keyed set (assumed) | — |
| D7 | Multi-save slots? | Single slot in v3; the envelope makes slots a later addition with no format change | — |
| D8 | Should `derived` be persisted for instant first paint? | No — recompute on load (~0.2 ms) rather than trust a save field | Save bloat and a stale-boost failure mode |

---

## 15. Definition of Done

- [ ] `update.js` is deleted; no file under `src/` calls `getElementById` / `querySelector` outside tests.
- [ ] No system or core module imports a `.svelte` file, a Svelte store, or touches the DOM.
- [ ] Every `Decimal` in state is assigned, never mutated in place; a test asserts the property.
- [ ] `runSystems(state, {dt})` advances the game with no Svelte, runes, DOM or module-scope clock involved, and `tickFrame` is the only composed entry point.
- [ ] `dt` is never read from a global; `diff` no longer exists.
- [ ] A full 24 h headless simulation completes without error and reaches the expected progression.
- [ ] Toggling the system clock, sleeping the laptop, and hiding the tab all produce a correct, reported, capped result.
- [ ] Save → reload → export → import → reload produces a byte-identical payload.
- [ ] A truncated or hand-edited save file is rejected with a readable reason and the live state is untouched.
- [ ] A v2.0.3 save imports, with the documented bug corrections applied.
- [ ] No magic index (`28`, `48`, `18`, `24`, `6`, `1e45`) appears in `state/`, `systems/` or `routes/` — all come from `content/`.
- [ ] No `eval` anywhere in `src/`.
- [ ] Every tab in the §9.3 inventory renders from state and dispatches actions only.

---

*Proposal document. No source files were modified. Companion to `CODE_REVIEW_REPORT.md` (defects) and `systems_proposal.md` (content), implementing the data/loop half of its §12 rewrite plan.*
