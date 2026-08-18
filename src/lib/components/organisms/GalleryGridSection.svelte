<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const galleryGridSectionField = {
        name: 'gallery-grid', 
        label: 'Gallery Grid', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'gallery-grid'
            },
            {
                name: 'headline',
                label: 'Headline',
            },
            {
                name: 'content',
                label: 'Content',
                widget: 'richtext',
                required: false
            },
            {
                name: 'pictures',
                label: 'Pictures',
                widget: 'list',
                min: 5,
                max: 5,
                fields: [
                    {
                        name: 'image',
                        label: 'Image',
                        widget: 'image',
                        choose_url: false,
                    },
                    {
                        name: 'caption',
                        label: 'Caption'
                    }
                ]
            }
        ] as const
    } satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '../molecules/Markdown.svelte';
	import { Media } from '$lib/services/Media';
    
    interface Props {
        section: InferFieldsObject<typeof galleryGridSectionField.fields>;
    }

    const { section }: Props = $props();
</script>

<section>
	<div class="page-content">
        <h3>{section.headline}</h3>

        {#if section.content}
            <Markdown content={section.content} />
        {/if}

        <div class="gallery grid gap-6 md:grid-cols-3 md:gap-4">
            {#each section.pictures as picture}
                <figure>
                    <enhanced:img src={Media.getFile(picture.image)} />
                    <figcaption>{picture.caption}</figcaption>
                </figure>
            {/each}
		</div>
	</div>
</section>