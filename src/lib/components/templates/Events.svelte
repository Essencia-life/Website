<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		events: any[];
	}

	const { events }: Props = $props();
	const eventsByMonth = $derived(
		events.reduce((map, event) => {
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
