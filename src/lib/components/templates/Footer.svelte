<script lang="ts" module>
	import type { CollectionFile, Field } from '@sveltia/cms';

	const labelAndLinkFields: Field[] = [
		{ name: 'label', label: 'Label' },
		{
			name: 'link',
			label: 'Link'
			// widget: 'relation',
			// collection: 'pages',
			// search_fields: ['title'],
			// value_field: '/{{slug}}',
			// display_fields: ['title']
		}
	];

	export const footerCmsConfig: CollectionFile = {
		name: 'footer',
		label: 'Page Footer',
		icon: 'page_footer',
		file: 'src/lib/content/footer.json',
		fields: [
			{
				name: 'cta',
				label: 'CTA Button',
				widget: 'object',
				fields: [...labelAndLinkFields]
			},
			{
				name: 'social_media',
				label: 'Social Media Platforms',
				label_singular: 'Platform',
				widget: 'list',
				field: {
					name: 'platform',
					label: 'Platform'
					// widget: 'relation',
					// collection: 'social_media',
					// search_fields: ['label'],
					// value_field: 'name',
					// display_fields: ['label']
				}
			},
			{
				name: 'links',
				label: 'Footer Links',
				label_singular: 'Group',
				widget: 'list',
				min: 3,
				max: 3,
				fields: [
					{
						name: 'group',
						label: 'Group',
						widget: 'list',
						fields: [...labelAndLinkFields]
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import footerData from '$lib/content/footer.json';
	import socialMediaData from '$lib/content/social-media.json';

	import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';
	import SiTelegram from '@icons-pack/svelte-simple-icons/icons/SiTelegram';
	import SiYoutube from '@icons-pack/svelte-simple-icons/icons/SiYoutube';
	import SiFacebook from '@icons-pack/svelte-simple-icons/icons/SiFacebook';
	import { titleSuffix } from '$lib/config';

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
		<enhanced:img src="$lib/assets/media/footer.png" alt="Essência forest skyline" loading="lazy" />
	</div>
	<div class="footer-content">
		<div class="page-content grid">
			<div class="first-column">
				<div>
					<a href={footerData.cta.page} class="button button-primary">{footerData.cta.label}</a>
				</div>

				<div class="social-media">
					{#each platforms as platform (platform.name)}
						{@const Icon = iconMap.get(platform.name)}
						<a href={platform.link} target="_blank" aria-label={platform.label} class="no-link">
							<Icon title="" />
						</a>
					{/each}
					<!-- TODO: Add Newsletter to social media platforms ? -->
					<!--					<a href="/#newsletter" aria-label="Newsletter" class="no-link"-->
					<!--						><Mail /></a-->
					<!--					>-->
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

		<div class="page-content">
			<small class="copyright">&copy; {new Date().getFullYear()} {titleSuffix}</small>
		</div>
	</div>
</footer>

<style>
	footer {
		font-size: 1rem;
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
			var(--brand-dark-section-color) 5%,
			rgba(var(--brand-dark-section-rgb) / 0) 60%
		);
	}

	.footer-content {
		background: var(--brand-dark-section-color);
	}

	.page-content {
		color: var(--brand-parchment-color);
	}

	.grid {
		display: grid;
		gap: 1rem;
	}

	.first-column {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	@media screen and (width >= 800px) {
		.grid {
			min-height: 8rem;
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
		gap: 0.75rem;
		align-items: center;
		opacity: 0.75;
	}

	.link-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.copyright {
		display: block;
		border-top: 1px solid var(--brand-parchment-color);
		text-align: center;
		margin-top: 1rem;
		padding-block: 0.5rem;
		color: var(--brand-parchment-color);
	}
</style>
