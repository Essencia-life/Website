import { Pages } from '$lib/services/Pages';
import { VERCEL_URL, VERCEL_ENV } from '$env/static/private';

export interface Metadata {
	title: string;
	description?: string;
	cover?: string;
}

export const prerender = true;

export async function load({ url }) {
	return { VERCEL_URL, VERCEL_ENV, metadata: Pages.getPageMetadata(url.pathname) };
}
