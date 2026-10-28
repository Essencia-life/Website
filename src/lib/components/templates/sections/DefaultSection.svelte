<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
	import { contentWidgetField } from '../widgets/ContentWidget.svelte';
	import { cardGridWidgetField } from '../widgets/CardGridWidget.svelte';
	import { galleryGridWidgetField } from '../widgets/GalleryGridWidget.svelte';
	import { youtubeVideoWidgetField } from '../widgets/YouTubeVideoWidget.svelte';
	import { stepsWidgetField } from '../widgets/StepsWidget.svelte';
	import { donorboxWidgetField } from '../widgets/DonorboxWidget.svelte';
	import { gofundmeWidgetField } from '../widgets/GofundmeWidget.svelte';
	import { tallyFormWidgetField } from '../widgets/TallyFormWidget.svelte';
	import { columnsWidgetField } from '../widgets/ColumnsWidget.svelte';
	import { instagramProfileWidgetField } from '../widgets/InstagramProfileWidget.svelte';
	import { slideshowWidgetField } from '../widgets/SlideshowWidget.svelte';
	import { priceTableWidgetField } from '../widgets/PriceTableWidget.svelte'
	import { membershipSubscriptionsWidgetField } from '../widgets/MembershipSubscriptions.svelte'

	export const defaultSectionField = {
		name: 'default-section',
		label: 'Default Section',
		widget: 'object',
		summary: "{{fields.widget.0.headline}}{{fields.widget.1.headline}}",
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return defaultSectionField.name;
				}
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
					instagramProfileWidgetField,
					slideshowWidgetField,
					gofundmeWidgetField,
					priceTableWidgetField,
					donorboxWidgetField,
					membershipSubscriptionsWidgetField,
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
	import GofundmeWidget from '$lib/components/templates/widgets/GofundmeWidget.svelte';
	import DonorboxWidget from '$lib/components/templates/widgets/DonorboxWidget.svelte';
	import MembershipSubscriptions from '$lib/components/templates/widgets/MembershipSubscriptions.svelte';

	interface Props {
		section: InferFieldsObject<typeof defaultSectionField.fields>;
		first: boolean;
		last: boolean;
	}

	const { section, first, last }: Props = $props();

	const cssClass = $derived.by(() => {
		const classes: string[] = [];

		if (section.settings?.textCenter) {
			classes.push('text-center');
		}

		if (section.settings?.variant === 'secondary') {
			classes.push('bg-stone-100');
		} else if (section.settings?.variant === 'dark') {
			classes.push('dark');
		}

		if (section.settings?.spacing) {
			if (section.settings.spacing === 'top') {
				classes.push('pt-16');
			} else if (section.settings?.spacing === 'bottom') {
				classes.push(last ? 'pb-50' : 'pb-16');
			}
		} else {
			classes.push('py-16');

			if (last) {
				classes.push('pb-50');
			}
		}

		return classes.join(' ');
	});
</script>

<section id={section.id} class={cssClass}>
	<div
		class="page-content grid items-center gap-12"
		class:md:grid-cols-2={section.settings?.layout?.startsWith('column')}
	>
		{#each section.widget as widget, index (index)}
			<div class:text-center={widget.settings?.textCenter}>
				{#if widget.type === contentWidgetField.name}
					<ContentWidget {widget} {first} />
				{:else if widget.type === cardGridWidgetField.name}
					<CardGridWidget {widget} />
				{:else if widget.type === galleryGridWidgetField.name}
					<GalleryGridWidget {widget} />
				{:else if widget.type === columnsWidgetField.name}
					<ColumnsWidget {widget} />
				{:else if widget.type === stepsWidgetField.name}
					<StepsWidget {widget} />
				{:else if widget.type === youtubeVideoWidgetField.name}
					<YouTubeVideoWidget {widget} />
				{:else if widget.type === instagramProfileWidgetField.name}
					<InstagramProfileWidget {widget} />
				{:else if widget.type === tallyFormWidgetField.name}
					<TallyFormWidget {widget} />
				{:else if widget.type === slideshowWidgetField.name}
					<SlideshowWidget {widget} />
				{:else if widget.type === priceTableWidgetField.name}
					<PriceTableWidget {widget} />
				{:else if widget.type === gofundmeWidgetField.name}
					<GofundmeWidget {widget} />
				{:else if widget.type === donorboxWidgetField.name}
					<DonorboxWidget {widget} />
				{:else if widget.type === membershipSubscriptionsWidgetField.name}
					<MembershipSubscriptions {widget} />
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
