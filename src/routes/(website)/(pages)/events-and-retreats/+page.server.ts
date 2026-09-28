import { env } from '$env/dynamic/private';
import type { Config } from '@sveltejs/adapter-vercel';
import { Events } from '$lib/server/Events';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const config: Config = {
	isr: {
		expiration: 24 * 60 * 60,
		bypassToken: env.BYPASS_TOKEN,
		allowQuery: ['filter']
	}
};

export const load: PageServerLoad = async ({ url }) => {
	let upcomingEvents, pastEvents;

	if (url.searchParams.get('filter') === 'retreats') {
		upcomingEvents = Events.getUpcomingRetreats();
		pastEvents = Events.getPastRetreats();
	}
	else if (url.searchParams.get('filter') === 'events') {
		upcomingEvents = Events.getUpcomingEvents();
		pastEvents = Events.getPastEvents();
	}
	else {
		upcomingEvents = Events.getAllUpcoming();
		pastEvents = Events.getAllPast();
	}

	return {
		upcomingEvents,
		pastEvents,
	};
};
