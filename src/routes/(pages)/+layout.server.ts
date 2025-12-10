import { Pages } from '$lib/services/Pages';
import { VERCEL_URL } from '$env/static/private';

export interface Metadata {
	title: string;
	description?: string;
	cover?: string;
}

export async function load({ url }) {
	return { VERCEL_URL, metadata: Pages.getPageMetadata(url.pathname) };
}
