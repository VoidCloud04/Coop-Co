<script>
    let {buttonArr, baseId, onclick = null} = $props()

    function isVisible(button) {
        if (typeof button.condition === 'function') return button.condition()
        return button.condition ?? true
    }

    function getTitle(button) {
        if (typeof button.title === 'function') return button.title()
        return button.title
    }
</script>

<div>
    {#each buttonArr as button, i}
        {#if onclick === null}
            <button id="{baseId}-{i}" class={button.class} title={getTitle(button)} hidden={!isVisible(button)}>{getTitle(button)}</button>
        {:else}
            <button id="{baseId}-{i}" class={button.class} title={getTitle(button)} hidden={!isVisible(button)} onclick={() => onclick(i)}>{getTitle(button)}</button>
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