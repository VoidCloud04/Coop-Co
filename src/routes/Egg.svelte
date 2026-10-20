<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { format } from "$lib/scripts/Utilities";
    import { eggs } from "$lib/scripts/EggManager";


</script>

<div class="flexCol holder">
    <div class="flexRow">
        <img src="/Images/Eggs/egg.png" alt="Bruh">
        <div class="flexCol">
            <p><strong>{eggs[data.indexValues.currentEgg].name} Egg</strong><br>${format(eggs[data.indexValues.currentEgg].baseValue)} per Egg x3.40</p>
            <p>Income: $1/s | Egg Lay Rate: 40/s<br>Chickens: 10 (+10/s)</p>
        </div>
    </div>
    <div class="flexRow">
        <p>Bonus Breakdown: </p>
    </div>
</div>

<div class="flexCol holder">
    <div>Promotion Ticker</div>
    <p>Regular {"-->"} Superfood {"-->"} Medical</p>
    <div class="flexCol holder">
        <p>Next: Rocketfuel Egg</p>
        <div>████████████░░░░░░░░░░░░░░ (41%) - 1.27e3/1.60e2</div>
        <p>Value: 3.00e3, 400x over current egg</p>
    </div>
</div>

<button id="hatch-button" class="button-red" onclick={() => {data.currency.chickens = data.currency.chickens.plus(1)}}>
    Click to Hatch +1 Chicken
</button>

<style lang="scss">
    @use '$lib/styles/variables' as *;

    .holder {
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 0.2vh 0.2vw 0.2vh 0.2vw;
    }

    #hatch-button {
        position: fixed;
        width: 50%;
        height: auto;
        font-size: 1.5em;
        bottom: 1dvh;
    }
</style>