<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		primary: boolean;
	}

	const { children, href, primary, ...props }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class="button" class:button-primary={primary} {...props}>{@render children?.()}</a>
