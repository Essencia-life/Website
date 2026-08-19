<script lang="ts">
	import type { Event } from '$lib/services/Events';
	import type { Snippet } from 'svelte';

	interface Props {
		event: Event;
		children: Snippet;
	}

	const { event, children }: Props = $props();

	const text = $derived.by(() => {
		if (event.type === 'event') {
			if (isTonight(event.start)) {
				return 'Tonight';
			}
			if (isToday(event.start)) {
				return 'Today';
			}
			if (isTomorrow(event.start)) {
				return 'Tomorrow';
			}
		}

		if (event.type === 'retreat') {
			if (isNextWeek(event.start)) {
				return 'Next Week';
			}
		}
	});

	function isTonight(target: Date) {
		return isToday(target) && target.getHours() >= 18;
	}

	function isToday(target: Date) {
		return target.toDateString() === new Date().toDateString();
	}

	function isTomorrow(target: Date) {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		return target.toDateString() === tomorrow.toDateString();
	}

	function isNextWeek(target: Date) {
		const today = new Date();

		const mondayThisWeek = new Date(today);
		const day = (today.getDay() + 6) % 7;
		mondayThisWeek.setDate(today.getDate() - day);
		mondayThisWeek.setHours(0, 0, 0, 0);

		const startNextWeek = new Date(mondayThisWeek);
		startNextWeek.setDate(startNextWeek.getDate() + 7);

		const endNextWeek = new Date(startNextWeek);
		endNextWeek.setDate(endNextWeek.getDate() + 7);

		return target >= startNextWeek && target < endNextWeek;
	}
</script>

{#if text}
	<div class="relative overflow-hidden">
		{@render children()}
		<div
			class="absolute top-0 left-0 -rotate-45 bg-amber-400 px-6 py-1 text-center text-xs font-bold text-amber-900 shadow-md"
			style="transform-origin: bottom right; translate: -30% -100%"
		>
			{text}
		</div>
	</div>
{:else}
	{@render children()}
{/if}
