<script lang="ts">
	import { type Event, Events } from '$lib/services/Events';
	import { Media } from '$lib/services/Media';
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import {
		eventCoverTransitionName,
		storeLinkUrlInPageState
	} from '$lib/utils/eventCoverTransition.svelte';

	interface Props {
		type: 'event' | 'retreat';
		filter: 'upcoming' | 'past';
	}

	const { type = 'event', filter = 'upcoming' }: Props = $props();

	const getEventBy = {
		upcoming: {
			event: Events.getUpcomingEvents,
			retreat: Events.getUpcomingRetreats
		},
		past: {
			event: Events.getPastEvents,
			retreat: Events.getPastRetreats
		}
	};

	const today = new Date();
	const eventSource = $derived(getEventBy[filter][type]());
	const eventsByYear = $derived(
		eventSource.reduce((byYear, event) => {
			const year = event.start.getFullYear();
			if (byYear.has(year)) {
				byYear.get(year)!.push(event);
			} else {
				byYear.set(year, [event]);
			}

			return byYear;
		}, new Map<number, Event[]>())
	);
</script>

<section>
	{#each eventsByYear as [year, events] (year)}
		{#if year !== today.getFullYear() && year !== 2100}
			<h3 class="year">{year}</h3>
		{/if}
		{#each events as event (event.slug)}
			{@const month = event.start.toLocaleDateString('en', { month: 'short' })}
			{@const day = event.start.toLocaleDateString('en', { day: '2-digit' })}
			{@const isMoreThanOneDay = event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000}
			{@const startDate = event.start.toLocaleDateString('de', { dateStyle: 'short' })}
			{@const endDate = event.end.toLocaleDateString('de', { dateStyle: 'short' })}
			{@const startTime = event.start.toLocaleTimeString('en', {
				timeZone: 'Europe/Lisbon',
				hour: 'numeric',
				minute: '2-digit'
			})}
			{@const endTime = event.end.toLocaleTimeString('en', {
				timeZone: 'Europe/Lisbon',
				hour: 'numeric',
				minute: '2-digit'
			})}
			{@const linkUrl = resolve(`/(pages)/${type}s/[slug]`, { slug: event.slug })}

			<article>
				<div class="date">
					{#if event.weekly}
						<b class="weekly">{event.weekly}</b>
					{:else}
						<div class="month">{month}</div>
						<div class="day">{day}</div>
					{/if}
				</div>
				<a class="cover" href={linkUrl} onclick={storeLinkUrlInPageState}>
					<enhanced:img
						src={Media.getFile(event.cover_image)}
						loading="lazy"
						alt=""
						style:view-transition-name={eventCoverTransitionName(linkUrl)}
					/>
				</a>
				<div class="info">
					<div class="description">
						<h4>{event.title}</h4>
						<time>
							{#if isMoreThanOneDay}
								{startDate} &mdash; {endDate}
							{:else}
								{startTime} &mdash; {endTime}
							{/if}
						</time>
						<p>{event.short_description}</p>
					</div>
					<a class="details" href={linkUrl} onclick={storeLinkUrlInPageState}>
						View {type} details
						<ArrowRight />
					</a>
				</div>
			</article>
		{/each}
	{:else}
		<i>No {type === 'retreat' ? 'Retreats' : 'Events'}</i>
	{/each}
</section>

<style>
	section {
		margin-bottom: 20rem;
	}

	.year {
		text-align: center;
		font-size: 8rem;
		margin-block: 2rem 12rem;
		color: rgba(var(--brand-accent-rgb) / 70%);
	}

	article {
		display: grid;
		gap: 10rem;
	}

	article:not(:last-of-type) {
		padding-bottom: 10rem;
		margin-bottom: 10rem;
		border-bottom: 2rem solid rgba(var(--brand-parchment-rgb) / 50%);
	}

	.date {
		display: flex;
		flex-direction: column;
		line-height: 1;
		padding-top: 0.5rem;
		font-family: Alegreya, serif;
	}

	.date .month {
		text-transform: uppercase;
		font-weight: 600;
		font-size: 6rem;
		letter-spacing: 1rem;
		opacity: 0.8;
	}

	.date .month::after {
		content: '';
		display: block;
		height: 1rem;
		width: 8rem;
		margin-top: 4rem;
		background: var(--brand-ambergold-color);
	}

	.date .day {
		font-weight: 700;
		font-size: 16rem;
		opacity: 0.8;
	}

	.date .weekly {
		text-transform: uppercase;
		font-size: 6rem;
		font-weight: 500;
		line-height: 1.5;
	}

	enhanced\:img {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		box-shadow: 0 0 3rem rgba(var(--brand-earthbrown-rgb) / 40%);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		padding: 0.5rem 0;
	}

	.info a.details {
		display: flex;
		align-items: center;
		align-self: flex-end;
		gap: 2rem;
		text-decoration: none;
	}

	.description {
		flex: 1;
		border-bottom: 1px solid var(--brand-parchment-color);
	}

	.description h4 {
		margin-top: 0;
	}

	.description time {
		display: block;
		font-weight: 500;
		opacity: 0.9;
		margin-bottom: 2rem;
	}

	@media screen and (width < 800px) {
		article {
			grid-template-columns: 100px auto;
			grid-template-rows: auto auto;
		}

		.info {
			grid-column: 1 / -1;
		}
	}

	@media screen and (width >= 800px) {
		article {
			grid-template-columns: 100px 200px auto;
		}
	}
</style>
