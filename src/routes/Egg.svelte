<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { format } from "$lib/scripts/Utilities";
    import { eggs, regularEggImgIds } from "$lib/scripts/EggManager";
    import Decimal from "break_eternity.js";
    import Chip from "$lib/components/Chip.svelte";

    const currentEgg = $derived(eggs[data.indexValues.currentEgg])
    const nextEgg = $derived(eggs[data.indexValues.currentEgg+1])
    const progressPercent = $derived(Decimal.min(100,Decimal.max(0,data.currency.money.log10().dividedBy(nextEgg.unlockReq.log10()).times(100))))
    const tickPercent = $derived(Decimal.min(100,Decimal.max(0,nextEgg.discoveryReq.log10().dividedBy(nextEgg.unlockReq.log10()).times(100))))
</script>

<div class="flexCol holder">
    <div class="flexRow">
        <img src="/Images/Eggs/egg.png" alt="Bruh">
        <div class="flexCol">
            <p><strong>{currentEgg.name} Egg</strong><br>${format(currentEgg.baseValue)} per Egg x3.40</p>
            <p>Income: $1/s | Egg Lay Rate: 40/s<br>Chickens: {format(data.currency.chickens)} (+10/s)</p>
        </div>
    </div>
    <div class="flexRow">
        <p>Bonus Breakdown: </p>
    </div>
</div>

<div class="flexCol holder">
    <div>Promotion Ticker</div>
    <div class="flexRow">
        <button>{"<<<"}</button>
        <Chip imgSrc={`Images/Eggs/${regularEggImgIds[data.indexValues.currentEgg]}.png`} content={currentEgg.name} color={"blue"}></Chip>
        {"=>"}
        <Chip imgSrc={`Images/Eggs/${regularEggImgIds[data.indexValues.currentEgg+1]}.png`}  content={nextEgg.name} color={"green"}></Chip>
        <button>{">>>"}</button>
    </div>
    <div class="flexCol holder">
        {#if data.indexValues.currentEgg < eggs.length-1}
            <p>Next: {data.indexValues.currentEgg < eggs.length-1 && data.progression.unlockedEgg[data.indexValues.currentEgg+1] ? `${nextEgg.name} Egg` : '???'}</p>
            <div class="flexRow progress-row">
                <span
                    class="progress-bar"
                    style={`--progress: ${progressPercent}%; --tick-position: ${tickPercent}%`}
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={progressPercent}
                ></span>
            </div>
        {/if}
        <p>Value: ${format(nextEgg.baseValue)}, {format(nextEgg.baseValue.div(currentEgg.baseValue))}x over current egg</p>
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

    .progress-row {
        width: 100%;
    }

    .progress-bar {
        display: block;
        position: relative;
        flex: 1;
        min-width: 0;
        height: 1rem;
        box-sizing: border-box;

        border: $borderWidth solid $white;
        border-radius: $borderRadius;

        // Green fill, red remainder
        background: linear-gradient(
            90deg,
            $green 0%,
            $green var(--progress),
            $red var(--progress),
            $red 100%
        );

        &::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: var(--tick-position);
            width: 2px;
            background: $yellow;
            transform: translateX(-50%);
        }
    }
</style>