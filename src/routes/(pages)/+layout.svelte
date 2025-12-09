<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { titleSuffix } from '$lib/config';
	import fallbackImage from '$lib/assets/logo.avif';

	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	import type { Metadata } from './+layout.server';

	interface Props {
		data: {
			metadata: Metadata;
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();
	const meta = $derived(data?.metadata ?? {});

	const {
		title,
		description = 'Nature Retreat & Eco-Village',
		cover = fallbackImage // TODO: add default image
	} = $derived(meta);

	const ldJson = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting', // TODO: set proper type
		headline: title,
		description,
		// author: {  // TODO: set proper author
		// 	"@type": "Person",
		// 	name: author
		// },
		// datePublished: date, // TODO: do we need a date?
		image: cover,
		mainEntityOfPage: page.url
	});
</script>

<svelte:head>
	<!-- TODO: create SEO component to re-use it in root page -->
	<title>{title} {titleSuffix}</title>
	<meta name="description" content={description} />

	<!-- OG Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<!-- FIXME: page.url is http://sveltekit-prerender/ during prerender -->
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:image" content={cover} />

	<!-- Twitter -->
	<!-- TODO: other card size? -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={cover} />

	<!-- JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify(ldJson)}</script>`}
</svelte:head>

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
