<script lang="ts">
	import { page } from '$app/state';
	import { Overlays } from '$lib/overlays.svelte';
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	const overlays = new Overlays();

	setContext('overlays', overlays);
</script>

{@render children?.()}

<div class="*:z-100 *:overscroll-contain">
	{#each page.state.overlays as overlayId (overlayId)}
		{@const overlay = overlays.byId[overlayId]}

		{#if overlay}
			{#if overlay.config.backdrop}
				<div
					class="fixed inset-0 bg-taupe-700/70 blur-xs overflow-hidden"
					onclick={() => overlay.close()}
					transition:fade|global
					style:background-color={overlay.config.backdrop === true
						? ''
						: overlay.config.backdrop.color}
				></div>
			{/if}

			<overlay.config.component overlayRef={overlay} {...overlay.config.props} />
		{/if}
	{/each}
</div>