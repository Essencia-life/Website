<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLLabelAttributes, 'children'> {
		label: string;
		error?: string;
		children: Snippet<[{ classes: string }]>;
	}

	const { label, error, children, ...labelProps }: Props = $props();
	const classes = $derived(
		`focus:ring-opacity-50 mt-1 block w-full rounded-md shadow-sm focus:ring ${
			error
				? 'border-red-400 focus:border-rose-500 focus:ring-rose-300'
				: 'border-gray-400 focus:border-olive-500 focus:ring-olive-300'
		}`
	);
</script>

<label {...labelProps}>
	<span>{label}</span>
	{@render children({ classes })}
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</label>
