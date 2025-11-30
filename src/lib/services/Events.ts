import { events } from '$lib/content/events.json';

export class Events {
	public static getUpcomingEvents() {
		return Events.getAllUpcoming().filter((it) => it.type === 'event');
	}

	public static getUpcomingRetreats() {
		return Events.getAllUpcoming().filter((it) => it.type === 'retreat');
	}

	public static getAllUpcoming() {
		return events.sort((a, b) => Date.parse(a.start) - Date.parse(b.start)); // TODO: add date filter
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
