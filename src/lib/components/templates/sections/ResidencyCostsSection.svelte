<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';
    
    export const residencyCostsSectionField = {
        name: 'residency-costs', 
        label: 'Residency Costs Section', 
        widget: 'object',
        fields: [
            {
                name: 'type',
                widget: 'hidden',
                default: 'residency-costs'
            },
            {
                name: 'costs',
                label: 'Costs',
                label_singular: 'Cost',
                widget: 'list',
                min: 2,
                fields: [
                    {
                        name: 'number',
                        label: 'Cost',
                        widget: 'number'
                    },
                    {
                        name: 'suffix',
                        label: 'Suffix',
                        required: false,
                    },
                    {
                        name: 'label',
                        label: 'Label'
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
        section: InferFieldsObject<typeof residencyCostsSectionField.fields>;
    }

    const { section }: Props = $props();

    const currencyFormat: Intl.NumberFormatOptions = { 
        style: 'currency', 
        currency: 'EUR', 
        maximumFractionDigits: 0
    };
</script>

<section class="dark py-8">
	<div class="page-content">
        <ul class="mb-8 flex flex-wrap gap-8 *:not-last:border-white/50 *:not-last:pr-8 md:*:not-last:border-r">
            {#each section.costs as cost}
                <li>
                    <b class="mb-1 block font-serif text-3xl leading-none font-bold">
                        {cost.number.toLocaleString('en', currencyFormat)}{#if cost.suffix}<span class="text-base">{cost.suffix}</span>{/if}
                    </b>
                    <i class="text-sm">{cost.label}</i>
                </li>
            {/each}
		</ul>

		<Markdown content={section.content} />
	</div>
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--brand-dark-section-color);
		color: var(--brand-stonewhite-color);
	}
</style>