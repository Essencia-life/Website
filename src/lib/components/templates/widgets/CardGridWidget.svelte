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
				get default() {
					return cardGridWidgetField.name;
				}
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
					},
					{
						name: 'icon',
						label: 'Icon',
						required: false,
						widget: 'object',
						fields: [
							{
								name: 'name',
								label: 'Icon Name',
								widget: 'select',
								options: ['power', 'water', 'toilet', 'waste']
							},
							{
								name: 'position',
								label: 'Icon Position',
								widget: 'select',
								options: ['left']
							},
							{
								name: 'color',
								label: 'Icon Color',
								widget: 'select',
								options: ['amber', 'cyan', 'taupe', 'olive']
							}
						]
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
	import Sun from '@lucide/svelte/icons/sun';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Toilet from '@lucide/svelte/icons/toilet';
	import Trash from '@lucide/svelte/icons/trash';
	import type { LucideIcon } from '@lucide/svelte';

	interface Props {
		widget: InferFieldsObject<typeof cardGridWidgetField.fields>;
	}

	const { widget }: Props = $props();

	const iconMap: Record<string, LucideIcon> = {
		power: Sun,
		water: Droplet,
		toilet: Toilet,
		waste: Trash
	};
</script>

{#snippet cardElement(card)}
	<Card image={card.image} link={card.link}>
		<Markdown content={card.content}>
			{#snippet paragraphNode(node)}
				<p class="mt-2">
					<Markdown content={node} />
				</p>
			{/snippet}
		</Markdown>
	</Card>
{/snippet}

<div class="grid gap-4 md:grid-cols-[repeat(var(--columns),1fr)]"
		 style:--columns={widget.settings?.columns ?? widget.cards.length}>
	{#each widget.cards as card (card)}
		{#if card.icon}
			{@const Icon = iconMap[card.icon.name]}
			<div class="flex gap-4">
				<div
					class={[
						'mt-2 flex size-12 shrink-0 items-center justify-center rounded-full',
						card.icon.color === 'amber' &&
							'bg-amber-100 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300',
						card.icon.color === 'cyan' &&
							'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300',
						card.icon.color === 'taupe' &&
							'bg-taupe-100 text-taupe-700 dark:bg-taupe-400/15 dark:text-taupe-300',
						card.icon.color === 'olive' &&
							'bg-olive-100 text-olive-800 dark:bg-olive-400/15 dark:text-olive-300'
					]}
				>
					<Icon />
				</div>
				{@render cardElement(card)}
			</div>
		{:else}
			{@render cardElement(card)}
		{/if}
	{/each}
</div>
