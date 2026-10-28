<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const slideshowWidgetField = {
		name: 'slideshow',
		label: 'Slideshow',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'slideshow'
			},
			{
				name: 'pictures',
				label: 'Pictures',
				label_singular: 'Picture',
				widget: 'list',
				min: 2,
				fields: [
					{
						name: 'photo',
						label: 'Photo',
						widget: 'image',
						choose_url: false
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
	import Slideshow from '$lib/components/molecules/Slideshow.svelte';

	interface Props {
		widget: InferFieldsObject<typeof slideshowWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<Slideshow
	photos={widget.pictures}
	classes={{
		gallery: 'rounded-2xl shadow-md',
		figure: 'rounded-2xl',
		caption: 'italic',
		image: 'aspect-3/2'
	}}
/>
