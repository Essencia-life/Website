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
                default: 'hero'
            },
            {
                name: 'headline', 
                label: 'Headline'
            },
            {
                name: 'supline', 
                label: 'Superline',
                hint: 'Is display above the headline'
            },
            {
                name: 'content',
                label: 'Content',
                widget: 'richtext'
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
                    },
                ] as const
            },             
        ] as const
    } satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '../../molecules/Markdown.svelte';
    
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

<section class="dark flex flex-col items-center gap-4 px-4 py-16 text-center">
	<sup>{section.supline}</sup>
	<h2 class="mb-4">{section.headline}</h2>
	
    <Markdown content={section.content} />
    
    {#if section.button}
	    <a class="button mt-10" href={section.button.link} onclick={scrollToAnchor}>{section.button.label}</a>
    {/if}
</section>

<style>
	.dark {
		color-scheme: dark;
		background: var(--brand-dark-section-color);
		color: var(--brand-stonewhite-color);
	}

	.dark h2 {
		color: var(--brand-stonewhite-color);
	}

	.dark .button {
		border-color: var(--brand-stonewhite-color);
		color: var(--brand-stonewhite-color);
	}
</style>