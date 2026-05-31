<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { on } from 'svelte/events';

	interface Props {
		children: Snippet<[Attachment<HTMLElement>]>;
	}

	let { children }: Props = $props();

	let scrollContainer: HTMLElement;

	let leftDisabled = $state(true);
	let rightDisabled = $state(false);

	const scrollContainerArrows: Attachment<HTMLElement> = (_scrollContainer) => {
		scrollContainer = _scrollContainer;

		function handler() {
			leftDisabled = scrollContainer.scrollLeft === 0;
			rightDisabled =
				scrollContainer.scrollLeft + scrollContainer.clientWidth + 1 >= scrollContainer.scrollWidth;
		}

		on(scrollContainer, 'scrollend', handler);
	};

	function left() {
		scrollContainer.scrollBy({ left: -scrollContainer.clientWidth, behavior: 'smooth' });
	}

	function right() {
		scrollContainer.scrollBy({ left: scrollContainer.clientWidth, behavior: 'smooth' });
	}
</script>

<div class="scroll-container-wrapper">
	<button disabled={leftDisabled} onclick={left}>
		<ChevronLeft size={32} />
	</button>
	{@render children(scrollContainerArrows)}
	<button disabled={rightDisabled} onclick={right}>
		<ChevronRight size={32} />
	</button>
</div>

<style>
	.scroll-container-wrapper {
		position: relative;
	}

	.scroll-container-wrapper > button {
		position: absolute;
		top: 50%;
		background: rgba(255 255 255 / 50%);
		border: 0;
		cursor: pointer;
		display: flex;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		transform: translateY(-50%);
		color: var(--brand-primary-color);
		transition:
			transform 150ms ease-in-out,
			background 150ms ease-in-out;
		transform-origin: center;
		z-index: 1;
	}

	.scroll-container-wrapper > button:first-of-type {
		left: 0;
	}

	.scroll-container-wrapper > button:last-of-type {
		right: 0;
	}

	.scroll-container-wrapper > button:disabled {
		opacity: 0;
	}

	@media (hover: hover) {
		.scroll-container-wrapper > button:hover:not(:disabled) {
			background: rgba(255 255 255 / 80%);
			transform: scale(1.5) translateY(-25%);
			box-shadow: 0 0 8px var(--brand-primary-color);
		}
	}

	@media screen and (width < 600px) {
		.scroll-container-wrapper > button {
			display: none;
		}
	}
</style>
