<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const contentWidgetField = {
		name: 'content',
		label: 'Content',
		widget: 'object',
		summary: '{{headline}}',
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
				required: false
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
					},
					{
						name: 'listIcons',
						label: 'List Item Icons',
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
	import { type LucideIcon } from '@lucide/svelte';
	import DoorClosed from '@lucide/svelte/icons/door-closed';
	import FlameKindling from '@lucide/svelte/icons/flame-kindling';
	import SunMedium from '@lucide/svelte/icons/sun-medium';
	import Wifi from '@lucide/svelte/icons/wifi';
	import WavesVertical from '@lucide/svelte/icons/waves-vertical';
	import ShowerHead from '@lucide/svelte/icons/shower-head';
	import Houses from '@lucide/svelte/icons/houses';
	import Tent from '@lucide/svelte/icons/tent';
	import Bed from '@lucide/svelte/icons/bed';
	import Van from '@lucide/svelte/icons/van';
	import SunSnow from '@lucide/svelte/icons/sun-snow';

	interface Props {
		widget: InferFieldsObject<typeof contentWidgetField.fields>;
		index: number;
	}

	const { widget, index }: Props = $props();

	const iconMap: Record<string, LucideIcon> = {
		room: DoorClosed,
		flame: FlameKindling,
		heating: WavesVertical,
		solar: SunMedium,
		wifi: Wifi,
		shower: ShowerHead,
		houses: Houses,
		tent: Tent,
		bed: Bed,
		van: Van,
		seasons: SunSnow,
	};
</script>

{#if widget.headline}
	<svelte:element this={index === 0 ? 'h2' : 'h3'} class="mb-6">
		{#if widget.supline}
			<sup class="top-0 mb-2 block">{widget.supline}</sup>
		{/if}
		{widget.headline}
	</svelte:element>
{/if}

{#if widget.content}
	{#if widget.settings?.listIcons}
		{@const iconNames = widget.settings?.listIcons.split(',')}
			<Markdown content={widget.content}>
				{#snippet listNode(node, sharedProps)}
					<ul	class="py-4">
						{#each node.children as listItem, index (index)}
							{@const Icon = iconMap[iconNames[index]] ?? DoorClosed}
							<li class="pl-1 flex gap-2 py-1 [&_p]:my-0">
								<Icon size={16} class="shrink-0 mt-1" />
								<Markdown content={listItem} {...sharedProps} />
							</li>
						{/each}
					</ul>
				{/snippet}
			</Markdown>
		{:else}
			<Markdown content={widget.content} />
	{/if}
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