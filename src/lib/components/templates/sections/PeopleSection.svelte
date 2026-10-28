<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const peopleSectionField = {
		name: 'people',
		label: 'People of Essência Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'people'
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import People from '$lib/components/templates/People.svelte';

	interface Props {
		last: boolean;
	}

	const { last }: Props = $props();
</script>

<section class="py-16" class:pb-50={last}>
	<div class="page-content">
		<People />
	</div>
</section>