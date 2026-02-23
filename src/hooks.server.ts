import { type Handle, redirect } from '@sveltejs/kit';
import { constants } from 'node:http2';

const legacyPaths: Record<string, string> = {
	'/about-3': '/eco-village',
	'/kidstemple': '/eco-village/kids-temple',
	'/joinus': '/eco-village/join',
	'/journeys': '/healing-center',
	'/workshops': '/events',
	'/the-art-of-touch': '/events/2025-10-27-the-art-of-touch',
	'/copy-of-retreats': '/retreats',
	'/theembodiedvoice2026': '/retreats/2026-03-05-the-embodied-voice',
	'/autumn-yoga-retreat-with-ehud': '/retreats/2025-10-31-autum-yoga-retreat',
	'/the-embodied-woman-retreat': '/retreats/2025-10-07-the-embodied-woman-retreat',
	'/general-7': '/retreats/2025-09-06-harvest-of-the-heart'
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname in legacyPaths) {
		return redirect(constants.HTTP_STATUS_MOVED_PERMANENTLY, legacyPaths[event.url.pathname]);
	}

	return resolve(event);
};
