<script module lang="ts">
	import type { Collection } from '@sveltia/cms';

	export const eventCollection = {
		name: 'events',
		label: 'Events & Retreats',
		label_singular: 'Event',
		format: 'json',
		icon: 'event',
		identifier_field: 'title',
		slug: "{{fields.start | date('YYYY-MM-DD')}}-{{fields.title}}",
		summary: "{{start | date('DD.MM.')}} — {{title}}",
		thumbnail: 'cover_image',
		media_folder: '{{media_folder}}/events',
		public_folder: '/media/events',
		sortable_fields: {
			fields: ['title', 'start'],
			default: {
				field: 'start',
				direction: 'descending'
			}
		},
		view_groups: {
			groups: [
				{
					name: 'type',
					label: 'Type',
					field: 'type'
				},
				{
					name: 'year',
					label: 'Year',
					field: 'start',
					pattern: '\\d{4}'
				}
			],
			default: 'year'
		},
		view_filters: [
			{
				label: 'Events',
				field: 'type',
				pattern: 'event'
			},
			{
				label: 'Retreats',
				field: 'type',
				pattern: 'retreat'
			}
		],
		create: true,
		folder: 'src/lib/content/events',
		fields: [
			{
				name: 'type',
				label: 'Type',
				widget: 'select',
				options: ['event', 'retreat']
			},
			{
				name: 'start',
				label: 'Start',
				widget: 'datetime',
				input_timezone: 'Europe/Lisbon'
			},
			{
				name: 'end',
				label: 'End',
				widget: 'datetime',
				input_timezone: 'Europe/Lisbon'
			},
			{
				name: 'recurrence',
				label: 'Recurrence',
				widget: 'object',
				required: false,
				fields: [
					{
						name: 'freq',
						label: 'Frequency (freq)',
						widget: 'select',
						hint: 'How often the event repeats.',
						options: [
							{ label: 'Yearly', value: 0 },
							{ label: 'Monthly', value: 1 },
							{ label: 'Weekly', value: 2 },
							{ label: 'Daily', value: 3 },
							{ label: 'Hourly', value: 4 },
							{ label: 'Minutely', value: 5 },
							{ label: 'Secondly', value: 6 }
						]
					},
					{
						name: 'interval',
						label: 'Interval',
						widget: 'number',
						hint: 'Repeat every N frequency periods; defaults to 1.',
						value_type: 'int',
						min: 1,
						default: 1,
						required: false
					},
					{
						name: 'count',
						label: 'Count',
						widget: 'number',
						hint: 'Total number of occurrences, including the start date. Leave empty to use Until or repeat indefinitely.',
						value_type: 'int',
						min: 1,
						required: false
					},
					{
						name: 'until',
						label: 'Until',
						widget: 'datetime',
						hint: 'Last date/time of the recurrence. Do not set this together with Count.',
						input_timezone: 'Europe/Lisbon',
						required: false
					},
					{
						name: 'exdate',
						label: 'Excluded dates',
						label_singular: 'Excluded date',
						widget: 'list',
						hint: 'Specific occurrence dates to skip. Enter the event start date and time in Europe/Lisbon.',
						required: false,
						field: {
							name: 'date',
							label: 'Date',
							widget: 'datetime',
							type: 'date',
							input_timezone: 'Europe/Lisbon'
						}
					},
					{
						name: 'wkst',
						label: 'Week start (wkst)',
						widget: 'select',
						hint: 'First day of the week; defaults to Monday.',
						options: [
							{ label: 'Monday', value: 0 },
							{ label: 'Tuesday', value: 1 },
							{ label: 'Wednesday', value: 2 },
							{ label: 'Thursday', value: 3 },
							{ label: 'Friday', value: 4 },
							{ label: 'Saturday', value: 5 },
							{ label: 'Sunday', value: 6 }
						],
						required: false
					},
					{
						name: 'bysetpos',
						label: 'Positions (bysetpos)',
						widget: 'list',
						hint: 'Select occurrence positions from the dates matched by other by* options, e.g. 1 for the first or -1 for the last.',
						required: false,
						field: {
							name: 'position',
							label: 'Position (positive or negative)',
							widget: 'number',
							hint: 'Position within the matched set; negative values count from the end.',
							value_type: 'int',
							required: true
						}
					},
					{
						name: 'bymonth',
						label: 'Months (bymonth)',
						widget: 'list',
						hint: 'Restrict occurrences to these months.',
						required: false,
						field: {
							name: 'month',
							label: 'Month',
							widget: 'select',
							options: [
								{ label: 'January', value: 1 },
								{ label: 'February', value: 2 },
								{ label: 'March', value: 3 },
								{ label: 'April', value: 4 },
								{ label: 'May', value: 5 },
								{ label: 'June', value: 6 },
								{ label: 'July', value: 7 },
								{ label: 'August', value: 8 },
								{ label: 'September', value: 9 },
								{ label: 'October', value: 10 },
								{ label: 'November', value: 11 },
								{ label: 'December', value: 12 }
							]
						}
					},
					{
						name: 'bymonthday',
						label: 'Month days (bymonthday)',
						widget: 'list',
						hint: 'Restrict occurrences to these days of the month; negative values count back from month end.',
						required: false,
						field: {
							name: 'day',
							label: 'Day (1-31 or -31 to -1)',
							widget: 'number',
							hint: 'Use 1-31 for days from the start of the month or -1 to -31 from the end.',
							value_type: 'int',
							min: -31,
							max: 31
						}
					},
					{
						name: 'byyearday',
						label: 'Year days (byyearday)',
						widget: 'list',
						hint: 'Restrict occurrences to these days of the year; negative values count back from year end.',
						required: false,
						field: {
							name: 'day',
							label: 'Day (-366 to -1 or 1-366)',
							widget: 'number',
							hint: 'Use 1-366 from the start of the year or -1 to -366 from year end.',
							value_type: 'int',
							min: -366,
							max: 366
						}
					},
					{
						name: 'byweekno',
						label: 'Week numbers (byweekno)',
						widget: 'list',
						hint: 'Restrict yearly occurrences to these ISO week numbers; negative values count back from year end.',
						required: false,
						field: {
							name: 'week',
							label: 'Week (-53 to -1 or 1-53)',
							widget: 'number',
							hint: 'Use 1-53 from the start of the year or -1 to -53 from year end.',
							value_type: 'int',
							min: -53,
							max: 53
						}
					},
					{
						name: 'byweekday',
						label: 'Weekdays (byweekday: 0=Mon, 6=Sun)',
						widget: 'list',
						hint: 'Restrict occurrences to these weekdays. Values follow rrule.js: 0=Monday through 6=Sunday.',
						required: false,
						field: {
							name: 'weekday',
							label: 'Weekday',
							widget: 'select',
							options: [
								{ label: 'Monday', value: 0 },
								{ label: 'Tuesday', value: 1 },
								{ label: 'Wednesday', value: 2 },
								{ label: 'Thursday', value: 3 },
								{ label: 'Friday', value: 4 },
								{ label: 'Saturday', value: 5 },
								{ label: 'Sunday', value: 6 }
							]
						}
					},
					{
						name: 'byhour',
						label: 'Hours (byhour)',
						widget: 'list',
						hint: 'Restrict occurrences to these hours of the day.',
						required: false,
						field: {
							name: 'hour',
							label: 'Hour (0-23)',
							widget: 'number',
							hint: 'Hour of the day, from 0 to 23.',
							value_type: 'int',
							min: 0,
							max: 23
						}
					},
					{
						name: 'byminute',
						label: 'Minutes (byminute)',
						widget: 'list',
						hint: 'Restrict occurrences to these minutes of the hour.',
						required: false,
						field: {
							name: 'minute',
							label: 'Minute (0-59)',
							widget: 'number',
							hint: 'Minute of the hour, from 0 to 59.',
							value_type: 'int',
							min: 0,
							max: 59
						}
					},
					{
						name: 'bysecond',
						label: 'Seconds (bysecond)',
						widget: 'list',
						hint: 'Restrict occurrences to these seconds of the minute.',
						required: false,
						field: {
							name: 'second',
							label: 'Second (0-59)',
							widget: 'number',
							hint: 'Second of the minute, from 0 to 59.',
							value_type: 'int',
							min: 0,
							max: 59
						}
					},
					{
						name: 'byeaster',
						label: 'Easter offset (byeaster)',
						widget: 'number',
						hint: 'Offset in days from Easter Sunday; e.g. 0=Easter Sunday, -2=Good Friday, 1=Easter Monday.',
						value_type: 'int',
						required: false
					}
				]
			},
			{
				name: 'title',
				label: 'Title'
			},
			{
				name: 'cover_image',
				label: 'Cover Image',
				widget: 'image',
				choose_url: false
			},
			{
				name: 'short_description',
				label: 'Short Description',
				widget: 'text',
				maxlength: 300
			},
			{
				name: 'description',
				label: 'Description',
				widget: 'richtext'
			},
			{
				name: 'booking_link',
				label: 'Booking / Ticket Link',
				required: false
			},
			{
				name: 'car_sharing_link',
				label: 'Car-Sharing Group Link',
				required: false
			},
			{
				name: 'info_link',
				label: 'More Information Link',
				required: false
			},
			{
				name: 'organizers',
				label: 'Organizers',
				label_singular: 'Organizer',
				widget: 'list',
				required: false,
				fields: [
					{
						name: 'name',
						label: 'Name'
					},
					{
						name: 'description',
						label: 'Description',
						maxlength: 100
					},
					{
						name: 'photo',
						label: 'Photo',
						widget: 'image',
						choose_url: false,
						media_folder: '{{media_folder}}/events/organizer',
						public_folder: '/media/events/organizer'
					}
				]
			}
		] as const
	} satisfies Collection;
</script>

<script lang="ts">
	import { Media } from '$lib/services/Media';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Clock from '@lucide/svelte/icons/clock';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Ticket from '@lucide/svelte/icons/ticket';
	import Car from '@lucide/svelte/icons/car';
	import CalendarCheck from '@lucide/svelte/icons/calendar-check';
	import SquareArrowOutUpRight from '@lucide/svelte/icons/square-arrow-out-up-right';
	import type { InferCollectionType } from '$lib/types/cms-types';
	import Image from '$lib/components/atoms/Image.svelte';

	interface Props {
		event: Omit<InferCollectionType<typeof eventCollection>, 'start' | 'End'> & {
			start: Date;
			end: Date;
		};
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
	class="lg:grid-areas overflow-hidden wrap-break-word lg:mx-auto lg:grid lg:max-w-300 lg:grid-cols-[30%_auto] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:py-16"
>
	<div style="grid-area: cover">
		<Image
			src={Media.getFile(event.cover_image)}
			alt=""
			class="h-auto shadow-lg/50 max-md:max-w-screen lg:max-w-full lg:rounded-md"
			style="view-transition-name: event-cover"
		/>
	</div>

	<div
		class="max-md:w-[calc(100vw-(100vw-100%))] max-md:max-w-300 max-md:px-4 max-md:pb-10 lg:contents"
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
					<time>{startDate} {event.frequency && `(${event.frequency})`}</time>
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

				{#each event.organizers as organizer (organizer.name)}
					<div class="mt-4 grid gap-x-4 gap-y-1" class:grid-cols-[auto_1fr]={organizer.photo}>
						<div class="row-span-2 aspect-square w-14 overflow-hidden rounded-full">
							<Image
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
