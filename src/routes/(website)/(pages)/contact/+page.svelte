<script lang="ts">
	import type { PageProps } from './$types';
	import Page from '$lib/components/templates/Page.svelte';

	const { data }: PageProps = $props();
</script>

<Page page={data.page} />