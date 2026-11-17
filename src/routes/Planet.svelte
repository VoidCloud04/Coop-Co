<script>
    import Arcturus from "$lib/components/Planet-UIs/Arcturus.svelte";
    import Hereth from "$lib/components/Planet-UIs/Hereth.svelte";
    import Malak from "$lib/components/Planet-UIs/Malak.svelte";
    import Ravnar from "$lib/components/Planet-UIs/Ravnar.svelte";
    import Triton from "$lib/components/Planet-UIs/Triton.svelte";
    import Xylok from "$lib/components/Planet-UIs/Xylok.svelte";
    import { gameState } from "$lib/scripts/DataManager.svelte";

    let planetIndex = $derived(gameState.data.indexValues.currentPlanet)
</script>

{#if planetIndex === 0}
    <Arcturus />
{:else if planetIndex === 1}
    <Ravnar />
{:else if planetIndex === 2}
    <Xylok />
{:else if planetIndex === 3}
    <Triton />
{:else if planetIndex === 4}
    <Hereth />
{:else if planetIndex === 5}
    <Malak />
{:else}
    <h1>No Planet Active or Invalid Data</h1>
{/if}

<style lang="scss">
    @use "$lib/styles/variables" as *;
</style>