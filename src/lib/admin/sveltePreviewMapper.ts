import React, { Component } from 'react';
import type { ComponentType } from 'react';
import { mount } from 'svelte';

// Svelte 5 component factory type: callable component (default export) or compiled with .mount
export type SvelteComponentConstructor<P = any> = (
	opts: { target: Element; props?: P }
) => {
	update?: (props: Partial<P> | (() => Partial<P>)) => void;
	set?: (props: Partial<P>) => void;
	destroy?: () => void;
};

function extractEntryData(entry: any): any {
	if (!entry) return entry;
	try {
		if (typeof entry.getIn === 'function') {
			const maybe = entry.getIn(['data']);
			if (maybe && typeof maybe.toJS === 'function') return maybe.toJS();
			if (entry.toJS) return entry.toJS().data ?? entry.toJS();
		}
		if (typeof entry.toJS === 'function') {
			const js = entry.toJS();
			return js.data ?? js;
		}
	} catch (e) {
		// ignore
	}
	return entry;
}

export function svelteToReactWrapper<P = any>(
	SvelteComponent: SvelteComponentConstructor<P>,
	propName: string = 'page'
): ComponentType<any> {
	return class SveltePreview extends Component<any> {
		containerRef: React.RefObject<HTMLDivElement>;
		svelteInstance: any | null = null;

		constructor(props: any) {
			super(props);
			this.containerRef = React.createRef<HTMLDivElement>();
		}

		mountSvelte(props: any) {
			const data = extractEntryData(props.entry);
			const svelteProps = { ...props, [propName]: data } as P & Record<string, unknown>;

			// Use official Svelte mount helper for consistent Svelte 5 behavior
			this.svelteInstance = mount(SvelteComponent as any, {
				target: this.containerRef.current as Element,
				props: svelteProps as P
			});
			}

		componentDidMount() {
			this.mountSvelte(this.props);
		}

		componentDidUpdate() {
			if (!this.svelteInstance) return;
			const data = extractEntryData(this.props.entry);
			const svelteProps = { ...this.props, [propName]: data } as Partial<P>;

			// Prefer update, then set/destroy patterns
			if (typeof this.svelteInstance.update === 'function') {
				try {
					this.svelteInstance.update(svelteProps);
				} catch (e) {
					try {
						this.svelteInstance.update(() => svelteProps);
					} catch (__) {
						// ignore
					}
				}
			} else if (typeof this.svelteInstance.set === 'function') {
				this.svelteInstance.set(svelteProps);
			} else if (typeof this.svelteInstance.updateProps === 'function') {
				// some compile targets
				this.svelteInstance.updateProps(svelteProps);
			}
		}

		componentWillUnmount() {
			if (this.svelteInstance) {
				if (typeof this.svelteInstance.destroy === 'function') {
					this.svelteInstance.destroy();
				} else if (typeof this.svelteInstance.$destroy === 'function') {
					this.svelteInstance.$destroy();
				} else if (typeof this.svelteInstance.teardown === 'function') {
					this.svelteInstance.teardown();
				}
				this.svelteInstance = null;
			}
		}

		render() {
			return React.createElement('div', { ref: this.containerRef });
		}
	} as unknown as ComponentType<any>;
}

export function registerSveltePreview<P = any>(
	registerPreviewTemplate: (name: string, comp: ComponentType<any>) => void,
	name: string,
	SvelteComponent: SvelteComponentConstructor<P>,
	propName: string = 'page'
) {
	const Comp = svelteToReactWrapper<P>(SvelteComponent, propName);
	registerPreviewTemplate(name, Comp);
}
