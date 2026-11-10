<script>
    import Chip from "$lib/components/Chip.svelte";
    import { buyAmountLabels, gameState, toggleAutomator, updateBA } from "$lib/scripts/DataManager.svelte";
    import { toPlaces } from "$lib/scripts/Formatting";
    import { calculateEffectiveProphecyEggs, calculateProphecyEggRewardBonus, calculateProphecyEggSoulBonus, calculateProphecyGoalDebuff, calculateSoulEggBoost } from "$lib/scripts/Prestige.svelte";
    import { epicResearch, getEpicResearch, purchaseEpicResearch } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";
    import Decimal from "break_eternity.js";
    let data = $derived(gameState.data)
    const automationSplitIndex = 6
    let rows = $derived.by(() =>
        epicResearch.map((item, index) => ({
            item,
            index,
            info: getEpicResearch(index, { data })
        }))
    )
    let normalResearch = $derived(rows.slice(0, automationSplitIndex))
    let automation = $derived(rows.slice(automationSplitIndex))
    let soulEggBoost = $derived(calculateSoulEggBoost())
    let softCap = $derived(Decimal.min(0,calculateEffectiveProphecyEggs().dividedBy(data.currency.prophecyEggs)))
    let prophecySoulBonus = $derived(calculateProphecyEggSoulBonus())
    let prophecyRewardBonus = $derived(calculateProphecyEggRewardBonus())
    let prophecyGoalDebuff = $derived(calculateProphecyGoalDebuff(0).add(calculateProphecyGoalDebuff(1)).add(calculateProphecyGoalDebuff(2)).divideBy(3))

    function currencyLabel(info) {
        return info.currencyKey === 'soulEggs' ? 'Soul Eggs' : 'Prophecy Eggs'
    }

    function researchClass(info) {
        if (info.isMaxed) return 'button-blue'
        if (info.currency.gte(info.cost)) return 'button-green'
        if (info.currency.gte(info.nextCost)) return 'button-yellow'
        return 'button-red'
    }
</script>
<div class="flexRow">
    <button class="button-purple" onclick={() => {updateBA(1)}}>Buy Amount: {buyAmountLabels[data.settings.buyAmounts[1]]}</button>
    {#if data.research.epicResearch[9] >= 1}
    <button onclick={() => {toggleAutomator(1,0)}} class={data.automation.epicAutomatorActive[0] ? 'button-green' : 'button-red'}>Promotion Automation: {data.automation.epicAutomatorActive[0] ? 'On' : 'Off'}</button>
    {/if}
</div>
<div class="flexRow" style="gap:0.25vw">
    <div class="flexCol border">
        <h3>Boosts</h3>
        {#each normalResearch as { item, index, info }}
            <button
                class={researchClass(info)}
                disabled={info.isMaxed}
                onclick={() => purchaseEpicResearch(index, { data })}
            >{item.title} | {item.description}<br>Level: {info.level}/{toPlaces(info.maxLevel,0,info.maxLevel+1)} | Cost: {info.isMaxed ? "[MAXED]" : `${format(info.cost)} ${currencyLabel(info)}`}</button>
        {/each}
        <h3>Automation</h3>
        {#each automation as { item, index, info }}
            <button
                class={researchClass(info)}
                disabled={info.isMaxed}
                onclick={() => purchaseEpicResearch(index, { data })}
            >{item.title} | {item.description}<br>Level: {info.level}/{toPlaces(info.maxLevel,0,info.maxLevel+1)} | Cost: {info.isMaxed ? "[MAXED]" : `${format(info.cost)} ${currencyLabel(info)}`}</button>
        {/each}
    </div>
    <div class="flexCol border">
        <Chip imgSrc={`Images/Eggs/soul.png`}
            content={`Soul Eggs: ${format(data.currency.soulEggs)}`}
            color="gray"/>
        <div class="flexRow">
            
            <Chip content={`Earnings Boost: x${format(soulEggBoost)}`} color="purple"/>
        </div>
        <Chip imgSrc={`Images/Eggs/prophecy.png`}
            content={`Prophecy Eggs: ${format(data.currency.prophecyEggs)}`}
            color="gray"/>
        <div class="flexCol">
            <div class="flexRow">
                <Chip content={`Soul Boost: x${format(prophecySoulBonus)}`} color="yellow"/>
                <Chip content={`Contract Reward Boost: x${format(prophecyRewardBonus)}`} color="yellow"/>
            </div>
            <div class="flexRow">
                {#if prophecyGoalDebuff.gt(1)}
                    <Chip content={`Avg Contract Goal Debuff: x${format(prophecyGoalDebuff)}`} color="red"/>
                {/if}
                {#if softCap.gt(0)}
                    <Chip content={`Softcap: /${format(softCap)}`} color="red"/>
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    h3 {
        text-align: center;
        color: $purple;
    }

    .border {
        border: $borderWidth solid $purple;
        border-radius: $borderRadius;
    }
</style>