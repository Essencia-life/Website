<script lang="ts">
	import homeData from '$lib/content/home.json';

	import { Media } from '$lib/services/Media.js';

	import SEO from '$lib/components/atoms/SEO.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import NewsletterForm from '$lib/components/organisms/NewsletterForm.svelte';

	import Hero from './Hero.svelte';
	import Events from './Events.svelte';
	import Accommodations from './Accommodations.svelte';
	import Map from './Map.svelte';
	import SocialMedia from './SocialMedia.svelte';
	import Testimonials from './Testimonials.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import type { Attachment } from 'svelte/attachments';

	let heroIsVisible = $state(true);
	let lastScrollPositions = $state({
		parallax: 0,
		events: 0,
		accommodations: 0
	});

	function lastScrollPositionFactory(
		get: () => number,
		set: (value: number) => void,
		field: 'scrollTop' | 'scrollLeft' = 'scrollTop'
	): Attachment<HTMLElement> {
		return (node) => {
			const update = () => set(node[field]);

			node[field] = get();
			node.addEventListener('scrollend', update);

			return () => {
				node.removeEventListener('scrollend', update);
			};
		};
	}

	const lastEventsScrollPosition = lastScrollPositionFactory(
		() => lastScrollPositions.events,
		(value) => (lastScrollPositions.events = value),
		'scrollLeft'
	);

	const lastParallaxScrollPosition = lastScrollPositionFactory(
		() => lastScrollPositions.parallax,
		(value) => (lastScrollPositions.parallax = value)
	);

	export const snapshot: Snapshot<typeof lastScrollPositions> = {
		capture: () => lastScrollPositions,
		restore: (value) => (lastScrollPositions = value)
	};
</script>

<SEO
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: homeData.seo.title,
		description: homeData.seo.description,
		image: Media.getFile(homeData.seo.cover_image).img.src,
		url: 'https://essencia.life'
	}}
/>

<div class="parallax" id="parallax" {@attach lastParallaxScrollPosition}>
	<Hero visibilityChange={(visible) => (heroIsVisible = visible)} />

	<Header menuAbove={heroIsVisible} />

	{#each homeData.sections as section (section.id)}
		<section id={section.id}>
			{#if section.type === 'text'}
				<div class="parallax__layer parallax__layer--base">
					<div>
						<h2>{section.headline}</h2>
						{#if section.content}
							<Markdown content={section.content} />
						{/if}
					</div>

					{#if section.button}
						<a href={section.button.link} class="button button-primary">{section.button.label}</a>
					{/if}
				</div>
				{#if section.photo}
					<div class="parallax__layer parallax__layer--back">
						<!-- TODO: define sizes -->
						<!-- TODO: provide alt from CMS? -->
						<enhanced:img src={Media.getFile(section.photo)} alt="" loading="lazy" />
					</div>
				{/if}
			{:else if section.type === 'events'}
				<div class="parallax__layer parallax__layer--base">
					<h2>{section.headline}</h2>

					<Events {lastEventsScrollPosition} />

					{#if section.button}
						<a href={section.button.link} class="button button-primary">{section.button.label}</a>
					{/if}
				</div>
			{:else if section.type === 'community-day'}
				<!-- TODO: rethink design to fit better between sections -->
				<div class="parallax__layer parallax__layer--base community-day">
					<div class="community-background">
						<enhanced:img src={Media.getFile(section.photos![0])} alt="" loading="lazy" />
						<enhanced:img src={Media.getFile(section.photos![1])} alt="" loading="lazy" />
					</div>
					<div class="heart-shadow">
						<div class="heart-shape">
							<div>
								<h2>{section.headline}</h2>
								{#if section.content}
									<Markdown content={section.content} />
								{/if}

								{#if section.button}
									<a href={section.button.link} class="button">{section.button.label}</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{:else if section.type === 'accommodations'}
				<div class="parallax__layer parallax__layer--base">
					<div class="flex-col items-center pt-8 text-center lg:flex">
						<h2>{section.headline}</h2>
						{#if section.content}
							<Markdown content={section.content} />
						{/if}

						<Accommodations />
					</div>
				</div>
			{:else if section.type === 'map'}
				<div class="parallax__layer parallax__layer--base">
					<Map />
				</div>
			{:else if section.type === 'social-media'}
				<div class="parallax__layer parallax__layer--base">
					<h3>{section.headline}</h3>
					{#if section.content}
						<Markdown content={section.content} />
					{/if}

					{#if section.platforms}
						<SocialMedia platforms={section.platforms} />
					{/if}

					<!--					<h3 id="newsletter">Newsletter</h3>-->

					<!--					<NewsletterForm />-->
				</div>
			{:else if section.type === 'testimonials'}
				<div class="parallax__layer parallax__layer--base">
					<h2>{section.headline}</h2>
					<Testimonials testimonials={section.items!} />
				</div>
			{:else}
				<pre>{JSON.stringify(section, null, 2)}</pre>
			{/if}
		</section>
	{/each}

	<Footer />
</div>

<style>
	h2 {
		margin-block: 1rem;
		text-align: center;
	}

	@media screen and (width < 800px) {
		section {
			position: relative;
			display: flex;
			flex-direction: column;
			min-height: 80vh;
			overflow-x: hidden;
		}

		.parallax__layer--base {
			display: flex;
			flex-direction: column;
			padding: 1rem;
		}

		.parallax__layer--back {
			position: relative;
		}

		.parallax__layer--back enhanced\:img {
			max-width: 100%;
			height: auto;
		}

		#kids-temple .parallax__layer--back::after,
		#about .parallax__layer--back::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				to bottom,
				var(--brand-stonewhite-color),
				rgba(var(--brand-stonewhite-rgb) / 0%) 35%
			);
		}

		.button {
			margin: 1.5rem auto;
		}

		#events .button {
			margin-block: 0.75rem;
		}

		.buttons {
			flex-direction: column;
			margin-bottom: 1.5rem;
		}

		#healing-center {
			display: flex;
			flex-direction: column-reverse;
		}

		#visit .parallax__layer--base {
			padding: 0;
		}

		.community-day {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.community-background {
			display: contents;
		}

		.community-background picture:last-of-type {
			order: 3;
		}

		.community-background enhanced\:img {
			object-fit: cover;
			width: calc(100% + 2rem);
			height: 100%;
			margin-inline: -1rem;
		}

		.community-day .button {
			margin-inline: auto;
		}
	}

	@media screen and (width >= 800px) {
		.parallax :global(.hero) {
			z-index: 5;
		}

		.parallax :global(header) {
			z-index: 6;
		}

		.parallax {
			--parallax-height: 100vh;
			height: var(--parallax-height);
			overflow-x: hidden;
			overflow-y: auto;
			perspective: 300px;
			scroll-padding: 4.5rem;
		}

		.parallax section {
			position: relative;
			height: var(--parallax-height);
			transform-style: preserve-3d;
		}

		@supports (height: 100svh) {
			.parallax {
				--parallax-height: 100svh;
			}
		}

		.parallax__layer {
			position: absolute;
			inset: 0;
		}

		.parallax__layer--base {
			transform: translateZ(0);
			z-index: 4;
			background: #f8f6f2;
		}

		.parallax__layer--back {
			transform: translateZ(-300px) scale(2);
			z-index: 3;
			left: calc(100% - 100vw);
		}

		.parallax__layer--back enhanced\:img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		#about {
			z-index: 3;
		}

		#about .parallax__layer--base {
			right: 50%;
			background: rgba(var(--brand-stonewhite-rgb) / 80%);
			backdrop-filter: blur(10px);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			text-align: center;
			padding-inline: 3rem;
		}

		#about h2 {
			text-shadow: 2px 2px 3px var(--brand-stonewhite-color);
		}

		#events {
			z-index: 4;
		}

		.buttons {
			gap: 1rem;
		}

		#events .parallax__layer--base {
			box-shadow: 0 0 8px rgba(var(--brand-earthbrown-rgb) / 50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		#healing-center .parallax__layer--base {
			left: 60%;
			background: rgba(248 246 242 / 80%);
			backdrop-filter: blur(10px);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			text-align: justify;
			padding-inline: 6vw;
		}

		#visit {
			min-height: 840px;
		}

		#map {
			height: calc(100vh - 4.5rem);
		}

		#community-day,
		#visit,
		#follow-us {
			z-index: 3;
		}

		#healing-center,
		#kids-temple,
		#map {
			z-index: 2;
		}

		#kids-temple .parallax__layer--base {
			right: 60%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			text-align: justify;
			padding-inline: 6vw;
		}

		#kids-temple .parallax__layer--back enhanced\:img {
			position: absolute;
			width: 60%;
			left: 40%;
		}

		#visit .parallax__layer--base,
		#follow-us .parallax__layer--base {
			box-shadow: 0 0 8px rgba(var(--brand-earthbrown-rgb) / 50%);
		}

		#follow-us .parallax__layer--base,
		#testimonials .parallax__layer--base {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 5vh;
		}

		.heart-shape {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 90%;
			padding: 0 15% 12%;
			aspect-ratio: 1;
			background: var(--brand-parchment-color);
			/* FIXME: not working Firefox */
			clip-path: shape(from 50% 91%, line to 90% 50%, arc to 50% 9% of 1%, arc to 10% 50% of 1%);
		}

		.heart-shape h2 {
			line-height: 0.75;
		}

		.community-day {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			text-align: center;
			box-shadow: 0 0 8px rgba(var(--brand-earthbrown-rgb) / 50%);
		}

		.community-background :global(picture) {
			display: contents;
		}

		.community-day .button {
			margin-top: 0.75rem;
		}

		.heart-shadow {
			display: flex;
			align-items: flex-end;
			height: 90%;
			filter: drop-shadow(0 0 10px var(--brand-earthterracotta-color));
		}

		.community-background {
			position: absolute;
			inset: 0;
			display: flex;
			overflow: hidden;
		}

		.community-background::after {
			content: '';
			display: block;
			position: absolute;
			inset: 0;
			background: linear-gradient(
				to top,
				rgba(var(--brand-stonewhite-rgb) / 90%),
				rgba(var(--brand-stonewhite-rgb) / 50%) 15%,
				rgba(var(--brand-stonewhite-rgb) / 50%) 85%,
				rgba(var(--brand-stonewhite-rgb) / 90%)
			);
		}

		.community-background enhanced\:img {
			height: 100%;
			width: 50%;
			object-fit: cover;
		}
	}
</style>
