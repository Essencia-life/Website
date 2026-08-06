<script lang="ts">
	import type { Event } from '$lib/services/Events';
	import { Media } from '$lib/services/Media';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Ticket from '@lucide/svelte/icons/ticket';
	import Car from '@lucide/svelte/icons/car';
	import CalendarCheck from '@lucide/svelte/icons/calendar-check';
	import SquareArrowOutUpRight from '@lucide/svelte/icons/square-arrow-out-up-right';

	interface Props {
		event: Event;
	}

	const { event }: Props = $props();

	const isMoreThanOneDay = $derived(
		event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000
	);
	const isPast = $derived(event.start.getTime() < Date.now());

	const startDate = $derived(event.start.toLocaleDateString('en', { dateStyle: 'long' }));
	const endDate = $derived(event.end.toLocaleDateString('en', { dateStyle: 'long' }));
	const startTime = $derived(
		event.start.toLocaleTimeString('en', {
			timeZone: 'Europe/Lisbon',
			hour: 'numeric',
			minute: '2-digit'
		})
	);
	const endTime = $derived(
		event.end.toLocaleTimeString('en', {
			timeZone: 'Europe/Lisbon',
			hour: 'numeric',
			minute: '2-digit'
		})
	);
</script>

<div
	class="lg:grid-areas overflow-hidden wrap-break-word lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-[30%_auto] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:py-16"
>
	<div style="grid-area: cover" class="[&_picture]:contents">
		<enhanced:img
			src={Media.getFile(event.cover_image)}
			alt=""
			class="h-auto shadow-lg/50 max-md:max-w-screen lg:max-w-full lg:rounded-md"
			style="view-transition-name: event-cover"
		/>
	</div>

	<div
		class="max-md:w-[calc(100vw_-_(100vw_-_100%))] max-md:max-w-[1200px] max-md:px-4 max-md:pb-10 lg:contents"
	>
		<div style="grid-area: content" class="flex flex-col">
			<h2 class="mt-4! mb-8! leading-none lg:mt-0">{event.title}</h2>
			<h3
				class="-order-1 m-0! text-xs! font-bold tracking-widest uppercase opacity-70 max-md:mt-4!"
			>
				{isPast ? 'Past' : 'Upcoming'}
				{event.type === 'retreat' ? 'Retreat' : 'Event'}
			</h3>

			<p class="mb-8!">{event.short_description}</p>

			<div class="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 font-medium">
				<Calendar size={20} />
				{#if isMoreThanOneDay}
					<time>{startDate} &mdash; {endDate}</time>
				{:else}
					<time>{event.weekly ?? startDate}</time>
					<Clock size={20} />
					<time>{startTime} &ndash; {endTime}</time>
				{/if}
				<MapPin size={20} />
				<address class="not-italic">Essência Shala, Aljezur, Portugal</address>
			</div>
		</div>

		{#if ((event.booking_link || event.car_sharing_link) && !isPast) || event.info_link}
			<div style="grid-area: buttons" class="mt-8 flex flex-col gap-4">
				{#if event.type === 'retreat'}
					{#if event.booking_link && !isPast}
						<a
							href={event.booking_link}
							class="button button-primary w-full gap-4! px-4!"
							target="_blank"
							rel="noopener noreferrer"
							referrerpolicy="no-referrer"
						>
							<CalendarCheck size={20} />
							Book your spot
						</a>
					{/if}
				{:else}
					{#if event.booking_link && !isPast}
						<a
							href={event.booking_link}
							class="button button-primary w-full gap-4! px-4!"
							target="_blank"
							rel="noopener noreferrer"
							referrerpolicy="no-referrer"
						>
							<Ticket size={20} />
							Get your ticket
						</a>
					{/if}
					{#if event.car_sharing_link && !isPast}
						<a
							href={event.car_sharing_link}
							class="button w-full gap-4! px-4!"
							target="_blank"
							rel="noopener noreferrer"
							referrerpolicy="no-referrer"
						>
							<Car size={20} />
							Car-Sharing Telegram Group
						</a>
					{/if}
				{/if}

				{#if event.info_link}
					<a
						href={event.info_link}
						class="button w-full gap-4! px-4!"
						target="_blank"
						rel="noopener noreferrer"
						referrerpolicy="no-referrer"
					>
						<SquareArrowOutUpRight size={20} />
						More information
					</a>
				{/if}
			</div>
		{/if}

		<div style="grid-area: description">
			<hr class="my-8" />

			<Markdown content={event.description} />
		</div>

		{#if event.organizers?.length}
			<div style="grid-area: organizers">
				<hr class="my-8" />

				<h3 class="mt-0! text-xs! font-bold tracking-widest uppercase opacity-70">Hosted by:</h3>

				{#each event.organizers as organizer}
					<div class="mt-4 grid gap-x-4 gap-y-1" class:grid-cols-[auto_1fr]={organizer.photo}>
						<div class="row-span-2 aspect-square w-14 overflow-hidden rounded-full">
							<enhanced:img
								src={Media.getFile(organizer.photo)}
								alt="Photo of {organizer.name}"
								class="max-h-full object-cover"
							/>
						</div>
						<div class="font-medium">{organizer.name}</div>
						<div>{organizer.description}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@media (width >= 64rem) {
		.lg\:grid-areas {
			grid-template-areas:
				'cover content'
				'cover description'
				'buttons description'
				'organizers description';
		}
	}
</style>
