<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const columnsWidgetField = {
		name: 'columns',
		label: 'Columns',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'columns'
			},
			{
				name: 'columns',
				label: 'Columns',
				label_singular: 'Column',
				widget: 'list',
				collapsed: 'auto',
				min: 2,
				fields: [
					{
						name: 'content',
						label: 'Content',
						widget: 'richtext'
					}
				]
			},
			{
				name: 'settings',
				label: 'Columns Settings',
				widget: 'object',
				required: false,
				fields: [
					{
						name: 'variant',
						label: 'Variant',
						widget: 'select',
						required: false,
						options: [
							{ label: 'Default', value: null },
							{ label: 'Colored top border', value: 'top-border' }
						]
					},
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

	interface Props {
		widget: InferFieldsObject<typeof columnsWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div
	class="mt-12 grid md:grid-cols-[repeat(var(--columns),1fr)] md:gap-8"
	class:top-border-colored={widget.settings?.variant === 'top-border'}
	style:--columns={widget.settings?.columns ?? widget.columns.length}
>
	{#each widget.columns as column (column)}
		<article>
			<Markdown content={column.content}>
				{#snippet headlineNode(node, sharedProps)}
					<svelte:element this={'h' + node.depth} class="mb-6">
						<Markdown content={node} {...sharedProps} />
					</svelte:element>
				{/snippet}

				{#snippet listNode(node, sharedProps)}
					<svelte:element
						this={node.ordered ? 'ol' : 'ul'}
						class="pl-3"
						class:list-hyphen={!node.ordered}
					>
						<Markdown content={node} {...sharedProps} />
					</svelte:element>
				{/snippet}

				{#snippet listItemNode(node, sharedProps)}
					<li class="pl-2">
						<Markdown content={node} {...sharedProps} />
					</li>
				{/snippet}
			</Markdown>
		</article>
	{/each}
</div>

<style>
	.list-hyphen {
		list-style: '–';
	}

	.top-border-colored article {
		border-top: 2px solid var(--color-olive-800);
		padding-top: 1rem;
	}

	.top-border-colored article:nth-child(2) {
		border-color: var(--color-cyan-600);
	}

	.top-border-colored article:nth-child(3) {
		border-color: var(--color-amber-500);
	}

	.top-border-colored article:nth-child(4) {
		border-color: var(--color-taupe-700);
	}
</style>
