<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const factsSectionField = {
		name: 'facts-section',
		label: 'Facts Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return factsSectionField.name;
				}
			},
			{
				name: 'facts',
				label: 'Facts',
				label_singular: 'Fact',
				widget: 'list',
				min: 2,
				fields: [
					{
						name: 'title',
						label: 'Title',
					},
					{
						name: 'suffix',
						label: 'Suffix',
						required: false
					},
					{
						name: 'subtitle',
						label: 'Subtitle'
					}
				]
			},
			{
				name: 'content',
				label: 'Content',
				widget: 'richtext'
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

	interface Props {
		section: InferFieldsObject<typeof factsSectionField.fields>;
	}

	const { section }: Props = $props();
</script>

<section class="dark py-8">
	<div class="page-content">
		<ul
			class="mb-8 flex flex-wrap gap-8 *:not-last:border-white/50 *:not-last:pr-8 md:*:not-last:border-r"
		>
			{#each section.facts as fact (fact)}
				<li>
					<b class="mb-1 block font-serif text-3xl leading-none font-bold">
						{fact.title}{#if fact.suffix}<span
								class="text-base">{fact.suffix}</span
							>{/if}
					</b>
					<i class="text-sm">{fact.subtitle}</i>
				</li>
			{/each}
		</ul>

		<Markdown content={section.content} />
	</div>
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--color-olive-800);
		color: var(--color-stone-50);
	}
</style>
