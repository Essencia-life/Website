<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const priceTableWidgetField = {
		name: 'price-table',
		label: 'Price Table',
		widget: 'object',
		summary: '{{headline}}',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'price-table'
			},
			{
				name: 'priceGroups',
				label: 'Price Groups',
				label_singular: 'Price Group',
				widget: 'list',
				min: 1,
				max: 2,
				fields: [
					{
						name: 'headline',
						label: 'Headline',
					},
					{
						name: 'prices',
						label: 'Prices',
						label_singular: 'Price',
						widget: 'list',
						min: 1,
						fields: [
							{
								name: 'label',
								label: 'Label',
							},
							{
								name: 'price',
								label: 'Price',
							},
						]
					}
				]
			},
			{
				name: 'subtext',
				label: 'Subtext',
				required: false
			},
			{
				name: 'button',
				label: 'Button',
				widget: 'object',
				fields: [
					{
						name: 'label',
						label: 'Label'
					},
					{
						name: 'link',
						label: 'Link'
					}
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
		widget: InferFieldsObject<typeof priceTableWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div class="grid md:grid-cols-[repeat(var(--columns),1fr)] gap-4 text-sm mt-4" style:--columns={widget.priceGroups.length}>
	{#each widget.priceGroups as group (group)}
		<Card>
			<h4 class="uppercase mb-2">{group.headline}</h4>
			<table class="w-full">
				{#each group.prices as price (price)}
					<tr>
						<th class="font-normal text-gray-600 text-left py-1">{price.label}</th>
						<td class="text-right font-semibold py-1">{price.price}</td>
					</tr>
				{/each}
			</table>
		</Card>
	{/each}
</div>
<div class="italic text-xs mt-2 mb-6 text-gray-500">{widget.subtext}</div>
<a href={widget.button.link} class="button button-primary">{widget.button.label}</a>