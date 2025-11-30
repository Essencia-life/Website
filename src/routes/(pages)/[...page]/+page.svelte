<script lang="ts">
	import type { PageProps } from './$types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>
		{data.title} &middot; Essência Nature Retreat &middot; Aljezur &middot; Portugal
	</title>
</svelte:head>

<div class="content">
	<Markdown content={data.content} />
</div>
