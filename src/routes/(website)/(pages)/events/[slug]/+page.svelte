<script lang="ts">
	import type { PageData } from './$types';
	import Event from '$lib/components/templates/Event.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
</script>

<Event event={data.event} />