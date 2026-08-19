<script lang="ts">
	import type { LayoutProps } from './$types';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<div class="page">
	<Header />

	<div>
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
