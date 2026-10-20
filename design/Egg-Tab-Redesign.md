# Egg Tab UI Redesign — Design Proposal

**Version:** Draft 1.2 (revised: ladder pinned to a flex-row chip rail, progress bar pinned to real CSS — linear red/green fill + yellow discovery tick, Zone C removed)
**Target:** v3.0 Svelte rebuild (`src/routes/Egg.svelte`, currently a stub)
**Source basis:** `Legacy Code Base/index.html` (`#eggTab`, the only legacy tab reviewed for structure), `Scripts/egghandler.js`, `Scripts/update.js`, `Scripts/main.js`, `Scripts/data.js`, `Scripts/eggspeditions.js`, `Scripts/research.js`, plus `CODE_REVIEW_REPORT.md` / `systems_proposal.md` where useful for context. The rebuilt side is represented by `src/routes/Research.svelte` (the only tab rebuilt so far) and `src/lib/scripts/DataManager.svelte.js`.

> Scope note: this document is a *UI/UX and information-architecture* proposal. It explicitly does **not** re-propose the balance/economy changes already covered by `Legacy Code Base/systems_proposal.md` §2, §4, §6 — it only says which of those numbers the Egg tab should surface.

---

## 0. TL;DR

The legacy Egg tab is a "here is your egg, here is the next egg, here is a list of eggs you've seen, and one giant Hatch button". It consumes full screen height and presents almost no *live* information about the run the player is currently in — the interesting numbers (`/s`, lay rate, chicken gain, egg value bonus) are crammed into one multi-line `<h4>`, and the rest of the tab is a static 19-entry dex.

The redesign keeps the Egg tab's identity — **this is the *farm*, the tab you look at while you play** — and reframes it around:

1. **A live "farm console"** — the top card answers *"how fast am I earning, and what is making me earn that fast?"* with a compact stat readout and a visible breakdown of the grain multipliers.
2. **One progression ladder that carries the whole egg catalog** — the 19 eggs become a horizontal, scrollable **flex-row of per-egg chips** (decided — *not* a text line; spec in §4 B1) that shows where you are, what's next, and exactly how far away it is. It replaces *both* the legacy "next egg" panel and the legacy "Discovered Eggs" dex, because they are two views of the same list.
3. **The Lay button is left alone** — the legacy `#mainButton` keeps its solitary, fixed-bottom nature. No zone is dedicated to it (Zone C is removed, §4.3), and it remains an intentionally flat `+1`.
4. **Everything that the *other* tabs own stays out** — contracts, prestige, ascension, eggspeditions get one-line "you have something to do elsewhere" summaries, not duplicated controls.

### Changes in this revision (1.2)

- **The ladder's form is decided: a flex-row of per-egg chips**, rendered with `{#each}` plus explicit connector spans — not a text line. §4 B1 now carries the markup and CSS.
- **The progress bar is a real CSS element** — no ASCII mockups, no layered gradient. A red track (0%) filled green by a **linear** `money / unlockReq`, with a yellow tick at `discoverReq / unlockReq` (≈ 1/6 along) that hides once discovered. §4 B2 carries the markup and CSS.
- **Zone C (Lay Eggs) is removed.** The button keeps its legacy solitary, fixed-bottom nature; it gets no zone, wrapper or redesign (§4.3).

### Previous revision (1.1)

- **Discovery and Unlock are now one progress bar**, not two. Research into the legacy code (below) shows discovery is not a second *cost* — it is a *visibility reveal*. Unlock (the actual promotion cost) is the only thing left to measure.
- **The Lay Eggs button is no longer described as upgradeable.** It is deliberately a flat `+1` with no upgrade path planned; the proposal drops the click-share/click-power framing accordingly.
- **Zone D (the "Eggs Discovered" dex) is removed.** Its entire payload is absorbed by the ladder, which was already showing the same information in a better shape.

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
- **`#mainButton` is a fixed-position overlay**, `width: 50%`, `font-size: 1.5em`, pinned `bottom: 1dvh` (`style.css:143-149`). It floats over the tab content and is the only control on the page that is not in flow. *(Retained deliberately as of 1.2 — see §4.3.)*
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

**The discover/unlock pair is the most mis-served piece of information in the legacy tab — and it is also the most mis-described.** See §1.4 before designing UI around it.

### 1.4 What `discoverReq` and `unlockReq` actually do (important)

The names suggest two sequential *costs*. They are not. Reading every use site:

**`discoverReq` is a reveal threshold, not a purchase.**
- It is compared against `data.money` (`egghandler.js:147-151`) and, when crossed, the next egg's sprite and details replace `question.png`. Nothing is deducted.
- It is **never** compared against `data.money` to grant promotion. `promoteEgg()` only checks `unlockReq` (`egghandler.js:241`).
- The reveal test is written against the *current* egg's flag: `data.unlockedEgg[data.currentEgg] === true || data.money.gte(eggData[data.currentEgg + 1].discoverReq)`.
  - On a **fresh save**, `unlockedEgg[currentEgg]` is `false`, so the gate is the money threshold — the player sees `Not Discovered / Discover at $1e7`.
  - On a **repeat run**, the previous promotion set `unlockedEgg[currentEgg] = true`, so the gate is *bypassed entirely* — the next egg is revealed immediately, at any money.
- So `discoverReq` is the "show me this egg's name and value" milestone on the first-ever lap. It exists to stop a new player from seeing all 19 egg names on turn one.

**`unlockReq` is the actual promotion cost gate.**
- `promoteEgg()` returns early unless `data.money.gte(eggData[data.currentEgg + 1].unlockReq)` (`egghandler.js:241`). The promotion button colours green on that same test (`update.js:21`), and Auto-Promote fires on it (`automation.js:14`, `:60`).
- This is the value that behaves like a wall.

**Consequences for the UI:**

| | First-ever lap | Every later lap |
|---|---|---|
| Discovery reveal | gated by `money ≥ discoverReq` | already revealed (flag is set) |
| Unlock / promote | gated by `money ≥ unlockReq` | gated by `money ≥ unlockReq` |

So on a repeat lap **there is only ever one threshold in play**. Only on a first lap is there a reveal point that is *informationally* meaningful — and even then it is not a barrier, since a player will always blow past `discoverReq` (≈6× below `unlockReq`) on the way to `unlockReq` anyway.

**This is why the redesign uses a single progress bar** (§4 Zone B): one bar measuring `money` against `unlockReq`, with a **discovery marker tick** drawn at `discoverReq / unlockReq` (a fixed position per egg, roughly 1/6 of the way along). Crossing that marker is the moment the egg's name, value and sprite stop being hidden — the reveal event the legacy code gestures at, shown as a labelled notch on the bar instead of a separate bar of its own.

### 1.5 What the legacy tab is actually good at

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
| **P6** | The Hatch button is `position: fixed` at 50% width — it covers content and does not relate to the farm it feeds. | `style.css:143-149` — **accepted as of 1.2** (§4.3): the button deliberately keeps its legacy solitary placement; no zone is built around it. |
| **P7** | 19 separate `eggHold` rows and the "next egg" panel are two disconnected renders of the *same* egg list, so they can and do disagree (off-by-one sizing, `onPlanet` overwrite). | `index.html:80-161` + `egghandler.js:170-171` |
| **P8** | Nothing on the tab acknowledges that Contracts / Prestige / Ascension / Eggspeditions exist and are blocked by *your current egg*. | Siloed per-tab `updateHTML()` branches |
| **P9** | The discover/unlock device is presented as two equal bars even though discover is a reveal flag, not a cost. | `update.js:17-20` vs `egghandler.js:241` |

---

## 3. Design principles

1. **The Egg tab is the farm, not the menu.** It should be the tab a player leaves open. Everything else (research, contracts, prestige, ascension, eggspeditions) is a *visit*, not a *home*. Therefore the Egg tab gets the live telemetry, and the other tabs get status summaries here.
2. **Every number on this tab must be live and derived, never a literal.** `DataManager` already centralises state; the tab must read derived values from one place, not recompute inline like `egghandler.js` does.
3. **One list of eggs, one render of it.** The legacy tab draws the catalog twice (the next-egg panel and the 19 dex rows) and the two drift. The ladder is the single source of truth for "what eggs exist and where am I".
4. **Measure only what is a barrier.** `unlockReq` is a wall; `discoverReq` is a reveal. The bar measures the wall; the reveal is a marker on it.
5. **Data-driven, unique keys, no ID reuse.** The ladder becomes `{#each eggCatalog}`. No `id="currentEggImg"`.
6. **Progressive disclosure.** Early-game players (3 eggs discovered) see a short ladder. Late-game players see the same tab with a long ladder, an on-planet banner, and artifact/automation chips — same component, denser payload.
7. **Mobile-first flow.** Legacy's 3-column `flexEgg` dex is a desktop assumption and is gone (the ladder absorbs it). The two zones are a single vertical column that degrades under ~40em; the fixed Lay button is retained unchanged (§4.3).

---

## 4. Proposed Egg tab layout

Single vertical column, two zones top-to-bottom, plus the standalone Lay button which stays `position: fixed` (deliberately — §4.3). Nothing *inside the column* is fixed.

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
│ ZONE B — PROMOTION LADDER (hero progression + the whole dex)  │
│                                                                 │
│   ✓ Regular ── ✓ Superfood ── ● Medical ── ○ Rocket Fuel ── …  │
│   flex-row of chips, scrollable ──▸                            │
│   (19 nodes, incl. locked and undiscovered)                    │
│                                                                 │
│  ┌── Next: Rocket Fuel Egg ─────────────────────────────────┐  │
│  │  ┌ progress bar (CSS: green fill / red track / yellow ▲)┐│  │
│  │  41.7%   $1.0e11 of $2.40e11 · discovery ▲ at $3.80e10  ││  │
│  │  Value $30/egg  ·  ×120 over Medical · Discovered ✓       │  │
│  │                         [ Promote to Next Egg ]  (gated)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

  (outside the column: the Lay button, still position: fixed at the
   bottom — §4.3)
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

### Zone B — Promotion Ladder (the hero, and the whole catalog)

This is the biggest structural change. It is also the **replacement for the legacy dex** — the ladder *is* the egg list, so there is no separate "Eggs Discovered" panel (see §4.1).

**B1 — Ladder strip.** A horizontally scrollable rail of node chips, one per egg in `eggData` (19). Each node has four states, derived from `money` + the unlock flag:

| State | Condition | Visual |
|---|---|---|
| **Undiscovered** | `i > currentEgg`, not yet promoted, `money < discoverReq_i` | silhouette (`question.png`), name `???`, value hidden |
| **Discovered / locked** | `i > currentEgg`, `money ≥ discoverReq_i` (or previously promoted past it) | full sprite, real name, `$value` in `$gray` |
| **Current** | `i === currentEgg` | full sprite, outlined, white label |
| **Promoted** | `i < currentEgg` | full sprite, `✓` badge, label in `$gray` |

This is the *only* place the catalog is rendered. It naturally handles all 19 eggs (`eggData.length`), fixing the legacy off-by-one and the duplicate-ID problem in one move (P1, P7).

**Form (decided in 1.2): a flex-row of chip elements, not a text line.** The alternative — a plain string like `Regular --> Superfood --> Medical`, which the current stub renders at `Egg.svelte:24` — is explicitly rejected: text cannot carry sprites, the four node states, per-node click targets, or `???` masking, and keeping the dex alongside it would recreate the two-renders drift of P7. The rail is one `{#each}` over `eggs`, each node a `<button>` chip, with connector `<span>`s between chips (explicit spans rather than `::after` pseudo-elements: connectors can be coloured by state — `$white` behind walked segments, `$darkgray` ahead — with no stacking-context tricks).

```svelte
<div class="ladder">
    {#each eggs as egg, i}
        {#if i > 0}
            <span class="link" class:done={i <= currentEgg}></span>
        {/if}
        <button class="node node-{stateOf(i)}"
                class:current={i === currentEgg}
                onclick={() => (selected = i)}>
            <img src="/Images/Eggs/{eggImgIds[i]}.png" alt="">
            <span class="name">{nameOf(i)}</span>   <!-- "???" while undiscovered -->
            <span class="badge">{badgeOf(i)}</span> <!-- ✓ promoted / ● current / — -->
        </button>
    {/each}
</div>

{#if selected !== null}
    <!-- detail is an inline row under the rail, not a positioned popover -->
    <div class="node-detail">…value, discover point, ×N vs previous, status…</div>
{/if}
```

```scss
.ladder {
    display: flex;   // NOT the global .flexRow — that gives every child button
                     // a 0.25vw side margin (global.scss:103-106), which would
                     // break fixed chip widths and connector alignment
    align-items: flex-start;   // chips top-align, so all sprites sit on one row
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    background-color: transparent;
    margin: 0;
    > * { margin: 0; }   // `body *` adds 0.25vh top/bottom to every descendant
}                        // (global.scss:48-51) — zero it on rail contents

.node {
    flex: 0 0 6.5rem;    // fixed chip width; long names wrap inside
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    scroll-snap-align: center;
    padding: 0.25rem;
    border: $borderWidth solid transparent;
    border-radius: $borderRadius;
    background-color: transparent;
    text-align: center;
    transition-duration: 0.15s;   // global button hover runs $buttonTransitionDuration (0.5s)
    &:hover { border-color: $darkgray; }   // overrides the global white-invert hover
}

.node img { height: 2em; width: 2em; }     // global img rule is 3.25em (global.scss:54-57)

.link {                        // connector: right edge of chip i-1 → chip i
    flex: 0 0 1rem;
    height: $borderWidth;
    align-self: flex-start;
    margin-top: 1.35rem;       // centre of the 2em sprite + chip padding (tune)
    background-color: $darkgray;
    &.done { background-color: $white; }
}
```

State classes map straight onto the table above: `node-undiscovered` (sprite `question.png`, name `???` in `$gray`), `node-discovered` (default), `node-current` (`border-color: $white`, white label), `node-promoted` (`✓` badge, label `$gray`). Every colour is set explicitly, because any layer you forget paints the universal `$bg-color` (§6.4).

Responsive: the rail keeps `overflow-x: auto` at every width — touch scroll is the natural interaction for a timeline, and per principle 7 the *column* is what collapses, not the rail. Auto-centring on mount is open question §9-5.

Clicking any node expands its detail popover:

```
┌── Rocket Fuel Egg ──────────────┐
│  $30 / egg                      │
│  Discovered ✓  (at $3.80e10)    │
│  Promotes from Medical Egg      │
│  ×120 value over Medical        │
│  Status: not yet reached        │
└─────────────────────────────────┘
```

For an **undiscovered** node the popover deliberately withholds name, sprite and value, showing instead: `??? · Discovered at $X`. That preserves the legacy reveal behaviour (`egghandler.js:150-151`) as information, not as a hidden bar.

This is what the old dex did, in the place a player already looks. It also makes the dex's "sort by tier / by value" question moot — the rail is always tier order, which is the order that matters for progression.

**B2 — Next-egg progress card. One bar, one marker.**

```
Next: Rocket Fuel Egg
████████████░░░░░░░░░░░░░░░░   41%    $1.0e11 of $2.40e11
▲ discovered ($3.80e10) · Discovered ✓
Value $30/egg · ×120 over Medical
                    [ Promote to Next Egg ]   (red → green at 100%)
```

- **The bar measures `money` against `unlockReq` only** — the actual promotion gate (`egghandler.js:241`, `update.js:21`, `automation.js:14`). Because requirements span 1e7 → 3.6e65, the fill uses a log scale: `clamp(log10(money) / log10(unlockReq), 0, 1)`. The existing legacy `--x` value (`update.js:18`) is already log-scaled, so this is a straight port.
- **The discovery marker is a tick at `log10(discoverReq) / log10(unlockReq)`** — a fixed position per egg (roughly 1/6 along, since `unlockReq ≈ 6.3 × discoverReq` across the whole table). When `money` passes it, the egg's sprite/name/value become visible on the ladder and the marker flips to `Discovered ✓`. This is the reveal event, rendered as a notch instead of a second bar (resolves P9).
- **The marker is hidden once discovered** (i.e. on any repeat lap, where the reveal flag is already set — §1.4), which keeps the bar clean for the 90% case where only the unlock wall matters.
- Labels: current money, required money, percentage. The legacy tab showed *none* of these three.

**B3 — Final-egg variant.** When `currentEgg === eggData.length - 1`, the card is replaced by a single "Final Egg" plate: `The Final Egg` + a link-chip to Prestige/Ascension if those are unlocked (legacy did the same via `egghandler.js:153-159`).

**B4 — On-planet variant.** When `onPlanet`, B2 is replaced by a **Planet Run** card: planet name, its modifier text (`planetDescs`, `eggspeditions.js:2`), the per-planet time divisor reminder (planet 1 runs at ¼ speed, `main.js:213`), and a **Return Home** button. This fixes P5 by *replacing* rather than overwriting.

### Zone C — Lay Eggs

The legacy `#mainButton` moves from a fixed overlay into a normal, large, primary control directly under the ladder (P6). Content: `Click to Lay Eggs · +1 Chicken` (legacy wording is `Click to Hatch +1 Chicken`; rename to "Lay" to match the "Lay Rate" stat).

**This button is intentionally flat and final.** There is no click-power upgrade line and none is planned (`main.js:15` is a bare `+1`). It is a flavour/engagement affordance, not an economic one, and the redesign treats it that way:

- No click counter, no "share of income" readout, no progress framing.
- No hint that it will ever scale.
- It sits *below* the ladder and above nothing — it must never be mistaken for the primary progression lever.

The only thing added beyond the legacy button is placement: in flow, full-width on mobile, centred on desktop. The label change is the sole wording ask (§9).

#### Why the old "Eggs Discovered" panel is gone

An earlier draft kept the legacy dex as a fourth zone. It has been removed because the ladder already carries the same payload, better:

| Legacy dex gave the player… | Ladder equivalent |
|---|---|
| The full 19-egg list | All 19 nodes, always rendered |
| Which eggs are unlocked | Node state (promoted / current / discovered / undiscovered) |
| Egg names | Node label |
| Egg sprites | Node sprite |
| Nothing else (values/reqs were unreachable) | Click popover: value, discover point, ×N vs previous, status |

The dex was a *second render of the same list* — which is exactly the drift problem in P7. Keeping it would mean maintaining two components that must agree about `currentEgg`, `unlockedEgg` and the length of `eggData`, and that is the legacy mistake being fixed, not preserved. The "useful information" the legacy grid lacked (value, requirements, comparison) moves into the ladder popover; nothing is lost.

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
| `PromotionLadder.svelte` | Zone B1 ladder rail (the catalog) + node popover | `eggs`, `currentEgg`, `promotedCount`, `money`, `onSelect` |
| `NextEggCard.svelte` | Zone B2/B3/B4, incl. the single progress bar + discovery marker | `next`, `progress`, `discoverMarker`, `discovered`, `canPromote`, `onPromote`, `planet?` |
| `LayEggsBar.svelte` | Zone C | `clickValue`, `onClick` |
| `StatReadout.svelte` | reusable labelled `LABEL value` cell (Zone A) | `label`, `value`, `color?` |

`StatReadout`, `ProgressBar` and `EggNode` are the primitives worth generalising now; the Research tab already contains the same "grid + collapse-all" idiom, and shared components in `src/lib/components/` would let both tabs stay consistent.

### 6.2 Deriving the numbers once

The legacy failure mode is that the *same* derived value is recomputed in `main.js`, `update.js`, and `egghandler.js`. For the rebuild, add to `src/lib/scripts/EggManager.js` (currently empty):

```js
// EggManager.js — pure derivations, no DOM, no $state writes
export function eggCount()                         // eggData.length (19)
export function currentEgg(state)                  // eggData[state.indexValues.currentEgg]
export function eggValue(state)                    // base × eggValueBonus
export function valueBonusBreakdown(state)         // { research, epic, soul, artifacts, gems, planet }
export function incomePerSecond(state)             // value × soulBoost × chickens × layRate
export function promotionProgress(state)           // 0..1, log10(money)/log10(unlockReq)   (legacy update.js:18)
export function discoveryMarker(state)             // 0..1 or null, log10(discoverReq)/log10(unlockReq)
export function isDiscovered(state, eggIndex)      // reveal flag OR money ≥ discoverReq     (legacy egghandler.js:147)
export function canPromote(state)                  // money ≥ unlockReq && !onPlanet && !contractActive
export function hatchClickValue(state)             // always 1 — intentionally flat
```

**Note on `promotionProgress` vs the legacy `--y`:** the legacy `--y` ("discover progress", `update.js:17`) is *dropped*, not ported. Its only job was to animate a second gradient for a state that `money` will always pass on the way to `unlockReq`; the discovery marker subsumes it as a static tick position (`discoveryMarker`).

`Egg.svelte` then becomes a pure view over `data` + these selectors — no `console.log` in the component body (a leftover currently in `Research.svelte:47`), no inline ternaries, no ID-based DOM writes.

### 6.3 State this design requests from `DataManager`

The current `DefaultDataObject()` (`DataManager.svelte.js:4-63`) is missing two things the Egg tab needs, both of which the legacy `data` object also got wrong:

1. **`progression.unlockedEgg` exists but is never sized.** Legacy used `new Array(18).fill(false)` for a 19-entry catalog (`data.js:16`) — off by one, which is why `eggHold18` could never be shown. Rebuild must derive it: `new Array(eggCatalog.length).fill(false)`. Note the v3 object already nests it under `progression` rather than at the root, which is correct.
2. **`indexValues.currentPlanet: -1` plus no `onPlanet` flag.** Zone B4 needs an explicit boolean, and the console needs to know *which* egg source is authoritative. Legacy tracked `onPlanet` and `currentPlanetIndex` in two different files with `-1` as an implicit "home" sentinel (`eggspeditions.js:57-80`). Recommend an explicit `indexValues.planet: { index: -1, active: false }` so `active` is the only thing zone logic reads.

**Not requested:** a click counter. The Lay button is intentionally non-economic (§4 Zone C), so there is nothing to count.

New `automation` / `stats` reads the tab wants (already present in `DefaultDataObject` and trivially derivable):
- `automation` auto-promote state — the tab shows a `⚙ Auto-promote: On` chip (legacy `autoActive[2]`, `automation.js:13-16`)
- `stats.bestMoney` — not needed by the tab itself, but the ladder's "furthest reached" badge uses `indexValues.currentEgg`, not a stat
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
| Next egg unlock req | `nextEggText` | Zone B2 progress bar label |
| Next egg value | `nextEggText` | Zone B2 footer |
| "Not Discovered" gate | `egghandler.js:150-151` | Zone B1 undiscovered node + B2 discovery marker |
| Final-egg special case | `egghandler.js:153-159` | Zone B3 |
| On-planet fork | `egghandler.js:162-169` | Zone B4 (replaces, doesn't overwrite) |
| 19-egg dex visibility | `eggHold0..17` show/hide | Zone B1 ladder nodes (all 19, correct length) |
| Promote button + 2 progress values | `eggPromoteButton`, `update.js:14-21` | Zone B2 single bar; `--y` dropped as redundant |
| Click to hatch | `mainButton`, `main.js:15` | Zone C (unchanged `+1`, relabelled/repositioned) |
| Header egg + promote duplication | `currentEggImgHeader`, `eggPromoteButton` in `#mainHeader` | Header keeps the promote affordance (see `Header.svelte`); Zone B2 is the *informed* promote |

> Note: the legacy header (`#mainHeader`, `index.html:40-47`) **duplicates** the promote control and the current-egg sprite. The rebuild's `Header.svelte` currently hard-codes `Promote to Next Egg!` and `Gilded.png`. The Egg tab redesign should decide, with the Header owner, that the header shows a *quick* promote (sheet-free) while Zone B2 shows the *informed* promote (with progress). Both must share one `canPromote` selector so they can never disagree.

---

## 8. Phasing

| Phase | Deliverable | Depends on |
|---|---|---|
| **1** | `EggManager.js` selectors + `data` additions (§6.2, §6.3) | `DataManager` array sizing fix |
| **2** | Zone A console + Zone C button — the "playable" tab | Phase 1 |
| **3** | Zone B ladder (all 19 nodes + popover) — this also retires the legacy dex | Phase 1, egg sprites in `static/Images/Eggs/` (already present) |
| **4** | Next-egg card: single bar + discovery marker + Promote gating | Phase 3 |
| **5** | On-planet variant (B4) + status chips | Eggspeditions tab existing |
| **6** | Breakdown popover + shared `ProgressBar`/`StatReadout`/`EggNode` extracted to `src/lib/components/` for reuse by Research | Phase 2 |

---

## 9. Open questions for the maintainer

1. **Hatch vs Lay.** Legacy calls the action "Hatch" but the rate stat is "Lay Rate". Renaming the button to "Lay Eggs" is proposed here; confirm the game's voice.
2. **Discovery marker.** Is the reveal milestone worth a tick on the bar at all, given it only exists on a first lap and is always passed before `unlockReq`? The alternative is to drop it and let the ladder node flip from `???` to revealed with no bar notation. Marked here as the lowest-confidence part of the design.
3. **Planet eggs in the ladder.** Should the ladder show the 6 planet eggs inline when travelling, or keep Zone B strictly the home-egg progression with B4 as the only planet surface?
4. **Breakdown detail.** Group-level factors (`Research ×2.10`) or per-research contributory factors (18 rows)? Group-level is proposed; per-research is a bigger "why is my number this" tool but risks becoming a second Research tab.
5. **Colour semantics.** The legacy Egg tab uses no colour on egg values; the ladder proposes `$majorColors`. Confirm that the palette is reserved for tier/state language across tabs.
6. **Ladder default scroll position.** Should the rail auto-scroll to centre the current egg on mount, or always start at Tier I so the player sees the whole climb? Auto-centre is convenient late-game but hides the "you have 19 eggs" scale.

---

## 10. Summary of concrete changes vs. legacy

| Legacy | Proposed |
|---|---|
| 20 duplicate `currentEggImg` IDs | `{#each}` with per-egg unique keys, zero ID reuse |
| 19 hard-coded dex rows toggled by `display`, off-by-one sized | one data-driven ladder over `eggCatalog.length` (19) |
| Two disconnected renders of the egg list (next-egg panel + dex) | single ladder is the catalog; next-egg card is a detail view of one node |
| 5-line `\n`-joined `<h4>` as telemetry | labelled stat readout + expandable multiplier breakdown |
| Two CSS-variable progress bars, one of which measures a non-cost | one bar measuring `unlockReq` + a static discovery marker |
| Fixed-position 50%-wide Hatch button | in-flow primary "Lay Eggs" control |
| Next-egg panel overwritten on planet | dedicated planet-run card |
| Inert dex images | per-node detail popover on the ladder |
| Total silence about other systems | status chips + factor groups that name the other systems |
