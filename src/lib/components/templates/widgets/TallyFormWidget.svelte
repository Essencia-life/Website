<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const tallyFormWidgetField = {
		name: 'tally-form',
		label: 'Tally Form',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'tally-form'
			},
			{
				name: 'id',
				label: 'Form ID'
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
	import TallyForm from '$lib/components/organisms/TallyForm.svelte';

	interface Props {
		widget: InferFieldsObject<typeof tallyFormWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div class="form secondary mt-6 mb-12 rounded-2xl p-2">
	<TallyForm formId={widget.id} title={widget.title} />
</div>

<style>
	.secondary {
		/* light panel in both themes, the embedded Tally form is light only */
		background: var(--color-parchment);
	}

	/* tone the light panel down at night: it blends into the dark page */
	@media (prefers-color-scheme: dark) {
		.secondary {
			opacity: 0.8;
		}
	}
</style>
