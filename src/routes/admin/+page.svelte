<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { headerCmsConfig } from '$lib/components/templates/Header.svelte';
	import { footerCmsConfig } from '$lib/components/templates/Footer.svelte';
	import PageTemplate, { pageCollection } from '$lib/components/templates/Page.svelte';
	import EventTemplate, { eventCollection } from '$lib/components/templates/Event.svelte';
	import { svelteToReactWrapper } from './sveltePreviewMapper.svelte';

	const { data }: PageProps = $props();

	onMount(async () => {
		const { init, registerPreviewTemplate, registerPreviewStyle } = await import('@sveltia/cms');

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
					auth_endpoint: '/admin/auth',
					commit_messages: {
						create: 'feat({{collection}}): created “{{slug}}”',
						update: 'feat({{collection}}): updated “{{slug}}”',
						delete: 'feat({{collection}}): deleted “{{slug}}”',
						uploadMedia: 'feat({{collection}}): uploaded “{{path}}”',
						deleteMedia: 'feat({{collection}}): deleted “{{path}}”'
					}
				},
				singletons: [headerCmsConfig, footerCmsConfig],
				collections: [pageCollection, eventCollection]
			}
		});

		registerPreviewStyle('/admin/preview.css');
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
