<script module lang="ts">
	import type { ObjectField } from '@sveltia/cms';

	export const contactFormWidgetField = {
		name: 'contactForm',
		label: 'Contact Form',
		widget: 'object',
		fields: [
			{
				name: 'type',
				widget: 'hidden',
				get default() {
					return contactFormWidgetField.name;
				}
			},
			{
				name: 'image',
				label: 'Image',
				widget: 'image'
			},
			{
				name: 'caption',
				label: 'Caption',
				widget: 'string'
			},
			{
				name: 'successMessage',
				label: 'Success message',
				widget: 'richtext'
			},
			{
				name: 'errorMessage',
				label: 'Error message',
				widget: 'richtext'
			},
		] as const
	} satisfies ObjectField;
</script>

<script lang="ts">
	import type { InferFieldsObject } from '$lib/types/cms-types';
	import { enhance } from '$app/forms';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import { Media } from '$lib/services/Media';
	import Image from '$lib/components/atoms/Image.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Markdown from '$lib/components/molecules/Markdown.svelte';

	interface Props {
		widget: InferFieldsObject<typeof contactFormWidgetField.fields>;
	}

	const { widget }: Props = $props();

	let topic = $derived(page.form?.topic ?? page.data.topic);
	let altchaLoaded = $state('');
	let successMessageElm = $state<HTMLDivElement | undefined>();

	onMount(() => {
		if (page.data.useAltcha) {
			import('altcha').then(() => altchaLoaded = 'altcha');
		}
	});

	$effect(() => {
		if (page.form?.success && successMessageElm) {
			successMessageElm.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
</script>

{#if page.form?.success}
	<div class="mb-8 rounded-lg bg-olive-100 p-4 text-olive-800" bind:this={successMessageElm}>
		<Markdown content={widget.successMessage} />
	</div>
{:else}
	<form
		method="POST"
		action="/contact"
		use:enhance
		class="mb-8 gap-x-12 gap-y-4 lg:flex lg:flex-row-reverse"
	>
		<div class="flex flex-col items-center gap-8 p-4 text-center">
			<Image
				src={Media.getFile(widget.image)}
				class="aspect-square w-86 justify-self-end object-cover drop-shadow-2xl/35"
				style="border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%"
			/>
			<p class="text-terra/70 max-w-55 text-[0.92rem] leading-relaxed italic">
				{widget.caption}
			</p>
		</div>

		<div id="form" class="flex flex-1 flex-col gap-4">
			<FormField label="Topic">
				{#snippet children({ classes })}
					<select required name="topic" class={classes} bind:value={topic}>
						<option selected disabled>Why you approach us?</option>
						{#each page.data.topics as topicOption (topicOption.key)}
							<option value={topicOption.key}>{topicOption.label}</option>
						{/each}
					</select>
				{/snippet}
			</FormField>

			<FormField label="Your Name" error={page.form?.invalid?.name}>
				{#snippet children({ classes })}
					<input
						type="text"
						name="name"
						required
						value={page.form?.name ?? ''}
						class={classes}
						placeholder="Enter your name"
					/>
				{/snippet}
			</FormField>

			<FormField label="Your Email" error={page.form?.invalid?.email}>
				{#snippet children({ classes })}
					<input
						type="email"
						name="email"
						required
						value={page.form?.email ?? ''}
						class={classes}
						placeholder="Enter your Email address"
					/>
				{/snippet}
			</FormField>

			<FormField label="Your Phone (optional)" error={page.form?.invalid?.phone}>
				{#snippet children({ classes })}
					<input
						type="tel"
						name="phone"
						value={page.form?.phone ?? ''}
						class={classes}
						placeholder="Enter your phone number"
					/>
				{/snippet}
			</FormField>

			<FormField label="Your Message" error={page.form?.invalid?.message} class="col-span-2">
				{#snippet children({ classes })}
				<textarea
					name="message"
					required
					class="min-h-40 {classes}"
					placeholder="Write your message here...">{page.form?.message ?? ''}</textarea
				>
				{/snippet}
			</FormField>

			{#if page.data.useAltcha}
				<altcha-widget challenge="/altcha/challenge"></altcha-widget>
			{/if}

			{#if page.data.useAltchaFallback}
				<input name="text" autocomplete="off" class="absolute -left-full" aria-hidden="true" value={altchaLoaded} />
			{/if}

			{#if page.form?.error}
				<div class="mb-8 rounded-lg bg-rose-100 p-4 text-rose-800">
					<Markdown content={widget.errorMessage} />
				</div>
			{/if}

			<div>
				<button class="button button-primary">Submit</button>
			</div>
		</div>
	</form>
{/if}