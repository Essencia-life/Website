<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { headerCmsConfig } from '$lib/components/templates/Header.svelte';
	import { footerCmsConfig } from '$lib/components/templates/Footer.svelte';
	import { peopleCmsConfig } from '$lib/components/templates/People.svelte';
	import PageTemplate, { pageCollection } from '$lib/components/templates/Page.svelte';
	import EventTemplate, { eventCollection } from '$lib/components/templates/Event.svelte';
	import { extractEntryData, svelteToReactWrapper } from './sveltePreviewMapper.svelte';
	import { transformEvent } from '$lib/utils/eventTransform';
	import type { CustomPreviewTemplateProps } from '@sveltia/cms';

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
				singletons: [
					headerCmsConfig,
					footerCmsConfig,
					peopleCmsConfig,
					{
						name: 'healing-categories',
						label: 'Healing Categories',
						icon: 'category',
						file: 'src/lib/content/healing-categories.json',
						editor: { preview: false },
						fields: [
							{
								name: 'categories',
								label: 'Categories',
								label_singular: 'Category',
								widget: 'list',
								collapsed: 'auto',
								summary: '{{label}}',
								fields: [
									{
										name: 'id',
										widget: 'compute',
										value: '{{uuid_short}}'
									},
									{
										name: 'label',
										label: 'Label',
									}
								]
							},
						]
					}
				],
				collections: [
					pageCollection,
					{ divider: true },
					eventCollection,
				]
			}
		});

		registerPreviewStyle('/admin/preview.css');
		registerPreviewTemplate(
			pageCollection?.name ?? 'pages',
			svelteToReactWrapper(PageTemplate, 'page')
		);
		registerPreviewTemplate(
			eventCollection?.name ?? 'events',
			svelteToReactWrapper(EventTemplate, 'event', (entry: CustomPreviewTemplateProps['entry']) => transformEvent([entry.slug, extractEntryData(entry)]))
		);
	});
</script>
