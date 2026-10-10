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
	import logoTree from '$lib/assets/logo_tree.png?as=run:0';
	import logoTitle from '$lib/assets/logo_title.png?as=run:0';
	import Image from '$lib/components/atoms/Image.svelte';

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

<header class="sticky top-0 z-11 bg-stone-100 border-b border-stone-50/50 shadow-md/25">
	<div class="page-content">
		<a href={resolve('/')} class="home" aria-hidden="true">
			<Image class="max-h-full w-auto min-w-12" src={logoTree} alt="" />
		</a>

		<a href={resolve('/')} class="home">
			<Image class="h-6 w-auto" src={logoTitle} alt="" />
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
		color: var(--color-olive-700);
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
