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
	import { LatLng } from '$lib/utils/latlng';

	let mapRef: google.maps.MapElement;
	let observer: IntersectionObserver;

	let loading = $state(true);

	onMount(() => {
		loading = true;

		observer = new IntersectionObserver(async ([entry]) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				observer.disconnect();

				await importLibrary('marker');
				await importLibrary('places');

				mapRef.innerMap.setOptions({
					backgroundColor: 'var(--brand-parchment-color)',
					disableDefaultUI: true
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
	center={new LatLng(37.241162694069175, -8.788955256741307)}
	zoom={10}
	class="absolute inset-0"
>
	{#if loading}
		<div class="absolute inset-0 flex items-stretch">
			<div style="margin: auto">Loading Google Maps</div>
		</div>
	{/if}

	<div class="widget-container" slot="control-block-end-inline-center">
		<gmp-place-details-compact
			orientation="HORIZONTAL"
			class="max-w-[calc(100vw - 4rem)] mb-8 w-112 scheme-light"
		>
			<gmp-place-details-place-request place="ChIJiSJsYkY_Gw0R7xII6XgQPU0"
			></gmp-place-details-place-request>
			<gmp-place-all-content></gmp-place-all-content>
		</gmp-place-details-compact>
	</div>

	<gmp-advanced-marker position={new LatLng(37.244036099999995, -8.7859634)}></gmp-advanced-marker>
</gmp-map>

<style>
	gmp-map {
		background: var(--brand-parchment-color);
	}
</style>
