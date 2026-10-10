import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess({
			postcss: true
		}),
	],
	kit: {
		adapter: adapter({
			images: {
				sizes:  [480, 768, 1024, 1920, 2560, 3840],
				formats: ['image/avif', 'image/webp'],
				minimumCacheTTL: 7 * 24 * 60 * 60,
				domains: [process.env.VERCEL_PROJECT_PRODUCTION_URL],
			}
		}),
		prerender: {
			handleEntryGeneratorMismatch: 'warn',
			handleHttpError: 'warn'
		}
	},
};

export default config;
