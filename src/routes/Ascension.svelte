<script>
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import Chip from "$lib/components/Chip.svelte";
    import { harvesterResources } from "$lib/scripts/AscensionManager";
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { planets } from "$lib/scripts/EggspeditionsManager";
    import { toPlaces } from "$lib/scripts/Formatting";
    import { legendaryResearch } from "$lib/scripts/ResearchManager";
    import { format } from "$lib/scripts/Utilities";
    
    let data = $derived(gameState.data)
    let tabIndex = $state(0)
    let tabs = [
        {title: "Ascension", class: "button-orange"},
        {title: "Refinement", class: "button-orange"},
        {title: "Transcension", class: "button-green"}
    ]
    function changeTab(i) {
        tabIndex = i
    }
</script>

<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if tabIndex === 0}
    <div class="flexRow" style="gap:0.25vw">
        <div class="flexCol bordered">
            {#each legendaryResearch as item, i}
                <button class="button-orange">{item.title}<br>{`${item.description}`}<br>Level: 0/{toPlaces(item.maxLevels,0,item.maxLevels+1)} | Cost: {format(item.baseCost)} Knowleggs</button>
            {/each}
        </div>
        <div class="flexCol bordered">
            <Chip imgSrc={`Images/Eggs/knowlegg.png`}
                content={`Knowleggs Eggs: ${format(data.currency.knowleggs)}`}
                color="gray"/>
            <div class="flexRow">
                <Chip content={`Enlightenment Egg Value: x${format(0.00)}`} color="yellow"/>
            </div>
        </div>
</div>
{:else if tabIndex === 1}
    <h3>Resources</h3>
    {#each new Array(harvesterResources.length / 3) as item, i}
        <div class="flexRow">
            {#each new Array(3) as item, j}
                <div class="flexCol bordered">
                    <div class="flexRow">
                        <Chip content={harvesterResources[(i*3)+j].title} imgSrc={`Images/${harvesterResources[(i*3)+j].imgSrc}`} />
                        <Chip content={planets[(i*3)+j].name} imgSrc={planets[(i*3)+j].imgSrc} />
                    </div>
                    <div class="flexRow">
                        <Chip color={"green"} content={"1.00e3 (+42/s)"} />
                        <Chip color={"orange"} content={"x1.01 Time Speed"} />
                        <Chip color={"blue"} content={"Production Tier I"} />
                    </div>
                </div>
            {/each}
        </div>
    {/each}
    <h3>Refinement</h3>
{/if}

<style lang="scss">
    @use "$lib/styles/variables" as *;

    h3, h4, p {
        color: $orange;
    }

    .bordered {
        border: $borderWidth solid $orange;
        border-radius: $borderRadius;
        padding: 10px
    }

    .flexCol {
        align-items: stretch;
    }

    .flexRow {
        gap: 0.25vw;
    }
</style>