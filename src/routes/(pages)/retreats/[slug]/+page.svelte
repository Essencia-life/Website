<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
</script>

<div class="content">
	<h2>🚧️ Retreat details</h2>
	<p>This page is under construction</p>
	<pre>{JSON.stringify(data.event, null, 2)}</pre>
</div>
