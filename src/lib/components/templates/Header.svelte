<script lang="ts" module>
	import type { CollectionFile, Field } from '@sveltia/cms';

	const labelAndLinkFields: Field[] = [
		{ name: 'label', label: 'Label' },
		{
			name: 'link',
			label: 'Link',
			widget: 'relation',
			collection: 'pages',
			value_field: '/{{slug}}',
		}
	];

	export const headerCmsConfig: CollectionFile = {
		name: 'header',
		label: 'Page Header',
		icon: 'page_header',
		file: 'src/lib/content/header.json',
		editor: { preview: false },
		fields: [
			{
				name: 'navigation',
				label: 'Navigation Items',
				label_singular: 'Item',
				widget: 'list',
				fields: [
					...labelAndLinkFields,
					{
						name: 'children',
						label: 'Submenu Items',
						label_singular: 'Item',
						widget: 'list',
						required: false,
						fields: [...labelAndLinkFields]
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import { getContext } from 'svelte';
	import Sidebar from '../organisms/Sidebar.svelte';
	import Navigation from '../molecules/Navigation.svelte';
	import type { Overlays } from '$lib/overlays.svelte';
	import { resolve } from '$app/paths';
	// inlined, so the SVGs follow the colour scheme (prefers-color-scheme) of the page
	import logoTreeSvg from '$lib/assets/logo_tree.svg?raw';
	import logoTitleSvg from '$lib/assets/logo_title.svg?raw';

	const stripTitle = (svg: string) => svg.replace(/<title>.*?<\/title>/, '');
	const logoTree = stripTitle(logoTreeSvg);
	const logoTitle = stripTitle(logoTitleSvg);

	const overlays = getContext<Overlays<any>>('overlays');

	const { menuAbove = undefined }: { menuAbove?: boolean } = $props();

	function openSidebar() {
		overlays.add({
			component: Sidebar,
			props: {}, // FIXME: not require empty object
			backdrop: true
		});
	}
</script>

<header class="sticky top-0 z-11 bg-stone-100 dark:bg-stone-50 border-b border-stone-50/50 dark:border-stone-200 shadow-md/25">
	<div class="page-content">
		<a href={resolve('/')} class="home logo-tree" aria-hidden="true" tabindex="-1">
			{@html logoTree}
		</a>

		<a href={resolve('/')} class="home logo-title">
			{@html logoTitle}
			<h1>Essência</h1>
		</a>

		<Navigation header {menuAbove} />

		<button id="menu-button" onclick={openSidebar} aria-label="Menu">
			<Menu />
		</button>
	</div>
</header>

<style>
	header .page-content {
		display: flex;
		height: 4.5rem;
		padding-block: 0.5rem;
		align-items: center;
	}

	.home {
		display: flex;
		height: 100%;
		align-items: center;
	}

	.logo-tree :global(svg) {
		display: block;
		height: 100%;
		width: auto;
		min-width: 3rem;
	}

	.logo-title :global(svg) {
		display: block;
		height: 2rem;
		width: auto;
	}

	h1 {
		position: absolute;
		overflow: hidden;
		height: 0;
		width: 0;
	}

	#menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3rem;
		aspect-ratio: 1;
		color: light-dark(var(--color-olive-700), var(--color-olive-300));
	}

	@media screen and (width < 800px) {
		header .page-content {
			justify-content: space-between;
		}
	}

	@media screen and (width >= 800px) {
		header .page-content {
			column-gap: 1rem;
		}

		#menu-button {
			display: none;
		}
	}
</style>
