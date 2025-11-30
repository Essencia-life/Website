<script lang="ts">
	import { SiFacebook, SiInstagram, SiTelegram, SiYoutube } from '@icons-pack/svelte-simple-icons';
</script>

<!-- TODO: add hover animation https://dribbble.com/shots/26280182-Interactive-Social-Media-Section-Website-UI-Design -->
<!-- TODO: mobile view -->
<div class="social-media">
	<a
		href="https://www.instagram.com/essencia_natureretreat"
		target="_blank"
		class="instagram no-link"
	>
		<div class="icon">
			<SiInstagram size={30} />
		</div>
		<h4>Instagram</h4>
		<p>Follow us for community moments, stories and events</p>
	</a>
	<a href="https://t.me/essencia_natureretreat" target="_blank" class="telegram no-link">
		<div class="icon">
			<SiTelegram size={30} />
		</div>
		<h4>Telegram</h4>
		<p>Follow us for community moments, stories and events</p>
	</a>
	<!-- TODO: Youtube channel link -->
	<a href="https://youtube.com" target="_blank" class="youtube no-link">
		<div class="icon">
			<SiYoutube size={30} />
		</div>
		<h4>YouTube</h4>
		<p>Subscribe and don't miss our latest video content</p>
	</a>
	<a
		href="https://www.facebook.com/pg/essencianatureretreat"
		target="_blank"
		class="facebook no-link"
	>
		<div class="icon">
			<SiFacebook size={30} />
		</div>
		<h4>Facebook</h4>
		<p>Follow us for events and investor updates</p>
	</a>
</div>

<style>
	.social-media {
		display: grid;
		padding-block: 5vh;
		text-align: left;
	}

	.social-media > a {
		padding: 4rem;
		border-radius: 4rem;
		background: rgba(var(--brand-sandbeige-rgb) / 80%);
		color: inherit;
		text-decoration: none;
	}

	h4 {
		font-weight: 600;
		margin-block: 2rem;
	}

	p {
		font-size: 3rem;
	}

	.instagram {
		--social-media-brand-color: #ff0169;
	}

	.telegram {
		--social-media-brand-color: #26a5e4;
	}

	.youtube {
		--social-media-brand-color: #ff0000;
	}

	.facebook {
		--social-media-brand-color: #0866ff;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10rem;
		aspect-ratio: 1;
		color: #fff;
		border-radius: 3rem;
		background: var(--social-media-brand-color);
	}

	.instagram .icon {
		background: linear-gradient(72.44deg, #ff7a00 11.92%, #ff0169 51.56%, #d300c5 85.69%);
	}

	@media (hover: hover) {
		.social-media > a:hover {
			color: #fff;
			background: var(--social-media-brand-color);
		}

		.social-media > a:hover .icon {
			color: var(--social-media-brand-color);
			background: #fff;
		}
	}

	@media screen and (width < 800px) {
		.social-media {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 4rem;
		}
	}

	@media screen and (width >= 800px) {
		.social-media {
			grid-template-columns: repeat(4, 200px);
			gap: 10rem;
		}
	}
</style>
