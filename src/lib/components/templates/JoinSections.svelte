<script>
	import { Media } from '$lib/services/Media';
	import { resolve } from '$app/paths';
</script>

<div class="join-us">
	<h2>You are welcome here</h2>

	<p><i>This is more than an invitation — it's a calling</i></p>

	<p>
		There are many ways to belong to Essência. Whether you're ready to put down roots, offer your
		hands for a season, or simply support what's growing here — there's a place for you.
	</p>
</div>
<section>
	<div class="card">
		<enhanced:img src={Media.getFile('media/resident.jpg')} />
		<article>
			<h3>Become a Resident</h3>
			<h4>Put down roots</h4>
			<p>
				Live on the land, share meals, and co-create a way of life that is regenerative and deeply
				alive. Residency is a commitment — to the community, and to your own becoming. Available
				full-time or part-time, depending on where you are in life.
			</p>
			<dl>
				<dd>Heal & grow</dd>
				<dd>Morning practices</dd>
				<dd>Community</dd>
				<dd>Build your home</dd>
				<dd>Life in nature</dd>
			</dl>
			<a href="mailto:ola@essencia.life" class="button button-primary"> Explore residency </a>
		</article>
	</div>
	<div class="card">
		<enhanced:img src={Media.getFile('media/volunteer.jpg')} />
		<article>
			<h3>Volunteer with Us</h3>
			<h4 class="ambergold">Offer your gifts</h4>
			<p>
				Join us for a season of meaningful work. Choose one area or immerse in all. In return,
				receive nourishment, a place to rest, and space to heal and grow.
			</p>
			<dl>
				<dd>Heal & grow</dd>
				<dd>Morning practices</dd>
				<dd>Community</dd>
				<dd>Land & garden</dd>
				<dd>Building</dd>
				<dd>Cooking</dd>
				<dd>Spaces & accommodations</dd>
			</dl>
			<a href={resolve('/join-us/as-volunteer')} class="button button-ambergold">
				Bring in your gifts
			</a>
		</article>
	</div>
	<div class="card">
		<enhanced:img src={Media.getFile('media/friend.jpg')} />
		<article>
			<h3>Become a Friend</h3>
			<h4 class="oceanteal">Support what grows</h4>
			<p>
				Believe in what we're building? Support Essência and receive gifts from the land — from a
				tree planted in your name to a weekend in our glamping. A way to belong, wherever you are.
			</p>
			<dl>
				<dd>Heal & grow</dd>
				<dd>Morning practices</dd>
				<dd>Community</dd>
				<dd>Gifts from the land</dd>
				<dd>Retreat access</dd>
				<dd>Glamping stays</dd>
			</dl>
			<a href="mailto:ola@essencia.life" class="button button-oceanteal"> Support the dream </a>
		</article>
	</div>
</section>

<style>
	.join-us {
		text-align: center;
	}

	@media screen and (width >= 800px) {
		section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
			margin-block: 2rem;
		}
	}

	@media screen and (width >= 960px) {
		section {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--brand-border-color);
		border-radius: 1rem;
		overflow: hidden;
		margin-block: 2.5rem;
		transition:
			border-color 0.3s,
			transform 0.3s;
	}

	.card p {
		text-align: justify;
	}

	.card .button {
		margin-inline: auto;
	}

	@media (hover: hover) {
		.card:hover {
			border-color: rgba(var(--brand-primary-rgb) / 45%);
			transform: translateY(-3px);
		}
	}

	enhanced\:img {
		max-width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	article {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin: 1.5rem;
		gap: 0.75rem;
	}

	h4 {
		order: -1;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 2px;
		text-transform: uppercase;
		margin: 0;
		color: var(--brand-mossgreen-color);
	}

	h4.ambergold {
		color: var(--brand-ambergold-color);
	}

	h4.oceanteal {
		color: var(--brand-oceanteal-color);
	}

	h3 {
		margin: 0 0 0.25rem 0;
	}

	p {
		margin: 0 0 0.75rem 0;
	}

	dl {
		line-height: 1.8;
		font-size: 0.75rem;
		margin: auto 0 0.75rem;
	}

	dd {
		display: inline;
		margin: 0;
		white-space: nowrap;
	}

	dd:not(:last-of-type)::after {
		content: ' —';
	}
</style>
