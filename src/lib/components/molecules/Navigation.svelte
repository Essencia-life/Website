<script lang="ts">
	import { slide } from 'svelte/transition';
	import headerData from '$lib/content/header.json';
	import { ChevronDown, ChevronUp } from '@lucide/svelte';

	interface Props {
		header?: true;
		sidebar?: true;
		menuAbove?: boolean;
	}

	interface NavigationItem {
		label: string;
		link: string;
		children?: Omit<NavigationItem, 'open' | 'children'>[];
		open?: boolean;
	}

	const { header, sidebar, menuAbove }: Props = $props();
	const navigation = $state<NavigationItem[]>(headerData.navigation);

	function scrollIntoView(event: CustomEvent) {
		const element = event.target as HTMLDivElement;
		element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}
</script>

<nav class:header class:sidebar class:menuAbove>
	<ul>
		{#each navigation as item (item)}
			<li>
				<div class="root">
					<a href={item.link}>{item.label}</a>

					{#if item.children}
						<div class="toggle">
							<button class="icon-button" onclick={() => (item.open = !item.open)}>
								{#if !item.open}
									<ChevronDown />
								{:else}
									<ChevronUp />
								{/if}
							</button>
						</div>
					{/if}
				</div>

				{#if item.children && (item.open || header)}
					<div class="children" transition:slide onintroend={scrollIntoView}>
						<ul>
							{#each item.children as child (child)}
								<li>
									<a href={child.link}>{child.label}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav.header {
		margin-left: auto;
	}

	nav ul {
		list-style: none;
		display: flex;
		gap: 2rem;
		padding: 0;
	}

	nav li {
		margin: 0;
	}

	nav.sidebar ul {
		flex-direction: column;
	}

	nav a {
		color: var(--brand-mossgreen-color);
		font-weight: 500;
		font-size: 1.125rem;
		text-decoration: none;
	}

	.root {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 3rem;
	}

	nav.header .root > a {
		display: flex;
		align-items: center;
		height: 4.5rem;
	}

	nav.header li .children {
		position: absolute;
		display: flex;
		justify-content: stretch;
		margin-left: -1.5rem;
		box-shadow: 0 3px 8px rgba(var(--brand-earthbrown-rgb) / 50%);
		border-radius: 0.25rem;
	}

	nav.header:not(.menuAbove) li .children {
		top: 100%;
	}

	nav.header.menuAbove li .children {
		bottom: 100%;
	}

	.sidebar .children {
		background: rgba(var(--brand-earthbrown-rgb) / 4%);
	}

	.header .children {
		background: var(--brand-parchment-color);
	}

	.children ul {
		display: flex;
		flex-direction: column;
		padding: 1rem 1.5rem;
	}

	nav.header:not(.menuAbove) .children ul {
		padding-bottom: 1.5rem;
	}

	nav.header.menuAbove .children ul {
		padding-top: 1.5rem;
		flex-direction: column-reverse;
	}

	.children li {
		min-width: 200px;
	}

	nav.header li:not(:hover) .children {
		display: none;
	}

	@media screen and (width >= 800px) {
		.toggle {
			display: none;
		}
	}

	@media screen and (width < 800px) {
		nav.header {
			display: none;
		}

		nav > ul {
			gap: 1rem;
		}

		.toggle {
			border-left: 1px solid var(--brand-highlight-color);
			padding-left: 0.5rem;
		}

		.toggle .icon-button {
			color: var(--brand-mossgreen-color);
		}

		.children {
			margin-inline: -1rem;
		}

		.children ul {
			margin-left: 1rem;
			background: var(--brand-parchment-color);
		}
	}
</style>
