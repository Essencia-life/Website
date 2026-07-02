<script module lang="ts">
	export interface Accommodation {
		name: string;
		headline: string;
		short_description: string;
		photo: string;
		detail: {
			description: string;
			photos: {
				photo: string;
				caption?: string;
			}[];
		};
		button: string;
	}
</script>

<script lang="ts">
	import type { OverlayRef } from '$lib/overlays.svelte';
	import Dialog from '../atoms/Dialog.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Slideshow from '$lib/components/molecules/Slideshow.svelte';

	interface Props {
		accommodation: Accommodation;
		overlayRef: OverlayRef<any>;
	}

	const { accommodation, overlayRef }: Props = $props();
	const { current: isMobile } = new MediaQuery('(width < 800px)');
</script>

<Dialog bottomSheet={isMobile}>
	{#snippet header()}
		<h3>{accommodation.headline}</h3>
	{/snippet}
	{#snippet main()}
		<div class="accommodation-detail">
			<div>
				<Slideshow photos={accommodation.detail.photos} classes={{ image: 'aspect-3/2' }} />
			</div>

			<div>
				<Markdown content={accommodation.detail.description} />
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<button class="button" onclick={() => overlayRef.close()}>Close</button>
		<a href="mailto:ola@essencia.life?subject={accommodation.button}" class="button button-primary">
			Book
		</a>
		<a
			href="https://wa.me/351911514554?text={accommodation.button}"
			target="_blank"
			class="button button-primary"
		>
			WhatsApp
		</a>
	{/snippet}
</Dialog>

<style>
	h3 {
		margin: 0 0 3rem;
	}

	.accommodation-detail {
		display: grid;
		gap: 4rem;
		width: 75vw;
	}

	@media screen and (width < 800px) {
		.accommodation-detail {
			grid-template-rows: auto auto;
		}
	}

	@media screen and (width >= 800px) {
		.accommodation-detail {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
