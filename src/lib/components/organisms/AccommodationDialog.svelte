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
	const maxLg = new MediaQuery('(width < 64rem)');
</script>

<Dialog bottomSheet={maxLg.current}>
	{#snippet header()}
		<h3 class="m-0! mb-3!">{accommodation.headline}</h3>
	{/snippet}
	{#snippet main()}
		<div class="grid gap-4 max-md:mb-12 lg:w-[70vw] lg:grid-cols-2">
			<div class="max-md:-mx-4">
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
