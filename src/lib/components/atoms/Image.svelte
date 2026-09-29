<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';
	import { dev } from '$app/environment';

	interface Props extends Omit<HTMLImgAttributes, 'src'> {
		src: Picture;
		widths?: string | number[];
		quality?: number;
		preload?: boolean;
	}

	function lqipToBackground(lqip) {
		return lqip[0] === '#' ? lqip : `url(data:image/webp;base64,${lqip}) no-repeat center/cover`
	}

	function srcsetVercel(src: string, widths: string | number[] = [], quality = 100) {
		if (typeof widths === 'string') {
			widths = widths
				.replaceAll(' ')
				.split(',')
				.map((x) => +x) as number[];
		}

		return widths
			.slice()
			.sort((a, b) => a - b)
			.map((width) => {
				let url = `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
				if (dev) url = `${src}#${url}`;
				return `${url} ${width}w`;
			})
			.join(', ')
	}

	const {
		src,
		widths = [480, 1024, 1920, 2560, 3840],
		width,
		height,
		preload,
		quality = 85,
		sizes,
		...restProps
	}: Props = $props();

	const { img } = $derived(src);

	const srcset = $derived(img?.src && srcsetVercel(img.src, widths, quality));
	const background = $derived(img?.lqip && lqipToBackground(img.lqip));
</script>

<svelte:head>
	{#if preload}
		<link as="image" rel="preload" fetchpriority="high" imagesizes={sizes} imagesrcset={srcset} />
	{/if}
</svelte:head>

<img
	width={width || img?.w}
	height={height || img?.h}
	style:background={background}
	{...restProps}
	{srcset}
	src={img?.src ?? src}
/>