<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { format } from "$lib/scripts/Utilities";
    import { planets, hiddenPlanetImg } from "$lib/scripts/EggspeditionsManager";
    import Chip from "$lib/components/Chip.svelte";
    let data = $derived(gameState.data)
    const planetRowCount = planets.length / 3
    const planetsSilced = new Array(planetRowCount)
    for(let i = 0; i < planetRowCount; i++) {
        planetsSilced[i] = planets.slice(i + (i*2),3+(i*3))
    }
    let selectIndex = $state(-1)
</script>

<div class="flexRow">
    <div class="flexCol border">
        <h3>Planetary System</h3>
        {#each planetsSilced as planet, i}
            <div class="flexRow">
                {#each planet as item, j}
                    <button
                    type="button"
                    aria-label={item.name}
                    onclick={() => (selectIndex = (i * 3) + j)}
                    style={(i*3 + j) == 2 && !data.progression.hasAscended ? 'display:none' : ''}
                    class={(i*3 + j) == 2 ? 'button-orange planetIcon' : 'planetIcon'}
                    >
                        <img src={data.progression.unlockedPlanet[(i*3) + j] ? item.imgSrc : hiddenPlanetImg} alt="" />
                    </button>
                {/each}
            </div>
        {/each}
    </div>
    <div class="flexCol border">
        {#if selectIndex != -1}
        <h3>Planetary Information</h3>
        <Chip imgSrc={data.progression.unlockedPlanet[selectIndex] ? planets[selectIndex].imgSrc : hiddenPlanetImg} 
        content={data.progression.unlockedPlanet[selectIndex] ? planets[selectIndex].name : '???'} 
        color={data.progression.unlockedPlanet[selectIndex] ? "blue" : "gray"}/>
        <Chip color={"green"} content={"Planetary Value: $0.00"} />
        <Chip color={"blue"} content={"Bonus: x0.00"} />
        

            {#if data.progression.unlockedPlanet[selectIndex]}
                <button class={"button-green"}>Travel to {planets[selectIndex].name}</button>
            {:else}
                <Chip color={"red"} content={"Discovery Cost: ???"} />
                <button class={"button-red"}>Discover ???</button>
            {/if}
        {:else}
        <h3>No Planet Selected</h3>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .border {
        border: $borderWidth solid $blue;
        border-radius: $borderRadius;
        margin-right: 0.25vw;
        margin-left: 0.25vw;
    }
    .flexCol {
        padding: 10px
    }

    .planetIcon {
        margin-left: 0.25vw;
        margin-right: 0.25vw;
        padding: 10px;
        border: $borderWidth solid inherit;
        border-radius: $borderRadius;

        img {
            height: 7em;
            width: 7em;
            background-color: inherit;
        }
    }
    .button-orange .planetIcon {
        border-color: $orange;
    }
</style>