<script lang="ts" module>
	import type { CollectionFile, Field } from '@sveltia/cms';

	const labelAndLinkFields: Field[] = [
		{ name: 'label', label: 'Label' },
		{
			name: 'link',
			label: 'Link',
			widget: 'relation',
			collection: 'pages',
			search_fields: ['title'],
			value_field: '/{{slug}}',
			display_fields: ['title']
		},
	];
	
	export const headerCmsConfig: CollectionFile = {
		name: 'header',
		label: 'Page Header',
		icon: 'page_header',
		file: 'src/lib/content/header.json',
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
						fields: [
							...labelAndLinkFields,
						]
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import Sidebar from '../organisms/Sidebar.svelte';
	import Navigation from '../molecules/Navigation.svelte';
	import type { Overlays } from '$lib/overlays.svelte';
	import { resolve } from '$app/paths';
	import logoTree from '$lib/assets/logo_tree.png?enhanced&h=56;112&w=';
	import logoTitle from '$lib/assets/logo_title.png?enhanced&h=24;48&w=';

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

<header>
	<div class="page-content">
		<a href={resolve('/')} class="home" aria-hidden="true">
			<enhanced:img class="logo" src={logoTree} alt="" />
		</a>

		<a href={resolve('/')} class="home">
			<enhanced:img class="title" src={logoTitle} alt="" />
			<h1>Essência</h1>
		</a>

		<Navigation header {menuAbove} />

		<button id="menu-button" onclick={openSidebar} aria-label="Menu">
			<Menu />
		</button>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 11;
		background: var(--brand-parchment-color);
		border-bottom: 1px solid rgba(var(--brand-stonewhite-rgb) / 50%);
		box-shadow: 0 3px 8px rgba(var(--brand-earthbrown-rgb) / 50%);
	}

	header :global(picture) {
		display: contents;
	}

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

	h1 {
		position: absolute;
		overflow: hidden;
		height: 0;
		width: 0;
	}

	.logo {
		max-height: 100%;
		width: auto;
	}

	.title {
		height: 24px;
		width: auto;
	}

	#menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3rem;
		aspect-ratio: 1;
		color: var(--brand-mossgreen-color);
	}

	@media screen and (width < 800px) {
		header .page-content {
			justify-content: space-between;
		}
	}

	@media screen and (width > 800px) and (width < 890px) {
		.title {
			display: none;
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
