# Research UI Proposal — "Tier Ladder"

**Target:** `src/routes/Research.svelte` (Common Research page)
**Replaces:** the legacy research tab (`Legacy Code Base/index.html:166-233`)
**Goal:** Keep tiers, but change **how** they're displayed and **how** they're ordered.

---

## 1. Current state

| Area | Today | Problem |
| --- | --- | --- |
| `src/routes/Research.svelte` | Flat `{#each commonResearch as item}` rendering a bare `<button>{item.title}</button>` | No tiers, no cost, no level, no interaction |
| `src/lib/scripts/ResearchManager.js` | 28 common researches, `tier` 0–13, **2 per tier**; costs are `Decimal` | Not surfaced anywhere |
| Legacy tab | 7 columns, each holding **two stacked tiers** (I+II, III+IV, …) | Reading order is down-then-across; tier identity is a tiny `<p>` label; every card is a generic "Research-01" |
| `DataManager.svelte.js` | `research.commonResearch` level array, `currency.money`, `settings.buyAmounts[0]`, `automation.commonAutomatorActive` | Level arrays are `new Array(n)` → **holes, not zeros** |

Design constraints honored:
- **Tiers stay authoritative** — `item.tier` remains the grouping key; tier membership never changes.
- Default ordering is **numeric I → XIV** (per decision), with optional reorders that never remove a tier.

---

## 2. Design principles

1. **One ladder, read top-to-bottom.** Tier I at the top → Tier XIV at the bottom. After Tier I+II, the eye continues straight down (no zig-zag).
2. **A tier is a section, not a slot.** Each tier has a header (name, progress, lock state) and a body (its research cards).
3. **Surface "what can I buy now".** Ordering is stable by default but offers a progress-first view; affordability is visible at a glance.
4. **Progressive disclosure.** Completed tiers collapse, the first incomplete tier expands. The screen stays short as a run matures.
5. **No dead buttons.** Cost, level, affordability, and lock state are always visible before the click.

---

## 3. New layout

Single vertical stack (2 columns on wide screens, reflowing the tier list — never splitting a tier across columns).

```
┌ Research Center ──────────────────────── [Buy: 1 | 10 | Max] ─┐
│ Tier rail │  Tier I                         2/2 complete   ▾   │
│  I  ✓     │   ┌ Comfortable Nests   Lv 50/50  MAXED ┐         │
│  II ●     │   ┌ Nutritional Supp.   Lv 40/40  MAXED ┐         │
│  III ▸    │  Tier II                       3/20 levels   ▴   │
│  IV  ▸    │   ┌ Internal Hatcheries Lv 3/10   $2.4e4  ┐        │
│  V   🔒   │   ┌ Padded Packaging     Lv 0/30   $4.5e5  ┐        │
│  …        │  Tier III                      🔒 Locked         │
└───────────────────────────────────────────────────────────────┘
```

### 3.1 Sticky tier rail (left)
- Roman numerals `I … XIV`, one per tier.
- State marker per tier: `✓` complete, `●` in progress, `▸` untouched/unlocked, `🔒` locked.
- Click = scroll to that tier section. Gives at-a-glance run progress without scrolling.

### 3.2 Tier section
- **Header:** `Tier {n}` · progress pill (`2/2 complete` or `7/45 levels`) · lock icon if gated · collapse chevron.
- **Body:** grid of that tier's research **cards** (2 today, but grid handles 1–N).
- Assign a color accent per tier group (reuse `$majorColors`), e.g. I–II green, III–IV blue, V–VI purple, VII–VIII yellow, IX–X orange, XI–XII blue, XIII–XIV purple — echoing the legacy tab's color hint without the column gimmick.

### 3.3 Research card (replaces the bare button)
Whole card is the buy target.

```
┌─────────────────────────────────────┐
│ Comfortable Nests            Lv 12/50│
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Next: $8.20e3            affordable  │
└─────────────────────────────────────┘
```

- Title, `Lv X / Y`, progress bar.
- **Next-level cost** in `money`, tinted green when affordable, muted otherwise, `MAXED` when full.
- Click buys `buyAmount` levels (or as many as affordable for `Max`); disabled when locked or maxed.
- Optional **effect hint** line — add a `desc` field to research entries later; card leaves room for it.

### 3.4 Global controls (sticky header/footer)
- **Buy amount**: `1 / 10 / Max` bound to `data.settings.buyAmounts[0]`.
- **Common Automator** toggle bound to `data.automation.commonAutomatorActive`.
- Footnote retained from legacy: *"All Research Bonuses Compound."*

---

## 4. Ordering rules

### 4.1 Tier order (the headline change)
- **Default: numeric ascending, I → XIV.** Static, predictable, matches progression.
- **"Progress order" toggle (opt-in):** floats the first incomplete / next-purchasable tier to the top. Completed tiers keep relative order below. Use when mid-run and hunting the next buy.
- **Auto-collapse:** fully maxed tiers collapse to their header row (summary stays visible). The **first incomplete tier auto-expands** on load. Tiers are collapsed — never removed.
- **Locked tiers** remain in numeric position, dimmed, with the requirement shown.

### 4.2 Card order within a tier
- Default: array order (stable).
- Toggle **Cheapest first** (by current next-level cost) or **Most progress**. Reorders cards only; tier membership is untouched.

### 4.3 Sorting is cosmetic only
Ordering never changes the underlying index into `commonResearch` — purchase handlers always use the stable array index, so reordering is safe for saves.

---

## 5. Tier gating (recommended)

- Tier *n* unlocks when tier *n-1* meets a threshold (start with **≥1 level in every research of the previous tier**, tune later).
- Locked tier renders dimmed with `Unlocks: finish Tier {n-1}`; cards not clickable.
- Tier I always unlocked.
- This gives the ladder stakes and keeps a fresh save focused on the two tiers that matter.

> If you'd rather ship without gating first, the tier section can render all tiers unlocked and add the lock state later — the layout is identical.

---

## 6. Interaction flow

1. **Enter page** → tier rail renders; first incomplete tier expanded, completed tiers collapsed.
2. **Scan** → sticky rail shows run progress; affordable costs glow green.
3. **Choose buy amount** → `1 / 10 / Max` updates all card labels live.
4. **Click a card** → calls `purchaseCommonResearch(index, amount)`; card re-renders level/cost; tier pills update; a newly maxed tier collapses, the next incomplete expands.
5. **Toggle Progress order** → tier list re-sorts; collapse state preserved per tier.
6. **Locked tier** → header shows requirement; body hidden or dimmed.

---

## 7. Implementation plan

### 7.1 Files
| File | Change |
| --- | --- |
| `src/routes/Research.svelte` | Rewrite: state (sort mode, buy amount, expanded set), tier grouping, rail, render tier sections |
| `src/lib/components/ResearchTier.svelte` *(new)* | One tier section: header + progress + collapse + card grid |
| `src/lib/components/ResearchCard.svelte` *(new, optional)* | Single card; or inline the card markup in `ResearchTier` |
| `src/lib/scripts/ResearchManager.js` | Add `purchaseCommonResearch(index, amount)` (+ helpers: `nextCost`, `isMaxed`, `isAffordable`, `tierUnlocked`) |
| `src/lib/scripts/DataManager.svelte.js` | `new Array(len).fill(0)` for the three research level arrays |

### 7.2 Grouping snippet
```js
import { commonResearch } from "$lib/scripts/ResearchManager";

const tiers = [...new Set(commonResearch.map(r => r.tier))]
    .sort((a, b) => a - b)
    .map(tier => ({
        tier,
        items: commonResearch
            .map((item, index) => ({ ...item, index })) // keep stable index
            .filter(item => item.tier === tier)
    }));
```

### 7.3 State sketch
```js
let sortMode = $state("tier");        // "tier" | "progress"
let cardSort = $state("default");     // "default" | "cost" | "progress"
let expanded = $state(new Set());     // tier numbers expanded
let buyAmount = $state(data.settings.buyAmounts[0] ?? 0);
```

### 7.4 Data gaps to fix first
- `DataManager.svelte.js:14-16` — `new Array(n)` produces holes (`undefined`), so `Lv X / Y` and `nextCost` break. Use `.fill(0)` (or normalize on load).
- No purchase/finance logic exists in `src/` yet — the UI should call a manager function, not compute costs inline.
- `epicResearch` / `legendaryResearch` have **no `tier`** field. Keep them out of this ladder — they belong to the Prestige page (they cost soul eggs), not the common-money ladder.

---

## 8. Decisions locked / open

**Locked**
- Tiers are retained and remain the grouping key.
- Default tier order: **numeric I → XIV**.
- Display: vertical ladder of collapsible tier sections (not the 7-column legacy grid).

**Open**
- Gating threshold (ship ungated first, or ≥1-level rule?).
- Tier accent colors (grouped palette vs. single accent).
- Whether "Progress order" and card sort live on this page or in Settings.
- Card `desc`/effect text — author copy, or derive from tier?

---

## 9. Acceptance criteria

- [ ] Tiers render as sections ordered I → XIV by default.
- [ ] Each tier shows a completion progress pill and collapses when maxed.
- [ ] First incomplete tier is expanded on load.
- [ ] Sticky rail jumps to tiers and reflects per-tier state.
- [ ] Cards show `Lv X/Y`, a progress bar, next-level cost, and affordability.
- [ ] Buy amount `1 / 10 / Max` binds to `settings.buyAmounts[0]`.
- [ ] Progress order and card sorting reorder without changing purchase indices.
- [ ] Legacy 7-column layout and generic "Research-01" labels are fully replaced.
