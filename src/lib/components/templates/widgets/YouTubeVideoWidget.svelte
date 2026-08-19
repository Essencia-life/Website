<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const youtubeVideoWidgetField = {
        name: 'youtube-video', 
        label: 'YouTube Video', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'youtube-video'
            },
            {
                name: 'id',
                label: 'Video ID'
            },
            {
                name: 'title',
                label: 'Title'
            },
        ] as const
    } satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import YouTube from '$lib/components/organisms/YouTube.svelte';
    
    interface Props {
        widget: InferFieldsObject<typeof youtubeVideoWidgetField.fields>;
    }

    const { widget }: Props = $props();
</script>

<YouTube
    id={widget.id}
    title={widget.title}
    class="mx-auto mt-16 w-full rounded-xl bg-gray-300 shadow-xl/40 max-md:min-h-[50vw] lg:min-h-128"
    loading="lazy"
/>