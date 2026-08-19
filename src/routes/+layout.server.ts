import { LegacyPages } from '$lib/services/LegacyPages';
import { VERCEL_PROJECT_PRODUCTION_URL, VERCEL_ENV } from '$env/static/private';

export interface Metadata {
	title: string;
	description?: string;
	cover?: string;
}

export async function load({ url, request }) {
	const saveDataHeader = request.headers.get('save-data');
	return {
		VERCEL_PROJECT_PRODUCTION_URL,
		VERCEL_ENV,
		metadata: LegacyPages.getPageMetadata(url.pathname),
		saveData: saveDataHeader === 'on'
	};
}
