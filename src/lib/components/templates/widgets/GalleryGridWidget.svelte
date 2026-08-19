<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const galleryGridWidgetField = {
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
                name: 'pictures',
                label: 'Pictures',
                label_singular: 'Picture',
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
	import { Media } from '$lib/services/Media';
    
    interface Props {
        widget: InferFieldsObject<typeof galleryGridWidgetField.fields>;
    }

    const { widget }: Props = $props();
</script>

<div class="gallery grid gap-6 md:grid-cols-3 md:gap-4 my-12">
    {#each widget.pictures as picture}
        <figure>
            <enhanced:img src={Media.getFile(picture.image)} />
            <figcaption>{picture.caption}</figcaption>
        </figure>
    {/each}
</div>

<style>
	enhanced\:img {
		max-width: 100%;
		height: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	.gallery figure {
		position: relative;
		margin: 0;
		border-radius: 1rem;
		overflow: hidden;
	}

	.gallery figcaption {
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		padding: 2rem 1rem 1rem;
		background: linear-gradient(to top, rgba(0 0 0 / 70%), rgba(0 0 0 / 0));
		color: var(--brand-stonewhite-color);
		font-style: italic;
		font-weight: 400;
	}

	.gallery figure:first-of-type {
		grid-row: span 2;
	}

	.gallery figure:first-of-type enhanced\:img {
		aspect-ratio: auto;
		height: 100%;
		width: 100%;
	}
</style>