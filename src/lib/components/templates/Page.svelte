<script module lang="ts">
	import type { Collection } from '@sveltia/cms';
	import { heroSectionField } from './sections/HeroSection.svelte';
	import DefaultSection, { defaultSectionField } from './sections/DefaultSection.svelte';
    
    export const pageCollection = {
		name: 'pages',
		label: 'Pages',
        label_singular: 'Page',
        format: 'json',
		icon: 'description',
        identifier_field: 'meta.title',
        path: '{{slug}}/index',
        create: true,
        folder: "src/lib/content/pages",
		fields: [
            {
                name: 'meta', 
                label: 'Meta data', 
                widget: 'object',
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
                    },                
                ] as const
            },
            {
                name: 'sections',
                label: 'Page Sections',
                label_singular: 'Section',
                widget: 'list',
                types: [
                    heroSectionField,
                    defaultSectionField,
                    accommodationSectionField,
                    residencyCostsSectionField,
                    joinUsColumnsSectionField,
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
	import AccommodationSection, { accommodationSectionField } from './sections/AccommodationSection.svelte';
	import ResidencyCostsSection, { residencyCostsSectionField } from './sections/ResidencyCostsSection.svelte';
	import JoinUsColumnsSection, { joinUsColumnsSectionField } from './sections/JoinUsColumnsSection.svelte';

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
        image: page.meta.cover && Media.getFile(page.meta.cover).img.src,
		// url: `https://${page.data.VERCEL_PROJECT_PRODUCTION_URL}${page.url.pathname}` // TODO
	}}
/>

{#each page.sections as section, index}
    {#if section.type === 'hero'}
        <HeroSection {section} />
    {:else if section.type === 'default-section'}
        <DefaultSection {index} {section} />
    {:else if section.type === 'accommodation'}
        <AccommodationSection {section} />
    {:else if section.type === 'residency-costs'}
        <ResidencyCostsSection {section} />
    {:else if section.type === 'join-us-columns'}
        <JoinUsColumnsSection {section} />
    {/if}
{/each}