<script>
    import Modal from '$lib/components/Modal.svelte'
    import Notifications from '$lib/components/Notifications.svelte'
    import { gameState } from '$lib/scripts/DataManager.svelte';
    import { regularEggImgIds } from '$lib/scripts/EggManager';
	import '$lib/styles/global.scss';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/Images/Eggs/{regularEggImgIds[gameState.data.indexValues.currentEgg]}.png" />
	<title>Coop Co</title>
</svelte:head>

{@render children()}

<Notifications />
<Modal />
