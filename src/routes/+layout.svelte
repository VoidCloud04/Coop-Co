<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/Images/favicon.ico" />
</svelte:head>

{@render children()}
