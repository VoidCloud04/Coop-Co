<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { planets } from "$lib/scripts/EggspeditionsManager";
    import Chip from "../Chip.svelte";


</script>

<div class="headerRow">
    <Chip content={planets[gameState.data.indexValues.currentPlanet].name} imgSrc={planets[gameState.data.indexValues.currentPlanet].imgSrc}/>
    <div class="flexRow eggspeditionInfo">
        <p>Challenge Level: 1</p>
        <p>Challenge Goal: Something</p>
    </div>

    <div class="flexRow extraInfo">
        <h3>Eggs: 0.000</h3>
        <h3 id="moneyText">$ 0.000</h3>
        <h3>Chickens: 0.000</h3>
    </div>
    <!-- Harvester Specific Stuff -->
    {#if true}
        <div class="flexRow harvesterInfo">
            <p>Harvester Construction Phase 1</p>
            <p>Progress: 0%</p>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "$lib/styles/variables" as *;

    #moneyText {
        color: $green
    }

    .eggspeditionInfo {
        background-color: $blue;
        border-radius: $borderRadius;
    }

    .harvesterInfo {
        background-color: $orange;
        border-radius: $borderRadius;
    }

    .extraInfo {
        background-color: $darkgray;
        border-radius: $borderRadius;
    }

    .headerRow {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        background-color: $header-color;
        color: black;
        width: 100%;
        padding-top: 0.5vh;
        padding-bottom: 0.5vh;
        * {
            margin-left: 0.5vw;
            margin-right: 0.5vw;
        }

        img, p, h2,h3 {
            color: inherit;
            background-color: inherit;
        }
        margin: 0;
    }
</style>