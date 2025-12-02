<script lang="ts">
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

	// https://github.com/syntax-tree/mdast#nodes
	import type { Parent } from 'mdast';
	import { placeholderSyntax } from '$lib/utils/placeholder-syntax';
	import { placeholderFromMarkdown } from '$lib/utils/placeholder-from-markdown';
	import type { Snippet } from 'svelte';
	import { Media } from '$lib/services/Media';

	interface Props {
		content: string | Parent;
		placeholder?: Snippet<[string]>;
	}

	const { content, placeholder }: Props = $props();

	const contentModel = $derived(
		typeof content !== 'string'
			? content
			: fromMarkdown(content, {
					extensions: [frontmatter(['yaml']), placeholderSyntax()],
					mdastExtensions: [frontmatterFromMarkdown(['yaml']), placeholderFromMarkdown()]
				})
	);

	function hasOnlyPlaceholderChild(entry: Parent) {
		return entry.children.length === 1 && entry.children[0].type === 'placeholder';
	}
</script>

{#snippet childMarkdown(entry: Parent)}
	<Markdown content={entry} {placeholder} />
{/snippet}

{#each contentModel.children as entry (entry)}
	{#if entry.type !== 'yaml'}
		{#if entry.type === 'text'}
			{entry.value}
		{:else if entry.type === 'break'}
			<br />
		{:else if entry.type === 'heading'}
			<svelte:element this={'h' + entry.depth}>{@render childMarkdown(entry)}</svelte:element>
		{:else if entry.type === 'paragraph'}
			{#if hasOnlyPlaceholderChild(entry)}
				{@render childMarkdown(entry)}
			{:else}
				<p>{@render childMarkdown(entry)}</p>
			{/if}
		{:else if entry.type === 'thematicBreak'}
			<hr />
		{:else if entry.type === 'strong'}
			<strong>{@render childMarkdown(entry)}</strong>
		{:else if entry.type === 'emphasis'}
			<em>{@render childMarkdown(entry)}</em>
		{:else if entry.type === 'blockquote'}
			<blockquote>{@render childMarkdown(entry)}</blockquote>
		{:else if entry.type === 'link'}
			<a href={entry.url} title={entry.title}>{@render childMarkdown(entry)}</a>
		{:else if entry.type === 'list'}
			<svelte:element this={entry.ordered ? 'ol' : 'ul'}>
				{@render childMarkdown(entry)}
			</svelte:element>
		{:else if entry.type === 'listItem'}
			<li>{@render childMarkdown(entry)}</li>
		{:else if entry.type === 'inlineCode'}
			<code>{entry.value}</code>
		{:else if entry.type === 'code'}
			<pre>{entry.value}</pre>
		{:else if entry.type === 'image'}
			<figure>
				<enhanced:img src={Media.getFile(entry.url)} alt={entry.alt} loading="lazy" />
				{#if entry.title}
					<figcaption>{entry.title}</figcaption>
				{/if}
			</figure>
		{:else if entry.type === 'placeholder'}
			{#if placeholder}
				{@render placeholder(entry.value)}
			{:else}
				<code>{`{{${entry.value}}}`}</code>
			{/if}
		{:else}
			<pre>{JSON.stringify(entry, null, 2)}</pre>
		{/if}
	{/if}
{/each}
