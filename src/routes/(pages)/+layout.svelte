<script lang="ts">
	import type { Snippet } from 'svelte';

	import SEO from '$lib/components/atoms/SEO.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	import type { Metadata } from './+layout.server';
	import { page } from '$app/state';
	import { Media } from '$lib/services/Media';

	interface Props {
		data: {
			metadata?: Metadata;
			VERCEL_URL: string;
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

{#if data.metadata}
	<SEO
		schema={{
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: data.metadata.title,
			description: data.metadata.description,
			image: data.metadata.cover && Media.getFile(data.metadata.cover).img.src,
			url: `https://${data.VERCEL_URL}${page.url.pathname}`
		}}
	/>
{:else if page.data.event}
	<SEO
		schema={{
			'@context': 'https://schema.org',
			'@type': 'Event',
			name: `${page.data.event.start.toLocaleDateString()} · ${page.data.event.title}`,
			description: page.data.event.short_description,
			image: Media.getFile(page.data.event.cover_image).img.src,
			startDate: page.data.event.start.toISOString(),
			endDate: page.data.event.end.toISOString(),
			eventAttendanceMode: 'OfflineEventAttendanceMode',
			url: `https://${data.VERCEL_URL}${page.url.pathname}`,
			location: {
				'@type': 'Place',
				name: 'Essência Nature Retreat',
				address: '66V7+GM, 8670-130, Portugal'
			},
			organizer: {
				'@type': 'Organization',
				name: 'Essência Nature Retreat',
				url: 'https://essencia.life'
			}
		}}
	/>
{/if}

<div class="page">
	<Header />

	<div class="content">
		{@render children()}
	</div>

	<Footer />
</div>

<style>
	.page {
		display: grid;
		min-height: 100%;
		grid-template-rows: auto 1fr auto;
	}
</style>
