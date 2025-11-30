<script lang="ts">
	import homeData from '$lib/content/home.json';
	import { CirclePlay } from '@lucide/svelte';
	import { getContext, onMount } from 'svelte';
	import type { Overlays } from '$lib/overlays.svelte';
	import FullVideoDialog from '$lib/components/organisms/FullVideoDialog.svelte';
	import { page } from '$app/state';

	interface Props {
		visibilityChange(visible: boolean): void;
	}

	let heroRef: HTMLDivElement;
	let heroVideoRef: HTMLVideoElement;

	const overlays = getContext<Overlays<any>>('overlays');
	const { visibilityChange }: Props = $props();

	async function showFullVideo() {
		overlays.add({
			component: FullVideoDialog,
			props: {},
			backdrop: {
				color: 'rgba(0 0 0 / 80%)'
			}
		});
	}

	onMount(() => {
		const root = document.getElementById('parallax');

		const observer = new IntersectionObserver(
			([entry]) => {
				visibilityChange(entry.isIntersecting);
			},
			{
				root,
				threshold: 0.7
			}
		);

		observer.observe(heroRef);
	});

	$effect(() => {
		// FIXME: state overlays not in sync with overlays
		if (page.state.overlays && page.state.overlays.length > 0) {
			heroVideoRef.pause();
		} else {
			heroVideoRef.play();
		}
	});
</script>

<div class="hero" bind:this={heroRef}>
	<!-- TODO: animated avif if supported -->
	<!-- TODO: check for data saving flag  -->
	<video
		bind:this={heroVideoRef}
		muted
		autoplay
		loop
		playsinline
		src={homeData.hero.video.landscape}
		poster={homeData.hero.fallback_image.landscape}
	>
		<!-- TODO: differnt video sources? -->
		<!-- TODO: enhanced:img -->
		<img src={homeData.hero.fallback_image.landscape} alt="" />
	</video>
	<div class="overlay">
		<div class="content" style="margin-block: auto">
			<h2 class="slogan">{homeData.hero.slogan}</h2>
			<button class="button button-overlay" onclick={showFullVideo}>
				<CirclePlay />
				{homeData.hero.watch_button}
			</button>
		</div>
	</div>
</div>

<style>
	.hero {
		position: relative;
		height: 85vh;
		max-height: 818px;
	}

	.hero .overlay {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1) 300px);
	}

	.hero .slogan {
		color: #f8f6f2;
		font-size: 16rem;
		margin-bottom: 4rem;
	}

	.hero video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
