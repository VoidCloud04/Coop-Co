<script>
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { eggs, promoteEgg, regularEggImgIds } from "$lib/scripts/EggManager";
    import { format } from "$lib/scripts/Utilities";
    import Chip from "./Chip.svelte";

    let data = $derived(gameState.data)

    // console.log(eggs[data.indexValues.currentEgg + 1].discoveryReq)
    // console.log(eggs[data.indexValues.currentEgg + 1].unlockReq)
    // console.log(data.currency.money)
    // console.log(data.indexValues.currentEgg)
</script>

<div>
    {#if data.progression.unlockedContracts}
        <Chip content="USDE AA" color="gray"/>
    {/if}
    <img src="/Images/Eggs/{regularEggImgIds[data.indexValues.currentEgg]}.png" alt="{eggs[data.indexValues.currentEgg].name} Egg">
    {#if data.indexValues.currentEgg < data.progression.unlockedEgg.length - 1}
        <button id="promotion-button" 
        class="button{data.currency.money.gte(eggs[data.indexValues.currentEgg + 1].unlockReq) ? '-green' : '-red' }-header"
        onclick={promoteEgg}>Promote to Next Egg!</button>
    {/if}
    <h2>${format(gameState.data.currency.money)}</h2>
    <p>Chickens: {format(data.currency.chickens)}</p>
    {#if data.indexValues.currentEgg >= 3}
        <button id="prestige-button" class="button-purple-header">Prestige</button>
    {/if}
    {#if data.progression.hasPrestiges && data.indexValues.currentEgg === data.progression.unlockedEgg.length -1}
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