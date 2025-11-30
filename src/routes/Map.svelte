<script lang="ts" module>
	import { setOptions } from '@googlemaps/js-api-loader';
	import { browser } from '$app/environment';

	if (browser) {
		setOptions({
			key: 'AIzaSyDGHnHScGXo1BsjYXxfvpHOvTij4VKROHY',
			v: 'weekly',
			language: 'en'
		});
	}
</script>

<script lang="ts">
	import { importLibrary } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';

	let mapRef: HTMLDivElement;

	onMount(() => {
		// FIXME: vite HMR causes duplicate loading
		importLibrary('maps')
			.then(({ Map, MapTypeId, KmlLayer }) => {
				const map = new Map(mapRef, {
					backgroundColor: 'var(--brand-sagegrey-color)',
					mapTypeId: MapTypeId.SATELLITE,
					center: {
						lat: 37.241162694069175,
						lng: -8.788955256741307
					},
					zoom: 20,
					scrollwheel: false
				});

				const kmlLayer = new google.maps.KmlLayer({
					url: 'https://www.google.com/maps/d/kml?mid=1mPab28Iyxh1lhm7a9Iq29E4TdVKbYb0',
					map
				});
			})
			.catch((e) => {
				console.error(e);
				// do something
			});
	});
</script>

<div bind:this={mapRef}></div>

<style>
	div {
		position: absolute;
		inset: 0;
		background: var(--brand-sagegrey-color);
	}
</style>
