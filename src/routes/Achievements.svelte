<script>
    import { achievements } from "$lib/scripts/AchievementsManager";
    import { data } from "$lib/scripts/DataManager.svelte";
    import { onMount } from "svelte";

    const columns = new Array(achievements.length / 8)
    let hoverIndex = $state(-1)
    let currAchievement = $derived(achievements[hoverIndex])
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
                    class={`ach ${achievements[j + 8*i].unlockCondition() ? 'ach-green' : 'ach-red'}`} src={`Images/${ach.img}`} 
                    alt={ach.name}>
                {:else}
                    <div class="ach"></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
{#if hoverIndex != -1 && achievements[hoverIndex].name !== ''}
    <p class={achievements[hoverIndex].unlockCondition() ? 'green' : 'red'}>
        [{hoverIndex+1}] - {currAchievement.name}<br>
        {currAchievement.description}
    </p>
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