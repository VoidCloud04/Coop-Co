<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Chip from "$lib/components/Chip.svelte";
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { toPlaces } from "$lib/scripts/Formatting";
    import { legendaryResearch } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";
    
    let data = $derived(gameState.data)
    let tabIndex = $state(0)
    let tabs = [
        {title: "Ascension", class: "button-orange"},
        {title: "Reliquary", class: "button-orange"},
    ]
    function changeTab(i) {
        tabIndex = i
    }
</script>

<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if tabIndex === 0}
    <div class="flexRow" style="gap:0.25vw">
        <div class="flexCol">
            {#each legendaryResearch as item, i}
                <button class="button-orange">{item.title}<br>{`${item.description}`}<br>Level: 0/{toPlaces(item.maxLevels,0,item.maxLevels+1)} | Cost: {format(item.baseCost)} Knowleggs</button>
            {/each}
        </div>
        <div class="flexCol">
            <Chip imgSrc={`Images/Eggs/knowlegg.png`}
                content={`Knowleggs Eggs: ${format(data.currency.knowleggs)}`}
                color="gray"/>
            <div class="flexRow">
                <Chip content={`Enlightenment Egg Value: x${format(0.00)}`} color="yellow"/>
            </div>
        </div>
</div>
{:else if tabIndex === 1}
    <h3>Reliquary</h3>
{/if}

<style lang="scss">
    @use "$lib/styles/variables" as *;

    h3 {
        color: $orange;
    }

    .flexCol {
        border: $borderWidth solid $orange;
        border-radius: $borderRadius;
    }
</style>