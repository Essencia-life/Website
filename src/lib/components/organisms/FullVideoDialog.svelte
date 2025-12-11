<script lang="ts">
	import type FullVideoDialog from './FullVideoDialog.svelte';
	import type { OverlayRef } from '$lib/overlays.svelte';

	type Self = typeof FullVideoDialog;

	const { overlayRef }: { overlayRef: OverlayRef<Self> } = $props();
</script>

<iframe
	src="https://www.youtube-nocookie.com/embed/Ow-X1jZLZ64?si=3li6pUdTWw57wFWr"
	title="Full video about Essência on Youtube"
	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
	referrerpolicy="strict-origin-when-cross-origin"
	allowfullscreen
></iframe>

<button class="button button-overlay" onclick={() => overlayRef.close()}>Close Video</button>

<style>
	iframe {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 80vw;
		aspect-ratio: 16 / 9;
		border: 0;
	}

	button {
		position: absolute;
		left: 50%;
		bottom: 10%;
		transform: translateX(-50%);
		opacity: 0.75;
	}
</style>
