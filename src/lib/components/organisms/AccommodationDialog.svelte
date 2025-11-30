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
	}
</script>

<script lang="ts">
	import type { OverlayRef } from '$lib/overlays.svelte';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import Dialog from '../atoms/Dialog.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { Media } from '$lib/services/Media.js';

	let { accommodation, overlayRef }: { accommodation: Accommodation; overlayRef: OverlayRef<any> } =
		$props();

	const { current: isMobile } = new MediaQuery('(width < 800px)');
</script>

<Dialog bottomSheet={isMobile}>
	{#snippet header()}
		<h3>{accommodation.headline}</h3>
	{/snippet}
	{#snippet main()}
		<div class="accommodation-detail">
			<div class="gallery">
				<div class="photos">
					{#each accommodation.detail.photos as photo, index (index)}
						<figure>
							<enhanced:img src={Media.getFile(photo.photo)} alt={photo.caption ?? ''} />
							{#if photo.caption}
								<figcaption>{photo.caption}</figcaption>
							{/if}
						</figure>
					{/each}
				</div>
				<!-- TODO: add items indicator -->
				<button>
					<!-- TODO: goto prev photo -->
					<ChevronLeft size={48} />
				</button>
				<button>
					<!-- TODO: goto next photo -->
					<ChevronRight size={48} />
				</button>
			</div>
			{accommodation.detail.description}
		</div>
	{/snippet}
	{#snippet footer()}
		<button class="button" onclick={() => overlayRef.close()}>Close</button>
		<a href="/stay?accommodation={accommodation.name}" class="button button-primary">Book</a>
	{/snippet}
</Dialog>

<style>
	h3 {
		margin: 0 0 3rem;
	}
	figure {
		position: relative;
		margin: 0;
	}

	figcaption {
		position: absolute;
		inset: auto 0 0 0;
		padding: 2rem;
		background: rgba(var(--brand-darkbrown-rgb) / 80%);
		color: var(--brand-stonewhite-color);
		font-size: 3.5rem;
	}

	.accommodation-detail {
		display: grid;
		gap: 4rem;
		width: 75vw;
	}

	.gallery {
		position: relative;
	}

	.gallery button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		appearance: none;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		color: #fff;
		cursor: pointer;
	}

	.gallery:not(:hover) button,
	.gallery:not(:hover) figcaption {
		display: none;
	}

	.gallery button:first-of-type {
		left: 2rem;
	}

	.gallery button:last-of-type {
		right: 2rem;
	}

	.photos {
		display: flex;
		overflow-y: hidden;
		overflow-x: auto;
		align-items: center;
		background: var(--brand-darkbrown-color);
		scroll-snap-type: x mandatory;
	}

	.photos::-webkit-scrollbar {
		display: none;
	}

	.photos figure {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		min-width: 100%;
		scroll-snap-align: center;
		scroll-snap-stop: always;
	}

	.photos enhanced\:img {
		max-width: 100%;
		object-fit: contain;
	}

	@media screen and (width < 800px) {
		.accommodation-detail {
			grid-template-rows: auto auto;
		}

		.gallery {
			margin: 0 -4rem;
			width: 100vw;
		}

		.photos {
			padding: 0.5rem;
			gap: 0.75rem;
		}

		.photos enhanced\:img {
			max-height: 300px;
		}
	}

	@media screen and (width >= 800px) {
		.accommodation-detail {
			grid-template-columns: 1fr 1fr;
		}

		.photos enhanced\:img {
			max-height: 400px;
		}
	}
</style>
