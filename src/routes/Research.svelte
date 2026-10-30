<script>
    import { buyAmountLabels, gameState, toggleAutomator, updateBA } from "$lib/scripts/DataManager.svelte";
    import { toPlaces } from "$lib/scripts/Formatting";
    import { commonByTier, commonResearch } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";
    let { collapsed = $bindable() } = $props()
    let data = $derived(gameState.data)
    let tiers = commonByTier()
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

    {#each tiers as items, i}
        <div class="tier-row tier-row-gray" class:collapsed={collapsed[i]}>
            <button class="tier-label" onclick={() => toggleCollapsed(i)}>Tier {toRN(i + 1)} {collapsed[i] ? "▸" : "▾"}</button>
            <div class="researches">
                {#each items as item}
                    <button
                        class="{data.currency.money.lt(item.baseCost) ? 'button-red' : 'button-green'}"
                    >{item.title}<br>{item.description}<br>{`Level: 0/${toPlaces(item.maxLevels,0,item.maxLevels+1)} | Cost: $${format(item.baseCost)}` }</button>
                {/each}
            </div>
        </div>
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

    // One wrapper per tier row: spans the full grid so its background
    // is a continuous band, while subgrid keeps the two columns aligned.
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

    // The global `*` rule paints $bg-color on every element; clear it on the
    // row's direct children so the wrapper's color shows through.
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

</style>
