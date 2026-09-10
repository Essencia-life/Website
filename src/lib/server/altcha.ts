import { create, deriveHmacKeySecret, randomInt, CappedMap } from 'altcha-lib/frameworks/sveltekit';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { env } from '$env/dynamic/private';
import { redis } from '$lib/server/redis';
import ms from 'ms';

const expiresIn = ms('10m');

export const altcha = create({
	// Verification HMAC secrets
	hmacSignatureSecret: env.HMAC_SECRET ?? 'secret',
	hmacKeySignatureSecret: await deriveHmacKeySecret(env.HMAC_SECRET ?? 'secret'),

	// Adjust challenge parameters
	createChallengeParameters: () => {
		return {
			algorithm: 'PBKDF2/SHA-256',
			// Adjust cost and counter depending on the algorithm
			cost: 5_000,
			counter: randomInt(5_000, 10_000),
			expiresAt: new Date(Date.now() + expiresIn)
		};
	},

	// Key derivation function for the selected algorithm
	deriveKey,

	// Use a cookie instead of form data to send the payload
	setCookie: {
		name: 'altcha',
		path: '/'
	},

	// In distributed environments, use Redis or another shared store
	store: {
		get(key: string) {
			return redis.get(`altcha-${key}`);
		},
		set(key: string) {
			return redis.set(`altcha-${key}`, 1, { ex: expiresIn });
		}
	}
});