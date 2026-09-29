<script module lang="ts">
	import type { Collection } from '@sveltia/cms';
	import { heroSectionField } from './sections/HeroSection.svelte';
	import { defaultSectionField } from './sections/DefaultSection.svelte';
	import { peopleSectionField } from './sections/PeopleSection.svelte';
	import { residencyCostsSectionField } from './sections/ResidencyCostsSection.svelte';
	import { joinUsColumnsSectionField } from './sections/JoinUsColumnsSection.svelte';
	import { healingOffersSectionField } from './sections/HealingOffersSection.svelte';

	export const pageCollection = {
		name: 'pages',
		label: 'Pages',
		label_singular: 'Page',
		format: 'json',
		icon: 'description',
		identifier_field: 'meta.title',
		slug: '{{fields._slug}}',
		create: true,
		folder: 'src/lib/content/pages',
		nested: {
			depth: 2,
			summary: "{{meta.title}}",
			subfolders: false,
		},
		meta: {
			path: {}
		},
		fields: [
			{
				name: 'meta',
				label: 'Meta data',
				widget: 'object',
				collapsed: 'auto',
				fields: [
					{ name: 'title', label: 'Page Title' },
					{
						name: 'description',
						label: 'Page description',
						hint: 'Relevant for SEO & social media sharing'
					},
					{
						name: 'cover',
						label: 'Page cover',
						widget: 'image',
						hint: 'Relevant for social media sharing',
						required: false,
						choose_url: false
					}
				] as const
			},
			{
				name: 'sections',
				label: 'Page Sections',
				label_singular: 'Section',
				widget: 'list',
				collapsed: true,
				types: [
					heroSectionField,
					defaultSectionField,
					peopleSectionField,
					residencyCostsSectionField,
					joinUsColumnsSectionField,
					healingOffersSectionField,
				] as const
			}
		] as const
	} satisfies Collection;
</script>

<script lang="ts">
	import type { InferCollectionType } from '$lib/types/cms-types';
	import HeroSection from './sections/HeroSection.svelte';
	import SEO from '$lib/components/atoms/SEO.svelte';
	import { Media } from '$lib/services/Media';
	import DefaultSection from './sections/DefaultSection.svelte';
	import PeopleSection from './sections/PeopleSection.svelte';
	import ResidencyCostsSection from './sections/ResidencyCostsSection.svelte';
	import JoinUsColumnsSection from './sections/JoinUsColumnsSection.svelte';
	import HealingOffersSection from '$lib/components/templates/sections/HealingOffersSection.svelte';

	interface Props {
		page: InferCollectionType<typeof pageCollection>;
	}

	const { page }: Props = $props();
</script>

<SEO
	schema={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: page.meta.title,
		description: page.meta.description,
		image: page.meta.cover && Media.getFile(page.meta.cover).img.src
		// url: `https://${page.data.VERCEL_PROJECT_PRODUCTION_URL}${page.url.pathname}` // TODO
	}}
/>

{#each page.sections as section, index (index)}
	{#if section.type === heroSectionField.name}
		<HeroSection {section} />
	{:else if section.type === defaultSectionField.name}
		<DefaultSection {index} {section} />
	{:else if section.type === peopleSectionField.name}
		<PeopleSection {section} />
	{:else if section.type === residencyCostsSectionField.name}
		<ResidencyCostsSection {section} />
	{:else if section.type === joinUsColumnsSectionField.name}
		<JoinUsColumnsSection {section} />
	{:else if section.type === healingOffersSectionField.name}
		<HealingOffersSection {section} />
	{/if}
{/each}
