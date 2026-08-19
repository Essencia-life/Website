import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import {
	supportedProviders,
	escapeRegExp,
	outputHTML,
	getProviderCredentials,
	type Provider
} from '$lib/server/cms-auth-utils';

const buildAuthURL = (
	provider: Provider,
	origin: string,
	csrfToken: string
): { url?: string; error?: Response } => {
	const { clientId, hostname } = getProviderCredentials(provider);

	if (!clientId) {
		return {
			error: outputHTML({
				provider,
				error: 'OAuth app client ID or secret is not configured.',
				errorCode: 'MISCONFIGURED_CLIENT'
			})
		};
	}

	if (provider === 'github') {
		const params = new URLSearchParams({
			client_id: clientId,
			scope: 'repo,user',
			state: csrfToken
		});
		return { url: `https://${hostname}/login/oauth/authorize?${params.toString()}` };
	}

	if (provider === 'gitlab') {
		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: `${origin}/callback`,
			response_type: 'code',
			scope: 'api',
			state: csrfToken
		});
		return { url: `https://${hostname}/oauth/authorize?${params.toString()}` };
	}

	return {
		error: outputHTML({ provider, error: 'Unknown provider', errorCode: 'UNKNOWN_PROVIDER' })
	};
};

export const GET: RequestHandler = async ({ request: { url } }) => {
	const { origin, searchParams } = new URL(url);
	const { provider, site_id: domain } = Object.fromEntries(searchParams);

	if (!provider || !supportedProviders.includes(provider as any)) {
		return outputHTML({
			error: 'Your Git backend is not supported by the authenticator.',
			errorCode: 'UNSUPPORTED_BACKEND'
		});
	}

	const ALLOWED_DOMAINS = (env as any).ALLOWED_DOMAINS;

	// Check if the domain is whitelisted
	if (
		ALLOWED_DOMAINS &&
		!ALLOWED_DOMAINS.split(/,/).some((str: string) =>
			// Escape the input, then replace a wildcard for regex
			(domain ?? '').match(new RegExp(`^${escapeRegExp(str.trim()).replace('\\*', '.+')}$`))
		)
	) {
		return outputHTML({
			provider,
			error: 'Your domain is not allowed to use the authenticator.',
			errorCode: 'UNSUPPORTED_DOMAIN'
		});
	}

	// Generate a random string for CSRF protection
	const csrfToken = globalThis.crypto.randomUUID().replaceAll('-', '');

	const authConfig = buildAuthURL(provider as Provider, origin, csrfToken);

	if (authConfig.error) {
		return authConfig.error;
	}

	if (!authConfig.url) {
		return outputHTML({
			provider,
			error: 'Failed to build authorization URL',
			errorCode: 'AUTH_URL_BUILD_FAILED'
		});
	}

	const authURL = authConfig.url;

	// Redirect to the authorization server
	return new Response('', {
		status: 302,
		headers: {
			Location: authURL,
			// Cookie expires in 10 minutes; Use `SameSite=Lax` to make sure the cookie is sent by the
			// browser after redirect
			'Set-Cookie':
				`csrf-token=${provider}_${csrfToken}; ` +
				`HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`
		}
	});
};
