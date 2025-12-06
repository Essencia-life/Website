<script lang="ts">
	import footerData from '$lib/content/footer.json';
	import socialMediaData from '$lib/content/social-media.json';

	import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';
	import SiTelegram from '@icons-pack/svelte-simple-icons/icons/SiTelegram';
	import SiYoutube from '@icons-pack/svelte-simple-icons/icons/SiYoutube';
	import SiFacebook from '@icons-pack/svelte-simple-icons/icons/SiFacebook';
	import { Mail } from '@lucide/svelte';

	const platforms = $derived(
		footerData.platforms.map((name) => socialMediaData.platforms.find((it) => it.name === name)!)
	);

	const iconMap = new Map([
		['instagram', SiInstagram],
		['telegram', SiTelegram],
		['youtube', SiYoutube],
		['facebook', SiFacebook]
	]);
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
					{#each platforms as platform, index (platform.name)}
						{@const Icon = iconMap.get(platform.name)}
						<a
							href={platform.link}
							target="_blank"
							aria-label={platform.label}
							class="hint--rounded no-link"
							class:hint--top-right={index === 0}
							class:hint--top={index > 0}><Icon title="" /></a
						>
					{/each}
					<!-- TODO: Add Newsletter to social media platforms ? -->
					<a href="/#newsletter" aria-label="Newsletter" class="hint--top hint--rounded no-link"
						><Mail /></a
					>
				</div>
			</div>
			{#each footerData.links as group (group)}
				<div class="link-group">
					{#each group as link (link.page)}
						<a href={link.page}>{link.label}</a>
					{/each}
				</div>
			{/each}
		</div>

		<div class="content">
			<small class="copyright"
				>&copy; {new Date().getFullYear()} &middot; Essência Nature Retreat &middot; Aljezur &middot;
				Portugal</small
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
