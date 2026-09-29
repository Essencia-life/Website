<script lang="ts">
	import { Media } from '$lib/services/Media';
	import type { Snippet } from 'svelte';
	import Image from '$lib/components/atoms/Image.svelte';

	interface Props {
		image?: string;
		children: Snippet;
		overlays?: Snippet;
	}

	const { image, children, overlays }: Props = $props();
</script>

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
