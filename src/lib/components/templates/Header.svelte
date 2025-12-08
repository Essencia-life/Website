<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import Sidebar from '../organisms/Sidebar.svelte';
	import Navigation from '../molecules/Navigation.svelte';
	import type { Overlays } from '$lib/overlays.svelte';
	import { resolve } from '$app/paths';

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
	<div class="content">
		<a href={resolve('/')} class="home" aria-hidden="true">
			<enhanced:img class="logo" src="$lib/assets/logo_tree.png" alt="" />
		</a>

		<a href={resolve('/')} class="home">
			<enhanced:img class="title" src="$lib/assets/logo_title.png" alt="" />
			<h1>Essência</h1>
		</a>

		<Navigation header {menuAbove} />

		<button id="menu-button" onclick={openSidebar}>
			<Menu />
		</button>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--brand-sandbeige-color);
		border-bottom: 1px solid rgba(var(--brand-stonewhite-rgb) / 50%);
		box-shadow: 0 3px 8px rgba(var(--brand-darkbrown-rgb) / 50%);
	}

	header :global(picture) {
		display: contents;
	}

	header .content {
		display: flex;
		height: 18rem;
		padding-block: 2rem;
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

	#menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 12rem;
		aspect-ratio: 1;
		color: var(--brand-mossgreen-color);
	}

	@media screen and (width < 800px) {
		header .content {
			justify-content: space-between;
		}
	}

	@media screen and (width > 800px) and (width < 890px) {
		.title {
			display: none;
		}
	}

	@media screen and (width >= 800px) {
		header .content {
			column-gap: 4rem;
		}

		#menu-button {
			display: none;
		}
	}
</style>
