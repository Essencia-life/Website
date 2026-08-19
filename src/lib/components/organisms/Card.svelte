<script lang="ts">
	import { Media } from '$lib/services/Media';
	import type { Snippet } from 'svelte';

	interface Props {
		image?: string;
		children: Snippet;
	}

	const { image, children }: Props = $props();
</script>

<article class="flex flex-col overflow-hidden rounded-lg border border-(--brand-border-color)">
	{#if image}
		<enhanced:img src={Media.getFile(image)} />
	{/if}
	<div class="flex-1 p-4">
		{@render children()}
	</div>
</article>

<style>
	enhanced\:img {
		max-width: 100%;
		height: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}
</style>
