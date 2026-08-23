import type { EntryGenerator, PageServerLoad } from './$types';
import { PageCollectionNotFound, Pages } from '$lib/server/Pages';
import { error } from '@sveltejs/kit';
import { constants } from 'node:http2';

export const entries: EntryGenerator = () => {
	return Pages.getAllPaths();
};

export const load: PageServerLoad = async ({ params }) => {
	if (params.path === '(root)') {
		return error(constants.HTTP_STATUS_NOT_FOUND);
	}

	try {
		return {
			page: Pages.getPage(params.path)
		};
	} catch (err) {
		if (err instanceof PageCollectionNotFound) {
			return error(constants.HTTP_STATUS_NOT_FOUND);
		}

		throw err;
	}
};
