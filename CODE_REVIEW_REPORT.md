# Coop Co — Legacy Codebase Review & Rewrite Plan

**Date:** 2026-09-22
**Scope:** `index.html`, `style.css`, `changelog.html`, `Scripts/*.js`, `Scripts/Internal/*.js`
**Lines reviewed:** ~5,500 JS + 674 HTML + 449 CSS
**Verdict:** The game is content-rich and a lot of fun, but the code is an unstructured, global-state-driven script pile. A rewrite is justified and recommended.

---

## 1. Executive Summary

Coop Co is a single-page idle game built with vanilla JS, a global `data` save object, and a `setInterval` game loop. It works — but through luck and manual discipline rather than architecture.

**Top problems:**

1. **Everything hangs off one mutable global `data` object** and a dozen other module-level globals. No modules, no encapsulation, no separation of logic from presentation.
2. **Game logic is fused with DOM code** — buttons are re-innerText'd every frame; features call `updateHTML()` from inside purchase functions.
3. **Magic indices everywhere** — research, eggs, artifacts, gems, planets and achievements are referenced by hardcoded integer indexes (`data.research[17]`, `getAchievement(48)`, `1e45`) coordinated across files with no constants or data-driven definitions.
4. **`eval()` in the newsticker** — both for message conditions and side-effect code. This is the most serious single issue (security + maintainability).
5. **Confirmed bugs** — an always-false planet condition, a wrong stat assignment, out-of-bounds achievement writes, an undeclared global, duplicate HTML IDs that break the DOM cache, and a stray second HTML document in `index.html`.
6. **No build tooling, no lint, no tests, no CI, no modules, no package.json.**

The rewrite thesis: keep the design, the content direction, and the assets; replace the implementation.

---

## 2. Confirmed Defects (Bugs)

| # | File:Line | Bug |
|---|-----------|-----|
| 1 | `Scripts/egghandler.js:203` | `if(data.currentPlanetIndex === 18)` — planet index maxes at 5; this branch can never run. The intent (Enlightenment/Xylok check) exists correctly elsewhere (`ascension.js:866`, `ascension.js:895`) as `data.currentEgg === 18 || data.currentPlanetIndex === 2`. |
| 2 | `Scripts/main.js:238` | `data.stats.bestKnowleggs = data.prophecyEggs` — the "Best Knowleggs" stat is being assigned the Prophecy Egg count. Compare line 237 and the actual value assignment in `ascension.js:440`. The stat is then displayed as Best Knowleggs at `main.js:310`. |
| 3 | `Scripts/data.js:25` | `achievements: new Array(48).fill(false)` but there are **53** achievement definitions. Indices 48–52 are written from `prestige.js:38`, `ascension.js:437`, `achievements.js:177-212`. Assigning them silently grows the array, and `getAchievementsCompleted()` (`achievements.js:85`) then divides by a moving `data.achievements.length` — completion percentages are wrong and several late achievements are untrackable. |
| 4 | `Scripts/contracts.js:105` | `index = prestigeContracts.length - 1` — `index` is never declared. A leaked global that only avoids a `ReferenceError` because sloppy mode auto-creates it. |
| 5 | `Scripts/newsticker.js:53` | The "1/1000 chance" news uses `getRandom(1,1000) === 1000`, but `getRandom` (`Utilities.js:39`) returns `[min, max)` — 1000 is unreachable. This message can never appear. |
| 6 | `index.html` (many) | **20 duplicate `id="currentEggImg"`** nodes plus repeats of `researchCol`, `epicResearchRow`, `legendaryResearchRow`, `planetRow`. `DOMCacheGetOrSet` (`Cache.js:6`) caches by ID and returns the **first** match, so many updates silently target the wrong element. |
| 7 | `index.html:665-674` | A stray second `<!DOCTYPE html><html>...</html>` document after `</html>` — invalid markup, dead code, breaks strict parsing/crawlers. |
| 8 | `Scripts/ascension.js:861-889` | `getActiveArtifactBoost` declares `currentArtifactBoost` once outside the loop and never resets it per iteration. When a loop iteration doesn't match the branch conditions, a stale boost value can be carried into `boostSum`. The same function is a tangle of overlapping conditionals (`data.currentEgg === 18 || data.currentPlanetIndex === 2` etc.) that should be one clean rule. |
| 9 | `Scripts/data.js:149` | `importSave()` uses shallow `Object.assign(getDefaultObject(), ...)` — nested structures (`stats`, `harvesters`, `planetData`) are replaced wholesale rather than deep-merged. An old/malformed save corrupts state silently. |
| 10 | `Scripts/contracts.js:119-141` | Contract escape resets research/money/egg but **not** `epicResearch` or planet state, while `prestige()` resets more. Reset logic is duplicated at least 5× (`prestige`, `promoteEgg`, contract exit, contract complete, `journeyToPlanet`) with **different field lists** — guaranteed drift. |

---

## 3. Security Issues

- **`eval()` in the newsticker** (`newsticker.js:53`, `:92`). Every ticker message has an arbitrary JS string evaluated for its condition, and each may carry a third element of executable code. Today the strings are authored files, but any compromise of the served script, or careless future authoring, becomes arbitrary code execution in the player's page. There is also no validation that the evaluated expression is a Boolean.
- **News is injected via `innerHTML`** (`newsticker.js:62`) with no sanitization; `<a href>` links are already in the dataset (`newsticker.js:10`).
- **Save import** (`data.js:137-152`) base64-decodes and `Object.assign`s arbitrary JSON onto the default object with zero validation/whitelisting.
- **No CSP** — inline styles, inline `onclick`, and `eval` mean the page couldn't ship behind a meaningful Content-Security-Policy today (`index.html:25`).

---

## 4. Code Smells

### 4.1 Global soup
Nearly every file declares top-level mutable state: `diff`, `soulEggGain`, `soulEggBoost`, `prophecyEggBoost`, `currentEggValue`, `eggValueBonus`, `chickenGain`, `layRate`, `planetBoosts`, `knowleggBoost`, `collectionBoost`, `knowleggGain`, `harvesterMaxLevel`, `selectedLoadout`, `selectingArtifactGem`, `prevEggValue`, etc. There is no ownership or lifecycle — one global reassigns another and ordering is implicit.

- `prestige.js:1-6` — five mutable globals plus a `softCapeAmts` array.
- `main.js:1` — `let diff = 0` mutated by the loop, read by hundreds of functions.
- `newsticker.js:43` — `let s = DOMCacheGetOrSet('news')` module-level DOM ref.
- `Formatting.js:75` — `neg = ...` creates an accidental global (no `let/const`).

### 4.2 Logic fused with DOM
- `research.js:286-295` runs **top-level side-effect code at script parse time**, writing button text before `window.onload` fires.
- `update.js` re-innerText's every purchase button every 60 ms tick, recomputing cost strings and class names frame after frame.
- `purchaseEpicResearch`/`purchaseLegendaryResearch` call `updateHTML()` inside purchase loops (`research.js:362`, `research.js:376`).
- Tab/sub-tab navigation is index/`innerText`-driven (`main.js:262-277`) rather than state + templates.

### 4.3 Magic numbers & stringly typed
- Balance thresholds as literals: `1e45` (ascension), `1e6` prophecy softcap, harvester cap `20`, cost `1.65`, run time `5 * level`.
- Panel/feature IDs as strings: `'artifact'`/`'gem'` typed via `switch(type)` (`ascension.js:477-512`, `:665-686`) instead of data.
- Research count `28`, planet count `6`, artifact count `24`, gem count `18`, achievement count `48` are re-asserted by hand in reset functions in multiple files (`prestige.js:43`, `ascension.js:446-448`, `egghandler.js:247`, `contracts.js:130`). Add one research and five resets silently break.

### 4.4 Dead code / leftovers
- `automation.js:41-72` — an entire alternative implementation commented out.
- `research.js` duplicated cost-loop blocks at top level (lines 286-295 and 351-355) both executing at load.
- `ascension.js:304` — `const ingredients = []` is unused; `main.js:101-110` contains commented-out ingredient generation.
- `data.js:172-174` — commented-out theme code.
- `Formatting.js:42-71` — a fully commented-out `formatSci` implementation.
- `contracts.js:106-110` — large commented-out reward formula.

### 4.5 Inconsistent naming & style
- `eggspeditions.js` vs `eggspeditionButton` vs `eggspeditionsTab` — enthusiastic but inconsistent misspelling.
- `desc` (`research.js`, egg data) vs `description` (`legendaryResearches`, `research.js:243`).
- `Decimal.dZero` / `D(0)` / `decimalZero` / `Decimal.dTen` / `D(10)` all intermingled.
- Mixed whitespace, semicolon-less vs semicolon styles, `var`-era and modern syntax in the same file.
- Single-letter/undersized names: `r${i}`, `er${i}`, `lr${i}`, `ba${i}`, `setTog${i}`, `s`, `acc`, `ex`.

### 4.6 Fragile patterns
- `createPrompt`/`createConfirmation` (`main.js:323-378`) clone-and-replace DOM nodes to reset event listeners — works, but a code smell that signals poor listener management.
- `notifications.js:11` — `getRandom(0,100000)` for notification IDs invites collisions, then a full DOM scan (`getElementsByClassName`) to locate each node.
- `main.js:54-55` / `70-71` — two click handlers attached to the same slot elements with intertwining responsibilities (hover text + selection).

---

## 5. Coupling & Architecture

**Cohesion is low, coupling is maximal.** Every module reaches into every other module's globals.

Concrete coupling chains:

- `main.js:mainLoop()` calls `updateResearch()`, `updateEggValueBonus()`, `updateIntHatch()`, `updateLayRate()`, `updatePrestige()`, `updateAscension()`, `updateAutomation()` — each of which independently recomputes overlapping derived values and pokes the DOM.
- Costs are recomputed in **three places** for the same currency: top-level at load (`research.js:286-355`), in `updateResearch()` (`research.js:327-348`), and in `purchaseResearch()`. All must agree.
- `getActiveArtifactBoost`/`getActiveGemBoost` couple the Reliquary to every production system (egg value, hen rate, chicken gain, research cost, prestige) via its own global getter call scattered across `egghandler.js`, `prestige.js`, `research.js`.
- `updateHTML()` couples every game system to `data.currentTab` to decide which subset of the DOM to touch.
- Achievement checks run every tick (`main.js:249`) and reach into `collectionBoost`, `data.harvesters`, `data.artifacts`, `data.gems` — an achievement system that knows the shape of every other system.

**Result:** changing one formula means chasing 5+ coordinated edits across 7 files; the recent history (`git log`) shows exactly this churn and the "fix config" / "trying stuff" commit messages.

---

## 6. Save System

- Full-object `JSON.stringify` into `localStorage` (`data.js:83`), auto-saved every 30 s (`data.js:153-155`).
- Migration is a recursive key-copy `fixSave()` (`data.js:110-124`) that assumes schema drift only adds keys. Removing/renaming a field silently orphans data; type changes (`Decimal` ↔ number) are only partially coerced.
- `importSave` doesn't reuse `fixSave` — it uses shallow `Object.assign` (`data.js:149`), giving two different merge semantics.
- Export is raw `btoa(JSON)` with no checksum/version envelope — trivial to corrupt, impossible to version.
- `data.stats` mixes Decimals and plain booleans/strings; `timePlayed` et al. are stored as Decimals while loop `diff` is a plain number — a running type hazard.
- Save `time` is wall-clock; offline progress is granted regardless of tab/visibility throttling with no offlining/trading model.

**Recommendation for rewrite:** typed schema + versioned envelope + schema-bound migrations + `fixSave` removed entirely.

---

## 7. UI / HTML / CSS

- 674-line monolithic `index.html` with inline styles and inline `style=` attributes throughout; behavior and presentation scrambled together.
- **20 duplicated `currentEggImg` IDs** (see Bug #6) — the DOM cache returns the first; the feature author clearly discovered a partial failure and "solved" it with more writes.
- Hardcoded avatar hotlinks in credits (`index.html:553-583`) — an external request per load, and a privacy/tracking surface.
- CSS: reasonable theming via CSS variables (`style.css:6-18`), but ~78 button-state classes (`.redButton`, `.redButtonHeader`, `.redButtonPromote`, `.redButton-hover`…) that individually restage the same border rules. State is encoded in class names assembled by string in JS.
- Responsiveness was added retroactively (media query at `style.css:288-292`); layout is fragile flexbox with magic em/vh values (`.contractHolder` fixed `height: 25em`, `#mainButton` fixed width).
- Notification, prompt, alert and confirm are four hand-rolled modal systems (`index.html:14-39`).
- Accessibility: no ARIA, images-only achievements/planets, color-only button states, no keyboard model, `user-select: none` globally.
- The `changelog.html` is a separate static doc; fine.

---

## 8. Performance & the Game Loop

- One global `setInterval(mainLoop, 60)` (`main.js:396-398`) — ~16.7 fps — that lists ~10 update functions and a full `updateHTML()` **every tick, including hidden tabs**. Hundreds of DOM reads/writes per frame.
- No `requestAnimationFrame`, no visibility check, no dirty-flagging. In a background tab browsers throttle `setInterval`, making "time away" math drift against `data.time`.
- The news ticker is the one place a visibility check was added (`newsticker.js:44`), but only for scroll restart, not the loop.
- Micro-optimizations (comparing `getAttribute('src')` before `setAttribute`) sit beside quadratic scans (`notifications.js`) — inconsistent priorities, no profiling.
- Derived-state recomputation (`eggValueBonus`, `layRate`, costs, boosts) is recomputed from scratch every tick even when nothing changed.

---

## 9. Testing, Tooling & Maintainability

- **No** `package.json`, lint config, type checker, unit tests, CI, or build step. `README.md` is 3 lines pointing at VS Code Live Server.
- ~62% of commits are by two authors, with many "fix"/"trying"/"should be last fix" log messages — evidence of blind bug-hunting in an untestable codebase.
- No error boundary: any `getElementById` miss returns `null` → `.classList` access throws; script order is load-order-dependent (`index.html:645-662`) with implicit cross-file dependencies.
- No documentation of formulas, balance philosophy, or event flow.

---

## 10. What's Good (Keep These Ideas)

- **Fun, coherent content design**: prestige → soul eggs → prophecy eggs → contracts; eggspeditions → planets; ascension → knowleggs → legendary research → artifacts/gems/harvesters → loadouts. The progression ladder is solid.
- **Big-number handling** via Break_Eternity (vendored, works).
- **DOM ref cache** concept (`Cache.js`) — the right instinct, defeated by duplicate IDs.
- **Buy-max / cost-curve math** (`getTotalCost` in `Utilities.js:74`) — geometry-aware bulk purchasing is done reasonably.
- **News ticker** personality, **notifications** system idea, and **help accordion** content.
- **CSS variables** for palette; the "planet" system (finite boosts per planet + persistent planet state) is a strong hook for new content.
- Compatibility-minded thinking (iOS viewport fixes in history).

---

## 11. Case for a Full Rewrite

Incremental refactor is possible but would touch nearly every function across 14 files **while preserving** the tangled globals, stringly indices, and missing seams. The coupling is in the data model itself (one blob, magic indices), so the rewrite is not a luxury — it's the cheaper path. Do not attempt a line-by-line port; reimplement the *design* on a clean foundation. Note: a full save wipe (or a deliberate migration harness) will be needed; the current save format should be treated as legacy input, with a one-time import path.

---

## 12. Rewrite Plan of Action

### Phase 0 — Decide the stack (Week 1)
- **Language/Tooling:** TypeScript is the single highest-value addition (indexed access, optional fields in save, refactors). If adding a build step is undesirable, choose strict-JSDoc JavaScript with `// @ts-check`, but TypeScript is strongly recommended.
- **Framework:** Vanilla TS + a tiny state→DOM render approach (not React/Vue) keeps the game lightweight and matches the genre (most idle frameworks use vanilla + break\_eternity). If the team prefers components, a minimal reactive layer (e.g. Preact) is acceptable.
- **Module system:** ESM (`type="module"`), no more global `data`.
- **Tooling:** `npm` + Vite (dev server + build), ESLint, Prettier, Vitest, GitHub Actions CI. Break\_Eternity.js via npm (`break_eternity.js`) instead of vendored copy.

### Phase 1 — Foundation (Weeks 2–4)
1. **GameState store** — a single `SaveData` interface with a *versioned envelope*: `{ version, player, meta, checksum }`. One `createInitialState()`, one `validateAndMigrate()` chain, no `fixSave` recursion.
2. **Systems as pure modules** — each system owns a slice:
   - `economy` (money/soul/prophecy/knowlegg production),
   - `research` (common/epic/legendary) driven by *data arrays* (port `research.js` data into typed arrays),
   - `eggs` (promotion graph),
   - `eggsplanets`, `contracts`, `ascension/reliquary`, `automation`, `achievements`, `stats`.
   - Systems expose `recalc()` / `tick(dt)`/mutators; derived values (boosts) live in a `derived` record recomputed on *invalidation*, not every frame.
3. **Game loop** — `requestAnimationFrame` + fixed-timestep accumulator; `tick(dt)` for logic, render only on dirty flags; pause/hide when `document.hidden` (and decide an offline-gain model).
4. **Event system** — decouple "achievement unlocked", "contract completed", "harvester finished" from their producers via a typed event bus (also the channel for notifications).
5. **Constants & data** — one `content/` folder of typed data (eggs, research, planets, artifacts, gems, achievements, contracts, news). Every magic number becomes a field.

### Phase 2 — UI (Weeks 5–7)
1. **Component / template approach** — HTML generated from data with stable unique IDs; eliminate the duplicate-ID class of bugs entirely (`render()` builds nodes, no repeated `document.getElementById` at runtime).
2. **CSS rewrite** — BEM-ish naming, class-state via data attributes (`[data-state="affordable"]`) instead of restaging every color class; responsive-first layout (the game is largely mobile-played); CSS variables retained and expanded for theming.
3. **Accessibility** — keyboard focus, alt/ARIA on images, hover info owners replaced/augmented with focus/click equivalents (several features already function by hover only: `updateAchText`, artifacts, planets).
4. **Modal unification** — one modal manager (alert/prompt/confirm/notification) instead of four.
5. **UI polish opportunities** — tooltips, buy-max on hover, keyboard shortcuts (1–9 eggs), tab persist, mobile swipe, toast stacking, and a proper settings screen with selectable notation instead of a boolean toggle.

### Phase 3 — Systems re-implementation (Weeks 8–11)
1. **Prestige / Ascension** — data-driven reset definitions: each reset declares *what persists* and *what is erased*, replacing the 5 divergent hand-written reset functions. Add async resets (persist across tab).
2. **Contracts** — model as state machine (`idle → active → complete`), event-driven completion.
3. **Reliquary** — artifacts/gems as typed entities with a `slots` model; tier logic derived from data (`tierOf(id)` via a table, not a formula on `id % 4`).
4. **Automation** — declarative `{ condition(), action() }` registry (the idea is already sketched in the dead code at `automation.js:41-72`; formalize it).
5. **Achievements** — declarative triggers (`on(Event).when(predicate)`); remove the index-coupling bug class wholesale.
6. **Save/load** — typed schema, `localStorage` + indexedDB export/import as base64 with a version + checksum; one-time legacy-import converter mapping the old flat blob.

### Phase 4 — Rebalancing (Weeks 12–14, content-first)
Move all balance numbers into content data and re-tune on top of the new architecture with **save-scrubbed test profiles** (pre-egg, mid-prestige, endgame). Specific areas to revisit:
- Achievement count/truth: 53 definitions vs 48-array bug means late-game achievements never display correctly — the rewrite must make 100% completion possible and visible.
- `stats.bestKnowleggs` stat is wrong (#2) — fix in new stats module.
- Contract reward curve uses a base-goal `Decimal.log(baseGoal,3)` (`contracts.js:111`) — re-derive for early-game fairness (Pandemic/Supreme-Diets vs GPT-10.0 skew).
- Harvester yield math (`calculateHarvesterYield`, `ascension.js:801-820`) has hand-fudged corners (`if(i === 3) yieldObj.gems[2].lower -= 2`) — replace with a table.
- Prophecy-egg softcap (`prestige.js:15`) should be a named, tunable function, not an inline divide.
- Planet balance & discovery reqs (`eggspeditions.js:7-8`) — document intended pacing; the "discovery egg/chicken" coupling confusingly keys off *chickens* while UI calls it a cost in the egg of the same tier.
- Achievements idle-only: several require active prestige timing (`getAchievement(48/49)` on prestige/ascend) — ensure automatable in late game.

### Phase 5 — New content paths (Weeks 15+, stretch)
Each new path should be its own module with its own save slice, following the contest: *one currency, one data file, one UI node, one event*.

Suggested directions that fit the existing design and deserve scheduling:
1. **A "Final Egg" stretch system** beyond Enlightenment — the Enlightenment egg currently has no content after it; give it a dedicated mechanic (e.g., "Egglightenment fragments"), currently impossible because `updateEggValueBonus` etc. are hardwired.
2. **Prestige-layer synergies** — new content that bridges planets and contracts (e.g., contract-exclusive eggs, planet-affecting artifacts).
3. **Meta-achievements / collections** — a proper collection dex (template exists in the Reliquary stats tab).
4. **Automation depth** — mid-level auto-research is just "buy all"; add priority rules.
5. **A second newsticker system** with safe (non-`eval`) modifiers.
6. **Themes/mobile polish** — dark/invert mode; the commented-out theme system (`data.js:172-174`) can finally live.

### Phase 6 — Hardening & Release (Weeks 16–18)
- Unit tests on: cost math, save migrations, achievement triggers, reset correctness, contract state machine.
- E2E smoke test in CI (headless Chromium): load, click through tabs, prestige, import legacy save.
- Perf budget: <1 ms logic tick on a mid-game save; render only on dirty.
- Migration path from old saves with an in-game banner; document schema versioning in changelog.
- Release as `v3.0.0` (breaking save v2).

---

## 13. Rewrite Milestones (Gantt-style summary)

| Phase | Duration | Exit criteria |
|-------|----------|---------------|
| 0. Stack & scaffold | Wk 1 | TS + Vite + CI green on `hello` build |
| 1. State, loop, systems box | Wk 2–4 | Produces money/research/prestige in test harness, no DOM in logic |
| 2. UI foundation | Wk 5–7 | All tabs render from data with unique IDs; no runtime getElementById sprawl |
| 3. Full systems parity | Wk 8–11 | Feature-parity with v2.0.3 (eggs→contracts→planets→ascension→reliquary) |
| 4. Rebalance pass | Wk 12–14 | Balance data tables; all achievements reachable; legacy save import |
| 5. New content | Wk 15+ | First new-content slice (see Phase 5) |
| 6. Tests, perf, release | Wk 16–18 | CI + perf budget + v3.0.0 public |

---

## 14. Risks & Mitigations

- **Feature loss during port:** keep the old branch as reference; build a content/JSON export of old data tables first.
- **Save incompatibility:** ship legacy-import converter; do *not* silently accept old blobs.
- **Scope creep:** freeze content additions until Phase 4; the plan above reserves content for Phase 5 by design.
- **Team velocity:** the 14 file → ~30 module split is a lot of surface; pair the loop/store/bus (Phase 1) as the foundation everything else depends on, and land it first and small.

---

*Review performed read-only. No source files were modified; this report was generated as a new document (`CODE_REVIEW_REPORT.md`).*