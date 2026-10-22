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

    let unlockDisplayIndex = $derived(data.indexValues.currentEgg)
    let unlockDisplayEgg = $derived(eggs[unlockDisplayIndex])
    let nextDisplayIndex = $derived(unlockDisplayIndex + 1)
    let nextDisplayEgg = $derived(eggs[nextDisplayIndex])

    function eggChipColor(index) {
        if(data.indexValues.currentEgg === index)
            return "blue"
        else if(data.progression.unlockedEgg[index])
            return "green"
        else
            return "gray"
    }
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
    <p style="text-align: center;">Egg Unlocks</p>
    <div class="flexRow" style="display: inline-flex; align-self:center; align-items: center;">
        <button onclick={() => {unlockDisplayIndex -= 1}} disabled={unlockDisplayIndex === 0} class={unlockDisplayIndex === 0 ? "button-gray" : ""}>{"<<<"}</button>
        <Chip 
            imgSrc={data.progression.unlockedEgg[unlockDisplayIndex] ? `Images/Eggs/${regularEggImgIds[unlockDisplayIndex]}.png` : `Images/Eggs/question.png`} 
            content={data.progression.unlockedEgg[unlockDisplayIndex] ? unlockDisplayEgg.name : '???'} 
            color={eggChipColor(unlockDisplayIndex)}></Chip>
        {"=>"}
        <Chip 
            imgSrc={data.progression.unlockedEgg[nextDisplayIndex] ? `Images/Eggs/${regularEggImgIds[nextDisplayIndex]}.png` : `Images/Eggs/question.png`} 
            content={data.progression.unlockedEgg[nextDisplayIndex] ? nextDisplayEgg.name : '???'} 
            color={eggChipColor(nextDisplayIndex)}></Chip>
        <button onclick={() => {unlockDisplayIndex += 1}} disabled={nextDisplayIndex === (eggs.length - 1)} class={nextDisplayIndex === (eggs.length - 1) ? "button-gray" : ""}>{">>>"}</button>
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
        <div class="flexRow">
            {#if data.indexValues.currentEgg < eggs.length - 1}
                {#if !data.progression.unlockedEgg[data.indexValues.currentEgg+1]}
                <Chip content={`Discover At: $${format(nextEgg.discoveryReq)}`} color={"yellow"}/>
                {/if}
                <Chip content={`Unlock At: $${format(nextEgg.unlockReq)}`} color={"green"}/>
            {/if}
        </div>
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