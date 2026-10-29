/**
 * Maps a Tally "FORM_RESPONSE" webhook payload of the "Add event/retreat to Website" form
 * to an entry of the CMS `events` collection (see `eventCollection` in Event.svelte).
 *
 * The output mirrors what Sveltia CMS writes in the editorial workflow: same JSON layout
 * (2 spaces, trailing newline, key order of the collection), same file locations and the
 * same commit message format as configured in /admin/+page.svelte.
 *
 * This module has no SvelteKit imports, so it can be tested in plain Node.
 */

export type TallyFile = {
	id: string;
	name: string;
	url: string;
	mimeType: string;
	size: number;
};

export type TallyField = {
	key: string;
	label: string;
	type: string;
	value: unknown;
};

export type TallyPayload = {
	eventId: string;
	eventType: string;
	createdAt: string;
	data: {
		responseId: string;
		submissionId: string;
		formId: string;
		fields: TallyField[];
	};
};

/** What already exists in the repository, used to avoid name collisions. */
export type RepoState = {
	/** All file paths on the base branch. */
	paths: Set<string>;
	/** Existing branch names, e.g. `cms/events/2026-11-07-weaving-waters`. */
	branches: Set<string>;
};

export type DraftFile =
	| { path: string; content: string }
	| { path: string; download: { url: string; mimeType: string; size: number } };

export type EventDraft = {
	submissionId: string;
	slug: string;
	branch: string;
	/** Commit message, also used as pull request title (like Sveltia CMS does). */
	message: string;
	files: DraftFile[];
	/** Things a reviewer should know, e.g. truncated texts. */
	warnings: string[];
};

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export const EVENT_FORM_ID = 'vG60WA';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const TIME_ZONE = 'Europe/Lisbon';
const CONTENT_DIR = 'src/lib/content/events';
const MEDIA_DIR = 'src/lib/assets/media';
const MAX_SHORT_DESCRIPTION = 300;
const MAX_ORGANIZER_DESCRIPTION = 100;
const MAX_SLUG_TITLE = 80;

// Question keys of the Tally form. Labels are not unique (the organizer blocks repeat
// "Photo", "Name", "Description"), so the keys are the reliable way to address fields.
const KEYS = {
	title: 'question_ED78vl',
	startDate: 'question_rLM2Go',
	startTime: 'question_4vVPAr',
	endDate: 'question_2vGO1e',
	endTime: 'question_jWAG5Q',
	shortDescription: 'question_xy594d',
	description: 'question_ZYrPvV',
	coverImage: 'question_NY18M0',
	bookingLink: 'question_qW1joO',
	infoLink: 'question_QYl8vY'
} as const;

const ORGANIZER_SLOTS = [
	{ photo: 'question_WYVlDe', name: 'question_9vj2pE', description: 'question_e2W9Kx' },
	{ photo: 'question_9vjp7Q', name: 'question_e2WKae', description: 'question_WYVD8N' }
] as const;

const IMAGE_TYPES: Record<string, string[]> = {
	'image/jpeg': ['jpg', 'jpeg'],
	'image/png': ['png'],
	'image/webp': ['webp']
};

export const isTallyPayload = (value: unknown): value is TallyPayload => {
	if (typeof value !== 'object' || value === null) return false;
	const payload = value as Partial<TallyPayload>;
	const data = payload.data;
	return (
		typeof payload.eventType === 'string' &&
		typeof data === 'object' &&
		data !== null &&
		typeof data.formId === 'string' &&
		typeof data.submissionId === 'string' &&
		Array.isArray(data.fields) &&
		data.fields.every(
			(field) =>
				typeof field === 'object' &&
				field !== null &&
				typeof field.key === 'string' &&
				typeof field.label === 'string' &&
				typeof field.type === 'string'
		)
	);
};

const isTallyFile = (value: unknown): value is TallyFile => {
	if (typeof value !== 'object' || value === null) return false;
	const file = value as Partial<TallyFile>;
	return (
		typeof file.name === 'string' &&
		typeof file.url === 'string' &&
		typeof file.mimeType === 'string' &&
		typeof file.size === 'number'
	);
};

const findField = (fields: TallyField[], key: string) => fields.find((field) => field.key === key);

const text = (fields: TallyField[], key: string): string => {
	const value = findField(fields, key)?.value;
	return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim() : '';
};

const fileValues = (fields: TallyField[], key: string): TallyFile[] => {
	const value = findField(fields, key)?.value;
	return Array.isArray(value) ? value.filter(isTallyFile) : [];
};

const truncate = (value: string, max: number, label: string, warnings: string[]): string => {
	if (value.length <= max) return value;
	warnings.push(`${label} was longer than ${max} characters (${value.length}) and was shortened.`);
	return value.slice(0, max).trimEnd();
};

const link = (value: string, label: string, warnings: string[]): string => {
	if (!value) return '';
	try {
		const url = new URL(value);
		if (url.protocol === 'https:' || url.protocol === 'http:') return value;
	} catch {
		// not a URL, handled below
	}
	warnings.push(`${label} is not a valid http(s) link and was dropped.`);
	return '';
};

export const slugify = (value: string): string =>
	value
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/['’‘`]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const slugifyFileName = (value: string): string =>
	value
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9._~-]+/g, '-')
		.replace(/^[-.]+|[-.]+$/g, '');

const pad = (value: number) => String(value).padStart(2, '0');

/** UTC offset of Europe/Lisbon at the given instant, in minutes. */
const lisbonOffsetMinutes = (utcMs: number): number => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: TIME_ZONE,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).formatToParts(new Date(utcMs));
	const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
	const wallAsUtc = Date.UTC(
		part('year'),
		part('month') - 1,
		part('day'),
		part('hour'),
		part('minute'),
		part('second')
	);
	return Math.round((wallAsUtc - utcMs) / 60_000);
};

/** Local Europe/Lisbon date and time to ISO with offset, as Sveltia writes it. */
export const toLisbonIso = (date: string, time: string, label: string) => {
	const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
	const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
	if (!dateMatch || !timeMatch) {
		throw new ValidationError(`${label}: invalid date or time (${date || '—'} ${time || '—'}).`);
	}
	const [year, month, day] = [Number(dateMatch[1]), Number(dateMatch[2]), Number(dateMatch[3])];
	const [hour, minute] = [Number(timeMatch[1]), Number(timeMatch[2])];
	const wall = Date.UTC(year, month - 1, day, hour, minute);
	const check = new Date(wall);
	if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
		throw new ValidationError(`${label}: ${date} is not a real date.`);
	}
	let utcMs = wall - lisbonOffsetMinutes(wall) * 60_000;
	utcMs = wall - lisbonOffsetMinutes(utcMs) * 60_000; // settle around DST changes
	const offset = lisbonOffsetMinutes(utcMs);
	const sign = offset < 0 ? '-' : '+';
	const absolute = Math.abs(offset);
	return {
		utcMs,
		iso: `${date}T${time}:00${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
	};
};

/** Checks the real file content, not just the type Tally claims. */
export const assertImageBytes = (bytes: Uint8Array, mimeType: string): void => {
	const at = (signature: number[], offset = 0) =>
		signature.every((value, index) => bytes[offset + index] === value);
	const valid =
		mimeType === 'image/jpeg'
			? at([0xff, 0xd8, 0xff])
			: mimeType === 'image/png'
				? at([0x89, 0x50, 0x4e, 0x47])
				: mimeType === 'image/webp'
					? at([0x52, 0x49, 0x46, 0x46]) && at([0x57, 0x45, 0x42, 0x50], 8)
					: false;
	if (!valid) throw new ValidationError('An uploaded file is not a valid JPEG, PNG or WebP image.');
};

/** Downloads an uploaded file from Tally. Never put the URL (it carries a token) in errors. */
export const downloadImage = async (file: {
	url: string;
	mimeType: string;
	size: number;
}): Promise<Uint8Array> => {
	const url = new URL(file.url);
	if (url.protocol !== 'https:' || url.hostname !== 'storage.tally.so') {
		throw new ValidationError('An uploaded file is not hosted on Tally.');
	}
	const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
	if (!response.ok) {
		throw new Error(`Could not download ${url.pathname} from Tally (${response.status}).`);
	}
	const bytes = new Uint8Array(await response.arrayBuffer());
	if (bytes.length > MAX_IMAGE_BYTES) {
		throw new ValidationError('An uploaded image is larger than 5 MB.');
	}
	assertImageBytes(bytes, file.mimeType);
	return bytes;
};

export const buildEventDraft = (payload: TallyPayload, taken: RepoState): EventDraft => {
	const fields = payload.data.fields;
	const warnings: string[] = [];
	const files: DraftFile[] = [];
	const claimed = new Set<string>();

	const type = fields.find((f) => f.type === 'HIDDEN_FIELDS' && f.label === 'type')?.value;
	if (type !== 'event' && type !== 'retreat') {
		throw new ValidationError(`Hidden field "type" must be "event" or "retreat", got ${JSON.stringify(type)}.`);
	}

	const required = (value: string, label: string): string => {
		if (!value) throw new ValidationError(`${label} is required.`);
		return value;
	};

	const title = required(text(fields, KEYS.title), 'Title');
	const startDate = text(fields, KEYS.startDate);
	const endDate = text(fields, KEYS.endDate) || startDate; // empty end date: same day
	const start = toLisbonIso(startDate, text(fields, KEYS.startTime), 'Start');
	const end = toLisbonIso(endDate, text(fields, KEYS.endTime), 'End');
	if (end.utcMs <= start.utcMs) {
		throw new ValidationError('End must be after start (for overnight events set an end date).');
	}

	const shortDescription = truncate(
		required(text(fields, KEYS.shortDescription), 'Short description'),
		MAX_SHORT_DESCRIPTION,
		'Short description',
		warnings
	);
	const description = required(text(fields, KEYS.description), 'Detailed description');

	const baseSlug = `${startDate}-${slugify(title).slice(0, MAX_SLUG_TITLE).replace(/-+$/, '') || type}`;
	let slug = baseSlug;
	for (
		let n = 2;
		taken.paths.has(`${CONTENT_DIR}/${slug}.json`) || taken.branches.has(`cms/events/${slug}`);
		n++
	) {
		slug = `${baseSlug}-${n}`;
	}
	if (slug !== baseSlug) warnings.push(`The name ${baseSlug} was already taken, so ${slug} is used.`);

	/** Reserves a collision-free repo path for an uploaded image and queues its download. */
	const addImage = (folder: string, file: TallyFile): string => {
		const extensions = IMAGE_TYPES[file.mimeType];
		if (!extensions) {
			throw new ValidationError(`Unsupported image type ${file.mimeType}. Please use JPEG, PNG or WebP.`);
		}
		if (file.size > MAX_IMAGE_BYTES) throw new ValidationError('An uploaded image is larger than 5 MB.');

		const dot = file.name.lastIndexOf('.');
		const originalExtension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : '';
		const extension = extensions.includes(originalExtension) ? originalExtension : extensions[0];
		const base = slugifyFileName(dot > 0 ? file.name.slice(0, dot) : file.name) || 'image';

		let name = `${base}.${extension}`;
		for (
			let n = 2;
			taken.paths.has(`${MEDIA_DIR}/${folder}/${name}`) || claimed.has(`${MEDIA_DIR}/${folder}/${name}`);
			n++
		) {
			name = `${base}-${n}.${extension}`;
		}
		const path = `${MEDIA_DIR}/${folder}/${name}`;
		claimed.add(path);
		files.push({
			path,
			download: { url: file.url, mimeType: file.mimeType, size: file.size }
		});
		return `/media/${folder}/${name}`;
	};

	const cover = fileValues(fields, KEYS.coverImage)[0];
	if (!cover) throw new ValidationError('Cover image is required.');
	const coverImage = addImage('events', cover);

	const organizers: { name: string; description: string; photo: string }[] = [];
	ORGANIZER_SLOTS.forEach((slot, index) => {
		const name = text(fields, slot.name);
		const organizerDescription = text(fields, slot.description);
		const photo = fileValues(fields, slot.photo)[0];
		if (!name && !organizerDescription && !photo) return;
		if (!name) {
			warnings.push(`Organizer ${index + 1} has no name and was skipped.`);
			return;
		}
		if (!photo) warnings.push(`Organizer ${index + 1} (${name}) has no photo.`);
		organizers.push({
			name,
			description: truncate(
				organizerDescription,
				MAX_ORGANIZER_DESCRIPTION,
				`Description of organizer ${index + 1}`,
				warnings
			),
			photo: photo ? addImage('events/organizer', photo) : ''
		});
	});

	// Same key order and shape as Sveltia CMS writes it.
	const entry = {
		type,
		start: start.iso,
		end: end.iso,
		recurrence: null,
		title,
		cover_image: coverImage,
		short_description: shortDescription,
		description,
		booking_link: link(text(fields, KEYS.bookingLink), 'Booking link', warnings),
		car_sharing_link: '', // not part of the form, to be generated by the webhook later
		info_link: link(text(fields, KEYS.infoLink), 'Information link', warnings),
		organizers
	};

	files.unshift({ path: `${CONTENT_DIR}/${slug}.json`, content: `${JSON.stringify(entry, null, 2)}\n` });

	const assetCount = files.length - 1;
	return {
		submissionId: payload.data.submissionId,
		slug,
		branch: `cms/events/${slug}`,
		message: `feat(Event): created “${slug}”${assetCount ? ` +${assetCount}` : ''}`,
		files,
		warnings
	};
};
