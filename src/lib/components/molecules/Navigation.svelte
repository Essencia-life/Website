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
		display: block;
		padding-inline: 8rem;
	}

	nav ul {
		list-style: none;
		display: flex;
		gap: 8rem;
		padding: 0;
	}

	nav.sidebar ul {
		flex-direction: column;
	}

	nav a {
		color: var(--brand-mossgreen-color);
		font-weight: 600;
		text-decoration: none;
	}

	.root {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 12rem;
	}

	nav.header .root > a {
		display: flex;
		align-items: center;
		height: 18rem;
	}

	nav.header li .children {
		position: absolute;
		display: flex;
		justify-content: stretch;
		margin-left: -6rem;
		box-shadow: 0 3px 8px rgba(var(--brand-darkbrown-rgb) / 50%);
		border-radius: 1rem;
	}

	nav.header:not(.menuAbove) li .children {
		top: 100%;
	}

	nav.header.menuAbove li .children {
		bottom: 100%;
	}

	.sidebar .children {
		background: rgba(var(--brand-darkbrown-rgb) / 4%);
	}

	.header .children {
		background: var(--brand-sandbeige-color);
	}

	.children ul {
		display: flex;
		flex-direction: column;
		padding: 4rem 6rem;
	}

	nav.header:not(.menuAbove) .children ul {
		padding-bottom: 6rem;
	}

	nav.header.menuAbove .children ul {
		padding-top: 6rem;
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
			gap: 4rem;
		}

		.toggle {
			border-left: 1px solid var(--brand-sagegrey-color);
			padding-left: 2rem;
		}

		.toggle .icon-button {
			color: var(--brand-mossgreen-color);
		}

		.children {
			margin-inline: -4rem;
		}

		.children ul {
			margin-left: 4rem;
			background: var(--brand-sandbeige-color);
		}
	}
</style>
