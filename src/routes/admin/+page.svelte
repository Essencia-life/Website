<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { headerCmsConfig } from '$lib/components/templates/Header.svelte';
	import { footerCmsConfig } from '$lib/components/templates/Footer.svelte';
	import { pageCollection } from '$lib/components/templates/Page.svelte';
	import { eventCollection } from '$lib/components/templates/Event.svelte';

	const { data }: PageProps = $props();

	onMount(async () => {
		const { init, registerPreviewTemplate } = await import('@sveltia/cms');

		await init({
			config: {
				load_config_file: false,
				media_folder: '/src/lib/assets/media',
				public_folder: '/media',
				media_libraries: {
					all: {
						slugify_filename: true
					}
				},
				backend: {
					name: 'github',
					repo: 'Essencia-life/Website',
					branch: 'sveltia',
					base_url: `https://${data.baseUrl}`,
					auth_endpoint: resolve('/admin/auth'),
					commit_messages: {
						create: 'feat({{collection}}): created “{{slug}}”',
						update: 'feat({{collection}}): updated “{{slug}}”',
						delete: 'feat({{collection}}): deleted “{{slug}}”',
						uploadMedia: 'feat({{collection}}): uploaded “{{path}}”',
						deleteMedia: 'feat({{collection}}): deleted “{{path}}”'
					}
				},
				// editor: {
				// 	preview: false
				// },
				singletons: [headerCmsConfig, footerCmsConfig],
				collections: [pageCollection, eventCollection]
			}
		});

		// Register Svelte components as preview templates by wrapping them in a small React adapter
		const { svelteToReactWrapper } = await import('$lib/admin/sveltePreviewMapper');
		const [{ default: PageTemplate }, { default: EventTemplate }] = await Promise.all([
			import('$lib/components/templates/Page.svelte'),
			import('$lib/components/templates/Event.svelte')
		]);

		// Use the collection name if available, otherwise fall back to the conventional string
		registerPreviewTemplate(
			pageCollection?.name ?? 'pages',
			svelteToReactWrapper(PageTemplate, 'page')
		);
		registerPreviewTemplate(
			eventCollection?.name ?? 'events',
			svelteToReactWrapper(EventTemplate, 'event')
		);
	});
</script>
