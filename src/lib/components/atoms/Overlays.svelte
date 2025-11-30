<script lang="ts">
	import { page } from '$app/state';
	import { Overlays } from '$lib/overlays.svelte';
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	const overlays = new Overlays();

	setContext('overlays', overlays);

	$effect(() => {
		document.documentElement.classList.toggle('has-overlay', !!page.state.overlays?.length);
	});
</script>

{@render children?.()}

<div class="overlays">
	{#each page.state.overlays as overlayId}
		{@const overlay = overlays.byId[overlayId]}

		{#if overlay}
			{#if overlay.config.backdrop}
				<div
					class="backdrop"
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

<style>
	.overlays :global(> *) {
		z-index: 100;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(var(--brand-terracotta-rgb) / 70%);
		backdrop-filter: blur(1rem);
	}
</style>
