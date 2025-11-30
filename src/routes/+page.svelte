<script lang="ts">
	import homeData from '$lib/content/home.json';
	import Hero from './Hero.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Events from './Events.svelte';
	import Accommodations from './Accommodations.svelte';
	import Map from './Map.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import SocialMedia from './SocialMedia.svelte';
	import NewsletterForm from '$lib/components/organisms/NewsletterForm.svelte';
	import Testimonials from './Testimonials.svelte';
	import { Media } from '$lib/services/Media.js';

	let heroIsVisible = $state(true);
</script>

<svelte:head>
	<title>Essência Nature Retreat &middot; Aljezur &middot; Portugal</title>
</svelte:head>

<div class="parallax" id="parallax">
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

					<Events />

					<div class="buttons">
						{#each section.buttons as button (button)}
							<a href={button.link} class="button">{button.label}</a>
						{/each}
					</div>
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
					<div class="content" style="padding-top: 4rem">
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

					<SocialMedia />

					<h3 id="newsletter">Newsletter</h3>

					<NewsletterForm />
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
		margin-block: 4rem;
	}

	.buttons {
		display: flex;
	}

	@media screen and (width < 800px) {
		.parallax {
			overflow-x: hidden;
		}

		section {
			position: relative;
			display: flex;
			flex-direction: column;
			min-height: 80vh;
		}

		.parallax__layer--base {
			display: flex;
			flex-direction: column;
			padding: 4rem;
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
			margin: 6rem auto;
		}

		#events .button {
			margin-block: 3rem;
		}

		.buttons {
			flex-direction: column;
			margin-bottom: 6rem;
		}

		#healing-center {
			display: flex;
			flex-direction: column-reverse;
		}

		#visit .parallax__layer--base {
			padding: 0;
		}

		.community-background {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.community-background enhanced\:img {
			object-fit: cover;
			width: 100%;
			height: 100%;
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
			height: 100vh;
			overflow-x: hidden;
			overflow-y: auto;
			perspective: 300px;
			scroll-padding: 18rem;
			scroll-behavior: smooth;
		}

		.parallax section {
			position: relative;
			height: 100vh;
			transform-style: preserve-3d;
		}

		@supports (height: 100svh) {
			.parallax,
			.parallax section {
				height: 100svh;
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
		}

		#about h2 {
			text-shadow: 2px 2px 3px var(--brand-stonewhite-color);
		}

		#events {
			z-index: 4;
		}

		.buttons {
			gap: 4rem;
		}

		#events .parallax__layer--base {
			box-shadow: 0 0 8px rgba(var(--brand-darkbrown-rgb) / 50%);
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
			min-height: 960px;
		}

		#map {
			height: calc(100vh - 18rem);
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
			box-shadow: 0 0 8px rgba(var(--brand-darkbrown-rgb) / 50%);
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
			background: var(--brand-sandbeige-color);
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
			box-shadow: 0 0 8px rgba(var(--brand-darkbrown-rgb) / 50%);
		}

		.community-background :global(picture) {
			display: contents;
		}

		.community-day .button {
			margin-top: 3rem;
		}

		.heart-shadow {
			display: flex;
			align-items: flex-end;
			height: 90%;
			filter: drop-shadow(0 0 10px var(--brand-terracotta-color));
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
