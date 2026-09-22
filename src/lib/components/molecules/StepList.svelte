<script lang="ts">
	interface Item {
		title: string;
		description: string;
	}

	interface Props {
		items: Item[];
	}

	const { items }: Props = $props();
</script>

<ol role="list" class="steps" style:--lg-columns={items.length}>
	{#each items as item (item)}
		<li>
			<div class="number"></div>
			<h4 class="my-4">{item.title}</h4>
			<p>{item.description}</p>
		</li>
	{/each}
</ol>

<style>
	.steps {
		display: grid;
	}

	@media (width >= 64rem) {
		.steps {
			grid-template-columns: repeat(var(--lg-columns), 1fr);
		}
	}

	.steps li {
		display: flex;
		flex-direction: column;
		counter-increment: steps;
		text-align: center;
		margin-top: 2rem;
	}

	.steps li .number {
		height: 2.5rem;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.steps li .number::before {
		content: '';
		position: absolute;
		inset: 50% 0 auto 0;
		border-bottom: 2px solid var(--color-stone-100);
	}

	.steps li .number::after {
		content: counter(steps);
		display: flex;
		align-items: center;
		justify-content: center;
		height: inherit;
		aspect-ratio: 1;
		border: 2px solid var(--color-stone-100);
		border-radius: 100%;
		background: var(--color-stone-50);
		font-family: Alegreya, serif;
		font-weight: 600;
		color: var(--color-olive-700);
		z-index: 1;
	}

	.steps li p {
		margin-inline: 16px;
	}
</style>
