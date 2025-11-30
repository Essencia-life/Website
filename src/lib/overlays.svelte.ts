import { browser } from '$app/environment';
import { pushState } from '$app/navigation';
import { page } from '$app/state';
import type { Component, ComponentProps } from 'svelte';

interface OverlayBackdropConfig {
	color: string;
}

export interface OverlayConfig<TComponent extends Component<any>> {
	component: TComponent;
	props: ComponentProps<TComponent>;
	backdrop?: boolean | OverlayBackdropConfig;
	escapeKey?: boolean;
}

export interface OverlayRef<TComponent extends Component<any>> {
	readonly id: string;
	config: Readonly<OverlayConfig<TComponent>>;
	result: Promise<unknown>;
	close(result?: unknown): void;
}

const defaultOverlayConfig: Omit<OverlayConfig<any>, 'component' | 'props'> = {
	backdrop: true,
	escapeKey: true
};

export class Overlays<TComponent extends Component<any>> {
	#overlays = new Set<OverlayRef<TComponent>>();

	constructor() {
		if (browser) {
			// TODO: run close after user navigated back without again navigating back
			// window.addEventListener('keyup', event => {
			//     if (event.key === 'Escape') {
			//         const dialogRef = Array.from(this.#overlays).pop();
			//         if (dialogRef?.config.escapeKey) {
			//             dialogRef.close();
			//         }
			//     }
			// });
		}
	}

	public get byId() {
		return Object.fromEntries(Array.from(this.#overlays).map((overlay) => [overlay.id, overlay]));
	}

	public add(overlayConfig: OverlayConfig<TComponent>): OverlayRef<TComponent> {
		const config = { ...defaultOverlayConfig, ...overlayConfig };

		let resultResolve: (value: unknown) => void;
		const result = new Promise((resolve) => (resultResolve = resolve));

		const overlay = {
			id: window.crypto.randomUUID(),
			config,
			result,
			close: (result: unknown) => {
				history.back();

				resultResolve(result);
				this.#overlays.delete(overlay);
			}
		};

		this.#overlays.add(overlay);

		pushState('', {
			overlays: page.state.overlays?.concat(overlay.id) || [overlay.id]
		});

		return overlay;
	}
}
