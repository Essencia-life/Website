<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const gofundmeWidgetField = {
		name: 'gofundme',
		label: 'Gofundme',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return gofundmeWidgetField.name;
				}
			},
			{
				name: 'projects',
				label: 'Project Links',
				widget: 'list',
				field: {
					name: 'link',
					label: 'Gofundme link',
				}
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import { page } from '$app/state';

	interface Props {
		widget: InferFieldsObject<typeof gofundmeWidgetField.fields>;
	}

	const { widget }: Props = $props();

	function onload() {
		console.log(window['gfmWidgetLoaded']);
		delete window['gfmWidgetLoaded'];
		console.log(window['gfmWidgetLoaded']);
	}
</script>

<svelte:head>
	<script defer src="https://www.gofundme.com/static/js/embed.js" {onload}></script>
</svelte:head>

{#snippet gofundmeIframe(link)}
	<iframe height="500" class="gfm-embed-iframe" width="100%" frameborder="0" scrolling="no" src="{link}/widget/large?utm_content={page.url.hostname}&amp;utm_medium=referral&amp;utm_source=widget#:~:tcm-regime=GDPR&amp;tcm-prompt=Hidden"></iframe>
{/snippet}

{#if widget.projects.length === 1}
	<div class="flex justify-center">
		<div class="max-w-120 w-full">
			{@render gofundmeIframe(widget.projects[0])}
		</div>
	</div>
{:else}
	<div class="grid gap-8 md:grid-cols-2">
		{#each widget.projects as project, index (index)}
			<div class="max-w-120 w-full mx-auto">
				{@render gofundmeIframe(project)}
			</div>
		{/each}
	</div>
{/if}
