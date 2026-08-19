<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const joinUsColumnsSectionField = {
		name: 'join-us-columns',
		label: 'Join Us Columns Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'join-us-columns'
			},
			{
				name: 'columns',
				label: 'Columns',
				label_singular: 'Column',
				widget: 'list',
				min: 3,
				max: 3,
				fields: [
					{
						name: 'image',
						label: 'Image',
						widget: 'image'
					},
					{
						name: 'supline',
						label: 'Supline'
					},
					{
						name: 'headline',
						label: 'Headline'
					},
					{
						name: 'description',
						label: 'Description'
					},
					{
						name: 'tags',
						label: 'tags'
					},
					{
						name: 'button',
						label: 'CTA Button',
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
				]
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Card from '$lib/components/organisms/Card.svelte';

	interface Props {
		section: InferFieldsObject<typeof joinUsColumnsSectionField.fields>;
	}

	const { section }: Props = $props();
</script>

<section class="pb-16">
	<div class="page-content gap-8 max-sm:space-y-12 md:grid md:grid-cols-2 lg:grid-cols-3">
		{#each section.columns as column, index}
			<Card image={column.image}>
				<div class="flex h-full flex-col gap-4 p-2">
					<h3>
						<sup
							class="block"
							class:primary={index === 0}
							class:ambergold={index === 1}
							class:oceanteal={index === 2}>{column.supline}</sup
						>{column.headline}
					</h3>
					<p class="text-justify">{column.description}</p>
					<div class="mt-auto text-xs/6">{column.tags}</div>
					<a
						href={column.button.link}
						class="button mx-auto"
						class:button-primary={index === 0}
						class:button-ambergold={index === 1}
						class:button-oceanteal={index === 2}>{column.button.label}</a
					>
				</div>
			</Card>
		{/each}
	</div>
</section>

<style>
	sup.primary {
		color: var(--brand-primary-color);
	}

	sup.ambergold {
		color: var(--brand-ambergold-color);
	}

	sup.oceanteal {
		color: var(--brand-oceanteal-color);
	}
</style>
