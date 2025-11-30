<script lang="ts">
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import { SiAirbnb } from '@icons-pack/svelte-simple-icons';

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
		gap: 16rem;
		align-items: center;
	}

	@media screen and (width < 800px) {
		.testimonials {
			display: flex;
			flex-direction: column-reverse;
			padding-bottom: 16rem;
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
		padding: 4rem;
		border-radius: 4rem;
		background: rgba(var(--brand-sandbeige-rgb) / 80%);
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
		border: 6rem solid transparent;
		border-top-color: rgba(var(--brand-sandbeige-rgb) / 80%);
	}

	.testimonials > div:first-of-type .bubble::after {
		right: 0;
		border-right-color: rgba(var(--brand-sandbeige-rgb) / 80%);
	}

	.testimonials > div:last-of-type .bubble::after {
		left: 0;
		border-left-color: rgba(var(--brand-sandbeige-rgb) / 80%);
	}

	blockquote {
		position: relative;
		padding-top: 6rem;
		margin: 0;
		font-size: 3.5rem;
		font-weight: 500;
		line-height: 5rem;
		letter-spacing: 0.5px;
	}

	blockquote::before {
		content: '\201D';
		position: absolute;
		top: -15rem;
		display: block;
		/* font-family: "Caveat", cursive; */
		font-size: 50rem;
		color: var(--brand-sagegrey-color);
		line-height: 1;
	}

	.testimonials > div:last-of-type blockquote::before {
		right: 0;
	}

	cite {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 3rem;
		padding-top: 3rem;
		border-top: 1px solid var(--brand-sagegrey-color);
		font-style: normal;
		font-size: 4rem;
	}

	.testimonials > div:first-of-type cite {
		text-align: right;
	}
</style>
