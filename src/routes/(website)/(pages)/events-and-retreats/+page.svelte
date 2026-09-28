<script lang="ts">
	import type { Event } from '$lib/server/Events';
	import { Media } from '$lib/services/Media';
	import { page } from '$app/state';
	import { eventCoverTransitionName, storeLinkUrlInPageState } from '$lib/utils/eventCoverTransition.svelte';
	import EventRibbon from '$lib/components/atoms/EventRibbon.svelte';
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	let filter = $derived(page.url.searchParams.get('filter'));

	const { data }: PageProps = $props();

	const today = new Date();
	const eventsByYear = $derived(
		data.upcomingEvents.reduce((byYear, event) => {
			const year = event.start.getFullYear();
			if (byYear.has(year)) {
				byYear.get(year)!.push(event);
			} else {
				byYear.set(year, [event]);
			}

			return byYear;
		}, new Map<number, Event[]>())
	);

	const options = [
		{ value: null, label: 'All' },
		{ value: 'events', label: 'Events' },
		{ value: 'retreats', label: 'Retreats' },
	] as const;

	$effect(() => {
		if (filter === '') {
			page.url.searchParams.delete('filter');

			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(page.url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
		}
	});
</script>

<section class="page-content py-16">
	<div class="flex justify-between items-end flex-wrap">
		<h2>
			<sup class="top-0 mb-2 block">Gatherings on the Land</sup>
			Events & Retreats
		</h2>

		<form data-sveltekit-replacestate data-sveltekit-noscroll method="get" class="rounded-full bg-gray-200 p-1 flex gap-1 text-sm mt-8">
			{#each options as option (option)}
				<button value={option.value} name="filter"
								class="px-3 py-1 rounded-full text-gray-800 cursor-pointer"
								class:bg-olive-700={filter === option.value}
								class:text-white={filter === option.value}>
					{option.label}
				</button>
			{/each}
		</form>
	</div>

	<hr>

	<div class="space-y-12">
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
				{@const linkUrl = resolve(`/${event.type}s/[slug]`, { slug: event.slug })}
				<article class="grid gap-8 md:grid-cols-[220px_2fr] md:gap-12 items-center">
					<a href={linkUrl} onclick={storeLinkUrlInPageState} class="relative no-link">
						<EventRibbon {event}>
							<enhanced:img
								src={Media.getFile(event.cover_image)}
								loading="lazy"
								alt=""
								class="rounded-2xl aspect-4/5 shadow-xl/30"
								style:view-transition-name={eventCoverTransitionName(linkUrl)}
							/>
						</EventRibbon>
						<div class="absolute bottom-0 -translate-x-2 translate-y-2 rounded-lg text-center text-white w-11 pb-1.5 font-serif  shadow-lg/30"
								 class:bg-olive-700={event.type === 'event'}
								 class:bg-cyan-600={event.type === 'retreat'}>
							<div class="text-2xl font-bold">{day}</div>
							<div class="text-sm uppercase font-medium opacity-80">{month}</div>
						</div>
					</a>
					<div class="space-y-4">
						<div class="max-sm:flex flex-row-reverse justify-between space-x-2">
							<span class="text-white py-1 px-2 text-xs rounded uppercase font-medium"
										class:bg-olive-700={event.type === 'event'}
										class:bg-cyan-600={event.type === 'retreat'}>{event.type}</span>
							<time>
								{#if isMoreThanOneDay}
									{startDate} &mdash; {endDate}
								{:else}
									{startTime} &mdash; {endTime}
								{/if}
							</time>
						</div>
						<h3>{event.title}</h3>
						<p>{event.short_description}</p>
						<a href={linkUrl} onclick={storeLinkUrlInPageState} class="flex gap-2">
							View {event.type} details
							<ArrowRight />
						</a>
					</div>
				</article>
			{/each}
		{:else}
			<i>No upcoming Events or Retreats</i>
		{/each}
	</div>
</section>

<section class="page-content py-8">
	<div class="relative flex py-8">
		<enhanced:img
			src={Media.getFile('media/essência nature retreat 39.JPG')}
			loading="lazy"
			alt=""
			class="rounded-xl absolute inset-0 object-cover w-full h-full shadow-xl/30"
		/>
		<div class="absolute inset-0 md:bg-linear-120 bg-linear-to-b from-black/75 from-30% max-sm:from-60% to-black/0 rounded-xl"></div>
		<div class="z-10 max-w-120 text-white md:p-8 p-4 space-y-8">
			<sup class="top-0 mb-2 block text-amber-300">An Open Invitation</sup>
			<h3 class="text-white text-4xl font-bold">Host Your Event or Retreat</h3>
			<p>We open our space — the Shala, the farmhouse and the land — to events and retreats that resonate with what we do. Easy, low-risk terms; ask us for details.</p>
			<div class="flex gap-4 flex-wrap">
				<a href="/contact" class="button button-ambergold">Contact us to host</a>
				<button class="button button-outline">Learn more</button>
			</div>
		</div>
	</div>
</section>

<section class="page-content py-16">
	<h3>Past</h3>
	<div class="grid md:grid-cols-2 gap-8 py-8">
		{#each data.pastEvents as event (event.slug)}
			{@const linkUrl = resolve(`/${event.type}s/[slug]`, { slug: event.slug })}
			<a href={linkUrl} onclick={storeLinkUrlInPageState} class="grid grid-cols-[96px_1fr] gap-4 no-link">
				<enhanced:img
					src={Media.getFile(event.cover_image)}
					loading="lazy"
					alt=""
					class="rounded-xl aspect-4/5 shadow-lg/30 object-cover"
					style:view-transition-name={eventCoverTransitionName(linkUrl)}
				/>

				<div class="space-y-2">
					<div>
						<span class="text-white py-1 px-2 text-xs rounded uppercase font-medium"
									class:bg-olive-700={event.type === 'event'}
									class:bg-cyan-600={event.type === 'retreat'}>{event.type}</span>
					</div>
					<h4>{event.title}</h4>
					<time class="opacity-75 text-sm">
						{event.start.toLocaleDateString('en', { dateStyle: 'long' })}
					</time>
				</div>
			</a>
		{/each}
	</div>
</section>