<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { eggs, regularEggImgIds } from "$lib/scripts/EggManager";

    console.log(eggs[data.indexValues.currentEgg + 1].discoveryReq)
    console.log(eggs[data.indexValues.currentEgg + 1].unlockReq)
    console.log(data.currency.money)
    console.log(data.indexValues.currentEgg)
</script>

<div>
    <img src="/Images/Eggs/{regularEggImgIds[data.indexValues.currentEgg]}.png" alt="{eggs[data.indexValues.currentEgg].name} Egg">
    {#if data.indexValues.currentEgg < data.progression.unlockedEgg.length}
        <button id="promotion-button" class="button{data.currency.money.gte(eggs[data.indexValues.currentEgg + 1].discoveryReq) && data.currency.money.lt(eggs[data.indexValues.currentEgg + 1].unlockReq) ? '-yellow' : '-red' }{data.currency.money.gte(eggs[data.indexValues.currentEgg + 1].unlockReq) ? '-green' : '' }-header">Promote to Next Egg!</button>
    {/if}
    <h2>1000 $</h2>
    <p>Chickens: 1000</p>
    <button id="prestige-button" class="button-purple-header">Prestige</button>
    <button id="ascension-button" class="button-orange-header">Ascend</button>
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
            margin-top: 0.5vh;
            margin-bottom: 0.5vh;
        }

        img, p, h2 {
            color: inherit;
            background-color: inherit;
        }
        margin: 0;
    }



</style>