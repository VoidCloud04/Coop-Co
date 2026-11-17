<script>
    import Modal from '$lib/components/Modal.svelte'
    import Notifications from '$lib/components/Notifications.svelte'
    import { gameState } from '$lib/scripts/DataManager.svelte';
    import { regularEggImgIds } from '$lib/scripts/EggManager';
    import { planets } from '$lib/scripts/EggspeditionsManager';
	import '$lib/styles/global.scss';
	let { children } = $props();
</script>

<svelte:head>
    {#if gameState.data.indexValues.currentPlanet === -1}
	    <link rel="icon" href="/Images/Eggs/{regularEggImgIds[gameState.data.indexValues.currentEgg]}.png" />
    {:else}
        <link rel="icon" href="/{planets[gameState.data.indexValues.currentPlanet].eggImgSrc}" />
    {/if}
	<title>Coop Co</title>
</svelte:head>

{@render children()}

<Notifications />
<Modal />
