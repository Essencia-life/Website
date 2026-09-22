<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const contentWidgetField = {
		name: 'content',
		label: 'Content',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'content'
			},
			{
				name: 'supline',
				label: 'Supline',
				hint: 'Is part of the headline but displayed above',
				required: false
			},
			{
				name: 'headline',
				label: 'Headline',
				required: false
			},
			{
				name: 'content',
				label: 'Content',
				widget: 'richtext',
			},
			{
				name: 'settings',
				label: 'Settings',
				widget: 'object',
				required: false,
				fields: [
					{
						name: 'textCenter',
						label: 'Center text',
						widget: 'boolean',
						required: false
					}
				]
			},
			{
				name: 'buttons',
				label: 'Buttons',
				widget: 'list',
				required: false,
				collapsed: true,
				fields: [
					{
						name: 'label',
						label: 'Label'
					},
					{
						name: 'link',
						label: 'Link'
					},
					{
						name: 'variant',
						label: 'Variant',
						widget: 'select',
						required: false,
						options: [
							{ label: 'Default', value: null },
							{ label: 'Primary', value: 'primary' }
						]
					}
				]
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

	interface Props {
		widget: InferFieldsObject<typeof contentWidgetField.fields>;
		index: number;
	}

	const { widget, index }: Props = $props();
</script>

<svelte:element this={index === 0 ? 'h2' : 'h3'} class="mb-6">
	{#if widget.supline}
		<sup class="top-0 mb-2 block">{widget.supline}</sup>
	{/if}
	{widget.headline}
</svelte:element>

{#if widget.content}
	<Markdown content={widget.content} />
{/if}

{#if widget.buttons?.length}
	<div class="mt-8 inline-flex flex-wrap gap-4">
		{#each widget.buttons ?? [] as button (button)}
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={button.link}
				class="button"
				class:button-primary={button.variant === 'primary'}
			>
				{button.label}
			</a>
		{/each}
	</div>
{/if}