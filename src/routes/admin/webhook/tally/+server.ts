import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { redis } from '$lib/server/redis';

/**
 * PROBE endpoint for Tally webhooks.
 *
 * Purpose: find out what the payload of the "add event" Tally form looks like.
 * It verifies the signature, stores the raw payload in Redis for 24 hours
 * (inspect it in the Upstash data browser) and answers 200. It does NOT create
 * branches or pull requests yet.
 *
 * Setup:
 *  - Set `TALLY_SIGNING_SECRET` in the Vercel environment (any random string).
 *  - Use the same string as "Signing secret" when creating the webhook in Tally.
 *  - Webhook URL: https://<host>/admin/webhook/tally
 */

const MAX_BODY_BYTES = 256 * 1024;
const TTL_SECONDS = 24 * 60 * 60;

const signaturesMatch = (expected: string, received: string): boolean => {
	const a = Buffer.from(expected);
	const b = Buffer.from(received);
	return a.length === b.length && timingSafeEqual(a, b);
};

const sign = (secret: string, payload: string): string =>
	createHmac('sha256', secret).update(payload).digest('base64');

export const POST: RequestHandler = async ({ request }) => {
	const secret = env.TALLY_SIGNING_SECRET;

	if (!secret) {
		return json({ error: 'TALLY_SIGNING_SECRET is not configured.' }, { status: 500 });
	}

	const declaredLength = Number(request.headers.get('content-length') ?? 0);
	if (declaredLength > MAX_BODY_BYTES) {
		return json({ error: 'Payload too large.' }, { status: 413 });
	}

	const rawBody = await request.text();
	if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
		return json({ error: 'Payload too large.' }, { status: 413 });
	}

	const received = request.headers.get('tally-signature') ?? '';

	let parsed: unknown;
	try {
		parsed = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Invalid JSON.' }, { status: 400 });
	}

	// Tally signs the JSON payload; check the raw body first and fall back to the
	// re-serialised payload in case whitespace differs.
	const valid =
		received !== '' &&
		(signaturesMatch(sign(secret, rawBody), received) ||
			signaturesMatch(sign(secret, JSON.stringify(parsed)), received));

	if (!valid) {
		return json({ error: 'Invalid signature.' }, { status: 401 });
	}

	const key = `tally:webhook:${Date.now()}-${randomUUID().slice(0, 8)}`;

	await redis.set(
		key,
		{
			receivedAt: new Date().toISOString(),
			headers: Object.fromEntries(
				[...request.headers].filter(([name]) =>
					['content-type', 'user-agent'].includes(name) || name.startsWith('tally-')
				)
			),
			payload: parsed
		},
		{ ex: TTL_SECONDS }
	);

	console.log(`[tally-webhook] stored ${key}`);

	return json({ ok: true });
};
