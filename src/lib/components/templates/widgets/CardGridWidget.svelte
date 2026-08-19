<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const cardGridWidgetField = {
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
                name: 'cards',
                label: 'Cards',
                label_singular: 'Card',
                widget: 'list',
                min: 4,
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
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Card from '$lib/components/organisms/Card.svelte';
    
    interface Props {
        widget: InferFieldsObject<typeof cardGridWidgetField.fields>;
    }

    const { widget }: Props = $props();
</script>

<div class="grid gap-4 {widget.cards.length > 4 ? 'md:grid-cols-3' : 'md:grid-cols-2'}">
    {#each widget.cards as card}
        <Card image={card.image}>
            <!-- TODO: headline margins inside Markdown -->
            <Markdown content={card.content} />
        </Card>
    {/each}
</div>