<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Media } from '$lib/services/Media';

	interface Props {
		image: string;
		alt: string;
		lgRight: boolean;
		smBottom: boolean;
		children: Snippet;
	}

	const { image, alt, lgRight, smBottom, children }: Props = $props();
</script>

<section class="image-and-content" class:lg-right={lgRight} class:sm-bottom={smBottom}>
	<div class="image">
		<enhanced:img src={Media.getFile(image)} {alt} loading="lazy" />
	</div>

	<div class="content">
		{@render children()}
	</div>
</section>

<style>
	.image-and-content {
		display: flex;
		gap: 4rem;
		margin-bottom: 8rem;
	}

	@media screen and (width >= 800px) {
		.image-and-content.lg-right {
			flex-direction: row-reverse;
		}

		.image-and-content .image {
			position: relative;
			flex: 1 60%;
		}

		.image-and-content .content {
			flex: 1 40%;
		}

		enhanced\:img {
			position: absolute;
			object-fit: cover;
			max-width: 100%;
			max-height: 100%;
		}
	}

	@media screen and (width < 800px) {
		.image-and-content {
			flex-direction: column;
		}

		.image-and-content.sm-bottom {
			flex-direction: column-reverse;
		}

		enhanced\:img {
			max-width: 100vw;
			height: auto;
			margin-inline: -4rem;
		}
	}
</style>
