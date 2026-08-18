import type { RequestHandler } from '../$types';
import { supportedProviders, outputHTML, getProviderCredentials, type Provider } from '$lib/server/cms-auth-utils';

const buildTokenRequest = (provider: Provider, code: string, origin: string): { url?: string; body?: any; error?: Response } => {
	const { clientId, clientSecret, hostname } = getProviderCredentials(provider);

	if (!clientId || !clientSecret) {
		return { error: outputHTML({ provider, error: 'OAuth app client ID or secret is not configured.', errorCode: 'MISCONFIGURED_CLIENT' }) };
	}

	if (provider === 'github') {
		return {
			url: `https://${hostname}/login/oauth/access_token`,
			body: { code, client_id: clientId, client_secret: clientSecret }
		};
	}

	if (provider === 'gitlab') {
		return {
			url: `https://${hostname}/oauth/token`,
			body: {
				code,
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'authorization_code',
				redirect_uri: `${origin}/callback`
			}
		};
	}

	return { error: outputHTML({ provider, error: 'Unknown provider', errorCode: 'UNKNOWN_PROVIDER' }) };
};

export const GET: RequestHandler = async ({ request: { url, headers } }) => {
	const { origin, searchParams } = new URL(url);
	const { code, state } = Object.fromEntries(searchParams);

	const [, provider, csrfToken] =
		headers.get('Cookie')?.match(/\bcsrf-token=([a-z-]+?)_([0-9a-f]{32})\b/) ?? [];

	if (!provider || !supportedProviders.includes(provider as any)) {
		return outputHTML({
			error: 'Your Git backend is not supported by the authenticator.',
			errorCode: 'UNSUPPORTED_BACKEND'
		});
	}

	if (!code || !state) {
		return outputHTML({
			provider,
			error: 'Failed to receive an authorization code. Please try again later.',
			errorCode: 'AUTH_CODE_REQUEST_FAILED'
		});
	}

	if (!csrfToken || state !== csrfToken) {
		return outputHTML({
			provider,
			error: 'Potential CSRF attack detected. Authentication flow aborted.',
			errorCode: 'CSRF_DETECTED'
		});
	}

	const tokenConfig = buildTokenRequest(provider as Provider, code, origin);

	if (tokenConfig.error) {
		return tokenConfig.error;
	}

	if (!tokenConfig.url || !tokenConfig.body) {
		return outputHTML({
			provider,
			error: 'Failed to build token request',
			errorCode: 'TOKEN_BUILD_FAILED'
		});
	}

	const tokenURL = tokenConfig.url;
	const requestBody = tokenConfig.body;

	let response;
	let token = '';
	let error = '';

	try {
		response = await fetch(tokenURL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	} catch {
		//
	}

	if (!response) {
		return outputHTML({
			provider,
			error: 'Failed to request an access token. Please try again later.',
			errorCode: 'TOKEN_REQUEST_FAILED'
		});
	}

	try {
		({ access_token: token, error } = await response.json());
	} catch {
		return outputHTML({
			provider,
			error: 'Server responded with malformed data. Please try again later.',
			errorCode: 'MALFORMED_RESPONSE'
		});
	}

	return outputHTML({ provider, token, error });
};