<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Footer from '$lib/components/templates/Footer.svelte';
	import Header from '$lib/components/templates/Header.svelte';
	import { titleSuffix } from '$lib/config';
</script>

<svelte:head>
	<title>{page.status ?? 'Error'} {titleSuffix}</title>
	<meta name="robots" content="noindex,follow" />
</svelte:head>

<div class="page">
	<Header />

	<div class="content error">
		{#if page.status === 404}
			<h2>404</h2>
			<h3>Page Not Found</h3>
			<p>
				The page you’re looking for has wandered off into nature.<br />
				Let’s guide you gently back <a href={resolve('/')}>home</a>.
			</p>
		{:else if page.status === 500}
			<h2>500</h2>
			<h3>Server Error</h3>
			<p>
				Something feels a little out of balance right now.<br />
				Please take a breath and try again soon — or return
				<a href={resolve('/')}>home</a>.
			</p>
		{:else}
			<h3>{page.error?.message}</h3>
		{/if}
	</div>

	<Footer />
</div>

<style>
	.page {
		display: grid;
		min-height: 100%;
		grid-template-rows: auto 1fr auto;
	}

	.error {
		margin: 10vh auto;
		text-align: center;
	}

	.error p {
		margin-top: 10rem;
	}
</style>
