<script>
    import { gradeNames } from "$lib/scripts/ContractsManager";
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { eggs, promoteEgg, regularEggImgIds } from "$lib/scripts/EggManager";
    import { calculateSoulEggGain, prestige } from "$lib/scripts/Prestige.svelte";
    import { format } from "$lib/scripts/Utilities";
    import { onMount } from "svelte";
    import Chip from "./Chip.svelte";

    let data = $derived(gameState.data)
    let soulEggGain = $derived(calculateSoulEggGain())
    // console.log(eggs[data.indexValues.currentEgg + 1].discoveryReq)
    // console.log(eggs[data.indexValues.currentEgg + 1].unlockReq)
    // console.log(data.currency.money)
    // console.log(data.indexValues.currentEgg)
    onMount(() => {
        console.log($state.snapshot(data.indexValues.currentContract))
        console.log($state.snapshot(data.contracts.contractPool))
    })
</script>

<div>
    {#if data.progression.unlockedContracts}
        <Chip content="USDE {gradeNames[data.contracts.gradeIndex]}" color={gradeNames[data.contracts.gradeIndex]}/>
    {/if}
    <img src="/Images/Eggs/{regularEggImgIds[data.indexValues.currentEgg]}.png" alt="{eggs[data.indexValues.currentEgg].name} Egg">
    {#if data.indexValues.currentEgg < data.progression.unlockedEgg.length - 1 && data.indexValues.currentContract === -1 && data.indexValues.currentPlanet === -1}
        <button id="promotion-button" 
        class="button{data.currency.money.gte(eggs[data.indexValues.currentEgg + 1].unlockReq) ? '-green' : '-red' }-header"
        onclick={promoteEgg}>Promote to Next Egg!</button>
    {/if}
    {#if data.indexValues.currentContract !== -1 && data.contracts.contractPool[data.indexValues.currentContract].goal[0] === 0}
        <p>Eggs Produced: {format(gameState.data.contracts.eggProgress)}</p>
    {/if}
    <h2>${format(gameState.data.currency.money)}</h2>
    <p>Chickens: {format(data.currency.chickens)}</p>
    {#if data.indexValues.currentEgg >= 3 && data.indexValues.currentContract === -1 && data.indexValues.currentPlanet === -1}
        <button id="prestige-button" class="button-purple-header" onclick={prestige}>Prestige +{format(soulEggGain)} Soul Eggs</button>
    {/if}
    {#if data.progression.hasPrestiges && data.indexValues.currentEgg === data.progression.unlockedEgg.length -1 && data.indexValues.currentContract === -1 && data.indexValues.currentPlanet === -1}
        <button id="ascension-button" class="button-orange-header">Ascend</button>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    
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