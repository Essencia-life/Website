import type { Config } from '@sveltejs/adapter-vercel';
import { error } from '@sveltejs/kit';
import { constants } from 'node:http2';
import { PageCollectionNotFound, Pages } from '$lib/server/Pages';
import type {PageServerLoad} from './$types';
import { env } from '$env/dynamic/private';

export const prerender = false;

export const config: Config = {
	isr: {
		expiration: 24 * 60 * 60,
		bypassToken: env.BYPASS_TOKEN,
		allowQuery: ['category', 'practitioner']
	}
};

export const load: PageServerLoad = async () => {
	try {
		return {
			page: Pages.getPage('heal')
		};
	} catch (err) {
		if (err instanceof PageCollectionNotFound) {
			return error(constants.HTTP_STATUS_NOT_FOUND);
		}

		throw err;
	}
};
