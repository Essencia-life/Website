<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
	import { contentWidgetField } from '../widgets/ContentWidget.svelte';
	import { cardGridWidgetField } from '../widgets/CardGridWidget.svelte';
	import { galleryGridWidgetField } from '../widgets/GalleryGridWidget.svelte';
	import { youtubeVideoWidgetField } from '../widgets/YouTubeVideoWidget.svelte';
	import { stepsWidgetField } from '../widgets/StepsWidget.svelte';
	import { tallyFormWidgetField } from '../widgets/TallyFormWidget.svelte';
	import { columnsWidgetField } from '../widgets/ColumnsWidget.svelte';
	import { instagramProfileLinkWidgetField } from '../widgets/InstagramProfileWidget.svelte';
	import { slideshowWidgetField } from '../widgets/SlideshowWidget.svelte';
	import { priceTableWidgetField } from '../widgets/PriceTableWidget.svelte'

	export const defaultSectionField = {
		name: 'default-section',
		label: 'Default Section',
		widget: 'object',
		summary: "{{fields.widget.0.headline}}{{fields.widget.1.headline}}",
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
				name: 'widget',
				label: 'Widgets',
				label_singular: 'Widget',
				widget: 'list',
				max: 2,
				required: false,
				collapsed: true,
				types: [
					contentWidgetField,
					cardGridWidgetField,
					galleryGridWidgetField,
					youtubeVideoWidgetField,
					stepsWidgetField,
					tallyFormWidgetField,
					columnsWidgetField,
					instagramProfileLinkWidgetField,
					slideshowWidgetField,
					priceTableWidgetField
				]
			},
			{
				name: 'settings',
				label: 'Section Settings',
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
							{ label: 'Row', value: null },
							{ label: 'Column', value: 'column' },
						]
					},
					{
						name: 'spacing',
						label: 'Spacing',
						widget: 'select',
						required: false,
						options: [
							{ label: 'Default', value: null },
							{ label: 'Top only', value: 'top' },
							{ label: 'Bottom only', value: 'bottom' },
						]
					}
				]
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import ContentWidget from '../widgets/ContentWidget.svelte';
	import CardGridWidget from '../widgets/CardGridWidget.svelte';
	import GalleryGridWidget from '../widgets/GalleryGridWidget.svelte';
	import YouTubeVideoWidget from '../widgets/YouTubeVideoWidget.svelte';
	import StepsWidget from '../widgets/StepsWidget.svelte';
	import TallyFormWidget from '../widgets/TallyFormWidget.svelte';
	import ColumnsWidget from '../widgets/ColumnsWidget.svelte';
	import InstagramProfileWidget from '../widgets/InstagramProfileWidget.svelte';
	import SlideshowWidget from '$lib/components/templates/widgets/SlideshowWidget.svelte';
	import PriceTableWidget from '$lib/components/templates/widgets/PriceTableWidget.svelte';

	interface Props {
		index: number;
		section: InferFieldsObject<typeof defaultSectionField.fields>;
	}

	const { index, section }: Props = $props();
</script>

<section
	id={section.id}
	class:text-center={section.settings?.textCenter}
	class:bg-stone-100={section.settings?.variant === 'secondary'}
	class:dark={section.settings?.variant === 'dark'}
	class:pt-16={section.settings?.spacing === 'top'}
	class:pb-16={section.settings?.spacing === 'bottom'}
	class:py-16={!section.settings?.spacing}
>
	<div
		class="page-content grid items-center gap-12"
		class:md:grid-cols-2={section.settings?.layout?.startsWith('column')}
	>
		{#each section.widget as widget, widgetIndex (widgetIndex)}
			<div class:text-center={widget.settings?.textCenter}>
				{#if widget.type === 'content'}
					<ContentWidget {widget} {index} />
				{:else if widget.type === 'card-grid'}
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
				{:else if widget.type === 'price-table'}
					<PriceTableWidget {widget} />
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--color-olive-800);
		color: var(--color-stone-50);
	}

	.dark :global(h2),
	.dark :global(h3),
	.dark :global(h4),
	.dark :global(h5) {
		color: var(--color-amber-300);
	}
</style>
