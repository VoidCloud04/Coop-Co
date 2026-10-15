<script>
    let {buttonArr, baseId, onclick = null} = $props()
</script>

<div>
    {#each buttonArr as button, i}
        {#if onclick === null}
            <button id="{baseId}-{i}" class={button.class} title={button.title}>{button.title}</button>
        {:else}
            <button id="{baseId}-{i}" class={button.class} title={button.title} onclick={() => onclick(i)}>{button.title}</button>
        {/if}
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        
        button {
            margin-left: 0.5vw;
            margin-right: 0.5vw;
        }
    }
</style>