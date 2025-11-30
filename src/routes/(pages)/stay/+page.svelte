<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import { accommodations } from '$lib/content/accommodations.json';

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
			{#if name === 'list_of_accommodations'}
				{#each accommodations as accommodation (accommodation.name)}
					<h4>{accommodation.headline}</h4>
				{/each}
			{:else}
				<code>{`{{${name}}}`}</code>
			{/if}
		{/snippet}
	</Markdown>
</div>
