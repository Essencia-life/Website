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
				min: 2,
				fields: [
					{
						name: 'content',
						label: 'Content',
						widget: 'richtext'
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
	class="mt-12 grid md:grid-cols-[repeat(var(--columns),_1fr)] md:gap-8"
	style:--columns={widget.columns.length}
>
	{#each widget.columns as column}
		<article>
			<Markdown content={column.content}>

				{#snippet headlineNode(node, sharedProps)}
					<svelte:element this={'h' + node.depth} class="mb-6">
						<Markdown content={node} {...sharedProps} />
					</svelte:element>
				{/snippet}

				{#snippet listNode(node, sharedProps)}
					<svelte:element this={node.ordered ? 'ol' : 'ul'} class="pl-3" class:list-hyphen={!node.ordered}>
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
		list-style: "–";
	}
</style>