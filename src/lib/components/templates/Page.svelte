<script module lang="ts">
	import type { Collection } from '@sveltia/cms';
	import { heroSectionField } from '../organisms/HeroSection.svelte';
	import { textSectionField } from '../organisms/TextSection.svelte';
	import { galleryGridSectionField } from '../organisms/GalleryGridSection.svelte';
	import { cardGridSectionField } from '../organisms/CardGridSection.svelte';
    
    export const pageCollection = {
		name: 'pages',
		label: 'Pages',
        label_singular: 'Page',
		icon: 'article',
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
                    textSectionField,
                    galleryGridSectionField,
                    cardGridSectionField,
                ] as const
            }
        ] as const
    } satisfies Collection;
</script>

<script lang="ts">
   	import type { InferCollectionType } from '$lib/types/cms-types';
   	import HeroSection from '../organisms/HeroSection.svelte';
	import TextSection from '../organisms/TextSection.svelte';
	import GalleryGridSection from '../organisms/GalleryGridSection.svelte';
	import CardGridSection from '../organisms/CardGridSection.svelte';

    interface Props {
        page: InferCollectionType<typeof pageCollection>;
    }

    const { page }: Props = $props();
</script>

{#each page.sections as section}
    {#if section.type === 'hero'}
        <HeroSection {section} />
    {:else if section.type === 'text'}
        <TextSection {section} />
    {:else if section.type === 'gallery-grid'}
        <GalleryGridSection {section} />
    {:else if section.type === 'card-grid'}
        <CardGridSection {section} />
    {/if}
{/each}