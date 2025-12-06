<script lang="ts">
	import SiFacebook from '@icons-pack/svelte-simple-icons/icons/SiFacebook';
	import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';
	import SiTelegram from '@icons-pack/svelte-simple-icons/icons/SiTelegram';
	import SiYoutube from '@icons-pack/svelte-simple-icons/icons/SiYoutube';
	import socialMediaData from '$lib/content/social-media.json';

	interface Props {
		platforms: string[];
	}

	const { platforms: platformNames }: Props = $props();
	const platforms = $derived(
		platformNames.map((name) => socialMediaData.platforms.find((it) => it.name === name)!)
	);

	const iconMap = new Map([
		['instagram', SiInstagram],
		['telegram', SiTelegram],
		['youtube', SiYoutube],
		['facebook', SiFacebook]
	]);
</script>

<!-- TODO: add hover animation https://dribbble.com/shots/26280182-Interactive-Social-Media-Section-Website-UI-Design -->
<div class="social-media">
	{#each platforms as platform (platform.name)}
		{@const Icon = iconMap.get(platform.name)}
		<a href={platform.link} target="_blank" class="social-media-button {platform.name} no-link">
			<div class="icon">
				<Icon size={30} title="" />
			</div>
			<h4>{platform.label}</h4>
			<p>{platform.description}</p>
		</a>
	{/each}
</div>

<style>
	.social-media {
		display: grid;
		padding-block: 5vh;
		text-align: left;
	}

	.social-media-button {
		padding: 4rem;
		border-radius: 4rem;
		background: rgba(var(--brand-sandbeige-rgb) / 80%);
		color: inherit;
		text-decoration: none;
	}

	h4 {
		font-weight: 600;
		margin-block: 2rem;
	}

	p {
		font-size: 3rem;
	}

	.social-media-button:global(.instagram) {
		--social-media-brand-color: #ff0169;
	}

	.social-media-button:global(.telegram) {
		--social-media-brand-color: #26a5e4;
	}

	.social-media-button:global(.youtube) {
		--social-media-brand-color: #ff0000;
	}

	.social-media-button:global(.facebook) {
		--social-media-brand-color: #0866ff;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10rem;
		aspect-ratio: 1;
		color: #fff;
		border-radius: 3rem;
		background: var(--social-media-brand-color);
	}

	.social-media-button:global(.instagram) .icon {
		background: linear-gradient(72.44deg, #ff7a00 11.92%, #ff0169 51.56%, #d300c5 85.69%);
	}

	@media (hover: hover) {
		.social-media-button:hover {
			color: #fff;
			background: var(--social-media-brand-color);
		}

		.social-media-button:hover .icon {
			color: var(--social-media-brand-color);
			background: #fff;
		}
	}

	@media screen and (width < 800px) {
		.social-media {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 4rem;
		}
	}

	@media screen and (width >= 800px) {
		.social-media {
			grid-template-columns: repeat(4, 200px);
			gap: 10rem;
		}
	}
</style>
