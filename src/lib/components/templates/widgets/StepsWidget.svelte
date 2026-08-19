<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const stepsWidgetField = {
        name: 'steps', 
        label: 'Steps', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'steps'
            },
            {
                name: 'steps',
                label: 'Steps',
                widget: 'list',
                min: 3,
                fields: [
                    {
                        name: 'title',
                        label: 'Title'
                    },
                    {
                        name: 'description',
                        label: 'Description'
                    }
                ]
            },
        ] as const
    } satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import StepList from '$lib/components/molecules/StepList.svelte';
    
    interface Props {
        widget: InferFieldsObject<typeof stepsWidgetField.fields>;
    }

    const { widget }: Props = $props();
</script>

<StepList items={widget.steps} />