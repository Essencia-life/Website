<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const donorboxWidgetField = {
		name: 'donorbox',
		label: 'Donorbox',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return donorboxWidgetField.name;
				}
			},
			{
				name: 'campaign',
				label: 'Campaign',
				default: 'support-essencia'
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';

	interface Props {
		widget: InferFieldsObject<typeof donorboxWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<svelte:head>
	<script type="module" src="https://donorbox.org/widgets.js" async></script>
</svelte:head>

<div class="flex justify-center">
	<div class="shadow-xl">
		<div class="rounded-xl overflow-hidden">
			<dbox-widget campaign={widget.campaign} type="donation_form" enable-auto-scroll="true"></dbox-widget>
		</div>
	</div>
</div>
