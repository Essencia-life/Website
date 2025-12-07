<script>
	import '../app.css';
	import Overlays from '$lib/components/atoms/Overlays.svelte';
	import { asset } from '$app/paths';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/media/logo_tree.png')} />
	<meta name="theme-color" content="#e9e4d3" />

	{#if data.VERCEL_ENV !== 'production'}
		<meta name="robots" content="noindex,follow" />
	{/if}
</svelte:head>

<Overlays>
	{@render children?.()}
</Overlays>
