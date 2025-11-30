<script lang="ts">
	import type { Snippet } from 'svelte';
	import { quartInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	interface DialogProps {
		header?: Snippet;
		main: Snippet;
		footer?: Snippet;
		bottomSheet?: boolean;
	}

	let { header, main, footer, bottomSheet }: DialogProps = $props();
</script>

<div class="dialog" class:bottomSheet transition:fly|global={{ y: '50%', easing: quartInOut }}>
	{#if header}
		<div class="header">{@render header()}</div>
	{/if}
	<div class="main">{@render main()}</div>
	{#if footer}
		<div class="footer">{@render footer()}</div>
	{/if}
</div>

<style>
	.dialog {
		position: fixed;
		bottom: 50%;
		left: 50%;
		transform: translate(-50%, 50%);
		display: flex;
		flex-direction: column;
		min-width: 320px;
		max-width: calc(100vw - 8rem);
		gap: 2rem;
		background-color: var(--brand-stonewhite-color);
		border-radius: 8rem;
		box-shadow: 0 0 16rem var(--brand-darkbrown-color);
	}

	@media screen and (width < 800px) {
		.dialog {
			padding: 6rem 4rem;
		}
	}

	@media screen and (width >= 800px) {
		.dialog {
			padding: 8rem;
		}
	}

	.dialog.bottomSheet {
		inset: 18rem 0 0 0;
		max-width: 100vw;
		transform: none;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		overflow: hidden;
	}

	.main {
		min-height: 100px;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		gap: 2rem;
	}
</style>
