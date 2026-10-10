<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const heroSectionField = {
		name: 'hero',
		label: 'Hero Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return heroSectionField.name;
				}
			},
			{
				name: 'supline',
				label: 'Superline',
				hint: 'Is part of the headline but displayed above',
			},
			{
				name: 'headline',
				label: 'Headline'
			},
			{
				name: 'content',
				label: 'Content',
				widget: 'richtext'
			},
			{
				name: 'backgroundImage',
				label: 'Background image',
				hint: 'Choose horizontal image. It will be stretched to cover to whole section and display behind an overlay',
				widget: 'image',
				choose_url: false,
				required: false,
			},
			{
				name: 'button',
				label: 'CTA button',
				widget: 'object',
				required: false,
				fields: [
					{
						name: 'label',
						label: 'Label'
					},
					{
						name: 'link',
						label: 'Link'
					}
				] as const
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '../../molecules/Markdown.svelte';
	import Image from '$lib/components/atoms/Image.svelte';
	import { Media } from '$lib/services/Media.ts';

	interface Props {
		section: InferFieldsObject<typeof heroSectionField.fields>;
	}

	const { section }: Props = $props();

	function scrollToAnchor(event: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		const href = event.currentTarget.getAttribute('href');

		if (href?.startsWith('#')) {
			const anchorElm = document.getElementById(href.substring(1));

			if (anchorElm) {
				event.preventDefault();
				anchorElm.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}
</script>

<section class="relative flex flex-col justify-center items-center gap-4 px-4 py-16 text-center text-stone-50 bg-olive-800 scheme-dark min-h-96">
	{#if section.backgroundImage}
		<Image preload src={Media.getFile(section.backgroundImage)} class="absolute w-full h-full object-cover inset-0" fetchpolicy="high" sizes="100vw" />
		<div class="absolute inset-0 bg-linear-to-b from-50% from-olive-950/50 to-olive-950/95"></div>
	{/if}

	<div class="relative max-w-2xl">
		<h2 class="mb-4 text-stone-50">
			<sup class="top-0 mb-2 block">{section.supline}</sup>
			{section.headline}
		</h2>

		<Markdown content={section.content} />

		{#if section.button}
			<a class="button mt-10 button-outline" href={section.button.link} onclick={scrollToAnchor}>
				{section.button.label}
			</a>
		{/if}
	</div>
</section>