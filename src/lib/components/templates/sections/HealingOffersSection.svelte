<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const healingOffersSectionField = {
		name: 'healing-offers',
		label: 'Healing Offers Section',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return healingOffersSectionField.name;
				}
			},
			{
				name: 'offers',
				label: 'Offers',
				label_singular: 'Offer',
				widget: 'list',
				collapsed: 'auto',
				fields: [
					{
						name: 'title',
						label: 'Title'
					},
					{
						name: 'photo',
						label: 'Photo',
						widget: 'image',
						choose_url: false,
					},
					{
						name: 'description',
						label: 'Description',
						widget: 'text',
					},
					{
						name: 'categoryId',
						label: 'Category',
						widget: 'relation',
						collection: '_singletons',
						file: 'healing-categories',
						value_field: '{{categories.*.id}}',
						display_fields: ['categories.*.label']
					},
					{
						name: 'price',
						label: 'Price',
						widget: 'number',
						value_type: 'int',
					},
					{
						name: 'duration',
						label: 'Duration',
						maxlength: 20
					},
					{
						name: 'personId',
						label: 'Person',
						widget: 'relation',
						collection: '_singletons',
						file: 'people',
						value_field: '{{people.*.id}}',
						display_fields: ['{{people.*.name}}'],
						search_fields: ['{{people.*.name}}'],
						dropdown_threshold: 0,
					}
				]
			}
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import { categories } from '$lib/content/healing-categories.json';
	import { people } from '$lib/content/people.json';
	import Card from '$lib/components/organisms/Card.svelte';
	import { page } from '$app/state';
	import { Media } from '$lib/services/Media';
	import { goto } from '$app/navigation';
	import Image from '$lib/components/atoms/Image.svelte';

	interface Props {
		section: InferFieldsObject<typeof healingOffersSectionField.fields>;
	}

	const { section }: Props = $props();

	const peopleMap = new Map(people.map(({id, ...person}) => ([id, person])));

	const usedCategoryIds = $derived(Array.from(new Set(section.offers.map(offer => offer.categoryId))));
	const categoryMap = new Map(categories.map(({id, label}) => ([id, label])));
	const categoryItemClass = 'text-sm whitespace-nowrap rounded-full border border-stone-200 px-3 py-2 cursor-pointer';

	let filterCategoryId = $derived(page.url.searchParams.get('category'));
	let filterPersonId = $derived(page.url.searchParams.get('practitioner'));
	let filteredOffers = $derived(section.offers.filter(offer => !filterCategoryId || offer.categoryId === filterCategoryId));

	$effect(() => {
		if (filterCategoryId === '') {
			page.url.searchParams.delete('category');

			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(page.url.toString(), { keepFocus: true, noScroll: true, replaceState: true });
		}
	});
</script>

{#snippet offerCard(offer)}
	{@const person = peopleMap.get(offer.personId)}
	{@const categoryLabel = categoryMap.get(offer.categoryId)}
	{#if person && categoryLabel}
		<Card image={offer.photo}>
			{#snippet overlays()}
				<div class="absolute top-2 left-2 uppercase py-1 px-3 bg-olive-900/60 rounded-full text-white/80 text-xs font-medium">{categoryMap.get(offer.categoryId)}</div>
			{/snippet}
			<div class="flex flex-col gap-2 h-full">
				<div class="flex items-center gap-2 text-stone-600 text-sm">
					<Image src={Media.getFile(person.photo)} class="size-6 rounded-full"
												loading="lazy" />
					with {person.name}
				</div>
				<h4>{offer.title}</h4>
				<p>{offer.description}</p>
				<div class="flex justify-between items-center mt-auto py-2">
					<div class="font-serif font-semibold text-lg">{offer.price.toLocaleString('en', {
						style: 'currency',
						currency: 'EUR',
						maximumFractionDigits: 0
					})}</div>
					<div class="text-stone-600 text-sm">{offer.duration}</div>
				</div>
				<a href="/contact?topic=healing" class="button button-primary w-full justify-center">Book this session</a>
			</div>
		</Card>
	{/if}
{/snippet}

<section class="py-12">
	<form data-sveltekit-replacestate data-sveltekit-noscroll method="get" class="page-content flex flex-wrap gap-2 py-2 mb-12">
		{#if filterPersonId}
			<input type="hidden" name="practitioner" value={filterPersonId}>
		{/if}

		<button
			name="category"
			value={null}
			class={categoryItemClass}
			class:bg-olive-600={!filterCategoryId}
			class:text-stone-50={!filterCategoryId}
			class:border-transparent={!filterCategoryId}
			aria-pressed={!filterCategoryId}
		>
			All Offerings
		</button>

		{#each usedCategoryIds as categoryId (categoryId)}
			{@const categoryLabel = categoryMap.get(categoryId)}
			{#if categoryLabel}
				<button
					name="category"
					value={categoryId}
					class={categoryItemClass}
					class:bg-olive-600={filterCategoryId === categoryId}
					class:text-stone-50={filterCategoryId === categoryId}
					class:border-transparent={filterCategoryId === categoryId}
					aria-pressed={filterCategoryId === categoryId}
				>
					{categoryLabel}
				</button>
			{/if}
		{/each}
	</form>

	<div class="page-content">
		{#if filterPersonId}
			{@const person = peopleMap.get(filterPersonId)}
			{@const personOffers = filteredOffers.filter(offer => offer.personId === filterPersonId)}
			{@const otherOffers = filteredOffers.filter(offer => offer.personId !== filterPersonId)}
			<h3 class="mb-4">Offerings by {person.name}</h3>
			{#if personOffers.length}
				<div class="grid md:grid-cols-3 gap-6">
					{#each personOffers as offer (offer)}
						{@render offerCard(offer)}
					{/each}
				</div>
			{:else}
				<i class="text-stone-600">
					{#if filterCategoryId}
						{@const categoryLabel = categoryMap.get(filterCategoryId)}
						No offerings by {person.name} found in category "{categoryLabel}". Try to reset the filter.
					{:else}
						No offerings by {person.name} found.
					{/if}
				</i>
			{/if}
			{#if otherOffers.length}
				<hr>
				<h3 class="mb-4">Offerings by others</h3>
				<div class="grid md:grid-cols-3 gap-6">
					{#each otherOffers as offer (offer)}
						{@render offerCard(offer)}
					{/each}
				</div>
			{/if}
		{:else}
			<div class="grid md:grid-cols-3 gap-6">
				{#each filteredOffers as offer (offer)}
					{@render offerCard(offer)}
				{/each}
			</div>
		{/if}
	</div>
</section>