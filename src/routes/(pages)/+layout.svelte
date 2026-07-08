<script lang="ts">
	import type { LayoutProps } from './$types';
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';
	import { page } from '$app/state';

	let { children }: LayoutProps = $props();
</script>

<div class="page">
	<Header />

	<div class:page-content={!page.data.wideContent}>
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
