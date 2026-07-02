<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		formId: string;
		title: string;
	}

	const { formId, title }: Props = $props();

	const src = $derived.by(() => {
		const url = new URL(
			`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`
		);

		return url.toString();
	});

	onMount(() => {
		Tally.loadEmbeds();
	});
</script>

<svelte:head>
	<script src="https://tally.so/widgets/embed.js"></script>
</svelte:head>

<iframe data-tally-src={src} loading="lazy" {title}></iframe>

<style>
	iframe {
		border: 0;
		width: 100%;
		height: 1000px;
	}
</style>
