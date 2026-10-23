<script>
    import Chip from "$lib/components/Chip.svelte";
    import { buyAmountLabels, gameState, toggleAutomator, updateBA } from "$lib/scripts/DataManager.svelte";
    import { toPlaces } from "$lib/scripts/Formatting";
    import { epicResearch } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";
    let data = $derived(gameState.data)
    const automationSplitIndex = 6
    const normalResearch = epicResearch.slice(0,automationSplitIndex)
    const automation = epicResearch.slice(automationSplitIndex)
</script>
<div class="flexRow">
    <button class="button-purple" onclick={() => {updateBA(1)}}>Buy Amount: {buyAmountLabels[data.settings.buyAmounts[1]]}</button>
    <button onclick={() => {toggleAutomator(1,0)}} class={data.automation.epicAutomatorActive[0] ? 'button-green' : 'button-red'}>Promotion Automation: {data.automation.epicAutomatorActive[0] ? 'On' : 'Off'}</button>
</div>
<div class="flexRow" style="gap:0.25vw">
    <div class="flexCol">
        <h3>Boosts</h3>
        {#each normalResearch as item, i}
            <button class="button-purple">{item.title} | {item.description}<br>Level: 0/{toPlaces(item.maxLevels,0,item.maxLevels+1)} | Cost: {format(item.baseCost)} Soul Eggs</button>
        {/each}
        <h3>Automation</h3>
        {#each automation as item, i}
            <button class="button-yellow">{item.title} | {item.description}<br>Level: 0/{toPlaces(item.maxLevels,0,item.maxLevels+1)} | Cost: {format(item.baseCost)} Prophecy Eggs</button>
        {/each}
    </div>
    <div class="flexCol">
        <Chip imgSrc={`Images/Eggs/soul.png`}
            content={`Soul Eggs: ${format(data.currency.soulEggs)}`}
            color="gray"/>
        <div class="flexRow">
            
            <Chip content={`Earnings Boost: x${format(0.00)}`} color="purple"/>
        </div>
        <Chip imgSrc={`Images/Eggs/prophecy.png`}
            content={`Prophecy Eggs: ${format(data.currency.prophecyEggs)}`}
            color="gray"/>
        <div class="flexRow">
            
            <Chip content={`Soul Boost: x${format(0.00)}`} color="yellow"/>
            <Chip content={`Contract Boost: x${format(0.00)}`} color="yellow"/>
            <Chip content={`Softcap: /${format(0.00)}`} color="red"/>
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    h3 {
        text-align: center;
        color: $purple;
    }
    .flexCol {
        border: $borderWidth solid $purple;
        border-radius: $borderRadius;
    }
</style>