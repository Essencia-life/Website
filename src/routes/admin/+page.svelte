<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { headerCmsConfig } from '$lib/components/templates/Header.svelte';
	import { footerCmsConfig } from '$lib/components/templates/Footer.svelte';

	const { data }: PageProps = $props();

	onMount(async () => {
		const { init } = await import('@sveltia/cms');

		void init({
			config: {
				load_config_file: false,
				media_folder: 'src/lib/assets/media',
				public_folder: '',
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
                singletons: [
					headerCmsConfig,
					footerCmsConfig,
				]
			}
		});
	});
</script>