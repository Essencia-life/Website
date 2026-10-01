import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from './vite/plugins/imagetools.js';
// @ts-expect-error vite needs .ts extension for local plugins
import { previewCss } from './vite/plugins/cms-preview-css-plugin.ts';

export default defineConfig({
	ssr: {
		noExternal: ['rrule']
	},
	plugins: [tailwindcss(), imagetools(), sveltekit(), devtoolsJson(), previewCss()]
});
