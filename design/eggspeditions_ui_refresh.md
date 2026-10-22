# Eggspeditions UI Refresh Proposal

**Status:** Design proposal, no code changes
**Target:** `src/routes/Eggspeditions.svelte`
**Starting point:** Legacy Eggspeditions tab (`Legacy Code Base/index.html:299-320`, `style.css`, `Scripts/eggspeditions.js`)
**Design language:** Current v3 Svelte UI (`Chip`, `ButtonGroup`, `progress-bar`, `_variables.scss`, `global.scss`)

---

## 1. Scope

This proposal covers **the shared Eggspeditions screen shell**:

- Page header and expedition status
- Planet chart / selector
- Selected-planet dossier shell
- Discovery requirements and progress
- Journey / return actions and destructive-reset confirmation
- Responsive layout, interaction states, accessibility, and Svelte structure

### Explicit non-goals

- **No planet-specific UI.** Each planet's interior screen is intentionally left as a slot for its own design.
- **No systems redesign.** This is not based on `systems_proposal.md` and does not introduce new planet mechanics, currencies, site maps, or progression rules. It refreshes the presentation of the legacy Eggspeditions flow.
- **No new balance values.** Costs, egg requirements, and boosts are read from the existing game data/manager.
- **No new art.** Existing planet, question-planet, and planet-active images are reused.

---

## 2. What the Legacy UI Does Well

These ideas should survive the refresh:

1. **Six planets are visible at once** as a compact 2 × 3 chart. The whole feature reads in one glance.
2. **The planet images carry the theme**; the text below explains the selected planet.
3. **Discovery and travel are separate actions**, which prevents accidental travel.
4. **The reset warning is present** and is thematically important.
5. **Undiscovered planets keep their identity hidden** with `questionplanet.png`, while still teasing a description and boost category.

---

## 3. Problems With the Legacy UI

| Legacy issue | Effect |
|---|---|
| Information is driven by one multi-line `#planetHoverText` paragraph | Players must hover to learn anything; mobile and keyboard players cannot discover planet details reliably. |
| Hover is the only selection mechanism (`updatePlanetHoverText`) | No persistent selection, no visible focus, and moving the mouse changes the action target. |
| Both `Discover Planet` and `Go on an Eggspedition` are always visible | The primary action is ambiguous. Buttons are styled red/green to communicate state rather than disabled with a reason. |
| Planet state is only shown by swapping the image | Discovered, undiscovered, and current planet are not labelled. Color and art carry all meaning. |
| Discovery text is a single sentence | No progress toward the cost, and the copy says "Rocket Fuel Eggs" when the cost is actually paid in **chickens** (`eggspeditions.js:49`). |
| Sixth planet is `display: none` until Legendary Research | The chart silently changes shape; players cannot tell that more content exists. |
| Journey warning sits at the bottom, far from the action | The destructive reset is easy to miss. |
| "Return Home" is only described after the player is already on a planet | Returning is also a reset, but the interface does not explain what is kept or lost. |
| No active-expedition banner | The only hint that the player is away from the main farm is the header values and the changed button label. |
| Fixed 5em images and a wide hover paragraph | The panel is cramped on mobile and does not use modern responsive layout. |

---

## 4. Refresh Concept: **The Star Chart**

Turn the tab from a hover-driven image grid into a two-part **chart + dossier** screen.

- The **chart** is the permanent 2 × 3 planet selector. It shows discovery/current status at a glance.
- The **dossier** is a persistent, selectable panel beside (desktop) or below (mobile) the chart.
- The dossier has **shared chrome** that every planet inherits:
  - planet identity and status
  - boost category
  - the current planet-specific view slot
  - discovery requirements
  - journey / return actions
- Planet-specific content mounts inside the dossier shell. The shell does not dictate how a planet's interior looks.

The result keeps the legacy layout's compactness but replaces hover-memory with a visible selection, and replaces state-by-color with explicit labels.

---

## 5. Screen Anatomy

### 5.1 Desktop (≥ 900px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Eggspeditions                         [2 / 6 Charted]  [At Home]           │
│  Chart six worlds. Each one rewrites the rules of your farm.                │
├──────────────────────────────────────────────────────────────────────────────┤
│  ⚠ Eggspeditions replace your main farm with the selected expedition.       │
├───────────────────────────────────────────┬──────────────────────────────────┤
│  PLANET CHART                             │  DOSSIER                         │
│                                           │                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐        │  [planet image]  Arcturus        │
│  │  🪐    │ │  🪐    │ │  ?     │        │  Dark Energy Abounds             │
│  │Arcturus│ │ Ravnar │ │ ???    │        │  [Charted] [Current Expedition]  │
│  │Charted │ │Charted │ │Uncharted│       │  [Planet Egg Value Boost]        │
│  └────────┘ └────────┘ └────────┘        │                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐        │  ┌────────────────────────────┐  │
│  │  ?     │ │  ?     │ │  ?     │        │  │  Planet-specific view slot │  │
│  │ ???    │ │ ???    │ │ ???    │        │  │  (designed separately)     │  │
│  └────────┘ └────────┘ └────────┘        │  └────────────────────────────┘  │
│                                           │                                  │
│  Select a planet to inspect its           │  x1.00 Planet Egg Value Boost    │
│  expedition.                              │  [Journey to Arcturus]           │
└───────────────────────────────────────────┴──────────────────────────────────┘
```

When the player is on a planet, an **expedition status bar** replaces the generic warning strip:

```
🧭 Currently on Arcturus — main farm paused     [Return Home]
```

### 5.2 Mobile (< 900px)

```
┌──────────────────────────────┐
│ Eggspeditions   [2/6] [Home]  │
├──────────────────────────────┤
│ ⚠ Reset warning              │
├──────────────────────────────┤
│  ┌────────┐  ┌────────┐       │
│  │ 🪐     │  │ 🪐     │       │
│  │Arcturus│  │ Ravnar │       │
│  └────────┘  └────────┘       │
│  ┌────────┐  ┌────────┐       │
│  │ ?      │  │ ?      │       │
│  └────────┘  └────────┘       │
│  ┌────────┐  ┌────────┐       │
│  │ ?      │  │ ?      │       │
│  └────────┘  └────────┘       │
├──────────────────────────────┤
│  DOSSIER (selected planet)   │
│  ...                         │
│  [Journey to Arcturus]       │
└──────────────────────────────┘
```

Rules:

- Chart becomes **2 columns** on narrow screens, preserving the 2 × 3 shape.
- Dossier stacks below the chart and scrolls naturally.
- No fixed floating button for this tab. The existing Egg tab's fixed hatch button is a one-off; duplicating that pattern here would cover the dossier on small screens.
- The chart should never require horizontal scrolling.

---

## 6. Component Breakdown

```
Eggspeditions.svelte
├── EggspeditionsHeader.svelte
│   ├── title + subtitle
│   ├── ChartProgressChip      "2 / 6 Charted"
│   └── LocationChip           "At Home" / "On Arcturus"
├── ExpeditionNotice.svelte
│   ├── ResetNotice            when at home
│   └── CurrentExpeditionBar   when on a planet, with Return Home
├── div.eggspeditions-layout
│   ├── PlanetChart.svelte
│   │   └── PlanetTile.svelte × 6
│   └── PlanetDossier.svelte
│       ├── DossierHeader.svelte
│       │   ├── planet image
│       │   ├── name / unknown name
│       │   ├── description
│       │   ├── StatusChip
│       │   └── BoostChip
│       ├── PlanetViewSlot.svelte      ← planet-specific UI lives here
│       ├── DiscoveryPanel.svelte      ← only while undiscovered
│       └── TravelPanel.svelte         ← only while discovered
└── ConfirmDialog.svelte                ← shared destructive-action modal
```

### 6.1 `Eggspeditions.svelte` — orchestrator

Owns only screen-level state:

```js
let selectedPlanet = $state(defaultSelection())
let confirmAction = $state(null) // 'discover' | 'journey' | 'return' | null
```

It reads game state but delegates rules to the manager:

```js
import {
    planets,
    getPlanetState,
    canDiscover,
    getDiscoveryProgress,
    isOnPlanet
} from '$lib/scripts/EggspeditionsManager'
```

`selectedPlanet` is ephemeral UI state, not save state. Default selection:

1. `data.indexValues.currentPlanet` when the player is on a planet.
2. Otherwise the first discovered planet.
3. Otherwise planet `0`.

### 6.2 `PlanetChart.svelte`

- CSS grid: `grid-template-columns: repeat(3, minmax(0, 1fr))` on desktop, `repeat(2, minmax(0, 1fr))` below 900px.
- `role="group"` with `aria-label="Planet chart"`.
- Renders all six planets. Roving tabindex: only the selected tile is in the tab order; arrow keys move selection.
- Gap `0.5rem`; no fixed tile width. Tiles fill their grid cell.

### 6.3 `PlanetTile.svelte`

A real `<button type="button">`, not a clickable image.

Anatomy:

```
┌─────────────────────┐
│      [planet]       │  ← image, 4.5–6rem
│      Arcturus       │  ← name or "???"
│   [Charted]         │  ← status chip
│   Planet Egg Value  │  ← boost category, muted
└─────────────────────┘
```

States:

| State | Art | Border | Status chip | Extra |
|---|---|---|---|---|
| Undiscovered | `questionplanet.png` | `$darkgray` dashed | `Uncharted` (gray) | Name `???` |
| Discovered | `planetN.png` | `$white` solid | `Charted` (green) | Boost category visible |
| Selected | same as state above | `$blue`, 2px | unchanged | `aria-pressed="true"` |
| Current expedition | `planetN.png` | `$green`, 2px | `Current` (green) | Corner badge or top chip |
| Sealed (planet 6 before research) | `questionplanet.png`, 35% opacity | `$darkgray` dashed | `Sealed` (gray) | Lock glyph + "Planetary Discovery" |

Implementation notes:

- Selected border must not rely on color alone: combine the blue border with a small `Selected` chip or a left-edge marker.
- The active planet keeps its `Current` chip even when another planet is selected for inspection.
- Hover shows a subtle lift and border brightening only. **Hover does not change the dossier.** Selection changes on click, Enter, or Space.
- Images are `alt=""` inside the button because the button's `aria-label` already names the planet and state.

### 6.4 `PlanetDossier.svelte`

The dossier is the shared shell; it does not contain planet-specific gameplay. It renders:

1. `DossierHeader` — image, name/`???`, description, status chip, boost chip.
2. `PlanetViewSlot` — reserved for the planet's own component.
3. `DiscoveryPanel` — shown only if undiscovered.
4. `TravelPanel` — shown only if discovered.

#### Dossier header

```
[planet image]  Arcturus
                Dark Energy Abounds (Higher Research Scaling)
                [Charted]  [Planet Egg Value Boost]
```

Unknown planets preserve the legacy tease:

```
[? image]  ???
           Dark Energy Abounds (Higher Research Scaling)
           [Uncharted]  [Planet Egg Value Boost]
```

The description and boost **category** stay visible before discovery, matching legacy `planetHoverText`. Numeric boost values do not.

#### Planet-specific view slot

Define a narrow contract so each planet can be designed independently:

```svelte
<PlanetViewSlot
    planet={planet}
    discovered={isDiscovered}
    active={isCurrentPlanet}
/>
```

The slot is responsible for its own layout. Render it only when the selected planet is discovered; an undiscovered planet shows the shared `DiscoveryPanel` instead. Until a planet component exists, the slot renders a low-key placeholder:

```
Planet expedition details will appear here.
```

It must not render inside `DiscoveryPanel`; discovery is a shared pre-planet concern. The slot may choose to hide its own contents while the player is at home, but the shell must still provide the discovery/travel panels around it.

#### Discovery panel

Shown only while the selected planet is undiscovered.

Contents:

- **Cost row**: `5.00e6 Rocket Fuel Chickens`
- **Progress bar**: current Rocket Fuel chickens ÷ required chickens.
- **Requirement chips**:
  - `Rocket Fuel Egg` — green when current egg matches, red with `Switch to Rocket Fuel Egg` when not.
  - `5.00e6 / 5.00e6 Chickens` — green when enough, red otherwise.
- **Primary button**: `Discover Planet`
  - Disabled with a visible reason when requirements are unmet.
  - Enabled/green when the planet can be discovered.
- **Success state**: after discovery, the panel collapses into the header status and the travel panel appears.

Copy must say **chickens**, not eggs. The legacy copy (`Cost 50 Million Rocket Fuel Eggs`) describes the wrong resource.

#### Travel panel

Shown only while the selected planet is discovered.

At home:

```
[x1.25 Planet Egg Value Boost]
[Journey to Arcturus]
Resets money, chickens, current egg, and research. Arcturus progress is saved.
```

On the selected planet:

```
[Return Home]
Returns to a fresh main farm. Arcturus progress is saved.
```

On a different planet:

```
You are currently on Ravnar. Return home before travelling to Arcturus.
[Return Home]
```

This last state fixes the legacy confusion where the same button silently becomes "Return Home" no matter which planet was selected.

### 6.5 `ConfirmDialog.svelte`

The current v3 codebase has no shared modal yet. Eggspeditions needs a destructive-action confirmation, so this proposal introduces a small reusable generic dialog rather than a one-off CSS modal.

Used for:

- Discover planet? (optional — only if the cost is large enough to warrant it; discovery is not destructive, so inline confirmation is acceptable)
- Journey to planet? **Required**
- Return home? **Required**

Journey copy:

```
Journey to Arcturus?

Your main farm will be replaced by the expedition:
• $0 money, 0 chickens, Regular Egg
• Common Research reset
• Arcturus progress is preserved

[Stay Home]  [Journey]
```

Return copy:

```
Return Home?

Your main farm will start fresh:
• $0 money, 0 chickens, Regular Egg
• Common Research reset
• Arcturus progress is saved

[Cancel]  [Return Home]
```

Requirements:

- `role="dialog"`, `aria-modal="true"`, labelled by the title.
- Focus moves to the dialog on open; Escape and the cancel button close it.
- Focus returns to the invoking button.
- No background scroll while open.
- `Journey`/`Return Home` use the green action style; `Stay Home`/`Cancel` use the neutral style.
- Do not use red for the confirm action unless the action is truly destructive **and** has no preservation benefit. Here the reset is expected, so green is appropriate and less alarming.

---

## 7. State Model

Let:

- `selected` = the planet currently inspected in the dossier
- `discovered[i]` = `data.progression.planets[i]`
- `current` = `data.indexValues.currentPlanet` (`-1` at home)
- `canDiscover[i]` = requirements met and not already discovered

| Selected | Current location | Chart | Dossier | Primary action |
|---|---|---|---|---|
| none | home | no selection | Empty prompt | Disabled: `Select a Planet` |
| undiscovered, requirements unmet | home | selected tile | Discovery panel | Disabled: `Discover Planet` + reason |
| undiscovered, requirements met | home | selected tile | Discovery panel | `Discover Planet` |
| undiscovered | on another planet | selected tile; current tile also marked | Discovery panel (blocked) | Disabled: `Return home to discover planets` |
| discovered | home | selected tile, `Charted` | Travel panel | `Journey to …` |
| discovered | on same planet | selected tile, `Current` | Travel panel (return) | `Return Home` |
| discovered | on another planet | selected tile; current tile also marked | Travel panel (blocked) | `Return Home` |
| sealed | home | sealed tile | Teaser + locked reason | Disabled: `Requires Planetary Discovery` |
| all discovered | home | all `Charted`, header `6 / 6` | Travel panel | `Journey to …` |

Additional edge cases:

- **Feature locked** (`data.progression.unlockedEggspeditions === false`): render a locked empty state with the unlock requirement and no chart actions.
- **Missing planet data**: fall back to the unknown tile; log one warning in dev; do not crash the tab.
- **All planets discovered, none selected**: default to the current planet or planet `0`, never an empty dossier.
- **Discovery count** must derive from `planets.filter(Boolean).length`, not a separate counter.
- **Returning home** must be available from every planet, including while another planet is selected for inspection.

---

## 8. Interaction Details

### Selection

- Click/tap, Enter, or Space selects a tile.
- Arrow keys move selection within the chart (Left/Right ±1, Up/Down ±3 clamped to the grid).
- Home/End jump to the first/last available tile.
- `aria-pressed="true"` on the selected tile.
- Selection persists while the tab remains mounted; leaving the tab may reset it to the default selection.

### Discovery

- Discovery is an inline action in the dossier, not a chart-tile action.
- The button is disabled with a **visible reason** rather than only red styling.
- On success:
  - planet data updates
  - the dossier header switches from `??? / Uncharted` to name / `Charted`
  - the discovery panel is replaced by the travel panel
  - the next undiscovered planet is **not** auto-selected; the player explicitly chooses the next target

### Travel

- Journey and return always open a confirmation dialog.
- While the dialog is open, the chart and dossier are inert.
- The confirmation describes what is reset and what is preserved. Do not simply say "This will reset your farm."
- If the player is already on a planet, any journey action other than return is blocked with explanatory copy rather than a silent no-op.

### Notifications

- Discovery: success toast `Planet discovered: Arcturus`.
- Journey: info toast `Expedition started: Arcturus`.
- Return: info toast `Returned home — main farm reset`.
- Do not duplicate the reset warning in both a toast and the modal; the modal owns the warning, the toast reports the outcome.

---

## 9. Visual Specification

Use existing tokens from `_variables.scss`; do not introduce a second palette.

| Token | Use |
|---|---|
| `$bg-color` | page background |
| `$white` | default borders and text |
| `$blue` | Eggspeditions identity, selected tile, section heading |
| `$green` | charted state, available actions, current expedition |
| `$red` | unmet requirement, blocked action, reset warning icon |
| `$yellow` | caution emphasis (optional) |
| `$gray` / `$darkgray` | uncharted and sealed states, muted labels |

### Layout tokens

```scss
$eggs-panel-radius: $borderRadius;   // 5px
$eggs-panel-border: $borderWidth;    // 2px
$eggs-chart-gap: 0.5rem;
$eggs-panel-padding: 0.75rem;
$eggs-tile-image: clamp(4rem, 8vw, 6rem);
$eggs-layout-breakpoint: 900px;
```

### Chart + dossier layout

```scss
.eggspeditions-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(20rem, 1fr);
    gap: 0.75rem;
    align-items: start;
    width: min(1100px, 100%);
    margin-inline: auto;
    padding-inline: 0.5rem;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}
```

### Panels

```scss
.panel {
    border: $borderWidth solid $white;
    border-radius: $borderRadius;
    padding: 0.75rem;
    background-color: $bg-color;
}
```

Dossier panel uses a **blue** border to identify the section, consistent with the Eggspeditions tab button.

### Planet tile

```scss
.planet-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    border: $borderWidth solid $darkgray;
    border-radius: $borderRadius;
    background-color: $bg-color;
    color: $white;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;

    &:hover {
        border-color: $white;
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 2px solid $yellow;
        outline-offset: 2px;
    }

    &[aria-pressed="true"] {
        border-color: $blue;
        box-shadow: 0 0 0 1px $blue inset;
    }

    &[data-state="current"] {
        border-color: $green;
    }

    &[data-state="sealed"] {
        opacity: 0.6;
    }
}
```

Important: the global `* { background-color: $bg-color; }` rule means nested elements in these panels will paint over any panel background. Set child backgrounds to `transparent` where a panel or state background must show through (same workaround already used in `Research.svelte`).

### Motion

- Selection: 150ms border/transform.
- Current expedition: a slow green pulse on the `Current` chip only, never on the whole tile.
- Respect `prefers-reduced-motion` by disabling transforms and pulses.
- No parallax, starfield animation, or large background effects. The visual refresh should come from hierarchy and state clarity, not spectacle.

### Typography

- `h3` page title in `$blue`, matching other tabs' colored headings.
- Planet name: existing `h4` scale, no new display font.
- Status, boost, and requirement labels use `Chip` rather than new badge markup.
- Keep Martian Mono and the existing 2px border language; do not introduce rounded cards or soft shadows.

---

## 10. Copy Deck

### Header

| Slot | Copy |
|---|---|
| Title | `Eggspeditions` |
| Subtitle | `Chart six worlds. Each one rewrites the rules of your farm.` |
| Progress chip | `2 / 6 Charted` |
| Location chip — home | `At Home` |
| Location chip — away | `On Arcturus` |

### Chart

| Slot | Copy |
|---|---|
| Group label | `Planet chart` |
| Empty prompt | `Select a planet to inspect its expedition.` |
| Unknown name | `???` |
| Unknown status | `Uncharted` |
| Discovered status | `Charted` |
| Current status | `Current` |
| Sealed status | `Sealed` |
| Sealed reason | `Requires Planetary Discovery` |

### Dossier

| Slot | Copy |
|---|---|
| Unknown header | `???` |
| Unknown description | Existing planet description from legacy data |
| Boost label | `x1.25 Planet Egg Value Boost` (discovered) |
| Unknown boost | `Planet Egg Value Boost` (category only) |
| Planet slot placeholder | `Planet expedition details will appear here.` |

### Discovery

| Slot | Copy |
|---|---|
| Cost | `Discovery Cost: 5.00e6 Rocket Fuel Chickens` |
| Progress | `3.21e6 / 5.00e6` |
| Wrong egg | `Switch to Rocket Fuel Egg` |
| Not enough | `Not enough Rocket Fuel Chickens` |
| Ready | `Ready to discover` |
| Button | `Discover Planet` |
| Already discovered | Replaced by travel panel |
| All charted | `All planets charted` |

### Travel

| Slot | Copy |
|---|---|
| Journey button | `Journey to Arcturus` |
| Return button | `Return Home` |
| Home reset note | `Resets money, chickens, current egg, and research. Arcturus progress is saved.` |
| Away reset note | `Returning starts a fresh main farm. Arcturus progress is saved.` |
| Blocked travel | `You are currently on Ravnar. Return home before travelling to Arcturus.` |

### Warning strip

At home:

```
While on an expedition, your main farm is replaced. Planet progress is saved.
```

On a planet:

```
Currently on Arcturus — the main farm is paused. Return Home to start a fresh run.
```

---

## 11. Accessibility Requirements

- **No information is hover-only.** Every piece of legacy hover text has a persistent home in the dossier.
- **Planet tiles are buttons.** Never attach click handlers to `<img>`.
- **Focus visible everywhere.** Use a yellow/white `:focus-visible` outline with 2px offset; do not remove outlines.
- **State is not color-only.** Every state has a text chip (`Charted`, `Uncharted`, `Current`, `Sealed`).
- **Disabled actions explain themselves.** The reason is visible text, not a `title` attribute.
- **Dialog semantics.** `role="dialog"`, `aria-modal="true"`, focus trap, Escape, restore focus.
- **Keyboard grid.** Arrow-key navigation with roving tabindex; Enter/Space selects. Tab still reaches the rest of the page.
- **Alt text.** The tile button's `aria-label` reads e.g. `Arcturus, charted, current expedition`. Its inner image is decorative (`alt=""`).
- **Reduced motion.** Respect `prefers-reduced-motion`.
- **Progress bars.** Use the existing `.progress-bar` with `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- **Contrast.** Keep `$gray` text only on `$bg-color`; do not place `$gray` on `$darkgray`.
- **Touch targets.** Tiles and action buttons are at least 44 × 44 CSS pixels.

---

## 12. Svelte Implementation Plan

### Phase 1 — Static shell

1. Create `Eggspeditions.svelte` with hard-coded planet data for layout.
2. Build `PlanetChart`, `PlanetTile`, `PlanetDossier`, and `DossierHeader`.
3. Match the current `Chip`, `progress-bar`, button, and panel styling.
4. Verify desktop/mobile layout with no game state connected.

### Phase 2 — Wire game state

1. Populate `EggspeditionsManager.js` with static planet records and read-only selectors:
   - `planets`
   - `getPlanetState(index)`
   - `canDiscover(index)`
   - `getDiscoveryProgress(index)`
   - `isOnPlanet(index)`
2. Replace hard-coded state with `$derived` values from `data`.
3. Implement selection, discovery, journey, and return actions.
4. Add the confirmation dialog.

### Phase 3 — Planet slot

1. Add `PlanetViewSlot.svelte` with the props contract from §6.4.
2. Keep the placeholder until a planet's own UI is designed.
3. Each planet component is mounted only for the selected planet, so planet-specific state and styling stay isolated.

### Phase 4 — Polish

1. Keyboard navigation and focus management.
2. Reduced motion and responsive pass.
3. Toast outcomes.
4. Empty, locked, sealed, and all-charted states.
5. Add a basic component test for the state table in §7.

### Suggested file layout

```
src/routes/Eggspeditions.svelte
src/lib/components/eggspeditions/
    EggspeditionsHeader.svelte
    ExpeditionNotice.svelte
    PlanetChart.svelte
    PlanetTile.svelte
    PlanetDossier.svelte
    DossierHeader.svelte
    PlanetViewSlot.svelte
    DiscoveryPanel.svelte
    TravelPanel.svelte
src/lib/components/ConfirmDialog.svelte
src/lib/scripts/EggspeditionsManager.js
```

Only `Eggspeditions.svelte` and `EggspeditionsManager.js` already exist (the manager is currently empty). All other files are new.

---

## 13. Legacy → Refresh Mapping

| Legacy element | Refresh |
|---|---|
| `#eggpeditionTab` flex column | `Eggspeditions.svelte` header + layout grid |
| `#planetRow` × 2 with `img` | `PlanetChart` + `PlanetTile` buttons |
| `planet0`–`planet5` `src` swapping | Explicit `data-state` + status chips |
| `#planetHoverText` | Persistent `PlanetDossier` |
| `planetHoverIndex` | `selectedPlanet` click/focus state |
| `#discoveryButton` red/green | `DiscoveryPanel` action with disabled reason |
| `#eggspeditionButton` label swapping | `TravelPanel` with location-aware states |
| `#discoveryText` | Cost + progress bar + requirement chips |
| Bottom reset warning | Notice strip + journey confirmation dialog |
| Hidden sixth planet | Sealed tile with visible requirement |
| `updateEggspeditionsUI()` DOM writes | `$derived` state + component render |

---

## 14. Acceptance Criteria

The refresh is complete when:

- [ ] All six planets are visible at once on desktop and in a 2-column grid on mobile.
- [ ] A planet can be selected with mouse, touch, and keyboard without hovering.
- [ ] The dossier persists the selected planet's shared information and status.
- [ ] Undiscovered planets still hide their name and numeric boost but keep their description and boost category.
- [ ] Discovery costs show the correct resource (**chickens**) and a live progress bar.
- [ ] The primary action is always unambiguous for the current state.
- [ ] Journey and return both explain what is reset and what is preserved before confirming.
- [ ] Being on a planet is visible at all times, and returning home is always reachable.
- [ ] The sixth planet is represented as sealed rather than silently missing.
- [ ] No planet-specific UI is implemented in this shell; the slot contract is in place.
- [ ] All states are legible without color and work with reduced motion.
- [ ] The page uses only existing color tokens, fonts, `Chip`, `progress-bar`, and 2px-border panel language.

---

## 15. Open Decisions for the Planet Designs

These are intentionally not decided here because they belong to the per-planet UI work:

1. Whether a planet's interior replaces the shared dossier header or appears below it.
2. Whether planets need their own sub-navigation or progress widgets inside the slot.
3. Whether a planet's view needs the shared discovery/travel panels hidden while active.
4. Whether the slot should receive planet-specific actions through props or read the manager directly.

The shell is designed to accept any of these without changing the chart, selection model, or shared discovery/travel flow.
