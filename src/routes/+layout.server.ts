import { VERCEL_ENV } from '$env/static/private';

export const prerender = true;

export async function load() {
	return { VERCEL_ENV };
}
