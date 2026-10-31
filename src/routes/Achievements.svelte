<script>
    import { achievements } from "$lib/scripts/AchievementsManager";

    const columnSize = 8

    function groupAchievements(list) {
        const groups = new Map()
        for (const achievement of list) {
            const group = achievement.group ?? 'other'
            if (!groups.has(group)) groups.set(group, [])
            groups.get(group).push(achievement)
        }
        return [...groups.values()]
    }

    function buildColumns(list) {
        const columns = []
        for (const group of groupAchievements(list)) {
            for (let i = 0; i < group.length; i += columnSize) {
                const column = group.slice(i, i + columnSize)
                while (column.length < columnSize) column.push(null)
                columns.push(column)
            }
        }
        return columns
    }

    const columns = buildColumns(achievements)
    let hoveredIndex = $state(-1)
    const hovered = $derived(hoveredIndex >= 0 ? achievements[hoveredIndex] : null)
</script>
<h3>Achievements</h3>
<div class="flexRow">
    {#each columns as column, columnIndex (columnIndex)}
        <div class="flexCol ach-column">
            {#each column as ach, slotIndex (slotIndex)}
                {#if ach}
                    <img
                        onmouseenter={() => { hoveredIndex = achievements.indexOf(ach) }}
                        class={`ach ${ach.unlockCondition() ? 'ach-green' : 'ach-red'}`}
                        src={`Images/${ach.hidden && !ach.unlockCondition() ? ach.hiddenImg : ach.img}`}
                        alt={ach.name}>
                {:else}
                    <div class="ach"></div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
{#if hovered}
    {#if hovered.hidden && !hovered.unlockCondition()}
        <p class="red">
            [{hoveredIndex + 1}] - ???<br>
            Keep playing to unlock this achievement
        </p>
    {:else}
        <p class={hovered.unlockCondition() ? 'green' : 'red'}>
            [{hoveredIndex + 1}] - {hovered.name}<br>
            {hovered.description}
        </p>
    {/if}
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;
    p {
        text-align: center;
    }
    .ach-column {
        margin-left: 0.25vw;
        margin-right: 0.25vw;
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
