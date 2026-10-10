<script lang="ts">
	import { accommodations as accommodationsData } from '$lib/content/accommodations.json';
	import { Media } from '$lib/services/Media';
	import Image from '$lib/components/atoms/Image.svelte';

	// TODO: store scroll position in snapshot
</script>

<div class="accommodations">
	<!-- TODO: fine tune view -->
	{#each accommodationsData as accommodation (accommodation)}
		<div>
			<a href="/stay#{accommodation.name}" class="no-link">
				<Image
					src={Media.getFile(accommodation.photo)}
					alt=""
					loading="lazy"
					class="w-full h-auto aspect-square object-cover rounded-full"
					sizes="(max-width: 335px) 80vw, 268px"
				/>
			</a>
			<h3>{accommodation.headline}</h3>
			<p>
				{accommodation.short_description}
			</p>
			<a href="/stay#{accommodation.name}" class="button button-primary">
				{accommodation.button}
			</a>
		</div>
	{/each}
</div>

<style>
	.accommodations {
		display: grid;
		grid-template-columns: repeat(4, min(calc(300px - 2rem), 80vw));
		gap: max(2rem, 5vw);
		margin: 3rem auto;
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
			padding: 0 calc(15vw + 1rem);
			margin-inline: -1rem;
		}
	}

	.accommodations > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		scroll-snap-align: center;
		scroll-snap-stop: always;
	}

	.accommodations p {
		padding-inline: 0.5rem;
		text-align: justify;
	}

	.accommodations .button {
		margin-top: auto;
	}
</style>
