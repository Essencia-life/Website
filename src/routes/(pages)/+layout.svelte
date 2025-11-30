<script>
	import Header from '$lib/components/templates/Header.svelte';
	import Footer from '$lib/components/templates/Footer.svelte';

	let { children } = $props();
</script>

<div class="page">
	<Header />

	{@render children()}

	<Footer />
</div>

<style>
	.page {
		display: grid;
		min-height: 100%;
		grid-template-rows: auto 1fr auto;
	}
</style>
