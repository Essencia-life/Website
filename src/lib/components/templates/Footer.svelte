<script>
	import { asset } from '$app/paths';
	import footerData from '$lib/content/footer.json';

	import { Facebook, Instagram, Mail, Send as Telegram } from '@lucide/svelte';
</script>

<footer>
	<div class="background">
		<enhanced:img src="/static/media/footer.png" alt="Essência forest skyline" loading="lazy" />
	</div>
	<div style="background-color: var(--brand-mossgreen-color)">
		<div class="content grid">
			<div class="first-column">
				<div>
					<a href={footerData.cta.page} class="button button-overlay">{footerData.cta.label}</a>
				</div>

				<div class="social-media">
					<a
						href="https://www.instagram.com/essencia_natureretreat"
						target="_blank"
						aria-label="Instagram"
						class="hint--top hint--rounded no-link"><Instagram /></a
					>
					<a
						href="https://www.facebook.com/pg/essencianatureretreat"
						target="_blank"
						aria-label="Facebook"
						class="hint--top hint--rounded no-link"><Facebook /></a
					>
					<a
						href="https://t.me/essencia_natureretreat"
						target="_blank"
						aria-label="Telegram"
						class="hint--top hint--rounded no-link"><Telegram /></a
					>
					<a href="/#newsletter" aria-label="Newsletter" class="hint--top hint--rounded no-link"
						><Mail /></a
					>
				</div>
			</div>
			{#each footerData.links as group}
				<div class="link-group">
					{#each group as link}
						<a href={link.page}>{link.label}</a>
					{/each}
				</div>
			{/each}
		</div>

		<div class="content">
			<small class="copyright"
				>&copy; 2025 &middot; Essência Nature Retreat &middot; Aljezur &middot; Portugal</small
			>
		</div>
	</div>
</footer>

<style>
	footer {
		font-size: 4rem;
	}

	footer a {
		color: inherit;
		text-decoration: none;
	}

	.background {
		position: relative;
	}

	.background enhanced\:img {
		width: 100%;
		height: auto;
	}

	.background::after {
		content: '';
		position: absolute;
		inset: 0;
		display: block;
		background: linear-gradient(
			to top,
			var(--brand-mossgreen-color) 5%,
			rgba(var(--brand-mossgreen-rgb) / 0) 60%
		);
	}

	.content {
		color: var(--brand-sandbeige-color);
	}

	.grid {
		display: grid;
		gap: 4rem;
	}

	.first-column {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	@media screen and (width >= 800px) {
		.grid {
			min-height: 32rem;
			grid-template-columns: repeat(4, 1fr);
		}

		.first-column {
			flex-direction: column;
		}
	}

	@media screen and (width < 800px) {
		.grid {
			grid-template-rows: repeat(4, auto);
		}
	}

	.social-media {
		display: flex;
		gap: 3rem;
		align-items: center;
		opacity: 0.75;
	}

	.link-group {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.copyright {
		display: block;
		border-top: 1px solid var(--brand-sagegrey-color);
		text-align: center;
		margin-top: 4rem;
		padding-block: 2rem;
		color: var(--brand-sagegrey-color);
	}
</style>
