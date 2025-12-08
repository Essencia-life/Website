<script lang="ts">
	import { quartInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import Navigation from '../molecules/Navigation.svelte';
	import { X } from '@lucide/svelte';
	import type { OverlayRef } from '$lib/overlays.svelte';

	interface Props {
		overlayRef: OverlayRef<any>;
	}

	const { overlayRef }: Props = $props();
</script>

<!-- TODO: close by swipe right -->
<aside transition:fly|global={{ x: '100%', easing: quartInOut }}>
	<button class="icon-button" onclick={() => overlayRef.close()}>
		<X />
	</button>
	<enhanced:img src="$lib/assets/logo.avif" alt="" />
	<Navigation sidebar />
</aside>

<style>
	aside {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		padding: 8rem 4rem;
		gap: 8rem;
		width: 80vw;
		max-width: 400px;
		min-width: 320px;
		background: var(--brand-sandbeige-color);
		box-shadow: -3px 0 9px rgba(var(--brand-darkbrown-rgb) / 60%);
		overflow-y: auto;
	}

	aside > button {
		position: fixed;
		top: 3rem;
		right: 3rem;
		background: var(--brand-sandbeige-color);
	}

	aside :global(> picture) {
		align-self: center;
	}

	aside :global(> img) {
		max-width: 48rem;
		aspect-ratio: 1;
	}
</style>
