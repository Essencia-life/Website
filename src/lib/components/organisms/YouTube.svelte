<script lang="ts">
	import type { HTMLIframeAttributes } from 'svelte/elements';

	interface Props extends HTMLIframeAttributes {
		id: string;
	}

	const { id, class: cssClass, ...restProps }: Props = $props();
</script>

<iframe
	src="https://www.youtube-nocookie.com/embed/{id}"
	{...restProps}
	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
	referrerpolicy="strict-origin-when-cross-origin"
	allowfullscreen
	class="border-0 {cssClass}"
></iframe>
