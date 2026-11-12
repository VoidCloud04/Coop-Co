<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { planets } from "$lib/scripts/EggspeditionsManager";


</script>

<div>
    <img src={planets[gameState.data.indexValues.currentPlanet].imgSrc} alt={planets[gameState.data.indexValues.currentPlanet].name}/>
</div>

<style lang="scss">
    @use "$lib/styles/variables" as *;

    div {
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

        img, p, h2 {
            color: inherit;
            background-color: inherit;
        }
        margin: 0;
    }
</style>