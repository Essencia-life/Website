<script lang="ts">
	import { Media } from "$lib/services/Media";
	import type { Snippet } from "svelte";

    interface Props {
        image?: string;
        children: Snippet;
    }

    const {image, children}: Props = $props();
</script>

<article class="flex flex-col border border-(--brand-border-color) rounded-lg overflow-hidden">
    {#if image}
        <enhanced:img src={Media.getFile(image)} />
    {/if}
    <div class="p-4 flex-1">
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