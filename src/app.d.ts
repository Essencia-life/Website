// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			overlays?: string[];
		}
		// interface Platform {}
	}

	interface Window {
		CMS_MANUAL_INIT: boolean;
	}
}

export {};
