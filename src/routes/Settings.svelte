<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import ButtonGroup from "$lib/components/ButtonGroup.svelte";
    import { format } from "$lib/scripts/Utilities";
    let data = $derived(gameState.data)
    let tabs = $state([
    {title: "Settings", class: ""},
    {title: "Stats", class: ""},
    {title: "Help"}
    ])
    let subTab = $state(0)
    function changeTab(i) {
        subTab =i
        if(subTab >= tabs.length)
            subTab = 0
    }
</script>

<ButtonGroup buttonArr={tabs} onclick={changeTab}/>
{#if subTab === 0}
    <div class="flexRow">
        <button class="button-green">Save Game</button>
        <button>Import Save</button>
        <button>Export Save</button>
        <button class="button-red">Delete Save</button>
    </div>
    <div class="flexRow">
        <button>Notation: Mixed Sci</button>
        <button class={"button-green"}>Newsticker: On</button>
        <button class={"button-green"}>Contract Notifications: On</button>
        <button class={"button-blue"}>Auto Promotion Stops At: Universe</button>
    </div>
    <div class="flexRow">
        <button class={"button-green"}>Prestige Confirmation: On</button>
        <button class={"button-green"}>Ascension Confirmation: On</button>
        <button class={"button-green"}>Harvester Notifications: On</button>
    </div>
{:else if subTab === 1}
    <div class="flexRow">
        <div class="flexCol statHolder">
            <h3>General Stats</h3>
            <p>Best Money: <span class="green">$1.00e3</span> </p>
            <p>Best Chickens: 1.00e3</p>
            <p>Highest Egg Unlocked: Superfood</p>
            <p>Time Played: 4,000h</p>
        </div>
        <div class="flexCol statHolder green">
            <h3>Contract Stats</h3>
        </div>
        <div class="flexCol statHolder blue">
            <h3>Eggspeditions Stats</h3>
        </div>
        <div class="flexCol statHolder purple">
            <h3>Prestige Stats</h3>
            <h4>Last 3 Prestiges</h4>
            {#each data.stats.last3Prestiges as item, i}
                <p>#{i+1} - <span class="purple">{format(item)} Soul Eggs</span></p>
            {/each}
            <p>Average Gain: <span class="purple">{format((data.stats.last3Prestiges[0].plus(data.stats.last3Prestiges[1]).plus(data.stats.last3Prestiges[2])).div(3))} Soul Eggs</span></p>
            <h4>Other Stats</h4>
            <p>Best Soul Eggs: <span class="purple">{format(data.stats.bestSoulEggs)}</span></p>
            <p>Time in Current Prestige: 1s</p>
        </div>
        <div class="flexCol statHolder orange">
            <h3>Ascension Stats</h3>
            <h4>Last 3 Ascensions</h4>
            {#each data.stats.last3Ascensions as item, i}
                <p>#{i+1} - <span class="yellow">{format(item)} Knowleggs</span></p>
            {/each}
            <p>Average Gain: <span class="yellow">{format((data.stats.last3Ascensions[0].plus(data.stats.last3Ascensions[1]).plus(data.stats.last3Ascensions[2])).div(3))} Knowleggs</span></p>
            <h4>Other Stats</h4>
            <p>Best Knowleggs: <span class="yellow">{format(data.stats.bestKnowleggs)}</span></p>
            <p>Time in Current Ascension: 1s</p>
        </div>
    </div>
{:else if subTab === 2}

{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;
    .statHolder {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 10px;
        margin-left: 0.25vw;
        margin-right: 0.25vw;
    }
    @each $name, $color in $majorColors {
        .#{$name} {
            border-color: $color;
            color: $color;
        }
    }
</style>