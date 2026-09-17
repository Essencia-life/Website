<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
	import { cardGridWidgetField } from '../widgets/CardGridWidget.svelte';
	import { galleryGridWidgetField } from '../widgets/GalleryGridWidget.svelte';
	import { youtubeVideoWidgetField } from '../widgets/YouTubeVideoWidget.svelte';
	import { stepsWidgetField } from '../widgets/StepsWidget.svelte';
	import { tallyFormWidgetField } from '../widgets/TallyFormWidget.svelte';
	import { columnsWidgetField } from '../widgets/ColumnsWidget.svelte';
	import { instagramProfileLinkWidgetField } from '../widgets/InstagramProfileWidget.svelte';
	import { slideshowWidgetField } from '../widgets/SlideshowWidget.svelte';

	export const defaultSectionField = {
		name: 'default-section',
		label: 'Default Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'default-section'
			},
			{
				name: 'id',
				label: 'Section ID',
				hint: 'Relevant as scroll target',
				required: false
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
			{
				name: 'settings',
				label: 'Settings',
				widget: 'object',
				required: false,
				collapsed: true,
				fields: [
					{
						name: 'variant',
						label: 'Variant',
						widget: 'select',
						required: false,
						options: [
							{ label: 'Default', value: null },
							{ label: 'Secondary', value: 'secondary' },
							{ label: 'Dark', value: 'dark' }
						]
					},
					{
						name: 'layout',
						label: 'Layout',
						widget: 'select',
						required: false,
						options: [
							{ label: 'Default', value: null },
							{ label: 'Column', value: 'column' },
							{ label: 'Column Reverse', value: 'column-reverse' }
						]
					},
					{
						name: 'textCenter',
						label: 'Center text',
						widget: 'boolean',
						required: false
					}
				]
			},
			{
				name: 'widget',
				label: 'Widget',
				widget: 'list',
				max: 1,
				required: false,
				collapsed: true,
				types: [
					cardGridWidgetField,
					galleryGridWidgetField,
					youtubeVideoWidgetField,
					stepsWidgetField,
					tallyFormWidgetField,
					columnsWidgetField,
					instagramProfileLinkWidgetField,
					slideshowWidgetField
				]
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import CardGridWidget from '../widgets/CardGridWidget.svelte';
	import GalleryGridWidget from '../widgets/GalleryGridWidget.svelte';
	import YouTubeVideoWidget from '../widgets/YouTubeVideoWidget.svelte';
	import StepsWidget from '../widgets/StepsWidget.svelte';
	import TallyFormWidget from '../widgets/TallyFormWidget.svelte';
	import ColumnsWidget from '../widgets/ColumnsWidget.svelte';
	import InstagramProfileWidget from '../widgets/InstagramProfileWidget.svelte';
	import SlideshowWidget from '$lib/components/templates/widgets/SlideshowWidget.svelte';

	interface Props {
		index: number;
		section: InferFieldsObject<typeof defaultSectionField.fields>;
	}

	const { index, section }: Props = $props();
	const [widget] = $derived(section.widget);
</script>

<section
	id={section.id}
	class="py-16"
	class:text-center={section.settings?.textCenter}
	class:secondary={section.settings?.variant === 'secondary'}
	class:dark={section.settings?.variant === 'dark'}
>
	<div
		class="page-content grid items-center gap-12"
		class:md:grid-cols-2={section.settings?.layout?.startsWith('column')}
	>
		<div>
			<svelte:element this={index === 0 ? 'h2' : 'h3'} class="mb-6">
				{#if section.supline}
					<sup class="top-0 mb-2 block">{section.supline}</sup>
				{/if}
				{section.headline}
			</svelte:element>

			{#if section.content}
				<Markdown content={section.content} />
			{/if}

			{#if section.buttons?.length}
				<div class="mt-8 inline-flex flex-wrap gap-4">
					{#each section.buttons ?? [] as button (button)}
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
		</div>

		{#if widget}
			<div class="text-left" class:md:-order-1={section.settings?.layout === 'column-reverse'}>
				{#if widget.type === 'card-grid'}
					<CardGridWidget {widget} />
				{:else if widget.type === 'gallery-grid'}
					<GalleryGridWidget {widget} />
				{:else if widget.type === 'columns'}
					<ColumnsWidget {widget} />
				{:else if widget.type === 'steps'}
					<StepsWidget {widget} />
				{:else if widget.type === 'youtube-video'}
					<YouTubeVideoWidget {widget} />
				{:else if widget.type === 'instagram-profile'}
					<InstagramProfileWidget {widget} />
				{:else if widget.type === 'tally-form'}
					<TallyFormWidget {widget} />
				{:else if widget.type === 'slideshow'}
					<SlideshowWidget {widget} />
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.secondary {
		background: var(--brand-parchment-color);
	}

	.dark {
		color-scheme: dark;
		background: var(--brand-dark-section-color);
		color: var(--brand-stonewhite-color);
	}

	.dark :global(h2),
	.dark :global(h3),
	.dark :global(h4),
	.dark :global(h5) {
		color: var(--brand-ambergold-color);
	}
</style>
