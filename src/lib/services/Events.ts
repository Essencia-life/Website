import type { InferCollectionType } from '$lib/types/cms-types';
import { eventCollection } from '$lib/components/templates/Event.svelte';

// TODO move into $lib/server

type EventRaw = InferCollectionType<typeof eventCollection>;

export interface Event extends Omit<EventRaw, 'type' | 'start' | 'end'> {
	slug: string;
	type: 'event' | 'retreat';
	start: Date;
	end: Date;
}

const eventRegExp = new RegExp('/src/lib/content/events/(?<slug>[a-zA-Z0-9-]+)\\.json');
const eventsRaw = new Map(
	Object.entries(
		import.meta.glob<{ default: EventRaw }>('$lib/content/events/*.json', { eager: true })
	).map(([path, module]) => {
		return [path.match(eventRegExp)!.groups!.slug, module.default];
	})
);

function transformEvent([slug, event]: [string, EventRaw]): Event {
	return {
		...event,
		slug,
		type: event.type === 'event' || event.type === 'retreat' ? event.type : 'event',
		start: new Date(event.start),
		end: new Date(event.end)
	};
}

const events: Event[] = Array.from(eventsRaw.entries(), transformEvent);

// console.log(events);

const byDateIncrementing = (a: Event, b: Event) => a.start.getTime() - b.start.getTime();
const byDateDescending = (a: Event, b: Event) => b.start.getTime() - a.start.getTime();

export class Events {
	public static getUpcomingEvents() {
		return Events.getAllUpcoming().filter((it) => it.type === 'event');
	}

	public static getUpcomingRetreats() {
		return Events.getAllUpcoming().filter((it) => it.type === 'retreat');
	}

	public static getAllUpcoming() {
		return events.sort(byDateIncrementing).filter((event) => event.start.getTime() > Date.now());
	}

	public static getPastEvents() {
		return Events.getAllPast().filter((it) => it.type === 'event');
	}

	public static getPastRetreats() {
		return Events.getAllPast().filter((it) => it.type === 'retreat');
	}

	public static getAllPast() {
		return events.sort(byDateDescending).filter((event) => event.start.getTime() < Date.now());
	}

	public static getEvent(slug: string) {
		const event = eventsRaw.get(slug);

		if (event) {
			return transformEvent([slug, event]);
		} else {
			throw new EventNotFound(slug);
		}
	}

	public static getAllEventSlugs() {
		return Array.from(eventsRaw.entries())
			.filter(([, event]) => event.type === 'event')
			.map(([slug]) => ({ slug }));
	}

	public static getAllRetreatSlugs() {
		return Array.from(eventsRaw.entries())
			.filter(([, event]) => event.type === 'retreat')
			.map(([slug]) => ({ slug }));
	}
}

export class EventNotFound extends Error {
	constructor(slug: string) {
		super(`Event ${slug} not found`);
	}
}
