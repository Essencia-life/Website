<script lang="ts">
	import TallyForm from '$lib/components/organisms/TallyForm.svelte';
	import { Media } from '$lib/services/Media';
	import Slideshow from '$lib/components/molecules/Slideshow.svelte';
	import type { Photo } from '$lib/components/molecules/Slideshow.svelte';

	const tentPhotos: Photo[] = [
		{
			photo: 'media/accommodations/tent-5.jpg',
			caption: 'One of our glamping tents'
		},
		{
			photo: 'media/accommodations/tent-3.jpg',
			caption: 'One of our glamping tents'
		}
	];
</script>

<section class="hero dark">
	<h2>Offer your gifts.<br />Receive in kind.</h2>
	<h3>Volunteer at Essência</h3>
	<i>A season of meaningful work, healing, and community — in exchange for your time and skills.</i>
	<a class="button" href="#apply">Apply now</a>
</section>

<section>
	<div class="page-content">
		<h3>A genuine exchange — your skills and presence for a place to live, grow, and belong</h3>
		<p>
			We are a community of people who genuinely believe the world can be different — and who are
			committed to be part of the change. We live by love and abundance. We believe that how we live
			together is already the change. So we hold each other, and we build, sing, grow, cook, dance…
			and heal. As a family.
		</p>
		<p>
			When you come as a volunteer, you are joining our family. We open our hearts to each other,
			which means you will be part of the family even after you are gone. We honor your
			contributions, your gifts, your time, and your presence and we are grateful you want to come
			to Essência.
		</p>
		<p>
			In exchange, you get a home in nature, organic vegan food, and access to everything that makes
			life here so alive. The ideal commitment for your stay is 2 months — so you have time to land,
			and to connect deeply to yourself, to the beautiful souls who live here, and the nature of our
			land.
		</p>
	</div>
</section>

<section>
	<div class="page-content">
		<h3>What you receive</h3>
		<p>
			Every volunteer has their own private accommodation — a space to rest, reflect, and recharge.
			The kitchen is open and stocked with organic food throughout the day. And beyond the
			practical, you'll have real access to community life, practices, and the healing that this
			place quietly offers.
		</p>

		<div class="grid grid-cols-3 gap-4">
			<article class="card">
				<enhanced:img src={Media.getFile('media/morning-practice.jpg')} />
				<div class="card-content">
					<h4>Meditation & Morning practices</h4>
					<p>
						Start every day with the community — meditation, movement, breathwork. Open to all,
						every morning.
					</p>
				</div>
			</article>
			<article class="card">
				<enhanced:img src={Media.getFile('media/food.png')} />
				<div class="card-content">
					<h4>Organic food available</h4>
					<p>
						The community kitchen is at your disposal throughout the day — stocked with seasonal,
						organic, plant-based food. Gluten-free? We've got you covered.
					</p>
				</div>
			</article>
			<article class="card">
				<enhanced:img src={Media.getFile('media/ceremonie.jpg')} />
				<div class="card-content">
					<h4>Workshops & ceremonies</h4>
					<p>
						Full access to the events, workshops, and ceremonies that happen on the land — a living
						programme of healing and learning.
					</p>
				</div>
			</article>
			<article class="card">
				<enhanced:img src={Media.getFile('media/beach.jpg')} />
				<div class="card-content">
					<h4>Beach afternoons</h4>
					<p>
						The Atlantic is minutes away. Afternoons off are for the ocean — with the community, or
						on your own.
					</p>
				</div>
			</article>
			<article class="card">
				<enhanced:img src={Media.getFile('media/spa.jpg')} />
				<div class="card-content">
					<h4>SPA nights in nature</h4>
					<p>
						Open-air bathing, fire, and stillness under the stars — moments of deep rest woven into
						community life.
					</p>
				</div>
			</article>
			<article class="card">
				<enhanced:img src={Media.getFile('media/real-responsibility.jpg')} />
				<div class="card-content">
					<h4>Real responsibility</h4>
					<p>
						As you settle in, you can take ownership of a role or area — contributing with depth,
						not just hours.
					</p>
				</div>
			</article>
		</div>
	</div>
</section>

<section class="dark" style="padding-block: 16rem">
	<div class="page-content grid grid-cols-2 gap-10 overflow-visible!">
		<div
			style="display: flex; flex-direction: column; justify-content: space-between; padding-block: 8rem"
		>
			<div>
				<h3 style="margin-top: 0">Your own private space in nature</h3>
				<p>
					Depending on the season, you'll stay in one of our glamping tents — fully equipped,
					comfortable, and nestled in the land. Private and quiet: somewhere to come back to, rest
					deeply, and return to yourself.
				</p>
			</div>
			<div>
				<i>Available April to October · Subject to availability</i>
			</div>
		</div>
		<Slideshow
			photos={tentPhotos}
			classes={{
				gallery: 'rounded-[4rem] shadow-md',
				figure: 'rounded-[4rem]',
				caption: 'italic',
				image: 'aspect-3/2',
				indicators: 'absolute top-full inset-x-0'
			}}
		/>
	</div>
</section>

<section>
	<div class="page-content">
		<h3>What your day may look like.</h3>
		<div class="gallery grid grid-cols-3 gap-4">
			<figure>
				<enhanced:img src={Media.getFile('media/community-morning-practice.jpg')} />
				<figcaption>Morning practices with the community</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/photo_2025-10-21_21-15-23.jpg')} />
				<figcaption>Tending the land and garden</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/volunteer.jpg')} />
				<figcaption>Cooking together — seasonal, plant-based</figcaption>
			</figure>
			<figure>
				<enhanced:img
					src={Media.getFile('media/1909d5_9e82de9c58ca46f19ec6e211343d4228~mv2.jpg')}
				/>
				<figcaption>Beach afternoons with the community</figcaption>
			</figure>
			<figure>
				<enhanced:img src={Media.getFile('media/inner-work.jpg')} />
				<figcaption>Workshops & inner work</figcaption>
			</figure>
		</div>
	</div>
</section>

<section>
	<div class="page-content">
		<h3>Where you contribute.</h3>
		<p>
			Volunteers can focus on one branch of community life or move across several. We'll find the
			right fit together based on your skills, interests, and what the land needs.
		</p>
		<div class="my-8 grid grid-cols-3 gap-4">
			<article class="card card-content">
				<h4>🌱<br />Land & Garden</h4>
				<p>Permaculture, vegetable gardening, tending the soil and green spaces.</p>
			</article>
			<article class="card card-content">
				<h4>🍲<br />Community Kitchen</h4>
				<p>Preparing nourishing meals, maintaining the kitchen, seasonal cooking.</p>
			</article>
			<article class="card card-content">
				<h4>🏗️<br />Building & Infrastructure</h4>
				<p>Construction, maintenance, and natural building projects on the land.</p>
			</article>
			<article class="card card-content">
				<h4>🛏️<br />Spaces & Hospitality</h4>
				<p>Preparing and caring for guest accommodations, welcoming visitors, giving tours.</p>
			</article>
			<article class="card card-content">
				<h4>🎨<br />Art & Beautification</h4>
				<p>Painting, sculpting, crafts, and creating beauty in the shared spaces.</p>
			</article>
			<article class="card card-content">
				<h4>📸<br />Media & Communications</h4>
				<p>Photography, video, social media, and documenting community life.</p>
			</article>
		</div>
	</div>
</section>

<section class="secondary pb-12">
	<div class="page-content">
		<h3>The exchange — clear, reciprocal, no surprises.</h3>
		<p>Here is what we ask of you, and what Essência offers in return.</p>
		<div class="grid grid-cols-2 gap-8">
			<article>
				<h4>What you contribute</h4>
				<ul role="list" class="list-[&quot;–&quot;] pl-3 *:pl-3">
					<li>Around 24 hours of contribution per week in total</li>
					<ul class="list-[&quot;–&quot;] pl-6! *:px-3">
						<li>4 hours of community service, Monday to Friday</li>
						<li>4 additional hours per week <br />(afternoon, evening, or weekend)</li>
					</ul>
					<li>Attendance at 4 morning practices per week (Mon–Fri)</li>
					<li>Commitment to the shared values and Golden Agreements</li>
					<li>Ideally a commitment of 2 months</li>
				</ul>
			</article>
			<article>
				<h4>What you receive</h4>
				<ul role="list" class="list-[&quot;–&quot;] pl-3 *:pl-3">
					<li>Private accommodation (glamping tent or equivalent)</li>
					<li>
						Full access to the community kitchen — organic, seasonal, plant-based food available
					</li>
					<li>Morning practices — movement, breathwork, meditation</li>
					<li>Access to workshops, events, and ceremonies on the land</li>
					<li>SPA nights in nature and beach afternoons with the community</li>
					<li>The possibility to take on a role or area of real responsibility</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<section id="apply">
	<div class="page-content">
		<h3>How to apply.</h3>
		<ol role="list" class="steps mt-10 flex">
			<li>
				<div class="number"></div>
				<h4>Fill in the form</h4>
				<p>Share about yourself, your skills, and your intentions.</p>
			</li>
			<li>
				<div class="number"></div>
				<h4>We reach out</h4>
				<p>We'll email you to schedule a short call and align on dates.</p>
			</li>
			<li>
				<div class="number"></div>
				<h4>You arrive</h4>
				<p>Pack up, arrive with an open heart, and settle into your new home.</p>
			</li>
		</ol>
	</div>
</section>

<section>
	<div class="page-content">
		<h3>Ready to apply?</h3>
		We read every application with care. Take a moment to look through the page before filling in the
		form.
		<div class="form secondary mt-6 mb-12 rounded-[4rem] p-2">
			<TallyForm formId="jagZEJ" title="Volunteer Application Form" />
		</div>
	</div>
</section>

<style>
	section + section {
		margin-top: 10rem;
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-block: 10rem;
	}

	.hero h3 {
		order: -1;
		font-size: 3rem;
		font-weight: 700;
		letter-spacing: 2px;
		text-transform: uppercase;
		margin: 0;
		opacity: 0.7;
	}

	.hero h2 {
		margin-block: 4rem;
	}

	.hero .button {
		margin-top: 10rem;
	}

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
		border-radius: 4rem;
		overflow: hidden;
	}

	.gallery figcaption {
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		padding: 8rem 4rem 4rem;
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
		border-radius: 4rem;
		overflow: hidden;
	}

	enhanced\:img {
		max-width: 100%;
		height: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	.card-content {
		padding: 4rem;
	}

	.card-content h4,
	.card-content p {
		margin: 0;
	}

	.steps li {
		display: flex;
		flex-direction: column;
		counter-increment: list;
		text-align: center;
	}

	.steps li .number {
		height: 10rem;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.steps li .number::before {
		content: '';
		position: absolute;
		inset: 50% 0 auto 0;
		border-bottom: 2px solid var(--brand-border-color);
	}

	.steps li .number::after {
		content: counter(list);
		display: flex;
		align-items: center;
		justify-content: center;
		height: inherit;
		aspect-ratio: 1;
		border: 2px solid var(--brand-border-color);
		border-radius: 100%;
		background: var(--brand-background-color);
		font-family: Alegreya;
		font-weight: 600;
		color: var(--brand-primary-color);
		z-index: 1;
	}

	.steps li p {
		margin-inline: 16px;
	}
</style>
