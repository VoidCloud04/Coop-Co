<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.scss';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/Images/favicon.ico" />
</svelte:head>

{@render children()}
