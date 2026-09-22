<script lang="ts">
	interface Props {
		options: { value: string | null; label: string }[];
		value: string | null;
	}

	let { options = [], value = $bindable(null) }: Props = $props();
</script>

{#if options.length}
	<div class="rounded-full bg-gray-200 p-1 flex gap-1 text-sm">
		{#each options as option (option)}
			<label>
				<input type="radio" bind:group={value} value={option.value} class="hidden peer" />
				<div
					class="peer-checked:bg-olive-700 peer-checked:text-white px-3 py-1 rounded-full text-gray-800 cursor-pointer"
				>
					{option.label}
				</div>
			</label>
		{/each}
	</div>
{/if}