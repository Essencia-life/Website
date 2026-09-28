<script lang="ts">
	import Page from '$lib/components/templates/Page.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<Page page={data.page} />
