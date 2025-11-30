import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PageNotFound, Pages } from '$lib/services/Pages';

export const load: PageServerLoad = async () => {
	try {
		return {
			...Pages.getPage('stay')
		};
	} catch (err) {
		console.error(err);

		if (err instanceof PageNotFound) {
			return error(404);
		} else {
			return error(500);
		}
	}
};
