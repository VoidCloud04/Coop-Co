<script>
    import { achievements } from "$lib/scripts/AchievementsManager";
    import { gameState } from "$lib/scripts/DataManager.svelte";
    import { onMount } from "svelte";
    let data = $derived(gameState.data)
    const columns = new Array(Math.ceil(achievements.length / 8))
    let hoverIndex = $state(-1)
    let currAchievement = $derived(achievements[hoverIndex])

    console.log(achievements)
</script>
<h3>Achievements</h3>
<div class="flexRow">
    {#each columns as col, i}
        <div class="flexCol" style="margin-left: 0.25vw; margin-right: 0.25vw;">
            <!-- <p>[{i + (7*i)} | {8 + (i*8)}]</p> -->
            {#each achievements.slice(i + (7*i),8+(8*i)) as ach,j}
                {#if ach.name !== ''}
                    <img 
                    onmouseenter={() => {hoverIndex = (j + 8*i)}} 
                    class={`ach ${achievements[j+i*8].unlockCondition() ? 'ach-green' : 'ach-red'}`} 
                    src={achievements[j+i*8].hidden && !achievements[j+i*8].unlockCondition() ? `Images/${achievements[j+i*8].hiddenImg}` : `Images/${achievements[j+i*8].img}`} 
                    alt={ach.name}>
                {:else}
                    <div class="ach"></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
{#if hoverIndex != -1 && achievements[hoverIndex].name !== ''}
    {#if currAchievement.hidden && !currAchievement.unlockCondition()}
        <p class={'red'}>
            [{hoverIndex+1}] - ???<br>
            Keep playing to unlock this achievement
        </p>
    {:else}
        <p class={achievements[hoverIndex].unlockCondition() ? 'green' : 'red'}>
            [{hoverIndex+1}] - {currAchievement.name}<br>
            {currAchievement.description}
        </p>
    {/if}
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;
    p {
        text-align: center;
    }
    .ach {
        background-color: $gray;
        height: 2.25em;
        width: 2.25em;
        border: $borderWidth solid $white;
        border-radius: $borderRadius;
        padding: 0.2em;
    }

    .ach-red {
        background-color: $red;
    }
    .ach-green {
        background-color: $green;
    }
    .red {
        color: $red;
    }
    .green {
        color: $green;
    }
</style>