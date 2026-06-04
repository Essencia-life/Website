<script lang="ts" module>
	import { browser } from '$app/environment';
	import { setOptions } from '@googlemaps/js-api-loader';

	if (browser) {
		setOptions({
			key: 'AIzaSyDGHnHScGXo1BsjYXxfvpHOvTij4VKROHY',
			v: 'weekly',
			language: 'en'
		});
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { importLibrary } from '@googlemaps/js-api-loader';

	let mapRef: google.maps.MapElement;
	let observer: IntersectionObserver;

	let loading = $state(true);

	onMount(() => {
		loading = true;

		observer = new IntersectionObserver(async ([entry]) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				observer.disconnect();

				const { MapTypeId } = await importLibrary('maps');
				await importLibrary('marker');
				await importLibrary('places');

				mapRef.innerMap.setOptions({
					backgroundColor: 'var(--brand-parchment-color)',
					mapTypeId: MapTypeId.TERRAIN,
					disableDefaultUI: true,
					scrollwheel: false
				});

				loading = false;
			}
		});

		observer.observe(mapRef);
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<gmp-map
	bind:this={mapRef}
	map-id="4f26b6a2d5047a295c2a62b8"
	center="37.241162694069175, -8.788955256741307"
	zoom="10"
>
	{#if loading}
		<div class="loading">
			<div style="margin: auto">Loading Google Maps</div>
		</div>
	{/if}

	<div class="widget-container" slot="control-inline-start-block-start">
		<gmp-place-details>
			<gmp-place-details-place-request place="ChIJiSJsYkY_Gw0R7xII6XgQPU0"
			></gmp-place-details-place-request>
			<gmp-place-all-content></gmp-place-all-content>
		</gmp-place-details>
	</div>

	<div class="widget-container" slot="control-block-end-inline-center">
		<gmp-place-details-compact orientation="horizontal">
			<gmp-place-details-place-request place="ChIJiSJsYkY_Gw0R7xII6XgQPU0"
			></gmp-place-details-place-request>
			<gmp-place-all-content></gmp-place-all-content>
		</gmp-place-details-compact>
	</div>

	<gmp-advanced-marker position="37.244036099999995, -8.7859634"></gmp-advanced-marker>
</gmp-map>

<style>
	gmp-map {
		position: absolute;
		inset: 0;
		background: var(--brand-parchment-color);
	}

	.loading {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: stretch;
	}

	gmp-place-details {
		color-scheme: light;
		width: 400px;
		margin: 4rem;
		max-height: calc(100vh - 8rem - 18rem);
		overflow: auto;
	}

	gmp-place-details-compact {
		color-scheme: light;
		width: calc(100vw - 8rem);
		margin-bottom: 8rem;
	}

	@media screen and (width >= 800px) {
		gmp-place-details-compact {
			display: none;
		}
	}

	@media screen and (width < 800px) {
		gmp-place-details {
			display: none;
		}
	}
</style>
