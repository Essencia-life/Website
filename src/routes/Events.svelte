<script lang="ts">
	import ms from 'ms';
	import { Events } from '$lib/services/Events';
	import { Media } from '$lib/services/Media.js';
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import {
		eventCoverTransitionName,
		storeLinkUrlInPageState
	} from '$lib/utils/eventCoverTransition.svelte';
	import ScrollContainerArrows from '$lib/components/molecules/ScrollContainerArrows.svelte';

	interface Props {
		lastEventsScrollPosition: Attachment<HTMLElement>;
	}

	let { lastEventsScrollPosition }: Props = $props();

	const events = Events.getAllUpcoming();
</script>

<ScrollContainerArrows>
	{#snippet children(scrollContainerArrows)}
		<div class="events" {@attach lastEventsScrollPosition} {@attach scrollContainerArrows}>
			{#each events as event (event.slug)}
				{@const isMoreThanOneDay = event.end.getTime() - event.start.getTime() > ms('1d')}
				{@const linkUrl = resolve(`/(pages)/${event.type}s/[slug]`, { slug: event.slug })}
				<a href={linkUrl} class="event no-link" onclick={storeLinkUrlInPageState}>
					<enhanced:img
						src={Media.getFile(event.cover_image)}
						alt=""
						loading="lazy"
						style:view-transition-name={eventCoverTransitionName(linkUrl)}
					/>
					<div style="display: flex; flex-direction: column; gap: 2rem; flex: 1;">
						<div style="display: flex; justify-content: space-between">
							<small class="type-{event.type}">{event.type}</small>
							{#if event.weekly}
								<time style="font-weight: 500">{event.weekly}</time>
							{:else}
								<time datetime={event.start.toISOString()} style="font-weight: 500">
									{#if isMoreThanOneDay}
										{@const startDate = event.start.toLocaleDateString('en', {
											day: 'numeric',
											month: 'short'
										})}
										{@const endDate = event.end.toLocaleDateString('en', {
											day: 'numeric',
											month: 'short'
										})}
										{startDate} &mdash; {endDate}
									{:else}
										{event.start.toLocaleDateString('en', {
											day: 'numeric',
											month: 'short'
										})}
									{/if}
								</time>
							{/if}
						</div>
						<h3>{event.title}</h3>
					</div>
				</a>
			{/each}
		</div>
	{/snippet}
</ScrollContainerArrows>

<style>
	h3 {
		margin: 0;
	}

	.events {
		display: grid;
		grid-auto-flow: column;
		overflow-x: auto;
		overflow-y: hidden;
		max-width: 100vw;
	}

	.events::-webkit-scrollbar {
		display: none;
	}

	.event {
		display: flex;
		gap: 4rem;
		text-decoration: none;
		color: inherit;
		background: rgba(var(--brand-parchment-rgb) / 40%);
		padding: 4rem;
		border-radius: 2rem;
		box-shadow: 0 1px 4px rgba(var(--brand-earthbrown-rgb) / 30%);
		scroll-snap-align: center;
		flex-direction: column;
		scroll-snap-stop: always;
		transition: transform 150ms ease-in-out;
		min-width: 250px;
	}

	@media screen and (width < 600px) {
		.events {
			grid-auto-columns: 70vw;
			grid-gap: 8rem;
			padding: 8rem 15vw;
			margin: -4rem;
			width: 100vw;
			scroll-snap-type: x mandatory;
		}

		.event enhanced\:img {
			height: auto;
			width: 100%;
		}
	}

	@media screen and (width >= 600px) {
		.events {
			grid-gap: 12rem;
			padding: 10rem 16rem;
		}

		.event enhanced\:img {
			height: 38vh;
			width: auto;
		}
	}

	.event small {
		text-transform: uppercase;
		background-color: var(--brand-primary-color);
		color: var(--brand-stonewhite-color);
		font-weight: 700;
		padding: 1rem 2rem;
		border-radius: 1rem;
		font-size: 2.5rem;
		letter-spacing: 1px;
		text-shadow: 1px 1px var(--brand-mossgreen-color);
		line-height: 1.5;
	}

	.event small.type-retreat {
		background-color: var(--brand-healing-color);
	}

	.event enhanced\:img {
		object-fit: cover;
		aspect-ratio: 4 / 5;
	}

	@media (hover: hover) {
		.event:hover {
			transform: scale(1.05);
		}
	}
</style>
