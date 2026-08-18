<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const textSectionField = {
        name: 'text', 
        label: 'Text', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'text'
            },
            {
                name: 'content',
                label: 'Content',
                widget: 'richtext'
            },
        ] as const
    } satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '../molecules/Markdown.svelte';
    
    interface Props {
        section: InferFieldsObject<typeof textSectionField.fields>;
    }

    const { section }: Props = $props();
</script>

<section>
	<div class="page-content">
		<Markdown content={section.content} />
	</div>
</section>