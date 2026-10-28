<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const membershipSubscriptionsWidgetField = {
		name: 'membership-subscriptions',
		label: 'Membership Subscriptions',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return membershipSubscriptionsWidgetField.name;
				}
			},
			{
				name: 'subscriptions',
				label: 'Subscriptions',
				label_singular: 'Subscription',
				widget: 'list',
				collapsed: 'auto',
				min: 3,
				max: 3,
				fields: [
					{
						name: 'title',
						label: 'Title'
					},
					{
						name: 'price',
						label: 'Price per Month',
						widget: 'number',
						value_type: 'float'
					},
					{
						name: 'benefits',
						label: 'Benefits',
						widget: 'list',
						root: true,
						field: {
							name: 'benefit',
							label: 'Benefit'
						}
					},
					{
						name: 'button',
						label: 'Button',
						widget: 'object',
						fields: [
							{
								name: 'label',
								label: 'Label',
							},
							{
								name: 'link',
								label: 'Link',
							}
						]
					}
				]
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import Card from '$lib/components/organisms/Card.svelte';
	import Sun from '@lucide/svelte/icons/sun';
	import Droplet from '@lucide/svelte/icons/droplet';
	import Toilet from '@lucide/svelte/icons/toilet';
	import Trash from '@lucide/svelte/icons/trash';
	import type { LucideIcon } from '@lucide/svelte';

	interface Props {
		widget: InferFieldsObject<typeof membershipSubscriptionsWidgetField.fields>;
	}

	const { widget }: Props = $props();
</script>

<div class="grid gap-x-4 gap-y-12 md:grid-cols-3 items-center justify-center">
	{#each widget.subscriptions as subscription, index (subscription)}
		<article
			class="relative flex flex-col p-6 md:min-h-96 gap-4 rounded-lg border {index === 1 ? 'border-amber-500 bg-amber-50 md:min-h-106 md:py-11' : 'border-stone-100 bg-stone-50'}"
		>
			<h4>{subscription.title}</h4>
			<div class="flex items-baseline">
				<span class="font-serif font-bold text-4xl text-amber-900">{(subscription.price as number).toLocaleString('en', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</span>
				<span class="text-sm text-stone-500">/month</span>
			</div>
			{#if index === 1}
				<div class="absolute top-0 left-[50%] py-1 px-3 translate-[-50%] bg-amber-500 text-stone-50 text-xs font-serif font-medium uppercase rounded-[24px_8px_24px_8px]">Most popular</div>
			{/if}
			<ul class="list-[sparkle] pl-[1.2em] text-sm space-y-3 marker:text-amber-500">
				{#each subscription.benefits as benefit (benefit)}
					<li>{benefit}</li>
				{/each}
			</ul>
			<a href={subscription.button.link} class="button {index === 1 ? 'button-ambergold' : 'button-primary'} md:mt-auto mt-4 mr-auto">{subscription.button.label}</a>
		</article>
	{/each}
</div>

<style>
	@counter-style sparkle {
		system: cyclic;
		symbols: '\2726';
		suffix: ' ';
	}
</style>