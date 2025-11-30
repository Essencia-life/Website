<script lang="ts">
	import '../app.css';
	import Overlays from '$lib/components/atoms/Overlays.svelte';
	import { asset } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={asset('/media/logo_tree.png')} />
	<meta name="theme-color" content="#e9e4d3" />
	<!-- TODO: SEO -->
	<!-- TODO: JSON-LD -->
</svelte:head>

<Overlays>
	{@render children?.()}
</Overlays>
