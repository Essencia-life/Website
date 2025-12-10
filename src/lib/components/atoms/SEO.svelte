<script lang="ts">
	import { titleSuffix } from '$lib/config.js';
	import type { WebPage, WebSite, Event, WithContext } from 'schema-dts';

	interface Props {
		schema: WithContext<WebSite | WebPage | Event>;
	}

	const { schema }: Props = $props();

	const ldJson = $derived(schema);
</script>

<svelte:head>
	{#if schema['@type'] === 'WebSite'}
		<title>{schema.name}</title>
	{:else}
		<title>{schema.name} {titleSuffix}</title>
	{/if}
	<meta name="description" content={schema.description} />

	<!-- OG Tags (https://ogp.me/) -->
	<meta property="og:title" content={schema.name} />
	<meta property="og:description" content={schema.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={schema.url} />
	<meta property="og:image" content={schema.image} />
	<meta property="og:site_name" content="Essência" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={schema.name} />
	<meta name="twitter:description" content={schema.description} />
	<meta name="twitter:image" content={schema.image} />

	<!-- JSON-LD (https://json-ld.org/) -->
	{@html `<script type="application/ld+json">${JSON.stringify(ldJson)}</script>`}
</svelte:head>
