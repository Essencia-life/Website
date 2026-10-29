import { createSign } from 'node:crypto';

/**
 * JSON Web Token for authenticating as a GitHub App (RS256, valid for 10 minutes at most).
 * Kept free of SvelteKit imports so it can be tested in plain Node.
 * https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app
 */

const base64url = (value: string): string => Buffer.from(value).toString('base64url');

/**
 * Accepts the PEM as downloaded from GitHub, with literal `\n` instead of line breaks
 * (as some env editors store it) or base64 encoded (easiest for a multi-line value).
 */
export const readPrivateKey = (value: string): string => {
	const trimmed = value.trim();
	return trimmed.includes('BEGIN')
		? trimmed.replace(/\\n/g, '\n')
		: Buffer.from(trimmed, 'base64').toString('utf-8');
};

export const createAppJwt = (appId: string, privateKey: string, nowMs = Date.now()): string => {
	const now = Math.floor(nowMs / 1000);
	const unsigned = [
		base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
		// issued a minute in the past to allow for clock drift
		base64url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }))
	].join('.');

	return `${unsigned}.${createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64url')}`;
};
