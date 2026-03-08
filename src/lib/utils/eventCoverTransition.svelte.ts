import { page } from '$app/state';
import { replaceState } from '$app/navigation';

export function storeLinkUrlInPageState(event: MouseEvent & { currentTarget: HTMLAnchorElement }) {
	// eslint-disable-next-line svelte/no-navigation-without-resolve
	replaceState(page.url, { clickedLinkUrl: event.currentTarget.href });
}

export function eventCoverTransitionName(linkUrl: string) {
	return page.state.clickedLinkUrl?.endsWith(linkUrl) ? 'event-cover' : '';
}
