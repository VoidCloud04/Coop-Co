# Research System: Minimal Fix

**Status:** Proposal
**Scope:** `Legacy Code Base/Scripts/research.js`, `src/lib/scripts/ResearchManager.js`, `src/routes/Research.svelte`
**Out of scope:** Contracts, Eggspeditions, new UI components, new config files.

---

## 1. Summary

The legacy research code calculates the displayed bulk cost with one formula and charges the player with a different formula. The two only agree on the main farm. That is the reported bug.

The modern fix is small:

- Keep the research arrays and array-index identity. **No IDs.**
- Keep the existing `Research.svelte` markup and `commonByTier()` grouping.
- Add **two exported functions** to `ResearchManager.js`: one to read the current cost, one to purchase.
- Let `ResearchManager.js` read `gameState.data` by default.
- Render the existing buttons with the calculated level, cost, and colour.
- Do not add `ResearchCard`, `ResearchTier`, a config file, or a generic research engine.

The fix is one cost calculation used by both the button and the purchase. Nothing else needs to move.

---

## 2. What went wrong in legacy

The display path used `getTotalCost()` with a context-dependent scale:

- `1.35` on Arcturus,
- `1.15` on the main farm,
- `1.15` on other planets.

The purchase path always did this:

```js
let costMult = Decimal.pow(1.15, buyAmount).sub(Decimal.dOne).div(0.15);
```

That is a `1.15` geometric series regardless of the display's scale or planet.

The display path also had a missing `else`:

```js
if (data.onPlanet === false) {
    commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.15, data.research[i]));
} else if (data.onPlanet === true && data.currentPlanetIndex === 0) {
    commonResearchCost[i] = commonResearchCost[i].times(Decimal.pow(1.35, data.research[i]));
}
// no branch for other planets
```

So on planets other than Arcturus, the displayed next-level cost included level scaling but the charged next-level cost did not.

| Scenario | Displayed | Charged | Difference |
| --- | ---: | ---: | ---: |
| Arcturus, level 0, Max 250 | `$1.5895e53` | `$1.4463e36` | `17.04` orders of magnitude |
| Non-Arcturus planet, level 200, buy 10 | `$4.0646e33` | `$2.9475e21` | `12.14` orders of magnitude |

Other legacy issues, fixed by the same change:

- `Max` is `9999`, not all remaining levels.
- The reverse solve calls `.toNumber()` before clamping.
- Display cost and charge cost are separate arrays.
- Epic and legendary purchases loop one level at a time and call `updateResearch()` each time.
- The lab discount is not clamped.
- The UI writes into DOM nodes every frame.

The duplicate `Internal Hatchery Expansion` name is fine with index identity. It only breaks if the UI keys by title.

---

## 3. Minimal data model

Keep everything as it is:

```js
commonResearch[index] // { title, description, tier, baseCost, maxLevels }
data.research.commonResearch[index] // level
data.settings.buyAmounts[0] // buy mode
data.currency.money // currency
```

No `id` field. No save migration. No reordering.

Research arrays are append-only. If an entry must be removed or reordered later, that is a save migration, not a normal edit.

`commonByTier()` can stay exactly as it is. In `Research.svelte`, get the global index with:

```js
const index = commonResearch.indexOf(item);
```

`indexOf` uses reference equality, so the duplicate name does not matter. The list is 28 entries, so the cost is irrelevant.

---

## 4. `ResearchManager.js`

Only two exported functions are needed for common research:

```js
getCommonResearch(index, options)
purchaseCommonResearch(index, options)
```

`options` is optional:

```js
{
    data = gameState.data,
    costScale = new Decimal(1.15),
    baseCost = commonResearch[index].baseCost
}
```

`getCommonResearch` returns the runtime numbers the existing button needs. It is **not saved**:

```js
{
    level,
    maxLevel,
    nextCost,
    cost,          // cost of the selected interval
    buyAmount,     // selected interval, clamped to remaining
    maxBuyAmount,  // how many levels the player can afford
    buyCount,      // min(buyAmount, maxBuyAmount)
    charge,        // exact cost of buyCount
    isMaxed
}
```

This is the runtime `bulkCost`/`maxCost` record. The button renders it. The purchase uses the same result.

### 4.1 Reference implementation

Add this to `src/lib/scripts/ResearchManager.js`. Keep the existing research arrays unchanged.

```js
import Decimal from "break_eternity.js";
import { gameState } from "./DataManager.svelte";

const BUY_AMOUNTS = [1, 5, 10, 20, Infinity];
const COMMON_SCALE = new Decimal(1.15);

function totalCost(base, scale, level, count) {
    if (count <= 0) return Decimal.dZero;
    if (scale.eq(Decimal.dOne)) return base.times(count);

    return base
        .times(Decimal.pow(scale, level))
        .times(Decimal.pow(scale, count).sub(Decimal.dOne))
        .div(scale.sub(Decimal.dOne));
}

function maxAffordable(base, scale, level, remaining, money) {
    if (remaining <= 0) return 0;

    const next = base.times(Decimal.pow(scale, level));
    if (money.lt(next)) return 0;

    let count;
    if (scale.eq(Decimal.dOne)) {
        count = Decimal.floor(money.div(next)).toNumber();
    } else {
        count = Decimal.floor(
            Decimal.log(
                money.div(next).times(scale.sub(Decimal.dOne)).add(Decimal.dOne),
                scale
            )
        ).toNumber();
    }

    if (!Number.isFinite(count)) count = remaining;
    count = Math.max(0, Math.min(count, remaining));

    while (count < remaining && totalCost(base, scale, level, count + 1).lte(money)) {
        count++;
    }
    while (count > 0 && totalCost(base, scale, level, count).gt(money)) {
        count--;
    }

    return count;
}

export function getCommonResearch(index, options = {}) {
    const data = options.data ?? gameState.data;
    const item = commonResearch[index];
    const scale = new Decimal(options.costScale ?? COMMON_SCALE);
    const baseCost = new Decimal(options.baseCost ?? item.baseCost);

    const level = Math.min(data.research.commonResearch[index] ?? 0, item.maxLevels);
    const remaining = item.maxLevels - level;

    const labLevel = Math.min(10, Math.max(0, data.research.epicResearch[1] ?? 0));
    const discount = new Decimal(labLevel).times(0.05);
    const divisor = Decimal.max(1, data.ascension?.researchCostDivisor ?? 1);
    const base = baseCost.times(Decimal.dOne.sub(discount)).div(divisor);

    const nextCost = base.times(Decimal.pow(scale, level));
    const buyAmount = Math.min(
        BUY_AMOUNTS[data.settings.buyAmounts[0]] ?? 1,
        remaining
    );
    const cost = totalCost(base, scale, level, buyAmount);
    const maxBuyAmount = maxAffordable(
        base,
        scale,
        level,
        remaining,
        data.currency.money
    );
    const buyCount = Math.min(buyAmount, maxBuyAmount);
    const charge = totalCost(base, scale, level, buyCount);

    return {
        level,
        maxLevel: item.maxLevels,
        nextCost,
        cost,
        buyAmount,
        maxBuyAmount,
        buyCount,
        charge,
        isMaxed: remaining <= 0
    };
}

export function purchaseCommonResearch(index, options = {}) {
    const data = options.data ?? gameState.data;
    const info = getCommonResearch(index, { ...options, data });

    if (info.buyCount <= 0) return;

    data.currency.money = data.currency.money.sub(info.charge);
    data.research.commonResearch[index] = info.level + info.buyCount;
}
```

### 4.2 Notes

- `getCommonResearch` reads `gameState.data` by default. Pass `options.data` only when you need a different state object.
- `costScale` is the future hook for Contracts and Eggspeditions. They are not implemented here.
- `baseCost` is also optional, for the same future use.
- The lab discount and artifact divisor apply to common research only, matching legacy.
- `Max` is `Infinity` in `BUY_AMOUNTS`, then clamped to `remaining`. No magic `9999`.
- `purchaseCommonResearch` uses `info.charge` and `info.buyCount` directly. It never recalculates with different inputs.
- The existing empty `purchaseEpicResearch` and `purchaseLegendaryResearch` can stay empty for now. They are separate tabs and not part of this fix.

### 4.3 Module cycle

`DataManager.svelte.js` imports the research arrays from `ResearchManager.js`. `ResearchManager.js` imports `gameState` from `DataManager.svelte.js`. That is a cycle.

It is safe only because `ResearchManager.js` reads `gameState` inside functions, never at module load. The arrays are defined before any function runs.

If that is unacceptable, the alternative is to pass `data` from `Research.svelte` and remove the `gameState` import. The functions already support that through `options.data`.

---

## 5. `Research.svelte`

Keep the existing layout, tiers, collapse behaviour, automation buttons, and styling. Make only these changes:

1. Import `commonResearch`, `getCommonResearch`, and `purchaseCommonResearch`.
2. Build a `$derived` row list with the global index and current numbers.
3. Replace `Level: 0` and `item.baseCost` with the calculated values.
4. Add `onclick`.
5. Replace the red/green class with the four-state class.

```svelte
<script>
    import { buyAmountLabels, gameState, toggleAutomator, updateBA } from "$lib/scripts/DataManager.svelte";
    import { toPlaces } from "$lib/scripts/Formatting";
    import {
        commonByTier,
        commonResearch,
        getCommonResearch,
        purchaseCommonResearch
    } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";

    let { collapsed = $bindable() } = $props();
    let data = $derived(gameState.data);
    let tiers = commonByTier();

    let rows = $derived.by(() =>
        tiers.map((items) =>
            items.map((item) => {
                const index = commonResearch.indexOf(item);
                return { item, index, info: getCommonResearch(index, { data }) };
            })
        )
    );

    function toggleCollapsed(i) {
        collapsed[i] = !collapsed[i];
    }

    function toRN(num) {
        const values = [
            { value: 1, numeral: "I" },
            { value: 4, numeral: "IV" },
            { value: 5, numeral: "V" },
            { value: 9, numeral: "IX" },
            { value: 10, numeral: "X" }
        ];
        let ret = "";
        for (let i = values.length - 1; i >= 0; i--) {
            while (num >= values[i].value) {
                ret += values[i].numeral;
                num -= values[i].value;
            }
        }
        return ret;
    }
</script>

<div class="flexRow">
    <button onclick={() => { updateBA(0); }}>Buy Amount: {buyAmountLabels[data.settings.buyAmounts[0]]}</button>
    <button onclick={() => { toggleAutomator(0, 0); }} class={data.automation.commonAutomatorActive[0] ? "button-green" : "button-red"}>Tier I-V Auto: {data.automation.commonAutomatorActive[0] ? "On" : "Off"}</button>
    <button onclick={() => { toggleAutomator(0, 1); }} class={data.automation.commonAutomatorActive[1] ? "button-green" : "button-red"}>Tier VI-X Auto: {data.automation.commonAutomatorActive[1] ? "On" : "Off"}</button>
    <button onclick={() => { toggleAutomator(0, 2); }} class={data.automation.commonAutomatorActive[2] ? "button-green" : "button-red"}>Tier XI-XIV Auto: {data.automation.commonAutomatorActive[2] ? "On" : "Off"}</button>
    <button onclick={() => { collapsed = tiers.map(() => true); }} class={collapsed.find((element) => element === false) !== undefined ? "button-green" : ""}>Collapse All Items</button>
</div>

<div class="tier-grid">
    <div class="heading">Tier</div>
    <div class="heading">Researches</div>

    {#each rows as items, i}
        <div class="tier-row tier-row-gray" class:collapsed={collapsed[i]}>
            <button class="tier-label" onclick={() => toggleCollapsed(i)}>Tier {toRN(i + 1)} {collapsed[i] ? "▸" : "▾"}</button>
            <div class="researches">
                {#each items as { item, index, info }}
                    <button
                        class={info.isMaxed
                            ? "button-blue"
                            : data.currency.money.gte(info.cost)
                                ? "button-green"
                                : data.currency.money.gte(info.nextCost)
                                    ? "button-yellow"
                                    : "button-red"}
                        disabled={info.isMaxed}
                        onclick={() => purchaseCommonResearch(index, { data })}
                    >
                        {item.title}<br>{item.description}<br>
                        {`Level: ${info.level}/${toPlaces(info.maxLevel, 0, info.maxLevel + 1)} | Cost: ${info.isMaxed ? "[MAXED]" : "$" + format(info.cost)}`}
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</div>
```

The parent already owns the collapsed state:

```svelte
let commonCollapsed = $state(commonTiers.map(() => true));
```

```svelte
<Research bind:collapsed={commonCollapsed} />
```

That is the existing `$state` use. The `rows` array is `$derived`, so it recalculates when `data.currency.money`, `data.research.commonResearch`, `data.settings.buyAmounts`, or the lab level changes. No manual refresh and no DOM writes.

---

## 6. Button behaviour

Common research:

| State | Class | Behaviour |
| --- | --- | --- |
| Max level | `button-blue` | Disabled. Shows `[MAXED]`. |
| Can afford the full selected interval | `button-green` | Buys the interval. |
| Can afford some, but not all | `button-yellow` | Buys the affordable subset. |
| Cannot afford any | `button-red` | Click does nothing. |

`Max` means all remaining levels. If the player cannot afford all of them, the button is yellow and the click buys what they can afford.

The button text stays legacy-style. Do not add a second line. If a tooltip is desired, it can say `Will buy 3/10 for $X`, but it is not required.

Epic and legendary keep their existing tabs. When they are implemented, use the same pattern with `button-purple` for fully buyable epic and `button-orange` for fully buyable legendary.

---

## 7. Checks

- `Max` buys all remaining levels, not `9999`.
- A full purchase charges `info.cost`.
- A partial purchase charges `info.charge` and adds `info.buyCount`.
- A maxed research is a no-op.
- The displayed cost and the charged cost come from the same `info` object.
- Common button classes are red, yellow, green, blue.
- The UI still uses the existing tier rows and buttons.
- No new components or config files are added.

---

## 8. Summary

The legacy bug is fixed by one rule: **the button and the purchase use the same calculated numbers**.

The implementation stays close to the existing code:

- research arrays stay in `ResearchManager.js`,
- `Research.svelte` keeps its current layout,
- two functions are added,
- no IDs,
- no new components,
- no generic engine,
- no extra configuration layer.

Future Contracts and Eggspeditions can pass `data`, `costScale`, or `baseCost` into the same two functions. They do not need a redesign now.
