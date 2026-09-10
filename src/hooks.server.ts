import { type Handle, redirect } from '@sveltejs/kit';
import { constants } from 'node:http2';
import { createHandle } from 'flags/sveltekit';
import { FLAGS_SECRET } from '$env/static/private';
import * as flags from '$lib/server/flags';
import { sequence } from '@sveltejs/kit/hooks';

const flagsHandle = createHandle({ secret: FLAGS_SECRET, flags });

const legacyPaths: Record<string, string> = {
	'/about-3': '/eco-village',
	'/kidstemple': '/eco-village/kids-temple',
	'/joinus': '/join-us',
	'/eco-village/join': '/join-us',
	'/journeys': '/healing-center',
	'/workshops': '/events',
	'/the-art-of-touch': '/events/2025-10-27-the-art-of-touch',
	'/copy-of-retreats': '/retreats',
	'/theembodiedvoice2026': '/retreats/2026-03-05-the-embodied-voice',
	'/autumn-yoga-retreat-with-ehud': '/retreats/2025-10-31-autum-yoga-retreat',
	'/the-embodied-woman-retreat': '/retreats/2025-10-07-the-embodied-woman-retreat',
	'/general-7': '/retreats/2025-09-06-harvest-of-the-heart'
};

const redirectHandle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname in legacyPaths) {
		return redirect(constants.HTTP_STATUS_MOVED_PERMANENTLY, legacyPaths[event.url.pathname]);
	}

	return resolve(event);
};

export const handle = sequence(flagsHandle, redirectHandle);