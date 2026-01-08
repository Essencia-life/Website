<script lang="ts">
	import { enhance } from '$app/forms';
	import SiWhatsapp from '@icons-pack/svelte-simple-icons/icons/SiWhatsapp';
	import FormField from '$lib/components/molecules/FormField.svelte';
	import { page } from '$app/state';
	import { Media } from '$lib/services/Media';
	import Map from '$lib/components/atoms/Map.svelte';

	let topic = $derived(page.form?.topic ?? page.url.searchParams.get('topic'));
</script>

<div class="my-12 flex flex-col text-center">
	<h2 class="my-4!">Contact</h2>
	<h3 class="-order-1 m-0! text-xs! font-bold tracking-widest uppercase opacity-70">
		Get in Touch
	</h3>
	<p class="text-terra/80 mx-auto mb-5 max-w-md text-[1.1rem] leading-relaxed italic">
		We'd love to hear from you.
	</p>
	<p class="mx-auto mb-10 max-w-lg text-[0.95rem] leading-[1.8] opacity-80">
		Whether you're curious about residency, planning a visit, or just want to say hello — write to
		us and someone from the community will get back to you soon.
	</p>
</div>

{#if page.form?.success}
	<div class="mb-8 rounded-lg bg-green-100 p-4 text-green-800">
		<b>Thank you for your message!</b>
		<p>We will get back to you soon.</p>
	</div>
{:else}
	<form
		method="POST"
		action="/contact"
		use:enhance
		class="mb-8 gap-x-12 gap-y-4 lg:flex lg:flex-row-reverse"
	>
		<div class="flex flex-col items-center gap-8 p-4 text-center">
			<enhanced:img
				src={Media.getFile('media/photo_2026-04-09_14-21-55.jpg')}
				class="aspect-square w-86 justify-self-end object-cover drop-shadow-2xl/35"
				style="border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%"
			/>
			<p class="text-terra/70 max-w-[220px] text-[0.92rem] leading-relaxed italic">
				Real connection starts with a simple hello.
			</p>
		</div>

		<div class="flex flex-1 flex-col gap-4">
			<FormField label="Your Name" error={page.form?.invalid.name}>
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

			<FormField label="Your Email" error={page.form?.invalid.email}>
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

			<FormField label="Your Phone (optional)" error={page.form?.invalid.phone}>
				{#snippet children({ classes })}
					<input
						type="tel"
						name="phone"
						value={page.form?.phone ?? ''}
						class={classes}
						placeholder="What is your phone number?"
					/>
				{/snippet}
			</FormField>

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

			{#if topic === 'stay'}
				<div>
					<a href="https://wa.me/351911514554" target="_blank" class="button">
						<SiWhatsapp size={20} />
						Get in touch directly
					</a>
				</div>
			{/if}

			<FormField label="Your Message" error={page.form?.invalid.message} class="col-span-2">
				{#snippet children({ classes })}
					<textarea
						name="message"
						required
						class="min-h-40 {classes}"
						placeholder="Write your message here...">{page.form?.message ?? ''}</textarea
					>
				{/snippet}
			</FormField>

			<!-- TODO hidden captcha ? -->

			{#if page.form?.error}
				<div class="mb-8 rounded-lg bg-red-100 p-4 text-red-800">
					<p>There was an error submitting your message. Please try again later.</p>
				</div>
			{/if}

			<div>
				<button class="button button-primary">Submit</button>
			</div>
		</div>
	</form>
{/if}

<hr />

<div class="flex flex-col text-center">
	<h2 class="my-4!">On the land, near Aljezur.</h2>
	<h3 class="-order-1 m-0! text-xs! font-bold tracking-widest uppercase opacity-70">Find Us</h3>
</div>

<div class="relative mb-12 min-h-128 overflow-hidden rounded-md">
	<Map />
</div>
