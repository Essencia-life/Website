<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const accommodationSectionField = {
		name: 'accommodation',
		label: 'Accommodation Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				default: 'accommodation'
			},
			{
				name: 'headline',
				label: 'Headline'
			},
			{
				name: 'description',
				label: 'Description',
				widget: 'text'
			},
			{
				name: 'subtext',
				label: 'Subtext'
			},
			{
				name: 'pictures',
				label: 'Pictures',
				label_singular: 'Picture',
				widget: 'list',
				min: 2,
				fields: [
					{
						name: 'photo',
						label: 'Photo',
						widget: 'image',
						choose_url: false
					},
					{
						name: 'caption',
						label: 'Caption'
					}
				]
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Slideshow from '$lib/components/molecules/Slideshow.svelte';

	interface Props {
		section: InferFieldsObject<typeof accommodationSectionField.fields>;
	}

	const { section }: Props = $props();
</script>

<section class="dark py-16">
	<div
		class="page-content grid gap-y-6 overflow-visible! md:grid-cols-2 md:grid-rows-[auto_auto_auto] md:gap-x-10"
	>
		<h3 class="md:self-end">{section.headline}</h3>
		<div class="md:row-span-3">
			<Slideshow
				photos={section.pictures}
				classes={{
					gallery: 'rounded-2xl shadow-md',
					figure: 'rounded-2xl',
					caption: 'italic',
					image: 'aspect-3/2',
					indicators: 'absolute top-full inset-x-0'
				}}
			/>
		</div>
		<p>{section.description}</p>
		<i>{section.subtext}</i>
	</div>
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--brand-dark-section-color);
		color: var(--brand-stonewhite-color);
	}

	.dark h3 {
		color: var(--brand-stonewhite-color);
	}
</style>
