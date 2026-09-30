import type { Event } from '$lib/server/Events';
import { RRule } from 'rrule';
import type { InferCollectionType } from '$lib/types/cms-types';
import { eventCollection } from '$lib/components/templates/Event.svelte';

type EventRaw = InferCollectionType<typeof eventCollection>;

const eventTimeZone = 'Europe/Lisbon';

const partsFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: eventTimeZone,
	hourCycle: 'h23',
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
});

function tzOffset(date: Date): number {
	const p = Object.fromEntries(
		partsFormat.formatToParts(date).map((x) => [x.type, Number(x.value)])
	);
	const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	return asUTC - (date.getTime() - (date.getTime() % 1000));
}

const toFloating = (d: Date) => new Date(d.getTime() + tzOffset(d));

function fromFloating(f: Date): Date {
	const guess = new Date(f.getTime() - tzOffset(f));
	return new Date(f.getTime() - tzOffset(guess)); // zweiter Durchlauf korrigiert DST-Grenzen
}

export function transformEvent([slug, event]: [string, EventRaw]): Event {
	let start = new Date(event.start);
	let end = new Date(event.end);
	let frequency;

	if (event.recurrence) {
		const recurrenceOptions = Object.fromEntries(
			Object.entries(event.recurrence).filter(
				([, value]) =>
					value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)
			)
		);

		const duration = end.getTime() - start.getTime();

		const rrule = new RRule({
			dtstart: toFloating(end),
			...recurrenceOptions
		});

		const next = rrule.after(toFloating(new Date(Date.now() - duration)), true);

		if (next) {
			end = fromFloating(next);
			start = new Date(end.getTime() - duration);
		}
		frequency = rrule.toText();
	}

	return {
		...event,
		slug,
		type: event.type === 'event' || event.type === 'retreat' ? event.type : 'event',
		start,
		end,
		frequency,
	};
}