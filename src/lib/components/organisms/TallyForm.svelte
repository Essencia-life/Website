<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		formId: string;
		formType?: string;
		title: string;
	}

	const { formId, formType, title }: Props = $props();

	const src = $derived.by(() => {
		const url = new URL(`https://tally.so/r/${formId}`);

		if (formType) {
			url.searchParams.set('form_type', formType);
		}

		return url.toString();
	});

	onMount(() => {
		Tally?.loadEmbeds();
	});
</script>

<svelte:head>
	<script async src="https://tally.so/widgets/embed.js"></script>
</svelte:head>

<iframe data-tally-src={src} loading="lazy" {title}></iframe>

<style>
	iframe {
		border: 0;
		width: 100%;
		height: 2000px;
		margin-left: -6rem;
	}
</style>
