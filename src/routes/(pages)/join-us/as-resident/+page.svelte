<script lang="ts">
	import TallyForm from '$lib/components/organisms/TallyForm.svelte';
	import { Media } from '$lib/services/Media';
	import YouTube from '$lib/components/organisms/YouTube.svelte';
	import StepList from '$lib/components/molecules/StepList.svelte';
	import SEO from '$lib/components/atoms/SEO.svelte';
	import { page } from '$app/state';

	let howToApplySection: HTMLElement;

	function scrollToApply(event: MouseEvent) {
		if (howToApplySection) {
			event.preventDefault();
			howToApplySection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<SEO
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Residency',
		description: 'Learn what it means and needs to become a resident at Essência',
		url: `https://${page.data.VERCEL_PROJECT_PRODUCTION_URL}${page.url.pathname}`
	}}
/>

<section class="dark flex flex-col items-center gap-4 px-4 py-16 text-center">
	<sup>Residency at Essência</sup>
	<h2 class="mb-4">This is a place<br /> to put down roots.</h2>
	<i>Not just a home — a commitment to land, community, and a way of life.</i>
	<a class="button mt-10" href="#apply" onclick={scrollToApply}>Get in touch</a>
</section>

<section class="pt-16">
	<div class="page-content">
		<sup>What Residency Means</sup>
		<h3 class="mt-2 mb-6">More than a place to live</h3>
		<p>
			Becoming a resident at Essência means becoming a member of the cooperative — an important
			co-steward of the land. You're not renting; you're joining a living project, with real
			ownership, shared governance, and legal agreements that protect you and the community alike.
		</p>
		<p>
			This is a commitment to self-reflection, self-discovery, healing and growing proactively.
			Residents can be full-time or part-time depending on their life situation — you can build your
			own home here, raise your children, grow a business, or keep work outside, as long as you show
			up for the community and your commitments. Every resident contributes a few hours a week to
			shared life; families and our ecovillage's maintenance needs are supported with flexibility.
		</p>
		<p>
			This is a long-term commitment — and it can also end. If the time comes to move on, the
			cooperative structure ensures a fair, legally supported exit process.
		</p>

		<YouTube
			id="Ow-X1jZLZ64"
			title="Video about Essência on Youtube"
			class="mx-auto my-16 w-full rounded-xl bg-gray-300 shadow-xl/40 max-md:min-h-[50vw] lg:min-h-128"
			loading="lazy"
		/>
	</div>
</section>

<section class="py-16">
	<div class="page-content">
		<sup>What We Ask</sup>
		<h3 class="mt-2 mb-6">Who thrives here</h3>
		<p>
			Essência is not for everyone — and that's by design. The people who thrive here are ready to
			live by shared values, contribute to shared life, and do the inner work that community living
			asks of you: physically, emotionally, mentally, energetically, and spiritually.
		</p>
		<div class="mt-8 grid gap-4 md:grid-cols-2">
			<article class="card card-content">
				<h4>Live the values</h4>
				<p>
					Honest communication, non-harm, radical ownership, the heart path — not as rules, but as a
					daily practice.
				</p>
			</article>
			<article class="card card-content">
				<h4>Show up for community</h4>
				<p>
					A few hours of shared work each week — tending the land, cooking, building, holding space.
					Families are supported with flexibility.
				</p>
			</article>
			<article class="card card-content">
				<h4>Full-time or part-time</h4>
				<p>
					Residency adapts to your life. Keep a job, build a business, travel — as long as you
					remain connected and committed.
				</p>
			</article>
			<article class="card card-content">
				<h4>Long-term intention</h4>
				<p>
					We're building something for generations. We look for people ready to invest in a place,
					not just pass through it.
				</p>
			</article>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="page-content text-center">
		<sup>Daily Life</sup>
		<h3 class="mt-2 mb-10">What life looks like here</h3>

		<div class="gallery grid gap-6 text-left md:grid-cols-3 md:gap-4">
			<figure>
				<enhanced:img src={Media.getFile('media/community-morning-practice.jpg')} />
				<figcaption>Morning practices — stillness, breathwork, conscious movement</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/resident.jpg')} />
				<figcaption>Nourishing food, shared at the table</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/3910838682479597506.jpg')} />
				<figcaption>Build your own home on the land</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/inner-work.jpg')} />
				<figcaption>Heal, grow, and evolve together</figcaption>
			</figure>
			<figure>
				<enhanced:img
					src={Media.getFile('media/151345_e6a25dbd04ec4903bebb0b4326a3c446~mv2.jpg')}
				/>
				<figcaption>Nature, open skies, and slow living</figcaption>
			</figure>
		</div>
	</div>
</section>

<section class="secondary py-16 text-center">
	<div class="page-content">
		<sup>Our Values</sup>
		<h3 class="mt-2 mb-6">The foundations we live by</h3>
		<ul class="inline-list">
			<li>Inner work & self-awareness</li>
			<li>Honesty</li>
			<li>Radical ownership</li>
			<li>Love & compassion</li>
			<li>Forgiveness</li>
			<li>Benevolent communication</li>
			<li>High on life</li>
			<li>Ahimsa</li>
			<li>Service & purpose</li>
			<li>Ecological stewardship</li>
			<li>Shared governance</li>
		</ul>
	</div>
</section>

<section class="dark py-8">
	<div class="page-content">
		<ul class="mb-8 flex flex-wrap gap-8">
			<li class="border-white/50 pr-8 md:border-r">
				<b class="mb-1 block font-serif text-3xl leading-none font-bold"> €75,000 </b>
				<i class="text-sm">loan to the coop · single</i>
			</li>
			<li class="border-white/50 pr-8 md:border-r">
				<b class="mb-1 block font-serif text-3xl leading-none font-bold"> €111,000 </b>
				<i class="text-sm">for couples & families</i>
			</li>
			<li>
				<b class="mb-1 block font-serif text-3xl leading-none font-bold">
					€222<span class="text-base">/mo</span>
				</b>
				<i class="text-sm">contribution, per adult</i>
			</li>
		</ul>

		<p>
			Reimbursed within 1 year of your request, after a minimum 3-year hold. The full budget is
			reviewed and adopted together each year at General Assembly.
		</p>

		<hr class="opacity-50" />

		<p>
			You choose the structure you build — yurt, tiny house, tent, dome, or clay house — in
			coordination with the cooperative's guidelines, and may rent it out when you're away. Full
			financial details and legal documents are shared once we've had a first conversation and
			confirmed mutual interest.
		</p>
	</div>
</section>

<section class="py-16" id="apply" bind:this={howToApplySection}>
	<div class="page-content">
		<sup>The Practical Path</sup>
		<h3 class="mt-2 mb-6">How it works</h3>

		<StepList
			items={[
				{
					title: 'Reach out',
					description:
						"Write to us. We'll send an application form and, if it's a fit, schedule a short intro call."
				},
				{
					title: 'Visit the land',
					description:
						'Come and feel it — as a guest or volunteer. At least 3 weeks recommended; most take 3 months to decide.'
				},
				{
					title: 'Letter of intent',
					description: 'If it feels right on both sides, we begin the formal process together.'
				},
				{
					title: 'Welcome home',
					description: 'Sign, join the cooperative, and start building your life here.'
				}
			]}
		/>
	</div>
</section>

<section class="py-16 text-center">
	<div class="page-content">
		<h3 class="my-4">Start the conversation</h3>
		<p>No commitment, no pressure — just a first hello. We read every message personally.</p>
		<div class="form secondary mt-12 rounded-2xl p-2">
			<TallyForm formId="lb20MB" title="Residency Application Form" />
		</div>
	</div>
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--brand-dark-section-color);
		color: var(--brand-stonewhite-color);
	}

	.dark h2,
	.dark h3 {
		color: var(--brand-stonewhite-color);
	}

	.dark .button {
		border-color: var(--brand-stonewhite-color);
		color: var(--brand-stonewhite-color);
	}

	.secondary {
		background: var(--brand-parchment-color);
	}

	.gallery figure {
		position: relative;
		margin: 0;
		border-radius: 1rem;
		overflow: hidden;
	}

	.gallery figcaption {
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		padding: 2rem 1rem 1rem;
		background: linear-gradient(to top, rgba(0 0 0 / 70%), rgba(0 0 0 / 0));
		color: var(--brand-stonewhite-color);
		font-style: italic;
		font-weight: 400;
	}

	.gallery figure:first-of-type {
		grid-row: span 2;
	}

	.gallery figure:first-of-type enhanced\:img {
		aspect-ratio: auto;
		height: 100%;
		width: 100%;
	}

	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--brand-border-color);
		border-radius: 1rem;
		overflow: hidden;
	}

	enhanced\:img {
		max-width: 100%;
		height: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	.card-content {
		padding: 1rem;
	}

	.card-content h4,
	.card-content p {
		margin: 0;
	}
</style>
