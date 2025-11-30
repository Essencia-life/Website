import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PageNotFound, Pages } from '$lib/services/Pages';

export const load: PageServerLoad = async ({ params }) => {
	try {
		return Pages.getPage(params.page);
	} catch (err) {
		console.error(err);

		if (err instanceof PageNotFound) {
			return error(404);
		} else {
			return error(500);
		}
	}
};
