<script lang="ts">
	import homeData from '$lib/content/home.json';

	import { Media } from '$lib/services/Media';

	import SEO from '$lib/components/atoms/SEO.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

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

<Hero visibilityChange={(visible) => (heroIsVisible = visible)} />

<Header menuAbove={heroIsVisible} />

{#each homeData.sections as section (section.id)}
	<section
		id={section.id}
		class="relative flex overflow-x-hidden not-last-of-type:shadow-lg {section.id === 'about'
			? 'flex-col-reverse lg:flex-row-reverse'
			: section.id === 'healing-center'
				? 'flex-col lg:flex-row-reverse'
				: 'flex-col lg:flex-row'} {section.type === 'picture'
			? 'lg:max-h-96 lg:overflow-hidden'
			: 'min-h-[90vh]'}"
	>
		{#if section.type === 'text'}
			{#if section.photo}
				<!-- TODO: define sizes -->
				<!-- TODO: provide alt from CMS? -->
				<enhanced:img
					src={Media.getFile(section.photo)}
					alt=""
					loading="lazy"
					class="lg:h-full lg:object-cover"
				/>
			{/if}
			<div
				class="flex flex-col p-4 lg:w-[50%] lg:max-w-[60%] lg:min-w-[32rem] lg:justify-center lg:gap-16 lg:px-16"
			>
				<div>
					<h2 class="text-center">{section.headline}</h2>
					{#if section.content}
						<Markdown content={section.content} />
					{/if}
				</div>

				{#if section.button}
					<a href={section.button.link} class="button button-primary mx-auto my-6">
						{section.button.label}
					</a>
				{/if}
			</div>
		{:else if section.type === 'picture' && section.photo}
			<enhanced:img
				src={Media.getFile(section.photo)}
				alt=""
				loading="lazy"
				class="lg:h-full lg:object-cover"
			/>
		{:else if section.type === 'events'}
			<div class="flex flex-col p-4 lg:container lg:mx-auto">
				<h2 class="text-center">{section.headline}</h2>

				<Events {lastEventsScrollPosition} />

				{#if section.button}
					<a href={section.button.link} class="button button-primary mx-auto my-6">
						{section.button.label}
					</a>
				{/if}
			</div>
		{:else if section.type === 'community-day'}
			<!-- TODO: rethink design to fit better between sections -->
			<div
				class="relative flex flex-col max-sm:gap-3 lg:h-[1000px] lg:w-full lg:items-center lg:justify-center"
			>
				<div
					class="inset-0 overflow-hidden max-md:contents lg:absolute lg:grid lg:grid-cols-2 max-md:[&_img]:last-of-type:order-3 lg:[&_img]:h-full lg:[&_img]:w-full lg:[&_img]:object-cover"
				>
					<enhanced:img src={Media.getFile(section.photos![0])} alt="" loading="lazy" />
					<enhanced:img src={Media.getFile(section.photos![1])} alt="" loading="lazy" />
				</div>
				<div
					class="heart-shape text-center max-md:p-4 lg:z-10 lg:flex lg:aspect-square lg:h-[70%] lg:bg-white lg:px-16 lg:pt-16"
				>
					<div>
						<h2>{section.headline}</h2>
						{#if section.content}
							<Markdown content={section.content} />
						{/if}

						{#if section.button}
							<a href={section.button.link} class="button lg:mt-4">
								{section.button.label}
							</a>
						{/if}
					</div>
				</div>
			</div>
		{:else if section.type === 'accommodations'}
			<div class="flex flex-col lg:container lg:mx-auto">
				<div class="flex-col items-center pt-8 text-center lg:flex">
					<h2>{section.headline}</h2>
					{#if section.content}
						<Markdown content={section.content} />
					{/if}

					<Accommodations />
				</div>
			</div>
		{:else if section.type === 'map'}
			<div class="flex min-h-[90vh] flex-col p-4">
				<Map />
			</div>
		{:else if section.type === 'social-media'}
			<div class="mx-auto flex flex-col p-4">
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
			<div class="mx-auto flex flex-col p-4">
				<h2 class="mb-16! text-center">{section.headline}</h2>
				<Testimonials testimonials={section.items!} />
			</div>
		{:else}
			<pre>{JSON.stringify(section, null, 2)}</pre>
		{/if}
	</section>
{/each}

<Footer />

<style>
	@media (width >= 64rem) {
		.heart-shape {
			/* FIXME: not working Firefox */
			clip-path: shape(from 50% 91%, line to 90% 50%, arc to 50% 9% of 1%, arc to 10% 50% of 1%);
		}
	}
</style>
