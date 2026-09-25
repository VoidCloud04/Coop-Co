<script>
    let {buttonArr, baseId} = $props()
</script>

<div>
    {#each buttonArr as button, i}
        <button id="{baseId}-{i}" class={button.class} title={button.title}>{button.title}</button>
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        
        button {
            margin-left: 0.25vw;
            margin-right: 0.25vw;
        }
    }
</style>