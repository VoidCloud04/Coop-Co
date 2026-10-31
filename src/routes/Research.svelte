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
    let { collapsed = $bindable() } = $props()
    let data = $derived(gameState.data)
    let tiers = commonByTier()
    let rows = $derived.by(() =>
        tiers.map((items) =>
            items.map((item) => {
                const index = commonResearch.indexOf(item)
                return { item, index, info: getCommonResearch(index, { data }) }
            })
        )
    )
    let unlockedTiers = $derived.by(() => {
        const unlocked = [true]
        for(let i = 1; i < rows.length; i++) {
            const previous = rows[i - 1]
            const totalLevels = previous.reduce((sum, { info }) => sum + info.level, 0)
            const totalMaxLevels = previous.reduce((sum, { info }) => sum + info.maxLevel, 0)
            unlocked.push(totalMaxLevels === 0 || totalLevels / totalMaxLevels >= 0.25)
        }
        return unlocked
    })
    let maxedTiers = $derived(rows.map((items) =>
        items.length > 0 && items.every(({ info }) => info.isMaxed)
    ))
    function toggleCollapsed(i) {
        collapsed[i] = !collapsed[i]
    }

    function toRN(num) {
        const values = [
            {
                value: 1,
                numeral: "I"
            },
            {
                value: 4,
                numeral: "IV"
            },
            {
                value: 5,
                numeral: "V"
            },
            {
                value: 9,
                numeral: "IX"
            },
            {
                value: 10,
                numeral: "X"
            }
        ]
        let ret = ""
        for(let i = values.length - 1; i >= 0; i--) {
            while(num >= values[i].value) {
                ret += values[i].numeral
                num -= values[i].value
            }
        }
        return ret
    }
</script>
<div class="flexRow">
    <button onclick={() => {updateBA(0)}}>Buy Amount: {buyAmountLabels[data.settings.buyAmounts[0]]}</button>
    <button onclick={() => {toggleAutomator(0,0)}} class={data.automation.commonAutomatorActive[0] ? 'button-green' : 'button-red'}>Tier I-V Auto: {data.automation.commonAutomatorActive[0] ? 'On' : 'Off'}</button>
    <button onclick={() => {toggleAutomator(0,1)}} class={data.automation.commonAutomatorActive[1] ? 'button-green' : 'button-red'}>Tier VI-X Auto: {data.automation.commonAutomatorActive[1] ? 'On' : 'Off'}</button>
    <button onclick={() => {toggleAutomator(0,2)}} class={data.automation.commonAutomatorActive[2] ? 'button-green' : 'button-red'}>Tier XI-XIV Auto: {data.automation.commonAutomatorActive[2] ? 'On' : 'Off'}</button>
    <button onclick={() => {collapsed = tiers.map(() => true)}} class={collapsed.find((element) => element === false) !== undefined ? 'button-green' : ''}>Collapse All Items</button>
</div>
<div class="tier-grid">
    <div class="heading">Tier</div>
    <div class="heading">Researches</div>

    {#each rows as items, i}
        {#if unlockedTiers[i]}
            <div class="tier-row {maxedTiers[i] ? 'tier-row-blue' : 'tier-row-gray'}" class:collapsed={collapsed[i]}>
                <button class="tier-label" onclick={() => toggleCollapsed(i)}>Tier {toRN(i + 1)} {collapsed[i] ? "▸" : "▾"}</button>
                <div class="researches">
                    {#each items as { item, index, info }}
                        <button
                            class={info.isMaxed
                                ? 'button-blue'
                                : data.currency.money.gte(info.cost)
                                    ? 'button-green'
                                    : data.currency.money.gte(info.nextCost)
                                        ? 'button-yellow'
                                        : 'button-red'}
                            disabled={info.isMaxed}
                            onclick={() => purchaseCommonResearch(index)}
                        >{item.title}<br>{item.description}<br>{`Level: ${info.level}/${toPlaces(info.maxLevel,0,info.maxLevel+1)} | Cost: ${info.isMaxed ? "[MAXED]" : "$" + format(info.cost)}`}</button>
                    {/each}
                </div>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .tier-grid {
        display: grid;
        grid-template-columns: 8rem minmax(0, 1fr);
        gap: 0.5rem 1rem;
        align-items: start;
    }

    .heading {
        font-weight: bold;
        border-bottom: 2px solid $white;
    }

    .tier-row {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: subgrid;
        column-gap: 1rem;
        align-items: center;
        padding-block: 0.25rem;
        border-radius: $borderRadius;
        padding: 0.2vh 0.2vw 0.2vh 0.2vw;
    }

    .tier-row > * {
        background-color: transparent;
    }

    .tier-label {
        border: none;
        text-align: left;
        cursor: pointer;
        font-weight: bold;
    }

    .researches {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .collapsed .researches {
        display: none;
    }

    @each $name, $color in $majorColors {
        .tier-row-#{$name} {
            background-color: $color;
        }
    }

    .tier-row-blue {
        .button-blue {
            background-color: $blue;
            border-color: $white;
            color: $white;

            &:hover {
                background-color: $white;
                color: $bg-color;
            }
        }
    }

</style>
