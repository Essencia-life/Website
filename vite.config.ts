import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
// @ts-ignore
import { previewCss } from './cms-preview-css-plugin.ts';

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit(), devtoolsJson(), previewCss()]
});
