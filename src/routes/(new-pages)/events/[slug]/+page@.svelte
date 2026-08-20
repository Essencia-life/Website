<script lang="ts">
	import type { PageData } from './$types';
	import Event from '$lib/components/templates/Event.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
</script>

<div class="page">
	<Header />
	<Event event={data.event} />
	<Footer />
</div>

<style>
	.page {
		display: grid;
		min-height: 100%;
		grid-template-rows: auto 1fr auto;
	}
</style>
