<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const columnsWidgetField = {
        name: 'columns', 
        label: 'Columns', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'columns'
            },
            {
                name: 'columns',
                label: 'Columns',
                label_singular: 'Column',
                widget: 'list',
                min: 2,
                fields: [
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
    
    interface Props {
        widget: InferFieldsObject<typeof columnsWidgetField.fields>;
    }

    const { widget }: Props = $props();
</script>

<div class="grid mt-12 md:gap-8 md:grid-cols-[repeat(var(--columns),_1fr)]" style:--columns={widget.columns.length}>
    {#each widget.columns as column}
        <article>
            <!-- TODO: headline margins inside Markdown -->
            <Markdown content={column.content} />
        </article>
    {/each}
</div>