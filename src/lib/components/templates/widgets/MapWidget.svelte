<script lang="ts" module>
	import { browser } from '$app/environment';
	import { setOptions } from '@googlemaps/js-api-loader';

	import type { ObjectField } from '@sveltia/cms';

	export const mapWidgetField = {
		name: 'map',
		label: 'Map',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return mapWidgetField.name;
				}
			},
			{
				name: 'marker',
				label: 'Marker',
				widget: 'map',
				type: 'Point'
			},
			{
				name: 'placeId',
				label: 'Google Maps Place ID',
				widget: 'string',
				required: false
			},
		] as const
	} satisfies ObjectField;

	if (browser) {
		setOptions({
			key: 'AIzaSyDGHnHScGXo1BsjYXxfvpHOvTij4VKROHY',
			v: 'quarterly',
			language: 'en'
		});
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { importLibrary } from '@googlemaps/js-api-loader';
	import { LatLng } from '$lib/utils/latlng';
	import type { InferFieldsObject } from '$lib/types/cms-types';

	interface Props {
		widget: InferFieldsObject<typeof mapWidgetField.fields>;
	}

	const { widget }: Props = $props();

	const { coordinates } = JSON.parse(widget.marker);
	const coordinatesLatLng = new LatLng(...coordinates.reverse());

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
					backgroundColor: 'var(--color-stone-100)',
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

<div class="relative mb-50 min-h-128 overflow-hidden rounded-md">
	<gmp-map
		bind:this={mapRef}
		map-id="4f26b6a2d5047a295c2a62b8"
		center={coordinatesLatLng}
		zoom={10}
		class="absolute inset-0 bg-stone-100"
	>
		{#if loading}
			<div class="absolute inset-0 flex items-stretch">
				<div style="margin: auto">Loading Google Maps</div>
			</div>
		{/if}

		{#if widget.placeId}
			<div class="widget-container" slot="control-block-end-inline-center">
				<gmp-place-details-compact
					orientation="HORIZONTAL"
					class="max-w-[calc(100vw - 4rem)] mb-8 w-md scheme-light"
				>
					<gmp-place-details-place-request place={widget.placeId}></gmp-place-details-place-request>
					<gmp-place-all-content></gmp-place-all-content>
				</gmp-place-details-compact>
			</div>
		{/if}

		<gmp-advanced-marker position={coordinatesLatLng}></gmp-advanced-marker>
	</gmp-map>
</div>