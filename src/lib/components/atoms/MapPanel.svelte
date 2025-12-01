<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		panel: Snippet;
	}

	const { panel }: Props = $props();
</script>

{@render panel()}
