import type { PageServerLoad } from './$types';
import { Events } from '$lib/server/Events';

export const prerender = false;

export const load: PageServerLoad = async () => {
	return {
		upcomingEvents: Events.getAllUpcoming(),
	};
};
