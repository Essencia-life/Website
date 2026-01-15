<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="page">
	<Header />

	<div class="content">
		{@render children()}
	</div>

	<Footer />
</div>

<style>
	.page {
		display: grid;
		min-height: 100%;
		grid-template-rows: auto 1fr auto;
	}
</style>
