<script lang="ts" module>
	import type { CollectionFile } from '@sveltia/cms';

	export const peopleCmsConfig: CollectionFile = {
		name: 'people',
		label: 'People of Essência',
		icon: 'location_home',
		file: 'src/lib/content/people.json',
		editor: { preview: false },
		fields: [
			{
				name: 'people',
				label: 'People',
				label_singular: 'Person',
				widget: 'list',
				collapsed: 'auto',
				fields: [
					{
						name: 'id',
						widget: 'compute',
						value: '{{uuid_short}}',
					},
					{
						name: 'name',
						label: 'Name'
					},
					{
						name: 'role',
						label: 'Main Role'
					},
					{
						name: 'status',
						label: 'Status',
						widget: 'select',
						options: ['Resident', 'Long-term volunteer']
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
						name: 'talents',
						label: 'Talents & Gifts',
						label_singular: 'Talent or Gift',
						widget: 'list',
						min: 1,
						max: 3,
						field: {
							name: 'talent',
							label: 'Talent or Gift'
						}
					},
					{
						name: 'video',
						label: 'Video',
						widget: 'file',
						// TODO cloudinary media library?
						accept: 'video/webm',
						required: false,
						choose_url: false,
					},
					{
						name: 'showHealingOffers',
						label: 'Show healing offers (if available)',
						widget: 'boolean',
						required: false,
						default: false,
					},
				]
			}
		]
	};
</script>

<script lang="ts">
	import data from '$lib/content/people.json';
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import { Media } from '$lib/services/Media';
	import { browser } from '$app/environment';
	import Image from '$lib/components/atoms/Image.svelte';

	const { people } = (data satisfies InferFieldsObject<typeof peopleCmsConfig>);

	// TODO finish polaroid flip animation and video display
	let flipped = $state<string | null>(null);
</script>

<div class="space-y-18 pb-8">
	{#each people as person (person.id)}
		<article class="grid md:grid-cols-[1fr_2fr] gap-16 items-center"
		class:odd:[&_.polaroid]:-rotate-2={flipped !== person.id}
		class:even:[&_.polaroid]:rotate-2={flipped !== person.id}>
			<div class="polaroid aspect-4/5 bg-white rounded p-4 mx-4 shadow-lg/30 text-center flex flex-col justify-between transition-transform duration-300 ease-in-out">
				<div class="relative">
					<Image
						src={Media.getFile(person.photo)}
						alt=""
						class="aspect-square object-cover"
						loading="lazy"
					/>
					{#if person.video && browser}
						<button class="icon-button bg-olive-800 text-white cursor-pointer absolute -bottom-2 -right-2" onclick={() => flipped = flipped ? null : person.id}>
							<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
								<path d="M8 5v14l11-7z" fill="currentColor" />
							</svg>
						</button>
					{/if}
				</div>
				<div>
					<strong class="font-serif text-xl italic">{person.name}</strong>
					<div class="text-stone-400 text-sm font-medium">{person.status}</div>
				</div>
			</div>
			<div>
				<h3 class="font-bold mb-1">{person.name}</h3>
				<i class="text-taupe-400 font-medium">{person.role}</i>
				<p class="my-8">{person.description}</p>
				<ul class="flex gap-2">
					{#each person.talents as talent (talent)}
						<li class="rounded-full border border-stone-200 bg-stone-100 px-2 py-1 text-sm">{talent}</li>
					{/each}
				</ul>
				{#if person.showHealingOffers}
					<div class="mt-6">
						<a href="/heal?practitioner={person.id}" class="button button-oceanteal">Discover {person.name}'s Healing Offers</a>
					</div>
				{/if}
			</div>
		</article>
	{/each}
</div>
