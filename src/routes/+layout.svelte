<script>
    import { data } from '$lib/scripts/DataManager.svelte';
    import { regularEggImgIds } from '$lib/scripts/EggManager';
	import '$lib/styles/global.scss';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/Images/Eggs/{regularEggImgIds[data.indexValues.currentEgg]}.png" />
</svelte:head>

{@render children()}
