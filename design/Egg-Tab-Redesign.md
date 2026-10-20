# Egg Tab UI Redesign — Design Proposal

**Version:** Draft 1.0 (design proposal — no code changes)
**Target:** v3.0 Svelte rebuild (`src/routes/Egg.svelte`, currently a stub)
**Source basis:** `Legacy Code Base/index.html` (`#eggTab`, the only legacy tab reviewed for structure), `Scripts/egghandler.js`, `Scripts/update.js`, `Scripts/main.js`, `Scripts/data.js`, `Scripts/eggspeditions.js`, `Scripts/research.js`, plus `CODE_REVIEW_REPORT.md` / `systems_proposal.md` where useful for context. The rebuilt side is represented by `src/routes/Research.svelte` (the only tab rebuilt so far) and `src/lib/scripts/DataManager.svelte.js`.

> Scope note: this document is a *UI/UX and information-architecture* proposal. It explicitly does **not** re-propose the balance/economy changes already covered by `Legacy Code Base/systems_proposal.md` §2, §4, §6 — it only says which of those numbers the Egg tab should surface.

---

## 0. TL;DR

The legacy Egg tab is a "here is your egg, here is the next egg, here is a list of eggs you've seen, and one giant Hatch button". It consumes full screen height and presents almost no *live* information about the run the player is currently in — the interesting numbers (`/s`, lay rate, chicken gain, egg value bonus) are crammed into one multi-line `<h4>`, and the rest of the tab is a static 19-entry dex.

The redesign keeps the Egg tab's identity — **this is the *farm*, the tab you look at while you play** — and reframes it around:

1. **A live "farm console"** — the top card answers *"how fast am I earning, and what is making me earn that fast?"* with a compact stat readout and a visible breakdown of the grain multipliers.
2. **A progression ladder instead of a dex grid** — the 19 eggs become a horizontal, scrollable timeline that shows where you are, what's next, and exactly how far away it is (two-stage discover → unlock progress).
3. **A deliberate place for the Hatch affordance** — the legacy `#mainButton` is a fixed, screen-hogging bar. In v3 it becomes a dedicated, primary "Lay Eggs" control that also communicates the manual-click share of income.
4. **Everything that the *other* tabs own stays out** — contracts, prestige, ascension, eggspeditions get one-line "you have something to do elsewhere" summaries, not duplicated controls.

---

## 1. What the legacy Egg tab actually is (the review)

This section is a reconstruction of the legacy structure only. It is the input to the redesign, not a recommendation to preserve it.

### 1.1 Markup structure

`index.html` builds `#eggTab` (lines 64–165) as a `.flexCol.tabHolder` containing exactly four blocks:

| # | Element | Content | Web ID | Written by |
|---|---|---|---|---|
| 1 | `<h3>` | `Eggs` | — | static |
| 2 | Current/Next row (`.flexRow`) | current egg `<img id="currentEggImg">` + `<h4 id="currentEggText">`, a literal `======>` separator `<p>`, next egg `<img id="nextEggImg">` + `<h4 id="nextEggText">` | `currentEggImg`, `currentEggText`, `nextEggImg`, `nextEggText` | `egghandler.js:updateEggPage()` |
| 3 | Discovered Eggs block (`.flexCol.tabHolder` → `.flexRow` → 3× `.flexCol.flexEgg`) | 19 hard-coded `<div id="eggHold0..17">` rows (plus a hand-written first row for the Regular egg), each `<img id="currentEggImg">` + `<h4>` name | `eggHold0`…`eggHold17` | `updateEggPage()` line 171 — show/hide only |
| 4 | `<button id="mainButton" class="redButton">` | `Click to Hatch +1 Chicken` | `mainButton` | never updated after load |

### 1.2 Structural defects that the redesign must not inherit

These are facts about the legacy DOM, all confirmed in the legacy source:

- **20 duplicate `id="currentEggImg"` nodes.** Every egg in the dex reuses one ID. `DOMCacheGetOrSet` (`Cache.js`) caches by ID and returns the *first* match, so `updateEggPage()`'s image updates at line 144–145 silently target the *header* node, not the dex rows. This is Bug #6 in `CODE_REVIEW_REPORT.md` and is the single strongest argument for a data-driven list (`{#each}`) in the rebuild.
- **The dex is hard-coded, not data-driven.** `eggData` in `egghandler.js` has 19 entries; the HTML only has a `Regular` row plus `eggHold0..17`. `updateEggPage()` loops `i < data.unlockedEgg.length` (18) and toggles `eggHold{i}` — so the last two egg definitions can never be represented as rows.
- **The tab's richest information is a single `<h4>`.** Everything the player needs per-run lives in one `innerText` assignment with `\n` separators (`egghandler.js:146`, `:156`, `:165`):
  ```
  Current Egg: <name>
  Value: $<value> (x<eggValueBonus>)
  $<income>/s
  Egg Laying Rate: x<layRate>
  Chicken Gain: <chickenGain> Chickens/min
  ```
  This is the whole information payload. It is unstyled, unlabeled, and re-written every 60 ms tick.
- **`#mainButton` is a fixed-position overlay**, `width: 50%`, `font-size: 1.5em`, pinned `bottom: 1dvh` (`style.css:143-149`). It floats over the tab content and is the only control on the page that is not in flow.
- **The tab is display-toggled, not rendered.** `changeTab()` (`main.js:263-269`) flips `#eggTab` between `flex`/`none`. `updateHTML()` then branches on `data.currentTab === 0` before calling `updateEggPage()` (`update.js:38-40`).
- **The "next egg" block is conditional spaghetti** (`egghandler.js:147-151`): a three-way nested ternary decides between the real next-egg image and `question.png`, and the discover check mixes `data.unlockedEgg[data.currentEgg]` with `eggData[data.currentEgg+1].discoverReq`.
- **`onPlanet` forks the entire tab** (`egghandler.js:142-169`). When the player is on an Eggspedition, the current/next block is overwritten with planet egg data, and "next" becomes a copy of "current" (`egghandler.js:166-168`) — a visibly broken state.
- **Nothing on this tab is interactive except Hatch and Promote.** The 19 dex rows are dead pixels; there is no hover information, no click-through, no per-egg detail.

### 1.3 The data the legacy tab exposes, and where it comes from

| Display | Legacy source | Notes |
|---|---|---|
| Current egg (name, id, image) | `eggData[data.currentEgg]` | 19 entries: `Regular → … → Enlightenment` (`egghandler.js:5-139`) |
| Egg value (base) | `eggData[i].value` | `Regular` 0.25 … `Enlightenment` 1e-7 (`egghandler.js:137`) |
| Egg value **with bonus** | `currentEggValue` = `eggData[i].value × eggValueBonus` (`main.js:208`) | `eggValueBonus` assembled from **18 common research + 1 epic + planet + artifact + gem** (`egghandler.js:176-208`) |
| Income `/s` | `currentEggValue × soulEggBoost × chickens × layRate` (`egghandler.js:146`) | planet 2 drops `soulEggBoost` (`main.js:216`); planet *i* has its own time divisor (`main.js:211-221`) |
| Egg Laying Rate | `layRate` | `egghandler.js:225-237` — research, epic, planet, gem |
| Chicken Gain | `chickenGain` (+ "Chickens/min" label) | `egghandler.js:210-223` — note `main.js:209` **actually applies gain per 15 s**, or per 60 s on planet 1 |
| Discover requirement | `eggData[i+1].discoverReq` | `Regular→Superfood` 1e7 … `Universe→Enlightenment` 5.7e64 |
| Unlock requirement | `eggData[i+1].unlockReq` | paired with `discoverReq`, factor ≈ 6.3× |
| Promote progress | `.style.setProperty('--x'/'--y', …)` on `#eggPromoteButton` | two independent progress values: **discover** = `log10(money)/log10(discoverReq)`, **unlock** = log-scaled on unlockReq (`update.js:14-21`) |
| Hatch click | `data.chickens = data.chickens.add(1)` (`main.js:15`) | flat +1, no upgrade interaction |

**The discover/unlock two-stage gate is the most under-served piece of information in the legacy tab.** It is computed (`update.js:17-20`) purely to animate two CSS variables on the Promote button, and the *numbers* behind it are never shown to the player.

### 1.4 What the legacy tab is actually good at

For fairness, these survive the redesign:

- The **current → next** juxtaposition is the right mental model for an incremental game; players want "what am I on, what's next".
- The **dex** correctly communicates "19 eggs, you've seen 3".
- Anchoring the tab to the **Hatch** action is correct — it is the one verb the farm has.

---

## 2. Problems with the Egg tab as an information surface

| # | Problem | Root cause in legacy |
|---|---|---|
| **P1** | The tab is 80% static. On a fresh save the dex shows 1 row and the rest is blank space. | 19 hard-coded rows with `display:none` |
| **P2** | Key run telemetry is a wall of `\n` text in one `<h4>`, restyled every tick. | `egghandler.js:146/156/165` |
| **P3** | `eggValueBonus ×18 multipliers` — the player cannot see *which* research is carrying them, so the tab can't teach the game. | `egghandler.js:176-208` |
| **P4** | Progress to the next egg is a CSS gradient, not a number. Players do not know "how much more money". | `update.js:14-21` |
| **P5** | The "next egg" panel lies when `onPlanet` (shows planet egg twice). | `egghandler.js:166-168` |
| **P6** | The Hatch button is `position: fixed` at 50% width — it covers content and does not relate to the farm it feeds. | `style.css:143-149` |
| **P7** | Dex rows are inert — no name, value, requirement, or "owned" detail on hover/click. | 19 × `<img id="currentEggImg">` |
| **P8** | Nothing on the tab acknowledges that Contracts / Prestige / Ascension / Eggspeditions exist and are blocked by *your current egg*. | Siloed per-tab `updateHTML()` branches |

---

## 3. Design principles

1. **The Egg tab is the farm, not the menu.** It should be the tab a player leaves open. Everything else (research, contracts, prestige, ascension, eggspeditions) is a *visit*, not a *home*. Therefore the Egg tab gets the live telemetry, and the other tabs get status summaries here.
2. **Every number on this tab must be live and derived, never a literal.** `DataManager` already centralises state; the tab must read derived values from one place, not recompute inline like `egghandler.js` does.
3. **Two-stage progression is the hero of the tab.** Discover → Unlock is the tab's only real "gameplay loop" and should get the largest visual weight after the income readout.
4. **Data-driven, unique keys, no ID reuse.** The dex becomes `{#each eggCatalog}`. No `id="currentEggImg"`.
5. **Progressive disclosure.** Early-game players (3 eggs discovered) see a short ladder and a big Hatch button. Late-game players see the same tab with a long ladder, an on-planet banner, and artifact/automation chips — same component, denser payload.
6. **Mobile-first flow.** Legacy's fixed 50%-wide bottom button and 3-column `flexEgg` dex are a desktop assumption. The redesign is a single vertical column that degrades to one column under ~40em.

---

## 4. Proposed Egg tab layout

Single vertical column, four zones top-to-bottom. Nothing is `position: fixed`.

```
┌──────────────────────────────────────────────────────────────┐
│ ZONE A — FARM CONSOLE  (live telemetry)                       │
│  ┌────────┐  Regular Egg                    [status chips]     │
│  │  egg   │  $1.24e6 / egg   ×3.40 bonus                     │
│  │  img   │  ──────────────────────────────────────────────   │
│  │        │  INCOME   $8.71e9/s      EGG RATE   ×12.5         │
│  └────────┘  CHICKENS 1.2e7 (+840/min)  CLICK  +1             │
│                                                                 │
│  breakdown ▸ Research ×2.10 · Epic ×1.25 · Soul ×1.41         │
│              Artifacts ×1.10 · Gems ×1.05 · Planet —           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ZONE B — PROMOTION LADDER (hero progression)                  │
│                                                                 │
│   ✓ Regular ── ✓ Superfood ── ● Medical ── ○ Rocket Fuel ── …  │
│                                 scrollable ──▸                 │
│                                                                 │
│  ┌── Next: Rocket Fuel Egg ─────────────────────────────────┐  │
│  │  DISCOVER  ████████████░░░░░░  78%   at $3.80e10         │  │
│  │  UNLOCK    ██████░░░░░░░░░░░░  41%   at $2.40e11         │  │
│  │  Value $30/egg  ·  ×120 over Medical                     │  │
│  │                         [ Promote to Next Egg ]  (gated) │  │
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ZONE C — LAY EGGS (the farm verb)                             │
│              [ Click to Lay Eggs  ·  +1 Chicken ]             │
│   manual clicks: 12  ·  worth 0.4% of income (upgrades ↑)     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ZONE D — EGGS DISCOVERED  (the dex, collapsed)                │
│  19 discovered · 12/19 promoted · [Show dex ▾]                │
│  ┌────┬────────────────┬───────────┬────────┬───────┐        │
│  │ □  │ Superfood Egg  │ $1.25     │ 1e7    │ beyond│        │
│  │ □  │ Medical Egg    │ $6.25     │ 8.4e8  │ beyond│        │
│  └────┴────────────────┴───────────┴────────┴───────┘        │
└──────────────────────────────────────────────────────────────┘
```

### Zone A — Farm Console

Replaces the legacy `currentEggText` `<h4>`. It is the "at a glance" panel.

| Slot | Content | Derivation | Default state |
|---|---|---|---|
| Egg portrait | Current egg sprite | `eggData[currentEgg].id` | always |
| Egg name | `Regular Egg` / planet egg name | `eggData[currentEgg].name` or `planetEggNames[currentPlanet]` | always |
| Unit value | `$X / egg` **with** bonus applied | `currentEggValue` (`main.js:208`) | always |
| Value bonus | `×N.NN` | `eggValueBonus` | always |
| **INCOME** | `$Y / s` | `currentEggValue × soulEggBoost × chickens × layRate` (`egghandler.js:146`) | always |
| **EGG RATE** | `×N.NN` | `layRate` | always |
| **CHICKENS** | count + `(+N / min)` | `data.chickens`, `chickenGain` | always |
| **CLICK** | `+N` | hatch click value (currently flat `+1`, `main.js:15`) | always |
| **Breakdown row** | `Research ×… · Epic ×… · Soul ×… · Artifacts ×… · Gems ×… · Planet ×…` | the actual factors inside `eggValueBonus`, `soulEggBoost`, `getActiveArtifactBoost/GemBoost` | collapsed by default, expands to full list |

**Design intent (P3):** today `eggValueBonus` is a black box built from `research[1,3,4,6,8,10,11,12,14,17,18,20,21,22,23,24,25,26]` + `epicResearch[5]` + planet + artifact + gem (`egghandler.js:176-208`). Surfacing the *factor groups* turns a dead stat into a teaching tool: a player who sees `Planet ×2.34` learns that Eggspeditions matter, and one who sees `Research ×2.10` knows where their next dollar goes.

**Status chips** (top-right of the console, only when relevant):
- `⛏ On Arcturus — +2.34× planet boost` (when `onPlanet`, replaces the broken next-egg fork, P5)
- `📜 Contract active: Energy Crisis` 
- `🕯 Enlightenment — Lamp charging` (late-game, per `systems_proposal.md` §6)
- `⚙ Auto-promote: On`

### Zone B — Promotion Ladder (the hero)

This is the biggest structural change and the highest-value one.

**B1 — Ladder strip.** A horizontally scrollable rail of node chips, one per egg in `eggData` (19). Each node has three states:

| State | Visual | Meaning |
|---|---|---|
| **Locked** | grayscale `question.png`-style silhouette, no name | `!data.unlockedEgg[i] && money < discoverReq` |
| **Discovered** | full-colour sprite, name in `$gray` | `data.unlockedEgg[i]` but `i > currentEgg` |
| **Current** | full-colour sprite, outlined, name in white | `i === data.currentEgg` |

Clicking a node expands a small popover: `Name · Value $X · Discover $Y · Unlock $Z · ×N vs current`. This replaces all 19 inert dex rows with real information *without* needing a separate dex panel to be open (P7).

**B2 — Next-egg progress card.** Two labelled bars, replacing the Promote button's CSS-variable trick (P4):

```
Next: Rocket Fuel Egg
DISCOVER  ████████████░░░░░░  78%   at $3.80e10
UNLOCK    ██████░░░░░░░░░░░░  41%   at $2.40e11
Value $30/egg · ×120 over Medical
```

- Discover bar = `clamp(log10(money) / log10(discoverReq), 0, 1)` — exactly the legacy `--y` value (`update.js:17`), now with a numeral.
- Unlock bar = the legacy `--x` value (`update.js:18`), now with a numeral.
- Values shown are the **raw requirement** (`eggData[i+1].discoverReq` / `.unlockReq`), which the legacy tab never displayed.
- The **Promote** button lives inside this card, gated: red and disabled until `money ≥ unlockReq`, green after. This matches legacy behaviour (`update.js:21`) but co-locates the button with the progress that justifies it.

**B3 — Final-egg variant.** When `currentEgg === eggData.length - 1`, the card is replaced by a single "Final Egg" plate: `The Final Egg` + a link-chip to Prestige/Ascension if those are unlocked (legacy did the same via `egghandler.js:153-159`).

**B4 — On-planet variant.** When `onPlanet`, B2 is replaced by a **Planet Run** card: planet name, its modifier text (`planetDescs`, `eggspeditions.js:2`), the per-planet time divisor reminder (planet 1 runs at ¼ speed, `main.js:213`), and a **Return Home** button. This fixes P5 by *replacing* rather than overwriting.

### Zone C — Lay Eggs

The legacy `#mainButton` moves from a fixed overlay into a normal, large, primary control directly under the ladder (P6). Content: `Click to Lay Eggs · +1 Chicken` (the legacy wording is `Click to Hatch +1 Chicken`; rename to "Lay" to match the "Lay Rate" stat and free "hatch" for later systems).

Add a **manual-share readout** beneath it: `manual clicks: 12 · 0.4% of income`. In legacy, clicking is `+1` flat while income is exponential, so the button becomes decoration within minutes — surfacing the share is honest about that and gives a clear hook for a future "click power" upgrade line without committing to one here.

### Zone D — Eggs Discovered (dex)

Kept, because the legacy dex is the one place players see the full 19-egg shape of the game — but demoted to a **collapsed summary bar** by default, expanding into a responsive list (not the legacy 3 fixed 300px columns, `style.css:53-57`).

Summary bar: `19 discovered · 12/19 promoted` + `[Show dex ▾]`.

Expanded rows (one per egg, `{#each}`):

| Column | Content |
|---|---|
| Sprite | egg image |
| Name | `eggData[i].name` + `Egg` |
| Value | `eggData[i].value`, formatted |
| Discover | `eggData[i].discoverReq` |
| Unlock | `eggData[i].unlockReq` |
| Status | `✓ promoted` / `current` / `locked` |

Sort toggle: **by tier** (default) or **by value**. This is the "useful information" the legacy grid had no room for.

---

## 5. What is deliberately *not* on the Egg tab

Restraint is part of the redesign. The following belong to their own tabs and appear here only as chips or links:

| Not on Egg tab | Where it lives | How the Egg tab references it |
|---|---|---|
| Research purchase buttons | Research tab | breakdown row shows `Research ×N` (Zone A) |
| Buy-amount / automator toggles | Research tab | a small `⚙` chip when auto-promote is on |
| Epic research / Soul-Prophecy spend | Prestige tab | `Soul ×N` factor in breakdown; a chip when `soulEggs` can be spent |
| Contracts | Contracts tab | chip: active contract name, or `📜 3 contracts available` |
| Planet discovery / journey | Eggspeditions tab | on-planet banner (B4) + `Planet ×N` factor |
| Ascension / artifacts / harvesters | Ascension tab | breakdown row factors; chip when ascendable |
| Settings | Settings tab | — |

---

## 6. Component & state plan

### 6.1 Components

Following the `Research.svelte` pattern (`tiers = commonByTier()`, local `collapsed` bindable array, SCSS with `@use '$lib/styles/variables' as *`):

| Component | Responsibility | Props |
|---|---|---|
| `Egg.svelte` | Zone composition, owns local UI state | — |
| `FarmConsole.svelte` | Zone A | `egg`, `income`, `layRate`, `chickenGain`, `breakdown`, `chips` |
| `PromotionLadder.svelte` | Zone B1 ladder rail | `eggs`, `currentEgg`, `unlockedEgg`, `onSelect` |
| `NextEggCard.svelte` | Zone B2/B3/B4 | `next`, `progress`, `canPromote`, `onPromote`, `planet?` |
| `LayEggsBar.svelte` | Zone C | `clickValue`, `clicks`, `manualShare`, `onClick` |
| `EggDex.svelte` | Zone D | `eggs`, `unlockedEgg`, `currentEgg`, `open`, `sort` |
| `StatReadout.svelte` | reusable labelled `LABEL value` cell (Zone A + D) | `label`, `value`, `color?` |

`StatReadout` and the progress bar are the only two primitives worth generalising now; the Research tab already contains the same "grid + collapse-all" idiom, and a future shared `TierGrid`/`ProgressBar` in `src/lib/components/` would let both tabs stay consistent.

### 6.2 Deriving the numbers once

The legacy failure mode is that the *same* derived value is recomputed in `main.js`, `update.js`, and `egghandler.js`. For the rebuild, add to `src/lib/scripts/EggManager.js` (currently empty):

```js
// EggManager.js — pure derivations, no DOM, no $state writes
export function eggCount()                        // eggData.length
export function currentEgg(state)                 // eggData[state.indexValues.currentEgg]
export function eggValue(state)                   // base × eggValueBonus
export function valueBonusBreakdown(state)        // { research, epic, soul, artifacts, gems, planet }
export function incomePerSecond(state)            // value × soulBoost × chickens × layRate
export function discoverProgress(state, nextEgg)  // 0..1  (legacy update.js:17)
export function unlockProgress(state, nextEgg)    // 0..1  (legacy update.js:18)
export function canPromote(state)                 // money ≥ unlockReq && !onPlanet && !contractActive
export function hatchClickValue(state)            // currently 1
```

`Egg.svelte` then becomes a pure view over `data` + these selectors — no `console.log` in the component body (a leftover currently in `Research.svelte:47`), no inline ternaries, no ID-based DOM writes.

### 6.3 State this design requests from `DataManager`

The current `DefaultDataObject()` (`DataManager.svelte.js:4-63`) is missing three things the Egg tab needs, all of which the legacy `data` object also lacked:

1. **`indexValues.unlockedEgg` exists but is never sized.** Legacy used `new Array(18).fill(false)` for a 19-entry catalog (`data.js:16`) — off by one. Rebuild must derive it: `new Array(eggData.length).fill(false)`.
2. **`indexValues.currentEgg` is a single index, and `onPlanet`/`currentPlanet` are separate.** Zone B4 needs an explicit `onPlanet` boolean plus `currentPlanet`, and the console needs to know *which* egg source is authoritative. Recommend `indexValues.planet: { index: -1, onPlanet: false }` so `-1` means home, matching but not mirroring legacy's mixed `onPlanet` + `currentPlanetIndex: -1` convention.
3. **Manual click counter.** `stats.clicks` (Decimal) — needed for the Zone C share readout and a future click-power upgrade. Legacy had no such counter; the button was fire-and-forget.

New `automation` / `stats` reads the tab wants (all already partially present or trivially derivable):
- `automation.autoPromote` (legacy `autoActive[?]` / `settingsToggles[3]` for the stop-at-Enlightenment rule, `update.js:60`)
- `stats.bestEgg` (`main.js:225-233`) — for the dex "best reached" badge
- `settings.toggles` for newsticker/notation are untouched by this tab

### 6.4 Styling

- SCSS module per component, `@use '$lib/styles/variables' as *`.
- Use `$majorColors` for the ladder node accents so the tab's colour language matches Research's tier rows.
- Zone A console: a bordered card (`$borderWidth` / `$borderRadius`) with a 2-column `grid` for the stat readouts; collapses to 1 column under `40em`.
- Ladder rail: `overflow-x: auto`, `scroll-snap-type: x proximity`, node chips at fixed width. No JS scroll logic.
- The `global.scss` `* { background-color: $bg-color }` rule (line 16-20) fights nested cards exactly as noted in `Research.svelte:102-106`; the same `> * { background-color: transparent }` workaround applies, but preferably this is lifted into a shared `.card` class in `global.scss` so every future tab stops re-implementing it.

---

## 7. Mapping to the legacy behaviour (nothing lost)

| Legacy capability | Location in legacy | New home |
|---|---|---|
| Current egg sprite + name | `currentEggImg` / `currentEggText` | Zone A |
| Unit value + `eggValueBonus` | `currentEggText` line 2 | Zone A (value + bonus) + breakdown |
| `$X/s` | `currentEggText` line 3 | Zone A INCOME |
| Lay rate | `currentEggText` line 4 | Zone A EGG RATE |
| Chicken gain | `currentEggText` line 5 | Zone A CHICKENS |
| Next egg sprite + name | `nextEggImg` / `nextEggText` | Zone B1 ladder + B2 card |
| Next egg unlock req | `nextEggText` | Zone B2 UNLOCK bar + requirement |
| Next egg value | `nextEggText` | Zone B2 footer |
| "Not Discovered" gate | `egghandler.js:150-151` | Zone B1 locked node + B2 discover bar |
| Final-egg special case | `egghandler.js:153-159` | Zone B3 |
| On-planet fork | `egghandler.js:162-169` | Zone B4 (replaces, doesn't overwrite) |
| 19-egg dex visibility | `eggHold0..17` show/hide | Zone D |
| Promote button + 2 progress values | `eggPromoteButton`, `update.js:14-21` | Zone B2 |
| Click to hatch | `mainButton`, `main.js:15` | Zone C |
| Header egg + promote duplication | `currentEggImgHeader`, `eggPromoteButton` in `#mainHeader` | Header keeps the promote affordance (see `Header.svelte`); Zone B2 is the *informed* promote |

> Note: the legacy header (`#mainHeader`, `index.html:40-47`) **duplicates** the promote control and the current-egg sprite. The rebuild's `Header.svelte` currently hard-codes `Promote to Next Egg!` and `Gilded.png`. The Egg tab redesign should decide, with the Header owner, that the header shows a *quick* promote (sheet-free) while Zone B2 shows the *informed* promote (with progress). Both must share one `canPromote` selector so they can never disagree.

---

## 8. Phasing

| Phase | Deliverable | Depends on |
|---|---|---|
| **1** | `EggManager.js` selectors + `data` additions (§6.2, §6.3) | `DataManager` array sizing fix |
| **2** | Zone A console + Zone C button — the "playable" tab | Phase 1 |
| **3** | Zone B ladder + next-egg card (both progress bars) | Phase 1, egg sprites in `static/Images/Eggs/` (already present) |
| **4** | Zone D dex (collapsed by default) | Phase 3 |
| **5** | On-planet variant (B4) + status chips | Eggspeditions tab existing |
| **6** | Breakdown popover + shared `ProgressBar`/`StatReadout` extracted to `src/lib/components/` for reuse by Research | Phase 2 |

---

## 9. Open questions for the maintainer

1. **Hatch vs Lay.** Legacy calls the action "Hatch" but the rate stat is "Lay Rate". Renaming the button to "Lay Eggs" is proposed here; confirm the game's voice.
2. **Click value.** This design surfaces the manual-click share rather than fixing it. Should the tab also propose a click-power research line (making Zone C permanently relevant), or is manual clicking intentionally cosmetic?
3. **Dex default state.** Collapsed by default is proposed to give Zone B room on mobile. If the dex is a core collection feature, it may deserve its own sub-tab instead.
4. **Planet eggs in the ladder.** Should the ladder show the 6 planet eggs inline when travelling, or keep Zone B strictly the home-egg progression with B4 as the only planet surface?
5. **Breakdown detail.** Group-level factors (`Research ×2.10`) or per-research contributory factors (18 rows)? Group-level is proposed; per-research is a bigger "why is my number this" tool but risks becoming a second Research tab.
6. **Colour semantics.** The legacy Egg tab uses no colour on egg values; the ladder proposes `$majorColors`. Confirm that the palette is reserved for tier/state language across tabs.

---

## 10. Summary of concrete changes vs. legacy

| Legacy | Proposed |
|---|---|
| 20 duplicate `currentEggImg` IDs | `{#each}` with per-egg unique keys, zero ID reuse |
| 19 hard-coded dex rows toggled by `display` | data-driven array from `eggData.length` (19), no off-by-one |
| 5-line `\n`-joined `<h4>` as telemetry | labelled stat readout + expandable multiplier breakdown |
| CSS-variable-only promote progress | two labelled progress bars with exact requirement values |
| Fixed-position 50%-wide Hatch button | in-flow primary "Lay Eggs" control + manual-share readout |
| Next-egg panel overwritten on planet | dedicated planet-run card |
| Inert dex images | per-egg detail popover + sortable dex table |
| Total silence about other systems | status chips + factor groups that name the other systems |
