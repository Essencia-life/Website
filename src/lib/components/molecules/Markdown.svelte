<script lang="ts">
	import Markdown from '$lib/components/molecules/Markdown.svelte';
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { frontmatter } from 'micromark-extension-frontmatter';
	import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

	// https://github.com/syntax-tree/mdast#nodes
	import type { Blockquote, Emphasis, Heading, Image, Link, List, ListItem, Paragraph, Parent, Strong } from 'mdast';
	import { placeholderSyntax } from '$lib/utils/placeholder-syntax';
	import { placeholderFromMarkdown } from '$lib/utils/placeholder-from-markdown';
	import type { Snippet } from 'svelte';
	import { Media } from '$lib/services/Media';


	interface SharedProps {
		placeholder?: Snippet<[string]>;
		headlineNode?: Snippet<[Heading, SharedProps]>;
		listNode?: Snippet<[List, SharedProps]>;
		listItemNode?: Snippet<[ListItem, SharedProps]>;
		paragraphNode?: Snippet<[Paragraph, SharedProps]>;
		imageNode?: Snippet<[Image, SharedProps]>;
		linkNode?: Snippet<[Link, SharedProps]>;
		blockquoteNode?: Snippet<[Blockquote, SharedProps]>;
		strongNode?: Snippet<[Strong, SharedProps]>;
		emphasisNode?: Snippet<[Emphasis, SharedProps]>;
	}

	interface Props {
		content: string | Parent;
		placeholder?: Snippet<[string]>;
		headlineNode?: Snippet<[Heading, SharedProps]>;
		listNode?: Snippet<[List, SharedProps]>;
		listItemNode?: Snippet<[ListItem, SharedProps]>;
		paragraphNode?: Snippet<[Paragraph, SharedProps]>;
		imageNode?: Snippet<[Image, SharedProps]>;
		linkNode?: Snippet<[Link, SharedProps]>;
		blockquoteNode?: Snippet<[Blockquote, SharedProps]>;
		strongNode?: Snippet<[Strong, SharedProps]>;
		emphasisNode?: Snippet<[Emphasis, SharedProps]>;
	}

	const { 
		content, 
		placeholder, 
		headlineNode = defaultHeadlineNode, 
		listNode = defaultListNode, 
		listItemNode = defaultListItemNode,
		paragraphNode = defaultParagraphNode,
		imageNode = defaultImageNode,
		linkNode = defaultLinkNode,
		blockquoteNode = defaultBlockquoteNode,
		strongNode = defaultStrongNode,
		emphasisNode = defaultEmphasisNode,
	}: Props = $props();

	const sharedProps: SharedProps = $derived({ 
		placeholder, 
		headlineNode, 
		listNode, 
		listItemNode,
		paragraphNode,
		imageNode,
		linkNode,
		blockquoteNode,
		strongNode,
		emphasisNode
	});

	const contentModel = $derived(
		typeof content !== 'string'
			? content
			: fromMarkdown(content, {
					extensions: [frontmatter(['yaml']), placeholderSyntax()],
					mdastExtensions: [frontmatterFromMarkdown(['yaml']), placeholderFromMarkdown()]
				})
	);

	function hasOnlyPlaceholderChild(node: Parent) {
		return node.children.length === 1 && node.children[0].type === 'placeholder';
	}
</script>

{#snippet childMarkdown(node: Parent)}
	<Markdown content={node} {...sharedProps} />
{/snippet}

{#snippet defaultHeadlineNode(node: Heading)}
	<svelte:element this={'h' + node.depth}>{@render childMarkdown(node)}</svelte:element>
{/snippet}

{#snippet defaultListNode(node: List)}
	<svelte:element this={node.ordered ? 'ol' : 'ul'}>{@render childMarkdown(node)}</svelte:element>
{/snippet}

{#snippet defaultListItemNode(node: ListItem)}
	<li>{@render childMarkdown(node)}</li>
{/snippet}

{#snippet defaultParagraphNode(node: Paragraph)}
	<p>{@render childMarkdown(node)}</p>
{/snippet}

{#snippet defaultImageNode(node: Image)}
	<figure>
		<enhanced:img src={Media.getFile(node.url)} alt={node.alt} loading="lazy" />
		{#if node.title}
			<figcaption>{node.title}</figcaption>
		{/if}
	</figure>
{/snippet}

{#snippet defaultLinkNode(node: Link)}
	<a href={node.url} title={node.title}>{@render childMarkdown(node)}</a>
{/snippet}

{#snippet defaultBlockquoteNode(node: Blockquote)}
	<blockquote>{@render childMarkdown(node)}</blockquote>
{/snippet}

{#snippet defaultStrongNode(node: Strong)}
	<strong>{@render childMarkdown(node)}</strong>
{/snippet}

{#snippet defaultEmphasisNode(node: Emphasis)}
	<em>{@render childMarkdown(node)}</em>
{/snippet}

{#each contentModel.children as node (node)}
	{#if node.type !== 'yaml'}
		{#if node.type === 'text'}
			{node.value}
		{:else if node.type === 'break'}
			<br />
		{:else if node.type === 'heading'}
			{@render headlineNode(node, sharedProps)}
		{:else if node.type === 'paragraph'}
			{#if hasOnlyPlaceholderChild(node)}
				{@render childMarkdown(node)}
			{:else}
				{@render paragraphNode(node, sharedProps)}
			{/if}
		{:else if node.type === 'thematicBreak'}
			<hr />
		{:else if node.type === 'strong'}
			{@render strongNode(node, sharedProps)}
		{:else if node.type === 'emphasis'}
			{@render emphasisNode(node, sharedProps)}
		{:else if node.type === 'blockquote'}
			{@render blockquoteNode(node, sharedProps)}
		{:else if node.type === 'link'}
			{@render linkNode(node, sharedProps)}
		{:else if node.type === 'list'}
			{@render listNode(node, sharedProps)}
		{:else if node.type === 'listItem'}
			{@render listItemNode(node, sharedProps)}
		{:else if node.type === 'inlineCode'}
			<code>{node.value}</code>
		{:else if node.type === 'code'}
			<pre>{node.value}</pre>
		{:else if node.type === 'image'}
			{@render imageNode(node, sharedProps)}
		{:else if node.type === 'placeholder'}
			{#if placeholder}
				{@render placeholder(node.value)}
			{:else}
				<code>{`{{${node.value}}}`}</code>
			{/if}
		{:else}
			<pre>{JSON.stringify(node, null, 2)}</pre>
		{/if}
	{/if}
{/each}

<style>
	p {
		margin-block: 1rem;
	}
</style>