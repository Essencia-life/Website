<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Events from '$lib/components/templates/Events.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>
		{data.title} &middot; Essência Nature Retreat &middot; Aljezur &middot; Portugal
	</title>
</svelte:head>

<div class="content">
	<Markdown content={data.content}>
		{#snippet placeholder(name: string)}
			{#if name === 'upcoming_retreats'}
				<Events events={data.retreats} />
			{:else if name === 'past_retreats'}
				<Events events={data.retreats} />
			{:else}
				<code>{`{{${name}}}`}</code>
			{/if}
		{/snippet}
	</Markdown>
</div>
