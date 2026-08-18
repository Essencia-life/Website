<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const cardGridSectionField = {
        name: 'card-grid', 
        label: 'Card Grid', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'card-grid'
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
                name: 'cards',
                label: 'Cards',
                widget: 'list',
                min: 6,
                max: 6,
                fields: [
                    {
                        name: 'image',
                        label: 'Image',
                        widget: 'image',
                        choose_url: false,
                        required: false,
                    },
                    {
                        name: 'content',
                        label: 'Content',
                        widget: 'richtext',
                    },
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
        section: InferFieldsObject<typeof cardGridSectionField.fields>;
    }

    const { section }: Props = $props();
</script>

<section>
	<div class="page-content">
        <h3>{section.headline}</h3>

        {#if section.content}
            <Markdown content={section.content} />
        {/if}

        <div class="grid gap-4 md:grid-cols-3">
            {#each section.cards as card}
                <article class="card">
                    {#if card.image}
                        <enhanced:img src={Media.getFile(card.image)} />
                    {/if}
                    <div class="card-content">
                        <Markdown content={card.content} />
                    </div>
                </article>
            {/each}
		</div>
	</div>
</section>