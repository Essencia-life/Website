import {
	Component as ReactComponent,
	type ComponentType as ReactComponentType
} from 'react';
import {
	mount,
	unmount,
	type Component as SvelteComponent,
	type ComponentProps as SvelteComponentProps
} from 'svelte';
import type { CustomPreviewTemplateProps } from '@sveltia/cms';

function extractEntryData(
	entry: CustomPreviewTemplateProps['entry']
): SvelteComponentProps<SvelteComponent> {
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
	} catch {
		// ignore
	}
	return entry;
}

export function svelteToReactWrapper<C extends SvelteComponent>(
	SvelteComponent: C,
	propName: string
): ReactComponentType<CustomPreviewTemplateProps> {
	return class SveltePreviewReactWrapper extends ReactComponent<CustomPreviewTemplateProps> {
		svelteInstance: Record<string, unknown> = {};
		svelteProps: { [propName: string]: unknown } = $state({ [propName]: undefined });

		updateState() {
			this.svelteProps[propName] = extractEntryData(this.props.entry);
		}

		componentDidMount() {
			this.updateState();

			this.svelteInstance = mount(SvelteComponent, {
				target: this.props.document.body,
				props: this.svelteProps
			});
		}

		componentDidUpdate() {
			this.updateState();
		}

		componentWillUnmount() {
			unmount(this.svelteInstance, { outro: false });
		}

		render() {
			return '';
		}
	};
}
