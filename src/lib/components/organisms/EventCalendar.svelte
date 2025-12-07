<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { events } from '$lib/content/events.json';
	interface Props {
		type: 'event' | 'retreat';
		filter: 'upcoming' | 'past';
	}

	const { type = 'event', filter = 'upcoming' }: Props = $props();

	const filterFn: Record<'upcoming' | 'past', (event: any) => boolean> = {
		upcoming: (event) => event.type === type && Date.parse(event.start) > Date.now(),
		past: (event) => event.type === type && Date.parse(event.start) < Date.now()
	};

	const eventsFiltered = $derived(events.filter(filterFn[filter]));
	const eventsByMonth = $derived(
		eventsFiltered.reduce((map, event) => {
			const month = new Date(event.start).toLocaleDateString('en', {
				month: 'long',
				year: 'numeric'
			});

			if (map.has(month)) {
				map.get(month)!.push(event);
			} else {
				map.set(month, [event]);
			}

			return map;
		}, new SvelteMap<string, any[]>())
	);
</script>

{#each eventsByMonth as [month, events] (month)}
	<section>
		<h4>{month}</h4>
		{#each events as event (event.slug)}
			<article>
				<h5>{event.title}</h5>
			</article>
		{/each}
	</section>
{:else}
	<i>No Events</i>
{/each}
