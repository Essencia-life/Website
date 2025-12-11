<script lang="ts">
	import { accommodations as accommodationsData } from '$lib/content/accommodations.json';
	import { getContext } from 'svelte';
	import type { Overlays } from '$lib/overlays.svelte';
	import AccommodationDialog, {
		type Accommodation
	} from '$lib/components/organisms/AccommodationDialog.svelte';
	import { Media } from '$lib/services/Media.js';

	const overlays = getContext<Overlays<any>>('overlays');

	function showAccommodation(accommodation: Accommodation) {
		overlays.add({
			component: AccommodationDialog,
			props: { accommodation },
			backdrop: true
		});
	}

	// TODO: store scroll position in snapshot
</script>

<div class="accommodations">
	<!-- TODO: fine tune view -->
	{#each accommodationsData as accommodation}
		<div>
			<enhanced:img
				src={Media.getFile(accommodation.photo)}
				alt=""
				loading="lazy"
				onclick={() => showAccommodation(accommodation)}
			/>
			<h3>{accommodation.headline}</h3>
			<p>
				{accommodation.short_description}
			</p>
			<button onclick={() => showAccommodation(accommodation)} class="button button-primary"
				>{accommodation.button}</button
			>
		</div>
	{/each}
</div>

<style>
	.accommodations {
		display: grid;
		grid-template-columns: repeat(4, min(calc(300px - 8rem), 80vw));
		gap: 8rem;
		margin: 12rem 0;
		overflow-y: hidden;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
	}

	.accommodations::-webkit-scrollbar {
		display: none;
	}

	h3 {
		margin: 0;
	}

	@media screen and (width < 800px) {
		.accommodations {
			padding: 0 calc(10vw + 4rem);
			margin-inline: -4rem;
		}
	}

	.accommodations > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		scroll-snap-align: center;
		scroll-snap-stop: always;
	}

	.accommodations enhanced\:img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 100%;
	}

	.accommodations p {
		padding-inline: 2rem;
		text-align: justify;
	}

	.accommodations .button {
		margin-top: auto;
	}
</style>
