<script lang="ts">
	import { Events } from '$lib/services/Events';
	import { Media } from '$lib/services/Media.js';
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';

	const events = Events.getAllUpcoming();

	// TODO: store scroll position in snapshot
	// TODO: add arrow buttons to scroll

	const connectScrolling: Attachment = (node) => {
		const root = document.getElementById('parallax');
		let rootStartPos = 0;
		let nodeStartPos = 0;

		function sync() {
			// TODO: apply only if not hovered or touched ?
			const diff = root!.scrollTop - rootStartPos;
			node.scrollLeft = nodeStartPos + diff;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					nodeStartPos = node.scrollLeft;
					rootStartPos = root!.scrollTop;
					root!.addEventListener('scroll', sync, { passive: true });
				} else {
					root!.removeEventListener('scroll', sync);
				}
			},
			{
				root
			}
		);
		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	};
</script>

<div class="events" {@attach connectScrolling}>
	{#each events as event (event.slug)}
		{@const isMoreThanOneDay = event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000}
		<a
			href={resolve(
				event.type === 'retreat' ? '/(pages)/retreats/[slug]' : '/(pages)/events/[slug]',
				{ slug: event.slug }
			)}
			class="event no-link"
		>
			<enhanced:img src={Media.getFile(event.cover_image)} alt="" loading="lazy" />
			<div style="display: flex; flex-direction: column; gap: 2rem; flex: 1;">
				<div style="display: flex; justify-content: space-between">
					<small>{event.type}</small>
					{#if event.weekly}
						<time style="font-weight: 500">{event.weekly}</time>
					{:else}
						<time datetime={event.start.toISOString()} style="font-weight: 500">
							{#if isMoreThanOneDay}
								{@const startDate = event.start.toLocaleDateString('de', {
									day: 'numeric',
									month: 'numeric'
								})}
								{@const endDate = event.end.toLocaleDateString('de', {
									day: 'numeric',
									month: 'numeric',
									year: '2-digit'
								})}
								{startDate} &mdash; {endDate}
							{:else}
								{event.start.toLocaleDateString('de', {
									day: 'numeric',
									month: 'numeric',
									year: '2-digit'
								})}
							{/if}
						</time>
					{/if}
				</div>
				<h3>{event.title}</h3>
				{event.short_description}
			</div>
		</a>
	{/each}
</div>

<style>
	h3 {
		margin: 0;
	}

	.events {
		display: grid;
		grid-auto-flow: column;
		overflow: auto;
		max-width: 100vw;
	}

	.events::-webkit-scrollbar {
		display: none;
	}

	.event {
		display: flex;
		gap: 4rem;
		text-decoration: none;
		color: inherit;
		background: rgba(var(--brand-sandbeige-rgb) / 40%);
		padding: 4rem;
		border-radius: 2rem;
		box-shadow: 0 1px 4px rgba(var(--brand-darkbrown-rgb) / 30%);
		scroll-snap-align: center;
	}

	@media screen and (width < 800px) {
		.events {
			grid-auto-columns: 70vw;
			grid-gap: 8rem;
			padding: 8rem 15vw;
			margin: -4rem;
			width: 100vw;
			scroll-snap-type: x mandatory;
		}
		.event {
			flex-direction: column;
			scroll-snap-align: center;
			scroll-snap-stop: always;
		}
		.event enhanced\:img {
			height: 300px;
			width: 100%;
		}
	}

	@media screen and (width >= 800px) {
		.events {
			grid-auto-columns: max(calc(40vh * (2 / 3) * 3), 480px);
			grid-gap: 10rem;
			padding: 16rem 30vw;
		}

		.event enhanced\:img {
			height: 40vh;
			width: auto;
			aspect-ratio: 3 / 4;
		}
	}

	.event small {
		text-transform: uppercase;
		background-color: var(--brand-sagegrey-color);
		color: var(--brand-stonewhite-color);
		font-weight: 700;
		padding: 1rem 2rem;
		border-radius: 1rem;
		font-size: 2.5rem;
		letter-spacing: 1px;
		text-shadow: 1px 1px var(--brand-mossgreen-color);
		line-height: 1.5;
	}

	.event enhanced\:img {
		object-fit: cover;
	}
</style>
