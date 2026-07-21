<script lang="ts">
	import { Media } from '$lib/services/Media.js';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';

	export interface Photo {
		photo: string;
		caption?: string;
	}

	interface Props {
		photos: Photo[];
		classes?: {
			slideshow?: string;
			gallery?: string;
			figure?: string;
			image?: string;
			caption?: string;
			indicators?: string;
		};
	}

	const { photos, classes = {} }: Props = $props();

	let photosRef: HTMLDivElement | undefined = $state();
	let currentPhoto: HTMLElement | undefined = $state();
	let intersectionRatioMap = new SvelteMap<Element, number>();

	let observer: IntersectionObserver;

	const observe: Attachment = (element) => {
		intersectionRatioMap.set(element, 0);

		observer ||= new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					intersectionRatioMap.set(entry.target, entry.intersectionRatio);

					if (entry.isIntersecting) {
						currentPhoto = entry.target as HTMLElement;
					}
				});
			},
			{
				root: photosRef,
				threshold: Array.from({ length: 11 }, (_, i) => i / 10)
			}
		);

		observer.observe(element);

		return () => {
			observer.unobserve(element);
		};
	};

	function prev() {
		currentPhoto?.previousElementSibling?.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest'
		});
	}

	function next() {
		currentPhoto?.nextElementSibling?.scrollIntoView({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest'
		});
	}
</script>

<div class="slideshow relative {classes.slideshow}">
	<div
		class="gallery flex snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden {classes.gallery}"
		bind:this={photosRef}
	>
		{#each photos as photo, index (index)}
			<figure
				{@attach observe}
				class="relative m-0 min-w-full snap-center snap-always overflow-hidden {classes.figure}"
			>
				<enhanced:img
					src={Media.getFile(photo.photo)}
					alt={photo.caption ?? ''}
					class="h-full max-w-full object-cover {classes.image}"
				/>
				{#if photo.caption}
					<figcaption
						class="absolute inset-0 top-auto bg-linear-to-t from-black/95 to-black/0 p-4 pt-12 {classes.caption}"
					>
						{photo.caption}
					</figcaption>
				{/if}
			</figure>
		{/each}
	</div>
	{#if intersectionRatioMap.size > 1}
		<div class="indicators flex justify-center gap-2 p-2 {classes.indicators}">
			{#each intersectionRatioMap as [target, ratio], index (target)}
				<button
					aria-label="Photo {index + 1}"
					style:--ratio={ratio}
					onclick={() =>
						target.scrollIntoView({
							behavior: 'smooth',
							inline: 'center',
							block: 'nearest'
						})}
				></button>
			{/each}
		</div>
		<button
			class="navigate left-2"
			onclick={prev}
			disabled={photosRef && photosRef.firstElementChild === currentPhoto}
		>
			<ChevronLeft size={48} />
		</button>
		<button
			class="navigate right-2"
			onclick={next}
			disabled={photosRef && photosRef.lastElementChild === currentPhoto}
		>
			<ChevronRight size={48} />
		</button>
	{/if}
</div>

<style>
	.indicators {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
	}

	.indicators > button {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 100%;
		background: light-dark(var(--brand-parchment-color), rgba(0 0 0 / 50%));
	}

	.indicators > button::after {
		content: '';
		display: block;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 100%;
		background: light-dark(rgba(0 0 0 / 50%), var(--brand-parchment-color));
		opacity: var(--ratio);
	}

	figcaption {
		color: var(--brand-stonewhite-color);
	}

	.navigate {
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
		filter: drop-shadow(var(--brand-earthbrown-color) 0 0 0.25rem);
	}

	.navigate:disabled {
		opacity: 0.3;
	}

	.slideshow:not(:hover) .navigate {
		display: none;
	}

	.gallery::-webkit-scrollbar {
		display: none;
	}
</style>
