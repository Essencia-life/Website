import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = () => {
	redirect(308, `/events-and-retreats?filter=events`);
};
