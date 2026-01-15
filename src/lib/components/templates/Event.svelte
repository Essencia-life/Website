<script lang="ts">
	import type { Event } from '$lib/services/Events';
	import { Media } from '$lib/services/Media';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

	interface Props {
		event: Event;
	}

	const { event }: Props = $props();
	const isMoreThanOneDay = $derived(
		event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000
	);
	const startDate = $derived(event.start.toLocaleDateString('en', { dateStyle: 'long' }));
	const endDate = $derived(event.end.toLocaleDateString('en', { dateStyle: 'long' }));
	const startTime = $derived(
		event.start.toLocaleTimeString('en', {
			hour: 'numeric',
			minute: '2-digit'
		})
	);
	const endTime = $derived(
		event.end.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
	);
</script>

<div class="event">
	<div class="cover">
		<enhanced:img src={Media.getFile(event.cover_image)} />
	</div>

	<div class="details">
		<h2 class="title">{event.title}</h2>

		<time>
			{#if isMoreThanOneDay}
				<b>{startDate} &mdash; {endDate}</b>
			{:else}
				<b>{startDate}</b>,&ensp;{startTime} &ndash; {endTime}
			{/if}
		</time>

		<Markdown content={event.description} />
	</div>
</div>

<style>
	.event {
		overflow-x: hidden;
		overflow-wrap: break-word;
	}

	.event .title {
		margin-block: 4rem 8rem;
		line-height: 1;
	}

	.event :global(picture) {
		display: contents;
	}

	.event enhanced\:img {
		max-width: 100vw;
		height: auto;
		box-shadow: 0 3px 8px rgba(var(--brand-darkbrown-rgb) / 50%);
	}

	@media screen and (width <= 800px) {
		.event .details {
			width: calc(100vw - (100vw - 100%));
			max-width: 1200px;
			margin-inline: auto;
			padding: 0 4rem 20rem;
		}
	}

	@media screen and (width > 800px) {
		.event {
			display: flex;
			gap: 8rem;
			width: calc(100vw - (100vw - 100%));
			max-width: 1200px;
			margin-inline: auto;
			padding: 8rem 4rem;
		}

		.event .title {
			margin-top: 0;
		}

		.event .cover {
			width: 30%;
		}

		.event enhanced\:img {
			max-width: 100%;
		}
	}
</style>
