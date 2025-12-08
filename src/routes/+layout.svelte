<script>
	import '../app.css';
	import logo from '$lib/assets/logo_tree.png';
	import Overlays from '$lib/components/atoms/Overlays.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<meta name="theme-color" content="#e9e4d3" />

	{#if data.VERCEL_ENV !== 'production'}
		<meta name="robots" content="noindex,follow" />
	{/if}
</svelte:head>

<Overlays>
	{@render children?.()}
</Overlays>
