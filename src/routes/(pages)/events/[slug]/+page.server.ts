import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventNotFound, Events } from '$lib/services/Events';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const event = Events.getEvent(params.slug);
		return { event };
	} catch (err) {
		console.error(err);

		if (err instanceof EventNotFound) {
			return error(404);
		} else {
			return error(500);
		}
	}
};
