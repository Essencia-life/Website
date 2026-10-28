<script lang="ts" module>
	import type { CollectionFile, Field } from '@sveltia/cms';

	const labelAndLinkFields: Field[] = [
		{ name: 'label', label: 'Label' },
		{
			name: 'link',
			label: 'Link',
			widget: 'relation',
			collection: 'pages',
			value_field: '/{{slug}}',
		}
	];

	export const footerCmsConfig: CollectionFile = {
		name: 'footer',
		label: 'Page Footer',
		icon: 'page_footer',
		file: 'src/lib/content/footer.json',
		editor: { preview: false },
		fields: [
			{
				name: 'cta',
				label: 'CTA Button',
				widget: 'object',
				fields: [...labelAndLinkFields]
			},
			{
				name: 'platforms',
				label: 'Social Media Platforms',
				label_singular: 'Platform',
				widget: 'relation',
				collection: '_singletons',
				file: 'social_media',
				value_field: '{{platforms.*.name}}',
				display_fields: ['platforms.*.label'],
				multiple: true
			},
			{
				name: 'links',
				label: 'Footer Links',
				label_singular: 'Group',
				widget: 'list',
				min: 3,
				max: 3,
				field: {
					name: 'group',
					label: 'Link',
					widget: 'list',
					required: false,
					root: true,
					fields: [...labelAndLinkFields]
				}
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
	import Image from '$lib/components/atoms/Image.svelte';
	import footerImage from '$lib/assets/media/footer.png?as=run:0';

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

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<footer class="-mt-34">
	<div class="relative">
		<Image src={footerImage} alt="Essência forest skyline" loading="lazy" class="w-full h-auto" />
		<div class="absolute inset-0 bg-linear-to-t from-olive-800 from-5% to-olive-800/0 to-60%"></div>
	</div>
	<div class="bg-olive-800">
		<div class="page-content grid gap-4 text-stone-100 md:grid-cols-4 md:min-h-32">
			<div class="flex flex-row-reverse justify-between md:flex-col">
				<div>
					<a href={footerData.cta.link} class="button button-primary">{footerData.cta.label}</a>
				</div>

				<div class="flex gap-3 items-center opacity-75">
					{#each platforms as platform (platform.name)}
						{@const Icon = iconMap.get(platform.name)}
						<a href={platform.link} target="_blank" aria-label={platform.label} class="no-link">
							<Icon title="" />
						</a>
					{/each}
				</div>
			</div>
			{#each footerData.links as group, index (index)}
				<div class="flex flex-col gap-3">
					{#each group as { link, label } (link)}
						<a href={link} class="text-inherit">{label}</a>
					{/each}
				</div>
			{/each}
		</div>

		<div class="page-content text-stone-100 text-center text-xs mt-8 border-t border-t-stone-100/30 py-4">
			&copy; {new Date().getFullYear()} {titleSuffix}
		</div>
	</div>
</footer>