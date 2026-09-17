<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import homeData from '$lib/content/home.json';
	import heroVideoPoster from '$lib/assets/media/hero_fallback_inline.jpg?inline';

	interface Props {
		visibilityChange(visible: boolean): void;
	}

	let heroRef: HTMLDivElement;
	let heroVideoRef: HTMLVideoElement;

	const { visibilityChange }: Props = $props();

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				visibilityChange(entry.isIntersecting);
			},
			{
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
	<video
		bind:this={heroVideoRef}
		muted
		loop
		playsinline
		autoplay={!page.data.saveData}
		poster={heroVideoPoster}
		fetchpriority="high"
	>
		<source src="media/hero_m.webm" type="video/webm" media="(width < 460px)" />
		<source src="media/hero.webm" type="video/webm" />
		<source src="media/hero_m.mp4" type="video/mp4" media="(width < 460px)" />
		<source src="media/hero.mp4" type="video/mp4" />
	</video>
	<div class="overlay">
		<div class="page-content" style="margin-top: auto">
			<h2 class="slogan">{homeData.hero.slogan}</h2>
		</div>
	</div>
</div>

<style>
	.hero {
		position: relative;
		height: calc(100vh - 4.5rem);
	}

	@supports (height: 100svh) {
		.hero {
			height: calc(100svh - 4.5rem);
		}
	}

	@media screen and (width > 800px) {
		.hero {
			/* Max video height */
			max-height: 818px;
		}
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
		font-size: 3.5rem;
		font-weight: 400;
		margin-block: 0 9rem;
	}

	.hero video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
