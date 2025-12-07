import { Pages } from '$lib/services/Pages';

export interface Metadata {
	title: string;
	description?: string;
	cover?: string;
}

export async function load({ url }) {
	return { metadata: Pages.getPageMetadata(url.pathname) };
}
