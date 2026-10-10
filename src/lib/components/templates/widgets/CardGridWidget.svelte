<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const cardGridWidgetField = {
		name: 'card-grid',
		label: 'Card Grid',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'card-grid'
			},
			{
				name: 'cards',
				label: 'Cards',
				label_singular: 'Card',
				widget: 'list',
				collapsed: 'auto',
				min: 1,
				fields: [
					{
						name: 'image',
						label: 'Image',
						widget: 'image',
						choose_url: false,
						required: false
					},
					{
						name: 'content',
						label: 'Content',
						widget: 'richtext'
					},
					{
						name: 'link',
						label: 'Link',
						required: false
					}
				]
			},
			{
				name: 'settings',
				label: 'Card Grid Settings',
				widget: 'object',
				required: false,
				fields: [
					{
						name: 'columns',
						label: 'Number of columns',
						widget: 'number',
						value_type: 'int',
						required: false
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
		widget: InferFieldsObject<typeof cardGridWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div class="grid gap-4  md:grid-cols-[repeat(var(--columns),1fr)]"
		 style:--columns={widget.settings?.columns ?? widget.cards.length}>
	{#each widget.cards as card}
		<Card image={card.image} link={card.link}>
			<Markdown content={card.content}>
				{#snippet paragraphNode(node)}
					<p class="mt-2">
						<Markdown content={node} />
					</p>
				{/snippet}
			</Markdown>
		</Card>
	{/each}
</div>
