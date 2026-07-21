<script lang="ts">
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import SiAirbnb from '@icons-pack/svelte-simple-icons/icons/SiAirbnb';

	interface Testimonial {
		quote: string;
		cite: string;
		link: string;
		platform: string;
	}

	interface Props {
		testimonials: Testimonial[];
	}

	const { testimonials }: Props = $props();

	const iconPlatformMap = new Map([['Airbnb', SiAirbnb]]);
</script>

<div class="testimonials">
	{#each testimonials as testimonial}
		{@const Icon = iconPlatformMap.get(testimonial.platform)}
		<div>
			<div class="bubble">
				<blockquote>
					<Markdown content={testimonial.quote} />
				</blockquote>
				<cite>
					{testimonial.cite}
					{#if Icon}
						<a href={testimonial.link} target="_blank" class="icon">
							<Icon size={16} title="Show review on {testimonial.platform}" />
						</a>
					{/if}
				</cite>
			</div>
		</div>
	{/each}
</div>

<style>
	.testimonials {
		gap: 4rem;
		align-items: center;
	}

	@media screen and (width < 800px) {
		.testimonials {
			display: flex;
			flex-direction: column-reverse;
			padding-bottom: 4rem;
		}
	}

	@media screen and (width >= 800px) {
		.testimonials {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}

	.testimonials > div {
		max-width: 420px;
	}

	.bubble {
		position: relative;
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(var(--brand-parchment-rgb) / 80%);
		text-align: justify;
	}

	.testimonials > div:first-of-type {
		justify-self: end;
	}

	.testimonials > div:last-of-type {
		justify-self: start;
	}

	.testimonials > div:first-of-type .bubble {
		border-bottom-right-radius: 0;
	}

	.testimonials > div:last-of-type .bubble {
		border-bottom-left-radius: 0;
	}

	.testimonials > div .bubble::after {
		content: '';
		position: absolute;
		top: 100%;
		border: 1.5rem solid transparent;
		border-top-color: rgba(var(--brand-parchment-rgb) / 80%);
	}

	.testimonials > div:first-of-type .bubble::after {
		right: 0;
		border-right-color: rgba(var(--brand-parchment-rgb) / 80%);
	}

	.testimonials > div:last-of-type .bubble::after {
		left: 0;
		border-left-color: rgba(var(--brand-parchment-rgb) / 80%);
	}

	blockquote {
		position: relative;
		padding-top: 1.5rem;
		margin: 0;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.25rem;
		letter-spacing: 0.5px;
	}

	blockquote::before {
		content: '\201D';
		position: absolute;
		top: -5rem;
		display: block;
		font-family: Alegreya, serif;
		font-size: 12.5rem;
		color: var(--brand-highlight-color);
		line-height: 1;
	}

	.testimonials > div:last-of-type blockquote::before {
		right: 0;
	}

	cite {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--brand-border-color);
		font-style: normal;
		font-size: 1rem;
	}

	.testimonials > div:first-of-type cite {
		text-align: right;
	}
</style>
