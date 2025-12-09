import { events as eventsRaw } from '$lib/content/events.json';

interface EventRaw {
	type: string;
	title: string;
	slug: string;
	start: string;
	end: string;
	short_description: string;
	description: string;
	cover_image: string;
	tickets?: {
		label: string;
		price: number;
		available: number;
		link?: string;
	}[];
}

export interface Event extends Omit<EventRaw, 'type' | 'start' | 'end'> {
	type: 'event' | 'retreat';
	start: Date;
	end: Date;
}

const events: Event[] = eventsRaw.map((event) => ({
	...event,
	type: event.type === 'event' || event.type === 'retreat' ? event.type : 'event',
	start: new Date(event.start),
	end: new Date(event.end)
}));

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
		const event = events.find((it) => it.slug === slug);

		if (event) {
			return event;
		} else {
			throw new EventNotFound(slug);
		}
	}
}

export class EventNotFound extends Error {
	constructor(slug: string) {
		super(`Event ${slug} not found`);
	}
}
