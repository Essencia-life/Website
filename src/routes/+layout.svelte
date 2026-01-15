<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/logo_tree.png';
	import Overlays from '$lib/components/atoms/Overlays.svelte';
	import { page } from '$app/state';
	import SEO from '$lib/components/atoms/SEO.svelte';
	import { Media } from '$lib/services/Media.js';
	import type { Snippet } from 'svelte';
	import type { Metadata } from './+layout.server';

	interface Props {
		data: {
			metadata?: Metadata;
			VERCEL_URL: string;
			VERCEL_ENV: string;
		};
		children: Snippet;
	}

	let { children, data }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<meta name="theme-color" content="#e9e4d3" />

	{#if data.VERCEL_ENV !== 'production'}
		<meta name="robots" content="noindex,follow" />
	{/if}
</svelte:head>

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

<Overlays>
	{@render children?.()}
</Overlays>
