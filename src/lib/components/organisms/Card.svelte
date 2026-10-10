<script lang="ts">
	import { Media } from '$lib/services/Media';
	import type { Snippet } from 'svelte';
	import Image from '$lib/components/atoms/Image.svelte';

	interface Props {
		image?: string;
		link?: string;
		children: Snippet;
		overlays?: Snippet;
	}

	const { image, link, children, overlays }: Props = $props();
</script>

{#snippet card()}
<article
	class="flex flex-col overflow-hidden rounded-lg border border-stone-100 bg-stone-50"
>
	{#if image}
		<div class="relative">
			<Image src={Media.getFile(image!)} loading="lazy" class="max-w-full h-full aspect-3/2 object-cover" />
			{@render overlays?.()}
		</div>
	{/if}
	<div class="flex-1 p-4">
		{@render children()}
	</div>
</article>
{/snippet}

{#if link}
	<a href={link} class="no-link hover:scale-105 hover:-translate-y-2 hover:shadow-lg/30 rounded-lg transition">
		{@render card()}
	</a>
{:else}
	{@render card()}
{/if}