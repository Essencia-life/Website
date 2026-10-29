import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
	EVENT_FORM_ID,
	ValidationError,
	buildEventDraft,
	downloadImage,
	isTallyPayload
} from '$lib/server/tallyEvent';
import { createEventPullRequest, loadRepoState } from '$lib/server/githubPullRequest';

/**
 * Webhook for the Tally form "Add event/retreat to Website".
 *
 * Every submission becomes a pull request in the same shape Sveltia CMS creates in the
 * editorial workflow, so it shows up on the board of /admin as "In Review".
 *
 * Environment:
 *  - TALLY_SIGNING_SECRET: the "Signing secret" of the webhook in Tally (any random string)
 *  - TALLY_GITHUB_TOKEN:   fine-grained GitHub token, see githubPullRequest.ts
 *
 * Webhook URL: https://<host>/admin/webhook/tally
 */

// Downloading images and talking to GitHub takes a few seconds.
export const config = { maxDuration: 60 };

const MAX_BODY_BYTES = 256 * 1024;

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

	if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
		return json({ error: 'Payload too large.' }, { status: 413 });
	}

	const rawBody = await request.text();
	if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
		return json({ error: 'Payload too large.' }, { status: 413 });
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Invalid JSON.' }, { status: 400 });
	}

	// Tally signs the JSON payload; check the raw body first and fall back to the
	// re-serialised payload in case whitespace differs.
	const received = request.headers.get('tally-signature') ?? '';
	const valid =
		received !== '' &&
		(signaturesMatch(sign(secret, rawBody), received) ||
			signaturesMatch(sign(secret, JSON.stringify(parsed)), received));

	if (!valid) {
		return json({ error: 'Invalid signature.' }, { status: 401 });
	}

	if (!isTallyPayload(parsed)) {
		return json({ error: 'Unexpected payload.' }, { status: 400 });
	}

	// Acknowledge (and ignore) everything that is not a response to the event form.
	if (parsed.eventType !== 'FORM_RESPONSE' || parsed.data.formId !== EVENT_FORM_ID) {
		return json({ ok: true, ignored: true });
	}

	try {
		const state = await loadRepoState();
		const draft = buildEventDraft(parsed, state);

		const downloads = new Map<string, Uint8Array>();
		for (const file of draft.files) {
			if ('download' in file) downloads.set(file.path, await downloadImage(file.download));
		}

		const pullRequest = await createEventPullRequest(state, draft, downloads);
		console.log(`[tally-webhook] ${draft.submissionId} -> ${draft.branch} ${pullRequest}`);
		return json({ ok: true, pullRequest });
	} catch (error) {
		if (error instanceof ValidationError) {
			// The submission stays in Tally; the form owner can fix and resend it there.
			console.warn(`[tally-webhook] ${parsed.data.submissionId} rejected: ${error.message}`);
			return json({ error: error.message }, { status: 422 });
		}
		console.error(`[tally-webhook] ${parsed.data.submissionId} failed`, error);
		return json({ error: 'Could not create the pull request.' }, { status: 500 });
	}
};
