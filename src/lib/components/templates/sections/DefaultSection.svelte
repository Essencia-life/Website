<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
	import { cardGridWidgetField } from '../widgets/CardGridWidget.svelte';
	import { galleryGridWidgetField } from '../widgets/GalleryGridWidget.svelte';
	import { youtubeVideoWidgetField } from '../widgets/YouTubeVideoWidget.svelte';
	import { stepsWidgetField } from '../widgets/StepsWidget.svelte';
	import { tallyFormWidgetField } from '../widgets/TallyFormWidget.svelte';
	import { columnsWidgetField } from '../widgets/ColumnsWidget.svelte';

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
				label: 'Headline'
			},
			{
				name: 'content',
				label: 'Content',
				widget: 'richtext',
				required: false
			},
			{
				name: 'textCenter',
				label: 'Center text',
				widget: 'boolean'
			},
			{
				name: 'bgSecondary',
				label: 'Background secondary',
				widget: 'boolean'
			},
			{
				name: 'bgDark',
				label: 'Background dark',
				widget: 'boolean'
			},
			{
				name: 'widget',
				label: 'Widget',
				widget: 'list',
				max: 1,
				types: [
					cardGridWidgetField,
					galleryGridWidgetField,
					youtubeVideoWidgetField,
					stepsWidgetField,
					tallyFormWidgetField,
					columnsWidgetField
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
	class:text-center={section.textCenter}
	class:secondary={section.bgSecondary}
	class:dark={section.bgDark}
>
	<div class="page-content">
		<svelte:element this={index === 0 ? 'h2' : 'h3'} class="mb-6">
			{#if section.supline}
				<sup class="top-0 mb-2 block">{section.supline}</sup>
			{/if}
			{section.headline}
		</svelte:element>

		<Markdown content={section.content} />

		{#if widget}
			<div class="mt-12 text-left">
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
				{:else if widget.type === 'tally-form'}
					<TallyFormWidget {widget} />
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
</style>
