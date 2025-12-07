<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import Events from '$lib/components/organisms/EventCalendar.svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	const { title, children }: Props = $props();
</script>

<svelte:head>
	<title>
		{title} &middot; Essência Nature Retreat &amp; Eco-Village &middot; Aljezur &middot; Portugal
	</title>
</svelte:head>

<div class="content">
	{@render children()}
</div>
