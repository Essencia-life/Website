<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const instagramProfileWidgetField = {
		name: 'instagram-profile',
		label: 'Embedded Instagram Profile',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return instagramProfileWidgetField.name;
				}
			},
			{
				name: 'link',
				label: 'Instagram Profile Link'
			},
			{
				name: 'title',
				label: 'Title'
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';

	interface Props {
		widget: InferFieldsObject<typeof instagramProfileWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div class="rounded-lg overflow-hidden shadow-lg/30 mb-6">
	<iframe src="{widget.link}/embed"  width="100%" frameborder="0" scrolling="no" class="max-sm:aspect-10/11 md:aspect-5/4"></iframe>
</div>
