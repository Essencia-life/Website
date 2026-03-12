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

	let mapRef: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(async ([entry]) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				observer.disconnect();

				const { Map, MapTypeId, InfoWindow } = await importLibrary('maps');
				const { AdvancedMarkerElement } = await importLibrary('marker');
				const { Place } = await importLibrary('places');

				const map = new Map(mapRef, {
					mapId: '4f26b6a2d5047a295c2a62b8',
					backgroundColor: 'var(--brand-sagegrey-color)',
					mapTypeId: MapTypeId.TERRAIN,
					center: {
						lat: 37.241162694069175,
						lng: -8.788955256741307
					},
					zoom: 10,
					scrollwheel: false,
					disableDefaultUI: true
				});

				const place = new Place({
					id: 'ChIJiSJsYkY_Gw0R7xII6XgQPU0'
				});

				await place.fetchFields({
					fields: ['displayName', 'formattedAddress', 'location', 'googleMapsURI']
				});

				if (place.location) {
					const marker = new AdvancedMarkerElement({
						map,
						position: place.location,
						title: place.displayName
					});

					const infoWindow = new InfoWindow({
						headerDisabled: true,
						content: `
            <div style="max-width:240px">
              <strong>${place.displayName ?? 'Ort'}</strong><br>
              ${place.formattedAddress ?? ''}<br><br>
              <a href="${place.googleMapsURI}" target="_blank" rel="noopener">
                Open in Google Maps
              </a>
            </div>
          `
					});

					infoWindow.open({
						map,
						anchor: marker
					});

					map.setCenter(place.location);
				}
			}
		});

		observer.observe(mapRef);
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<div class="map" bind:this={mapRef}>
	<div class="loading">
		<div style="margin: auto">Loading Google Maps</div>
	</div>
</div>

<style>
	.map {
		position: absolute;
		inset: 0;
		background: var(--brand-sagegrey-color);
	}

	.loading {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: stretch;
	}
</style>
