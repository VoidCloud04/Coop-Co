<script>
    import { data } from "$lib/scripts/DataManager.svelte";
    import { commonResearch } from "$lib/scripts/ResearchManager";
</script>

<h3>Research Center</h3>
<div id="leftColumn">
    {#each {length: commonResearch.length/2}, i}
    <p>Tier I</p>
    {/each}
</div>
<div id="rightColumn">

</div>

{#each commonResearch as item}
    <button>
        {item.title}
    </button>
{/each}

<style lang="scss">

</style>