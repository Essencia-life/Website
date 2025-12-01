<script lang="ts" module>
	import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

	let mapsLibrary: google.maps.MapsLibrary;

	async function getMapsLibrary() {
		if (!mapsLibrary) {
			console.log('getMapsLibrary called');
			setOptions({
				key: 'AIzaSyDGHnHScGXo1BsjYXxfvpHOvTij4VKROHY',
				v: 'weekly',
				language: 'en'
			});

			mapsLibrary = await importLibrary('maps');
		}

		return mapsLibrary;
	}
</script>

<script lang="ts">
	import { mount, onDestroy, onMount } from 'svelte';
	import MapPanel from '$lib/components/atoms/MapPanel.svelte';

	let mapRef: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					const { Map, MapTypeId, KmlLayer } = await getMapsLibrary();
					const map = new Map(mapRef, {
						backgroundColor: 'var(--brand-sagegrey-color)',
						mapTypeId: MapTypeId.SATELLITE,
						center: {
							// TODO use fit to bounds with padding instead
							lat: 37.241162694069175,
							lng: -8.788955256741307
						},
						zoom: 20,
						scrollwheel: false,
						streetViewControl: false,
						cameraControl: false,
						fullscreenControl: false,
						mapTypeControlOptions: {
							position: google.maps.ControlPosition.RIGHT_TOP
						}
					});

					const container = document.createElement('div');
					map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);
					mount(MapPanel, { target: container, props: { panel } });

					new KmlLayer({
						url: 'https://www.google.com/maps/d/kml?mid=1mPab28Iyxh1lhm7a9Iq29E4TdVKbYb0',
						map
					});

					observer.disconnect();
				}
			},
			{
				root: document.getElementById('parallax') // TODO use body for mobile
			}
		);

		observer.observe(mapRef);
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

{#snippet panel()}
	<div class="side-panel" style="--map-height: {mapRef?.clientHeight ?? 0}px">
		<h4>🚧️ Side Panel</h4>
		<p>
			Will have a toggle button group to switch between map marker, directions and property
			boundaries view.
		</p>
	</div>
{/snippet}

<div class="map" bind:this={mapRef}>
	<div class="loading">
		{@render panel()}
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

	.side-panel {
		background: var(--brand-stonewhite-color);
		border-radius: 4rem;
		box-shadow: rgba(0 0 0 / 50%) 3px 3px 6px;
		width: 400px;
		height: calc(var(--map-height, 100px) - 18rem);
		padding: 4rem;
		margin: 4rem 3rem;
		font-size: 4rem;
	}
</style>
